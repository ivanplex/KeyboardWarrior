#!/usr/bin/env python

# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START imports]
import os
import sys
import urllib
import json
import random
import time

from datetime import datetime

from google.appengine.api import urlfetch
from google.appengine.api import users
from google.appengine.ext import ndb
#from django.utils import simplejson as json

import races
import models

import jinja2
import webapp2
import lxml.html

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

# called to build the excerpts
class Generate(webapp2.RequestHandler):

    def get(self):
        for i in range(1, 21):
            result = urlfetch.fetch('http://www.seanwrona.com/typeracer/text.php?id=' + str(i + 30))
            htmltree = lxml.html.fromstring(result.content)

            p_tags = htmltree.xpath('//p')
            p_content = [p.text_content() for p in p_tags]

            # clear whitespace and then rebuild nicely
            quote = " ".join(p_content[0].strip().split())
            source = " ".join(p_content[1].strip().split())

            print(str(i) + ' "' + quote + '" "' + source + '"')

            tempEx = models.Excerpt(passage = quote, source = source)
            tempEx.key = ndb.Key(models.Excerpt, i);
            tempEx.put()

# test if the excerpts have been loaded correctly
class Load(webapp2.RequestHandler):
    def get(self):
        for i in range(0,100):
            tempEx = ndb.Key(models.Excerpt, i).get()
            print(str(i) + ' "' + tempEx.passage + '" "' + tempEx.source + '"');

# [START Leaderboard]
class Leaderboard(webapp2.RequestHandler):
    @classmethod
    def Global_Leaders(self,PLAYERS_PER_PAGE):
        user = users.get_current_user()
        if user:
            #query = models.Player.query(models.Player.key.id() == user.user_id())
            player = models.Player.get_by_user(user)
            #Return this as well if the current user stats is required
        query = models.Player.query().order(-models.Player.wpm)
        leaders = query.fetch(PLAYERS_PER_PAGE)
        return leaders
    @classmethod
    def Excerpt_Leaders(self, excerpt_id, PLAYERS_PER_PAGE):
        user = users.get_current_user()
        if user:
            races = models.Race.query(models.Race.excerpt_id == excerpt_id)
            if not races.get():
                return None
            racesIds = []
            for race in races.fetch():
                racesIds.extend([race.key.id()])
            racerStats = models.RacerStats.query(models.RacerStats.race_id.IN(racesIds), models.RacerStats.user_id == user.user_id()).order(-models.RacerStats.wpm)
            racerStats.fetch(1);
            #Return this as well if the current user stats is required
        races = models.Race.query(models.Race.excerpt_id == excerpt_id)
        if not races.get():
            return None
        racesIds = []
        for race in races.fetch():
            racesIds.extend([race.key.id()])
        racerStats = models.RacerStats.query(models.RacerStats.race_id.IN(racesIds)).order(-models.RacerStats.wpm)
        leaderStats = racerStats.fetch(PLAYERS_PER_PAGE)
        return Leaderboard.inject_nicknames(leaderStats)
    @classmethod
    def Users_Top(self, user_id, PLAYERS_PER_PAGE):
        racerStats = models.RacerStats.query(models.RacerStats.user_id==user_id).order(-models.RacerStats.wpm)
        topStats = racerStats.fetch(PLAYERS_PER_PAGE)
        return Leaderboard.inject_nicknames(topStats)
    @classmethod
    def inject_nicknames(self, stats):
        for stat in stats:
            player = models.Player.get_by_user_id(stat.user_id)
            _nickname = player.nickname
            stat.nickname = _nickname
        return stats


# [START main_page]
# handles the main page as well as templating prompting for login or play game
class MainPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        logout = users.create_logout_url('/')
        login = users.create_login_url('/')

        template_values = {
            'nickname': None,
            'logouturl': logout,
            'loginurl': login,
            'loggedin': False,
        }

        if user:
            player = models.Player.get_by_user(user)

            template_values['nickname'] = player.nickname
            template_values['loggedin'] = True
            template_values['leaders'] = Leaderboard.Global_Leaders(15)

        template = JINJA_ENVIRONMENT.get_template('web/index.html')
        self.response.write(template.render(template_values))

# [END main_page]

# [START change_player_name]
# allows the user to change their nicknames
class Player(webapp2.RequestHandler):
    def post(self):
        user = users.get_current_user()

        if not user:
            self.redirect('/')
            return

        p = models.Player.get_by_user(user)

        new_nickname = self.request.get("new_nickname", default_value="null")
        exists_in_db = not models.Player.get_by_nickname(new_nickname) == None

        if new_nickname == "null" or len(new_nickname) >= 50 or len(new_nickname) == 0 or exists_in_db:
            self.response.set_status(400, 'Unrecognised Media Type')
            self.response.out.write('{"status":"error"}')
            return

        p.nickname = new_nickname
        p.put()

        self.response.out.write('{"status":"success"}')

# [END change_player_name]

# [START play]
# main game logic
class Play(webapp2.RequestHandler):
    # how long a user has to be inactive to time out before game starts
    # allows the user to leave the game
    ROOM_TIMEOUT = 4

    # length of game and how long until game starts once we have enough players
    GAME_INTERVAL = 60
    WAIT_INTERVAL = 15

    # minimum and maximum players per lobby
    MIN_PLAYERS = 3
    MAX_PLAYERS = 5

    # constant to determine how many rooms in our system concurrently
    # we use an RNG to prevent concurrency issues with incrementing IDs
    MAX_ROOMS = 1000000

    # game logic handled by POSTs
    def post(self):
        # initialise variables if they do not exist and persist in registry
        app = webapp2.get_app()

        # current unix timestamp
        current_time = int(time.time())

        # store these in the app registry of webapp2
        current_room = app.registry.get('current_room')
        rooms = app.registry.get('rooms')

        # what is the current room we are filling up
        if current_room is None:
            current_room = random.randrange(self.MAX_ROOMS)
            app.registry['current_room'] = current_room

        # rooms existing in memory
        if rooms is None:
            rooms = {}
            app.registry['rooms'] = rooms

        """
        HOUSEKEEPING SECTION, I SUGGEST WE PROCESS/SAVE HERE INSTEAD OF WHEN THE GAME 'ENDS'
        called every time /play is posted to, and updates the entire game status
        """

        for _id in rooms.keys():
            _room = rooms[_id]

            # room has expired -- save logic and etc
            if current_time > _room['end_time'] and _room['end_time'] != -1:
                # remove the reference from the game
                del rooms[_id]

                # create and persist a race (for you to handle Sid, we have)
                # we need to create the race first to get the unique key
                race = models.Race(excerpt_id = _room['text_id'])
                race.start_time = datetime.fromtimestamp(_room['start_time'])
                race.end_time = datetime.fromtimestamp(_room['end_time'])
                race.put()

                # iterate over players in room -- the wpm is calculated here
                # we can create the racerstats here this way
                for _player in _room['players']:

                    # skip if player didn't really participate in the game
                    if _player['updated_at'] <= _room['start_time']:
                        continue

                    wpm = float(_player['words_done']) / float(_player['updated_at'] - _room['start_time']) * 60

                    accuracy = 0

                    words_typed = _player['words_done'] + _player['mistakes']
                    if words_typed != 0:
                        accuracy = float(_player['words_done']) / float(words_typed)

                    raceStats = models.RacerStats(race_id = race.key.id(), user_id = _player['id'], wpm = wpm, accuracy = accuracy)
                    raceStats.created_at = datetime.fromtimestamp(_room['start_time'])
                    raceStats.updated_at = datetime.fromtimestamp(_player['updated_at'])
                    raceStats.put()

                    ndb_player = models.Player.get_by_user_id(_player['id'])
                    ndb_player.wpm = ((ndb_player.wpm * ndb_player.games_played) + wpm) / (ndb_player.games_played + 1)
                    ndb_player.accuracy = ((ndb_player.accuracy * ndb_player.games_played) + accuracy) / (ndb_player.games_played + 1)
                    ndb_player.games_played = ndb_player.games_played + 1
                    ndb_player.put()

            # room hasn't started, we purge players which have not connected in a while
            elif _room['start_time'] > current_time or _room['start_time'] == -1:
                _idx = []
                _players = _room['players']

                # build indexes of players last updated before game start
                for i in range(len(_players)):
                    if _players[i]['updated_at'] + self.ROOM_TIMEOUT < current_time:
                        _idx.append(i)

                # if we have players to remove, we remove them
                if len(_idx) != 0:
                    # remove in reverse to prevent having to recompute new indexes
                    for i in reversed(_idx):
                        del _players[i]

                    # reset the room to not start if less than minimum players
                    if len(_players) < self.MIN_PLAYERS:
                        _room['start_time'] = -1
                        _room['end_time'] = -1


        """
        END HOUSEKEEPING SECTION
        """

        # check if user is authenticated
        user = users.get_current_user()

        # redirect user to login if not authenticated
        if user is None:
            self.redirect('/')
            return

        # player id
        player_id = user.user_id()

        # performs input santitation on content type -- we only accept JSON
        if self.request.headers.get('content_type') != 'application/json':
            self.response.set_status(400, 'Unrecognised Media Type')
            self.response.write('Unrecognised Media Type')
            return

        # initialise empty object
        obj = None

        try:
            obj = json.loads(self.request.body)
        except ValueError, e:
            self.response.write('Invalid JSON')
            return

        # if we are here, the JSON is valid and we can proceed with checks
        if 'room_id' not in obj or 'timestamp' not in obj:
            self.response.set_status(400, 'Invalid Request Parameters')
            self.response.write('Invalid Request Parameters')
            return

        # check if the time is properly typed
        user_time = obj.get('timestamp')

        if not isinstance(user_time, int):
            self.response.set_status(400, 'Timestamp must be a number')
            self.response.write('Timestamp must be a number')
            return

        # if the room_id is properly typed...
        room_id = obj.get('room_id')
        room = None

        if isinstance(room_id, int):

            # user isn't in a room, allocate user to a room
            if room_id == -1:

                while room is None:
                    # test the current room for whether it is full or not
                    room = rooms.get(current_room)

                    # room doesn't exist, we create new
                    if room is None:

                        # assign a random excerpt
                        excerpt = models.Excerpt.get_random_Excerpt()

                        room = {}
                        room['players'] = []
                        room['start_time'] = -1
                        room['end_time'] = -1
                        room['text_id'] = excerpt.key.id()
                        room['text'] = excerpt.passage
                        room['text_length'] = len(excerpt.passage.split())
                        room['text_source'] = excerpt.source
                        room['room_id'] = current_room

                        app.registry['current_room'] = current_room
                        rooms[current_room] = room

                    # check if room is full or start time has passed current time (TODO: fix/optimise)
                    if len(room['players']) == self.MAX_PLAYERS or (room['start_time'] < current_time and room['start_time'] != -1):
                        # generate a random room ID, this will (very rarely) collide with a valid room or create a new room
                        current_room = random.randrange(self.MAX_ROOMS)

                        # set the room to None
                        room = None
                    else:
                        userInRoom = False

                        # user is allowed to participate in the current room
                        player = {}

                        # if the user is in the current room then we tell them to buzz off
                        for player in room['players']:
                            if player['id'] == player_id:
                                userInRoom = True
                                break

                        if not userInRoom:
                            # user is allowed to participate in the current room
                            player = {}

                            ndb_player = models.Player.get_by_user(user)

                            player['id'] = ndb_player.key.id()
                            player['name'] = ndb_player.nickname
                            player['words_done'] = 0
                            player['mistakes'] = 0
                            player['updated_at'] = current_time

                            # add the player to the current room
                            room['players'].append(player)

                            # tell update the start_time to 15 seconds from now
                            if (len(room['players'])) >= self.MIN_PLAYERS:
                                room['start_time'] = current_time + self.WAIT_INTERVAL
                                room['end_time'] = room['start_time'] + self.GAME_INTERVAL

            # user is in a game, we do game stuff
            else:
                room = rooms.get(room_id)

                # room doesn't exist anymore, game over or invalid room?
                if room:
                    player = None

                    # check for matching player in room using ID
                    for _player in room['players']:
                        if _player['id'] == player_id:
                            player = _player
                            break

                    # user isn't in this room
                    if player is None:
                        self.response.set_status(403, 'Not In Room')
                        self.response.write('User Not In Room')
                        return

                    # game is going on -- started and hasn't ended
                    if current_time >= room['start_time'] and current_time < room['end_time']:
                        words_done = obj.get('words_done')
                        mistakes = obj.get('mistakes')

                        words_length = room['text_length']

                        # we don't have words done in this request...
                        if words_done is None:
                            self.response.set_status(400, 'Words Done Not In Request')
                            self.response.write('Unable to find Words Done')
                            return

                        if words_done < 0 or words_done > words_length:
                            self.response.set_status(400, 'Invalid Words Done Do Not Cheat')
                            self.response.write('Words Done Is Not Valid')
                            return

                        if mistakes is None:
                            self.response.set_status(400, 'Mistakes Not In Request')
                            self.response.write('Unable to find Mistakes')
                            return

                        if mistakes < 0:
                            self.response.set_status(400, 'Invalid Mistakes Done Do Not Cheat')
                            self.response.write('Mistakes Is Not Valid')
                            return

                        # update the users :D only if words_done has changed
                        if words_done > player['words_done'] or mistakes > player['mistakes']:
                            player['words_done'] = words_done
                            player['updated_at'] = current_time
                            player['mistakes'] = mistakes

                    # we want to keep player ping even though game hasn't started
                    elif current_time < room['start_time'] or room['start_time'] == -1:
                        player['updated_at'] = current_time

        else:
            self.response.set_status(400, 'Room_ID Must Be A Number')
            self.response.write('RoomID NaN')
            return

        # build the response json
        res = {}
        res['player_id'] = player_id
        res['timestamp'] = current_time
        res['room'] = room

        self.response.write(json.dumps(res))

# [END play]

# [START get_final_leaderboards]
class Finished(webapp2.RequestHandler):
    def post(self):
        user = users.get_current_user()

        # if not user:
        #     self.redirect('/')
        #     return

        excerpt = self.request.get("excerpt", default_value="10")

        template_values = {}

        template_values['excerpt_leaders'] = Leaderboard.Excerpt_Leaders(int(excerpt),15)
        template_values['users_top'] = Leaderboard.Users_Top(user.user_id(),15)

        template = JINJA_ENVIRONMENT.get_template('templates/leaderboard.html')

        self.response.write(template.render(template_values))
# [END get_final_leaderboards]

# [START app]
# app routes handling
app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/play', Play),
    ('/generate', Generate),
    ('/load', Load),
    ('/player', Player),
    ('/finished', Finished),
], debug=True)
# [END app]
