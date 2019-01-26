var ncl = require('./login.js');

module.exports = function (user, pass, email, registry, scope, quotes, configPath) {
    var finalArgs = ncl.processArguments(user, pass, email, registry, scope, quotes, configPath);
    var response;
    var contents;
    var newContents;

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
                    newContents = ncl.generateFileContents(finalArgs, contents, response);
                    ncl.writeFile(finalArgs, newContents, function (err) {
                        if (err) {
                            // let users know that it didn't work (could be prettier)
                            throw new Error(err);
                        }
                    });
                }
            });
        }
    });
};
