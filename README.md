prettyaml
===

This is a fork of [json2yaml](https://github.com/coolaj86/json2yaml) aimed at making the printed YAML prettier and more readable for the man on the streets.

Installation
===

```bash
npm install -g prettyaml
```

*Note*: To use `npm` and `prettyaml` you must have installed [NodeJS](http://nodejs.org#download).

Usage
---

Specify a file:

```bash
prettyaml ./example.json > ./example.yml
```

Or pipe from stdin:

```bash
curl -s http://foobar3000.com/echo/echo.json | prettyaml
wget -qO- http://foobar3000.com/echo/echo.json | prettyaml
```

Or require:

```javascript
(function () {
  "use strict";

  var prettyaml = require('prettyaml')
    , ymlText
    ;

    ymlText = prettyaml.stringify({
      "foo": "bar"
    , "baz": "corge"
    });

    console.log(ymlText);
}());
```

Example
===

So, for all the times you want to turn JSON int YAML (YML):

```javascript
{ "foo": "bar"
, "baz": [
    "qux"
  , "quxx"
  ]
, "corge": null
, "grault": 1
, "garply": true
, "wãldo": "false"
, "fred": "undefined"
}
```

becomes

```yaml
foo: bar
baz:
  - qux
  - quxx
corge:
grault: 1
garply: true
"wãldo": "false"
fred: "undefined"
```

*Note*: In fact, both of those Object Notations qualify as YAML
because JSON technically *is* a proper subset of YAML.
That is to say that all proper YAML parsers parse proper JSON.

YAML can use either *whitespace and dashes* or *brackets and commas*.

For human readability, the whitespace-based YAML is preferrable.
For compression and computer readability, the JSON syntax of YAML is preferrable.
