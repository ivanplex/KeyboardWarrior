from google.appengine.ext import ndb

class Player(ndb.Model):
    user_id = ndb.StringProperty()
    nickname = ndb.StringProperty()
    wpm = ndb.IntegerProperty()
    games_played = ndb.IntegerProperty()

    @classmethod
    def get_by_user(cls, user):
        return cls.query().filter(cls.user_id == user.user_id()).get()

class Excerpt(ndb.Model):
    id = ndb.IntegerProperty()
    passage = ndb.TextProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)
    source = ndb.StringProperty()

class RacerStats(ndb.Model):
    race_id = ndb.IntegerProperty()
    user_id = ndb.StringProperty()
    wpm = ndb.FloatProperty()
    wpm_percentile = ndb.FloatProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    updated_at = ndb.DateTimeProperty(auto_now=True)

class Race(ndb.Model):
    excerpt_id = ndb.IntegerProperty()
    start_time = ndb.IntegerProperty()
    players = ndb.IntegerProperty(repeated=True)
