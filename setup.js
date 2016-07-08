var fs = require("fs");
var prompt = require("prompt");
var colors = require("colors/safe");

prompt.start();

console.log("Welcome to the BeamAlerts setup tool.");
console.log("");

var stringtable = fs.readFileSync('./defaults/strings.json', { encoding: "utf-8" });
var aliastable = fs.readFileSync('./defaults/alias.json', {encoding: "utf-8" });
var permissions = fs.readFileSync('./defaults/permissions.json', {encoding: "utf-8"});
var settings = fs.readFileSync('./defaults/settings.json', {encoding: "utf-8"});

try {
    var stats = fs.lstatSync('./user');

    if (stats.isDirectory()) {
        console.log("You already have a user folder. If you would like to reconfigure BeamAlerts then delete your current user folder and run this script again.")
    }
} catch (e) {
    prompt.get({
          properties: {
                username: {
                    description: colors.magenta("Please enter the username you would like to use to connect to Beam.pro.")
                },
                password: {
                    description: colors.magenta("Password?")
                },
                bot_name: {
                    description: colors.magenta("What about the name of your bot?")
                },
                your_name: {
                    description: colors.magenta("and finally, your beam username (for permissions)")
                }
          }
    }, function (err, result) {
        fs.mkdir("./user");
        fs.writeFile('./user/settings.json', settings.replace("%username%",result.username).replace("%password%",result.password).replace("%botname%",result.bot_name).replace("%player%","none"), function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./user/metusers.txt', `${result.username}`, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./user/strings.json',stringtable, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./user/alias.json',aliastable, function (err) {
            if (err) return console.log(err);
        });
        fs.writeFile('./user/permissions.json',permissions.replace("%username%",result.your_name), function(err) {
            if (err) return console.log(err);
        });
    });
};
