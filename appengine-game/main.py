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

        for i in range(1, 100):
            result = urlfetch.fetch('http://www.seanwrona.com/typeracer/text.php?id=' + str(i))
            htmltree = lxml.html.fromstring(result.content)

            p_tags = htmltree.xpath('//p')
            p_content = [p.text_content() for p in p_tags]

            quote = p_content[0]
            source = p_content[1]

            print(str(i) + ' "' + quote + '" "' + source + '"');

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
            # user quit previous game allocate to new room
            if room_id == -1:

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

                        rooms[current_room] = room
                    
                    # check if room is full or start time has passed current time (fix/optimise)
                    if len(room['players']) == 5 or (room['start_time'] < current_time and room['start_time'] != -1):
                        # generate a random room ID, we have to check if this exists in memory or not
                        current_room = random.randrange(sys.maxint)

                        # set the room to None
                        room = None
                    else:
                        # add the player to the current room
                        room['players'].append(player_id)

                        # tell update the start_time to 15 seconds from now
                        if (len(room['players'])) >= 3:
                            room['start_time'] = current_time + 15


            else:
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
# [END play]

# [START app]
app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/play', Play),
    ('/generate', Generate),
], debug=True)
# [END app]
