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

function loadSettings() {
    var content = fs.readFileSync('./user/settings.json', {encoding: "utf-8"});
    var settings = JSON.parse(content)

    return settings;
};

function convert(term) {
    var content = fs.readFileSync('./user/alias.json', {encoding: "utf-8"});
    var aliases = JSON.parse(content);
    if (aliases[`${term.split(" ")[0]}`]) {
        return aliases[`${term.split(" ")[0]}`];
    } else {
        return "!error";
    }
};

function perms(tier, name) {
    var content = fs.readFileSync('./user/permissions.json', {encoding: "utf-8"});
    var perms = JSON.parse(content);
    var ret = false;

    switch (tier)  {
        case "owner":
            perms.owner.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
        break;
        case "admin":
            perms.owner.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
            perms.admin.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
        break;
        case "mod":
            perms.owner.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
            perms.admin.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
            perms.mod.contains(name, function(found) {
                if (found) {
                    ret = true;
                }
            })
        break;
        default:
    }

    return ret;
}

//Define commands
module.exports.perms = perms;
module.exports.CommandLog = CommandLog;
module.exports.ErrorLog = ErrorLog;
module.exports.metLoad = metLoad;
module.exports.load = loadSettings;
module.exports.convert = convert;
