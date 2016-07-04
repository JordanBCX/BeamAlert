// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: /requires/chatbot.js
// @Author: @Jordanlee833 & @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Chat Bot Backbone
"use strict";
const BeamClient = require('./../ext/bcn');
const BeamSocket = require('./../ext/bcn/lib/ws');
const client = new BeamClient();
var fs = require("fs");
var https = require("https");
var macros = require('./macros.js');

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

            var content = fs.readFileSync('./login.txt', {encoding: "utf-8"});
            var split = content.split(":");
            var username = split[1];
            var password = split[2];

            client.use ('password', {
                username: username,
                password: password
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
                        macros.CommandLog(data.user_name, "!ping");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!info')) {
                        socket.call('msg', ["I'm BeamAlert, created by @J4Wx and @jordanlee833 of theibex.net."]);
                        macros.CommandLog(data.user_name, "!info");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!github')) {
                        socket.call('msg', ["BeamAlert can be downloaded at https://github.com/jordanlee833/BeamAlert."]);
                        macros.CommandLog(data.user_name, "!github");
                    }
                    else if (data.message.message[0].data.toLowerCase().startsWith('!help')) {
                        socket.call('msg', ["The default commands are !ping, !info and !github."]);
                        macros.CommandLog(data.user_name, "!help");
                    }
                  	else if (data.message.message[0].data.toLowerCase().startsWith('!roll')) {
                        macros.CommandLog(data.user_name, "!roll");
                      	if (data.message.message[0].data.toLowerCase().split(" ").length == 2) {
                          	var max = data.message.message[0].data.toLowerCase().split(" ")[1].parseInt();
                          	socket.call('msg', ["Random number is: " + Math.floor(Math.random() * (max + 1))]);
                        } else {
                          	socket.call('msg', ["Random number is: " + Math.floor(Math.random() * (6 + 1))]);
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
                    console.log("Successfully connected to " + target + "'s stream as " + username);
                    return socket.call('msg', ['Hi! I\'m BeamAlerts!']);
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
