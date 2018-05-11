var ncl = require('./login.js');

module.exports = function (conf, callback) {
    var user = conf.user
    var pass = conf.pass
    var email = conf.email
    var registry = conf.registry
    var scope = conf.scope
    var quotes = conf.quotes
    var configPath = conf.configPath

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
                    ncl.writeFile(finalArgs, newContents);
                    callback && callback()
                }
            });
        }
    });
};
