from google.appengine.ext import ndb

class Excerpt(ndb.Model):
    id = ndb.IntegerProperty()
    passage = ndb.TextProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    source = ndb.StringProperty()

class RacerStats(ndb.Model):
    id = ndb.IntegerProperty()
    race_id = ndb.IntegerProperty()
    user_id = ndb.StringProperty()
    wpm = ndb.FloatProperty()
    wpm_percentile = ndb.FloatProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)

class Race(ndb.Model):
    id = ndb.IntegerProperty()
    excerpt_id = ndb.IntegerProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)