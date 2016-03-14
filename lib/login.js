var RegClient = require('npm-registry-client');
var client = new RegClient({});
var fs = require('fs');
var path = require('path');

module.exports = {
    processArguments: function (npmUser, npmPass, npmEmail, npmRegistry, npmScope, quotes, configPath) {
        var registry = npmRegistry || 'https://registry.npmjs.org';
        var scope = npmScope;
        var finalPath = configPath ? configPath : path.join(process.env.HOME, '.npmrc');
        var args = {
            user: npmUser,
            pass: npmPass,
            email: npmEmail,
            registry: registry,
            scope: scope,
            quotes: quotes,
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

    generateFileContents: function (args, contents, response) {
        // `contents` holds the initial content of the NPMRC file
        // Convert the file contents into an array
        var lines = contents ? contents.split('\n') : [];

        if (args.scope !== undefined) {
            var scopeWrite = lines.findIndex(function (element) {
                if ( element.indexOf(args.scope + ':registry=' + args.registry) !== -1) {
                    // If an entry for the scope is found, replace it
                    element = args.scope + ':registry=' + args.registry;
                    return true;
                }
            });

            // If no entry for the scope is found, add one
            if ( scopeWrite === -1 ) {
                lines.push(args.scope + ':registry=' + args.registry);
            }
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
            if (element === '') {
                return false;
            }
            return true;
        });

        return toWrite;
    },

    writeFile: function (args, lines) {
        fs.writeFile(args.configPath, lines.join('\n') + '\n');
    }
};
