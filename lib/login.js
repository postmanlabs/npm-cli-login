var RegClient = require('npm-registry-client');
var client = new RegClient({});
var fs = require('fs');
var path = require('path');

module.exports = function (npmUser, npmPass, npmEmail, npmRegistry, npmScope, quotes, configPath) {
    var registry = npmRegistry || 'https://registry.npmjs.org';
    var scope = npmScope;

    client.adduser(registry, {
        auth: {
            username: npmUser,
            password: npmPass,
            email: npmEmail
        }
    }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var finalPath = configPath ? configPath : path.join(process.env.HOME, '.npmrc');
            fs.readFile(finalPath, 'utf-8', function (err, contents) {
                if (err) {
                    contents = '';
                }

                // Convert the file contents into an array
                var lines = contents.split('\n');

                var scopeWrite = lines.findIndex(function (element) {
                    if ( element.indexOf(scope + ':registry=' + registry) !== -1) {
                        // If an entry for the scope is found, replace it
                        element = scope + ':registry=' + registry;
                        return true;
                    }
                });

                // If no entry for the scope is found, add one
                if ( scopeWrite === -1 ) {
                    lines.push(scope + ':registry=' + registry);
                }

                var authWrite = lines.findIndex(function (element, index, array) {
                    if ( element.indexOf(registry.slice(registry.search(/\:\/\//, '') + 1) + '/:_authToken=') !== -1) {
                        // If an entry for the auth token is found, replace it
                        array[index] = element.replace(/authToken\=.*/, 'authToken=' + (quotes ? '"' : '') +
							data.token + (quotes ? '"' : ''));
                        return true;
                    }
                });

                // If no entry for the auth token is found, add one
                if (authWrite === -1) {
                    lines.push(registry.slice(registry.search(/\:\/\//, '') +
						1) + '/:_authToken=' + (quotes ? '"' : '') + data.token + (quotes ? '"' : ''));
                }

                // Sew everything together and write to NPMRC
                fs.writeFile(configPath, lines.join('\n'));
            });
        }
    });
};
