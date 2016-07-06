// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: ./requires/substitution.js
// @Author: @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - String Table Conversion
var fs = require("fs")
var moment = require("moment")
var settings = require("../requires/settings")
var setting = settings.load();
var start = moment();

function replace(key, one="", two="", three="") {
    var content = fs.readFileSync('./user/strings.json', {encoding: "utf-8"});
    var strings = JSON.parse(content)
    switch (key) {
        case "welcome":
            var string = strings.welcome.replace("%u",one);
        break;
        case "ping":
            var string = strings.ping.replace("%u",one);
        break;
        case "info":
            var string = strings.info;
        break;
        case "github":
            var string = strings.github;
        break;
        case "help":
            var string = strings.help;
        break;
        case "roll":
            var string = strings.roll.replace("%num",one);
        break;
        case "uptime":
            var string = strings.uptime;
        break;
        case "join":
            var string = strings.join;
        break;
        default:
            console.log("substition: invalid string requested.");
            var string = "error";
    }
    string = string.replace("%z",moment.utc(moment(moment(),"DD/MM/YYYY HH:mm:ss").diff(moment(start,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"))
    string = string.replace("%t",moment().format())
    string = string.replace("%b",setting.bot_name)
    return string;
}

module.exports.sub = replace;
