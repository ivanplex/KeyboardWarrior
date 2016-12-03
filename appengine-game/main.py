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

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

class Excerpt(ndb.Model):
    id = ndb.IntegerProperty()
    passage = ndb.TextProperty()
    created_at = ndb.DateTimeProperty(auto_now_add)
    updated_at = ndb.DateTimeProperty(auto_now)
    source = ndb.StringProperty()

class RacerStats(ndb.Model):
    id = ndb.IntegerProperty()
    race_id = ndb.IntegerProperty()
    user_id = ndb.IntegerProperty()
    wpm = ndb.FloatProperty()
    wpm_percentile = ndb.FloatProperty()
    created_at = ndb.DateTimeProperty(auto_now_add)
    updated_at = ndb.DateTimeProperty(auto_now)

class Race(ndb.Model):
    id = ndb.IntegerProperty()
    excerpt_id = ndb.IntegerProperty()
    created_at = ndb.DateTimeProperty(auto_now_add)
    updated_at = ndb.DateTimeProperty(auto_now)

# [START main_page]
class MainPage(webapp2.RequestHandler):

    def post(self):
        self.response.write('LOL')

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
# [END main_page]

# [START app]
app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
# [END app]
