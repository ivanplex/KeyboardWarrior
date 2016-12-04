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
import urllib2

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2
import lxml.html

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
# [END imports]

# [START new]
class New(webapp2.RequestHandler):
    def get(self):
    	quotes = [];

    	for i in range(1, 100):
    		htmltree = lxml.html.parse('http://www.seanwrona.com/typeracer/text.php?id=' + i)

    		p_tags = htmltree.xpath('//p')
    		p_content = [p.text_content() for p in p_tags]

    		quotes.append(p_content)

		print(quotes)

        self.response.write(p_content[0])
# [END new]

