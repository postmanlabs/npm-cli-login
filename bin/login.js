#!/usr/bin/env node

var login = function () {
  var found = false
  var user = process.argv.find(function (element, index) {
    if(found)
      return true
  	if(element === '-u')
    	found = true
  }) || process.env.NPM_USER

  found = false
  var pass = process.argv.find(function (element, index) {
    if(found)
      return true
  	if(element === '-p')
    	found = true
  }) || process.env.NPM_PASS

  found = false
  var email = process.argv.find(function (element, index) {
    if(found)
      return true
  	if(element === '-e')
    	found = true
  }) || process.env.NPM_EMAIL

  found = false
  var registry = process.argv.find(function (element, index) {
    if(found)
      return true
  	if(element === '-r')
    	found = true
  }) || process.env.NPM_REGISTRY

  found = false
  var scope = process.argv.find(function (element, index) {
    if(found)
      return true
  	if(element === '-s')
    	found = true
  }) || process.env.NPM_SCOPE

  found = false
  var quotes = process.argv.find(function (element, index) {
  	if(element === '--quotes')
    	return true
  }) || false

  require('../')(user, pass, email, registry, scope, quotes)
}

login()
