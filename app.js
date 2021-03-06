// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: ./app.js
// @Author: @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Web Base

"use strict";
var validator = require("./requires/validator.js");
var fs = require("fs");

if (process.argv.length != 3) {
    console.log("--Error--")
    console.log("You must enter the target channel as a parameter. (i.e 'node app.js J4Wx')")
    process.exit();
}

try {
    var stats = fs.lstatSync('./user');

    if (stats.isDirectory()) {
        var chatBot = require("./requires/chatbot.js")
        console.log("Launching BeamAlerts!")
    }
} catch (e) {
    console.log("No user folder found. Please run 'node setup.js' first.")
    console.log(e);
}

/* REVIEW: This may be removed if this version of the bot is intended purely for local hosted chat-bot use.
var args = process.argv.slice(2)

var port = 3000;
for (var i = 0; i < args.length; i++) {
    if (args[i] == "-p") {
        var port = parseInt(args[i+1]);
    }
}

var binding = "127.0.0.1";
for (var i = 0; i < args.length; i++) {
    if (args[i] == "-b") {
        var binding = args[i+1];
    }
}

var numericalValue = 5;

if (isNaN(port)) {
    console.log("Error: Port must be a number.");
    process.exit(1);

}
if (!(validator.ip(binding))) {
    console.log("Error: Binding must be an IP address.");
    process.exit(1);
}

console.log("Server is running on " + binding + ":" + port);
*/
