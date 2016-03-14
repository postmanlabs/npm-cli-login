var ncl = require('../lib/login.js'),
    nclWrapper = require('../lib'),
    expect = require('chai').expect,
    path = require('path')

describe('Can handle', function () {
  it('missing username', function () {
    expect(function () {
      nclWrapper();
    }).to.throw('AssertionError');
  });

  it('missing password', function () {
    expect(function () {
      nclWrapper('username');
    }).to.throw('AssertionError');
  });

  it('missing email', function () {
    expect(function () {
      nclWrapper('username', 'password');
    }).to.throw('AssertionError');
  });
});

describe('Can resolve', function () {
  it('custom username', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    expect(args).to.have.property('user', 'username');
  });

  it('custom password', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    expect(args).to.have.property('pass', 'password');
  });

  it('custom email', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    expect(args).to.have.property('email', 'test@test.com');
  });

  it('default registry', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    expect(args).to.have.property('registry', 'https://registry.npmjs.org');
  });

  it('custom registry', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com');
    expect(args).to.have.property('registry', 'https://reg.random.com');
  });

  it('default scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com');
    expect(args).to.have.property('scope', undefined);
  });

  it('custom scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com', '@scope');
    expect(args).to.have.property('scope', '@scope');
  });

  it('default quotes setting', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    expect(args).to.have.property('quotes', false);
  });

  it('custom quotes setting', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com', '@scope', false);
    expect(args).to.have.property('quotes', false);
  });

  it('default configuration path', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com', '@scope', false);
    expect(args).to.have.property('configPath', path.join(process.env.HOME, '.npmrc'));
  });

  it('custom configuration path', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'https://reg.random.com', '@scope', false, '/path/');
    expect(args).to.have.property('configPath', '/path/');
  });
});

describe('Can generate', function () {
  it('file with default registry but no scope', function () {
    this.timeout(5000)
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(1)
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=test');
  });

  it('file with default registry and custom scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', undefined, '@scope');
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=test');
    expect(toWrite).to.include('@scope:registry=https://registry.npmjs.org');
  });

  it('file with custom registry but no scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com');
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(1)
    expect(toWrite).to.include('//npm.random.com/:_authToken=test');
  });

  it('file with custom registry and custom scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com', '@scope');
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken=test');
    expect(toWrite).to.include('@scope:registry=http://npm.random.com');
  });
});

describe('Can append to', function () {
  it('file with default registry but no scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    var toWrite = ncl.generateFileContents(args, 'oldData', { token: 'test' });
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=test');
  });

  it('file with default registry and custom scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', undefined, '@scope');
    var toWrite = ncl.generateFileContents(args, 'oldData', { token: 'test' });
    expect(toWrite).to.have.length(3);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//registry.npmjs.org/:_authToken=test');
    expect(toWrite).to.include('@scope:registry=https://registry.npmjs.org');
  });

  it('file with custom registry but no scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com');
    var toWrite = ncl.generateFileContents(args, 'oldData', { token: 'test' });
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//npm.random.com/:_authToken=test');
  });

  it('file with custom registry and custom scope', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com', '@scope');
    var toWrite = ncl.generateFileContents(args, 'oldData', { token: 'test' });
    expect(toWrite).to.have.length(3);
    expect(toWrite).to.include('oldData');
    expect(toWrite).to.include('//npm.random.com/:_authToken=test');
    expect(toWrite).to.include('@scope:registry=http://npm.random.com');
  });

  it('file with existing auth token', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com', '@scope');
    var toWrite = ncl.generateFileContents(args, '//npm.random.com/:_authToken=test', { token: 'random' });
    expect(toWrite).to.have.length(2);
    expect(toWrite).to.not.include('//npm.random.com/:_authToken=test');
    expect(toWrite).to.include('//npm.random.com/:_authToken=random');
    expect(toWrite).to.include('@scope:registry=http://npm.random.com');
  });
});

describe('Can honour', function () {
  it('quotes setting set to false', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com', '@scope', false);
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken=test');
    expect(toWrite).to.include('@scope:registry=http://npm.random.com');
  });

  it('quotes setting set to true', function () {
    var args = ncl.processArguments('username', 'password', 'test@test.com', 'http://npm.random.com', '@scope', true);
    var toWrite = ncl.generateFileContents(args, '', { token: 'test' });
    expect(toWrite).to.have.length(2)
    expect(toWrite).to.include('//npm.random.com/:_authToken="test"');
    expect(toWrite).to.include('@scope:registry=http://npm.random.com');
  });
});

describe('Can login to default registry', function () {
  it('with incorrect credentials', function (done) {
    this.timeout(5000)
    var args = ncl.processArguments('username', 'password', 'test@test.com');
    ncl.login(args, function (err, data) {
      expect(err).to.have.property('statusCode', 400);
      done();
    })
  });

  it('with correct credentials', function (done) {
    this.timeout(5000)
    var args = ncl.processArguments(process.env.NPM_USER, process.env.NPM_PASS, process.env.NPM_EMAIL);
    ncl.login(args, function (err, data) {
      expect(data).to.have.property('ok', true);
      expect(data).to.have.property('token');
      done();
    })
  });
});
