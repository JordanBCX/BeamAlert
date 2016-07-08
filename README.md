# BeamAlert

## Description

V1.0.2 - Added SpotifyAPI (See !song command)
Will require another "npm install" and deletion of the user folder, before running setup again.

Beam Alert will be a Notification Bot built for Beam.pro using node.js.

Beam Alert will provide a web-based control panel and web-based alerting system and a chat bot with many features.

## Planned Features

* Customisable chat bot

* Statistics dashboard for content creators

* Self hosted variant of chat bot

* Encryption of the settings.json file


## Current Abilities

* Self hosted chat bot

* Fully customisable announcement messages

## Commands

- !ping - whispers the sender with a reply of PONG!
- !info - replies with information regarding the bot, including the fact that it is running BeamAlert!
- !github - replies with a link to the projects github.
- !help - replies with a link to the projects github, referencing this very command list.
- !roll (number) - replies with a random integer between 1 and the provided number inclusive. If no number is provided then the bot defaults to 6.
- !uptime - replies with the current length of the bot's session.
- !enter - Enter the currently running competition.
- !song - If the user changes setting "player" to "spotify" instead of none, then the !song command becomes available for use, returning the currently playing spotify song of the host.

### Owner Only
- !setowner (username) - Adds an owner
- !removeowner (username) - ...
- !setadmin (username) - ...
- !removeowner (username) - ...
- !setmod (username) - ...
- !removemod (username) - ...

### Admin+ Only
- !compstart (seconds) - Begin a competition lasting the specified number of seconds. If no time specified then will default to 10 seconds.


###### Suggestions

If you have any suggestions do not be afraid to create an issue here on GitHub or send an email to admin@theibex.net with the subject "Beam.Pro Bot Suggestion".

###### Installation

- First, using npm install the required dependencies. (npm install)
- Then, run setup.js (node setup.js) and then follow the instructions given.
- Then, run app.js with 1 parameter, the username of the beam.pro stream you would like to join. (For example - "node app.js J4Wx")
- Any errors should be clearly indicated, if an authentication error occurs then it is likely you entered an invalid username and/or password, you can edit the configured password by deleting your /user folder and running setup again, or by editing settings.json in your user folder.

NOTE: Username and password of the account you are using to connect the bot are stored in plain text. It is therefore important that you do not share the user/settings.json file.
