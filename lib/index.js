var ncl = require('./login.js');

module.exports = function (user, pass, email, registry, scope, quotes, configPath) {
    var finalArgs = ncl.processArguments(user, pass, email, registry, scope, quotes, configPath);
    var response;
    var contents;

    ncl.login(finalArgs, function (err, data) {
        if (err) {
            throw new Error(err);
        }
        else {
            response = data;
            ncl.readFile(finalArgs, function (err, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    contents = data;
                    ncl.generateFileContents(finalArgs, contents, response, function (err, newContents) {
                        if (err) {
                            throw new Error(err);
                        }
                        ncl.writeFile(finalArgs, newContents);
                    });
                }
            });
        }
    });
};
