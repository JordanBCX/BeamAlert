// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: /requires/macros.js
// @Author: @Jordanlee833 & @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - Function short cuts for use with BeamAlerts

//Logging Format For Commands produced by successful command execution using BeamAlerts.
function CommandLog(username, command) {
    console.log(username + ": " + command);
}

//Logging format for errors produced by invalid commands using BeamAlerts.
function ErrorLog(username, command) {
    console.log("!!!ERROR!!! " + username + " ran " + command + " and failed !!!ERROR!!!");
}

//Define commands
module.exports.CommandLog = CommandLog;
module.exports.ErrorLog = ErrorLog;
