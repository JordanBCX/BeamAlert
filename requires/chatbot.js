// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: ./requires/chatbot.js
// @Author: @Jordanlee833 & @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Chat Bot Backbone
"use strict";
const BeamClient = require('./../ext/bcn');
const BeamSocket = require('./../ext/bcn/lib/ws');
const client = new BeamClient();
var fs = require("fs");
var https = require("https");
var macros = require('./macros.js');
var moment = require('moment');
var substitution = require("./substitution");
var alias = require("./alias");

//Load Settings
var settings = require("../requires/settings")
var setting = settings.load();

console.log(setting['bot_name']);
var metUsers = macros.metLoad();

var start = moment();

//Grab target channel param
var target = process.argv[2];

//Attempt to grab Channel ID from beam API
var request = https.get("https://beam.pro/api/v1/channels/" + target + "?fields=id", function (response) {
    var body = "";

    var compEntry = false;
    var compEntries = [];

    //Compile Response
    response.on ('data', function (chunk) {
        body += chunk;
    });

    //On Complete Response
    response.on ('end', function() {
        if (response.statusCode === 200) {
            var info = JSON.parse(body)
            var channel = info.id;

            let userInfo;

            //Assign username and password from settings file
            client.use ('password', {
                username: setting.username,
                password: setting.password
            })

            //Attempt Connection
            .attempt()

            .then (response => {
                userInfo = response.body;
                return client.chat.join(channel);
            })

            .then (response => {
                // Chat connection
                const socket = new BeamSocket (response.body.endpoints).boot();

                // Greet a new joined user
                socket.on ('UserJoin', data => {
                    metUsers.contains(data.username, function(found) {
                        if (found) {

                        } else {
                            metUsers.push(data.username)
                            fs.writeFile('./user/metusers.txt', `${metUsers.join(":")}`, function (err) {
                                if (err) return console.log(err);
                            })
                            socket.call('msg', [substitution.sub("welcome",data.username)]);
                            macros.CommandLog(moment().format(), data.username, "first_join")
                        }
                    })
                });

                //
                // Command execution.
                //
                socket.on ('ChatMessage', data => {
                    //Simple Pong Reply
                    var subbedMessage = alias.convert(data.message.message[0].data.toLowerCase());

                    if (subbedMessage.startsWith('!ping')) {
                        socket.call('whisper', [data.user_name, substitution.sub("ping",data.user_name)]);
                        macros.CommandLog(moment().format(), data.user_name, "!ping");
                    }
                    //Info Message (Message that bot is running BeamAlerts)
                    else if (subbedMessage.startsWith('!info')) {
                        socket.call('msg', [substitution.sub("info")]);
                        macros.CommandLog(moment().format(), data.user_name, "!info");
                    }
                    //Github Link (Link to the project github)
                    else if (subbedMessage.startsWith('!github')) {
                        socket.call('msg', [substitution.sub("github")]);
                        macros.CommandLog(moment().format(), data.user_name, "!github");
                    }
                    //Help Message (Info on bot commands)
                    else if (subbedMessage.startsWith('!help')) {
                        socket.call('msg', [substitution.sub("help")]);
                        macros.CommandLog(moment().format(), data.user_name, "!help");
                    }
                    //Random Number
                  	else if (subbedMessage.startsWith('!roll')) {
                        //Random Number with Specified Max
                      	if (data.message.message[0].data.toLowerCase().split(" ").length == 2) {
                          	var max = parseInt(data.message.message[0].data.toLowerCase().split(" ")[1]);
                            var rInt = Math.round(Math.random() * (max - 1) + 1);
                          	socket.call('msg', [substitution.sub("roll",rInt)]);
                       	 	macros.CommandLog(moment().format(), data.user_name, "!roll", "roll result of " + rInt + " with max of " + max);
                        //Random Number with Unspecified Max (6)
                        } else {
                            var rInt = Math.round(Math.random() * (6 + -1) + 1);
                          	socket.call('msg', [substitution.sub("roll",rInt)]);
                       	 	macros.CommandLog(moment().format(), data.user_name, "!roll", "roll result of " + rInt + " with max of 6.");
                        }
                    }
                    //Uptime - Length of time bot has been running
                  	else if (subbedMessage.startsWith('!uptime')) {
                     	socket.call('msg', [substitution.sub("uptime")]);
                      	macros.CommandLog(moment().format(), data.user_name, "!uptime");
                    }
                    else if (subbedMessage.startsWith('!compstart')) {
                        socket.call('msg', [substitution.sub("compstart")]);
                        macros.CommandLog(moment().format(), data.user_name, "!compstart");
                        compEntry = true;
                        compEntries = [];
                        setTimeout( function() {
                             compEntry = false;
                             var winner = compEntries[Math.floor(Math.random() * compEntries.length)];
                             socket.call('msg', [substitution.sub("winner",winner)])
                             macros.CommandLog(moment().format(), "SERVER", "COMPEND", "Winner was " + winner);
                        }, 10000);
                    }
                    else if (subbedMessage.startsWith('!enter')) {
                        if (compEntry) {
                            socket.call('whisper', [data.user_name, substitution.sub("enter",data.user_name)]);
                            compEntries.push(data.user_name);
                        } else {
                            socket.call('whisper', [data.user_name, substitution.sub("nocomp",data.user_name)]);
                        }
                    }
                    //This stays at the bottom
					else if (data.message.message[0].data.toLowerCase().startsWith('!')) {
						macros.ErrorLog(data.user_name, data.message.message[0].data);
					}
                });

                // Handle errors
                socket.on ('error', error => {
                    console.error('Socket error', error);
                });

                return socket.auth (channel, userInfo.id, response.body.authkey)
                .then (() => {
                    console.log("Successfully connected to " + target + "'s stream as " + setting.username);
                    return socket.call('msg', [substitution.sub("join",setting.bot_name)]);
                });
            })
            .catch (error => {
                console.log('Something went wrong:', error);
            });

        } else {
            console.log("--Error--");
            console.log("User Lookup Failed.");
            macros.ErrorLog("Server", "User Lookup");
        }
    });
});
/*
C:\Users\Jordan\Documents\GitHub\BeamAlert\requires\chatbot.js:87
                        socket.call('msg', ["BeamAlerts has been running for " + moment(start).valueOf().format()]);
                                                                                                         ^

TypeError: moment(...).valueOf(...).format is not a function
    at EventEmitter.<anonymous> (C:\Users\Jordan\Documents\GitHub\BeamAlert\requires\chatbot.js:87:104)
    at emitOne (events.js:77:13)
    at EventEmitter.emit (events.js:169:7)
    at EventEmitter.BeamSocket.parsePacket (C:\Users\Jordan\Documents\GitHub\BeamAlert\ext\bcn\lib\ws\ws.js:372:18)
    at WebSocket.<anonymous> (C:\Users\Jordan\Documents\GitHub\BeamAlert\ext\bcn\lib\ws\ws.js:265:26)
    at emitTwo (events.js:87:13)
    at WebSocket.emit (events.js:172:7)
    at Receiver.ontext (C:\Users\Jordan\Documents\GitHub\BeamAlert\node_modules\ws\lib\WebSocket.js:841:10)
    at C:\Users\Jordan\Documents\GitHub\BeamAlert\node_modules\ws\lib\Receiver.js:536:18
    at C:\Users\Jordan\Documents\GitHub\BeamAlert\node_modules\ws\lib\Receiver.js:368:7
    at C:\Users\Jordan\Documents\GitHub\BeamAlert\node_modules\ws\lib\PerMessageDeflate.js:249:5
    at afterWrite (_stream_writable.js:354:3)
    at onwrite (_stream_writable.js:345:7)
    at WritableState.onwrite (_stream_writable.js:89:5)
    at afterTransform (_stream_transform.js:79:3)
    at TransformState.afterTransform (_stream_transform.js:54:12)


*/
