#!/usr/bin/env node

var npmCLILogin = require('../')(process.env.NPM_USER, process.env.NPM_PASS,
  process.env.NPM_EMAIL, process.env.NPM_REGISTRY, process.env.NPM_SCOPE)
