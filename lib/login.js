var RegClient = require('npm-registry-client');
var client = new RegClient({});
var fs = require('fs');
var path = require('path');
var rc = require('rc');

// jshint freeze:false
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
// jshint freeze:true

module.exports = {
    getConfig: function () {
        var config = rc('ncl', {
            user: process.env.NPM_USER,
            pass: process.env.NPM_PASS,
            email: process.env.NPM_EMAIL,
            registry: 'https://registry.npmjs.org',
            path: process.env.NPM_CONFIG_PATH,
            quotes: false
        });
        return config;
    },

    processArguments: function (npmUser, npmPass, npmEmail, npmRegistry, npmScope, quotes, configPath) {
        var registry = npmRegistry || 'https://registry.npmjs.org';
        var finalPath = configPath ? configPath : path.join(process.env.HOME, '.npmrc');
        var hasQuotes = quotes ? quotes : false;
        var args = {
            user: npmUser,
            pass: npmPass,
            email: npmEmail,
            registry: registry,
            scope: npmScope,
            quotes: hasQuotes,
            configPath: finalPath
        };

        return args;
    },

    login: function (args, callback) {
        client.adduser(args.registry, {
            auth: {
                username: args.user,
                password: args.pass,
                email: args.email
            }
        }, function (err, data) {
            if (err) {
                return callback(err);
            }
            return callback(null, data);
        });
    },

    readFile: function (args, callback) {
        fs.readFile(args.configPath, 'utf-8', function (err, contents) {
            if (err) {
                contents = '';
            }
            return callback(null, contents);
        });
    },

    generateFileContents: function (args, contents, response, callback) {
        // `contents` holds the initial content of the NPMRC file

        // Checks before we start
        if (response.token === undefined) {
            return callback(new Error('Could not find token in response. Please make sure your NPM registry ' +
            'returns a token in a variable called \"token\"'));
        }

        // No trailing `/` in the registry
        args.registry = (args.registry[args.registry.length - 1] === '/') ?
          args.registry.slice(0, args.registry.length - 1) :
          args.registry;

        // Convert the file contents into an array
        var lines = contents ? contents.split('\n') : [];

        if (args.scope) {
            (lines.findIndex(function (element) {
                if ( element.indexOf(args.scope + ':registry=' + args.registry) !== -1) {
                    // If an entry for the scope is found, replace it
                    element = args.scope + ':registry=' + args.registry;
                    return true;
                }
            }) === -1) && lines.push(args.scope + ':registry=' + args.registry);
        }

        var authWrite = lines.findIndex(function (element, index, array) {
            if ( element.indexOf(args.registry.slice(args.registry.search(/\:\/\//, '') + 1) +
            '/:_authToken=') !== -1) {
                // If an entry for the auth token is found, replace it
                array[index] = element.replace(/authToken\=.*/, 'authToken=' + (args.quotes ? '"' : '') +
                response.token + (args.quotes ? '"' : ''));
                return true;
            }
        });

        // If no entry for the auth token is found, add one
        if (authWrite === -1) {
            lines.push(args.registry.slice(args.registry.search(/\:\/\//, '') +
            1) + '/:_authToken=' + (args.quotes ? '"' : '') + response.token + (args.quotes ? '"' : ''));
        }

        var toWrite = lines.filter(function (element) {
            return (element === '') ? false : true;
        });

        return callback(null, toWrite);
    },

    writeFile: function (args, lines) {
        fs.writeFile(args.configPath, lines.join('\n') + '\n');
    }
};
