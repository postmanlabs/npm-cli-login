#!/usr/bin/env bash
set -e;

echo "jscs v`jscs --version`";
jscs lib bin;

echo;

jshint --version;
jshint lib bin;
echo "No code lint issues found.";

mocha tests
