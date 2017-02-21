# KeyboardWarrior

KeyboardWarrior allows 3-5 people to compete in a typing race, with scores being measured in
words per minute. Text is chosen from a bank of 20 excerpts, each with it’s own leaderboard, as
well as a global leaderboard for all users and excerpts.

## Features
- Users can sign in with their Google Account which gives us a large coverage of all likely
users, and gives us some way of validating requests using user cookies.

- Upon logging in the player is presented with a page in which they can join a game. This
enters them into a lobby by sending a request to a server for a new room. The game will
begin to start when their is 3 players in the room, with a countdown of 15 seconds. Every
time a new player joins, the countdown is then reset to the current time plus 15 seconds.

- When there are no lobbies available (because all are full or are currently in game) the
game will create a new lobby to populate players, and the current player will be
assigned to that room.

- The player must then correctly type the excerpt word by word. If the right word is used
the progress is then updated to the server. If the user writes the wrong word, then the
word will not be submitted and no progress will be made.

- The game also keeps track of how many mistakes the user has made. So even if no
correct words are typed by the user the server will be notified how many mistakes the
user has made. From this information we can tell which excerpts are the most difficult as
well as allow users to track their typing improvements.

## Tools Used

- Postman
	- Allows testing of HTTP API’s
	- Used Google App Engine login cookies from browser to imitate sessions
	- Tested valid and invalid data for our endpoint
	- https://www.getpostman.com/
- CLOC
	- Used to calculate lines of code
- Git repository hosted on github.com
	- Manage source -- separate front and back end branches.
	- Assign bugs/ features requests
	- All merges and conflict resolution was done with the physical presence of all commit authors
- Firefox developer tools
	- Testing different screen sizes for correct scaling
	- Invoking javascript functions from console to speed up development
- JSHint : testing tool for javascript code (via sublime-jshint)

## Statistics

Lines of code: 1481 (according to CLOC)

## Non-Original Source Code

- Libraries used - jquery - webapp2 - bootstrap - google app engine api (ndb and users)
- JQuery
	- https://jquery.com/
- Bootstrap
	- http://getbootstrap.com/
- LXML
	- http://lxml.de/​ - provided with Google App Engine
	- Utilised for extraction of text excerpts from excerpt source.
- Used official CDN for these common libraries to reduces GAE bandwidth use.
