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
import urllib
import json

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

# [START play]
class Play(webapp2.RequestHandler):

    # game logic handled by POSTs
    def post(self):
        # performs input santitation on content type -- we only accept JSON
        if self.request.headers.get('content_type') != 'application/json':
            self.response.set_status(400)
            return

        # initialise empty object
        obj = None

        try:
            obj = json.loads(self.request.body)
        except ValueError, e:
            self.response.set_status(400)
            return

        print('we are here')

        self.response.write(json.dumps(obj))

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
    ('/', MainPage),
    ('/play', Play),
    ('/generate', Generate),
    ('/load', Load),
    ('/races/new', 'races.New'),
    ('/leaderboard', Leaderboard)
], debug=True)
# [END app]
