#!/usr/bin/env node

var config = require('../lib/login').getConfig();

var getArg = function (marker, isBoolean) {
    var pos = process.argv.indexOf(marker);
    return (pos === -1) ? -1 : (isBoolean ? pos : (pos + 1));
};

var login = function () {
    var found = getArg('-u', false);
    var user = (found === -1) ? config.user : process.argv[found];

    found = getArg('-p', false);
    var pass = (found === -1) ? config.pass : process.argv[found];

    found = getArg('-e', false);
    var email = (found === -1) ? config.email : process.argv[found];

    found = getArg('-r', false);
    var registry = (found === -1) ? config.registry : process.argv[found];

    found = getArg('-s', false);
    var scope = (found === -1) ? config.scope : process.argv[found];

    found = getArg('--config-path', false);
    var configPath = (found === -1) ? config.path : process.argv[found];

    found = getArg('--quotes', true);
    var quotes = (found === -1) ? config.quotes : true;

    require('../')(user, pass, email, registry, scope, quotes, configPath);
};

login();
