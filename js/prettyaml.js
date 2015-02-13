!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.prettyaml=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  "use strict";

  var typeOf = require('remedial').typeOf
    ;

  var indent = function (level) {
    var spaces = '';
    for (var i = 0; i < level; i++) {
      spaces += '  ';
    }
    return spaces;
  }

  function stringify(data) {
    var handlers
      , indentLevel = -1
      ;

    handlers = {
        "undefined": function () {
          // objects will not have `undefined` converted to `null`
          // as this may have unintended consequences
          // For arrays, however, this behavior seems appropriate
          return '';
        }
      , "null": function () {
          return '';
        }
      , "number": function (x) {
          return x;
        }
      , "boolean": function (x) {
          return x ? 'true' : 'false';
        }
      , "string": function (x) {
          // if the string contains newlines, use the | formatting
          if (x.indexOf('\n') != -1) {
            x = x.trim()
            return '|\n' + indent(indentLevel + 1) + x.replace(/\n/g, '\n' + indent(indentLevel + 1));
          }
          // if the string has [], {}, \t,  or is a enquoted number, use quotes
          else if (
            (x.indexOf('[') == 0) ||
            (x.indexOf(']') == x.length-1) ||
            (x.indexOf('{') == 0) ||
            (x.indexOf('}') == x.length-1) ||
            (x.indexOf('\t') != -1) ||
            (x == 'true') ||
            (x == 'false') ||
            (!isNaN(parseFloat(x)) && isFinite(x))
          ) {
            return JSON.stringify(x);
          }
          else {
            return x;
          }
        }
      , "array": function (x) {
          var output = ''
            ;

          if (0 === x.length) {
            output += '[]';
            return output;
          }

          indentLevel++;
          x.forEach(function (y) {
            // TODO how should `undefined` be handled?
            var handler = handlers[typeOf(y)]
              ;

            if (!handler) {
              throw new Error('cannot encode this: ' + typeOf(y));
            }

            output += '\n' + indent(indentLevel) + '- ' + handler(y);
             
          });
          indentLevel--;
          
          return output;
        }
      , "object": function (x) {
          var output = ''
            ;

          if (0 === Object.keys(x).length) {
            output += '{}';
            return output;
          }

          indentLevel++;
          Object.keys(x).forEach(function (k) {
            var val = x[k]
              , handler = handlers[typeOf(val)]
              ;

            if ('undefined' === typeof val) {
              // the user should do
              // delete obj.key
              // and not
              // obj.key = undefined
              // but we'll error on the side of caution
              return;
            }

            if (!handler) {
              throw new Error('cannot encode this: ' + typeOf(val));
            }

            // enquote the key if it is not a so recognizable string as it seems
            if (!(/^\w+$/.exec(k))) {
              k.replace(/"/g, '\\"');
              k = '"' + k + '"';
            }

            output += '\n' + indent(indentLevel) + k + ': ' + handler(val);
          });
          indentLevel--;

          return output;
        }
      , "function": function () {
          // TODO this should throw or otherwise be ignored
          return '[object Function]';
        }
    };

    var result = handlers[typeOf(data)](data);
    if (result[0] == '\n') {
      result = result.slice(1);
    }
    return result;
  }

  module.exports.stringify = stringify;
}());

},{"remedial":2}],2:[function(require,module,exports){
/*jslint onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
(function () {
    "use strict";

    var global = Function('return this')()
      , classes = "Boolean Number String Function Array Date RegExp Object".split(" ")
      , i
      , name
      , class2type = {}
      ;

    for (i in classes) {
      if (classes.hasOwnProperty(i)) {
        name = classes[i];
        class2type["[object " + name + "]"] = name.toLowerCase();
      }
    }

    function typeOf(obj) {
      return (null === obj || undefined === obj) ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
    }

    function isEmpty(o) {
        var i, v;
        if (typeOf(o) === 'object') {
            for (i in o) { // fails jslint
                v = o[i];
                if (v !== undefined && typeOf(v) !== 'function') {
                    return false;
                }
            }
        }
        return true;
    }

    if (!String.prototype.entityify) {
        String.prototype.entityify = function () {
            return this.replace(/&/g, "&amp;").replace(/</g,
                "&lt;").replace(/>/g, "&gt;");
        };
    }

    if (!String.prototype.quote) {
        String.prototype.quote = function () {
            var c, i, l = this.length, o = '"';
            for (i = 0; i < l; i += 1) {
                c = this.charAt(i);
                if (c >= ' ') {
                    if (c === '\\' || c === '"') {
                        o += '\\';
                    }
                    o += c;
                } else {
                    switch (c) {
                    case '\b':
                        o += '\\b';
                        break;
                    case '\f':
                        o += '\\f';
                        break;
                    case '\n':
                        o += '\\n';
                        break;
                    case '\r':
                        o += '\\r';
                        break;
                    case '\t':
                        o += '\\t';
                        break;
                    default:
                        c = c.charCodeAt();
                        o += '\\u00' + Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }
                }
            }
            return o + '"';
        };
    } 

    if (!String.prototype.supplant) {
        String.prototype.supplant = function (o) {
            return this.replace(/{([^{}]*)}/g,
                function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
    }

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
        };
    }

    // CommonJS / npm / Ender.JS
    module.exports = {
        typeOf: typeOf,
        isEmpty: isEmpty
    };
    global.typeOf = global.typeOf || typeOf;
    global.isEmpty = global.isEmpty || isEmpty;
}());

},{}]},{},[1])(1)
});