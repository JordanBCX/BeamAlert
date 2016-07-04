var validator = require("./requires/validator.js");
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
    console.log("Error: Port must be a number.")
    process.exit(1)
}

if (!(validator.ip(binding))) {
    console.log("Error: Binding must be an IP address.")
    process.exit(1)
}

console.log("Server is running on " + binding + ":" + port)
