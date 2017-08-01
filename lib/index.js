var ncl = require('./login.js');

module.exports = function (user, pass, email, registry, scope, quotes, configPath) {
    var finalArgs = ncl.processArguments(user, pass, email, registry, scope, quotes, configPath);
    var response;
    var contents;
    var newContents;

    return new Promise(function (resolve, reject) {
        ncl.login(finalArgs, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                response = data;
                ncl.readFile(finalArgs, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        contents = data;
                        newContents = ncl.generateFileContents(finalArgs, contents, response);
                        ncl.writeFile(finalArgs, newContents);
                        resolve();
                    }
                });
            }
        });
    });
};
