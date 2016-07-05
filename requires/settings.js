// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: ./requires/settings.js
// @Author: @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Web Base
var fs = require("fs");

function loadSettings() {
    var content = fs.readFileSync('./user/settings.json', {encoding: "utf-8"});
    var settings = JSON.parse(content)

    return settings;
};

module.exports.load = loadSettings;
