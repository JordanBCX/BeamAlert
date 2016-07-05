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
var moment = require('moment')
var settings = require("../requires/settings")
var setting = settings.load();
console.log(setting.username);
console.log(setting.password);

var start = moment();

var target = process.argv[2];

var request = https.get("https://beam.pro/api/v1/channels/" + target + "?fields=id", function (response) {
    var body = "";
    response.on ('data', function (chunk) {
        body += chunk;
    });
    response.on ('end', function() {
        if (response.statusCode === 200) {
            var info = JSON.parse(body)
            var channel = info.id;

            let userInfo;

            client.use ('password', {
                username: setting.username,
                password: setting.password
            })

            .attempt()
            .then (response => {
                userInfo = response.body;
                return client.chat.join(channel);
            })
            .then (response => {
                // Chat connection
                const socket = new BeamSocket (response.body.endpoints).boot();

                // Greet a joined user
                socket.on ('UserJoin', data => {
                    //socket.call('msg', [`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`]);
                });

                //
                // Command execution.
                //
                socket.on ('ChatMessage', data => {
                    if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
                        socket.call('whisper', [data.user_name, `@${data.user_name} PONG!`]);
                        macros.CommandLog(moment().format(), data.user_name, "!ping");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!info')) {
                        socket.call('msg', ["I'm " + setting.bot_name + ". I'm running BeamAlert created by @J4Wx and @jordanlee833 of theibex.net."]);
                        macros.CommandLog(moment().format(), data.user_name, "!info");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!github')) {
                        socket.call('msg', ["BeamAlert can be downloaded at https://github.com/jordanlee833/BeamAlert."]);
                        macros.CommandLog(moment().format(), data.user_name, "!github");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!help')) {
                        socket.call('msg', ["The default commands are !ping, !info and !github."]);
                        macros.CommandLog(moment().format(), data.user_name, "!help");
                    }
                  	else if (data.message.message[0].data.toLowerCase().startsWith('!roll')) {
                      	if (data.message.message[0].data.toLowerCase().split(" ").length == 2) {
                          	var max = parseInt(data.message.message[0].data.toLowerCase().split(" ")[1]);
                            var rInt = Math.round(Math.random() * (max - 1) + 1);
                          	socket.call('msg', ["Random number is: " + rInt]);
                       	 	macros.CommandLog(moment().format(), data.user_name, "!roll", "roll result of " + rInt + " with max of " + max);
                        } else {
                            var rInt = Math.round(Math.random() * (6 + -1) + 1);
                          	socket.call('msg', ["Random number is: " + rInt]);
                       	 	macros.CommandLog(moment().format(), data.user_name, "!roll", "roll result of " + rInt + " with max of 6.");
                        }
                    }
                  	else if (data.message.message[0].data.toLowerCase().startsWith('!uptime')) {
                     	socket.call('msg', [setting.bot_name + " has been running BeamAlerts for " + moment.utc(moment(moment(),"DD/MM/YYYY HH:mm:ss").diff(moment(start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")]);
                      	macros.CommandLog(moment().format(), data.user_name, "!uptime");
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
                    return socket.call('msg', ['Hi! I\'m ' + setting.bot_name + '!']);
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
