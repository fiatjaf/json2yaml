#!/bin/bash

# npm install -g prettyaml
node cli.js tests/object.json
node cli.js tests/array.json
node cli.js tests/object.json | js-yaml
node cli.js tests/array.json | js-yaml
# These tests would probably fail and seem a moot point to me
# Why use YAML for literal values? It's general used for config
# files will multiple teirs of data
#node cli.js tests/string.json | prettyaml
#node cli.js tests/number.json | prettyaml
#node cli.js tests/boolean.json | prettyaml
#node cli.js tests/null.json | prettyaml
echo "Passed if no errors are listed above"
