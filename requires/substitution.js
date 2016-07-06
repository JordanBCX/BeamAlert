//substitution.replace("key", params)

var fs = require("fs")

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
            var string = strings.info.replace("%b",one);
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
            var string = strings.uptime.replace("%t",one).replace("%b",two);
        break;
        case "join":
            var string = strings.join.replace("%b",one);
        break;
        default:
            console.log("substition: invalid string requested.");
            var string = "error";
    }
    return string;
}

module.exports.sub = replace;
