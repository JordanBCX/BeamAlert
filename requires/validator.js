// Copyright (c) 2016 TheIbex.Net All Rights Reserved.
// @File: ./requires/validator.js
// @Author: @J4WX (http://beam.pro/)
// @Description: http://github.com/jordanlee833/BeamAlerts - BeamAlerts IP Validation
function ip(ipaddress)
{
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
    {
        return (true)
    } else {
        return (false)
    }
}
module.exports.ip = ip
