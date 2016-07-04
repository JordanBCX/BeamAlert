"use strict";
const BeamClient = require('./../ext/bcn');
const BeamSocket = require('./../ext/bcn/lib/ws');
const client = new BeamClient();
var fs = require("fs");
var https = require("https");

var target = process.argv[2];

var request = https.get("https://beam.pro/api/v1/channels/" + target +"?fields=id", function(response) {
    var body = "";
    response.on('data', function (chunk) {
        body += chunk;
    });
    response.on('end', function() {
        if(response.statusCode === 200) {
            var info = JSON.parse(body)
            var channel = info.id;

            let userInfo;

            var content = fs.readFileSync('./login.txt', {encoding: "utf-8"});
            var split = content.split(":");
            var username = split[1];
            var password = split[2];

            client.use('password', {
                username: username,
                password: password
            })

            .attempt()
            .then(response => {
                userInfo = response.body;
                return client.chat.join(channel);
            })
            .then(response => {
                // Chat connection
                const socket = new BeamSocket(response.body.endpoints).boot();

                // Greet a joined user
                socket.on('UserJoin', data => {
                    //socket.call('msg', [`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`]);
                });

                // React to our !pong command
                socket.on('ChatMessage', data => {
                    if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
                        socket.call('msg', [`@${data.user_name} PONG!`]);
                        console.log(`Ponged ${data.user_name}`);
                    }
                    if (data.message.message[0].data.toLowerCase().startsWith('!info')) {
                        socket.call('msg', ["I'm BeamAlert, created by @J4Wx and @jordanlee833"]);
                        console.log(`Infoed ${data.user_name}`);
                    }
                    if (data.message.message[0].data.toLowerCase().startsWith('!github')) {
                        socket.call('msg', ["BeamAlert can be downloaded at https://github.com/jordanlee833/BeamAlert"]);
                        console.log(`githubbed ${data.user_name}`);
                    }
                });

                // Handle errors
                socket.on('error', error => {
                    console.error('Socket error', error);
                });

                return socket.auth(channel, userInfo.id, response.body.authkey)
                .then(() => {
                    console.log('Login successful');
                    return socket.call('msg', ['Hi! I\'m BeamAlerts!']);
                });
            })
            .catch(error => {
                console.log('Something went wrong:', error);
            });

        } else {
            console.log("--Error--");
            console.log("User Lookup Failed.");
        }
    });
});
