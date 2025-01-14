// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dGdR":[function(require,module,exports) {
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
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
},{}],"JSid":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.bowser=t():e.bowser=t()}(this,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=90)}({17:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n=r(18),i=function(){function e(){}return e.getFirstMatch=function(e,t){var r=t.match(e);return r&&r.length>0&&r[1]||""},e.getSecondMatch=function(e,t){var r=t.match(e);return r&&r.length>1&&r[2]||""},e.matchAndReturnConst=function(e,t,r){if(e.test(t))return r},e.getWindowsVersionName=function(e){switch(e){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}},e.getMacOSVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),10===t[0])switch(t[1]){case 5:return"Leopard";case 6:return"Snow Leopard";case 7:return"Lion";case 8:return"Mountain Lion";case 9:return"Mavericks";case 10:return"Yosemite";case 11:return"El Capitan";case 12:return"Sierra";case 13:return"High Sierra";case 14:return"Mojave";case 15:return"Catalina";default:return}},e.getAndroidVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),!(1===t[0]&&t[1]<5))return 1===t[0]&&t[1]<6?"Cupcake":1===t[0]&&t[1]>=6?"Donut":2===t[0]&&t[1]<2?"Eclair":2===t[0]&&2===t[1]?"Froyo":2===t[0]&&t[1]>2?"Gingerbread":3===t[0]?"Honeycomb":4===t[0]&&t[1]<1?"Ice Cream Sandwich":4===t[0]&&t[1]<4?"Jelly Bean":4===t[0]&&t[1]>=4?"KitKat":5===t[0]?"Lollipop":6===t[0]?"Marshmallow":7===t[0]?"Nougat":8===t[0]?"Oreo":9===t[0]?"Pie":void 0},e.getVersionPrecision=function(e){return e.split(".").length},e.compareVersions=function(t,r,n){void 0===n&&(n=!1);var i=e.getVersionPrecision(t),s=e.getVersionPrecision(r),a=Math.max(i,s),o=0,u=e.map([t,r],(function(t){var r=a-e.getVersionPrecision(t),n=t+new Array(r+1).join(".0");return e.map(n.split("."),(function(e){return new Array(20-e.length).join("0")+e})).reverse()}));for(n&&(o=a-Math.min(i,s)),a-=1;a>=o;){if(u[0][a]>u[1][a])return 1;if(u[0][a]===u[1][a]){if(a===o)return 0;a-=1}else if(u[0][a]<u[1][a])return-1}},e.map=function(e,t){var r,n=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(r=0;r<e.length;r+=1)n.push(t(e[r]));return n},e.find=function(e,t){var r,n;if(Array.prototype.find)return Array.prototype.find.call(e,t);for(r=0,n=e.length;r<n;r+=1){var i=e[r];if(t(i,r))return i}},e.assign=function(e){for(var t,r,n=e,i=arguments.length,s=new Array(i>1?i-1:0),a=1;a<i;a++)s[a-1]=arguments[a];if(Object.assign)return Object.assign.apply(Object,[e].concat(s));var o=function(){var e=s[t];"object"==typeof e&&null!==e&&Object.keys(e).forEach((function(t){n[t]=e[t]}))};for(t=0,r=s.length;t<r;t+=1)o();return e},e.getBrowserAlias=function(e){return n.BROWSER_ALIASES_MAP[e]},e.getBrowserTypeByAlias=function(e){return n.BROWSER_MAP[e]||""},e}();t.default=i,e.exports=t.default},18:function(e,t,r){"use strict";t.__esModule=!0,t.ENGINE_MAP=t.OS_MAP=t.PLATFORMS_MAP=t.BROWSER_MAP=t.BROWSER_ALIASES_MAP=void 0;t.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};t.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};t.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};t.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};t.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"}},90:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(91))&&n.__esModule?n:{default:n},s=r(18);function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=function(){function e(){}var t,r,n;return e.getParser=function(e,t){if(void 0===t&&(t=!1),"string"!=typeof e)throw new Error("UserAgent should be a string");return new i.default(e,t)},e.parse=function(e){return new i.default(e).getResult()},t=e,n=[{key:"BROWSER_MAP",get:function(){return s.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return s.ENGINE_MAP}},{key:"OS_MAP",get:function(){return s.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return s.PLATFORMS_MAP}}],(r=null)&&a(t.prototype,r),n&&a(t,n),e}();t.default=o,e.exports=t.default},91:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n=u(r(92)),i=u(r(93)),s=u(r(94)),a=u(r(95)),o=u(r(17));function u(e){return e&&e.__esModule?e:{default:e}}var d=function(){function e(e,t){if(void 0===t&&(t=!1),null==e||""===e)throw new Error("UserAgent parameter can't be empty");this._ua=e,this.parsedResult={},!0!==t&&this.parse()}var t=e.prototype;return t.getUA=function(){return this._ua},t.test=function(e){return e.test(this._ua)},t.parseBrowser=function(){var e=this;this.parsedResult.browser={};var t=o.default.find(n.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.browser=t.describe(this.getUA())),this.parsedResult.browser},t.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},t.getBrowserName=function(e){return e?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},t.getBrowserVersion=function(){return this.getBrowser().version},t.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},t.parseOS=function(){var e=this;this.parsedResult.os={};var t=o.default.find(i.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.os=t.describe(this.getUA())),this.parsedResult.os},t.getOSName=function(e){var t=this.getOS().name;return e?String(t).toLowerCase()||"":t||""},t.getOSVersion=function(){return this.getOS().version},t.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},t.getPlatformType=function(e){void 0===e&&(e=!1);var t=this.getPlatform().type;return e?String(t).toLowerCase()||"":t||""},t.parsePlatform=function(){var e=this;this.parsedResult.platform={};var t=o.default.find(s.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.platform=t.describe(this.getUA())),this.parsedResult.platform},t.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},t.getEngineName=function(e){return e?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},t.parseEngine=function(){var e=this;this.parsedResult.engine={};var t=o.default.find(a.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.engine=t.describe(this.getUA())),this.parsedResult.engine},t.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},t.getResult=function(){return o.default.assign({},this.parsedResult)},t.satisfies=function(e){var t=this,r={},n=0,i={},s=0;if(Object.keys(e).forEach((function(t){var a=e[t];"string"==typeof a?(i[t]=a,s+=1):"object"==typeof a&&(r[t]=a,n+=1)})),n>0){var a=Object.keys(r),u=o.default.find(a,(function(e){return t.isOS(e)}));if(u){var d=this.satisfies(r[u]);if(void 0!==d)return d}var c=o.default.find(a,(function(e){return t.isPlatform(e)}));if(c){var f=this.satisfies(r[c]);if(void 0!==f)return f}}if(s>0){var l=Object.keys(i),h=o.default.find(l,(function(e){return t.isBrowser(e,!0)}));if(void 0!==h)return this.compareVersion(i[h])}},t.isBrowser=function(e,t){void 0===t&&(t=!1);var r=this.getBrowserName().toLowerCase(),n=e.toLowerCase(),i=o.default.getBrowserTypeByAlias(n);return t&&i&&(n=i.toLowerCase()),n===r},t.compareVersion=function(e){var t=[0],r=e,n=!1,i=this.getBrowserVersion();if("string"==typeof i)return">"===e[0]||"<"===e[0]?(r=e.substr(1),"="===e[1]?(n=!0,r=e.substr(2)):t=[],">"===e[0]?t.push(1):t.push(-1)):"="===e[0]?r=e.substr(1):"~"===e[0]&&(n=!0,r=e.substr(1)),t.indexOf(o.default.compareVersions(i,r,n))>-1},t.isOS=function(e){return this.getOSName(!0)===String(e).toLowerCase()},t.isPlatform=function(e){return this.getPlatformType(!0)===String(e).toLowerCase()},t.isEngine=function(e){return this.getEngineName(!0)===String(e).toLowerCase()},t.is=function(e,t){return void 0===t&&(t=!1),this.isBrowser(e,t)||this.isOS(e)||this.isPlatform(e)},t.some=function(e){var t=this;return void 0===e&&(e=[]),e.some((function(e){return t.is(e)}))},e}();t.default=d,e.exports=t.default},92:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n};var s=/version\/(\d+(\.?_?\d+)+)/i,a=[{test:[/googlebot/i],describe:function(e){var t={name:"Googlebot"},r=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/opera/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opr\/|opios/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/SamsungBrowser/i],describe:function(e){var t={name:"Samsung Internet for Android"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Whale/i],describe:function(e){var t={name:"NAVER Whale Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MZBrowser/i],describe:function(e){var t={name:"MZ Browser"},r=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/focus/i],describe:function(e){var t={name:"Focus"},r=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/swing/i],describe:function(e){var t={name:"Swing"},r=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/coast/i],describe:function(e){var t={name:"Opera Coast"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opt\/\d+(?:.?_?\d+)+/i],describe:function(e){var t={name:"Opera Touch"},r=i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/yabrowser/i],describe:function(e){var t={name:"Yandex Browser"},r=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/ucbrowser/i],describe:function(e){var t={name:"UC Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Maxthon|mxios/i],describe:function(e){var t={name:"Maxthon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/epiphany/i],describe:function(e){var t={name:"Epiphany"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/puffin/i],describe:function(e){var t={name:"Puffin"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sleipnir/i],describe:function(e){var t={name:"Sleipnir"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/k-meleon/i],describe:function(e){var t={name:"K-Meleon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/micromessenger/i],describe:function(e){var t={name:"WeChat"},r=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qqbrowser/i],describe:function(e){var t={name:/qqbrowserlite/i.test(e)?"QQ Browser Lite":"QQ Browser"},r=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/msie|trident/i],describe:function(e){var t={name:"Internet Explorer"},r=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/\sedg\//i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/edg([ea]|ios)/i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/vivaldi/i],describe:function(e){var t={name:"Vivaldi"},r=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/seamonkey/i],describe:function(e){var t={name:"SeaMonkey"},r=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sailfish/i],describe:function(e){var t={name:"Sailfish"},r=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,e);return r&&(t.version=r),t}},{test:[/silk/i],describe:function(e){var t={name:"Amazon Silk"},r=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/phantom/i],describe:function(e){var t={name:"PhantomJS"},r=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/slimerjs/i],describe:function(e){var t={name:"SlimerJS"},r=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t={name:"BlackBerry"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t={name:"WebOS Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/bada/i],describe:function(e){var t={name:"Bada"},r=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/tizen/i],describe:function(e){var t={name:"Tizen"},r=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qupzilla/i],describe:function(e){var t={name:"QupZilla"},r=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/firefox|iceweasel|fxios/i],describe:function(e){var t={name:"Firefox"},r=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/electron/i],describe:function(e){var t={name:"Electron"},r=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MiuiBrowser/i],describe:function(e){var t={name:"Miui"},r=i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/chromium/i],describe:function(e){var t={name:"Chromium"},r=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/chrome|crios|crmo/i],describe:function(e){var t={name:"Chrome"},r=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/GSA/i],describe:function(e){var t={name:"Google Search"},r=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t={name:"Android Browser"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/playstation 4/i],describe:function(e){var t={name:"PlayStation 4"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/safari|applewebkit/i],describe:function(e){var t={name:"Safari"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/.*/i],describe:function(e){var t=-1!==e.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return{name:i.default.getFirstMatch(t,e),version:i.default.getSecondMatch(t,e)}}}];t.default=a,e.exports=t.default},93:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/Roku\/DVP/],describe:function(e){var t=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,e);return{name:s.OS_MAP.Roku,version:t}}},{test:[/windows phone/i],describe:function(e){var t=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.WindowsPhone,version:t}}},{test:[/windows /i],describe:function(e){var t=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,e),r=i.default.getWindowsVersionName(t);return{name:s.OS_MAP.Windows,version:t,versionName:r}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(e){var t={name:s.OS_MAP.iOS},r=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,e);return r&&(t.version=r),t}},{test:[/macintosh/i],describe:function(e){var t=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,e).replace(/[_\s]/g,"."),r=i.default.getMacOSVersionName(t),n={name:s.OS_MAP.MacOS,version:t};return r&&(n.versionName=r),n}},{test:[/(ipod|iphone|ipad)/i],describe:function(e){var t=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,e).replace(/[_\s]/g,".");return{name:s.OS_MAP.iOS,version:t}}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,e),r=i.default.getAndroidVersionName(t),n={name:s.OS_MAP.Android,version:t};return r&&(n.versionName=r),n}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,e),r={name:s.OS_MAP.WebOS};return t&&t.length&&(r.version=t),r}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,e)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,e)||i.default.getFirstMatch(/\bbb(\d+)/i,e);return{name:s.OS_MAP.BlackBerry,version:t}}},{test:[/bada/i],describe:function(e){var t=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.Bada,version:t}}},{test:[/tizen/i],describe:function(e){var t=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.Tizen,version:t}}},{test:[/linux/i],describe:function(){return{name:s.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return{name:s.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(e){var t=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,e);return{name:s.OS_MAP.PlayStation4,version:t}}}];t.default=a,e.exports=t.default},94:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/googlebot/i],describe:function(){return{type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(e){var t=i.default.getFirstMatch(/(can-l01)/i,e)&&"Nova",r={type:s.PLATFORMS_MAP.mobile,vendor:"Huawei"};return t&&(r.model=t),r}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return{type:s.PLATFORMS_MAP.tablet}}},{test:function(e){var t=e.test(/ipod|iphone/i),r=e.test(/like (ipod|iphone)/i);return t&&!r},describe:function(e){var t=i.default.getFirstMatch(/(ipod|iphone)/i,e);return{type:s.PLATFORMS_MAP.mobile,vendor:"Apple",model:t}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"blackberry"===e.getBrowserName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(e){return"bada"===e.getBrowserName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"windows phone"===e.getBrowserName()},describe:function(){return{type:s.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(e){var t=Number(String(e.getOSVersion()).split(".")[0]);return"android"===e.getOSName(!0)&&t>=3},describe:function(){return{type:s.PLATFORMS_MAP.tablet}}},{test:function(e){return"android"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return"macos"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(e){return"windows"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return"linux"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return"playstation 4"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.tv}}},{test:function(e){return"roku"===e.getOSName(!0)},describe:function(){return{type:s.PLATFORMS_MAP.tv}}}];t.default=a,e.exports=t.default},95:function(e,t,r){"use strict";t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:function(e){return"microsoft edge"===e.getBrowserName(!0)},describe:function(e){if(/\sedg\//i.test(e))return{name:s.ENGINE_MAP.Blink};var t=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,e);return{name:s.ENGINE_MAP.EdgeHTML,version:t}}},{test:[/trident/i],describe:function(e){var t={name:s.ENGINE_MAP.Trident},r=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){return e.test(/presto/i)},describe:function(e){var t={name:s.ENGINE_MAP.Presto},r=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=e.test(/gecko/i),r=e.test(/like gecko/i);return t&&!r},describe:function(e){var t={name:s.ENGINE_MAP.Gecko},r=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return{name:s.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(e){var t={name:s.ENGINE_MAP.WebKit},r=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}}];t.default=a,e.exports=t.default}})}));
},{}],"LVkZ":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"MTTc":[function(require,module,exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  createDebug.destroy = destroy;
  Object.keys(env).forEach(key => {
    createDebug[key] = env[key];
  });
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    let hash = 0;

    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;

    function debug(...args) {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      const self = debug; // Set `diff` timestamp

      const curr = Number(new Date());
      const ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }

        index++;
        const formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          const val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
      set: v => {
        enableOverride = v;
      }
    }); // Env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    return debug;
  }

  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    const len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
    createDebug.enable('');
    return namespaces;
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    let i;
    let len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }
  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */


  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;
},{"ms":"LVkZ"}],"dJPe":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
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

(function () {
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
  } // if setTimeout wasn't available but was latter defined


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
  } // if clearTimeout wasn't available but was latter defined


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

process.nextTick = function (fun) {
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
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
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

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"jD9Y":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

exports.destroy = (() => {
  let warned = false;
  return () => {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
})();
/**
 * Colors.
 */


exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */


exports.log = console.debug || console.log || (() => {});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"MTTc","process":"dJPe"}],"andi":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

const debug_1 = __importDefault(require("debug"));

const APP_NAME = 'mediasoup-client';

class Logger {
  constructor(prefix) {
    if (prefix) {
      this._debug = debug_1.default(`${APP_NAME}:${prefix}`);
      this._warn = debug_1.default(`${APP_NAME}:WARN:${prefix}`);
      this._error = debug_1.default(`${APP_NAME}:ERROR:${prefix}`);
    } else {
      this._debug = debug_1.default(APP_NAME);
      this._warn = debug_1.default(`${APP_NAME}:WARN`);
      this._error = debug_1.default(`${APP_NAME}:ERROR`);
    }
    /* eslint-disable no-console */


    this._debug.log = console.info.bind(console);
    this._warn.log = console.warn.bind(console);
    this._error.log = console.error.bind(console);
    /* eslint-enable no-console */
  }

  get debug() {
    return this._debug;
  }

  get warn() {
    return this._warn;
  }

  get error() {
    return this._error;
  }

}

exports.Logger = Logger;
},{"debug":"jD9Y"}],"P3Oo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnhancedEventEmitter = void 0;

const events_1 = require("events");

const Logger_1 = require("./Logger");

const logger = new Logger_1.Logger('EnhancedEventEmitter');

class EnhancedEventEmitter extends events_1.EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(Infinity);
  }

  safeEmit(event, ...args) {
    const numListeners = this.listenerCount(event);

    try {
      return this.emit(event, ...args);
    } catch (error) {
      logger.error('safeEmit() | event listener threw an error [event:%s]:%o', event, error);
      return Boolean(numListeners);
    }
  }

  async safeEmitAsPromise(event, ...args) {
    return new Promise((resolve, reject) => {
      try {
        this.emit(event, ...args, resolve, reject);
      } catch (error) {
        logger.error('safeEmitAsPromise() | event listener threw an error [event:%s]:%o', event, error);
        reject(error);
      }
    });
  }

}

exports.EnhancedEventEmitter = EnhancedEventEmitter;
},{"events":"dGdR","./Logger":"andi"}],"hNUz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidStateError = exports.UnsupportedError = void 0;
/**
 * Error indicating not support for something.
 */

class UnsupportedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnsupportedError';

    if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
      {
        // @ts-ignore
        Error.captureStackTrace(this, UnsupportedError);
      } else {
      this.stack = new Error(message).stack;
    }
  }

}

exports.UnsupportedError = UnsupportedError;
/**
 * Error produced when calling a method in an invalid state.
 */

class InvalidStateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidStateError';

    if (Error.hasOwnProperty('captureStackTrace')) // Just in V8.
      {
        // @ts-ignore
        Error.captureStackTrace(this, InvalidStateError);
      } else {
      this.stack = new Error(message).stack;
    }
  }

}

exports.InvalidStateError = InvalidStateError;
},{}],"fnp2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandomNumber = exports.clone = void 0;
/**
 * Clones the given data.
 */

function clone(data, defaultValue) {
  if (typeof data === 'undefined') return defaultValue;
  return JSON.parse(JSON.stringify(data));
}

exports.clone = clone;
/**
 * Generates a random positive integer.
 */

function generateRandomNumber() {
  return Math.round(Math.random() * 10000000);
}

exports.generateRandomNumber = generateRandomNumber;
},{}],"lc3R":[function(require,module,exports) {
const debug = require('debug')('h264-profile-level-id');
/* eslint-disable no-console */


debug.log = console.info.bind(console);
/* eslint-enable no-console */

const ProfileConstrainedBaseline = 1;
const ProfileBaseline = 2;
const ProfileMain = 3;
const ProfileConstrainedHigh = 4;
const ProfileHigh = 5;
exports.ProfileConstrainedBaseline = ProfileConstrainedBaseline;
exports.ProfileBaseline = ProfileBaseline;
exports.ProfileMain = ProfileMain;
exports.ProfileConstrainedHigh = ProfileConstrainedHigh;
exports.ProfileHigh = ProfileHigh; // All values are equal to ten times the level number, except level 1b which is
// special.

const Level1_b = 0;
const Level1 = 10;
const Level1_1 = 11;
const Level1_2 = 12;
const Level1_3 = 13;
const Level2 = 20;
const Level2_1 = 21;
const Level2_2 = 22;
const Level3 = 30;
const Level3_1 = 31;
const Level3_2 = 32;
const Level4 = 40;
const Level4_1 = 41;
const Level4_2 = 42;
const Level5 = 50;
const Level5_1 = 51;
const Level5_2 = 52;
exports.Level1_b = Level1_b;
exports.Level1 = Level1;
exports.Level1_1 = Level1_1;
exports.Level1_2 = Level1_2;
exports.Level1_3 = Level1_3;
exports.Level2 = Level2;
exports.Level2_1 = Level2_1;
exports.Level2_2 = Level2_2;
exports.Level3 = Level3;
exports.Level3_1 = Level3_1;
exports.Level3_2 = Level3_2;
exports.Level4 = Level4;
exports.Level4_1 = Level4_1;
exports.Level4_2 = Level4_2;
exports.Level5 = Level5;
exports.Level5_1 = Level5_1;
exports.Level5_2 = Level5_2;

class ProfileLevelId {
  constructor(profile, level) {
    this.profile = profile;
    this.level = level;
  }

}

exports.ProfileLevelId = ProfileLevelId; // Default ProfileLevelId.
//
// TODO: The default should really be profile Baseline and level 1 according to
// the spec: https://tools.ietf.org/html/rfc6184#section-8.1. In order to not
// break backwards compatibility with older versions of WebRTC where external
// codecs don't have any parameters, use profile ConstrainedBaseline level 3_1
// instead. This workaround will only be done in an interim period to allow
// external clients to update their code.
//
// http://crbug/webrtc/6337.

const DefaultProfileLevelId = new ProfileLevelId(ProfileConstrainedBaseline, Level3_1); // For level_idc=11 and profile_idc=0x42, 0x4D, or 0x58, the constraint set3
// flag specifies if level 1b or level 1.1 is used.

const ConstraintSet3Flag = 0x10; // Class for matching bit patterns such as "x1xx0000" where 'x' is allowed to be
// either 0 or 1.

class BitPattern {
  constructor(str) {
    this._mask = ~byteMaskString('x', str);
    this._maskedValue = byteMaskString('1', str);
  }

  isMatch(value) {
    return this._maskedValue === (value & this._mask);
  }

} // Class for converting between profile_idc/profile_iop to Profile.


class ProfilePattern {
  constructor(profile_idc, profile_iop, profile) {
    this.profile_idc = profile_idc;
    this.profile_iop = profile_iop;
    this.profile = profile;
  }

} // This is from https://tools.ietf.org/html/rfc6184#section-8.1.


const ProfilePatterns = [new ProfilePattern(0x42, new BitPattern('x1xx0000'), ProfileConstrainedBaseline), new ProfilePattern(0x4D, new BitPattern('1xxx0000'), ProfileConstrainedBaseline), new ProfilePattern(0x58, new BitPattern('11xx0000'), ProfileConstrainedBaseline), new ProfilePattern(0x42, new BitPattern('x0xx0000'), ProfileBaseline), new ProfilePattern(0x58, new BitPattern('10xx0000'), ProfileBaseline), new ProfilePattern(0x4D, new BitPattern('0x0x0000'), ProfileMain), new ProfilePattern(0x64, new BitPattern('00000000'), ProfileHigh), new ProfilePattern(0x64, new BitPattern('00001100'), ProfileConstrainedHigh)];
/**
 * Parse profile level id that is represented as a string of 3 hex bytes.
 * Nothing will be returned if the string is not a recognized H264 profile
 * level id.
 *
 * @param {String} str - profile-level-id value as a string of 3 hex bytes.
 *
 * @returns {ProfileLevelId}
 */

exports.parseProfileLevelId = function (str) {
  // The string should consist of 3 bytes in hexadecimal format.
  if (typeof str !== 'string' || str.length !== 6) return null;
  const profile_level_id_numeric = parseInt(str, 16);
  if (profile_level_id_numeric === 0) return null; // Separate into three bytes.

  const level_idc = profile_level_id_numeric & 0xFF;
  const profile_iop = profile_level_id_numeric >> 8 & 0xFF;
  const profile_idc = profile_level_id_numeric >> 16 & 0xFF; // Parse level based on level_idc and constraint set 3 flag.

  let level;

  switch (level_idc) {
    case Level1_1:
      {
        level = (profile_iop & ConstraintSet3Flag) !== 0 ? Level1_b : Level1_1;
        break;
      }

    case Level1:
    case Level1_2:
    case Level1_3:
    case Level2:
    case Level2_1:
    case Level2_2:
    case Level3:
    case Level3_1:
    case Level3_2:
    case Level4:
    case Level4_1:
    case Level4_2:
    case Level5:
    case Level5_1:
    case Level5_2:
      {
        level = level_idc;
        break;
      }
    // Unrecognized level_idc.

    default:
      {
        debug('parseProfileLevelId() | unrecognized level_idc:%s', level_idc);
        return null;
      }
  } // Parse profile_idc/profile_iop into a Profile enum.


  for (const pattern of ProfilePatterns) {
    if (profile_idc === pattern.profile_idc && pattern.profile_iop.isMatch(profile_iop)) {
      return new ProfileLevelId(pattern.profile, level);
    }
  }

  debug('parseProfileLevelId() | unrecognized profile_idc/profile_iop combination');
  return null;
};
/**
 * Returns canonical string representation as three hex bytes of the profile
 * level id, or returns nothing for invalid profile level ids.
 *
 * @param {ProfileLevelId} profile_level_id
 *
 * @returns {String}
 */


exports.profileLevelIdToString = function (profile_level_id) {
  // Handle special case level == 1b.
  if (profile_level_id.level == Level1_b) {
    switch (profile_level_id.profile) {
      case ProfileConstrainedBaseline:
        {
          return '42f00b';
        }

      case ProfileBaseline:
        {
          return '42100b';
        }

      case ProfileMain:
        {
          return '4d100b';
        }
      // Level 1_b is not allowed for other profiles.

      default:
        {
          debug('profileLevelIdToString() | Level 1_b not is allowed for profile:%s', profile_level_id.profile);
          return null;
        }
    }
  }

  let profile_idc_iop_string;

  switch (profile_level_id.profile) {
    case ProfileConstrainedBaseline:
      {
        profile_idc_iop_string = '42e0';
        break;
      }

    case ProfileBaseline:
      {
        profile_idc_iop_string = '4200';
        break;
      }

    case ProfileMain:
      {
        profile_idc_iop_string = '4d00';
        break;
      }

    case ProfileConstrainedHigh:
      {
        profile_idc_iop_string = '640c';
        break;
      }

    case ProfileHigh:
      {
        profile_idc_iop_string = '6400';
        break;
      }

    default:
      {
        debug('profileLevelIdToString() | unrecognized profile:%s', profile_level_id.profile);
        return null;
      }
  }

  let levelStr = profile_level_id.level.toString(16);
  if (levelStr.length === 1) levelStr = `0${levelStr}`;
  return `${profile_idc_iop_string}${levelStr}`;
};
/**
 * Parse profile level id that is represented as a string of 3 hex bytes
 * contained in an SDP key-value map. A default profile level id will be
 * returned if the profile-level-id key is missing. Nothing will be returned if
 * the key is present but the string is invalid.
 *
 * @param {Object} [params={}] - Codec parameters object.
 *
 * @returns {ProfileLevelId}
 */


exports.parseSdpProfileLevelId = function (params = {}) {
  const profile_level_id = params['profile-level-id'];
  return !profile_level_id ? DefaultProfileLevelId : exports.parseProfileLevelId(profile_level_id);
};
/**
 * Returns true if the parameters have the same H264 profile, i.e. the same
 * H264 profile (Baseline, High, etc).
 *
 * @param {Object} [params1={}] - Codec parameters object.
 * @param {Object} [params2={}] - Codec parameters object.
 *
 * @returns {Boolean}
 */


exports.isSameProfile = function (params1 = {}, params2 = {}) {
  const profile_level_id_1 = exports.parseSdpProfileLevelId(params1);
  const profile_level_id_2 = exports.parseSdpProfileLevelId(params2); // Compare H264 profiles, but not levels.

  return Boolean(profile_level_id_1 && profile_level_id_2 && profile_level_id_1.profile === profile_level_id_2.profile);
};
/**
 * Generate codec parameters that will be used as answer in an SDP negotiation
 * based on local supported parameters and remote offered parameters. Both
 * local_supported_params and remote_offered_params represent sendrecv media
 * descriptions, i.e they are a mix of both encode and decode capabilities. In
 * theory, when the profile in local_supported_params represent a strict superset
 * of the profile in remote_offered_params, we could limit the profile in the
 * answer to the profile in remote_offered_params.
 *
 * However, to simplify the code, each supported H264 profile should be listed
 * explicitly in the list of local supported codecs, even if they are redundant.
 * Then each local codec in the list should be tested one at a time against the
 * remote codec, and only when the profiles are equal should this function be
 * called. Therefore, this function does not need to handle profile intersection,
 * and the profile of local_supported_params and remote_offered_params must be
 * equal before calling this function. The parameters that are used when
 * negotiating are the level part of profile-level-id and level-asymmetry-allowed.
 *
 * @param {Object} [local_supported_params={}]
 * @param {Object} [remote_offered_params={}]
 *
 * @returns {String} Canonical string representation as three hex bytes of the
 *   profile level id, or null if no one of the params have profile-level-id.
 *
 * @throws {TypeError} If Profile mismatch or invalid params.
 */


exports.generateProfileLevelIdForAnswer = function (local_supported_params = {}, remote_offered_params = {}) {
  // If both local and remote params do not contain profile-level-id, they are
  // both using the default profile. In this case, don't return anything.
  if (!local_supported_params['profile-level-id'] && !remote_offered_params['profile-level-id']) {
    debug('generateProfileLevelIdForAnswer() | no profile-level-id in local and remote params');
    return null;
  } // Parse profile-level-ids.


  const local_profile_level_id = exports.parseSdpProfileLevelId(local_supported_params);
  const remote_profile_level_id = exports.parseSdpProfileLevelId(remote_offered_params); // The local and remote codec must have valid and equal H264 Profiles.

  if (!local_profile_level_id) throw new TypeError('invalid local_profile_level_id');
  if (!remote_profile_level_id) throw new TypeError('invalid remote_profile_level_id');
  if (local_profile_level_id.profile !== remote_profile_level_id.profile) throw new TypeError('H264 Profile mismatch'); // Parse level information.

  const level_asymmetry_allowed = isLevelAsymmetryAllowed(local_supported_params) && isLevelAsymmetryAllowed(remote_offered_params);
  const local_level = local_profile_level_id.level;
  const remote_level = remote_profile_level_id.level;
  const min_level = minLevel(local_level, remote_level); // Determine answer level. When level asymmetry is not allowed, level upgrade
  // is not allowed, i.e., the level in the answer must be equal to or lower
  // than the level in the offer.

  const answer_level = level_asymmetry_allowed ? local_level : min_level;
  debug('generateProfileLevelIdForAnswer() | result: [profile:%s, level:%s]', local_profile_level_id.profile, answer_level); // Return the resulting profile-level-id for the answer parameters.

  return exports.profileLevelIdToString(new ProfileLevelId(local_profile_level_id.profile, answer_level));
}; // Convert a string of 8 characters into a byte where the positions containing
// character c will have their bit set. For example, c = 'x', str = "x1xx0000"
// will return 0b10110000.


function byteMaskString(c, str) {
  return (str[0] === c) << 7 | (str[1] === c) << 6 | (str[2] === c) << 5 | (str[3] === c) << 4 | (str[4] === c) << 3 | (str[5] === c) << 2 | (str[6] === c) << 1 | (str[7] === c) << 0;
} // Compare H264 levels and handle the level 1b case.


function isLessLevel(a, b) {
  if (a === Level1_b) return b !== Level1 && b !== Level1_b;
  if (b === Level1_b) return a !== Level1;
  return a < b;
}

function minLevel(a, b) {
  return isLessLevel(a, b) ? a : b;
}

function isLevelAsymmetryAllowed(params = {}) {
  const level_asymmetry_allowed = params['level-asymmetry-allowed'];
  return level_asymmetry_allowed === 1 || level_asymmetry_allowed === '1';
}
},{"debug":"jD9Y"}],"y0TR":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canReceive = exports.canSend = exports.generateProbatorRtpParameters = exports.reduceCodecs = exports.getSendingRemoteRtpParameters = exports.getSendingRtpParameters = exports.getRecvRtpCapabilities = exports.getExtendedRtpCapabilities = exports.validateSctpStreamParameters = exports.validateSctpParameters = exports.validateNumSctpStreams = exports.validateSctpCapabilities = exports.validateRtcpParameters = exports.validateRtpEncodingParameters = exports.validateRtpHeaderExtensionParameters = exports.validateRtpCodecParameters = exports.validateRtpParameters = exports.validateRtpHeaderExtension = exports.validateRtcpFeedback = exports.validateRtpCodecCapability = exports.validateRtpCapabilities = void 0;

const h264 = __importStar(require("h264-profile-level-id"));

const utils = __importStar(require("./utils"));

const RTP_PROBATOR_MID = 'probator';
const RTP_PROBATOR_SSRC = 1234;
const RTP_PROBATOR_CODEC_PAYLOAD_TYPE = 127;
/**
 * Validates RtpCapabilities. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpCapabilities(caps) {
  if (typeof caps !== 'object') throw new TypeError('caps is not an object'); // codecs is optional. If unset, fill with an empty array.

  if (caps.codecs && !Array.isArray(caps.codecs)) throw new TypeError('caps.codecs is not an array');else if (!caps.codecs) caps.codecs = [];

  for (const codec of caps.codecs) {
    validateRtpCodecCapability(codec);
  } // headerExtensions is optional. If unset, fill with an empty array.


  if (caps.headerExtensions && !Array.isArray(caps.headerExtensions)) throw new TypeError('caps.headerExtensions is not an array');else if (!caps.headerExtensions) caps.headerExtensions = [];

  for (const ext of caps.headerExtensions) {
    validateRtpHeaderExtension(ext);
  }
}

exports.validateRtpCapabilities = validateRtpCapabilities;
/**
 * Validates RtpCodecCapability. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpCodecCapability(codec) {
  const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
  if (typeof codec !== 'object') throw new TypeError('codec is not an object'); // mimeType is mandatory.

  if (!codec.mimeType || typeof codec.mimeType !== 'string') throw new TypeError('missing codec.mimeType');
  const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
  if (!mimeTypeMatch) throw new TypeError('invalid codec.mimeType'); // Just override kind with media component of mimeType.

  codec.kind = mimeTypeMatch[1].toLowerCase(); // preferredPayloadType is optional.

  if (codec.preferredPayloadType && typeof codec.preferredPayloadType !== 'number') throw new TypeError('invalid codec.preferredPayloadType'); // clockRate is mandatory.

  if (typeof codec.clockRate !== 'number') throw new TypeError('missing codec.clockRate'); // channels is optional. If unset, set it to 1 (just if audio).

  if (codec.kind === 'audio') {
    if (typeof codec.channels !== 'number') codec.channels = 1;
  } else {
    delete codec.channels;
  } // parameters is optional. If unset, set it to an empty object.


  if (!codec.parameters || typeof codec.parameters !== 'object') codec.parameters = {};

  for (const key of Object.keys(codec.parameters)) {
    let value = codec.parameters[key];

    if (value === undefined) {
      codec.parameters[key] = '';
      value = '';
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(`invalid codec parameter [key:${key}s, value:${value}]`);
    } // Specific parameters validation.


    if (key === 'apt') {
      if (typeof value !== 'number') throw new TypeError('invalid codec apt parameter');
    }
  } // rtcpFeedback is optional. If unset, set it to an empty array.


  if (!codec.rtcpFeedback || !Array.isArray(codec.rtcpFeedback)) codec.rtcpFeedback = [];

  for (const fb of codec.rtcpFeedback) {
    validateRtcpFeedback(fb);
  }
}

exports.validateRtpCodecCapability = validateRtpCodecCapability;
/**
 * Validates RtcpFeedback. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtcpFeedback(fb) {
  if (typeof fb !== 'object') throw new TypeError('fb is not an object'); // type is mandatory.

  if (!fb.type || typeof fb.type !== 'string') throw new TypeError('missing fb.type'); // parameter is optional. If unset set it to an empty string.

  if (!fb.parameter || typeof fb.parameter !== 'string') fb.parameter = '';
}

exports.validateRtcpFeedback = validateRtcpFeedback;
/**
 * Validates RtpHeaderExtension. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpHeaderExtension(ext) {
  if (typeof ext !== 'object') throw new TypeError('ext is not an object'); // kind is optional. If unset set it to an empty string.

  if (!ext.kind || typeof ext.kind !== 'string') ext.kind = '';
  if (ext.kind !== '' && ext.kind !== 'audio' && ext.kind !== 'video') throw new TypeError('invalid ext.kind'); // uri is mandatory.

  if (!ext.uri || typeof ext.uri !== 'string') throw new TypeError('missing ext.uri'); // preferredId is mandatory.

  if (typeof ext.preferredId !== 'number') throw new TypeError('missing ext.preferredId'); // preferredEncrypt is optional. If unset set it to false.

  if (ext.preferredEncrypt && typeof ext.preferredEncrypt !== 'boolean') throw new TypeError('invalid ext.preferredEncrypt');else if (!ext.preferredEncrypt) ext.preferredEncrypt = false; // direction is optional. If unset set it to sendrecv.

  if (ext.direction && typeof ext.direction !== 'string') throw new TypeError('invalid ext.direction');else if (!ext.direction) ext.direction = 'sendrecv';
}

exports.validateRtpHeaderExtension = validateRtpHeaderExtension;
/**
 * Validates RtpParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpParameters(params) {
  if (typeof params !== 'object') throw new TypeError('params is not an object'); // mid is optional.

  if (params.mid && typeof params.mid !== 'string') throw new TypeError('params.mid is not a string'); // codecs is mandatory.

  if (!Array.isArray(params.codecs)) throw new TypeError('missing params.codecs');

  for (const codec of params.codecs) {
    validateRtpCodecParameters(codec);
  } // headerExtensions is optional. If unset, fill with an empty array.


  if (params.headerExtensions && !Array.isArray(params.headerExtensions)) throw new TypeError('params.headerExtensions is not an array');else if (!params.headerExtensions) params.headerExtensions = [];

  for (const ext of params.headerExtensions) {
    validateRtpHeaderExtensionParameters(ext);
  } // encodings is optional. If unset, fill with an empty array.


  if (params.encodings && !Array.isArray(params.encodings)) throw new TypeError('params.encodings is not an array');else if (!params.encodings) params.encodings = [];

  for (const encoding of params.encodings) {
    validateRtpEncodingParameters(encoding);
  } // rtcp is optional. If unset, fill with an empty object.


  if (params.rtcp && typeof params.rtcp !== 'object') throw new TypeError('params.rtcp is not an object');else if (!params.rtcp) params.rtcp = {};
  validateRtcpParameters(params.rtcp);
}

exports.validateRtpParameters = validateRtpParameters;
/**
 * Validates RtpCodecParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpCodecParameters(codec) {
  const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
  if (typeof codec !== 'object') throw new TypeError('codec is not an object'); // mimeType is mandatory.

  if (!codec.mimeType || typeof codec.mimeType !== 'string') throw new TypeError('missing codec.mimeType');
  const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
  if (!mimeTypeMatch) throw new TypeError('invalid codec.mimeType'); // payloadType is mandatory.

  if (typeof codec.payloadType !== 'number') throw new TypeError('missing codec.payloadType'); // clockRate is mandatory.

  if (typeof codec.clockRate !== 'number') throw new TypeError('missing codec.clockRate');
  const kind = mimeTypeMatch[1].toLowerCase(); // channels is optional. If unset, set it to 1 (just if audio).

  if (kind === 'audio') {
    if (typeof codec.channels !== 'number') codec.channels = 1;
  } else {
    delete codec.channels;
  } // parameters is optional. If unset, set it to an empty object.


  if (!codec.parameters || typeof codec.parameters !== 'object') codec.parameters = {};

  for (const key of Object.keys(codec.parameters)) {
    let value = codec.parameters[key];

    if (value === undefined) {
      codec.parameters[key] = '';
      value = '';
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new TypeError(`invalid codec parameter [key:${key}s, value:${value}]`);
    } // Specific parameters validation.


    if (key === 'apt') {
      if (typeof value !== 'number') throw new TypeError('invalid codec apt parameter');
    }
  } // rtcpFeedback is optional. If unset, set it to an empty array.


  if (!codec.rtcpFeedback || !Array.isArray(codec.rtcpFeedback)) codec.rtcpFeedback = [];

  for (const fb of codec.rtcpFeedback) {
    validateRtcpFeedback(fb);
  }
}

exports.validateRtpCodecParameters = validateRtpCodecParameters;
/**
 * Validates RtpHeaderExtensionParameteters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpHeaderExtensionParameters(ext) {
  if (typeof ext !== 'object') throw new TypeError('ext is not an object'); // uri is mandatory.

  if (!ext.uri || typeof ext.uri !== 'string') throw new TypeError('missing ext.uri'); // id is mandatory.

  if (typeof ext.id !== 'number') throw new TypeError('missing ext.id'); // encrypt is optional. If unset set it to false.

  if (ext.encrypt && typeof ext.encrypt !== 'boolean') throw new TypeError('invalid ext.encrypt');else if (!ext.encrypt) ext.encrypt = false; // parameters is optional. If unset, set it to an empty object.

  if (!ext.parameters || typeof ext.parameters !== 'object') ext.parameters = {};

  for (const key of Object.keys(ext.parameters)) {
    let value = ext.parameters[key];

    if (value === undefined) {
      ext.parameters[key] = '';
      value = '';
    }

    if (typeof value !== 'string' && typeof value !== 'number') throw new TypeError('invalid header extension parameter');
  }
}

exports.validateRtpHeaderExtensionParameters = validateRtpHeaderExtensionParameters;
/**
 * Validates RtpEncodingParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtpEncodingParameters(encoding) {
  if (typeof encoding !== 'object') throw new TypeError('encoding is not an object'); // ssrc is optional.

  if (encoding.ssrc && typeof encoding.ssrc !== 'number') throw new TypeError('invalid encoding.ssrc'); // rid is optional.

  if (encoding.rid && typeof encoding.rid !== 'string') throw new TypeError('invalid encoding.rid'); // rtx is optional.

  if (encoding.rtx && typeof encoding.rtx !== 'object') {
    throw new TypeError('invalid encoding.rtx');
  } else if (encoding.rtx) {
    // RTX ssrc is mandatory if rtx is present.
    if (typeof encoding.rtx.ssrc !== 'number') throw new TypeError('missing encoding.rtx.ssrc');
  } // dtx is optional. If unset set it to false.


  if (!encoding.dtx || typeof encoding.dtx !== 'boolean') encoding.dtx = false; // scalabilityMode is optional.

  if (encoding.scalabilityMode && typeof encoding.scalabilityMode !== 'string') throw new TypeError('invalid encoding.scalabilityMode');
}

exports.validateRtpEncodingParameters = validateRtpEncodingParameters;
/**
 * Validates RtcpParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateRtcpParameters(rtcp) {
  if (typeof rtcp !== 'object') throw new TypeError('rtcp is not an object'); // cname is optional.

  if (rtcp.cname && typeof rtcp.cname !== 'string') throw new TypeError('invalid rtcp.cname'); // reducedSize is optional. If unset set it to true.

  if (!rtcp.reducedSize || typeof rtcp.reducedSize !== 'boolean') rtcp.reducedSize = true;
}

exports.validateRtcpParameters = validateRtcpParameters;
/**
 * Validates SctpCapabilities. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateSctpCapabilities(caps) {
  if (typeof caps !== 'object') throw new TypeError('caps is not an object'); // numStreams is mandatory.

  if (!caps.numStreams || typeof caps.numStreams !== 'object') throw new TypeError('missing caps.numStreams');
  validateNumSctpStreams(caps.numStreams);
}

exports.validateSctpCapabilities = validateSctpCapabilities;
/**
 * Validates NumSctpStreams. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateNumSctpStreams(numStreams) {
  if (typeof numStreams !== 'object') throw new TypeError('numStreams is not an object'); // OS is mandatory.

  if (typeof numStreams.OS !== 'number') throw new TypeError('missing numStreams.OS'); // MIS is mandatory.

  if (typeof numStreams.MIS !== 'number') throw new TypeError('missing numStreams.MIS');
}

exports.validateNumSctpStreams = validateNumSctpStreams;
/**
 * Validates SctpParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateSctpParameters(params) {
  if (typeof params !== 'object') throw new TypeError('params is not an object'); // port is mandatory.

  if (typeof params.port !== 'number') throw new TypeError('missing params.port'); // OS is mandatory.

  if (typeof params.OS !== 'number') throw new TypeError('missing params.OS'); // MIS is mandatory.

  if (typeof params.MIS !== 'number') throw new TypeError('missing params.MIS'); // maxMessageSize is mandatory.

  if (typeof params.maxMessageSize !== 'number') throw new TypeError('missing params.maxMessageSize');
}

exports.validateSctpParameters = validateSctpParameters;
/**
 * Validates SctpStreamParameters. It may modify given data by adding missing
 * fields with default values.
 * It throws if invalid.
 */

function validateSctpStreamParameters(params) {
  if (typeof params !== 'object') throw new TypeError('params is not an object'); // streamId is mandatory.

  if (typeof params.streamId !== 'number') throw new TypeError('missing params.streamId'); // ordered is optional.

  let orderedGiven = false;
  if (typeof params.ordered === 'boolean') orderedGiven = true;else params.ordered = true; // maxPacketLifeTime is optional.

  if (params.maxPacketLifeTime && typeof params.maxPacketLifeTime !== 'number') throw new TypeError('invalid params.maxPacketLifeTime'); // maxRetransmits is optional.

  if (params.maxRetransmits && typeof params.maxRetransmits !== 'number') throw new TypeError('invalid params.maxRetransmits');
  if (params.maxPacketLifeTime && params.maxRetransmits) throw new TypeError('cannot provide both maxPacketLifeTime and maxRetransmits');

  if (orderedGiven && params.ordered && (params.maxPacketLifeTime || params.maxRetransmits)) {
    throw new TypeError('cannot be ordered with maxPacketLifeTime or maxRetransmits');
  } else if (!orderedGiven && (params.maxPacketLifeTime || params.maxRetransmits)) {
    params.ordered = false;
  } // priority is optional.


  if (params.priority && typeof params.priority !== 'string') throw new TypeError('invalid params.priority'); // label is optional.

  if (params.label && typeof params.label !== 'string') throw new TypeError('invalid params.label'); // protocol is optional.

  if (params.protocol && typeof params.protocol !== 'string') throw new TypeError('invalid params.protocol');
}

exports.validateSctpStreamParameters = validateSctpStreamParameters;
/**
 * Generate extended RTP capabilities for sending and receiving.
 */

function getExtendedRtpCapabilities(localCaps, remoteCaps) {
  const extendedRtpCapabilities = {
    codecs: [],
    headerExtensions: []
  }; // Match media codecs and keep the order preferred by remoteCaps.

  for (const remoteCodec of remoteCaps.codecs || []) {
    if (isRtxCodec(remoteCodec)) continue;
    const matchingLocalCodec = (localCaps.codecs || []).find(localCodec => matchCodecs(localCodec, remoteCodec, {
      strict: true,
      modify: true
    }));
    if (!matchingLocalCodec) continue;
    const extendedCodec = {
      mimeType: matchingLocalCodec.mimeType,
      kind: matchingLocalCodec.kind,
      clockRate: matchingLocalCodec.clockRate,
      channels: matchingLocalCodec.channels,
      localPayloadType: matchingLocalCodec.preferredPayloadType,
      localRtxPayloadType: undefined,
      remotePayloadType: remoteCodec.preferredPayloadType,
      remoteRtxPayloadType: undefined,
      localParameters: matchingLocalCodec.parameters,
      remoteParameters: remoteCodec.parameters,
      rtcpFeedback: reduceRtcpFeedback(matchingLocalCodec, remoteCodec)
    };
    extendedRtpCapabilities.codecs.push(extendedCodec);
  } // Match RTX codecs.


  for (const extendedCodec of extendedRtpCapabilities.codecs) {
    const matchingLocalRtxCodec = localCaps.codecs.find(localCodec => isRtxCodec(localCodec) && localCodec.parameters.apt === extendedCodec.localPayloadType);
    const matchingRemoteRtxCodec = remoteCaps.codecs.find(remoteCodec => isRtxCodec(remoteCodec) && remoteCodec.parameters.apt === extendedCodec.remotePayloadType);

    if (matchingLocalRtxCodec && matchingRemoteRtxCodec) {
      extendedCodec.localRtxPayloadType = matchingLocalRtxCodec.preferredPayloadType;
      extendedCodec.remoteRtxPayloadType = matchingRemoteRtxCodec.preferredPayloadType;
    }
  } // Match header extensions.


  for (const remoteExt of remoteCaps.headerExtensions) {
    const matchingLocalExt = localCaps.headerExtensions.find(localExt => matchHeaderExtensions(localExt, remoteExt));
    if (!matchingLocalExt) continue;
    const extendedExt = {
      kind: remoteExt.kind,
      uri: remoteExt.uri,
      sendId: matchingLocalExt.preferredId,
      recvId: remoteExt.preferredId,
      encrypt: matchingLocalExt.preferredEncrypt,
      direction: 'sendrecv'
    };

    switch (remoteExt.direction) {
      case 'sendrecv':
        extendedExt.direction = 'sendrecv';
        break;

      case 'recvonly':
        extendedExt.direction = 'sendonly';
        break;

      case 'sendonly':
        extendedExt.direction = 'recvonly';
        break;

      case 'inactive':
        extendedExt.direction = 'inactive';
        break;
    }

    extendedRtpCapabilities.headerExtensions.push(extendedExt);
  }

  return extendedRtpCapabilities;
}

exports.getExtendedRtpCapabilities = getExtendedRtpCapabilities;
/**
 * Generate RTP capabilities for receiving media based on the given extended
 * RTP capabilities.
 */

function getRecvRtpCapabilities(extendedRtpCapabilities) {
  const rtpCapabilities = {
    codecs: [],
    headerExtensions: []
  };

  for (const extendedCodec of extendedRtpCapabilities.codecs) {
    const codec = {
      mimeType: extendedCodec.mimeType,
      kind: extendedCodec.kind,
      preferredPayloadType: extendedCodec.remotePayloadType,
      clockRate: extendedCodec.clockRate,
      channels: extendedCodec.channels,
      parameters: extendedCodec.localParameters,
      rtcpFeedback: extendedCodec.rtcpFeedback
    };
    rtpCapabilities.codecs.push(codec); // Add RTX codec.

    if (!extendedCodec.remoteRtxPayloadType) continue;
    const rtxCodec = {
      mimeType: `${extendedCodec.kind}/rtx`,
      kind: extendedCodec.kind,
      preferredPayloadType: extendedCodec.remoteRtxPayloadType,
      clockRate: extendedCodec.clockRate,
      parameters: {
        apt: extendedCodec.remotePayloadType
      },
      rtcpFeedback: []
    };
    rtpCapabilities.codecs.push(rtxCodec); // TODO: In the future, we need to add FEC, CN, etc, codecs.
  }

  for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
    // Ignore RTP extensions not valid for receiving.
    if (extendedExtension.direction !== 'sendrecv' && extendedExtension.direction !== 'recvonly') {
      continue;
    }

    const ext = {
      kind: extendedExtension.kind,
      uri: extendedExtension.uri,
      preferredId: extendedExtension.recvId,
      preferredEncrypt: extendedExtension.encrypt,
      direction: extendedExtension.direction
    };
    rtpCapabilities.headerExtensions.push(ext);
  }

  return rtpCapabilities;
}

exports.getRecvRtpCapabilities = getRecvRtpCapabilities;
/**
 * Generate RTP parameters of the given kind for sending media.
 * NOTE: mid, encodings and rtcp fields are left empty.
 */

function getSendingRtpParameters(kind, extendedRtpCapabilities) {
  const rtpParameters = {
    mid: undefined,
    codecs: [],
    headerExtensions: [],
    encodings: [],
    rtcp: {}
  };

  for (const extendedCodec of extendedRtpCapabilities.codecs) {
    if (extendedCodec.kind !== kind) continue;
    const codec = {
      mimeType: extendedCodec.mimeType,
      payloadType: extendedCodec.localPayloadType,
      clockRate: extendedCodec.clockRate,
      channels: extendedCodec.channels,
      parameters: extendedCodec.localParameters,
      rtcpFeedback: extendedCodec.rtcpFeedback
    };
    rtpParameters.codecs.push(codec); // Add RTX codec.

    if (extendedCodec.localRtxPayloadType) {
      const rtxCodec = {
        mimeType: `${extendedCodec.kind}/rtx`,
        payloadType: extendedCodec.localRtxPayloadType,
        clockRate: extendedCodec.clockRate,
        parameters: {
          apt: extendedCodec.localPayloadType
        },
        rtcpFeedback: []
      };
      rtpParameters.codecs.push(rtxCodec);
    }
  }

  for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
    // Ignore RTP extensions of a different kind and those not valid for sending.
    if (extendedExtension.kind && extendedExtension.kind !== kind || extendedExtension.direction !== 'sendrecv' && extendedExtension.direction !== 'sendonly') {
      continue;
    }

    const ext = {
      uri: extendedExtension.uri,
      id: extendedExtension.sendId,
      encrypt: extendedExtension.encrypt,
      parameters: {}
    };
    rtpParameters.headerExtensions.push(ext);
  }

  return rtpParameters;
}

exports.getSendingRtpParameters = getSendingRtpParameters;
/**
 * Generate RTP parameters of the given kind suitable for the remote SDP answer.
 */

function getSendingRemoteRtpParameters(kind, extendedRtpCapabilities) {
  const rtpParameters = {
    mid: undefined,
    codecs: [],
    headerExtensions: [],
    encodings: [],
    rtcp: {}
  };

  for (const extendedCodec of extendedRtpCapabilities.codecs) {
    if (extendedCodec.kind !== kind) continue;
    const codec = {
      mimeType: extendedCodec.mimeType,
      payloadType: extendedCodec.localPayloadType,
      clockRate: extendedCodec.clockRate,
      channels: extendedCodec.channels,
      parameters: extendedCodec.remoteParameters,
      rtcpFeedback: extendedCodec.rtcpFeedback
    };
    rtpParameters.codecs.push(codec); // Add RTX codec.

    if (extendedCodec.localRtxPayloadType) {
      const rtxCodec = {
        mimeType: `${extendedCodec.kind}/rtx`,
        payloadType: extendedCodec.localRtxPayloadType,
        clockRate: extendedCodec.clockRate,
        parameters: {
          apt: extendedCodec.localPayloadType
        },
        rtcpFeedback: []
      };
      rtpParameters.codecs.push(rtxCodec);
    }
  }

  for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
    // Ignore RTP extensions of a different kind and those not valid for sending.
    if (extendedExtension.kind && extendedExtension.kind !== kind || extendedExtension.direction !== 'sendrecv' && extendedExtension.direction !== 'sendonly') {
      continue;
    }

    const ext = {
      uri: extendedExtension.uri,
      id: extendedExtension.sendId,
      encrypt: extendedExtension.encrypt,
      parameters: {}
    };
    rtpParameters.headerExtensions.push(ext);
  } // Reduce codecs' RTCP feedback. Use Transport-CC if available, REMB otherwise.


  if (rtpParameters.headerExtensions.some(ext => ext.uri === 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01')) {
    for (const codec of rtpParameters.codecs) {
      codec.rtcpFeedback = (codec.rtcpFeedback || []).filter(fb => fb.type !== 'goog-remb');
    }
  } else if (rtpParameters.headerExtensions.some(ext => ext.uri === 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time')) {
    for (const codec of rtpParameters.codecs) {
      codec.rtcpFeedback = (codec.rtcpFeedback || []).filter(fb => fb.type !== 'transport-cc');
    }
  } else {
    for (const codec of rtpParameters.codecs) {
      codec.rtcpFeedback = (codec.rtcpFeedback || []).filter(fb => fb.type !== 'transport-cc' && fb.type !== 'goog-remb');
    }
  }

  return rtpParameters;
}

exports.getSendingRemoteRtpParameters = getSendingRemoteRtpParameters;
/**
 * Reduce given codecs by returning an array of codecs "compatible" with the
 * given capability codec. If no capability codec is given, take the first
 * one(s).
 *
 * Given codecs must be generated by ortc.getSendingRtpParameters() or
 * ortc.getSendingRemoteRtpParameters().
 *
 * The returned array of codecs also include a RTX codec if available.
 */

function reduceCodecs(codecs, capCodec) {
  const filteredCodecs = []; // If no capability codec is given, take the first one (and RTX).

  if (!capCodec) {
    filteredCodecs.push(codecs[0]);
    if (isRtxCodec(codecs[1])) filteredCodecs.push(codecs[1]);
  } // Otherwise look for a compatible set of codecs.
  else {
      for (let idx = 0; idx < codecs.length; ++idx) {
        if (matchCodecs(codecs[idx], capCodec)) {
          filteredCodecs.push(codecs[idx]);
          if (isRtxCodec(codecs[idx + 1])) filteredCodecs.push(codecs[idx + 1]);
          break;
        }
      }

      if (filteredCodecs.length === 0) throw new TypeError('no matching codec found');
    }

  return filteredCodecs;
}

exports.reduceCodecs = reduceCodecs;
/**
 * Create RTP parameters for a Consumer for the RTP probator.
 */

function generateProbatorRtpParameters(videoRtpParameters) {
  // Clone given reference video RTP parameters.
  videoRtpParameters = utils.clone(videoRtpParameters, {}); // This may throw.

  validateRtpParameters(videoRtpParameters);
  const rtpParameters = {
    mid: RTP_PROBATOR_MID,
    codecs: [],
    headerExtensions: [],
    encodings: [{
      ssrc: RTP_PROBATOR_SSRC
    }],
    rtcp: {
      cname: 'probator'
    }
  };
  rtpParameters.codecs.push(videoRtpParameters.codecs[0]);
  rtpParameters.codecs[0].payloadType = RTP_PROBATOR_CODEC_PAYLOAD_TYPE;
  rtpParameters.headerExtensions = videoRtpParameters.headerExtensions;
  return rtpParameters;
}

exports.generateProbatorRtpParameters = generateProbatorRtpParameters;
/**
 * Whether media can be sent based on the given RTP capabilities.
 */

function canSend(kind, extendedRtpCapabilities) {
  return extendedRtpCapabilities.codecs.some(codec => codec.kind === kind);
}

exports.canSend = canSend;
/**
 * Whether the given RTP parameters can be received with the given RTP
 * capabilities.
 */

function canReceive(rtpParameters, extendedRtpCapabilities) {
  // This may throw.
  validateRtpParameters(rtpParameters);
  if (rtpParameters.codecs.length === 0) return false;
  const firstMediaCodec = rtpParameters.codecs[0];
  return extendedRtpCapabilities.codecs.some(codec => codec.remotePayloadType === firstMediaCodec.payloadType);
}

exports.canReceive = canReceive;

function isRtxCodec(codec) {
  if (!codec) return false;
  return /.+\/rtx$/i.test(codec.mimeType);
}

function matchCodecs(aCodec, bCodec, {
  strict = false,
  modify = false
} = {}) {
  const aMimeType = aCodec.mimeType.toLowerCase();
  const bMimeType = bCodec.mimeType.toLowerCase();
  if (aMimeType !== bMimeType) return false;
  if (aCodec.clockRate !== bCodec.clockRate) return false;
  if (aCodec.channels !== bCodec.channels) return false; // Per codec special checks.

  switch (aMimeType) {
    case 'video/h264':
      {
        const aPacketizationMode = aCodec.parameters['packetization-mode'] || 0;
        const bPacketizationMode = bCodec.parameters['packetization-mode'] || 0;
        if (aPacketizationMode !== bPacketizationMode) return false; // If strict matching check profile-level-id.

        if (strict) {
          if (!h264.isSameProfile(aCodec.parameters, bCodec.parameters)) return false;
          let selectedProfileLevelId;

          try {
            selectedProfileLevelId = h264.generateProfileLevelIdForAnswer(aCodec.parameters, bCodec.parameters);
          } catch (error) {
            return false;
          }

          if (modify) {
            if (selectedProfileLevelId) {
              aCodec.parameters['profile-level-id'] = selectedProfileLevelId;
              bCodec.parameters['profile-level-id'] = selectedProfileLevelId;
            } else {
              delete aCodec.parameters['profile-level-id'];
              delete bCodec.parameters['profile-level-id'];
            }
          }
        }

        break;
      }

    case 'video/vp9':
      {
        // If strict matching check profile-id.
        if (strict) {
          const aProfileId = aCodec.parameters['profile-id'] || 0;
          const bProfileId = bCodec.parameters['profile-id'] || 0;
          if (aProfileId !== bProfileId) return false;
        }

        break;
      }
  }

  return true;
}

function matchHeaderExtensions(aExt, bExt) {
  if (aExt.kind && bExt.kind && aExt.kind !== bExt.kind) return false;
  if (aExt.uri !== bExt.uri) return false;
  return true;
}

function reduceRtcpFeedback(codecA, codecB) {
  const reducedRtcpFeedback = [];

  for (const aFb of codecA.rtcpFeedback || []) {
    const matchingBFb = (codecB.rtcpFeedback || []).find(bFb => bFb.type === aFb.type && (bFb.parameter === aFb.parameter || !bFb.parameter && !aFb.parameter));
    if (matchingBFb) reducedRtcpFeedback.push(matchingBFb);
  }

  return reducedRtcpFeedback;
}
},{"h264-profile-level-id":"lc3R","./utils":"fnp2"}],"OGUt":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

class AwaitQueue {
  constructor({
    ClosedErrorClass = Error,
    StoppedErrorClass = Error
  } = {
    ClosedErrorClass: Error,
    StoppedErrorClass: Error
  }) {
    // Closed flag.
    this.closed = false; // Queue of pending tasks.

    this.pendingTasks = []; // Error class used when rejecting a task due to AwaitQueue being closed.

    this.ClosedErrorClass = Error; // Error class used when rejecting a task due to AwaitQueue being stopped.

    this.StoppedErrorClass = Error;
    this.ClosedErrorClass = ClosedErrorClass;
    this.StoppedErrorClass = StoppedErrorClass;
  }
  /**
   * The number of ongoing enqueued tasks.
   */


  get size() {
    return this.pendingTasks.length;
  }
  /**
   * Closes the AwaitQueue. Pending tasks will be rejected with ClosedErrorClass
   * error.
   */


  close() {
    if (this.closed) return;
    this.closed = true;

    for (const pendingTask of this.pendingTasks) {
      pendingTask.stopped = true;
      pendingTask.reject(new this.ClosedErrorClass('AwaitQueue closed'));
    } // Enpty the pending tasks array.


    this.pendingTasks.length = 0;
  }
  /**
   * Accepts a task as argument (and an optional task name) and enqueues it after
   * pending tasks. Once processed, the push() method resolves (or rejects) with
   * the result returned by the given task.
   *
   * The given task must return a Promise or directly a value.
   */


  push(task, name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.closed) throw new this.ClosedErrorClass('AwaitQueue closed');
      if (typeof task !== 'function') throw new TypeError('given task is not a function');

      if (!task.name && name) {
        try {
          Object.defineProperty(task, 'name', {
            value: name
          });
        } catch (error) {}
      }

      return new Promise((resolve, reject) => {
        const pendingTask = {
          task,
          name,
          resolve,
          reject,
          stopped: false,
          enqueuedAt: new Date(),
          executedAt: undefined
        }; // Append task to the queue.

        this.pendingTasks.push(pendingTask); // And run it if this is the only task in the queue.

        if (this.pendingTasks.length === 1) this.next();
      });
    });
  }
  /**
   * Make ongoing pending tasks reject with the given StoppedErrorClass error.
   * The AwaitQueue instance is still usable for future tasks added via push()
   * method.
   */


  stop() {
    if (this.closed) return;

    for (const pendingTask of this.pendingTasks) {
      pendingTask.stopped = true;
      pendingTask.reject(new this.StoppedErrorClass('AwaitQueue stopped'));
    } // Enpty the pending tasks array.


    this.pendingTasks.length = 0;
  }

  dump() {
    const now = new Date();
    return this.pendingTasks.map(pendingTask => {
      return {
        task: pendingTask.task,
        name: pendingTask.name,
        enqueuedTime: pendingTask.executedAt ? pendingTask.executedAt.getTime() - pendingTask.enqueuedAt.getTime() : now.getTime() - pendingTask.enqueuedAt.getTime(),
        executingTime: pendingTask.executedAt ? now.getTime() - pendingTask.executedAt.getTime() : 0
      };
    });
  }

  next() {
    return __awaiter(this, void 0, void 0, function* () {
      // Take the first pending task.
      const pendingTask = this.pendingTasks[0];
      if (!pendingTask) return; // Execute it.

      yield this.executeTask(pendingTask); // Remove the first pending task (the completed one) from the queue.

      this.pendingTasks.shift(); // And continue.

      this.next();
    });
  }

  executeTask(pendingTask) {
    return __awaiter(this, void 0, void 0, function* () {
      // If the task is stopped, ignore it.
      if (pendingTask.stopped) return;
      pendingTask.executedAt = new Date();

      try {
        const result = yield pendingTask.task(); // If the task is stopped, ignore it.

        if (pendingTask.stopped) return; // Resolve the task with the returned result (if any).

        pendingTask.resolve(result);
      } catch (error) {
        // If the task is stopped, ignore it.
        if (pendingTask.stopped) return; // Reject the task with its own error.

        pendingTask.reject(error);
      }
    });
  }

}

exports.AwaitQueue = AwaitQueue;
},{}],"dKU8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Producer = void 0;

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const errors_1 = require("./errors");

const logger = new Logger_1.Logger('Producer');

class Producer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits transportclose
   * @emits trackended
   * @emits @replacetrack - (track: MediaStreamTrack | null)
   * @emits @setmaxspatiallayer - (spatialLayer: string)
   * @emits @setrtpencodingparameters - (params: any)
   * @emits @getstats
   * @emits @close
   */
  constructor({
    id,
    localId,
    rtpSender,
    track,
    rtpParameters,
    stopTracks,
    disableTrackOnPause,
    zeroRtpOnPause,
    appData
  }) {
    super(); // Closed flag.

    this._closed = false; // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor()');
    this._id = id;
    this._localId = localId;
    this._rtpSender = rtpSender;
    this._track = track;
    this._kind = track.kind;
    this._rtpParameters = rtpParameters;
    this._paused = disableTrackOnPause ? !track.enabled : false;
    this._maxSpatialLayer = undefined;
    this._stopTracks = stopTracks;
    this._disableTrackOnPause = disableTrackOnPause;
    this._zeroRtpOnPause = zeroRtpOnPause;
    this._appData = appData;
    this._onTrackEnded = this._onTrackEnded.bind(this); // NOTE: Minor issue. If zeroRtpOnPause is true, we cannot emit the
    // '@replacetrack' event here, so RTCRtpSender.track won't be null.

    this._handleTrack();
  }
  /**
   * Producer id.
   */


  get id() {
    return this._id;
  }
  /**
   * Local id.
   */


  get localId() {
    return this._localId;
  }
  /**
   * Whether the Producer is closed.
   */


  get closed() {
    return this._closed;
  }
  /**
   * Media kind.
   */


  get kind() {
    return this._kind;
  }
  /**
   * Associated RTCRtpSender.
   */


  get rtpSender() {
    return this._rtpSender;
  }
  /**
   * The associated track.
   */


  get track() {
    return this._track;
  }
  /**
   * RTP parameters.
   */


  get rtpParameters() {
    return this._rtpParameters;
  }
  /**
   * Whether the Producer is paused.
   */


  get paused() {
    return this._paused;
  }
  /**
   * Max spatial layer.
   *
   * @type {Number | undefined}
   */


  get maxSpatialLayer() {
    return this._maxSpatialLayer;
  }
  /**
   * App custom data.
   */


  get appData() {
    return this._appData;
  }
  /**
   * Invalid setter.
   */


  set appData(appData) {
    throw new Error('cannot override appData object');
  }
  /**
   * Observer.
   *
   * @emits close
   * @emits pause
   * @emits resume
   * @emits trackended
   */


  get observer() {
    return this._observer;
  }
  /**
   * Closes the Producer.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true;

    this._destroyTrack();

    this.emit('@close'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Transport was closed.
   */


  transportClosed() {
    if (this._closed) return;
    logger.debug('transportClosed()');
    this._closed = true;

    this._destroyTrack();

    this.safeEmit('transportclose'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Get associated RTCRtpSender stats.
   */


  async getStats() {
    if (this._closed) throw new errors_1.InvalidStateError('closed');
    return this.safeEmitAsPromise('@getstats');
  }
  /**
   * Pauses sending media.
   */


  pause() {
    logger.debug('pause()');

    if (this._closed) {
      logger.error('pause() | Producer closed');
      return;
    }

    this._paused = true;

    if (this._track && this._disableTrackOnPause) {
      this._track.enabled = false;
    }

    if (this._zeroRtpOnPause) {
      this.safeEmitAsPromise('@replacetrack', null).catch(() => {});
    } // Emit observer event.


    this._observer.safeEmit('pause');
  }
  /**
   * Resumes sending media.
   */


  resume() {
    logger.debug('resume()');

    if (this._closed) {
      logger.error('resume() | Producer closed');
      return;
    }

    this._paused = false;

    if (this._track && this._disableTrackOnPause) {
      this._track.enabled = true;
    }

    if (this._zeroRtpOnPause) {
      this.safeEmitAsPromise('@replacetrack', this._track).catch(() => {});
    } // Emit observer event.


    this._observer.safeEmit('resume');
  }
  /**
   * Replaces the current track with a new one or null.
   */


  async replaceTrack({
    track
  }) {
    logger.debug('replaceTrack() [track:%o]', track);

    if (this._closed) {
      // This must be done here. Otherwise there is no chance to stop the given
      // track.
      if (track && this._stopTracks) {
        try {
          track.stop();
        } catch (error) {}
      }

      throw new errors_1.InvalidStateError('closed');
    } else if (track && track.readyState === 'ended') {
      throw new errors_1.InvalidStateError('track ended');
    } // Do nothing if this is the same track as the current handled one.


    if (track === this._track) {
      logger.debug('replaceTrack() | same track, ignored');
      return;
    }

    if (!this._zeroRtpOnPause || !this._paused) {
      await this.safeEmitAsPromise('@replacetrack', track);
    } // Destroy the previous track.


    this._destroyTrack(); // Set the new track.


    this._track = track; // If this Producer was paused/resumed and the state of the new
    // track does not match, fix it.

    if (this._track && this._disableTrackOnPause) {
      if (!this._paused) this._track.enabled = true;else if (this._paused) this._track.enabled = false;
    } // Handle the effective track.


    this._handleTrack();
  }
  /**
   * Sets the video max spatial layer to be sent.
   */


  async setMaxSpatialLayer(spatialLayer) {
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (this._kind !== 'video') throw new errors_1.UnsupportedError('not a video Producer');else if (typeof spatialLayer !== 'number') throw new TypeError('invalid spatialLayer');
    if (spatialLayer === this._maxSpatialLayer) return;
    await this.safeEmitAsPromise('@setmaxspatiallayer', spatialLayer);
    this._maxSpatialLayer = spatialLayer;
  }
  /**
   * Sets the DSCP value.
   */


  async setRtpEncodingParameters(params) {
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (typeof params !== 'object') throw new TypeError('invalid params');
    await this.safeEmitAsPromise('@setrtpencodingparameters', params);
  }

  _onTrackEnded() {
    logger.debug('track "ended" event');
    this.safeEmit('trackended'); // Emit observer event.

    this._observer.safeEmit('trackended');
  }

  _handleTrack() {
    if (!this._track) return;

    this._track.addEventListener('ended', this._onTrackEnded);
  }

  _destroyTrack() {
    if (!this._track) return;

    try {
      this._track.removeEventListener('ended', this._onTrackEnded); // Just stop the track unless the app set stopTracks: false.


      if (this._stopTracks) this._track.stop();
    } catch (error) {}
  }

}

exports.Producer = Producer;
},{"./Logger":"andi","./EnhancedEventEmitter":"P3Oo","./errors":"hNUz"}],"QQSC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Consumer = void 0;

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const errors_1 = require("./errors");

const logger = new Logger_1.Logger('Consumer');

class Consumer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits transportclose
   * @emits trackended
   * @emits @getstats
   * @emits @close
   */
  constructor({
    id,
    localId,
    producerId,
    rtpReceiver,
    track,
    rtpParameters,
    appData
  }) {
    super(); // Closed flag.

    this._closed = false; // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor()');
    this._id = id;
    this._localId = localId;
    this._producerId = producerId;
    this._rtpReceiver = rtpReceiver;
    this._track = track;
    this._rtpParameters = rtpParameters;
    this._paused = !track.enabled;
    this._appData = appData;
    this._onTrackEnded = this._onTrackEnded.bind(this);

    this._handleTrack();
  }
  /**
   * Consumer id.
   */


  get id() {
    return this._id;
  }
  /**
   * Local id.
   */


  get localId() {
    return this._localId;
  }
  /**
   * Associated Producer id.
   */


  get producerId() {
    return this._producerId;
  }
  /**
   * Whether the Consumer is closed.
   */


  get closed() {
    return this._closed;
  }
  /**
   * Media kind.
   */


  get kind() {
    return this._track.kind;
  }
  /**
   * Associated RTCRtpReceiver.
   */


  get rtpReceiver() {
    return this._rtpReceiver;
  }
  /**
   * The associated track.
   */


  get track() {
    return this._track;
  }
  /**
   * RTP parameters.
   */


  get rtpParameters() {
    return this._rtpParameters;
  }
  /**
   * Whether the Consumer is paused.
   */


  get paused() {
    return this._paused;
  }
  /**
   * App custom data.
   */


  get appData() {
    return this._appData;
  }
  /**
   * Invalid setter.
   */


  set appData(appData) {
    throw new Error('cannot override appData object');
  }
  /**
   * Observer.
   *
   * @emits close
   * @emits pause
   * @emits resume
   * @emits trackended
   */


  get observer() {
    return this._observer;
  }
  /**
   * Closes the Consumer.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true;

    this._destroyTrack();

    this.emit('@close'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Transport was closed.
   */


  transportClosed() {
    if (this._closed) return;
    logger.debug('transportClosed()');
    this._closed = true;

    this._destroyTrack();

    this.safeEmit('transportclose'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Get associated RTCRtpReceiver stats.
   */


  async getStats() {
    if (this._closed) throw new errors_1.InvalidStateError('closed');
    return this.safeEmitAsPromise('@getstats');
  }
  /**
   * Pauses receiving media.
   */


  pause() {
    logger.debug('pause()');

    if (this._closed) {
      logger.error('pause() | Consumer closed');
      return;
    }

    this._paused = true;
    this._track.enabled = false; // Emit observer event.

    this._observer.safeEmit('pause');
  }
  /**
   * Resumes receiving media.
   */


  resume() {
    logger.debug('resume()');

    if (this._closed) {
      logger.error('resume() | Consumer closed');
      return;
    }

    this._paused = false;
    this._track.enabled = true; // Emit observer event.

    this._observer.safeEmit('resume');
  }

  _onTrackEnded() {
    logger.debug('track "ended" event');
    this.safeEmit('trackended'); // Emit observer event.

    this._observer.safeEmit('trackended');
  }

  _handleTrack() {
    this._track.addEventListener('ended', this._onTrackEnded);
  }

  _destroyTrack() {
    try {
      this._track.removeEventListener('ended', this._onTrackEnded);

      this._track.stop();
    } catch (error) {}
  }

}

exports.Consumer = Consumer;
},{"./Logger":"andi","./EnhancedEventEmitter":"P3Oo","./errors":"hNUz"}],"Z0Ve":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataProducer = void 0;

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const errors_1 = require("./errors");

const logger = new Logger_1.Logger('DataProducer');

class DataProducer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits transportclose
   * @emits open
   * @emits error - (error: Error)
   * @emits close
   * @emits bufferedamountlow
   * @emits @close
   */
  constructor({
    id,
    dataChannel,
    sctpStreamParameters,
    appData
  }) {
    super(); // Closed flag.

    this._closed = false; // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor()');
    this._id = id;
    this._dataChannel = dataChannel;
    this._sctpStreamParameters = sctpStreamParameters;
    this._appData = appData;

    this._handleDataChannel();
  }
  /**
   * DataProducer id.
   */


  get id() {
    return this._id;
  }
  /**
   * Whether the DataProducer is closed.
   */


  get closed() {
    return this._closed;
  }
  /**
   * SCTP stream parameters.
   */


  get sctpStreamParameters() {
    return this._sctpStreamParameters;
  }
  /**
   * DataChannel readyState.
   */


  get readyState() {
    return this._dataChannel.readyState;
  }
  /**
   * DataChannel label.
   */


  get label() {
    return this._dataChannel.label;
  }
  /**
   * DataChannel protocol.
   */


  get protocol() {
    return this._dataChannel.protocol;
  }
  /**
   * DataChannel bufferedAmount.
   */


  get bufferedAmount() {
    return this._dataChannel.bufferedAmount;
  }
  /**
   * DataChannel bufferedAmountLowThreshold.
   */


  get bufferedAmountLowThreshold() {
    return this._dataChannel.bufferedAmountLowThreshold;
  }
  /**
   * Set DataChannel bufferedAmountLowThreshold.
   */


  set bufferedAmountLowThreshold(bufferedAmountLowThreshold) {
    this._dataChannel.bufferedAmountLowThreshold = bufferedAmountLowThreshold;
  }
  /**
   * App custom data.
   */


  get appData() {
    return this._appData;
  }
  /**
   * Invalid setter.
   */


  set appData(appData) {
    throw new Error('cannot override appData object');
  }
  /**
   * Observer.
   *
   * @emits close
   */


  get observer() {
    return this._observer;
  }
  /**
   * Closes the DataProducer.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true;

    this._dataChannel.close();

    this.emit('@close'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Transport was closed.
   */


  transportClosed() {
    if (this._closed) return;
    logger.debug('transportClosed()');
    this._closed = true;

    this._dataChannel.close();

    this.safeEmit('transportclose'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Send a message.
   *
   * @param {String|Blob|ArrayBuffer|ArrayBufferView} data.
   */


  send(data) {
    logger.debug('send()');
    if (this._closed) throw new errors_1.InvalidStateError('closed');

    this._dataChannel.send(data);
  }

  _handleDataChannel() {
    this._dataChannel.addEventListener('open', () => {
      if (this._closed) return;
      logger.debug('DataChannel "open" event');
      this.safeEmit('open');
    });

    this._dataChannel.addEventListener('error', event => {
      if (this._closed) return;
      let {
        error
      } = event;
      if (!error) error = new Error('unknown DataChannel error');

      if (error.errorDetail === 'sctp-failure') {
        logger.error('DataChannel SCTP error [sctpCauseCode:%s]: %s', error.sctpCauseCode, error.message);
      } else {
        logger.error('DataChannel "error" event: %o', error);
      }

      this.safeEmit('error', error);
    });

    this._dataChannel.addEventListener('close', () => {
      if (this._closed) return;
      logger.warn('DataChannel "close" event');
      this._closed = true;
      this.emit('@close');
      this.safeEmit('close');
    });

    this._dataChannel.addEventListener('message', () => {
      if (this._closed) return;
      logger.warn('DataChannel "message" event in a DataProducer, message discarded');
    });

    this._dataChannel.addEventListener('bufferedamountlow', () => {
      if (this._closed) return;
      this.safeEmit('bufferedamountlow');
    });
  }

}

exports.DataProducer = DataProducer;
},{"./Logger":"andi","./EnhancedEventEmitter":"P3Oo","./errors":"hNUz"}],"g5am":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataConsumer = void 0;

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const logger = new Logger_1.Logger('DataConsumer');

class DataConsumer extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits transportclose
   * @emits open
   * @emits error - (error: Error)
   * @emits close
   * @emits message - (message: any)
   * @emits @close
   */
  constructor({
    id,
    dataProducerId,
    dataChannel,
    sctpStreamParameters,
    appData
  }) {
    super(); // Closed flag.

    this._closed = false; // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor()');
    this._id = id;
    this._dataProducerId = dataProducerId;
    this._dataChannel = dataChannel;
    this._sctpStreamParameters = sctpStreamParameters;
    this._appData = appData;

    this._handleDataChannel();
  }
  /**
   * DataConsumer id.
   */


  get id() {
    return this._id;
  }
  /**
   * Associated DataProducer id.
   */


  get dataProducerId() {
    return this._dataProducerId;
  }
  /**
   * Whether the DataConsumer is closed.
   */


  get closed() {
    return this._closed;
  }
  /**
   * SCTP stream parameters.
   */


  get sctpStreamParameters() {
    return this._sctpStreamParameters;
  }
  /**
   * DataChannel readyState.
   */


  get readyState() {
    return this._dataChannel.readyState;
  }
  /**
   * DataChannel label.
   */


  get label() {
    return this._dataChannel.label;
  }
  /**
   * DataChannel protocol.
   */


  get protocol() {
    return this._dataChannel.protocol;
  }
  /**
   * DataChannel binaryType.
   */


  get binaryType() {
    return this._dataChannel.binaryType;
  }
  /**
   * Set DataChannel binaryType.
   */


  set binaryType(binaryType) {
    this._dataChannel.binaryType = binaryType;
  }
  /**
   * App custom data.
   */


  get appData() {
    return this._appData;
  }
  /**
   * Invalid setter.
   */


  set appData(appData) {
    throw new Error('cannot override appData object');
  }
  /**
   * Observer.
   *
   * @emits close
   */


  get observer() {
    return this._observer;
  }
  /**
   * Closes the DataConsumer.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true;

    this._dataChannel.close();

    this.emit('@close'); // Emit observer event.

    this._observer.safeEmit('close');
  }
  /**
   * Transport was closed.
   */


  transportClosed() {
    if (this._closed) return;
    logger.debug('transportClosed()');
    this._closed = true;

    this._dataChannel.close();

    this.safeEmit('transportclose'); // Emit observer event.

    this._observer.safeEmit('close');
  }

  _handleDataChannel() {
    this._dataChannel.addEventListener('open', () => {
      if (this._closed) return;
      logger.debug('DataChannel "open" event');
      this.safeEmit('open');
    });

    this._dataChannel.addEventListener('error', event => {
      if (this._closed) return;
      let {
        error
      } = event;
      if (!error) error = new Error('unknown DataChannel error');

      if (error.errorDetail === 'sctp-failure') {
        logger.error('DataChannel SCTP error [sctpCauseCode:%s]: %s', error.sctpCauseCode, error.message);
      } else {
        logger.error('DataChannel "error" event: %o', error);
      }

      this.safeEmit('error', error);
    });

    this._dataChannel.addEventListener('close', () => {
      if (this._closed) return;
      logger.warn('DataChannel "close" event');
      this._closed = true;
      this.emit('@close');
      this.safeEmit('close');
    });

    this._dataChannel.addEventListener('message', event => {
      if (this._closed) return;
      this.safeEmit('message', event.data);
    });
  }

}

exports.DataConsumer = DataConsumer;
},{"./Logger":"andi","./EnhancedEventEmitter":"P3Oo"}],"BHpp":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transport = void 0;

const awaitqueue_1 = require("awaitqueue");

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const errors_1 = require("./errors");

const utils = __importStar(require("./utils"));

const ortc = __importStar(require("./ortc"));

const Producer_1 = require("./Producer");

const Consumer_1 = require("./Consumer");

const DataProducer_1 = require("./DataProducer");

const DataConsumer_1 = require("./DataConsumer");

const logger = new Logger_1.Logger('Transport');

class Transport extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits connect - (transportLocalParameters: any, callback: Function, errback: Function)
   * @emits connectionstatechange - (connectionState: ConnectionState)
   * @emits produce - (producerLocalParameters: any, callback: Function, errback: Function)
   * @emits producedata - (dataProducerLocalParameters: any, callback: Function, errback: Function)
   */
  constructor({
    direction,
    id,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    appData,
    handlerFactory,
    extendedRtpCapabilities,
    canProduceByKind
  }) {
    super(); // Closed flag.

    this._closed = false; // Transport connection state.

    this._connectionState = 'new'; // Map of Producers indexed by id.

    this._producers = new Map(); // Map of Consumers indexed by id.

    this._consumers = new Map(); // Map of DataProducers indexed by id.

    this._dataProducers = new Map(); // Map of DataConsumers indexed by id.

    this._dataConsumers = new Map(); // Whether the Consumer for RTP probation has been created.

    this._probatorConsumerCreated = false; // AwaitQueue instance to make async tasks happen sequentially.

    this._awaitQueue = new awaitqueue_1.AwaitQueue({
      ClosedErrorClass: errors_1.InvalidStateError
    }); // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor() [id:%s, direction:%s]', id, direction);
    this._id = id;
    this._direction = direction;
    this._extendedRtpCapabilities = extendedRtpCapabilities;
    this._canProduceByKind = canProduceByKind;
    this._maxSctpMessageSize = sctpParameters ? sctpParameters.maxMessageSize : null; // Clone and sanitize additionalSettings.

    additionalSettings = utils.clone(additionalSettings, {});
    delete additionalSettings.iceServers;
    delete additionalSettings.iceTransportPolicy;
    delete additionalSettings.bundlePolicy;
    delete additionalSettings.rtcpMuxPolicy;
    delete additionalSettings.sdpSemantics;
    this._handler = handlerFactory();

    this._handler.run({
      direction,
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      iceServers,
      iceTransportPolicy,
      additionalSettings,
      proprietaryConstraints,
      extendedRtpCapabilities
    });

    this._appData = appData;

    this._handleHandler();
  }
  /**
   * Transport id.
   */


  get id() {
    return this._id;
  }
  /**
   * Whether the Transport is closed.
   */


  get closed() {
    return this._closed;
  }
  /**
   * Transport direction.
   */


  get direction() {
    return this._direction;
  }
  /**
   * RTC handler instance.
   */


  get handler() {
    return this._handler;
  }
  /**
   * Connection state.
   */


  get connectionState() {
    return this._connectionState;
  }
  /**
   * App custom data.
   */


  get appData() {
    return this._appData;
  }
  /**
   * Invalid setter.
   */


  set appData(appData) {
    throw new Error('cannot override appData object');
  }
  /**
   * Observer.
   *
   * @emits close
   * @emits newproducer - (producer: Producer)
   * @emits newconsumer - (producer: Producer)
   * @emits newdataproducer - (dataProducer: DataProducer)
   * @emits newdataconsumer - (dataProducer: DataProducer)
   */


  get observer() {
    return this._observer;
  }
  /**
   * Close the Transport.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true; // Close the AwaitQueue.

    this._awaitQueue.close(); // Close the handler.


    this._handler.close(); // Close all Producers.


    for (const producer of this._producers.values()) {
      producer.transportClosed();
    }

    this._producers.clear(); // Close all Consumers.


    for (const consumer of this._consumers.values()) {
      consumer.transportClosed();
    }

    this._consumers.clear(); // Close all DataProducers.


    for (const dataProducer of this._dataProducers.values()) {
      dataProducer.transportClosed();
    }

    this._dataProducers.clear(); // Close all DataConsumers.


    for (const dataConsumer of this._dataConsumers.values()) {
      dataConsumer.transportClosed();
    }

    this._dataConsumers.clear(); // Emit observer event.


    this._observer.safeEmit('close');
  }
  /**
   * Get associated Transport (RTCPeerConnection) stats.
   *
   * @returns {RTCStatsReport}
   */


  async getStats() {
    if (this._closed) throw new errors_1.InvalidStateError('closed');
    return this._handler.getTransportStats();
  }
  /**
   * Restart ICE connection.
   */


  async restartIce({
    iceParameters
  }) {
    logger.debug('restartIce()');
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (!iceParameters) throw new TypeError('missing iceParameters'); // Enqueue command.

    return this._awaitQueue.push(async () => this._handler.restartIce(iceParameters), 'transport.restartIce()');
  }
  /**
   * Update ICE servers.
   */


  async updateIceServers({
    iceServers
  } = {}) {
    logger.debug('updateIceServers()');
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (!Array.isArray(iceServers)) throw new TypeError('missing iceServers'); // Enqueue command.

    return this._awaitQueue.push(async () => this._handler.updateIceServers(iceServers), 'transport.updateIceServers()');
  }
  /**
   * Create a Producer.
   */


  async produce({
    track,
    encodings,
    codecOptions,
    codec,
    stopTracks = true,
    disableTrackOnPause = true,
    zeroRtpOnPause = false,
    appData = {}
  } = {}) {
    logger.debug('produce() [track:%o]', track);
    if (!track) throw new TypeError('missing track');else if (this._direction !== 'send') throw new errors_1.UnsupportedError('not a sending Transport');else if (!this._canProduceByKind[track.kind]) throw new errors_1.UnsupportedError(`cannot produce ${track.kind}`);else if (track.readyState === 'ended') throw new errors_1.InvalidStateError('track ended');else if (this.listenerCount('connect') === 0 && this._connectionState === 'new') throw new TypeError('no "connect" listener set into this transport');else if (this.listenerCount('produce') === 0) throw new TypeError('no "produce" listener set into this transport');else if (appData && typeof appData !== 'object') throw new TypeError('if given, appData must be an object'); // Enqueue command.

    return this._awaitQueue.push(async () => {
      let normalizedEncodings;

      if (encodings && !Array.isArray(encodings)) {
        throw TypeError('encodings must be an array');
      } else if (encodings && encodings.length === 0) {
        normalizedEncodings = undefined;
      } else if (encodings) {
        normalizedEncodings = encodings.map(encoding => {
          const normalizedEncoding = {
            active: true
          };
          if (encoding.active === false) normalizedEncoding.active = false;
          if (typeof encoding.dtx === 'boolean') normalizedEncoding.dtx = encoding.dtx;
          if (typeof encoding.scalabilityMode === 'string') normalizedEncoding.scalabilityMode = encoding.scalabilityMode;
          if (typeof encoding.scaleResolutionDownBy === 'number') normalizedEncoding.scaleResolutionDownBy = encoding.scaleResolutionDownBy;
          if (typeof encoding.maxBitrate === 'number') normalizedEncoding.maxBitrate = encoding.maxBitrate;
          if (typeof encoding.maxFramerate === 'number') normalizedEncoding.maxFramerate = encoding.maxFramerate;
          if (typeof encoding.adaptivePtime === 'boolean') normalizedEncoding.adaptivePtime = encoding.adaptivePtime;
          if (typeof encoding.priority === 'string') normalizedEncoding.priority = encoding.priority;
          if (typeof encoding.networkPriority === 'string') normalizedEncoding.networkPriority = encoding.networkPriority;
          return normalizedEncoding;
        });
      }

      const {
        localId,
        rtpParameters,
        rtpSender
      } = await this._handler.send({
        track,
        encodings: normalizedEncodings,
        codecOptions,
        codec
      });

      try {
        // This will fill rtpParameters's missing fields with default values.
        ortc.validateRtpParameters(rtpParameters);
        const {
          id
        } = await this.safeEmitAsPromise('produce', {
          kind: track.kind,
          rtpParameters,
          appData
        });
        const producer = new Producer_1.Producer({
          id,
          localId,
          rtpSender,
          track,
          rtpParameters,
          stopTracks,
          disableTrackOnPause,
          zeroRtpOnPause,
          appData
        });

        this._producers.set(producer.id, producer);

        this._handleProducer(producer); // Emit observer event.


        this._observer.safeEmit('newproducer', producer);

        return producer;
      } catch (error) {
        this._handler.stopSending(localId).catch(() => {});

        throw error;
      }
    }, 'transport.produce()') // This catch is needed to stop the given track if the command above
    // failed due to closed Transport.
    .catch(error => {
      if (stopTracks) {
        try {
          track.stop();
        } catch (error2) {}
      }

      throw error;
    });
  }
  /**
   * Create a Consumer to consume a remote Producer.
   */


  async consume({
    id,
    producerId,
    kind,
    rtpParameters,
    appData = {}
  }) {
    logger.debug('consume()');
    rtpParameters = utils.clone(rtpParameters, undefined);
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (this._direction !== 'recv') throw new errors_1.UnsupportedError('not a receiving Transport');else if (typeof id !== 'string') throw new TypeError('missing id');else if (typeof producerId !== 'string') throw new TypeError('missing producerId');else if (kind !== 'audio' && kind !== 'video') throw new TypeError(`invalid kind '${kind}'`);else if (this.listenerCount('connect') === 0 && this._connectionState === 'new') throw new TypeError('no "connect" listener set into this transport');else if (appData && typeof appData !== 'object') throw new TypeError('if given, appData must be an object'); // Enqueue command.

    return this._awaitQueue.push(async () => {
      // Ensure the device can consume it.
      const canConsume = ortc.canReceive(rtpParameters, this._extendedRtpCapabilities);
      if (!canConsume) throw new errors_1.UnsupportedError('cannot consume this Producer');
      const {
        localId,
        rtpReceiver,
        track
      } = await this._handler.receive({
        trackId: id,
        kind,
        rtpParameters
      });
      const consumer = new Consumer_1.Consumer({
        id,
        localId,
        producerId,
        rtpReceiver,
        track,
        rtpParameters,
        appData
      });

      this._consumers.set(consumer.id, consumer);

      this._handleConsumer(consumer); // If this is the first video Consumer and the Consumer for RTP probation
      // has not yet been created, create it now.


      if (!this._probatorConsumerCreated && kind === 'video') {
        try {
          const probatorRtpParameters = ortc.generateProbatorRtpParameters(consumer.rtpParameters);
          await this._handler.receive({
            trackId: 'probator',
            kind: 'video',
            rtpParameters: probatorRtpParameters
          });
          logger.debug('consume() | Consumer for RTP probation created');
          this._probatorConsumerCreated = true;
        } catch (error) {
          logger.error('consume() | failed to create Consumer for RTP probation:%o', error);
        }
      } // Emit observer event.


      this._observer.safeEmit('newconsumer', consumer);

      return consumer;
    }, 'transport.consume()');
  }
  /**
   * Create a DataProducer
   */


  async produceData({
    ordered = true,
    maxPacketLifeTime,
    maxRetransmits,
    priority = 'low',
    label = '',
    protocol = '',
    appData = {}
  } = {}) {
    logger.debug('produceData()');
    if (this._direction !== 'send') throw new errors_1.UnsupportedError('not a sending Transport');else if (!this._maxSctpMessageSize) throw new errors_1.UnsupportedError('SCTP not enabled by remote Transport');else if (!['very-low', 'low', 'medium', 'high'].includes(priority)) throw new TypeError('wrong priority');else if (this.listenerCount('connect') === 0 && this._connectionState === 'new') throw new TypeError('no "connect" listener set into this transport');else if (this.listenerCount('producedata') === 0) throw new TypeError('no "producedata" listener set into this transport');else if (appData && typeof appData !== 'object') throw new TypeError('if given, appData must be an object');
    if (maxPacketLifeTime || maxRetransmits) ordered = false; // Enqueue command.

    return this._awaitQueue.push(async () => {
      const {
        dataChannel,
        sctpStreamParameters
      } = await this._handler.sendDataChannel({
        ordered,
        maxPacketLifeTime,
        maxRetransmits,
        priority,
        label,
        protocol
      }); // This will fill sctpStreamParameters's missing fields with default values.

      ortc.validateSctpStreamParameters(sctpStreamParameters);
      const {
        id
      } = await this.safeEmitAsPromise('producedata', {
        sctpStreamParameters,
        label,
        protocol,
        appData
      });
      const dataProducer = new DataProducer_1.DataProducer({
        id,
        dataChannel,
        sctpStreamParameters,
        appData
      });

      this._dataProducers.set(dataProducer.id, dataProducer);

      this._handleDataProducer(dataProducer); // Emit observer event.


      this._observer.safeEmit('newdataproducer', dataProducer);

      return dataProducer;
    }, 'transport.produceData()');
  }
  /**
   * Create a DataConsumer
   */


  async consumeData({
    id,
    dataProducerId,
    sctpStreamParameters,
    label = '',
    protocol = '',
    appData = {}
  }) {
    logger.debug('consumeData()');
    sctpStreamParameters = utils.clone(sctpStreamParameters, undefined);
    if (this._closed) throw new errors_1.InvalidStateError('closed');else if (this._direction !== 'recv') throw new errors_1.UnsupportedError('not a receiving Transport');else if (!this._maxSctpMessageSize) throw new errors_1.UnsupportedError('SCTP not enabled by remote Transport');else if (typeof id !== 'string') throw new TypeError('missing id');else if (typeof dataProducerId !== 'string') throw new TypeError('missing dataProducerId');else if (this.listenerCount('connect') === 0 && this._connectionState === 'new') throw new TypeError('no "connect" listener set into this transport');else if (appData && typeof appData !== 'object') throw new TypeError('if given, appData must be an object'); // This may throw.

    ortc.validateSctpStreamParameters(sctpStreamParameters); // Enqueue command.

    return this._awaitQueue.push(async () => {
      const {
        dataChannel
      } = await this._handler.receiveDataChannel({
        sctpStreamParameters,
        label,
        protocol
      });
      const dataConsumer = new DataConsumer_1.DataConsumer({
        id,
        dataProducerId,
        dataChannel,
        sctpStreamParameters,
        appData
      });

      this._dataConsumers.set(dataConsumer.id, dataConsumer);

      this._handleDataConsumer(dataConsumer); // Emit observer event.


      this._observer.safeEmit('newdataconsumer', dataConsumer);

      return dataConsumer;
    }, 'transport.consumeData()');
  }

  _handleHandler() {
    const handler = this._handler;
    handler.on('@connect', ({
      dtlsParameters
    }, callback, errback) => {
      if (this._closed) {
        errback(new errors_1.InvalidStateError('closed'));
        return;
      }

      this.safeEmit('connect', {
        dtlsParameters
      }, callback, errback);
    });
    handler.on('@connectionstatechange', connectionState => {
      if (connectionState === this._connectionState) return;
      logger.debug('connection state changed to %s', connectionState);
      this._connectionState = connectionState;
      if (!this._closed) this.safeEmit('connectionstatechange', connectionState);
    });
  }

  _handleProducer(producer) {
    producer.on('@close', () => {
      this._producers.delete(producer.id);

      if (this._closed) return;

      this._awaitQueue.push(async () => this._handler.stopSending(producer.localId), 'producer @close event').catch(error => logger.warn('producer.close() failed:%o', error));
    });
    producer.on('@replacetrack', (track, callback, errback) => {
      this._awaitQueue.push(async () => this._handler.replaceTrack(producer.localId, track), 'producer @replacetrack event').then(callback).catch(errback);
    });
    producer.on('@setmaxspatiallayer', (spatialLayer, callback, errback) => {
      this._awaitQueue.push(async () => this._handler.setMaxSpatialLayer(producer.localId, spatialLayer), 'producer @setmaxspatiallayer event').then(callback).catch(errback);
    });
    producer.on('@setrtpencodingparameters', (params, callback, errback) => {
      this._awaitQueue.push(async () => this._handler.setRtpEncodingParameters(producer.localId, params), 'producer @setrtpencodingparameters event').then(callback).catch(errback);
    });
    producer.on('@getstats', (callback, errback) => {
      if (this._closed) return errback(new errors_1.InvalidStateError('closed'));

      this._handler.getSenderStats(producer.localId).then(callback).catch(errback);
    });
  }

  _handleConsumer(consumer) {
    consumer.on('@close', () => {
      this._consumers.delete(consumer.id);

      if (this._closed) return;

      this._awaitQueue.push(async () => this._handler.stopReceiving(consumer.localId), 'consumer @close event').catch(() => {});
    });
    consumer.on('@getstats', (callback, errback) => {
      if (this._closed) return errback(new errors_1.InvalidStateError('closed'));

      this._handler.getReceiverStats(consumer.localId).then(callback).catch(errback);
    });
  }

  _handleDataProducer(dataProducer) {
    dataProducer.on('@close', () => {
      this._dataProducers.delete(dataProducer.id);
    });
  }

  _handleDataConsumer(dataConsumer) {
    dataConsumer.on('@close', () => {
      this._dataConsumers.delete(dataConsumer.id);
    });
  }

}

exports.Transport = Transport;
},{"awaitqueue":"OGUt","./Logger":"andi","./EnhancedEventEmitter":"P3Oo","./errors":"hNUz","./utils":"fnp2","./ortc":"y0TR","./Producer":"dKU8","./Consumer":"QQSC","./DataProducer":"Z0Ve","./DataConsumer":"g5am"}],"VF80":[function(require,module,exports) {
var grammar = module.exports = {
  v: [{
    name: 'version',
    reg: /^(\d*)$/
  }],
  o: [{
    // o=- 20518 0 IN IP4 203.0.113.1
    // NB: sessionId will be a String in most cases because it is huge
    name: 'origin',
    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
    format: '%s %s %d %s IP%d %s'
  }],
  // default parsing of these only (though some of these feel outdated)
  s: [{ name: 'name' }],
  i: [{ name: 'description' }],
  u: [{ name: 'uri' }],
  e: [{ name: 'email' }],
  p: [{ name: 'phone' }],
  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly...
  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
  // k: [{}], // outdated thing ignored
  t: [{
    // t=0 0
    name: 'timing',
    reg: /^(\d*) (\d*)/,
    names: ['start', 'stop'],
    format: '%d %d'
  }],
  c: [{
    // c=IN IP4 10.47.197.26
    name: 'connection',
    reg: /^IN IP(\d) (\S*)/,
    names: ['version', 'ip'],
    format: 'IN IP%d %s'
  }],
  b: [{
    // b=AS:4000
    push: 'bandwidth',
    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
    names: ['type', 'limit'],
    format: '%s:%s'
  }],
  m: [{
    // m=video 51744 RTP/AVP 126 97 98 34 31
    // NB: special - pushes to session
    // TODO: rtp/fmtp should be filtered by the payloads found here?
    reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
    names: ['type', 'port', 'protocol', 'payloads'],
    format: '%s %d %s %s'
  }],
  a: [
    {
      // a=rtpmap:110 opus/48000/2
      push: 'rtp',
      reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
      names: ['payload', 'codec', 'rate', 'encoding'],
      format: function (o) {
        return (o.encoding)
          ? 'rtpmap:%d %s/%s/%s'
          : o.rate
            ? 'rtpmap:%d %s/%s'
            : 'rtpmap:%d %s';
      }
    },
    {
      // a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
      // a=fmtp:111 minptime=10; useinbandfec=1
      push: 'fmtp',
      reg: /^fmtp:(\d*) ([\S| ]*)/,
      names: ['payload', 'config'],
      format: 'fmtp:%d %s'
    },
    {
      // a=control:streamid=0
      name: 'control',
      reg: /^control:(.*)/,
      format: 'control:%s'
    },
    {
      // a=rtcp:65179 IN IP4 193.84.77.194
      name: 'rtcp',
      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
      names: ['port', 'netType', 'ipVer', 'address'],
      format: function (o) {
        return (o.address != null)
          ? 'rtcp:%d %s IP%d %s'
          : 'rtcp:%d';
      }
    },
    {
      // a=rtcp-fb:98 trr-int 100
      push: 'rtcpFbTrrInt',
      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
      names: ['payload', 'value'],
      format: 'rtcp-fb:%s trr-int %d'
    },
    {
      // a=rtcp-fb:98 nack rpsi
      push: 'rtcpFb',
      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
      names: ['payload', 'type', 'subtype'],
      format: function (o) {
        return (o.subtype != null)
          ? 'rtcp-fb:%s %s %s'
          : 'rtcp-fb:%s %s';
      }
    },
    {
      // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      // a=extmap:1/recvonly URI-gps-string
      // a=extmap:3 urn:ietf:params:rtp-hdrext:encrypt urn:ietf:params:rtp-hdrext:smpte-tc 25@600/24
      push: 'ext',
      reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
      names: ['value', 'direction', 'encrypt-uri', 'uri', 'config'],
      format: function (o) {
        return (
          'extmap:%d' +
          (o.direction ? '/%s' : '%v') +
          (o['encrypt-uri'] ? ' %s' : '%v') +
          ' %s' +
          (o.config ? ' %s' : '')
        );
      }
    },
    {
      // a=extmap-allow-mixed
      name: 'extmapAllowMixed',
      reg: /^(extmap-allow-mixed)/
    },
    {
      // a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
      push: 'crypto',
      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
      names: ['id', 'suite', 'config', 'sessionConfig'],
      format: function (o) {
        return (o.sessionConfig != null)
          ? 'crypto:%d %s %s %s'
          : 'crypto:%d %s %s';
      }
    },
    {
      // a=setup:actpass
      name: 'setup',
      reg: /^setup:(\w*)/,
      format: 'setup:%s'
    },
    {
      // a=connection:new
      name: 'connectionType',
      reg: /^connection:(new|existing)/,
      format: 'connection:%s'
    },
    {
      // a=mid:1
      name: 'mid',
      reg: /^mid:([^\s]*)/,
      format: 'mid:%s'
    },
    {
      // a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
      name: 'msid',
      reg: /^msid:(.*)/,
      format: 'msid:%s'
    },
    {
      // a=ptime:20
      name: 'ptime',
      reg: /^ptime:(\d*(?:\.\d*)*)/,
      format: 'ptime:%d'
    },
    {
      // a=maxptime:60
      name: 'maxptime',
      reg: /^maxptime:(\d*(?:\.\d*)*)/,
      format: 'maxptime:%d'
    },
    {
      // a=sendrecv
      name: 'direction',
      reg: /^(sendrecv|recvonly|sendonly|inactive)/
    },
    {
      // a=ice-lite
      name: 'icelite',
      reg: /^(ice-lite)/
    },
    {
      // a=ice-ufrag:F7gI
      name: 'iceUfrag',
      reg: /^ice-ufrag:(\S*)/,
      format: 'ice-ufrag:%s'
    },
    {
      // a=ice-pwd:x9cml/YzichV2+XlhiMu8g
      name: 'icePwd',
      reg: /^ice-pwd:(\S*)/,
      format: 'ice-pwd:%s'
    },
    {
      // a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
      name: 'fingerprint',
      reg: /^fingerprint:(\S*) (\S*)/,
      names: ['type', 'hash'],
      format: 'fingerprint:%s %s'
    },
    {
      // a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
      // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
      // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
      // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
      // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
      push:'candidates',
      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
      format: function (o) {
        var str = 'candidate:%s %d %s %d %s %d typ %s';

        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

        // NB: candidate has three optional chunks, so %void middles one if it's missing
        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

        if (o.generation != null) {
          str += ' generation %d';
        }

        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
        return str;
      }
    },
    {
      // a=end-of-candidates (keep after the candidates line for readability)
      name: 'endOfCandidates',
      reg: /^(end-of-candidates)/
    },
    {
      // a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
      name: 'remoteCandidates',
      reg: /^remote-candidates:(.*)/,
      format: 'remote-candidates:%s'
    },
    {
      // a=ice-options:google-ice
      name: 'iceOptions',
      reg: /^ice-options:(\S*)/,
      format: 'ice-options:%s'
    },
    {
      // a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
      push: 'ssrcs',
      reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
      names: ['id', 'attribute', 'value'],
      format: function (o) {
        var str = 'ssrc:%d';
        if (o.attribute != null) {
          str += ' %s';
          if (o.value != null) {
            str += ':%s';
          }
        }
        return str;
      }
    },
    {
      // a=ssrc-group:FEC 1 2
      // a=ssrc-group:FEC-FR 3004364195 1080772241
      push: 'ssrcGroups',
      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
      names: ['semantics', 'ssrcs'],
      format: 'ssrc-group:%s %s'
    },
    {
      // a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
      name: 'msidSemantic',
      reg: /^msid-semantic:\s?(\w*) (\S*)/,
      names: ['semantic', 'token'],
      format: 'msid-semantic: %s %s' // space after ':' is not accidental
    },
    {
      // a=group:BUNDLE audio video
      push: 'groups',
      reg: /^group:(\w*) (.*)/,
      names: ['type', 'mids'],
      format: 'group:%s %s'
    },
    {
      // a=rtcp-mux
      name: 'rtcpMux',
      reg: /^(rtcp-mux)/
    },
    {
      // a=rtcp-rsize
      name: 'rtcpRsize',
      reg: /^(rtcp-rsize)/
    },
    {
      // a=sctpmap:5000 webrtc-datachannel 1024
      name: 'sctpmap',
      reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
      format: function (o) {
        return (o.maxMessageSize != null)
          ? 'sctpmap:%s %s %s'
          : 'sctpmap:%s %s';
      }
    },
    {
      // a=x-google-flag:conference
      name: 'xGoogleFlag',
      reg: /^x-google-flag:([^\s]*)/,
      format: 'x-google-flag:%s'
    },
    {
      // a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
      push: 'rids',
      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
      names: ['id', 'direction', 'params'],
      format: function (o) {
        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
      }
    },
    {
      // a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
      // a=imageattr:* send [x=800,y=640] recv *
      // a=imageattr:100 recv [x=320,y=240]
      push: 'imageattrs',
      reg: new RegExp(
        // a=imageattr:97
        '^imageattr:(\\d+|\\*)' +
        // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
        // recv [x=330,y=250]
        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
      ),
      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
      format: function (o) {
        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    {
      // a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
      // a=simulcast:recv 1;4,5 send 6;7
      name: 'simulcast',
      reg: new RegExp(
        // a=simulcast:
        '^simulcast:' +
        // send 1,2,3;~4,~5
        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
        // space + recv 6;~7,~8
        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
        // end
        '$'
      ),
      names: ['dir1', 'list1', 'dir2', 'list2'],
      format: function (o) {
        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
      }
    },
    {
      // old simulcast draft 03 (implemented by Firefox)
      //   https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
      // a=simulcast: recv pt=97;98 send pt=97
      // a=simulcast: send rid=5;6;7 paused=6,7
      name: 'simulcast_03',
      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
      names: ['value'],
      format: 'simulcast: %s'
    },
    {
      // a=framerate:25
      // a=framerate:29.97
      name: 'framerate',
      reg: /^framerate:(\d+(?:$|\.\d+))/,
      format: 'framerate:%s'
    },
    {
      // RFC4570
      // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
      name: 'sourceFilter',
      reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
      names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
      format: 'source-filter: %s %s %s %s %s'
    },
    {
      // a=bundle-only
      name: 'bundleOnly',
      reg: /^(bundle-only)/
    },
    {
      // a=label:1
      name: 'label',
      reg: /^label:(.+)/,
      format: 'label:%s'
    },
    {
      // RFC version 26 for SCTP over DTLS
      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-5
      name: 'sctpPort',
      reg: /^sctp-port:(\d+)$/,
      format: 'sctp-port:%s'
    },
    {
      // RFC version 26 for SCTP over DTLS
      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-6
      name: 'maxMessageSize',
      reg: /^max-message-size:(\d+)$/,
      format: 'max-message-size:%s'
    },
    {
      // RFC7273
      // a=ts-refclk:ptp=IEEE1588-2008:39-A7-94-FF-FE-07-CB-D0:37
      push:'tsRefClocks',
      reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
      names: ['clksrc', 'clksrcExt'],
      format: function (o) {
        return 'ts-refclk:%s' + (o.clksrcExt != null ? '=%s' : '');
      }
    },
    {
      // RFC7273
      // a=mediaclk:direct=963214424
      name:'mediaClk',
      reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
      names: ['id', 'mediaClockName', 'mediaClockValue', 'rateNumerator', 'rateDenominator'],
      format: function (o) {
        var str = 'mediaclk:';
        str += (o.id != null ? 'id=%s %s' : '%v%s');
        str += (o.mediaClockValue != null ? '=%s' : '');
        str += (o.rateNumerator != null ? ' rate=%s' : '');
        str += (o.rateDenominator != null ? '/%s' : '');
        return str;
      }
    },
    {
      // a=keywds:keywords
      name: 'keywords',
      reg: /^keywds:(.+)$/,
      format: 'keywds:%s'
    },
    {
      // a=content:main
      name: 'content',
      reg: /^content:(.+)/,
      format: 'content:%s'
    },
    // BFCP https://tools.ietf.org/html/rfc4583
    {
      // a=floorctrl:c-s
      name: 'bfcpFloorCtrl',
      reg: /^floorctrl:(c-only|s-only|c-s)/,
      format: 'floorctrl:%s'
    },
    {
      // a=confid:1
      name: 'bfcpConfId',
      reg: /^confid:(\d+)/,
      format: 'confid:%s'
    },
    {
      // a=userid:1
      name: 'bfcpUserId',
      reg: /^userid:(\d+)/,
      format: 'userid:%s'
    },
    {
      // a=floorid:1
      name: 'bfcpFloorId',
      reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
      names: ['id', 'mStream'],
      format: 'floorid:%s mstrm:%s'
    },
    {
      // any a= that we don't understand is kept verbatim on media.invalid
      push: 'invalid',
      names: ['value']
    }
  ]
};

// set sensible defaults to avoid polluting the grammar with boring details
Object.keys(grammar).forEach(function (key) {
  var objs = grammar[key];
  objs.forEach(function (obj) {
    if (!obj.reg) {
      obj.reg = /(.*)/;
    }
    if (!obj.format) {
      obj.format = '%s';
    }
  });
});

},{}],"pJ4u":[function(require,module,exports) {
var toIntIfInt = function (v) {
  return String(Number(v)) === v ? Number(v) : v;
};

var attachProperties = function (match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  }
  else {
    for (var i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
};

var parseReg = function (obj, location, content) {
  var needsBlank = obj.name && obj.names;
  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  }
  else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }
  var keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
};

var grammar = require('./grammar');
var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

exports.parse = function (sdp) {
  var session = {}
    , media = []
    , location = session; // points at where properties go under (one of the above)

  // parse lines we understand
  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
    var type = l[0];
    var content = l.slice(2);
    if (type === 'm') {
      media.push({rtp: [], fmtp: []});
      location = media[media.length-1]; // point at latest media line
    }

    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
      var obj = grammar[type][j];
      if (obj.reg.test(content)) {
        return parseReg(obj, location, content);
      }
    }
  });

  session.media = media; // link it up
  return session;
};

var paramReducer = function (acc, expr) {
  var s = expr.split(/=(.+)/, 2);
  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  } else if (s.length === 1 && expr.length > 1) {
    acc[s[0]] = undefined;
  }
  return acc;
};

exports.parseParams = function (str) {
  return str.split(/;\s?/).reduce(paramReducer, {});
};

// For backward compatibility - alias will be removed in 3.0.0
exports.parseFmtpConfig = exports.parseParams;

exports.parsePayloads = function (str) {
  return str.toString().split(' ').map(Number);
};

exports.parseRemoteCandidates = function (str) {
  var candidates = [];
  var parts = str.split(' ').map(toIntIfInt);
  for (var i = 0; i < parts.length; i += 3) {
    candidates.push({
      component: parts[i],
      ip: parts[i + 1],
      port: parts[i + 2]
    });
  }
  return candidates;
};

exports.parseImageAttributes = function (str) {
  return str.split(' ').map(function (item) {
    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
  });
};

exports.parseSimulcastStreamList = function (str) {
  return str.split(';').map(function (stream) {
    return stream.split(',').map(function (format) {
      var scid, paused = false;

      if (format[0] !== '~') {
        scid = toIntIfInt(format);
      } else {
        scid = toIntIfInt(format.substring(1, format.length));
        paused = true;
      }

      return {
        scid: scid,
        paused: paused
      };
    });
  });
};

},{"./grammar":"VF80"}],"dFSN":[function(require,module,exports) {
var grammar = require('./grammar');

// customized util.format - discards excess arguments and can void middle ones
var formatRegExp = /%[sdv%]/g;
var format = function (formatStr) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  return formatStr.replace(formatRegExp, function (x) {
    if (i >= len) {
      return x; // missing argument
    }
    var arg = args[i];
    i += 1;
    switch (x) {
    case '%%':
      return '%';
    case '%s':
      return String(arg);
    case '%d':
      return Number(arg);
    case '%v':
      return '';
    }
  });
  // NB: we discard excess arguments - they are typically undefined from makeLine
};

var makeLine = function (type, obj, location) {
  var str = obj.format instanceof Function ?
    (obj.format(obj.push ? location : location[obj.name])) :
    obj.format;

  var args = [type + '=' + str];
  if (obj.names) {
    for (var i = 0; i < obj.names.length; i += 1) {
      var n = obj.names[i];
      if (obj.name) {
        args.push(location[obj.name][n]);
      }
      else { // for mLine and push attributes
        args.push(location[obj.names[i]]);
      }
    }
  }
  else {
    args.push(location[obj.name]);
  }
  return format.apply(null, args);
};

// RFC specified order
// TODO: extend this with all the rest
var defaultOuterOrder = [
  'v', 'o', 's', 'i',
  'u', 'e', 'p', 'c',
  'b', 't', 'r', 'z', 'a'
];
var defaultInnerOrder = ['i', 'c', 'b', 'a'];


module.exports = function (session, opts) {
  opts = opts || {};
  // ensure certain properties exist
  if (session.version == null) {
    session.version = 0; // 'v=0' must be there (only defined version atm)
  }
  if (session.name == null) {
    session.name = ' '; // 's= ' must be there if no meaningful name set
  }
  session.media.forEach(function (mLine) {
    if (mLine.payloads == null) {
      mLine.payloads = '';
    }
  });

  var outerOrder = opts.outerOrder || defaultOuterOrder;
  var innerOrder = opts.innerOrder || defaultInnerOrder;
  var sdp = [];

  // loop through outerOrder for matching properties on session
  outerOrder.forEach(function (type) {
    grammar[type].forEach(function (obj) {
      if (obj.name in session && session[obj.name] != null) {
        sdp.push(makeLine(type, obj, session));
      }
      else if (obj.push in session && session[obj.push] != null) {
        session[obj.push].forEach(function (el) {
          sdp.push(makeLine(type, obj, el));
        });
      }
    });
  });

  // then for each media line, follow the innerOrder
  session.media.forEach(function (mLine) {
    sdp.push(makeLine('m', grammar.m[0], mLine));

    innerOrder.forEach(function (type) {
      grammar[type].forEach(function (obj) {
        if (obj.name in mLine && mLine[obj.name] != null) {
          sdp.push(makeLine(type, obj, mLine));
        }
        else if (obj.push in mLine && mLine[obj.push] != null) {
          mLine[obj.push].forEach(function (el) {
            sdp.push(makeLine(type, obj, el));
          });
        }
      });
    });
  });

  return sdp.join('\r\n') + '\r\n';
};

},{"./grammar":"VF80"}],"CfIM":[function(require,module,exports) {
var parser = require('./parser');
var writer = require('./writer');

exports.write = writer;
exports.parse = parser.parse;
exports.parseParams = parser.parseParams;
exports.parseFmtpConfig = parser.parseFmtpConfig; // Alias of parseParams().
exports.parsePayloads = parser.parsePayloads;
exports.parseRemoteCandidates = parser.parseRemoteCandidates;
exports.parseImageAttributes = parser.parseImageAttributes;
exports.parseSimulcastStreamList = parser.parseSimulcastStreamList;

},{"./parser":"pJ4u","./writer":"dFSN"}],"p5WR":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyCodecParameters = exports.getCname = exports.extractDtlsParameters = exports.extractRtpCapabilities = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

function extractRtpCapabilities({
  sdpObject
}) {
  // Map of RtpCodecParameters indexed by payload type.
  const codecsMap = new Map(); // Array of RtpHeaderExtensions.

  const headerExtensions = []; // Whether a m=audio/video section has been already found.

  let gotAudio = false;
  let gotVideo = false;

  for (const m of sdpObject.media) {
    const kind = m.type;

    switch (kind) {
      case 'audio':
        {
          if (gotAudio) continue;
          gotAudio = true;
          break;
        }

      case 'video':
        {
          if (gotVideo) continue;
          gotVideo = true;
          break;
        }

      default:
        {
          continue;
        }
    } // Get codecs.


    for (const rtp of m.rtp) {
      const codec = {
        kind: kind,
        mimeType: `${kind}/${rtp.codec}`,
        preferredPayloadType: rtp.payload,
        clockRate: rtp.rate,
        channels: rtp.encoding,
        parameters: {},
        rtcpFeedback: []
      };
      codecsMap.set(codec.preferredPayloadType, codec);
    } // Get codec parameters.


    for (const fmtp of m.fmtp || []) {
      const parameters = sdpTransform.parseParams(fmtp.config);
      const codec = codecsMap.get(fmtp.payload);
      if (!codec) continue; // Specials case to convert parameter value to string.

      if (parameters && parameters['profile-level-id']) parameters['profile-level-id'] = String(parameters['profile-level-id']);
      codec.parameters = parameters;
    } // Get RTCP feedback for each codec.


    for (const fb of m.rtcpFb || []) {
      const codec = codecsMap.get(fb.payload);
      if (!codec) continue;
      const feedback = {
        type: fb.type,
        parameter: fb.subtype
      };
      if (!feedback.parameter) delete feedback.parameter;
      codec.rtcpFeedback.push(feedback);
    } // Get RTP header extensions.


    for (const ext of m.ext || []) {
      // Ignore encrypted extensions (not yet supported in mediasoup).
      if (ext['encrypt-uri']) continue;
      const headerExtension = {
        kind: kind,
        uri: ext.uri,
        preferredId: ext.value
      };
      headerExtensions.push(headerExtension);
    }
  }

  const rtpCapabilities = {
    codecs: Array.from(codecsMap.values()),
    headerExtensions: headerExtensions
  };
  return rtpCapabilities;
}

exports.extractRtpCapabilities = extractRtpCapabilities;

function extractDtlsParameters({
  sdpObject
}) {
  const mediaObject = (sdpObject.media || []).find(m => m.iceUfrag && m.port !== 0);
  if (!mediaObject) throw new Error('no active media section found');
  const fingerprint = mediaObject.fingerprint || sdpObject.fingerprint;
  let role;

  switch (mediaObject.setup) {
    case 'active':
      role = 'client';
      break;

    case 'passive':
      role = 'server';
      break;

    case 'actpass':
      role = 'auto';
      break;
  }

  const dtlsParameters = {
    role,
    fingerprints: [{
      algorithm: fingerprint.type,
      value: fingerprint.hash
    }]
  };
  return dtlsParameters;
}

exports.extractDtlsParameters = extractDtlsParameters;

function getCname({
  offerMediaObject
}) {
  const ssrcCnameLine = (offerMediaObject.ssrcs || []).find(line => line.attribute === 'cname');
  if (!ssrcCnameLine) return '';
  return ssrcCnameLine.value;
}

exports.getCname = getCname;
/**
 * Apply codec parameters in the given SDP m= section answer based on the
 * given RTP parameters of an offer.
 */

function applyCodecParameters({
  offerRtpParameters,
  answerMediaObject
}) {
  for (const codec of offerRtpParameters.codecs) {
    const mimeType = codec.mimeType.toLowerCase(); // Avoid parsing codec parameters for unhandled codecs.

    if (mimeType !== 'audio/opus') continue;
    const rtp = (answerMediaObject.rtp || []).find(r => r.payload === codec.payloadType);
    if (!rtp) continue; // Just in case.

    answerMediaObject.fmtp = answerMediaObject.fmtp || [];
    let fmtp = answerMediaObject.fmtp.find(f => f.payload === codec.payloadType);

    if (!fmtp) {
      fmtp = {
        payload: codec.payloadType,
        config: ''
      };
      answerMediaObject.fmtp.push(fmtp);
    }

    const parameters = sdpTransform.parseParams(fmtp.config);

    switch (mimeType) {
      case 'audio/opus':
        {
          const spropStereo = codec.parameters['sprop-stereo'];
          if (spropStereo !== undefined) parameters.stereo = spropStereo ? 1 : 0;
          break;
        }
    } // Write the codec fmtp.config back.


    fmtp.config = '';

    for (const key of Object.keys(parameters)) {
      if (fmtp.config) fmtp.config += ';';
      fmtp.config += `${key}=${parameters[key]}`;
    }
  }
}

exports.applyCodecParameters = applyCodecParameters;
},{"sdp-transform":"CfIM"}],"C7JJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLegacySimulcast = exports.getRtpEncodings = void 0;

function getRtpEncodings({
  offerMediaObject
}) {
  const ssrcs = new Set();

  for (const line of offerMediaObject.ssrcs || []) {
    const ssrc = line.id;
    ssrcs.add(ssrc);
  }

  if (ssrcs.size === 0) throw new Error('no a=ssrc lines found');
  const ssrcToRtxSsrc = new Map(); // First assume RTX is used.

  for (const line of offerMediaObject.ssrcGroups || []) {
    if (line.semantics !== 'FID') continue;
    let [ssrc, rtxSsrc] = line.ssrcs.split(/\s+/);
    ssrc = Number(ssrc);
    rtxSsrc = Number(rtxSsrc);

    if (ssrcs.has(ssrc)) {
      // Remove both the SSRC and RTX SSRC from the set so later we know that they
      // are already handled.
      ssrcs.delete(ssrc);
      ssrcs.delete(rtxSsrc); // Add to the map.

      ssrcToRtxSsrc.set(ssrc, rtxSsrc);
    }
  } // If the set of SSRCs is not empty it means that RTX is not being used, so take
  // media SSRCs from there.


  for (const ssrc of ssrcs) {
    // Add to the map.
    ssrcToRtxSsrc.set(ssrc, null);
  }

  const encodings = [];

  for (const [ssrc, rtxSsrc] of ssrcToRtxSsrc) {
    const encoding = {
      ssrc
    };
    if (rtxSsrc) encoding.rtx = {
      ssrc: rtxSsrc
    };
    encodings.push(encoding);
  }

  return encodings;
}

exports.getRtpEncodings = getRtpEncodings;
/**
 * Adds multi-ssrc based simulcast into the given SDP media section offer.
 */

function addLegacySimulcast({
  offerMediaObject,
  numStreams
}) {
  if (numStreams <= 1) throw new TypeError('numStreams must be greater than 1'); // Get the SSRC.

  const ssrcMsidLine = (offerMediaObject.ssrcs || []).find(line => line.attribute === 'msid');
  if (!ssrcMsidLine) throw new Error('a=ssrc line with msid information not found');
  const [streamId, trackId] = ssrcMsidLine.value.split(' ')[0];
  const firstSsrc = ssrcMsidLine.id;
  let firstRtxSsrc; // Get the SSRC for RTX.

  (offerMediaObject.ssrcGroups || []).some(line => {
    if (line.semantics !== 'FID') return false;
    const ssrcs = line.ssrcs.split(/\s+/);

    if (Number(ssrcs[0]) === firstSsrc) {
      firstRtxSsrc = Number(ssrcs[1]);
      return true;
    } else {
      return false;
    }
  });
  const ssrcCnameLine = offerMediaObject.ssrcs.find(line => line.attribute === 'cname');
  if (!ssrcCnameLine) throw new Error('a=ssrc line with cname information not found');
  const cname = ssrcCnameLine.value;
  const ssrcs = [];
  const rtxSsrcs = [];

  for (let i = 0; i < numStreams; ++i) {
    ssrcs.push(firstSsrc + i);
    if (firstRtxSsrc) rtxSsrcs.push(firstRtxSsrc + i);
  }

  offerMediaObject.ssrcGroups = [];
  offerMediaObject.ssrcs = [];
  offerMediaObject.ssrcGroups.push({
    semantics: 'SIM',
    ssrcs: ssrcs.join(' ')
  });

  for (let i = 0; i < ssrcs.length; ++i) {
    const ssrc = ssrcs[i];
    offerMediaObject.ssrcs.push({
      id: ssrc,
      attribute: 'cname',
      value: cname
    });
    offerMediaObject.ssrcs.push({
      id: ssrc,
      attribute: 'msid',
      value: `${streamId} ${trackId}`
    });
  }

  for (let i = 0; i < rtxSsrcs.length; ++i) {
    const ssrc = ssrcs[i];
    const rtxSsrc = rtxSsrcs[i];
    offerMediaObject.ssrcs.push({
      id: rtxSsrc,
      attribute: 'cname',
      value: cname
    });
    offerMediaObject.ssrcs.push({
      id: rtxSsrc,
      attribute: 'msid',
      value: `${streamId} ${trackId}`
    });
    offerMediaObject.ssrcGroups.push({
      semantics: 'FID',
      ssrcs: `${ssrc} ${rtxSsrc}`
    });
  }
}

exports.addLegacySimulcast = addLegacySimulcast;
},{}],"JfyM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlerInterface = void 0;

const EnhancedEventEmitter_1 = require("../EnhancedEventEmitter");

class HandlerInterface extends EnhancedEventEmitter_1.EnhancedEventEmitter {
  /**
   * @emits @connect - (
   *     { dtlsParameters: DtlsParameters },
   *     callback: Function,
   *     errback: Function
   *   )
   * @emits @connectionstatechange - (connectionState: ConnectionState)
   */
  constructor() {
    super();
  }

}

exports.HandlerInterface = HandlerInterface;
},{"../EnhancedEventEmitter":"P3Oo"}],"SdHv":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OfferMediaSection = exports.AnswerMediaSection = exports.MediaSection = void 0;

const utils = __importStar(require("../../utils"));

class MediaSection {
  constructor({
    iceParameters,
    iceCandidates,
    dtlsParameters,
    planB = false
  }) {
    this._mediaObject = {};
    this._planB = planB;

    if (iceParameters) {
      this.setIceParameters(iceParameters);
    }

    if (iceCandidates) {
      this._mediaObject.candidates = [];

      for (const candidate of iceCandidates) {
        const candidateObject = {}; // mediasoup does mandates rtcp-mux so candidates component is always
        // RTP (1).

        candidateObject.component = 1;
        candidateObject.foundation = candidate.foundation;
        candidateObject.ip = candidate.ip;
        candidateObject.port = candidate.port;
        candidateObject.priority = candidate.priority;
        candidateObject.transport = candidate.protocol;
        candidateObject.type = candidate.type;
        if (candidate.tcpType) candidateObject.tcptype = candidate.tcpType;

        this._mediaObject.candidates.push(candidateObject);
      }

      this._mediaObject.endOfCandidates = 'end-of-candidates';
      this._mediaObject.iceOptions = 'renomination';
    }

    if (dtlsParameters) {
      this.setDtlsRole(dtlsParameters.role);
    }
  }

  get mid() {
    return String(this._mediaObject.mid);
  }

  get closed() {
    return this._mediaObject.port === 0;
  }

  getObject() {
    return this._mediaObject;
  }

  setIceParameters(iceParameters) {
    this._mediaObject.iceUfrag = iceParameters.usernameFragment;
    this._mediaObject.icePwd = iceParameters.password;
  }

  disable() {
    this._mediaObject.direction = 'inactive';
    delete this._mediaObject.ext;
    delete this._mediaObject.ssrcs;
    delete this._mediaObject.ssrcGroups;
    delete this._mediaObject.simulcast;
    delete this._mediaObject.simulcast_03;
    delete this._mediaObject.rids;
  }

  close() {
    this._mediaObject.direction = 'inactive';
    this._mediaObject.port = 0;
    delete this._mediaObject.ext;
    delete this._mediaObject.ssrcs;
    delete this._mediaObject.ssrcGroups;
    delete this._mediaObject.simulcast;
    delete this._mediaObject.simulcast_03;
    delete this._mediaObject.rids;
    delete this._mediaObject.extmapAllowMixed;
  }

}

exports.MediaSection = MediaSection;

class AnswerMediaSection extends MediaSection {
  constructor({
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    plainRtpParameters,
    planB = false,
    offerMediaObject,
    offerRtpParameters,
    answerRtpParameters,
    codecOptions,
    extmapAllowMixed = false
  }) {
    super({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      planB
    });
    this._mediaObject.mid = String(offerMediaObject.mid);
    this._mediaObject.type = offerMediaObject.type;
    this._mediaObject.protocol = offerMediaObject.protocol;

    if (!plainRtpParameters) {
      this._mediaObject.connection = {
        ip: '127.0.0.1',
        version: 4
      };
      this._mediaObject.port = 7;
    } else {
      this._mediaObject.connection = {
        ip: plainRtpParameters.ip,
        version: plainRtpParameters.ipVersion
      };
      this._mediaObject.port = plainRtpParameters.port;
    }

    switch (offerMediaObject.type) {
      case 'audio':
      case 'video':
        {
          this._mediaObject.direction = 'recvonly';
          this._mediaObject.rtp = [];
          this._mediaObject.rtcpFb = [];
          this._mediaObject.fmtp = [];

          for (const codec of answerRtpParameters.codecs) {
            const rtp = {
              payload: codec.payloadType,
              codec: getCodecName(codec),
              rate: codec.clockRate
            };
            if (codec.channels > 1) rtp.encoding = codec.channels;

            this._mediaObject.rtp.push(rtp);

            const codecParameters = utils.clone(codec.parameters, {});

            if (codecOptions) {
              const {
                opusStereo,
                opusFec,
                opusDtx,
                opusMaxPlaybackRate,
                opusMaxAverageBitrate,
                opusPtime,
                videoGoogleStartBitrate,
                videoGoogleMaxBitrate,
                videoGoogleMinBitrate
              } = codecOptions;
              const offerCodec = offerRtpParameters.codecs.find(c => c.payloadType === codec.payloadType);

              switch (codec.mimeType.toLowerCase()) {
                case 'audio/opus':
                  {
                    if (opusStereo !== undefined) {
                      offerCodec.parameters['sprop-stereo'] = opusStereo ? 1 : 0;
                      codecParameters.stereo = opusStereo ? 1 : 0;
                    }

                    if (opusFec !== undefined) {
                      offerCodec.parameters.useinbandfec = opusFec ? 1 : 0;
                      codecParameters.useinbandfec = opusFec ? 1 : 0;
                    }

                    if (opusDtx !== undefined) {
                      offerCodec.parameters.usedtx = opusDtx ? 1 : 0;
                      codecParameters.usedtx = opusDtx ? 1 : 0;
                    }

                    if (opusMaxPlaybackRate !== undefined) {
                      codecParameters.maxplaybackrate = opusMaxPlaybackRate;
                    }

                    if (opusMaxAverageBitrate !== undefined) {
                      codecParameters.maxaveragebitrate = opusMaxAverageBitrate;
                    }

                    if (opusPtime !== undefined) {
                      offerCodec.parameters.ptime = opusPtime;
                      codecParameters.ptime = opusPtime;
                    }

                    break;
                  }

                case 'video/vp8':
                case 'video/vp9':
                case 'video/h264':
                case 'video/h265':
                  {
                    if (videoGoogleStartBitrate !== undefined) codecParameters['x-google-start-bitrate'] = videoGoogleStartBitrate;
                    if (videoGoogleMaxBitrate !== undefined) codecParameters['x-google-max-bitrate'] = videoGoogleMaxBitrate;
                    if (videoGoogleMinBitrate !== undefined) codecParameters['x-google-min-bitrate'] = videoGoogleMinBitrate;
                    break;
                  }
              }
            }

            const fmtp = {
              payload: codec.payloadType,
              config: ''
            };

            for (const key of Object.keys(codecParameters)) {
              if (fmtp.config) fmtp.config += ';';
              fmtp.config += `${key}=${codecParameters[key]}`;
            }

            if (fmtp.config) this._mediaObject.fmtp.push(fmtp);

            for (const fb of codec.rtcpFeedback) {
              this._mediaObject.rtcpFb.push({
                payload: codec.payloadType,
                type: fb.type,
                subtype: fb.parameter
              });
            }
          }

          this._mediaObject.payloads = answerRtpParameters.codecs.map(codec => codec.payloadType).join(' ');
          this._mediaObject.ext = [];

          for (const ext of answerRtpParameters.headerExtensions) {
            // Don't add a header extension if not present in the offer.
            const found = (offerMediaObject.ext || []).some(localExt => localExt.uri === ext.uri);
            if (!found) continue;

            this._mediaObject.ext.push({
              uri: ext.uri,
              value: ext.id
            });
          } // Allow both 1 byte and 2 bytes length header extensions.


          if (extmapAllowMixed && offerMediaObject.extmapAllowMixed === 'extmap-allow-mixed') {
            this._mediaObject.extmapAllowMixed = 'extmap-allow-mixed';
          } // Simulcast.


          if (offerMediaObject.simulcast) {
            this._mediaObject.simulcast = {
              dir1: 'recv',
              list1: offerMediaObject.simulcast.list1
            };
            this._mediaObject.rids = [];

            for (const rid of offerMediaObject.rids || []) {
              if (rid.direction !== 'send') continue;

              this._mediaObject.rids.push({
                id: rid.id,
                direction: 'recv'
              });
            }
          } // Simulcast (draft version 03).
          else if (offerMediaObject.simulcast_03) {
              // eslint-disable-next-line camelcase
              this._mediaObject.simulcast_03 = {
                value: offerMediaObject.simulcast_03.value.replace(/send/g, 'recv')
              };
              this._mediaObject.rids = [];

              for (const rid of offerMediaObject.rids || []) {
                if (rid.direction !== 'send') continue;

                this._mediaObject.rids.push({
                  id: rid.id,
                  direction: 'recv'
                });
              }
            }

          this._mediaObject.rtcpMux = 'rtcp-mux';
          this._mediaObject.rtcpRsize = 'rtcp-rsize';
          if (this._planB && this._mediaObject.type === 'video') this._mediaObject.xGoogleFlag = 'conference';
          break;
        }

      case 'application':
        {
          // New spec.
          if (typeof offerMediaObject.sctpPort === 'number') {
            this._mediaObject.payloads = 'webrtc-datachannel';
            this._mediaObject.sctpPort = sctpParameters.port;
            this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
          } // Old spec.
          else if (offerMediaObject.sctpmap) {
              this._mediaObject.payloads = sctpParameters.port;
              this._mediaObject.sctpmap = {
                app: 'webrtc-datachannel',
                sctpmapNumber: sctpParameters.port,
                maxMessageSize: sctpParameters.maxMessageSize
              };
            }

          break;
        }
    }
  }

  setDtlsRole(role) {
    switch (role) {
      case 'client':
        this._mediaObject.setup = 'active';
        break;

      case 'server':
        this._mediaObject.setup = 'passive';
        break;

      case 'auto':
        this._mediaObject.setup = 'actpass';
        break;
    }
  }

}

exports.AnswerMediaSection = AnswerMediaSection;

class OfferMediaSection extends MediaSection {
  constructor({
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    plainRtpParameters,
    planB = false,
    mid,
    kind,
    offerRtpParameters,
    streamId,
    trackId,
    oldDataChannelSpec = false
  }) {
    super({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      planB
    });
    this._mediaObject.mid = String(mid);
    this._mediaObject.type = kind;

    if (!plainRtpParameters) {
      this._mediaObject.connection = {
        ip: '127.0.0.1',
        version: 4
      };
      if (!sctpParameters) this._mediaObject.protocol = 'UDP/TLS/RTP/SAVPF';else this._mediaObject.protocol = 'UDP/DTLS/SCTP';
      this._mediaObject.port = 7;
    } else {
      this._mediaObject.connection = {
        ip: plainRtpParameters.ip,
        version: plainRtpParameters.ipVersion
      };
      this._mediaObject.protocol = 'RTP/AVP';
      this._mediaObject.port = plainRtpParameters.port;
    }

    switch (kind) {
      case 'audio':
      case 'video':
        {
          this._mediaObject.direction = 'sendonly';
          this._mediaObject.rtp = [];
          this._mediaObject.rtcpFb = [];
          this._mediaObject.fmtp = [];
          if (!this._planB) this._mediaObject.msid = `${streamId || '-'} ${trackId}`;

          for (const codec of offerRtpParameters.codecs) {
            const rtp = {
              payload: codec.payloadType,
              codec: getCodecName(codec),
              rate: codec.clockRate
            };
            if (codec.channels > 1) rtp.encoding = codec.channels;

            this._mediaObject.rtp.push(rtp);

            const fmtp = {
              payload: codec.payloadType,
              config: ''
            };

            for (const key of Object.keys(codec.parameters)) {
              if (fmtp.config) fmtp.config += ';';
              fmtp.config += `${key}=${codec.parameters[key]}`;
            }

            if (fmtp.config) this._mediaObject.fmtp.push(fmtp);

            for (const fb of codec.rtcpFeedback) {
              this._mediaObject.rtcpFb.push({
                payload: codec.payloadType,
                type: fb.type,
                subtype: fb.parameter
              });
            }
          }

          this._mediaObject.payloads = offerRtpParameters.codecs.map(codec => codec.payloadType).join(' ');
          this._mediaObject.ext = [];

          for (const ext of offerRtpParameters.headerExtensions) {
            this._mediaObject.ext.push({
              uri: ext.uri,
              value: ext.id
            });
          }

          this._mediaObject.rtcpMux = 'rtcp-mux';
          this._mediaObject.rtcpRsize = 'rtcp-rsize';
          const encoding = offerRtpParameters.encodings[0];
          const ssrc = encoding.ssrc;
          const rtxSsrc = encoding.rtx && encoding.rtx.ssrc ? encoding.rtx.ssrc : undefined;
          this._mediaObject.ssrcs = [];
          this._mediaObject.ssrcGroups = [];

          if (offerRtpParameters.rtcp.cname) {
            this._mediaObject.ssrcs.push({
              id: ssrc,
              attribute: 'cname',
              value: offerRtpParameters.rtcp.cname
            });
          }

          if (this._planB) {
            this._mediaObject.ssrcs.push({
              id: ssrc,
              attribute: 'msid',
              value: `${streamId || '-'} ${trackId}`
            });
          }

          if (rtxSsrc) {
            if (offerRtpParameters.rtcp.cname) {
              this._mediaObject.ssrcs.push({
                id: rtxSsrc,
                attribute: 'cname',
                value: offerRtpParameters.rtcp.cname
              });
            }

            if (this._planB) {
              this._mediaObject.ssrcs.push({
                id: rtxSsrc,
                attribute: 'msid',
                value: `${streamId || '-'} ${trackId}`
              });
            } // Associate original and retransmission SSRCs.


            this._mediaObject.ssrcGroups.push({
              semantics: 'FID',
              ssrcs: `${ssrc} ${rtxSsrc}`
            });
          }

          break;
        }

      case 'application':
        {
          // New spec.
          if (!oldDataChannelSpec) {
            this._mediaObject.payloads = 'webrtc-datachannel';
            this._mediaObject.sctpPort = sctpParameters.port;
            this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
          } // Old spec.
          else {
              this._mediaObject.payloads = sctpParameters.port;
              this._mediaObject.sctpmap = {
                app: 'webrtc-datachannel',
                sctpmapNumber: sctpParameters.port,
                maxMessageSize: sctpParameters.maxMessageSize
              };
            }

          break;
        }
    }
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  setDtlsRole(role) {
    // Always 'actpass'.
    this._mediaObject.setup = 'actpass';
  }

  planBReceive({
    offerRtpParameters,
    streamId,
    trackId
  }) {
    const encoding = offerRtpParameters.encodings[0];
    const ssrc = encoding.ssrc;
    const rtxSsrc = encoding.rtx && encoding.rtx.ssrc ? encoding.rtx.ssrc : undefined;

    if (offerRtpParameters.rtcp.cname) {
      this._mediaObject.ssrcs.push({
        id: ssrc,
        attribute: 'cname',
        value: offerRtpParameters.rtcp.cname
      });
    }

    this._mediaObject.ssrcs.push({
      id: ssrc,
      attribute: 'msid',
      value: `${streamId || '-'} ${trackId}`
    });

    if (rtxSsrc) {
      if (offerRtpParameters.rtcp.cname) {
        this._mediaObject.ssrcs.push({
          id: rtxSsrc,
          attribute: 'cname',
          value: offerRtpParameters.rtcp.cname
        });
      }

      this._mediaObject.ssrcs.push({
        id: rtxSsrc,
        attribute: 'msid',
        value: `${streamId || '-'} ${trackId}`
      }); // Associate original and retransmission SSRCs.


      this._mediaObject.ssrcGroups.push({
        semantics: 'FID',
        ssrcs: `${ssrc} ${rtxSsrc}`
      });
    }
  }

  planBStopReceiving({
    offerRtpParameters
  }) {
    const encoding = offerRtpParameters.encodings[0];
    const ssrc = encoding.ssrc;
    const rtxSsrc = encoding.rtx && encoding.rtx.ssrc ? encoding.rtx.ssrc : undefined;
    this._mediaObject.ssrcs = this._mediaObject.ssrcs.filter(s => s.id !== ssrc && s.id !== rtxSsrc);

    if (rtxSsrc) {
      this._mediaObject.ssrcGroups = this._mediaObject.ssrcGroups.filter(group => group.ssrcs !== `${ssrc} ${rtxSsrc}`);
    }
  }

}

exports.OfferMediaSection = OfferMediaSection;

function getCodecName(codec) {
  const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
  const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
  if (!mimeTypeMatch) throw new TypeError('invalid codec.mimeType');
  return mimeTypeMatch[2];
}
},{"../../utils":"fnp2"}],"vZFf":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoteSdp = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../../Logger");

const MediaSection_1 = require("./MediaSection");

const logger = new Logger_1.Logger('RemoteSdp');

class RemoteSdp {
  constructor({
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    plainRtpParameters,
    planB = false
  }) {
    // MediaSection instances with same order as in the SDP.
    this._mediaSections = []; // MediaSection indices indexed by MID.

    this._midToIndex = new Map();
    this._iceParameters = iceParameters;
    this._iceCandidates = iceCandidates;
    this._dtlsParameters = dtlsParameters;
    this._sctpParameters = sctpParameters;
    this._plainRtpParameters = plainRtpParameters;
    this._planB = planB;
    this._sdpObject = {
      version: 0,
      origin: {
        address: '0.0.0.0',
        ipVer: 4,
        netType: 'IN',
        sessionId: 10000,
        sessionVersion: 0,
        username: 'mediasoup-client'
      },
      name: '-',
      timing: {
        start: 0,
        stop: 0
      },
      media: []
    }; // If ICE parameters are given, add ICE-Lite indicator.

    if (iceParameters && iceParameters.iceLite) {
      this._sdpObject.icelite = 'ice-lite';
    } // If DTLS parameters are given, assume WebRTC and BUNDLE.


    if (dtlsParameters) {
      this._sdpObject.msidSemantic = {
        semantic: 'WMS',
        token: '*'
      }; // NOTE: We take the latest fingerprint.

      const numFingerprints = this._dtlsParameters.fingerprints.length;
      this._sdpObject.fingerprint = {
        type: dtlsParameters.fingerprints[numFingerprints - 1].algorithm,
        hash: dtlsParameters.fingerprints[numFingerprints - 1].value
      };
      this._sdpObject.groups = [{
        type: 'BUNDLE',
        mids: ''
      }];
    } // If there are plain RPT parameters, override SDP origin.


    if (plainRtpParameters) {
      this._sdpObject.origin.address = plainRtpParameters.ip;
      this._sdpObject.origin.ipVer = plainRtpParameters.ipVersion;
    }
  }

  updateIceParameters(iceParameters) {
    logger.debug('updateIceParameters() [iceParameters:%o]', iceParameters);
    this._iceParameters = iceParameters;
    this._sdpObject.icelite = iceParameters.iceLite ? 'ice-lite' : undefined;

    for (const mediaSection of this._mediaSections) {
      mediaSection.setIceParameters(iceParameters);
    }
  }

  updateDtlsRole(role) {
    logger.debug('updateDtlsRole() [role:%s]', role);
    this._dtlsParameters.role = role;

    for (const mediaSection of this._mediaSections) {
      mediaSection.setDtlsRole(role);
    }
  }

  getNextMediaSectionIdx() {
    // If a closed media section is found, return its index.
    for (let idx = 0; idx < this._mediaSections.length; ++idx) {
      const mediaSection = this._mediaSections[idx];
      if (mediaSection.closed) return {
        idx,
        reuseMid: mediaSection.mid
      };
    } // If no closed media section is found, return next one.


    return {
      idx: this._mediaSections.length
    };
  }

  send({
    offerMediaObject,
    reuseMid,
    offerRtpParameters,
    answerRtpParameters,
    codecOptions,
    extmapAllowMixed = false
  }) {
    const mediaSection = new MediaSection_1.AnswerMediaSection({
      iceParameters: this._iceParameters,
      iceCandidates: this._iceCandidates,
      dtlsParameters: this._dtlsParameters,
      plainRtpParameters: this._plainRtpParameters,
      planB: this._planB,
      offerMediaObject,
      offerRtpParameters,
      answerRtpParameters,
      codecOptions,
      extmapAllowMixed
    }); // Unified-Plan with closed media section replacement.

    if (reuseMid) {
      this._replaceMediaSection(mediaSection, reuseMid);
    } // Unified-Plan or Plan-B with different media kind.
    else if (!this._midToIndex.has(mediaSection.mid)) {
        this._addMediaSection(mediaSection);
      } // Plan-B with same media kind.
      else {
          this._replaceMediaSection(mediaSection);
        }
  }

  receive({
    mid,
    kind,
    offerRtpParameters,
    streamId,
    trackId
  }) {
    const idx = this._midToIndex.get(mid);

    let mediaSection;
    if (idx !== undefined) mediaSection = this._mediaSections[idx]; // Unified-Plan or different media kind.

    if (!mediaSection) {
      mediaSection = new MediaSection_1.OfferMediaSection({
        iceParameters: this._iceParameters,
        iceCandidates: this._iceCandidates,
        dtlsParameters: this._dtlsParameters,
        plainRtpParameters: this._plainRtpParameters,
        planB: this._planB,
        mid,
        kind,
        offerRtpParameters,
        streamId,
        trackId
      }); // Let's try to recycle a closed media section (if any).
      // NOTE: Yes, we can recycle a closed m=audio section with a new m=video.

      const oldMediaSection = this._mediaSections.find(m => m.closed);

      if (oldMediaSection) {
        this._replaceMediaSection(mediaSection, oldMediaSection.mid);
      } else {
        this._addMediaSection(mediaSection);
      }
    } // Plan-B.
    else {
        mediaSection.planBReceive({
          offerRtpParameters,
          streamId,
          trackId
        });

        this._replaceMediaSection(mediaSection);
      }
  }

  disableMediaSection(mid) {
    const idx = this._midToIndex.get(mid);

    if (idx === undefined) {
      throw new Error(`no media section found with mid '${mid}'`);
    }

    const mediaSection = this._mediaSections[idx];
    mediaSection.disable();
  }

  closeMediaSection(mid) {
    const idx = this._midToIndex.get(mid);

    if (idx === undefined) {
      throw new Error(`no media section found with mid '${mid}'`);
    }

    const mediaSection = this._mediaSections[idx]; // NOTE: Closing the first m section is a pain since it invalidates the
    // bundled transport, so let's avoid it.

    if (mid === this._firstMid) {
      logger.debug('closeMediaSection() | cannot close first media section, disabling it instead [mid:%s]', mid);
      this.disableMediaSection(mid);
      return;
    }

    mediaSection.close(); // Regenerate BUNDLE mids.

    this._regenerateBundleMids();
  }

  planBStopReceiving({
    mid,
    offerRtpParameters
  }) {
    const idx = this._midToIndex.get(mid);

    if (idx === undefined) {
      throw new Error(`no media section found with mid '${mid}'`);
    }

    const mediaSection = this._mediaSections[idx];
    mediaSection.planBStopReceiving({
      offerRtpParameters
    });

    this._replaceMediaSection(mediaSection);
  }

  sendSctpAssociation({
    offerMediaObject
  }) {
    const mediaSection = new MediaSection_1.AnswerMediaSection({
      iceParameters: this._iceParameters,
      iceCandidates: this._iceCandidates,
      dtlsParameters: this._dtlsParameters,
      sctpParameters: this._sctpParameters,
      plainRtpParameters: this._plainRtpParameters,
      offerMediaObject
    });

    this._addMediaSection(mediaSection);
  }

  receiveSctpAssociation({
    oldDataChannelSpec = false
  } = {}) {
    const mediaSection = new MediaSection_1.OfferMediaSection({
      iceParameters: this._iceParameters,
      iceCandidates: this._iceCandidates,
      dtlsParameters: this._dtlsParameters,
      sctpParameters: this._sctpParameters,
      plainRtpParameters: this._plainRtpParameters,
      mid: 'datachannel',
      kind: 'application',
      oldDataChannelSpec
    });

    this._addMediaSection(mediaSection);
  }

  getSdp() {
    // Increase SDP version.
    this._sdpObject.origin.sessionVersion++;
    return sdpTransform.write(this._sdpObject);
  }

  _addMediaSection(newMediaSection) {
    if (!this._firstMid) this._firstMid = newMediaSection.mid; // Add to the vector.

    this._mediaSections.push(newMediaSection); // Add to the map.


    this._midToIndex.set(newMediaSection.mid, this._mediaSections.length - 1); // Add to the SDP object.


    this._sdpObject.media.push(newMediaSection.getObject()); // Regenerate BUNDLE mids.


    this._regenerateBundleMids();
  }

  _replaceMediaSection(newMediaSection, reuseMid) {
    // Store it in the map.
    if (typeof reuseMid === 'string') {
      const idx = this._midToIndex.get(reuseMid);

      if (idx === undefined) {
        throw new Error(`no media section found for reuseMid '${reuseMid}'`);
      }

      const oldMediaSection = this._mediaSections[idx]; // Replace the index in the vector with the new media section.

      this._mediaSections[idx] = newMediaSection; // Update the map.

      this._midToIndex.delete(oldMediaSection.mid);

      this._midToIndex.set(newMediaSection.mid, idx); // Update the SDP object.


      this._sdpObject.media[idx] = newMediaSection.getObject(); // Regenerate BUNDLE mids.

      this._regenerateBundleMids();
    } else {
      const idx = this._midToIndex.get(newMediaSection.mid);

      if (idx === undefined) {
        throw new Error(`no media section found with mid '${newMediaSection.mid}'`);
      } // Replace the index in the vector with the new media section.


      this._mediaSections[idx] = newMediaSection; // Update the SDP object.

      this._sdpObject.media[idx] = newMediaSection.getObject();
    }
  }

  _regenerateBundleMids() {
    if (!this._dtlsParameters) return;
    this._sdpObject.groups[0].mids = this._mediaSections.filter(mediaSection => !mediaSection.closed).map(mediaSection => mediaSection.mid).join(' ');
  }

}

exports.RemoteSdp = RemoteSdp;
},{"sdp-transform":"CfIM","../../Logger":"andi","./MediaSection":"SdHv"}],"LIqw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = void 0;
const ScalabilityModeRegex = new RegExp('^[LS]([1-9]\\d{0,1})T([1-9]\\d{0,1})');

function parse(scalabilityMode) {
  const match = ScalabilityModeRegex.exec(scalabilityMode || '');

  if (match) {
    return {
      spatialLayers: Number(match[1]),
      temporalLayers: Number(match[2])
    };
  } else {
    return {
      spatialLayers: 1,
      temporalLayers: 1
    };
  }
}

exports.parse = parse;
},{}],"YvS6":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chrome74 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpUnifiedPlanUtils = __importStar(require("./sdp/unifiedPlanUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const scalabilityModes_1 = require("../scalabilityModes");

const logger = new Logger_1.Logger('Chrome74');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Chrome74 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Map of RTCTransceivers indexed by MID.

    this._mapMidTransceiver = new Map(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Chrome74();
  }

  get name() {
    return 'Chrome74';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'unified-plan'
    });

    try {
      pc.addTransceiver('audio');
      pc.addTransceiver('video');
      const offer = await pc.createOffer();

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'unified-plan'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (encodings && encodings.length > 1) {
      encodings.forEach((encoding, idx) => {
        encoding.rid = `r${idx}`;
      });
    }

    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);

    const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();

    const transceiver = this._pc.addTransceiver(track, {
      direction: 'sendonly',
      streams: [this._sendStream],
      sendEncodings: encodings
    });

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    }); // Special case for VP9 with SVC.

    let hackVp9Svc = false;
    const layers = scalabilityModes_1.parse((encodings || [{}])[0].scalabilityMode);

    if (encodings && encodings.length === 1 && layers.spatialLayers > 1 && sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9') {
      logger.debug('send() | enabling legacy simulcast for VP9 SVC');
      hackVp9Svc = true;
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
      sdpUnifiedPlanUtils.addLegacySimulcast({
        offerMediaObject,
        numStreams: layers.spatialLayers
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer); // We can now get the transceiver.mid.

    const localId = transceiver.mid; // Set MID.

    sendingRtpParameters.mid = localId;
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media[mediaSectionIdx.idx]; // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings by parsing the SDP offer if no encodings are given.

    if (!encodings) {
      sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
        offerMediaObject
      });
    } // Set RTP encodings by parsing the SDP offer and complete them with given
    // one if just a single encoding has been given.
    else if (encodings.length === 1) {
        let newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
          offerMediaObject
        });
        Object.assign(newEncodings[0], encodings[0]); // Hack for VP9 SVC.

        if (hackVp9Svc) newEncodings = [newEncodings[0]];
        sendingRtpParameters.encodings = newEncodings;
      } // Otherwise if more than 1 encoding are given use them verbatim.
      else {
          sendingRtpParameters.encodings = encodings;
        } // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
    // each encoding.


    if (sendingRtpParameters.encodings.length > 1 && (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' || sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      reuseMid: mediaSectionIdx.reuseMid,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions,
      extmapAllowMixed: true
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      rtpParameters: sendingRtpParameters,
      rtpSender: transceiver.sender
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    transceiver.sender.replaceTrack(null);

    this._pc.removeTrack(transceiver.sender);

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    await transceiver.sender.replaceTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await transceiver.sender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await transceiver.sender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.sender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = rtpParameters.mid || String(this._mapMidTransceiver.size);

    this._remoteSdp.receive({
      mid: localId,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === localId); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const transceiver = this._pc.getTransceivers().find(t => t.mid === localId);

    if (!transceiver) throw new Error('new RTCRtpTransceiver not found'); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      track: transceiver.receiver.track,
      rtpReceiver: transceiver.receiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.receiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation();

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Chrome74 = Chrome74;
},{"sdp-transform":"CfIM","../Logger":"andi","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/unifiedPlanUtils":"C7JJ","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf","../scalabilityModes":"LIqw"}],"fEjk":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chrome70 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpUnifiedPlanUtils = __importStar(require("./sdp/unifiedPlanUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const scalabilityModes_1 = require("../scalabilityModes");

const logger = new Logger_1.Logger('Chrome70');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Chrome70 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Map of RTCTransceivers indexed by MID.

    this._mapMidTransceiver = new Map(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Chrome70();
  }

  get name() {
    return 'Chrome70';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'unified-plan'
    });

    try {
      pc.addTransceiver('audio');
      pc.addTransceiver('video');
      const offer = await pc.createOffer();

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'unified-plan'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);

    const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();

    const transceiver = this._pc.addTransceiver(track, {
      direction: 'sendonly',
      streams: [this._sendStream]
    });

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (encodings && encodings.length > 1) {
      logger.debug('send() | enabling legacy simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
      sdpUnifiedPlanUtils.addLegacySimulcast({
        offerMediaObject,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    } // Special case for VP9 with SVC.


    let hackVp9Svc = false;
    const layers = scalabilityModes_1.parse((encodings || [{}])[0].scalabilityMode);

    if (encodings && encodings.length === 1 && layers.spatialLayers > 1 && sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9') {
      logger.debug('send() | enabling legacy simulcast for VP9 SVC');
      hackVp9Svc = true;
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
      sdpUnifiedPlanUtils.addLegacySimulcast({
        offerMediaObject,
        numStreams: layers.spatialLayers
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer); // If encodings are given, apply them now.

    if (encodings) {
      logger.debug('send() | applying given encodings');
      const parameters = transceiver.sender.getParameters();

      for (let idx = 0; idx < (parameters.encodings || []).length; ++idx) {
        const encoding = parameters.encodings[idx];
        const desiredEncoding = encodings[idx]; // Should not happen but just in case.

        if (!desiredEncoding) break;
        parameters.encodings[idx] = Object.assign(encoding, desiredEncoding);
      }

      await transceiver.sender.setParameters(parameters);
    } // We can now get the transceiver.mid.


    const localId = transceiver.mid; // Set MID.

    sendingRtpParameters.mid = localId;
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media[mediaSectionIdx.idx]; // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
      offerMediaObject
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // Hack for VP9 SVC.


    if (hackVp9Svc) {
      sendingRtpParameters.encodings = [sendingRtpParameters.encodings[0]];
    } // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
    // each encoding.


    if (sendingRtpParameters.encodings.length > 1 && (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' || sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      reuseMid: mediaSectionIdx.reuseMid,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      rtpParameters: sendingRtpParameters,
      rtpSender: transceiver.sender
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    transceiver.sender.replaceTrack(null);

    this._pc.removeTrack(transceiver.sender);

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    await transceiver.sender.replaceTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await transceiver.sender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await transceiver.sender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.sender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = rtpParameters.mid || String(this._mapMidTransceiver.size);

    this._remoteSdp.receive({
      mid: localId,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === localId); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const transceiver = this._pc.getTransceivers().find(t => t.mid === localId);

    if (!transceiver) throw new Error('new RTCRtpTransceiver not found'); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      track: transceiver.receiver.track,
      rtpReceiver: transceiver.receiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.receiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation();

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Chrome70 = Chrome70;
},{"sdp-transform":"CfIM","../Logger":"andi","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/unifiedPlanUtils":"C7JJ","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf","../scalabilityModes":"LIqw"}],"Upxu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLegacySimulcast = exports.getRtpEncodings = void 0;

function getRtpEncodings({
  offerMediaObject,
  track
}) {
  // First media SSRC (or the only one).
  let firstSsrc;
  const ssrcs = new Set();

  for (const line of offerMediaObject.ssrcs || []) {
    if (line.attribute !== 'msid') continue;
    const trackId = line.value.split(' ')[1];

    if (trackId === track.id) {
      const ssrc = line.id;
      ssrcs.add(ssrc);
      if (!firstSsrc) firstSsrc = ssrc;
    }
  }

  if (ssrcs.size === 0) throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`);
  const ssrcToRtxSsrc = new Map(); // First assume RTX is used.

  for (const line of offerMediaObject.ssrcGroups || []) {
    if (line.semantics !== 'FID') continue;
    let [ssrc, rtxSsrc] = line.ssrcs.split(/\s+/);
    ssrc = Number(ssrc);
    rtxSsrc = Number(rtxSsrc);

    if (ssrcs.has(ssrc)) {
      // Remove both the SSRC and RTX SSRC from the set so later we know that they
      // are already handled.
      ssrcs.delete(ssrc);
      ssrcs.delete(rtxSsrc); // Add to the map.

      ssrcToRtxSsrc.set(ssrc, rtxSsrc);
    }
  } // If the set of SSRCs is not empty it means that RTX is not being used, so take
  // media SSRCs from there.


  for (const ssrc of ssrcs) {
    // Add to the map.
    ssrcToRtxSsrc.set(ssrc, null);
  }

  const encodings = [];

  for (const [ssrc, rtxSsrc] of ssrcToRtxSsrc) {
    const encoding = {
      ssrc
    };
    if (rtxSsrc) encoding.rtx = {
      ssrc: rtxSsrc
    };
    encodings.push(encoding);
  }

  return encodings;
}

exports.getRtpEncodings = getRtpEncodings;
/**
 * Adds multi-ssrc based simulcast into the given SDP media section offer.
 */

function addLegacySimulcast({
  offerMediaObject,
  track,
  numStreams
}) {
  if (numStreams <= 1) throw new TypeError('numStreams must be greater than 1');
  let firstSsrc;
  let firstRtxSsrc;
  let streamId; // Get the SSRC.

  const ssrcMsidLine = (offerMediaObject.ssrcs || []).find(line => {
    if (line.attribute !== 'msid') return false;
    const trackId = line.value.split(' ')[1];

    if (trackId === track.id) {
      firstSsrc = line.id;
      streamId = line.value.split(' ')[0];
      return true;
    } else {
      return false;
    }
  });
  if (!ssrcMsidLine) throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`); // Get the SSRC for RTX.

  (offerMediaObject.ssrcGroups || []).some(line => {
    if (line.semantics !== 'FID') return false;
    const ssrcs = line.ssrcs.split(/\s+/);

    if (Number(ssrcs[0]) === firstSsrc) {
      firstRtxSsrc = Number(ssrcs[1]);
      return true;
    } else {
      return false;
    }
  });
  const ssrcCnameLine = offerMediaObject.ssrcs.find(line => line.attribute === 'cname' && line.id === firstSsrc);
  if (!ssrcCnameLine) throw new Error(`a=ssrc line with cname information not found [track.id:${track.id}]`);
  const cname = ssrcCnameLine.value;
  const ssrcs = [];
  const rtxSsrcs = [];

  for (let i = 0; i < numStreams; ++i) {
    ssrcs.push(firstSsrc + i);
    if (firstRtxSsrc) rtxSsrcs.push(firstRtxSsrc + i);
  }

  offerMediaObject.ssrcGroups = offerMediaObject.ssrcGroups || [];
  offerMediaObject.ssrcs = offerMediaObject.ssrcs || [];
  offerMediaObject.ssrcGroups.push({
    semantics: 'SIM',
    ssrcs: ssrcs.join(' ')
  });

  for (let i = 0; i < ssrcs.length; ++i) {
    const ssrc = ssrcs[i];
    offerMediaObject.ssrcs.push({
      id: ssrc,
      attribute: 'cname',
      value: cname
    });
    offerMediaObject.ssrcs.push({
      id: ssrc,
      attribute: 'msid',
      value: `${streamId} ${track.id}`
    });
  }

  for (let i = 0; i < rtxSsrcs.length; ++i) {
    const ssrc = ssrcs[i];
    const rtxSsrc = rtxSsrcs[i];
    offerMediaObject.ssrcs.push({
      id: rtxSsrc,
      attribute: 'cname',
      value: cname
    });
    offerMediaObject.ssrcs.push({
      id: rtxSsrc,
      attribute: 'msid',
      value: `${streamId} ${track.id}`
    });
    offerMediaObject.ssrcGroups.push({
      semantics: 'FID',
      ssrcs: `${ssrc} ${rtxSsrc}`
    });
  }
}

exports.addLegacySimulcast = addLegacySimulcast;
},{}],"RFT0":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chrome67 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpPlanBUtils = __importStar(require("./sdp/planBUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('Chrome67');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Chrome67 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Map of RTCRtpSender indexed by localId.

    this._mapSendLocalIdRtpSender = new Map(); // Next sending localId.

    this._nextSendLocalId = 0; // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
    // Value is an Object with mid, rtpParameters and rtpReceiver.

    this._mapRecvLocalIdInfo = new Map(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Chrome67();
  }

  get name() {
    return 'Chrome67';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    });

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      planB: true
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (codec) {
      logger.warn('send() | codec selection is not available in %s handler', this.name);
    }

    this._sendStream.addTrack(track);

    this._pc.addTrack(track, this._sendStream);

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {});
    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {});
    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (track.kind === 'video' && encodings && encodings.length > 1) {
      logger.debug('send() | enabling simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media.find(m => m.type === 'video');
      sdpPlanBUtils.addLegacySimulcast({
        offerMediaObject,
        track,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media.find(m => m.type === track.kind); // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
      offerMediaObject,
      track
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // If VP8 and there is effective simulcast, add scalabilityMode to each
    // encoding.


    if (sendingRtpParameters.encodings.length > 1 && sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
    const localId = String(this._nextSendLocalId);
    this._nextSendLocalId++;

    const rtpSender = this._pc.getSenders().find(s => s.track === track); // Insert into the map.


    this._mapSendLocalIdRtpSender.set(localId, rtpSender);

    return {
      localId: localId,
      rtpParameters: sendingRtpParameters,
      rtpSender
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');

    this._pc.removeTrack(rtpSender);

    if (rtpSender.track) this._sendStream.removeTrack(rtpSender.track);

    this._mapSendLocalIdRtpSender.delete(localId);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

    try {
      await this._pc.setLocalDescription(offer);
    } catch (error) {
      // NOTE: If there are no sending tracks, setLocalDescription() will fail with
      // "Failed to create channels". If so, ignore it.
      if (this._sendStream.getTracks().length === 0) {
        logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
        return;
      }

      throw error;
    }

    if (this._pc.signalingState === 'stable') return;
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const oldTrack = rtpSender.track;
    await rtpSender.replaceTrack(track); // Remove the old track from the local stream.

    if (oldTrack) this._sendStream.removeTrack(oldTrack); // Add the new track to the local stream.

    if (track) this._sendStream.addTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await rtpSender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await rtpSender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    return rtpSender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = trackId;
    const mid = kind;

    this._remoteSdp.receive({
      mid,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === mid); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const rtpReceiver = this._pc.getReceivers().find(r => r.track && r.track.id === localId);

    if (!rtpReceiver) throw new Error('new RTCRtpReceiver not'); // Insert into the map.

    this._mapRecvLocalIdInfo.set(localId, {
      mid,
      rtpParameters,
      rtpReceiver
    });

    return {
      localId,
      track: rtpReceiver.track,
      rtpReceiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);
    const {
      mid,
      rtpParameters
    } = this._mapRecvLocalIdInfo.get(localId) || {}; // Remove from the map.

    this._mapRecvLocalIdInfo.delete(localId);

    this._remoteSdp.planBStopReceiving({
      mid: mid,
      offerRtpParameters: rtpParameters
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const {
      rtpReceiver
    } = this._mapRecvLocalIdInfo.get(localId) || {};
    if (!rtpReceiver) throw new Error('associated RTCRtpReceiver not found');
    return rtpReceiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation({
        oldDataChannelSpec: true
      });

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Chrome67 = Chrome67;
},{"sdp-transform":"CfIM","../Logger":"andi","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/planBUtils":"Upxu","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"vy33":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chrome55 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const errors_1 = require("../errors");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpPlanBUtils = __importStar(require("./sdp/planBUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('Chrome55');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Chrome55 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Map of sending MediaStreamTracks indexed by localId.

    this._mapSendLocalIdTrack = new Map(); // Next sending localId.

    this._nextSendLocalId = 0; // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
    // Value is an Object with mid, rtpParameters and rtpReceiver.

    this._mapRecvLocalIdInfo = new Map(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Chrome55();
  }

  get name() {
    return 'Chrome55';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    });

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      planB: true
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (codec) {
      logger.warn('send() | codec selection is not available in %s handler', this.name);
    }

    this._sendStream.addTrack(track);

    this._pc.addStream(this._sendStream);

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {});
    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {});
    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (track.kind === 'video' && encodings && encodings.length > 1) {
      logger.debug('send() | enabling simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media.find(m => m.type === 'video');
      sdpPlanBUtils.addLegacySimulcast({
        offerMediaObject,
        track,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media.find(m => m.type === track.kind); // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
      offerMediaObject,
      track
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // If VP8 and there is effective simulcast, add scalabilityMode to each
    // encoding.


    if (sendingRtpParameters.encodings.length > 1 && sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
    const localId = String(this._nextSendLocalId);
    this._nextSendLocalId++; // Insert into the map.

    this._mapSendLocalIdTrack.set(localId, track);

    return {
      localId: localId,
      rtpParameters: sendingRtpParameters
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const track = this._mapSendLocalIdTrack.get(localId);

    if (!track) throw new Error('track not found');

    this._mapSendLocalIdTrack.delete(localId);

    this._sendStream.removeTrack(track);

    this._pc.addStream(this._sendStream);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

    try {
      await this._pc.setLocalDescription(offer);
    } catch (error) {
      // NOTE: If there are no sending tracks, setLocalDescription() will fail with
      // "Failed to create channels". If so, ignore it.
      if (this._sendStream.getTracks().length === 0) {
        logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
        return;
      }

      throw error;
    }

    if (this._pc.signalingState === 'stable') return;
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack( // eslint-disable-next-line @typescript-eslint/no-unused-vars
  localId, track) {
    throw new errors_1.UnsupportedError('not implemented');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async setMaxSpatialLayer(localId, spatialLayer) {
    throw new errors_1.UnsupportedError(' not implemented');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async setRtpEncodingParameters(localId, params) {
    throw new errors_1.UnsupportedError('not supported');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async getSenderStats(localId) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = trackId;
    const mid = kind;
    const streamId = rtpParameters.rtcp.cname;

    this._remoteSdp.receive({
      mid,
      kind,
      offerRtpParameters: rtpParameters,
      streamId,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === mid); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const stream = this._pc.getRemoteStreams().find(s => s.id === streamId);

    const track = stream.getTrackById(localId);
    if (!track) throw new Error('remote track not found'); // Insert into the map.

    this._mapRecvLocalIdInfo.set(localId, {
      mid,
      rtpParameters
    });

    return {
      localId,
      track
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);
    const {
      mid,
      rtpParameters
    } = this._mapRecvLocalIdInfo.get(localId) || {}; // Remove from the map.

    this._mapRecvLocalIdInfo.delete(localId);

    this._remoteSdp.planBStopReceiving({
      mid: mid,
      offerRtpParameters: rtpParameters
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async getReceiverStats(localId) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation({
        oldDataChannelSpec: true
      });

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Chrome55 = Chrome55;
},{"sdp-transform":"CfIM","../Logger":"andi","../errors":"hNUz","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/planBUtils":"Upxu","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"rkz5":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Firefox60 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const errors_1 = require("../errors");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpUnifiedPlanUtils = __importStar(require("./sdp/unifiedPlanUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('Firefox60');
const SCTP_NUM_STREAMS = {
  OS: 16,
  MIS: 2048
};

class Firefox60 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Map of RTCTransceivers indexed by MID.

    this._mapMidTransceiver = new Map(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Firefox60();
  }

  get name() {
    return 'Firefox60';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    }); // NOTE: We need to add a real video track to get the RID extension mapping.

    const canvas = document.createElement('canvas'); // NOTE: Otherwise Firefox fails in next line.

    canvas.getContext('2d');
    const fakeStream = canvas.captureStream();
    const fakeVideoTrack = fakeStream.getVideoTracks()[0];

    try {
      pc.addTransceiver('audio', {
        direction: 'sendrecv'
      });
      const videoTransceiver = pc.addTransceiver(fakeVideoTrack, {
        direction: 'sendrecv'
      });
      const parameters = videoTransceiver.sender.getParameters();
      const encodings = [{
        rid: 'r0',
        maxBitrate: 100000
      }, {
        rid: 'r1',
        maxBitrate: 500000
      }];
      parameters.encodings = encodings;
      await videoTransceiver.sender.setParameters(parameters);
      const offer = await pc.createOffer();

      try {
        canvas.remove();
      } catch (error) {}

      try {
        fakeVideoTrack.stop();
      } catch (error) {}

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        canvas.remove();
      } catch (error2) {}

      try {
        fakeVideoTrack.stop();
      } catch (error2) {}

      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async updateIceServers(iceServers) {
    // NOTE: Firefox does not implement pc.setConfiguration().
    throw new errors_1.UnsupportedError('not supported');
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (encodings) {
      encodings = utils.clone(encodings, []);

      if (encodings.length > 1) {
        encodings.forEach((encoding, idx) => {
          encoding.rid = `r${idx}`;
        }); // Clone the encodings and reverse them because Firefox likes them
        // from high to low.

        encodings.reverse();
      }
    }

    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec); // NOTE: Firefox fails sometimes to properly anticipate the closed media
    // section that it should use, so don't reuse closed media sections.
    //   https://github.com/versatica/mediasoup-client/issues/104
    //
    // const mediaSectionIdx = this._remoteSdp!.getNextMediaSectionIdx();

    const transceiver = this._pc.addTransceiver(track, {
      direction: 'sendonly',
      streams: [this._sendStream]
    }); // NOTE: This is not spec compliants. Encodings should be given in addTransceiver
    // second argument, but Firefox does not support it.


    if (encodings) {
      const parameters = transceiver.sender.getParameters();
      parameters.encodings = encodings;
      await transceiver.sender.setParameters(parameters);
    }

    const offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp); // In Firefox use DTLS role client even if we are the "offerer" since
    // Firefox does not respect ICE-Lite.

    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer); // We can now get the transceiver.mid.

    const localId = transceiver.mid; // Set MID.

    sendingRtpParameters.mid = localId;
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    const offerMediaObject = localSdpObject.media[localSdpObject.media.length - 1]; // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings by parsing the SDP offer if no encodings are given.

    if (!encodings) {
      sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
        offerMediaObject
      });
    } // Set RTP encodings by parsing the SDP offer and complete them with given
    // one if just a single encoding has been given.
    else if (encodings.length === 1) {
        const newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
          offerMediaObject
        });
        Object.assign(newEncodings[0], encodings[0]);
        sendingRtpParameters.encodings = newEncodings;
      } // Otherwise if more than 1 encoding are given use them verbatim (but
      // reverse them back since we reversed them above to satisfy Firefox).
      else {
          sendingRtpParameters.encodings = encodings.reverse();
        } // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
    // each encoding.


    if (sendingRtpParameters.encodings.length > 1 && (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' || sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions,
      extmapAllowMixed: true
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      rtpParameters: sendingRtpParameters,
      rtpSender: transceiver.sender
    };
  }

  async stopSending(localId) {
    logger.debug('stopSending() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated transceiver not found');
    transceiver.sender.replaceTrack(null);

    this._pc.removeTrack(transceiver.sender); // NOTE: Cannot use closeMediaSection() due to the the note above in send()
    // method.
    // this._remoteSdp!.closeMediaSection(transceiver.mid);


    this._remoteSdp.disableMediaSection(transceiver.mid);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    await transceiver.sender.replaceTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated transceiver not found');
    const parameters = transceiver.sender.getParameters(); // NOTE: We require encodings given from low to high, however Firefox
    // requires them in reverse order, so do magic here.

    spatialLayer = parameters.encodings.length - 1 - spatialLayer;
    parameters.encodings.forEach((encoding, idx) => {
      if (idx >= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await transceiver.sender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await transceiver.sender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.sender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = rtpParameters.mid || String(this._mapMidTransceiver.size);

    this._remoteSdp.receive({
      mid: localId,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === localId); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const transceiver = this._pc.getTransceivers().find(t => t.mid === localId);

    if (!transceiver) throw new Error('new RTCRtpTransceiver not found'); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      track: transceiver.receiver.track,
      rtpReceiver: transceiver.receiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.receiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation();

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Firefox60 = Firefox60;
},{"sdp-transform":"CfIM","../Logger":"andi","../errors":"hNUz","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/unifiedPlanUtils":"C7JJ","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"Xquh":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Safari12 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpUnifiedPlanUtils = __importStar(require("./sdp/unifiedPlanUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('Safari12');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Safari12 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Map of RTCTransceivers indexed by MID.

    this._mapMidTransceiver = new Map(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Safari12();
  }

  get name() {
    return 'Safari12';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });

    try {
      pc.addTransceiver('audio');
      pc.addTransceiver('video');
      const offer = await pc.createOffer();

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {}); // This may throw.

    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);

    const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();

    const transceiver = this._pc.addTransceiver(track, {
      direction: 'sendonly',
      streams: [this._sendStream]
    });

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (encodings && encodings.length > 1) {
      logger.debug('send() | enabling legacy simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
      sdpUnifiedPlanUtils.addLegacySimulcast({
        offerMediaObject,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer); // We can now get the transceiver.mid.

    const localId = transceiver.mid; // Set MID.

    sendingRtpParameters.mid = localId;
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media[mediaSectionIdx.idx]; // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
      offerMediaObject
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
    // each encoding.


    if (sendingRtpParameters.encodings.length > 1 && (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' || sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      reuseMid: mediaSectionIdx.reuseMid,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      rtpParameters: sendingRtpParameters,
      rtpSender: transceiver.sender
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    transceiver.sender.replaceTrack(null);

    this._pc.removeTrack(transceiver.sender);

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    await transceiver.sender.replaceTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await transceiver.sender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    const parameters = transceiver.sender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await transceiver.sender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.sender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = rtpParameters.mid || String(this._mapMidTransceiver.size);

    this._remoteSdp.receive({
      mid: localId,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === localId); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const transceiver = this._pc.getTransceivers().find(t => t.mid === localId);

    if (!transceiver) throw new Error('new RTCRtpTransceiver not found'); // Store in the map.

    this._mapMidTransceiver.set(localId, transceiver);

    return {
      localId,
      track: transceiver.receiver.track,
      rtpReceiver: transceiver.receiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');

    this._remoteSdp.closeMediaSection(transceiver.mid);

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const transceiver = this._mapMidTransceiver.get(localId);

    if (!transceiver) throw new Error('associated RTCRtpTransceiver not found');
    return transceiver.receiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation();

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Safari12 = Safari12;
},{"sdp-transform":"CfIM","../Logger":"andi","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/unifiedPlanUtils":"C7JJ","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"wFon":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Safari11 = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpPlanBUtils = __importStar(require("./sdp/planBUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('Safari11');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class Safari11 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Map of RTCRtpSender indexed by localId.

    this._mapSendLocalIdRtpSender = new Map(); // Next sending localId.

    this._nextSendLocalId = 0; // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
    // Value is an Object with mid, rtpParameters and rtpReceiver.

    this._mapRecvLocalIdInfo = new Map(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Safari11();
  }

  get name() {
    return 'Safari11';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    });

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      planB: true
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (codec) {
      logger.warn('send() | codec selection is not available in %s handler', this.name);
    }

    this._sendStream.addTrack(track);

    this._pc.addTrack(track, this._sendStream);

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {});
    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {});
    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (track.kind === 'video' && encodings && encodings.length > 1) {
      logger.debug('send() | enabling simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media.find(m => m.type === 'video');
      sdpPlanBUtils.addLegacySimulcast({
        offerMediaObject,
        track,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media.find(m => m.type === track.kind); // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
      offerMediaObject,
      track
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // If VP8 and there is effective simulcast, add scalabilityMode to each
    // encoding.


    if (sendingRtpParameters.encodings.length > 1 && sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
    const localId = String(this._nextSendLocalId);
    this._nextSendLocalId++;

    const rtpSender = this._pc.getSenders().find(s => s.track === track); // Insert into the map.


    this._mapSendLocalIdRtpSender.set(localId, rtpSender);

    return {
      localId: localId,
      rtpParameters: sendingRtpParameters,
      rtpSender
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    if (rtpSender.track) this._sendStream.removeTrack(rtpSender.track);

    this._mapSendLocalIdRtpSender.delete(localId);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

    try {
      await this._pc.setLocalDescription(offer);
    } catch (error) {
      // NOTE: If there are no sending tracks, setLocalDescription() will fail with
      // "Failed to create channels". If so, ignore it.
      if (this._sendStream.getTracks().length === 0) {
        logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
        return;
      }

      throw error;
    }

    if (this._pc.signalingState === 'stable') return;
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack(localId, track) {
    this._assertSendDirection();

    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const oldTrack = rtpSender.track;
    await rtpSender.replaceTrack(track); // Remove the old track from the local stream.

    if (oldTrack) this._sendStream.removeTrack(oldTrack); // Add the new track to the local stream.

    if (track) this._sendStream.addTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    this._assertSendDirection();

    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await rtpSender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    this._assertSendDirection();

    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await rtpSender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    this._assertSendDirection();

    const rtpSender = this._mapSendLocalIdRtpSender.get(localId);

    if (!rtpSender) throw new Error('associated RTCRtpSender not found');
    return rtpSender.getStats();
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = trackId;
    const mid = kind;

    this._remoteSdp.receive({
      mid,
      kind,
      offerRtpParameters: rtpParameters,
      streamId: rtpParameters.rtcp.cname,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === mid); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const rtpReceiver = this._pc.getReceivers().find(r => r.track && r.track.id === localId);

    if (!rtpReceiver) throw new Error('new RTCRtpReceiver not'); // Insert into the map.

    this._mapRecvLocalIdInfo.set(localId, {
      mid,
      rtpParameters,
      rtpReceiver
    });

    return {
      localId,
      track: rtpReceiver.track,
      rtpReceiver
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);
    const {
      mid,
      rtpParameters
    } = this._mapRecvLocalIdInfo.get(localId) || {}; // Remove from the map.

    this._mapRecvLocalIdInfo.delete(localId);

    this._remoteSdp.planBStopReceiving({
      mid: mid,
      offerRtpParameters: rtpParameters
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  }

  async getReceiverStats(localId) {
    this._assertRecvDirection();

    const {
      rtpReceiver
    } = this._mapRecvLocalIdInfo.get(localId) || {};
    if (!rtpReceiver) throw new Error('associated RTCRtpReceiver not found');
    return rtpReceiver.getStats();
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation({
        oldDataChannelSpec: true
      });

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.Safari11 = Safari11;
},{"sdp-transform":"CfIM","../Logger":"andi","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/planBUtils":"Upxu","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"pBRA":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mangleRtpParameters = exports.getCapabilities = void 0;

const utils = __importStar(require("../../utils"));
/**
 * Normalize ORTC based Edge's RTCRtpReceiver.getCapabilities() to produce a full
 * compliant ORTC RTCRtpCapabilities.
 */


function getCapabilities() {
  const nativeCaps = RTCRtpReceiver.getCapabilities();
  const caps = utils.clone(nativeCaps, {});

  for (const codec of caps.codecs) {
    // Rename numChannels to channels.
    codec.channels = codec.numChannels;
    delete codec.numChannels; // Add mimeType.

    codec.mimeType = codec.mimeType || `${codec.kind}/${codec.name}`; // NOTE: Edge sets some numeric parameters as string rather than number. Fix them.

    if (codec.parameters) {
      const parameters = codec.parameters;
      if (parameters.apt) parameters.apt = Number(parameters.apt);
      if (parameters['packetization-mode']) parameters['packetization-mode'] = Number(parameters['packetization-mode']);
    } // Delete emty parameter String in rtcpFeedback.


    for (const feedback of codec.rtcpFeedback || []) {
      if (!feedback.parameter) feedback.parameter = '';
    }
  }

  return caps;
}

exports.getCapabilities = getCapabilities;
/**
 * Generate RTCRtpParameters as ORTC based Edge likes.
 */

function mangleRtpParameters(rtpParameters) {
  const params = utils.clone(rtpParameters, {}); // Rename mid to muxId.

  if (params.mid) {
    params.muxId = params.mid;
    delete params.mid;
  }

  for (const codec of params.codecs) {
    // Rename channels to numChannels.
    if (codec.channels) {
      codec.numChannels = codec.channels;
      delete codec.channels;
    } // Add codec.name (requried by Edge).


    if (codec.mimeType && !codec.name) codec.name = codec.mimeType.split('/')[1]; // Remove mimeType.

    delete codec.mimeType;
  }

  return params;
}

exports.mangleRtpParameters = mangleRtpParameters;
},{"../../utils":"fnp2"}],"H8eT":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Edge11 = void 0;

const Logger_1 = require("../Logger");

const errors_1 = require("../errors");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const edgeUtils = __importStar(require("./ortc/edgeUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const logger = new Logger_1.Logger('Edge11');

class Edge11 extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Map of RTCRtpSenders indexed by id.

    this._rtpSenders = new Map(); // Map of RTCRtpReceivers indexed by id.

    this._rtpReceivers = new Map(); // Next localId for sending tracks.

    this._nextSendLocalId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new Edge11();
  }

  get name() {
    return 'Edge11';
  }

  close() {
    logger.debug('close()'); // Close the ICE gatherer.
    // NOTE: Not yet implemented by Edge.

    try {
      this._iceGatherer.close();
    } catch (error) {} // Close the ICE transport.


    try {
      this._iceTransport.stop();
    } catch (error) {} // Close the DTLS transport.


    try {
      this._dtlsTransport.stop();
    } catch (error) {} // Close RTCRtpSenders.


    for (const rtpSender of this._rtpSenders.values()) {
      try {
        rtpSender.stop();
      } catch (error) {}
    } // Close RTCRtpReceivers.


    for (const rtpReceiver of this._rtpReceivers.values()) {
      try {
        rtpReceiver.stop();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    return edgeUtils.getCapabilities();
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: {
        OS: 0,
        MIS: 0
      }
    };
  }

  run({
    direction,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    proprietaryConstraints,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._remoteIceParameters = iceParameters;
    this._remoteIceCandidates = iceCandidates;
    this._remoteDtlsParameters = dtlsParameters;
    this._cname = `CNAME-${utils.generateRandomNumber()}`;

    this._setIceGatherer({
      iceServers,
      iceTransportPolicy
    });

    this._setIceTransport();

    this._setDtlsTransport();
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async updateIceServers(iceServers) {
    // NOTE: Edge 11 does not implement iceGatherer.gater().
    throw new errors_1.UnsupportedError('not supported');
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()');
    this._remoteIceParameters = iceParameters;
    if (!this._transportReady) return;
    logger.debug('restartIce() | calling iceTransport.start()');

    this._iceTransport.start(this._iceGatherer, iceParameters, 'controlling');

    for (const candidate of this._remoteIceCandidates) {
      this._iceTransport.addRemoteCandidate(candidate);
    }

    this._iceTransport.addRemoteCandidate({});
  }

  async getTransportStats() {
    return this._iceTransport.getStats();
  }

  async send( // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    track,
    encodings,
    codecOptions,
    codec
  }) {
    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server'
    });
    logger.debug('send() | calling new RTCRtpSender()');
    const rtpSender = new RTCRtpSender(track, this._dtlsTransport);
    const rtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {});
    rtpParameters.codecs = ortc.reduceCodecs(rtpParameters.codecs, codec);
    const useRtx = rtpParameters.codecs.some(_codec => /.+\/rtx$/i.test(_codec.mimeType));
    if (!encodings) encodings = [{}];

    for (const encoding of encodings) {
      encoding.ssrc = utils.generateRandomNumber();
      if (useRtx) encoding.rtx = {
        ssrc: utils.generateRandomNumber()
      };
    }

    rtpParameters.encodings = encodings; // Fill RTCRtpParameters.rtcp.

    rtpParameters.rtcp = {
      cname: this._cname,
      reducedSize: true,
      mux: true
    }; // NOTE: Convert our standard RTCRtpParameters into those that Edge
    // expects.

    const edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);
    logger.debug('send() | calling rtpSender.send() [params:%o]', edgeRtpParameters);
    await rtpSender.send(edgeRtpParameters);
    const localId = String(this._nextSendLocalId);
    this._nextSendLocalId++; // Store it.

    this._rtpSenders.set(localId, rtpSender);

    return {
      localId,
      rtpParameters,
      rtpSender
    };
  }

  async stopSending(localId) {
    logger.debug('stopSending() [localId:%s]', localId);

    const rtpSender = this._rtpSenders.get(localId);

    if (!rtpSender) throw new Error('RTCRtpSender not found');

    this._rtpSenders.delete(localId);

    try {
      logger.debug('stopSending() | calling rtpSender.stop()');
      rtpSender.stop();
    } catch (error) {
      logger.warn('stopSending() | rtpSender.stop() failed:%o', error);
      throw error;
    }
  }

  async replaceTrack(localId, track) {
    if (track) {
      logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
    } else {
      logger.debug('replaceTrack() [localId:%s, no track]', localId);
    }

    const rtpSender = this._rtpSenders.get(localId);

    if (!rtpSender) throw new Error('RTCRtpSender not found');
    rtpSender.setTrack(track);
  }

  async setMaxSpatialLayer(localId, spatialLayer) {
    logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);

    const rtpSender = this._rtpSenders.get(localId);

    if (!rtpSender) throw new Error('RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      if (idx <= spatialLayer) encoding.active = true;else encoding.active = false;
    });
    await rtpSender.setParameters(parameters);
  }

  async setRtpEncodingParameters(localId, params) {
    logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);

    const rtpSender = this._rtpSenders.get(localId);

    if (!rtpSender) throw new Error('RTCRtpSender not found');
    const parameters = rtpSender.getParameters();
    parameters.encodings.forEach((encoding, idx) => {
      parameters.encodings[idx] = Object.assign(Object.assign({}, encoding), params);
    });
    await rtpSender.setParameters(parameters);
  }

  async getSenderStats(localId) {
    const rtpSender = this._rtpSenders.get(localId);

    if (!rtpSender) throw new Error('RTCRtpSender not found');
    return rtpSender.getStats();
  }

  async sendDataChannel( // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server'
    });
    logger.debug('receive() | calling new RTCRtpReceiver()');
    const rtpReceiver = new RTCRtpReceiver(this._dtlsTransport, kind);
    rtpReceiver.addEventListener('error', event => {
      logger.error('rtpReceiver "error" event [event:%o]', event);
    }); // NOTE: Convert our standard RTCRtpParameters into those that Edge
    // expects.

    const edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);
    logger.debug('receive() | calling rtpReceiver.receive() [params:%o]', edgeRtpParameters);
    await rtpReceiver.receive(edgeRtpParameters);
    const localId = trackId; // Store it.

    this._rtpReceivers.set(localId, rtpReceiver);

    return {
      localId,
      track: rtpReceiver.track,
      rtpReceiver
    };
  }

  async stopReceiving(localId) {
    logger.debug('stopReceiving() [localId:%s]', localId);

    const rtpReceiver = this._rtpReceivers.get(localId);

    if (!rtpReceiver) throw new Error('RTCRtpReceiver not found');

    this._rtpReceivers.delete(localId);

    try {
      logger.debug('stopReceiving() | calling rtpReceiver.stop()');
      rtpReceiver.stop();
    } catch (error) {
      logger.warn('stopReceiving() | rtpReceiver.stop() failed:%o', error);
    }
  }

  async getReceiverStats(localId) {
    const rtpReceiver = this._rtpReceivers.get(localId);

    if (!rtpReceiver) throw new Error('RTCRtpReceiver not found');
    return rtpReceiver.getStats();
  }

  async receiveDataChannel( // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  _setIceGatherer({
    iceServers,
    iceTransportPolicy
  }) {
    const iceGatherer = new RTCIceGatherer({
      iceServers: iceServers || [],
      gatherPolicy: iceTransportPolicy || 'all'
    });
    iceGatherer.addEventListener('error', event => {
      logger.error('iceGatherer "error" event [event:%o]', event);
    }); // NOTE: Not yet implemented by Edge, which starts gathering automatically.

    try {
      iceGatherer.gather();
    } catch (error) {
      logger.debug('_setIceGatherer() | iceGatherer.gather() failed: %s', error.toString());
    }

    this._iceGatherer = iceGatherer;
  }

  _setIceTransport() {
    const iceTransport = new RTCIceTransport(this._iceGatherer); // NOTE: Not yet implemented by Edge.

    iceTransport.addEventListener('statechange', () => {
      switch (iceTransport.state) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    }); // NOTE: Not standard, but implemented by Edge.

    iceTransport.addEventListener('icestatechange', () => {
      switch (iceTransport.state) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
    iceTransport.addEventListener('candidatepairchange', event => {
      logger.debug('iceTransport "candidatepairchange" event [pair:%o]', event.pair);
    });
    this._iceTransport = iceTransport;
  }

  _setDtlsTransport() {
    const dtlsTransport = new RTCDtlsTransport(this._iceTransport); // NOTE: Not yet implemented by Edge.

    dtlsTransport.addEventListener('statechange', () => {
      logger.debug('dtlsTransport "statechange" event [state:%s]', dtlsTransport.state);
    }); // NOTE: Not standard, but implemented by Edge.

    dtlsTransport.addEventListener('dtlsstatechange', () => {
      logger.debug('dtlsTransport "dtlsstatechange" event [state:%s]', dtlsTransport.state);
      if (dtlsTransport.state === 'closed') this.emit('@connectionstatechange', 'closed');
    });
    dtlsTransport.addEventListener('error', event => {
      logger.error('dtlsTransport "error" event [event:%o]', event);
    });
    this._dtlsTransport = dtlsTransport;
  }

  async _setupTransport({
    localDtlsRole
  }) {
    logger.debug('_setupTransport()'); // Get our local DTLS parameters.

    const dtlsParameters = this._dtlsTransport.getLocalParameters();

    dtlsParameters.role = localDtlsRole; // Need to tell the remote transport about our parameters.

    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    }); // Start the RTCIceTransport.

    this._iceTransport.start(this._iceGatherer, this._remoteIceParameters, 'controlling'); // Add remote ICE candidates.


    for (const candidate of this._remoteIceCandidates) {
      this._iceTransport.addRemoteCandidate(candidate);
    } // Also signal a 'complete' candidate as per spec.
    // NOTE: It should be {complete: true} but Edge prefers {}.
    // NOTE: If we don't signal end of candidates, the Edge RTCIceTransport
    // won't enter the 'completed' state.


    this._iceTransport.addRemoteCandidate({}); // NOTE: Edge does not like SHA less than 256.


    this._remoteDtlsParameters.fingerprints = this._remoteDtlsParameters.fingerprints.filter(fingerprint => {
      return fingerprint.algorithm === 'sha-256' || fingerprint.algorithm === 'sha-384' || fingerprint.algorithm === 'sha-512';
    }); // Start the RTCDtlsTransport.

    this._dtlsTransport.start(this._remoteDtlsParameters);

    this._transportReady = true;
  }

}

exports.Edge11 = Edge11;
},{"../Logger":"andi","../errors":"hNUz","../utils":"fnp2","../ortc":"y0TR","./ortc/edgeUtils":"pBRA","./HandlerInterface":"JfyM"}],"DJ68":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactNative = void 0;

const sdpTransform = __importStar(require("sdp-transform"));

const Logger_1 = require("../Logger");

const errors_1 = require("../errors");

const utils = __importStar(require("../utils"));

const ortc = __importStar(require("../ortc"));

const sdpCommonUtils = __importStar(require("./sdp/commonUtils"));

const sdpPlanBUtils = __importStar(require("./sdp/planBUtils"));

const HandlerInterface_1 = require("./HandlerInterface");

const RemoteSdp_1 = require("./sdp/RemoteSdp");

const logger = new Logger_1.Logger('ReactNative');
const SCTP_NUM_STREAMS = {
  OS: 1024,
  MIS: 1024
};

class ReactNative extends HandlerInterface_1.HandlerInterface {
  constructor() {
    super(); // Local stream for sending.

    this._sendStream = new MediaStream(); // Map of sending MediaStreamTracks indexed by localId.

    this._mapSendLocalIdTrack = new Map(); // Next sending localId.

    this._nextSendLocalId = 0; // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
    // Value is an Object with mid, rtpParameters and rtpReceiver.

    this._mapRecvLocalIdInfo = new Map(); // Whether a DataChannel m=application section has been created.

    this._hasDataChannelMediaSection = false; // Sending DataChannel id value counter. Incremented for each new DataChannel.

    this._nextSendSctpStreamId = 0; // Got transport local and remote parameters.

    this._transportReady = false;
  }
  /**
   * Creates a factory function.
   */


  static createFactory() {
    return () => new ReactNative();
  }

  get name() {
    return 'ReactNative';
  }

  close() {
    logger.debug('close()'); // Close RTCPeerConnection.

    if (this._pc) {
      try {
        this._pc.close();
      } catch (error) {}
    }
  }

  async getNativeRtpCapabilities() {
    logger.debug('getNativeRtpCapabilities()');
    const pc = new RTCPeerConnection({
      iceServers: [],
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    });

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      try {
        pc.close();
      } catch (error) {}

      const sdpObject = sdpTransform.parse(offer.sdp);
      const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
        sdpObject
      });
      return nativeRtpCapabilities;
    } catch (error) {
      try {
        pc.close();
      } catch (error2) {}

      throw error;
    }
  }

  async getNativeSctpCapabilities() {
    logger.debug('getNativeSctpCapabilities()');
    return {
      numStreams: SCTP_NUM_STREAMS
    };
  }

  run({
    direction,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    extendedRtpCapabilities
  }) {
    logger.debug('run()');
    this._direction = direction;
    this._remoteSdp = new RemoteSdp_1.RemoteSdp({
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      planB: true
    });
    this._sendingRtpParametersByKind = {
      audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
    };
    this._sendingRemoteRtpParametersByKind = {
      audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
      video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities)
    };
    this._pc = new RTCPeerConnection(Object.assign({
      iceServers: iceServers || [],
      iceTransportPolicy: iceTransportPolicy || 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      sdpSemantics: 'plan-b'
    }, additionalSettings), proprietaryConstraints); // Handle RTCPeerConnection connection status.

    this._pc.addEventListener('iceconnectionstatechange', () => {
      switch (this._pc.iceConnectionState) {
        case 'checking':
          this.emit('@connectionstatechange', 'connecting');
          break;

        case 'connected':
        case 'completed':
          this.emit('@connectionstatechange', 'connected');
          break;

        case 'failed':
          this.emit('@connectionstatechange', 'failed');
          break;

        case 'disconnected':
          this.emit('@connectionstatechange', 'disconnected');
          break;

        case 'closed':
          this.emit('@connectionstatechange', 'closed');
          break;
      }
    });
  }

  async updateIceServers(iceServers) {
    logger.debug('updateIceServers()');

    const configuration = this._pc.getConfiguration();

    configuration.iceServers = iceServers;

    this._pc.setConfiguration(configuration);
  }

  async restartIce(iceParameters) {
    logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.

    this._remoteSdp.updateIceParameters(iceParameters);

    if (!this._transportReady) return;

    if (this._direction === 'send') {
      const offer = await this._pc.createOffer({
        iceRestart: true
      });
      logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);
      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
    } else {
      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();
      logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
    }
  }

  async getTransportStats() {
    return this._pc.getStats();
  }

  async send({
    track,
    encodings,
    codecOptions,
    codec
  }) {
    this._assertSendDirection();

    logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);

    if (codec) {
      logger.warn('send() | codec selection is not available in %s handler', this.name);
    }

    this._sendStream.addTrack(track);

    this._pc.addStream(this._sendStream);

    let offer = await this._pc.createOffer();
    let localSdpObject = sdpTransform.parse(offer.sdp);
    let offerMediaObject;
    const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind], {});
    sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
    const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind], {});
    sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'server',
      localSdpObject
    });

    if (track.kind === 'video' && encodings && encodings.length > 1) {
      logger.debug('send() | enabling simulcast');
      localSdpObject = sdpTransform.parse(offer.sdp);
      offerMediaObject = localSdpObject.media.find(m => m.type === 'video');
      sdpPlanBUtils.addLegacySimulcast({
        offerMediaObject,
        track,
        numStreams: encodings.length
      });
      offer = {
        type: 'offer',
        sdp: sdpTransform.write(localSdpObject)
      };
    }

    logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
    await this._pc.setLocalDescription(offer);
    localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
    offerMediaObject = localSdpObject.media.find(m => m.type === track.kind); // Set RTCP CNAME.

    sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
      offerMediaObject
    }); // Set RTP encodings.

    sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
      offerMediaObject,
      track
    }); // Complete encodings with given values.

    if (encodings) {
      for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
        if (encodings[idx]) Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
      }
    } // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
    // each encoding.


    if (sendingRtpParameters.encodings.length > 1 && (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' || sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
      for (const encoding of sendingRtpParameters.encodings) {
        encoding.scalabilityMode = 'S1T3';
      }
    }

    this._remoteSdp.send({
      offerMediaObject,
      offerRtpParameters: sendingRtpParameters,
      answerRtpParameters: sendingRemoteRtpParameters,
      codecOptions
    });

    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
    const localId = String(this._nextSendLocalId);
    this._nextSendLocalId++; // Insert into the map.

    this._mapSendLocalIdTrack.set(localId, track);

    return {
      localId: localId,
      rtpParameters: sendingRtpParameters
    };
  }

  async stopSending(localId) {
    this._assertSendDirection();

    logger.debug('stopSending() [localId:%s]', localId);

    const track = this._mapSendLocalIdTrack.get(localId);

    if (!track) throw new Error('track not found');

    this._mapSendLocalIdTrack.delete(localId);

    this._sendStream.removeTrack(track);

    this._pc.addStream(this._sendStream);

    const offer = await this._pc.createOffer();
    logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);

    try {
      await this._pc.setLocalDescription(offer);
    } catch (error) {
      // NOTE: If there are no sending tracks, setLocalDescription() will fail with
      // "Failed to create channels". If so, ignore it.
      if (this._sendStream.getTracks().length === 0) {
        logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
        return;
      }

      throw error;
    }

    if (this._pc.signalingState === 'stable') return;
    const answer = {
      type: 'answer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
    await this._pc.setRemoteDescription(answer);
  }

  async replaceTrack( // eslint-disable-next-line @typescript-eslint/no-unused-vars
  localId, track) {
    throw new errors_1.UnsupportedError('not implemented');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async setMaxSpatialLayer(localId, spatialLayer) {
    throw new errors_1.UnsupportedError('not implemented');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async setRtpEncodingParameters(localId, params) {
    throw new errors_1.UnsupportedError('not implemented');
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async getSenderStats(localId) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  async sendDataChannel({
    ordered,
    maxPacketLifeTime,
    maxRetransmits,
    label,
    protocol,
    priority
  }) {
    this._assertSendDirection();

    const options = {
      negotiated: true,
      id: this._nextSendSctpStreamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol,
      priority
    };
    logger.debug('sendDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // Increase next id.


    this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS; // If this is the first DataChannel we need to create the SDP answer with
    // m=application section.

    if (!this._hasDataChannelMediaSection) {
      const offer = await this._pc.createOffer();
      const localSdpObject = sdpTransform.parse(offer.sdp);
      const offerMediaObject = localSdpObject.media.find(m => m.type === 'application');
      if (!this._transportReady) await this._setupTransport({
        localDtlsRole: 'server',
        localSdpObject
      });
      logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
      await this._pc.setLocalDescription(offer);

      this._remoteSdp.sendSctpAssociation({
        offerMediaObject
      });

      const answer = {
        type: 'answer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setRemoteDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    const sctpStreamParameters = {
      streamId: options.id,
      ordered: options.ordered,
      maxPacketLifeTime: options.maxPacketLifeTime,
      maxRetransmits: options.maxRetransmits
    };
    return {
      dataChannel,
      sctpStreamParameters
    };
  }

  async receive({
    trackId,
    kind,
    rtpParameters
  }) {
    this._assertRecvDirection();

    logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
    const localId = trackId;
    const mid = kind;
    let streamId = rtpParameters.rtcp.cname; // NOTE: In React-Native we cannot reuse the same remote MediaStream for new
    // remote tracks. This is because react-native-webrtc does not react on new
    // tracks generated within already existing streams, so force the streamId
    // to be different.

    logger.debug('receive() | forcing a random remote streamId to avoid well known bug in react-native-webrtc');
    streamId += `-hack-${utils.generateRandomNumber()}`;

    this._remoteSdp.receive({
      mid,
      kind,
      offerRtpParameters: rtpParameters,
      streamId,
      trackId
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    let answer = await this._pc.createAnswer();
    const localSdpObject = sdpTransform.parse(answer.sdp);
    const answerMediaObject = localSdpObject.media.find(m => String(m.mid) === mid); // May need to modify codec parameters in the answer based on codec
    // parameters in the offer.

    sdpCommonUtils.applyCodecParameters({
      offerRtpParameters: rtpParameters,
      answerMediaObject
    });
    answer = {
      type: 'answer',
      sdp: sdpTransform.write(localSdpObject)
    };
    if (!this._transportReady) await this._setupTransport({
      localDtlsRole: 'client',
      localSdpObject
    });
    logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);

    const stream = this._pc.getRemoteStreams().find(s => s.id === streamId);

    const track = stream.getTrackById(localId);
    if (!track) throw new Error('remote track not found'); // Insert into the map.

    this._mapRecvLocalIdInfo.set(localId, {
      mid,
      rtpParameters
    });

    return {
      localId,
      track
    };
  }

  async stopReceiving(localId) {
    this._assertRecvDirection();

    logger.debug('stopReceiving() [localId:%s]', localId);
    const {
      mid,
      rtpParameters
    } = this._mapRecvLocalIdInfo.get(localId) || {}; // Remove from the map.

    this._mapRecvLocalIdInfo.delete(localId);

    this._remoteSdp.planBStopReceiving({
      mid: mid,
      offerRtpParameters: rtpParameters
    });

    const offer = {
      type: 'offer',
      sdp: this._remoteSdp.getSdp()
    };
    logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
    await this._pc.setRemoteDescription(offer);
    const answer = await this._pc.createAnswer();
    logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
    await this._pc.setLocalDescription(answer);
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  async getReceiverStats(localId) {
    throw new errors_1.UnsupportedError('not implemented');
  }

  async receiveDataChannel({
    sctpStreamParameters,
    label,
    protocol
  }) {
    this._assertRecvDirection();

    const {
      streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmits
    } = sctpStreamParameters;
    const options = {
      negotiated: true,
      id: streamId,
      ordered,
      maxPacketLifeTime,
      maxRetransmitTime: maxPacketLifeTime,
      maxRetransmits,
      protocol
    };
    logger.debug('receiveDataChannel() [options:%o]', options);

    const dataChannel = this._pc.createDataChannel(label, options); // If this is the first DataChannel we need to create the SDP offer with
    // m=application section.


    if (!this._hasDataChannelMediaSection) {
      this._remoteSdp.receiveSctpAssociation({
        oldDataChannelSpec: true
      });

      const offer = {
        type: 'offer',
        sdp: this._remoteSdp.getSdp()
      };
      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
      await this._pc.setRemoteDescription(offer);
      const answer = await this._pc.createAnswer();

      if (!this._transportReady) {
        const localSdpObject = sdpTransform.parse(answer.sdp);
        await this._setupTransport({
          localDtlsRole: 'client',
          localSdpObject
        });
      }

      logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
      await this._pc.setLocalDescription(answer);
      this._hasDataChannelMediaSection = true;
    }

    return {
      dataChannel
    };
  }

  async _setupTransport({
    localDtlsRole,
    localSdpObject
  }) {
    if (!localSdpObject) localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp); // Get our local DTLS parameters.

    const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
      sdpObject: localSdpObject
    }); // Set our DTLS role.

    dtlsParameters.role = localDtlsRole; // Update the remote DTLS role in the SDP.

    this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client'); // Need to tell the remote transport about our parameters.


    await this.safeEmitAsPromise('@connect', {
      dtlsParameters
    });
    this._transportReady = true;
  }

  _assertSendDirection() {
    if (this._direction !== 'send') {
      throw new Error('method can just be called for handlers with "send" direction');
    }
  }

  _assertRecvDirection() {
    if (this._direction !== 'recv') {
      throw new Error('method can just be called for handlers with "recv" direction');
    }
  }

}

exports.ReactNative = ReactNative;
},{"sdp-transform":"CfIM","../Logger":"andi","../errors":"hNUz","../utils":"fnp2","../ortc":"y0TR","./sdp/commonUtils":"p5WR","./sdp/planBUtils":"Upxu","./HandlerInterface":"JfyM","./sdp/RemoteSdp":"vZFf"}],"kWtX":[function(require,module,exports) {
"use strict";
/* global RTCRtpTransceiver */

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = exports.detectDevice = void 0;

const bowser_1 = __importDefault(require("bowser"));

const Logger_1 = require("./Logger");

const EnhancedEventEmitter_1 = require("./EnhancedEventEmitter");

const errors_1 = require("./errors");

const utils = __importStar(require("./utils"));

const ortc = __importStar(require("./ortc"));

const Transport_1 = require("./Transport");

const Chrome74_1 = require("./handlers/Chrome74");

const Chrome70_1 = require("./handlers/Chrome70");

const Chrome67_1 = require("./handlers/Chrome67");

const Chrome55_1 = require("./handlers/Chrome55");

const Firefox60_1 = require("./handlers/Firefox60");

const Safari12_1 = require("./handlers/Safari12");

const Safari11_1 = require("./handlers/Safari11");

const Edge11_1 = require("./handlers/Edge11");

const ReactNative_1 = require("./handlers/ReactNative");

const logger = new Logger_1.Logger('Device');

function detectDevice() {
  // React-Native.
  // NOTE: react-native-webrtc >= 1.75.0 is required.
  if (typeof navigator === 'object' && navigator.product === 'ReactNative') {
    if (typeof RTCPeerConnection === 'undefined') {
      logger.warn('this._detectDevice() | unsupported ReactNative without RTCPeerConnection');
      return undefined;
    }

    logger.debug('this._detectDevice() | ReactNative handler chosen');
    return 'ReactNative';
  } // Browser.
  else if (typeof navigator === 'object' && typeof navigator.userAgent === 'string') {
      const ua = navigator.userAgent;
      const browser = bowser_1.default.getParser(ua);
      const engine = browser.getEngine(); // Chrome and Chromium.

      if (browser.satisfies({
        chrome: '>=74',
        chromium: '>=74'
      })) {
        return 'Chrome74';
      } else if (browser.satisfies({
        chrome: '>=70',
        chromium: '>=70'
      })) {
        return 'Chrome70';
      } else if (browser.satisfies({
        chrome: '>=67',
        chromium: '>=67'
      })) {
        return 'Chrome67';
      } else if (browser.satisfies({
        chrome: '>=55',
        chromium: '>=55'
      })) {
        return 'Chrome55';
      } // Firefox.
      else if (browser.satisfies({
          firefox: '>=60'
        })) {
          return 'Firefox60';
        } // Safari with Unified-Plan support enabled.
        else if (browser.satisfies({
            safari: '>=12.0'
          }) && typeof RTCRtpTransceiver !== 'undefined' && RTCRtpTransceiver.prototype.hasOwnProperty('currentDirection')) {
            return 'Safari12';
          } // Safari with Plab-B support.
          else if (browser.satisfies({
              safari: '>=11'
            })) {
              return 'Safari11';
            } // Old Edge with ORTC support.
            else if (browser.satisfies({
                'microsoft edge': '>=11'
              }) && browser.satisfies({
                'microsoft edge': '<=18'
              })) {
                return 'Edge11';
              } // Best effort for Chromium based browsers.
              else if (engine.name && engine.name.toLowerCase() === 'blink') {
                  const match = ua.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);

                  if (match) {
                    const version = Number(match[1]);

                    if (version >= 74) {
                      return 'Chrome74';
                    } else if (version >= 70) {
                      return 'Chrome70';
                    } else if (version >= 67) {
                      return 'Chrome67';
                    } else {
                      return 'Chrome55';
                    }
                  } else {
                    return 'Chrome74';
                  }
                } // Unsupported browser.
                else {
                    logger.warn('this._detectDevice() | browser not supported [name:%s, version:%s]', browser.getBrowserName(), browser.getBrowserVersion());
                    return undefined;
                  }
    } // Unknown device.
    else {
        logger.warn('this._detectDevice() | unknown device');
        return undefined;
      }
}

exports.detectDevice = detectDevice;

class Device {
  /**
   * Create a new Device to connect to mediasoup server.
   *
   * @throws {UnsupportedError} if device is not supported.
   */
  constructor({
    handlerName,
    handlerFactory,
    Handler
  } = {}) {
    // Loaded flag.
    this._loaded = false; // Observer instance.

    this._observer = new EnhancedEventEmitter_1.EnhancedEventEmitter();
    logger.debug('constructor()'); // Handle deprecated option.

    if (Handler) {
      logger.warn('constructor() | Handler option is DEPRECATED, use handlerName or handlerFactory instead');
      if (typeof Handler === 'string') handlerName = Handler;else throw new TypeError('non string Handler option no longer supported, use handlerFactory instead');
    }

    if (handlerName && handlerFactory) {
      throw new TypeError('just one of handlerName or handlerInterface can be given');
    }

    if (handlerFactory) {
      this._handlerFactory = handlerFactory;
    } else {
      if (handlerName) {
        logger.debug('constructor() | handler given: %s', handlerName);
      } else {
        handlerName = detectDevice();
        if (handlerName) logger.debug('constructor() | detected handler: %s', handlerName);else throw new errors_1.UnsupportedError('device not supported');
      }

      switch (handlerName) {
        case 'Chrome74':
          this._handlerFactory = Chrome74_1.Chrome74.createFactory();
          break;

        case 'Chrome70':
          this._handlerFactory = Chrome70_1.Chrome70.createFactory();
          break;

        case 'Chrome67':
          this._handlerFactory = Chrome67_1.Chrome67.createFactory();
          break;

        case 'Chrome55':
          this._handlerFactory = Chrome55_1.Chrome55.createFactory();
          break;

        case 'Firefox60':
          this._handlerFactory = Firefox60_1.Firefox60.createFactory();
          break;

        case 'Safari12':
          this._handlerFactory = Safari12_1.Safari12.createFactory();
          break;

        case 'Safari11':
          this._handlerFactory = Safari11_1.Safari11.createFactory();
          break;

        case 'Edge11':
          this._handlerFactory = Edge11_1.Edge11.createFactory();
          break;

        case 'ReactNative':
          this._handlerFactory = ReactNative_1.ReactNative.createFactory();
          break;

        default:
          throw new TypeError(`unknown handlerName "${handlerName}"`);
      }
    } // Create a temporal handler to get its name.


    const handler = this._handlerFactory();

    this._handlerName = handler.name;
    handler.close();
    this._extendedRtpCapabilities = undefined;
    this._recvRtpCapabilities = undefined;
    this._canProduceByKind = {
      audio: false,
      video: false
    };
    this._sctpCapabilities = undefined;
  }
  /**
   * The RTC handler name.
   */


  get handlerName() {
    return this._handlerName;
  }
  /**
   * Whether the Device is loaded.
   */


  get loaded() {
    return this._loaded;
  }
  /**
   * RTP capabilities of the Device for receiving media.
   *
   * @throws {InvalidStateError} if not loaded.
   */


  get rtpCapabilities() {
    if (!this._loaded) throw new errors_1.InvalidStateError('not loaded');
    return this._recvRtpCapabilities;
  }
  /**
   * SCTP capabilities of the Device.
   *
   * @throws {InvalidStateError} if not loaded.
   */


  get sctpCapabilities() {
    if (!this._loaded) throw new errors_1.InvalidStateError('not loaded');
    return this._sctpCapabilities;
  }
  /**
   * Observer.
   *
   * @emits newtransport - (transport: Transport)
   */


  get observer() {
    return this._observer;
  }
  /**
   * Initialize the Device.
   */


  async load({
    routerRtpCapabilities
  }) {
    logger.debug('load() [routerRtpCapabilities:%o]', routerRtpCapabilities);
    routerRtpCapabilities = utils.clone(routerRtpCapabilities, undefined); // Temporal handler to get its capabilities.

    let handler;

    try {
      if (this._loaded) throw new errors_1.InvalidStateError('already loaded'); // This may throw.

      ortc.validateRtpCapabilities(routerRtpCapabilities);
      handler = this._handlerFactory();
      const nativeRtpCapabilities = await handler.getNativeRtpCapabilities();
      logger.debug('load() | got native RTP capabilities:%o', nativeRtpCapabilities); // This may throw.

      ortc.validateRtpCapabilities(nativeRtpCapabilities); // Get extended RTP capabilities.

      this._extendedRtpCapabilities = ortc.getExtendedRtpCapabilities(nativeRtpCapabilities, routerRtpCapabilities);
      logger.debug('load() | got extended RTP capabilities:%o', this._extendedRtpCapabilities); // Check whether we can produce audio/video.

      this._canProduceByKind.audio = ortc.canSend('audio', this._extendedRtpCapabilities);
      this._canProduceByKind.video = ortc.canSend('video', this._extendedRtpCapabilities); // Generate our receiving RTP capabilities for receiving media.

      this._recvRtpCapabilities = ortc.getRecvRtpCapabilities(this._extendedRtpCapabilities); // This may throw.

      ortc.validateRtpCapabilities(this._recvRtpCapabilities);
      logger.debug('load() | got receiving RTP capabilities:%o', this._recvRtpCapabilities); // Generate our SCTP capabilities.

      this._sctpCapabilities = await handler.getNativeSctpCapabilities();
      logger.debug('load() | got native SCTP capabilities:%o', this._sctpCapabilities); // This may throw.

      ortc.validateSctpCapabilities(this._sctpCapabilities);
      logger.debug('load() succeeded');
      this._loaded = true;
      handler.close();
    } catch (error) {
      if (handler) handler.close();
      throw error;
    }
  }
  /**
   * Whether we can produce audio/video.
   *
   * @throws {InvalidStateError} if not loaded.
   * @throws {TypeError} if wrong arguments.
   */


  canProduce(kind) {
    if (!this._loaded) throw new errors_1.InvalidStateError('not loaded');else if (kind !== 'audio' && kind !== 'video') throw new TypeError(`invalid kind "${kind}"`);
    return this._canProduceByKind[kind];
  }
  /**
   * Creates a Transport for sending media.
   *
   * @throws {InvalidStateError} if not loaded.
   * @throws {TypeError} if wrong arguments.
   */


  createSendTransport({
    id,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    appData = {}
  }) {
    logger.debug('createSendTransport()');
    return this._createTransport({
      direction: 'send',
      id: id,
      iceParameters: iceParameters,
      iceCandidates: iceCandidates,
      dtlsParameters: dtlsParameters,
      sctpParameters: sctpParameters,
      iceServers: iceServers,
      iceTransportPolicy: iceTransportPolicy,
      additionalSettings: additionalSettings,
      proprietaryConstraints: proprietaryConstraints,
      appData: appData
    });
  }
  /**
   * Creates a Transport for receiving media.
   *
   * @throws {InvalidStateError} if not loaded.
   * @throws {TypeError} if wrong arguments.
   */


  createRecvTransport({
    id,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    appData = {}
  }) {
    logger.debug('createRecvTransport()');
    return this._createTransport({
      direction: 'recv',
      id: id,
      iceParameters: iceParameters,
      iceCandidates: iceCandidates,
      dtlsParameters: dtlsParameters,
      sctpParameters: sctpParameters,
      iceServers: iceServers,
      iceTransportPolicy: iceTransportPolicy,
      additionalSettings: additionalSettings,
      proprietaryConstraints: proprietaryConstraints,
      appData: appData
    });
  }

  _createTransport({
    direction,
    id,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers,
    iceTransportPolicy,
    additionalSettings,
    proprietaryConstraints,
    appData = {}
  }) {
    if (!this._loaded) throw new errors_1.InvalidStateError('not loaded');else if (typeof id !== 'string') throw new TypeError('missing id');else if (typeof iceParameters !== 'object') throw new TypeError('missing iceParameters');else if (!Array.isArray(iceCandidates)) throw new TypeError('missing iceCandidates');else if (typeof dtlsParameters !== 'object') throw new TypeError('missing dtlsParameters');else if (sctpParameters && typeof sctpParameters !== 'object') throw new TypeError('wrong sctpParameters');else if (appData && typeof appData !== 'object') throw new TypeError('if given, appData must be an object'); // Create a new Transport.

    const transport = new Transport_1.Transport({
      direction,
      id,
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      iceServers,
      iceTransportPolicy,
      additionalSettings,
      proprietaryConstraints,
      appData,
      handlerFactory: this._handlerFactory,
      extendedRtpCapabilities: this._extendedRtpCapabilities,
      canProduceByKind: this._canProduceByKind
    }); // Emit observer event.

    this._observer.safeEmit('newtransport', transport);

    return transport;
  }

}

exports.Device = Device;
},{"bowser":"JSid","./Logger":"andi","./EnhancedEventEmitter":"P3Oo","./errors":"hNUz","./utils":"fnp2","./ortc":"y0TR","./Transport":"BHpp","./handlers/Chrome74":"YvS6","./handlers/Chrome70":"fEjk","./handlers/Chrome67":"RFT0","./handlers/Chrome55":"vy33","./handlers/Firefox60":"rkz5","./handlers/Safari12":"Xquh","./handlers/Safari11":"wFon","./handlers/Edge11":"H8eT","./handlers/ReactNative":"DJ68"}],"Zn1c":[function(require,module,exports) {
"use strict";
/**
 * The RTP capabilities define what mediasoup or an endpoint can receive at
 * media level.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"BZdl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"pJdj":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./Device"), exports);

__exportStar(require("./Transport"), exports);

__exportStar(require("./Producer"), exports);

__exportStar(require("./Consumer"), exports);

__exportStar(require("./DataProducer"), exports);

__exportStar(require("./DataConsumer"), exports);

__exportStar(require("./RtpParameters"), exports);

__exportStar(require("./SctpParameters"), exports);

__exportStar(require("./handlers/HandlerInterface"), exports);

__exportStar(require("./errors"), exports);
},{"./Device":"kWtX","./Transport":"BHpp","./Producer":"dKU8","./Consumer":"QQSC","./DataProducer":"Z0Ve","./DataConsumer":"g5am","./RtpParameters":"Zn1c","./SctpParameters":"BZdl","./handlers/HandlerInterface":"JfyM","./errors":"hNUz"}],"CWXY":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectDevice = exports.Device = exports.version = exports.types = void 0;

const Device_1 = require("./Device");

Object.defineProperty(exports, "Device", {
  enumerable: true,
  get: function () {
    return Device_1.Device;
  }
});
Object.defineProperty(exports, "detectDevice", {
  enumerable: true,
  get: function () {
    return Device_1.detectDevice;
  }
});

const types = __importStar(require("./types"));

exports.types = types;
/**
 * Expose mediasoup-client version.
 */

exports.version = '3.6.29';
/**
 * Expose parseScalabilityMode() function.
 */

var scalabilityModes_1 = require("./scalabilityModes");

Object.defineProperty(exports, "parseScalabilityMode", {
  enumerable: true,
  get: function () {
    return scalabilityModes_1.parse;
  }
});
},{"./Device":"kWtX","./types":"pJdj","./scalabilityModes":"LIqw"}],"C6pA":[function(require,module,exports) {
module.exports = {
  "_args": [["protoo-client@4.0.6", "/Users/ojack/PROJECTS/flujos"]],
  "_from": "protoo-client@4.0.6",
  "_id": "protoo-client@4.0.6",
  "_inBundle": false,
  "_integrity": "sha512-ZqImkKHpeJhSlgvyI6QAfZNc/aXcCgmmocMx4S1w2lAaxXtckxxeDtcVNtkOISUWm/mbC+BrmYPXoGMkfhkKOQ==",
  "_location": "/protoo-client",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "protoo-client@4.0.6",
    "name": "protoo-client",
    "escapedName": "protoo-client",
    "rawSpec": "4.0.6",
    "saveSpec": null,
    "fetchSpec": "4.0.6"
  },
  "_requiredBy": ["/"],
  "_resolved": "https://registry.npmjs.org/protoo-client/-/protoo-client-4.0.6.tgz",
  "_spec": "4.0.6",
  "_where": "/Users/ojack/PROJECTS/flujos",
  "author": {
    "name": "Iñaki Baz Castillo",
    "email": "ibc@aliax.net"
  },
  "bugs": {
    "url": "https://github.com/ibc/protoo/issues"
  },
  "dependencies": {
    "debug": "^4.3.1",
    "events": "^3.2.0",
    "retry": "^0.12.0",
    "websocket": "^1.0.33"
  },
  "description": "protoo JavaScript client module",
  "devDependencies": {
    "eslint": "^5.16.0"
  },
  "engines": {
    "node": ">=8.0.0"
  },
  "homepage": "https://protoo.versatica.com",
  "keywords": ["nodejs", "browser", "websocket"],
  "license": "MIT",
  "main": "lib/index.js",
  "name": "protoo-client",
  "optionalDependencies": {
    "websocket": "^1.0.33"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ibc/protoo.git"
  },
  "scripts": {
    "lint": "eslint -c .eslintrc.js lib"
  },
  "version": "4.0.6"
};
},{}],"UkIf":[function(require,module,exports) {
const debug = require('debug');

const APP_NAME = 'protoo-client';

class Logger {
  constructor(prefix) {
    if (prefix) {
      this._debug = debug(`${APP_NAME}:${prefix}`);
      this._warn = debug(`${APP_NAME}:WARN:${prefix}`);
      this._error = debug(`${APP_NAME}:ERROR:${prefix}`);
    } else {
      this._debug = debug(APP_NAME);
      this._warn = debug(`${APP_NAME}:WARN`);
      this._error = debug(`${APP_NAME}:ERROR`);
    }
    /* eslint-disable no-console */


    this._debug.log = console.info.bind(console);
    this._warn.log = console.warn.bind(console);
    this._error.log = console.error.bind(console);
    /* eslint-enable no-console */
  }

  get debug() {
    return this._debug;
  }

  get warn() {
    return this._warn;
  }

  get error() {
    return this._error;
  }

}

module.exports = Logger;
},{"debug":"jD9Y"}],"Aog5":[function(require,module,exports) {
const {
  EventEmitter
} = require('events');

const Logger = require('./Logger');

class EnhancedEventEmitter extends EventEmitter {
  constructor(logger) {
    super();
    this.setMaxListeners(Infinity);
    this._logger = logger || new Logger('EnhancedEventEmitter');
  }

  safeEmit(event, ...args) {
    try {
      this.emit(event, ...args);
    } catch (error) {
      this._logger.error('safeEmit() | event listener threw an error [event:%s]:%o', event, error);
    }
  }

  async safeEmitAsPromise(event, ...args) {
    return new Promise((resolve, reject) => {
      this.safeEmit(event, ...args, resolve, reject);
    });
  }

}

module.exports = EnhancedEventEmitter;
},{"events":"dGdR","./Logger":"UkIf"}],"l708":[function(require,module,exports) {
/**
 * Generates a random positive integer.
 *
 * @returns {Number}
 */
exports.generateRandomNumber = function () {
  return Math.round(Math.random() * 10000000);
};
},{}],"Isju":[function(require,module,exports) {
const Logger = require('./Logger');

const {
  generateRandomNumber
} = require('./utils');

const logger = new Logger('Message');

class Message {
  static parse(raw) {
    let object;
    const message = {};

    try {
      object = JSON.parse(raw);
    } catch (error) {
      logger.error('parse() | invalid JSON: %s', error);
      return;
    }

    if (typeof object !== 'object' || Array.isArray(object)) {
      logger.error('parse() | not an object');
      return;
    } // Request.


    if (object.request) {
      message.request = true;

      if (typeof object.method !== 'string') {
        logger.error('parse() | missing/invalid method field');
        return;
      }

      if (typeof object.id !== 'number') {
        logger.error('parse() | missing/invalid id field');
        return;
      }

      message.id = object.id;
      message.method = object.method;
      message.data = object.data || {};
    } // Response.
    else if (object.response) {
        message.response = true;

        if (typeof object.id !== 'number') {
          logger.error('parse() | missing/invalid id field');
          return;
        }

        message.id = object.id; // Success.

        if (object.ok) {
          message.ok = true;
          message.data = object.data || {};
        } // Error.
        else {
            message.ok = false;
            message.errorCode = object.errorCode;
            message.errorReason = object.errorReason;
          }
      } // Notification.
      else if (object.notification) {
          message.notification = true;

          if (typeof object.method !== 'string') {
            logger.error('parse() | missing/invalid method field');
            return;
          }

          message.method = object.method;
          message.data = object.data || {};
        } // Invalid.
        else {
            logger.error('parse() | missing request/response field');
            return;
          }

    return message;
  }

  static createRequest(method, data) {
    const request = {
      request: true,
      id: generateRandomNumber(),
      method: method,
      data: data || {}
    };
    return request;
  }

  static createSuccessResponse(request, data) {
    const response = {
      response: true,
      id: request.id,
      ok: true,
      data: data || {}
    };
    return response;
  }

  static createErrorResponse(request, errorCode, errorReason) {
    const response = {
      response: true,
      id: request.id,
      ok: false,
      errorCode: errorCode,
      errorReason: errorReason
    };
    return response;
  }

  static createNotification(method, data) {
    const notification = {
      notification: true,
      method: method,
      data: data || {}
    };
    return notification;
  }

}

module.exports = Message;
},{"./Logger":"UkIf","./utils":"l708"}],"PyVj":[function(require,module,exports) {
const Logger = require('./Logger');

const EnhancedEventEmitter = require('./EnhancedEventEmitter');

const Message = require('./Message');

const logger = new Logger('Peer');

class Peer extends EnhancedEventEmitter {
  /**
   * @param {protoo.Transport} transport
   *
   * @emits open
   * @emits {currentAttempt: Number} failed
   * @emits disconnected
   * @emits close
   * @emits {request: protoo.Request, accept: Function, reject: Function} request
   * @emits {notification: protoo.Notification} notification
   */
  constructor(transport) {
    super(logger);
    logger.debug('constructor()'); // Closed flag.
    // @type {Boolean}

    this._closed = false; // Transport.
    // @type {protoo.Transport}

    this._transport = transport; // Connected flag.
    // @type {Boolean}

    this._connected = false; // Custom data object.
    // @type {Object}

    this._data = {}; // Map of pending sent request objects indexed by request id.
    // @type {Map<Number, Object>}

    this._sents = new Map(); // Handle transport.

    this._handleTransport();
  }
  /**
   * Whether the Peer is closed.
   *
   * @returns {Boolean}
   */


  get closed() {
    return this._closed;
  }
  /**
   * Whether the Peer is connected.
   *
   * @returns {Boolean}
   */


  get connected() {
    return this._connected;
  }
  /**
   * App custom data.
   *
   * @returns {Object}
   */


  get data() {
    return this._data;
  }
  /**
   * Invalid setter.
   */


  set data(data) // eslint-disable-line no-unused-vars
  {
    throw new Error('cannot override data object');
  }
  /**
   * Close this Peer and its Transport.
   */


  close() {
    if (this._closed) return;
    logger.debug('close()');
    this._closed = true;
    this._connected = false; // Close Transport.

    this._transport.close(); // Close every pending sent.


    for (const sent of this._sents.values()) {
      sent.close();
    } // Emit 'close' event.


    this.safeEmit('close');
  }
  /**
   * Send a protoo request to the server-side Room.
   *
   * @param {String} method
   * @param {Object} [data]
   *
   * @async
   * @returns {Object} The response data Object if a success response is received.
   */


  async request(method, data = undefined) {
    const request = Message.createRequest(method, data);

    this._logger.debug('request() [method:%s, id:%s]', method, request.id); // This may throw.


    await this._transport.send(request);
    return new Promise((pResolve, pReject) => {
      const timeout = 1500 * (15 + 0.1 * this._sents.size);
      const sent = {
        id: request.id,
        method: request.method,
        resolve: data2 => {
          if (!this._sents.delete(request.id)) return;
          clearTimeout(sent.timer);
          pResolve(data2);
        },
        reject: error => {
          if (!this._sents.delete(request.id)) return;
          clearTimeout(sent.timer);
          pReject(error);
        },
        timer: setTimeout(() => {
          if (!this._sents.delete(request.id)) return;
          pReject(new Error('request timeout'));
        }, timeout),
        close: () => {
          clearTimeout(sent.timer);
          pReject(new Error('peer closed'));
        }
      }; // Add sent stuff to the map.

      this._sents.set(request.id, sent);
    });
  }
  /**
   * Send a protoo notification to the server-side Room.
   *
   * @param {String} method
   * @param {Object} [data]
   *
   * @async
   */


  async notify(method, data = undefined) {
    const notification = Message.createNotification(method, data);

    this._logger.debug('notify() [method:%s]', method); // This may throw.


    await this._transport.send(notification);
  }

  _handleTransport() {
    if (this._transport.closed) {
      this._closed = true;
      setTimeout(() => {
        if (this._closed) return;
        this._connected = false;
        this.safeEmit('close');
      });
      return;
    }

    this._transport.on('open', () => {
      if (this._closed) return;
      logger.debug('emit "open"');
      this._connected = true;
      this.safeEmit('open');
    });

    this._transport.on('disconnected', () => {
      if (this._closed) return;
      logger.debug('emit "disconnected"');
      this._connected = false;
      this.safeEmit('disconnected');
    });

    this._transport.on('failed', currentAttempt => {
      if (this._closed) return;
      logger.debug('emit "failed" [currentAttempt:%s]', currentAttempt);
      this._connected = false;
      this.safeEmit('failed', currentAttempt);
    });

    this._transport.on('close', () => {
      if (this._closed) return;
      this._closed = true;
      logger.debug('emit "close"');
      this._connected = false;
      this.safeEmit('close');
    });

    this._transport.on('message', message => {
      if (message.request) this._handleRequest(message);else if (message.response) this._handleResponse(message);else if (message.notification) this._handleNotification(message);
    });
  }

  _handleRequest(request) {
    try {
      this.emit('request', // Request.
      request, // accept() function.
      data => {
        const response = Message.createSuccessResponse(request, data);

        this._transport.send(response).catch(() => {});
      }, // reject() function.
      (errorCode, errorReason) => {
        if (errorCode instanceof Error) {
          errorReason = errorCode.message;
          errorCode = 500;
        } else if (typeof errorCode === 'number' && errorReason instanceof Error) {
          errorReason = errorReason.message;
        }

        const response = Message.createErrorResponse(request, errorCode, errorReason);

        this._transport.send(response).catch(() => {});
      });
    } catch (error) {
      const response = Message.createErrorResponse(request, 500, String(error));

      this._transport.send(response).catch(() => {});
    }
  }

  _handleResponse(response) {
    const sent = this._sents.get(response.id);

    if (!sent) {
      logger.error('received response does not match any sent request [id:%s]', response.id);
      return;
    }

    if (response.ok) {
      sent.resolve(response.data);
    } else {
      const error = new Error(response.errorReason);
      error.code = response.errorCode;
      sent.reject(error);
    }
  }

  _handleNotification(notification) {
    this.safeEmit('notification', notification);
  }

}

module.exports = Peer;
},{"./Logger":"UkIf","./EnhancedEventEmitter":"Aog5","./Message":"Isju"}],"NPI8":[function(require,module,exports) {
var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Fallback to standard globalThis if available
	if (typeof globalThis === "object" && globalThis) return globalThis;

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of updates to Object.prototype being restricted
		// via preventExtensions, seal or freeze
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ works, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();

},{}],"VKXw":[function(require,module,exports) {
module.exports = {
  "_args": [["websocket@1.0.33", "/Users/ojack/PROJECTS/flujos"]],
  "_from": "websocket@1.0.33",
  "_id": "websocket@1.0.33",
  "_inBundle": false,
  "_integrity": "sha512-XwNqM2rN5eh3G2CUQE3OHZj+0xfdH42+OFK6LdC2yqiC0YU8e5UK0nYre220T0IyyN031V/XOvtHvXozvJYFWA==",
  "_location": "/websocket",
  "_optional": true,
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "websocket@1.0.33",
    "name": "websocket",
    "escapedName": "websocket",
    "rawSpec": "1.0.33",
    "saveSpec": null,
    "fetchSpec": "1.0.33"
  },
  "_requiredBy": ["/protoo-client"],
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.33.tgz",
  "_spec": "1.0.33",
  "_where": "/Users/ojack/PROJECTS/flujos",
  "author": {
    "name": "Brian McKelvey",
    "email": "theturtle32@gmail.com",
    "url": "https://github.com/theturtle32"
  },
  "browser": "lib/browser.js",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "config": {
    "verbose": false
  },
  "contributors": [{
    "name": "Iñaki Baz Castillo",
    "email": "ibc@aliax.net",
    "url": "http://dev.sipdoc.net"
  }],
  "dependencies": {
    "bufferutil": "^4.0.1",
    "debug": "^2.2.0",
    "es5-ext": "^0.10.50",
    "typedarray-to-buffer": "^3.1.5",
    "utf-8-validate": "^5.0.2",
    "yaeti": "^0.0.6"
  },
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "devDependencies": {
    "buffer-equal": "^1.0.0",
    "gulp": "^4.0.2",
    "gulp-jshint": "^2.0.4",
    "jshint": "^2.0.0",
    "jshint-stylish": "^2.2.1",
    "tape": "^4.9.1"
  },
  "directories": {
    "lib": "./lib"
  },
  "engines": {
    "node": ">=4.0.0"
  },
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "keywords": ["websocket", "websockets", "socket", "networking", "comet", "push", "RFC-6455", "realtime", "server", "client"],
  "license": "Apache-2.0",
  "main": "index",
  "name": "websocket",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "scripts": {
    "gulp": "gulp",
    "test": "tape test/unit/*.js"
  },
  "version": "1.0.33"
};
},{}],"CI7o":[function(require,module,exports) {
module.exports = require('../package.json').version;
},{"../package.json":"VKXw"}],"zPp5":[function(require,module,exports) {
var _globalThis;

try {
  _globalThis = require('es5-ext/global');
} catch (error) {} finally {
  if (!_globalThis && typeof window !== 'undefined') {
    _globalThis = window;
  }

  if (!_globalThis) {
    throw new Error('Could not determine global this');
  }
}

var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;

var websocket_version = require('./version');
/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */


function W3CWebSocket(uri, protocols) {
  var native_instance;

  if (protocols) {
    native_instance = new NativeWebSocket(uri, protocols);
  } else {
    native_instance = new NativeWebSocket(uri);
  }
  /**
   * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
   * class). Since it is an Object it will be returned as it is when creating an
   * instance of W3CWebSocket via 'new W3CWebSocket()'.
   *
   * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
   */


  return native_instance;
}

if (NativeWebSocket) {
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (prop) {
    Object.defineProperty(W3CWebSocket, prop, {
      get: function () {
        return NativeWebSocket[prop];
      }
    });
  });
}
/**
 * Module exports.
 */


module.exports = {
  'w3cwebsocket': NativeWebSocket ? W3CWebSocket : null,
  'version': websocket_version
};
},{"es5-ext/global":"NPI8","./version":"CI7o"}],"PqWU":[function(require,module,exports) {
function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = {
      forever: options
    };
  }

  this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
  this._timeouts = timeouts;
  this._options = options || {};
  this._maxRetryTime = options && options.maxRetryTime || Infinity;
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;
  this._operationStart = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}

module.exports = RetryOperation;

RetryOperation.prototype.reset = function () {
  this._attempts = 1;
  this._timeouts = this._originalTimeouts;
};

RetryOperation.prototype.stop = function () {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  this._timeouts = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function (err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }

  var currentTime = new Date().getTime();

  if (err && currentTime - this._operationStart >= this._maxRetryTime) {
    this._errors.unshift(new Error('RetryOperation timeout occurred'));

    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();

  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(this._errors.length - 1, this._errors.length);

      this._timeouts = this._cachedTimeouts.slice(0);
      timeout = this._timeouts.shift();
    } else {
      return false;
    }
  }

  var self = this;
  var timer = setTimeout(function () {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function () {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (self._options.unref) {
        self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
    timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function (fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }

    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;

  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function () {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._operationStart = new Date().getTime();

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function (fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function (fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function () {
  return this._errors;
};

RetryOperation.prototype.attempts = function () {
  return this._attempts;
};

RetryOperation.prototype.mainError = function () {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;
    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};
},{}],"Wk2y":[function(require,module,exports) {
var RetryOperation = require('./retry_operation');

exports.operation = function (options) {
  var timeouts = exports.timeouts(options);
  return new RetryOperation(timeouts, {
    forever: options && options.forever,
    unref: options && options.unref,
    maxRetryTime: options && options.maxRetryTime
  });
};

exports.timeouts = function (options) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };

  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];

  for (var i = 0; i < opts.retries; i++) {
    timeouts.push(this.createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(this.createTimeout(i, opts));
  } // sort the array numerically ascending


  timeouts.sort(function (a, b) {
    return a - b;
  });
  return timeouts;
};

exports.createTimeout = function (attempt, opts) {
  var random = opts.randomize ? Math.random() + 1 : 1;
  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);
  return timeout;
};

exports.wrap = function (obj, options, methods) {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];

    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    var original = obj[method];

    obj[method] = function retryWrapper(original) {
      var op = exports.operation(options);
      var args = Array.prototype.slice.call(arguments, 1);
      var callback = args.pop();
      args.push(function (err) {
        if (op.retry(err)) {
          return;
        }

        if (err) {
          arguments[0] = op.mainError();
        }

        callback.apply(this, arguments);
      });
      op.attempt(function () {
        original.apply(obj, args);
      });
    }.bind(obj, original);

    obj[method].options = options;
  }
};
},{"./retry_operation":"PqWU"}],"NFGJ":[function(require,module,exports) {
module.exports = require('./lib/retry');
},{"./lib/retry":"Wk2y"}],"ziqe":[function(require,module,exports) {
const W3CWebSocket = require('websocket').w3cwebsocket;

const retry = require('retry');

const Logger = require('../Logger');

const EnhancedEventEmitter = require('../EnhancedEventEmitter');

const Message = require('../Message');

const WS_SUBPROTOCOL = 'protoo';
const DEFAULT_RETRY_OPTIONS = {
  retries: 10,
  factor: 2,
  minTimeout: 1 * 1000,
  maxTimeout: 8 * 1000
};
const logger = new Logger('WebSocketTransport');

class WebSocketTransport extends EnhancedEventEmitter {
  /**
   * @param {String} url - WebSocket URL.
   * @param {Object} [options] - Options for WebSocket-Node.W3CWebSocket and retry.
   */
  constructor(url, options) {
    super(logger);
    logger.debug('constructor() [url:%s, options:%o]', url, options); // Closed flag.
    // @type {Boolean}

    this._closed = false; // WebSocket URL.
    // @type {String}

    this._url = url; // Options.
    // @type {Object}

    this._options = options || {}; // WebSocket instance.
    // @type {WebSocket}

    this._ws = null; // Run the WebSocket.

    this._runWebSocket();
  }

  get closed() {
    return this._closed;
  }

  close() {
    if (this._closed) return;
    logger.debug('close()'); // Don't wait for the WebSocket 'close' event, do it now.

    this._closed = true;
    this.safeEmit('close');

    try {
      this._ws.onopen = null;
      this._ws.onclose = null;
      this._ws.onerror = null;
      this._ws.onmessage = null;

      this._ws.close();
    } catch (error) {
      logger.error('close() | error closing the WebSocket: %o', error);
    }
  }

  async send(message) {
    if (this._closed) throw new Error('transport closed');

    try {
      this._ws.send(JSON.stringify(message));
    } catch (error) {
      logger.warn('send() failed:%o', error);
      throw error;
    }
  }

  _runWebSocket() {
    const operation = retry.operation(this._options.retry || DEFAULT_RETRY_OPTIONS);
    let wasConnected = false;
    operation.attempt(currentAttempt => {
      if (this._closed) {
        operation.stop();
        return;
      }

      logger.debug('_runWebSocket() [currentAttempt:%s]', currentAttempt);
      this._ws = new W3CWebSocket(this._url, WS_SUBPROTOCOL, this._options.origin, this._options.headers, this._options.requestOptions, this._options.clientConfig);

      this._ws.onopen = () => {
        if (this._closed) return;
        wasConnected = true; // Emit 'open' event.

        this.safeEmit('open');
      };

      this._ws.onclose = event => {
        if (this._closed) return;
        logger.warn('WebSocket "close" event [wasClean:%s, code:%s, reason:"%s"]', event.wasClean, event.code, event.reason); // Don't retry if code is 4000 (closed by the server).

        if (event.code !== 4000) {
          // If it was not connected, try again.
          if (!wasConnected) {
            this.safeEmit('failed', currentAttempt);
            if (this._closed) return;
            if (operation.retry(true)) return;
          } // If it was connected, start from scratch.
          else {
              operation.stop();
              this.safeEmit('disconnected');
              if (this._closed) return;

              this._runWebSocket();

              return;
            }
        }

        this._closed = true; // Emit 'close' event.

        this.safeEmit('close');
      };

      this._ws.onerror = () => {
        if (this._closed) return;
        logger.error('WebSocket "error" event');
      };

      this._ws.onmessage = event => {
        if (this._closed) return;
        const message = Message.parse(event.data);
        if (!message) return;

        if (this.listenerCount('message') === 0) {
          logger.error('no listeners for WebSocket "message" event, ignoring received message');
          return;
        } // Emit 'message' event.


        this.safeEmit('message', message);
      };
    });
  }

}

module.exports = WebSocketTransport;
},{"websocket":"zPp5","retry":"NFGJ","../Logger":"UkIf","../EnhancedEventEmitter":"Aog5","../Message":"Isju"}],"DLpz":[function(require,module,exports) {
const {
  version
} = require('../package.json');

const Peer = require('./Peer');

const WebSocketTransport = require('./transports/WebSocketTransport');
/**
 * Expose mediasoup-client version.
 *
 * @type {String}
 */


exports.version = version;
/**
 * Expose Peer class.
 *
 * @type {Class}
 */

exports.Peer = Peer;
/**
 * Expose WebSocketTransport class.
 *
 * @type {Class}
 */

exports.WebSocketTransport = WebSocketTransport;
},{"../package.json":"C6pA","./Peer":"PyVj","./transports/WebSocketTransport":"ziqe"}],"rxNS":[function(require,module,exports) {
const {
  EventEmitter
} = require("events");

const {
  Device
} = require("mediasoup-client");

const {
  WebSocketTransport,
  Peer
} = require("protoo-client");

module.exports = class Room extends EventEmitter {
  constructor() {
    super();
    this.peer = null;
    this.sendTransport = null;
    this.recvTransport = null;
  }

  join(server = `ws://localhost:2345`) {
    console.log("joining ", server);

    try {
      const wsTransport = new WebSocketTransport(server);
      this.peer = new Peer(wsTransport);
      this.peer.on("open", this.onPeerOpen.bind(this));
      this.peer.on("request", this.onPeerRequest.bind(this));
      this.peer.on("notification", this.onPeerNotification.bind(this));
      this.peer.on("failed", console.error);
      this.peer.on("disconnected", console.error);
      this.peer.on("close", console.error);
    } catch (err) {
      console.warn(err);
    }
  }

  async sendAudio(track) {
    //console.warn("room.sendAudio()");
    const audioProducer = await this.sendTransport.produce({
      track
    });
    audioProducer.on("trackended", async () => {
      //  console.warn("producer.close() by trackended");
      await this._closeProducer(audioProducer);
    });
    return audioProducer;
  }

  async sendVideo(track) {
    //    console.warn("room.sendVideo()");
    const videoProducer = await this.sendTransport.produce({
      track
    });
    videoProducer.on("trackended", async () => {
      //    console.warn("producer.close() by trackended");
      await this._closeProducer(videoProducer);
    });
    return videoProducer;
  }

  async onPeerOpen() {
    //  console.warn("room.peer:open");
    const device = new Device();
    const routerRtpCapabilities = await this.peer.request("getRouterRtpCapabilities").catch(console.error);
    await device.load({
      routerRtpCapabilities
    });
    await this._prepareSendTransport(device).catch(console.error);
    await this._prepareRecvTransport(device).catch(console.error);
    const res = await this.peer.request("join", {
      rtpCapabilities: device.rtpCapabilities
    });
    this.emit("@open", res);
  }

  async _prepareSendTransport(device) {
    const transportInfo = await this.peer.request("createWebRtcTransport", {
      producing: true,
      consuming: false
    }).catch(console.error); // transportInfo.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

    this.sendTransport = device.createSendTransport(transportInfo);
    this.sendTransport.on("connect", ({
      dtlsParameters
    }, callback, errback) => {
      //  console.warn("room.sendTransport:connect");
      this.peer.request("connectWebRtcTransport", {
        transportId: this.sendTransport.id,
        dtlsParameters
      }).then(callback).catch(errback);
    });
    this.sendTransport.on("produce", async ({
      kind,
      rtpParameters,
      appData
    }, callback, errback) => {
      //  console.warn("room.sendTransport:produce");
      try {
        const {
          id
        } = await this.peer.request("produce", {
          transportId: this.sendTransport.id,
          kind,
          rtpParameters,
          appData
        });
        callback({
          id
        });
      } catch (error) {
        errback(error);
      }
    });
  }

  async _prepareRecvTransport(device) {
    const transportInfo = await this.peer.request("createWebRtcTransport", {
      producing: false,
      consuming: true
    }).catch(console.error); // transportInfo.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

    this.recvTransport = device.createRecvTransport(transportInfo);
    this.recvTransport.on("connect", ({
      dtlsParameters
    }, callback, errback) => {
      //  console.warn("room.recvTransport:connect");
      this.peer.request("connectWebRtcTransport", {
        transportId: this.recvTransport.id,
        dtlsParameters
      }).then(callback).catch(errback);
    });
  }

  async _closeProducer(producer) {
    producer.close();
    await this.peer.request("closeProducer", {
      producerId: producer.id
    }).catch(console.error);
    this.emit("@producerClosed", {
      producerId: producer.id
    });
  }

  onPeerRequest(req, resolve, reject) {
    //  console.warn("room.peer:request", req.method);
    switch (req.method) {
      // if you decline this offer, will not request `newConsumer`
      case "newConsumerOffer":
        {
          // if (
          //   confirm(`Do you consume ${req.data.kind} from ${req.data.peerId}?`)
          // ) {
          //   resolve({ accept: true });
          //   return;
          // }
          // resolve({ accept: false });
          resolve({
            accept: true
          });
          break;
        }

      case "newConsumer":
        {
          this.recvTransport.consume(req.data).then(consumer => {
            this.emit("@consumer", consumer);
            resolve();
          }).catch(reject);
          break;
        }

      default:
        resolve();
    }
  }

  onPeerNotification(notification) {
    //  console.warn("room.peer:notification", notification);
    this.emit("@" + notification.method, notification.data);
  }

};
},{"events":"dGdR","mediasoup-client":"CWXY","protoo-client":"DLpz"}],"GAh9":[function(require,module,exports) {
const Room = require('./room.js');

const EventEmitter = require('events');

module.exports = class Viewer extends EventEmitter {
  constructor({
    videoEl,
    server = `ws://localhost:2345`,
    streamKey = "test"
  }) {
    super();
    this.room = new Room();
    this.tracks = {
      audio: null,
      video: null
    };
    this.isActive = false;
    const _server = `${server}/?stream=${streamKey}`;
    console.log('connecting to', _server);
    this.room.join(_server);

    if (!videoEl) {
      videoEl = document.createElement('video');
      document.body.appendChild(videoEl);
    }

    this.video = videoEl; //  this.video.autoplay = true
    //  this.video.muted = true

    this.video.addEventListener('canplay', event => {//console.log('Video can start, but not sure it will play through.');
    });
    this.room.on("@consumer", async consumer => {
      const {
        id,
        appData: {
          peerId
        },
        track
      } = consumer; //  console.log("receive consumer", consumer);
      //
      // const el = createMediaEl(track, peerId, id);
      // document.body.append(el)

      this.addTrack(track, peerId, id);
    });
    this.room.on("@consumerClosed", consumer => {
      console.log(consumer);
      console.log(consumer.consumerId);
      this.removeTrack(consumer.consumerId); //removeMediaEl(document.body, "data-search-id", consumerId);
    });
    this.room.on("@producerClosed", ({
      producerId
    }) => {
      console.log('producer closed'); //  removeMediaEl(localTracks, "data-search-id", producerId);
    });
    this.room.on("@peerClosed", ({
      peerId
    }) => {//  removeMediaEl(remoteTracks, "data-peer-id", peerId);
    });
  }

  addTrack(track, peerId, consumerId) {
    if (this.tracks[track.kind] !== null) {// remove track
    }

    this.tracks[track.kind] = {
      track: track,
      peerId: peerId,
      consumerId: consumerId
    };
    this.updateStream();
  }

  updateStream() {
    //  console.log('updating stream', tracks)
    const stream = new MediaStream();
    if (this.tracks.audio !== null) stream.addTrack(this.tracks.audio.track);
    if (this.tracks.video !== null) stream.addTrack(this.tracks.video.track);
    this.video.srcObject = stream;
    this.isActive = true;
    if (this.tracks.audio === null && this.tracks.video === null) this.isActive = false; //  console.log('active', isActive)
    //  onUpdate(tracks)

    this.emit('update', this.tracks);
  }

  removeTrack(id) {
    //  console.log('removing tracks', id, tracks)
    if (this.tracks.audio !== null && this.tracks.audio.consumerId === id) {
      this.tracks.audio = null;
    }

    if (this.tracks.video !== null && this.tracks.video.consumerId === id) {
      this.tracks.video = null;
    }

    this.updateStream();
  }

}; // ({ videoEl, server = `ws://localhost:2345`, streamKey = "test", onUpdate = () => {}}) => {
//
//
//   function createMediaEl(track, peerId, searchId) {
//     const el = document.createElement(track.kind);
//     el.srcObject = new MediaStream([track]);
//     el.autoplay = true
//     el.setAttribute("data-peer-id", peerId);
//     el.setAttribute("data-search-id", searchId);
//     el.playsInline = true;
//   //  el.play().catch(console.error);
//     return el;
//   }
//
//   return {
//     this.room: this.room,
//     tracks: tracks,
//     server: server,
//     isActive: isActive
//   }
// }
},{"./room.js":"rxNS","events":"dGdR"}],"Fszt":[function(require,module,exports) {
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],"P8fc":[function(require,module,exports) {
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":"Fszt"}],"gPFH":[function(require,module,exports) {
'use strict'

var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = el.ownerDocument.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, ' ')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes but preserve the appropriate whitespace
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, ' ')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],"yLdR":[function(require,module,exports) {
'use strict'

module.exports = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

},{}],"YVSa":[function(require,module,exports) {
'use strict'

module.exports = [
  'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default',
  'defaultchecked', 'defer', 'disabled', 'formnovalidate', 'hidden',
  'ismap', 'loop', 'multiple', 'muted', 'novalidate', 'open', 'playsinline',
  'readonly', 'required', 'reversed', 'selected'
]

},{}],"XElX":[function(require,module,exports) {
'use strict'

module.exports = [
  'indeterminate'
]

},{}],"Ot7I":[function(require,module,exports) {
'use strict'

var hyperx = require('hyperx')
var appendChild = require('./append-child')
var SVG_TAGS = require('./svg-tags')
var BOOL_PROPS = require('./bool-props')
// Props that need to be set directly rather than with el.setAttribute()
var DIRECT_PROPS = require('./direct-props')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var COMMENT_TAG = '!--'

module.exports = function (document) {
  function nanoHtmlCreateElement (tag, props, children) {
    var el

    // If an svg tag, it needs a namespace
    if (SVG_TAGS.indexOf(tag) !== -1) {
      props.namespace = SVGNS
    }

    // If we are using a namespace
    var ns = false
    if (props.namespace) {
      ns = props.namespace
      delete props.namespace
    }

    // If we are extending a builtin element
    var isCustomElement = false
    if (props.is) {
      isCustomElement = props.is
      delete props.is
    }

    // Create the element
    if (ns) {
      if (isCustomElement) {
        el = document.createElementNS(ns, tag, { is: isCustomElement })
      } else {
        el = document.createElementNS(ns, tag)
      }
    } else if (tag === COMMENT_TAG) {
      return document.createComment(props.comment)
    } else if (isCustomElement) {
      el = document.createElement(tag, { is: isCustomElement })
    } else {
      el = document.createElement(tag)
    }

    // Create the properties
    for (var p in props) {
      if (props.hasOwnProperty(p)) {
        var key = p.toLowerCase()
        var val = props[p]
        // Normalize className
        if (key === 'classname') {
          key = 'class'
          p = 'class'
        }
        // The for attribute gets transformed to htmlFor, but we just set as for
        if (p === 'htmlFor') {
          p = 'for'
        }
        // If a property is boolean, set itself to the key
        if (BOOL_PROPS.indexOf(key) !== -1) {
          if (String(val) === 'true') val = key
          else if (String(val) === 'false') continue
        }
        // If a property prefers being set directly vs setAttribute
        if (key.slice(0, 2) === 'on' || DIRECT_PROPS.indexOf(key) !== -1) {
          el[p] = val
        } else {
          if (ns) {
            if (p === 'xlink:href') {
              el.setAttributeNS(XLINKNS, p, val)
            } else if (/^xmlns($|:)/i.test(p)) {
              // skip xmlns definitions
            } else {
              el.setAttributeNS(null, p, val)
            }
          } else {
            el.setAttribute(p, val)
          }
        }
      }
    }

    appendChild(el, children)
    return el
  }

  function createFragment (nodes) {
    var fragment = document.createDocumentFragment()
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == null) continue
      if (Array.isArray(nodes[i])) {
        fragment.appendChild(createFragment(nodes[i]))
      } else {
        if (typeof nodes[i] === 'string') nodes[i] = document.createTextNode(nodes[i])
        fragment.appendChild(nodes[i])
      }
    }
    return fragment
  }

  var exports = hyperx(nanoHtmlCreateElement, {
    comments: true,
    createFragment: createFragment
  })
  exports.default = exports
  exports.createComment = nanoHtmlCreateElement
  return exports
}

},{"hyperx":"P8fc","./append-child":"gPFH","./svg-tags":"yLdR","./bool-props":"YVSa","./direct-props":"XElX"}],"QR4u":[function(require,module,exports) {
module.exports = require('./dom')(document)

},{"./dom":"Ot7I"}],"tsca":[function(require,module,exports) {
const Viewer = require('./lib/mediasoup-viewer.js'); // const hydraStartup = require('./hydra-startup')


const html = require('nanohtml');

module.exports = () => {
  let hasStarted = false; //  document.body.innerHTML = 'this an example viewer for the media soup broadcaster. click to start!'
  //const server = `wss://livelab.app:3499`
  // const server = `wss://192.168.178.37:8000`
  //const server = `wss://localhost:8000/${window.location.search}`
  //const server = `wss://${window.location.hostname}:8000/${window.location.search}`
  // const server = `wss://${window.location.hostname}:8000/${window.location.search}`

  const server = "wss://mediasoup.tentacles.live:8000"; // /?stream=flujos"
  //window.onclick = () => {

  if (!hasStarted) {
    const video = createVideo({}, () => {
      setTimeout(() => {
        //  s0.init({ src: video })
        // osc(3, 0.2, 1.2).diff(s0).out()
        video.play();
      }, 600);
    });
    const video2 = createVideo({}, () => {
      video.play();
    }); // const audioEl = html`<audio></audio>`
    // audioEl.autoplay = true

    const videoHolder = html`<div class="absolute right-0 top-0 fr">${video}${video2}</div>`;
    document.body.appendChild(videoHolder); // turn the video element into a viewer for server location `wss://localhost:8000`

    const viewer1 = new Viewer({
      videoEl: video,
      server: server,
      streamKey: "flujos"
    }); // const audio = new Viewer({ videoEl: audioEl, server:  server, streamKey: "flujos-audio"})
    // // turn the video element into a viewer for server location `wss://localhost:8000`

    const viewer2 = new Viewer({
      videoEl: video2,
      server: server,
      streamKey: "flujos2"
    });
    hasStarted = true;
  } //}

};

function createVideo({
  width = 300,
  height = 200
} = {}, onload = () => {}) {
  const vid = html`<video style="width:${width};height:${height};clip-path:circle(${height / 2}px at ${width / 2}px ${height / 2}px)"></video>`;
  vid.autoplay = true; // vid.muted = true

  vid.addEventListener('loadeddata', onload);
  return vid;
}
},{"./lib/mediasoup-viewer.js":"GAh9","nanohtml":"QR4u"}],"HQUh":[function(require,module,exports) {
const html = require('nanohtml');

module.exports = () => {
  const canvas = html`<canvas class="w-100 h-100"></canvas>`;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const hydra = new Hydra({
    detectAudio: false,
    canvas: canvas
  });
  speed = 0.5; // unfoldings

  osc(10, 0.03, 1.2).color(1.0, 0.3, 0.6).add(osc(15, -0.1).color(0.1, 0.9, 0.3)).out();
  src(o1).layer(src(o0).mask(osc(10, -0.1).rotate(0, 0.1).modulate(osc(10).thresh(0.8, 0.4)).kaleid(2).thresh(0.9, 0)), 0).modulate(osc(20), -0.004, 1.02).modulate(src(o1).color(1, 0), 0.1).contrast(1.1).blend(o0, () => Math.sin(time * 0.1) * 0.5 + 0.5).out(o1);
  render(o1);
};
},{"nanohtml":"QR4u"}],"IBgI":[function(require,module,exports) {
const initStreamingMedia = require('./init-media-sources.js');

const initHydra = require('./init-hydra.js');

const html = require('nanohtml');

const flokURL = "https://flok.clic.cf/s/NjUxMWM2MjUtOTFlZi00NzNiLWJhNTUtMzVhNWIwY2U0MmFm?layout=hydra,hydra&noHydra=1&bgOpacity=0";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const edit = urlParams.get('edit');
const readOnly = edit == 1 ? false : true;
initHydra(); // create ui elements

const intro = html`<div class="pa4 i f3"> <h1 class="f1 i"> flujos </h1>
    <p class="f3"> web_site_specific performance</p>
    <p class="f3">by Celeste Betancur and Olivia Jack </p>
    <div onclick=${start} class="pointer dim"> ${">>>"} enter ${"<<<<"} </div>
    </div>`;
const uiContainer = html`<div class="w-100 h-100 absolute top-0 left-0 overflow-y-auto">${intro}</div>`;
const editor = html`<div class="absolute mb5 bottom-0 left-0 w-100 skewY" style="height:40%">
<iframe src="${flokURL}${readOnly ? '&readonly=1' : ''}" frameborder="0" class="w-100 h-100"></iframe>
</div>`; // execute editor events on global context

window.addEventListener("message", function (event) {
  //console.log('received message', event)
  if (event.data) {
    if (event.data.cmd === "evaluateCode") {
      //  console.log('evaluate', event.data.args.body)
      eval(event.data.args.body);
    }
  }
});

function start() {
  uiContainer.innerHTML = '';
  uiContainer.appendChild(editor);
  initStreamingMedia();
}

document.body.appendChild(uiContainer); //  document.body.appendChild(editor)
//}
},{"./init-media-sources.js":"tsca","./init-hydra.js":"HQUh","nanohtml":"QR4u"}]},{},["IBgI"], null)
//# sourceMappingURL=https://ojack.xyz/flujos/app.606153df.js.map