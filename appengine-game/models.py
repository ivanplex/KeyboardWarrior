from random import randint

from google.appengine.ext import ndb

"""
Defines the models used by NDB and the game

Player: 
Represents the User, has a unique UserID key, wpm stats, accuracy and games played
Has helper methods to create new user if not exist as well as retrieve user by ID

Excerpt: Represents the text used in races.
Has strings representing the source of the texts as well as the texts
Helper method to get a random excerpt

RacerStats: Stats of a Race
Have the race_id, user_id, wpm, accuracy and time

Race: has a unique ID of the race used in race_id references
Also has the excerpt's ID and the start time of the race
"""

class Player(ndb.Model):
    nickname = ndb.StringProperty()
    wpm = ndb.FloatProperty()
    accuracy = ndb.FloatProperty()
    games_played = ndb.IntegerProperty()

    @classmethod
    def get_by_user(self, user):
        _user = ndb.Key(Player, user.user_id()).get()

        if _user:
            return _user

        _user = Player()
        _user.key = ndb.Key(Player, user.user_id())
        _user.nickname = user.nickname()
        _user.wpm = 0
        _user.games_played = 0
        _user.accuracy = 0

        _user.put()

        return _user

    @classmethod
    def get_by_nickname(self, nickname):
        tempUser = Player.query().filter(Player.nickname == nickname).get()
        return tempUser

    @classmethod
    def get_by_user_id(self, user_id):
        return ndb.Key(Player, user_id).get()

class Excerpt(ndb.Model):
    passage = ndb.TextProperty()
    source = ndb.StringProperty()

    @classmethod
    def get_random_Excerpt(self) :
        return ndb.Key(Excerpt, randint(1, 20)).get()

class RacerStats(ndb.Model):
    race_id = ndb.IntegerProperty()
    user_id = ndb.StringProperty()
    wpm = ndb.FloatProperty()
    accuracy = ndb.FloatProperty()
    created_at = ndb.DateTimeProperty()
    updated_at = ndb.DateTimeProperty()

class Race(ndb.Model):
    excerpt_id = ndb.IntegerProperty()
    start_time = ndb.DateTimeProperty()
