"use strict";
// 用来替换 navigator
var navigator = {
  appName: 'Netscape',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};
//  用来替换window
var window = {
  ASN1: null,
  Base64: null,
  Hex: null,
  crypto: null,
  href: null
};
var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

(function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }
    return o;
  }
  return r;
})()({
  1: [function(require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }

    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function() {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();

    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }

    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function(name) {
      return [];
    };

    process.binding = function(name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function() {
      return '/';
    };
    process.chdir = function(dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function() {
      return 0;
    };
  }, {}],
  2: [function(require, module, exports) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function TempCtor() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
  }, {}],
  3: [function(require, module, exports) {
    module.exports = function isBuffer(arg) {
      return arg && (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
    };
  }, {}],
  4: [function(require, module, exports) {
    (function(process, global) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x) {
          if (x === '%%') return '%';
          if (i >= len) return x;
          switch (x) {
            case '%s':
              return String(args[i++]);
            case '%d':
              return Number(args[i++]);
            case '%j':
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return '[Circular]';
              }
            default:
              return x;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += ' ' + x;
          } else {
            str += ' ' + inspect(x);
          }
        }
        return str;
      };

      // Mark that a method should not be used.
      // Returns a modified function which warns once by default.
      // If --no-deprecation is set, then it is a no-op.
      exports.deprecate = function(fn, msg) {
        // Allow for deprecating things in the process of starting up.
        if (isUndefined(global.process)) {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }

        if (process.noDeprecation === true) {
          return fn;
        }

        var warned = false;

        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }

        return deprecated;
      };

      var debugs = {};
      var debugEnviron;
      exports.debuglog = function(set) {
        if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error('%s %d: %s', set, pid, msg);
            };
          } else {
            debugs[set] = function() {};
          }
        }
        return debugs[set];
      };

      /**
       * Echos the value of a value. Trys to print the value out
       * in the best way possible given the different types.
       *
       * @param {Object} obj The object to print out.
       * @param {Object} opts Optional options object that alters the output.
       */
      /* legacy: obj, showHidden, depth, colors*/
      function inspect(obj, opts) {
        // default options
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          // legacy...
          ctx.showHidden = opts;
        } else if (opts) {
          // got an "options" object
          exports._extend(ctx, opts);
        }
        // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;

      // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
      inspect.colors = {
        'bold': [1, 22],
        'italic': [3, 23],
        'underline': [4, 24],
        'inverse': [7, 27],
        'white': [37, 39],
        'grey': [90, 39],
        'black': [30, 39],
        'blue': [34, 39],
        'cyan': [36, 39],
        'green': [32, 39],
        'magenta': [35, 39],
        'red': [31, 39],
        'yellow': [33, 39]
      };

      // Don't use 'blue' not visible on cmd.exe
      inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
      };

      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];

        if (style) {
          return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
        } else {
          return str;
        }
      }

      function stylizeNoColor(str, styleType) {
        return str;
      }

      function arrayToHash(array) {
        var hash = {};

        array.forEach(function(val, idx) {
          hash[val] = true;
        });

        return hash;
      }

      function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect && value && isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }

        // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }

        // Look up the keys of the object.
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);

        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }

        // IE doesn't make error fields non-enumerable
        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
        if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
          return formatError(value);
        }

        // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ': ' + value.name : '';
            return ctx.stylize('[Function' + name + ']', 'special');
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date');
          }
          if (isError(value)) {
            return formatError(value);
          }
        }

        var base = '',
          array = false,
          braces = ['{', '}'];

        // Make Array say that they are Array
        if (isArray(value)) {
          array = true;
          braces = ['[', ']'];
        }

        // Make functions say that they are functions
        if (isFunction(value)) {
          var n = value.name ? ': ' + value.name : '';
          base = ' [Function' + n + ']';
        }

        // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
          base = ' ' + RegExp.prototype.toString.call(value);
        }

        // Make dates with properties first say the date
        if (isDate(value)) {
          base = ' ' + Date.prototype.toUTCString.call(value);
        }

        // Make error with message first say the error
        if (isError(value)) {
          base = ' ' + formatError(value);
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }

        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          } else {
            return ctx.stylize('[Object]', 'special');
          }
        }

        ctx.seen.push(value);

        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }

        ctx.seen.pop();

        return reduceToSingleString(output, base, braces);
      }

      function formatPrimitive(ctx, value) {
        if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
        if (isString(value)) {
          var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
          return ctx.stylize(simple, 'string');
        }
        if (isNumber(value)) return ctx.stylize('' + value, 'number');
        if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
        // For some reason typeof null is "object", so special case here.
        if (isNull(value)) return ctx.stylize('null', 'null');
      }

      function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']';
      }

      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
          } else {
            output.push('');
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
          }
        });
        return output;
      }

      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || {
          value: value[key]
        };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special');
          } else {
            str = ctx.stylize('[Getter]', 'special');
          }
        } else {
          if (desc.set) {
            str = ctx.stylize('[Setter]', 'special');
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (array) {
                str = str.split('\n').map(function(line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + str.split('\n').map(function(line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = ctx.stylize('[Circular]', 'special');
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      }

      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf('\n') >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
        }, 0);

        if (length > 60) {
          return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;

      function isBoolean(arg) {
        return typeof arg === 'boolean';
      }
      exports.isBoolean = isBoolean;

      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;

      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;

      function isNumber(arg) {
        return typeof arg === 'number';
      }
      exports.isNumber = isNumber;

      function isString(arg) {
        return typeof arg === 'string';
      }
      exports.isString = isString;

      function isSymbol(arg) {
        return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === 'symbol';
      }
      exports.isSymbol = isSymbol;

      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;

      function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]';
      }
      exports.isRegExp = isRegExp;

      function isObject(arg) {
        return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === 'object' && arg !== null;
      }
      exports.isObject = isObject;

      function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]';
      }
      exports.isDate = isDate;

      function isError(e) {
        return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
      }
      exports.isError = isError;

      function isFunction(arg) {
        return typeof arg === 'function';
      }
      exports.isFunction = isFunction;

      function isPrimitive(arg) {
        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === 'symbol' || // ES6 symbol
          typeof arg === 'undefined';
      }
      exports.isPrimitive = isPrimitive;

      exports.isBuffer = require('./support/isBuffer');

      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }

      function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
      }

      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // 26 Feb 16:19:34
      function timestamp() {
        var d = new Date();
        var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
        return [d.getDate(), months[d.getMonth()], time].join(' ');
      }

      // log is just a thin wrapper to console.log that prepends a timestamp
      exports.log = function() {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
      };

      /**
       * Inherit the prototype methods from one constructor into another.
       *
       * The Function.prototype.inherits from lang.js rewritten as a standalone
       * function (not on Function.prototype). NOTE: If this file is to be loaded
       * during bootstrapping this function needs to be rewritten using some native
       * functions as prototype setup using normal JavaScript does not work as
       * expected during bootstrapping (see mirror.js in r114903).
       *
       * @param {function} ctor Constructor function which needs to inherit the
       *     prototype.
       * @param {function} superCtor Constructor function to inherit prototype from.
       */
      exports.inherits = require('inherits');

      exports._extend = function(origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };

      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {
    "./support/isBuffer": 3,
    "_process": 1,
    "inherits": 2
  }],
  5: [function(require, module, exports) {
    'use strict';

    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;

    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;

    function getLens(b64) {
      var len = b64.length;

      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
      }

      // Trim off extra bytes after placeholder bytes are found
      // See: https://github.com/beatgammit/base64-js/issues/42
      var validLen = b64.indexOf('=');
      if (validLen === -1) validLen = len;

      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;

      return [validLen, placeHoldersLen];
    }

    // base64 is 4/3 + up to two characters of the original data
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }

    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }

    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];

      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

      var curByte = 0;

      // if there are placeholders, only get up to the last complete 4 chars
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

      var i;
      for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
      }

      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
      }

      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
      }

      return arr;
    }

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    }

    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
      }
      return output.join('');
    }

    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
      }

      return parts.join('');
    }
  }, {}],
  6: [function(require, module, exports) {
    var SM4 = require('./src/sm4');

    module.exports = {
      sm4: SM4
    };
  }, {
    "./src/sm4": 8
  }],
  7: [function(require, module, exports) {
    'use strict';

    var base64js = require('base64-js');

    var Crypt = function() {
      function Crypt() {
        _classCallCheck(this, Crypt);
      }

      _createClass(Crypt, null, [{
        key: "stringToArrayBufferInUtf8",

        /**
         * Converts a JS string to an UTF-8 uint8array.
         *
         * @static
         * @param {String} str 16-bit unicode string.
         * @return {Uint8Array} UTF-8 Uint8Array.
         * @memberof Crypt
         */
        value: function stringToArrayBufferInUtf8(str) {
          // if not browser env, then require node.js's util. otherwise just use window's
          var TextEncoder = typeof window === 'undefined' ? require('util').TextEncoder : window.TextEncoder;
          // always utf-8
          var encoder = new TextEncoder();
          return encoder.encode(str);
        }

        /**
         * Converts an UTF-8 uint8array to a JS string.
         *
         * @static
         * @param {Uint8Array} strBuffer UTF-8 Uint8Array.
         * @return {String} 16-bit unicode string.
         * @memberof Crypt
         */

      }, {
        key: "utf8ArrayBufferToString",
        value: function utf8ArrayBufferToString(strBuffer) {
          // if not browser env, then require node.js's util. otherwise just use window's
          var TextDecoder = typeof window === 'undefined' ? require('util').TextDecoder : window.TextDecoder;
          var decoder = new TextDecoder('utf-8');
          return decoder.decode(strBuffer);
        }

        /**
         * crypt a utf8 byteArray to base64 string
         *
         * @static
         * @param {Uint8Array} strBuffer UTF-8 Uint8Array.
         * @returns {String} base64 str
         * @memberof Crypt
         */

      }, {
        key: "arrayBufferToBase64",
        value: function arrayBufferToBase64(strBuffer) {
          return base64js.fromByteArray(strBuffer);
        }

        /**
         * crypt base64 stringa to utf8 byteArray
         *
         * @static
         * @param {String} base64 str
         * @returns {Uint8Array} strBuffer UTF-8 Uint8Array.
         * @memberof Crypt
         */

      }, {
        key: "base64ToArrayBuffer",
        value: function base64ToArrayBuffer(base64) {
          return base64js.toByteArray(base64);
        }
      }]);

      return Crypt;
    }();

    module.exports = Crypt;
  }, {
    "base64-js": 5,
    "util": 4
  }],
  8: [function(require, module, exports) {
    'use strict';

    var Crypt = require('./crypt');

    var UINT8_BLOCK = 16;

    var Sbox = Uint8Array.from([0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05, 0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99, 0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62, 0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6, 0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8, 0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35, 0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87, 0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e, 0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1, 0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3, 0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f, 0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51, 0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8, 0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0, 0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84, 0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48]);

    var CK = Uint32Array.from([0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9, 0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9, 0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299, 0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279]);

    var FK = Uint32Array.from([0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc]);


    var SM4 = (function() {
      /**
       * Creates an instance of SM4.
       * @param {Object} config
       * @memberof SM4
       */
      function SM4(config) {
        _classCallCheck(this, SM4);

        var keyBuffer = Crypt.stringToArrayBufferInUtf8(config.key);
        if (keyBuffer.length !== 16) {
          throw new Error('key should be a 16 bytes string');
        }
        /**
         * key should be 16 bytes string
         * @member {Uint8Array} key
         */
        this.key = keyBuffer;
        /**
         * iv also should be 16 bytes string
         * @member {Uint8Array} iv
         */
        var ivBuffer = new Uint8Array(0);
        if (config.iv !== undefined && config.iv !== null) {
          // need iv
          ivBuffer = Crypt.stringToArrayBufferInUtf8(config.iv);
          if (ivBuffer.length !== 16) {
            throw new Error('iv should be a 16 bytes string');
          }
        }
        this.iv = ivBuffer;
        /**
         * sm4's encrypt mode
         * @member {Enum} mode
         */
        this.mode = 'cbc';
        if (['cbc', 'ecb'].indexOf(config.mode) >= 0) {
          // set encrypt mode. default is cbc
          this.mode = config.mode;
        }
        /**
         * sm4's cipher data type
         * @member {Enum} outType
         */
        this.cipherType = 'base64';
        if (['base64', 'text'].indexOf(config.outType) >= 0) {
          // set encrypt mode. default is cbc
          this.cipherType = config.outType;
        }
        /**
         * sm4's encrypt round key array
         * @member {Uint32Array} encryptRoundKeys
         */
        this.encryptRoundKeys = new Uint32Array(32);
        // spawn 32 round keys
        this.spawnEncryptRoundKeys();

        /**
         * sm4's decrypt round key array
         * @member {Uint32Array} encryptRoundKeys
         */
        this.decryptRoundKeys = Uint32Array.from(this.encryptRoundKeys);
        this.decryptRoundKeys.reverse();
      }

      /**
       * general sm4 encrypt/decrypt algorithm for a 16 bytes block using roundKey
       *
       * @param {Uint32Array} blockData
       * @param {Uint32Array} roundKeys
       * @return {Uint32Array} return a 16 bytes cipher block
       * @memberof SM4
       */


      _createClass(SM4, [{
        key: "doBlockCrypt",
        value: function doBlockCrypt(blockData, roundKeys) {
          var xBlock = new Uint32Array(36);
          xBlock.set(blockData, 0);
          // loop to process 32 rounds crypt
          for (var i = 0; i < 32; i++) {
            xBlock[i + 4] = xBlock[i] ^ this.tTransform1(xBlock[i + 1] ^ xBlock[i + 2] ^ xBlock[i + 3] ^ roundKeys[i]);
          }
          var yBlock = new Uint32Array(4);
          // reverse last 4 xBlock member
          yBlock[0] = xBlock[35];
          yBlock[1] = xBlock[34];
          yBlock[2] = xBlock[33];
          yBlock[3] = xBlock[32];
          return yBlock;
        }

        /**
         * spawn round key array for encrypt. reverse this key array when decrypt.
         * every round key's length is 32 bytes.
         * there are 32 round keys.
         * @return {Uint32Array}
         * @memberof SM4
         */

      }, {
        key: "spawnEncryptRoundKeys",
        value: function spawnEncryptRoundKeys() {
          // extract mk in key
          var mk = new Uint32Array(4);
          mk[0] = this.key[0] << 24 | this.key[1] << 16 | this.key[2] << 8 | this.key[3];
          mk[1] = this.key[4] << 24 | this.key[5] << 16 | this.key[6] << 8 | this.key[7];
          mk[2] = this.key[8] << 24 | this.key[9] << 16 | this.key[10] << 8 | this.key[11];
          mk[3] = this.key[12] << 24 | this.key[13] << 16 | this.key[14] << 8 | this.key[15];
          // calculate the K array
          var k = new Uint32Array(36);
          k[0] = mk[0] ^ FK[0];
          k[1] = mk[1] ^ FK[1];
          k[2] = mk[2] ^ FK[2];
          k[3] = mk[3] ^ FK[3];
          // loop to spawn 32 round keys
          for (var i = 0; i < 32; i++) {
            k[i + 4] = k[i] ^ this.tTransform2(k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ CK[i]);
            this.encryptRoundKeys[i] = k[i + 4];
          }
        }

        /**
         * left rotate x by y bits
         *
         * @param {*} x
         * @param {Number} y
         * @returns
         * @memberof SM4
         */

      }, {
        key: "rotateLeft",
        value: function rotateLeft(x, y) {
          return x << y | x >>> 32 - y;
        }

        /**
         * L transform function for encrypt
         *
         * @param {Uint32Number} b
         * @returns {Uint32Number}
         * @memberof SM4
         */

      }, {
        key: "linearTransform1",
        value: function linearTransform1(b) {
          return b ^ this.rotateLeft(b, 2) ^ this.rotateLeft(b, 10) ^ this.rotateLeft(b, 18) ^ this.rotateLeft(b, 24);
        }

        /**
         * L' transform function for key expand
         *
         * @param {Uint32Number} b
         * @returns {Uint32Number}
         * @memberof SM4
         */

      }, {
        key: "linearTransform2",
        value: function linearTransform2(b) {
          return b ^ this.rotateLeft(b, 13) ^ this.rotateLeft(b, 23);
        }

        /**
         * τ transform function
         *
         * @param {Uint32Number} a
         * @returns {Uint32Number}
         * @memberof SM4
         */

      }, {
        key: "tauTransform",
        value: function tauTransform(a) {
          return Sbox[a >>> 24 & 0xff] << 24 | Sbox[a >>> 16 & 0xff] << 16 | Sbox[a >>> 8 & 0xff] << 8 | Sbox[a & 0xff];
        }

        /**
         * mix replacement T transform for encrypt
         *
         * @param {Uint32Number} z
         * @returns {Uint32Number}
         * @memberof SM4
         */

      }, {
        key: "tTransform1",
        value: function tTransform1(z) {
          var b = this.tauTransform(z);
          var c = this.linearTransform1(b);
          return c;
        }

        /**
         * mix replacement T transform for key expand
         *
         * @param {Uint32Number} z
         * @returns {Uint32Number}
         * @memberof SM4
         */

      }, {
        key: "tTransform2",
        value: function tTransform2(z) {
          var b = this.tauTransform(z);
          var c = this.linearTransform2(b);
          return c;
        }

        /**
         * padding the array length to multiple of BLOCK
         *
         * @param {ByteArray} originalBuffer
         * @returns {ByteArray}
         * @memberof SM4
         */

      }, {
        key: "padding",
        value: function padding(originalBuffer) {
          if (originalBuffer === null) {
            return null;
          }
          var paddingLength = UINT8_BLOCK - originalBuffer.length % UINT8_BLOCK;
          var paddedBuffer = new Uint8Array(originalBuffer.length + paddingLength);
          paddedBuffer.set(originalBuffer, 0);
          paddedBuffer.fill(paddingLength, originalBuffer.length);
          return paddedBuffer;
        }

        /**
         * depadding the byte array to its original length
         *
         * @param {ByteArray} paddedBuffer
         * @returns {ByteArray}
         * @memberof SM4
         */

      }, {
        key: "dePadding",
        value: function dePadding(paddedBuffer) {
          if (paddedBuffer === null) {
            return null;
          }
          var paddingLength = paddedBuffer[paddedBuffer.length - 1];
          var originalBuffer = paddedBuffer.slice(0, paddedBuffer.length - paddingLength);
          return originalBuffer;
        }

        /**
         * exctract uint32 array block from uint8 array
         *
         * @param {Uint8Array} uint8Array
         * @param {Number} baseIndex
         * @returns {Uint32Array}
         * @memberof SM4
         */

      }, {
        key: "uint8ToUint32Block",
        value: function uint8ToUint32Block(uint8Array) {
          var baseIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

          var block = new Uint32Array(4); // make Uint8Array to Uint32Array block
          block[0] = uint8Array[baseIndex] << 24 | uint8Array[baseIndex + 1] << 16 | uint8Array[baseIndex + 2] << 8 | uint8Array[baseIndex + 3];
          block[1] = uint8Array[baseIndex + 4] << 24 | uint8Array[baseIndex + 5] << 16 | uint8Array[baseIndex + 6] << 8 | uint8Array[baseIndex + 7];
          block[2] = uint8Array[baseIndex + 8] << 24 | uint8Array[baseIndex + 9] << 16 | uint8Array[baseIndex + 10] << 8 | uint8Array[baseIndex + 11];
          block[3] = uint8Array[baseIndex + 12] << 24 | uint8Array[baseIndex + 13] << 16 | uint8Array[baseIndex + 14] << 8 | uint8Array[baseIndex + 15];
          return block;
        }

        /**
         * encrypt the string plaintext
         *
         * @param {String} plaintext
         * @memberof SM4
         * @return {String} ciphertext
         */

      }, {
        key: "encrypt",
        value: function encrypt(plaintext) {
          var plainByteArray = Crypt.stringToArrayBufferInUtf8(plaintext);
          var padded = this.padding(plainByteArray);
          var blockTimes = padded.length / UINT8_BLOCK;
          var outArray = new Uint8Array(padded.length);
          if (this.mode === 'cbc') {
            // CBC mode
            if (this.iv === null || this.iv.length !== 16) {
              throw new Error('iv error');
            }
            // init chain with iv (transform to uint32 block)
            var chainBlock = this.uint8ToUint32Block(this.iv);
            for (var i = 0; i < blockTimes; i++) {
              // extract the 16 bytes block data for this round to encrypt
              var roundIndex = i * UINT8_BLOCK;
              var block = this.uint8ToUint32Block(padded, roundIndex);
              // xor the chain block
              chainBlock[0] = chainBlock[0] ^ block[0];
              chainBlock[1] = chainBlock[1] ^ block[1];
              chainBlock[2] = chainBlock[2] ^ block[2];
              chainBlock[3] = chainBlock[3] ^ block[3];
              // use chain block to crypt
              var cipherBlock = this.doBlockCrypt(chainBlock, this.encryptRoundKeys);
              // make the cipher block be part of next chain block
              chainBlock = cipherBlock;
              for (var l = 0; l < UINT8_BLOCK; l++) {
                outArray[roundIndex + l] = cipherBlock[parseInt(l / 4)] >> (3 - l) % 4 * 8 & 0xff;
              }
            }
          } else {
            // this will be ECB mode
            for (var _i = 0; _i < blockTimes; _i++) {
              // extract the 16 bytes block data for this round to encrypt
              var _roundIndex = _i * UINT8_BLOCK;
              var _block = this.uint8ToUint32Block(padded, _roundIndex);
              var _cipherBlock = this.doBlockCrypt(_block, this.encryptRoundKeys);
              for (var _l = 0; _l < UINT8_BLOCK; _l++) {
                outArray[_roundIndex + _l] = _cipherBlock[parseInt(_l / 4)] >> (3 - _l) % 4 * 8 & 0xff;
              }
            }
          }

          // cipher array to string
          if (this.cipherType === 'base64') {
            return Crypt.arrayBufferToBase64(outArray);
          } else {
            // text
            return Crypt.utf8ArrayBufferToString(outArray);
          }
        }

        /**
         * decrypt the string ciphertext
         *
         * @param {String} ciphertext
         * @memberof SM4
         */

      }, {
        key: "decrypt",
        value: function decrypt(ciphertext) {
          // get cipher byte array
          var cipherByteArray = new Uint8Array();
          if (this.cipherType === 'base64') {
            // cipher is base64 string
            cipherByteArray = Crypt.base64ToArrayBuffer(ciphertext);
          } else {
            // cipher is text
            cipherByteArray = Crypt.stringToArrayBufferInUtf8(ciphertext);
          }
          var blockTimes = cipherByteArray.length / UINT8_BLOCK;
          var outArray = new Uint8Array(cipherByteArray.length);
          // decrypt the ciphertext by block
          if (this.mode === 'cbc') {
            // todo CBC mode
            if (this.iv === null || this.iv.length !== 16) {
              throw new Error('iv error');
            }
            // init chain with iv (transform to uint32 block)
            var chainBlock = this.uint8ToUint32Block(this.iv);
            for (var i = 0; i < blockTimes; i++) {
              // extract the 16 bytes block data for this round to encrypt
              var roundIndex = i * UINT8_BLOCK;
              // make Uint8Array to Uint32Array block
              var block = this.uint8ToUint32Block(cipherByteArray, roundIndex);
              // reverse the round keys to decrypt
              var plainBlockBeforeXor = this.doBlockCrypt(block, this.decryptRoundKeys);
              // xor the chain block
              var plainBlock = new Uint32Array(4);
              plainBlock[0] = chainBlock[0] ^ plainBlockBeforeXor[0];
              plainBlock[1] = chainBlock[1] ^ plainBlockBeforeXor[1];
              plainBlock[2] = chainBlock[2] ^ plainBlockBeforeXor[2];
              plainBlock[3] = chainBlock[3] ^ plainBlockBeforeXor[3];
              // make the cipher block be part of next chain block
              chainBlock = block;
              for (var l = 0; l < UINT8_BLOCK; l++) {
                outArray[roundIndex + l] = plainBlock[parseInt(l / 4)] >> (3 - l) % 4 * 8 & 0xff;
              }
            }
          } else {
            // ECB mode
            for (var _i2 = 0; _i2 < blockTimes; _i2++) {
              // extract the 16 bytes block data for this round to encrypt
              var _roundIndex2 = _i2 * UINT8_BLOCK;
              // make Uint8Array to Uint32Array block
              var _block2 = this.uint8ToUint32Block(cipherByteArray, _roundIndex2);
              // reverse the round keys to decrypt
              var _plainBlock = this.doBlockCrypt(_block2, this.decryptRoundKeys);
              for (var _l2 = 0; _l2 < UINT8_BLOCK; _l2++) {
                outArray[_roundIndex2 + _l2] = _plainBlock[parseInt(_l2 / 4)] >> (3 - _l2) % 4 * 8 & 0xff;
              }
            }
          }
          // depadding the decrypted data
          var depaddedPlaintext = this.dePadding(outArray);
          // transform data to utf8 string
          return Crypt.utf8ArrayBufferToString(depaddedPlaintext);
        }
      }]);

      return SM4;
    }());
    module.exports = SM4;
  }, {
    "./crypt": 7
  }],
  9: [function(require, module, exports) {
    var SM4 = require('gm-crypt').sm4;

    console.log("sm4", SM4);
    // exports= SM4
    module.exports = SM4
  }, {
    "gm-crypt": 6
  }]
}, {}, [9]);