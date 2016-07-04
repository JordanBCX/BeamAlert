"use strict";
const BeamClient = require('./../ext/bcn');
const BeamSocket = require('./../ext/bcn/lib/ws');
const client = new BeamClient();
var fs = require("fs");

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
    return client.chat.join(337);
})
.then(response => {
    // Chat connection
    const socket = new BeamSocket(response.body.endpoints).boot();

    // Greet a joined user
    socket.on('UserJoin', data => {
        socket.call('msg', [`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`]);
    });

    // React to our !pong command
    socket.on('ChatMessage', data => {
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
            socket.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);
        }
    });

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error', error);
    });

    return socket.auth(337, userInfo.id, response.body.authkey)
    .then(() => {
        console.log('Login successful');
        return socket.call('msg', ['Hi! I\'m pingbot! Write !ping and I will pong back!']);
    });
})
.catch(error => {
    console.log('Something went wrong:', error);
});
