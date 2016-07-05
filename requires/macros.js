// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: /requires/macros.js
// @Author: @Jordanlee833 & @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Function short cuts for use with BeamAlerts

//Logging Format For Commands produced by successful command execution using BeamAlerts.
var fs = require("fs")

function CommandLog(timestamp, username, command, additional) {
    if (additional !== undefined) {
        console.log(timestamp + " " + username + ": " + command + ". Additional information: " + additional);
    }
    else {
        console.log(timestamp, username + ": " + command);
    }
}

//Logging format for errors produced by invalid commands using BeamAlerts.
function ErrorLog(username, command) {
    console.log("!!!ERROR!!! " + username + " ran " + command + " and failed !!!ERROR!!!");
}

function metLoad() {
    var temp = fs.readFileSync("./user/metusers.txt", {"encoding" : "utf-8"});
    var metusers = temp.split(":");
    return metusers
}

Array.prototype.contains = function(k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i+1));
    }(0));
}

//Define commands
module.exports.CommandLog = CommandLog;
module.exports.ErrorLog = ErrorLog;
module.exports.metLoad = metLoad;
