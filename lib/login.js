var RegClient = require('npm-registry-client'),
    client = new RegClient({}),
    fs = require('fs'),
    path = require('path');

module.exports = function (npm_user, npm_pass, npm_email, npm_registry, npm_scope) {
  var registry = npm_registry || 'https://registry.npmjs.org',
      scope = npm_scope;

  client.adduser(registry, {
    auth: {
      username: npm_user,
      password: npm_pass,
      email: npm_email
    }
  }, function (err, data, raw, res) {
    if(err) {
      console.log(err);
    }
    else {
      if (scope) {
        fs.appendFileSync(path.join(process.env.HOME, '.npmrc'), scope + ':registry=' + registry + '/\n');
      }
      fs.appendFileSync(path.join(process.env.HOME, '.npmrc'), '//' + registry + '/:_authToken="' + data.token + '"');
    }
  });
}
