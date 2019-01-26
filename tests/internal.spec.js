var ncl = require('../lib/login.js'),
  nclWrapper = require('../lib'),
  expect = require('chai').expect,
  path = require('path');

var testData = {
  username: 'username',
  password: 'password',
  email: 'test@example.com',
  registry: 'https://npm.random.com',
  scope: '@scope',
  configPath: '/path/',
  response: {
    token: 'test',
  },
  response2: {
    token: 'random',
  }
}

describe('Can handle', function () {
  it('missing username', function () {
    expect(function () {
      nclWrapper();
    }).to.throw();
  });

  it('missing password', function () {
    expect(function () {
      nclWrapper(testData.username);
    }).to.throw();
  });

  it('missing email', function () {
    expect(function () {
      nclWrapper(testData.username, testData.password);
    }).to.throw();
  });
});

describe('Can resolve', function () {
  it('custom username', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    expect(args).to.have.property('user', testData.username);
  });

  it('custom password', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    expect(args).to.have.property('pass', testData.password);
  });

  it('custom email', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    expect(args).to.have.property('email', testData.email);
  });

  it('default registry', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    expect(args).to.have.property('registry', 'https://registry.npmjs.org');
  });

  it('custom registry', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry);
    expect(args).to.have.property('registry', testData.registry);
  });

  it('default scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry);
    expect(args).to.have.property('scope', undefined);
  });

  it('custom scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope);
    expect(args).to.have.property('scope', testData.scope);
  });

  it('default quotes setting', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    expect(args).to.have.property('quotes', false);
  });

  it('custom quotes setting', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope, true);
    expect(args).to.have.property('quotes', true);
  });

  it('default configuration path', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope, true);
    expect(args).to.have.property('configPath', path.join(process.env.HOME, '.npmrc'));
  });

  it('custom configuration path', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope, true, testData.configPath);
    expect(args).to.have.property('configPath', testData.configPath);
  });
});

describe('Can generate', function () {
  it('file with default registry but no scope', function () {
    this.timeout(5000)
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(1)
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=test');
  });

  it('file with default registry and custom scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, undefined, testData.scope);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=' + testData.response.token);
    expect(toWrite).to.include(testData.scope + ':registry=https://registry.npmjs.org');
  });

  it('file with custom registry but no scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(1)
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response.token);
  });

  it('file with custom registry and custom scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response.token);
    expect(toWrite).to.include(testData.scope + ':registry=' + testData.registry);
  });
});

describe('Can append to', function () {
  it('file with default registry but no scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    var toWrite = ncl.generateFileContents(args, 'oldData', testData.response);
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=' + testData.response.token);
  });

  it('file with default registry and custom scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, undefined, testData.scope);
    var toWrite = ncl.generateFileContents(args, 'oldData', testData.response);
    expect(toWrite).to.have.length(3);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=' + testData.response.token);
    expect(toWrite).to.include(testData.scope + ':registry=https://registry.npmjs.org');
  });

  it('file with custom registry but no scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry);
    var toWrite = ncl.generateFileContents(args, 'oldData', testData.response);
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response.token);
  });

  it('file with custom registry and custom scope', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope);
    var toWrite = ncl.generateFileContents(args, 'oldData', testData.response);
    expect(toWrite).to.have.length(3);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response.token);
    expect(toWrite).to.include(testData.scope + ':registry=' + testData.registry);
  });

  it('file with existing auth token', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope);
    var toWrite = ncl.generateFileContents(args, '//npm.random.com/:_authToken=test', testData.response2);
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.not.include('//npm.random.com/:_authToken=' + testData.response.token);
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response2.token);
    expect(toWrite).to.include(testData.scope + ':registry=' + testData.registry);
  });
});

describe('Can honour', function () {
  it('quotes setting set to false', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope, false);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken=' + testData.response.token);
    expect(toWrite).to.include(testData.scope + ':registry=' + testData.registry);
  });

  it('quotes setting set to true', function () {
    var args = ncl.processArguments(testData.username, testData.password, testData.email, testData.registry, testData.scope, true);
    var toWrite = ncl.generateFileContents(args, '', testData.response);
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken="' + testData.response.token + '"');
    expect(toWrite).to.include(testData.scope + ':registry=' + testData.registry);
  });
});

describe('Can login to default registry', function () {
  it('with incorrect credentials', function (done) {
    this.timeout(5000);
    var args = ncl.processArguments(testData.username, testData.password, testData.email);
    ncl.login(args, function (err, data) {
      expect(err).to.have.property('statusCode', 401);
      done();
    });
  });

  it('with correct credentials', function (done) {
    this.timeout(5000);
    var args = ncl.processArguments(
      process.env.NPM_USER,
      process.env.NPM_PASS,
      process.env.NPM_EMAIL
    );
    ncl.login(args, function (err, data) {
      expect(data).to.have.property('ok', true);
      expect(data).to.have.property('token');
      done();
    });
  });
});
