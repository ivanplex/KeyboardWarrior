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

class Generate(webapp2.RequestHandler):

    def get(self):

        for i in range(30, 130):
            result = urlfetch.fetch('http://www.seanwrona.com/typeracer/text.php?id=' + str(i))
            htmltree = lxml.html.fromstring(result.content)

            p_tags = htmltree.xpath('//p')
            p_content = [p.text_content() for p in p_tags]

            quote = p_content[0]
            source = p_content[1]

            print(str(i) + ' "' + quote + '" "' + source + '"')
            print(i);

            tempEx = models.Excerpt(passage = quote, source = source)
            tempEx.key = ndb.Key(models.Excerpt, i-30);
            tempEx.put()

class Load(webapp2.RequestHandler):
    def get(self):
        for i in range(0,100):
            tempEx = ndb.Key(models.Excerpt, i).get()
            print(str(i) + ' "' + tempEx.passage + '" "' + tempEx.source + '"');

# [START Leaderboard]
class Leaderboard(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        responseDict = dict()
        if user:
            query = Player.query(Player.user_id == user.user_id())
            player = query.fetch(1);
            responseDict["u"] = json.dumps(player[0].to_dict())
        else:

        PLAYERS_PER_PAGE = 10
        query = Player.query().order(-Player.wpm)
        leaders = query.fetch(PLAYERS_PER_PAGE)
        responseDict["lb"] = json.dumps(leaders.to_dict())
        self.response.write(responseDict)

# [START main_page]
class MainPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            nickname = user.nickname()
            logout_url = users.create_logout_url('/')
            greeting = 'Welcome, {}! (<a href="{}">sign out</a>)'.format(
                nickname, logout_url)
        else:
            login_url = users.create_login_url('/')
            greeting = '<a href="{}">Sign in</a>'.format(login_url)

        self.response.write(
            '<html><body>{}</body></html>'.format(greeting))

# [END main_page]

# [START change_player_name]
class Player(webapp2.RequestHandler):
    def post(self):
        user = users.get_current_user()

        if !user:
            self.redirect('/')
            return

        p = models.Player.get_by_user(models.Player, user)

        if !u:
            p = models.Player(nickname=user.nickname(), id=user.user_id())

        new_nickname = self.request.get("new_nickname", default_value="null")

        if new_nickname == "null" || len(new_nickname) <= 50:
            self.response.set_status(400, 'Unrecognised Media Type')
            self.response.out.write('{"status":"error"}')
            return

        p.nickname = new_nickname
        p.put()

        self.response.out.write('{"status":"success"}')

# [END main_page]

# [START play]
class Play(webapp2.RequestHandler):

    # game logic handled by POSTs
    def post(self):
        # check if user is authenticated
        user = users.get_current_user()

        # redirect user to login if not authenticated
        if user is None:
            self.redirect('/')
            return

        # player id and current time
        current_time = int(time.time())
        player_id = user.user_id()

        # initialise variables if they do not exist and persist in registry
        app = webapp2.get_app()

        current_room = app.registry.get('current_room')
        player_room = app.registry.get('player_room')

        players = app.registry.get('players')
        rooms = app.registry.get('rooms')

        # what is the current room we are filling up
        if not current_room:
            current_room = random.randrange(sys.maxint)
            app.registry['current_room'] = current_room

        # create an association between player and room
        if not player_room:
            player_room = {}
            app.registry['player_room'] = player_room

        # rooms existing in memory
        if not rooms:
            rooms = {}
            app.registry['rooms'] = rooms

        # players existing in memory
        if not players:
            players = {}
            app.registry['players'] = players

        # performs input santitation on content type -- we only accept JSON
        if self.request.headers.get('content_type') != 'application/json':
            self.response.set_status(400, 'Unrecognised Media Type')
            return

        # initialise empty object
        obj = None

        try:
            obj = json.loads(self.request.body)
        except ValueError, e:
            self.response.set_status(400, 'Invalid JSON')
            return

        # if we are here, the JSON is valid and we can proceed with checks
        if 'room_id' not in obj or 'timestamp' not in obj:
            self.response.set_status(400, 'Invalid Request Parameters')
            return

        # if the room_id is properly typed...
        room_id = obj.get('room_id')

        if isinstance(room_id, int):

            # user isn't in a room, allocate user to a room
            if room_id == -1:

                # if the player is already allocated to a room
                # we will not let the user quit the current game, stats will be affected :(
                if player_id in players:
                    self.response.set_status(403, 'Player Already In Room')
                    return

                room = None

                while room == None:
                    # test the current room for whether it is full or not
                    room = rooms.get(current_room)

                    # room doesn't exist, we create new
                    if room is None:
                        room = {}
                        room['players'] = []
                        room['start_time'] = -1
                        room['text'] = "Lorem Ipsum Shreya Agarawal"
                        room['source'] = "Boon Pek"

                        rooms[current_room] = room
                    
                    # check if room is full or start time has passed current time (TODO: fix/optimise)
                    if len(room['players']) == 5 or (room['start_time'] < current_time and room['start_time'] != -1):
                        # generate a random room ID, this will (very rarely) collide with a valid room or create a new room
                        current_room = random.randrange(sys.maxint)

                        # set the room to None
                        room = None
                    else:
                        # user is allowed to participate in the current room
                        player = {}

                        player['id'] = player_id
                        player['name'] = user.nickname()
                        player['words'] = 0
                        player['room'] = room_id

                        # add player to players
                        players[player_id] = player

                        # add the player to the current room
                        room['players'].append(player)

                        # tell update the start_time to 15 seconds from now
                        if (len(room['players'])) >= 3:
                            room['start_time'] = current_time + 15


            # user is in a game, we do game stuff
            else:
                room = rooms.get(room_id)

                # the room is gone, game is over?
                if room is None:
                    pass

                self.response.write('check if room is valid')
                # check that the user is in the room and that the room is not full

        else:

            self.response.set_status(400, 'Room_ID Must Be A Number')
            return


        # build the response json
        res = {}
        res['player_id'] = player_id
        res['room_id'] = current_room
        res['room'] = room

        self.response.write(json.dumps(res))


    def get(self):
        user = users.get_current_user()

        if user:
            nickname = user.user_id()
            logout_url = users.create_logout_url('/')
            greeting = 'Welcome, {}! (<a href="{}">sign out</a>)'.format(
                nickname, logout_url)
        else:
            login_url = users.create_login_url('/')
            greeting = '<a href="{}">Sign in</a>'.format(login_url)

        self.response.write(
            '<html><body>{}</body></html>'.format(greeting))

    def save(self):
        raceStats.put()
        CUR_PLAYER_WPM = 10; #TODO: get from game
        query = Player.query(Player.user_id == user.user_id())
        qPlayers = query.fetch(1)
        player = qPlayers[0]
        oldWPM = player.wpm
        newWPM = ((oldWPM*player.games_played)+CUR_PLAYER_WPM)/(player.games_played+1)
        player.wpm = newWPM
        player.put()

    def getRoomKey(self):
        race_key = race.put()
    def postRoom(self):
        var options = {
        "race_id" : race_key,
        "startTime" : race.created_at,
        "text" : race.text

        }

# [END play]

# [START app]
app = webapp2.WSGIApplication([
    ('/', MaisssnPage),
    ('/play', Play),
    ('/generate', Generate),
    ('/load', Load),
    ('/races/new', 'races.New'),
    ('/leaderboard', Leaderboard)
    ('/player', Player),
], debug=True)
# [END app]
