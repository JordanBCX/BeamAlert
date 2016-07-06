var fs = require("fs");

function convert(term) {
    var content = fs.readFileSync('./user/alias.json', {encoding: "utf-8"});
    var aliases = JSON.parse(content);

    if (aliases[`${term}`]) {
        return aliases[`${term}`];
    } else {
        return "error";
    }
};

module.exports.convert = convert;
