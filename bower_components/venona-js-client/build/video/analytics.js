(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("analytics", [], factory);
	else if(typeof exports === 'object')
		exports["analytics"] = factory();
	else
		root["analytics"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(167);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.0' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(3);
	var core = __webpack_require__(1);
	var ctx = __webpack_require__(12);
	var hide = __webpack_require__(16);
	var PROTOTYPE = 'prototype';
	
	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(68)('wks');
	var uid = __webpack_require__(40);
	var Symbol = __webpack_require__(3).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint-disable no-console */
	
	var levels = {
	  debug: 0,
	  info: 10,
	  warning: 20,
	  error: 30,
	  critical: 40
	};
	
	var Logger = function () {
	  function Logger() {
	    (0, _classCallCheck3.default)(this, Logger);
	
	    this._level = levels.info;
	  }
	
	  (0, _createClass3.default)(Logger, [{
	    key: 'setLevel',
	    value: function setLevel(level) {
	      if (level in levels) {
	        this._level = levels[level];
	      }
	    }
	  }, {
	    key: 'write',
	    value: function write(level, message) {
	      console.log('[' + new Date().toISOString() + '] (' + level + ') ' + message);
	    }
	  }, {
	    key: 'debug',
	    value: function debug(message) {
	      if (levels.debug >= this._level) {
	        this.write('DEBUG', message);
	      }
	    }
	  }, {
	    key: 'info',
	    value: function info(message) {
	      if (levels.info >= this._level) {
	        this.write('INFO', message);
	      }
	    }
	  }, {
	    key: 'warning',
	    value: function warning(message) {
	      if (levels.warning >= this._level) {
	        this.write('WARNING', message);
	      }
	    }
	  }, {
	    key: 'error',
	    value: function error(message) {
	      if (levels.error >= this._level) {
	        this.write('ERROR', message);
	      }
	    }
	  }, {
	    key: 'critical',
	    value: function critical(message) {
	      if (levels.critical >= this._level) {
	        this.write('CRITICAL', message);
	      }
	    }
	  }]);
	  return Logger;
	}();
	
	exports.default = new Logger();

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(184);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(15);
	var IE8_DOM_DEFINE = __webpack_require__(101);
	var toPrimitive = __webpack_require__(70);
	var dP = Object.defineProperty;
	
	exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(18)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(133);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(28);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(8);
	var createDesc = __webpack_require__(33);
	module.exports = __webpack_require__(9) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(61);
	var defined = __webpack_require__(58);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(110);
	var enumBugKeys = __webpack_require__(60);
	
	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(283),
	    getValue = __webpack_require__(311);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(196), __esModule: true };

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(202), __esModule: true };

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(58);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(35),
	    getRawTag = __webpack_require__(309),
	    objectToString = __webpack_require__(340);
	
	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}
	
	module.exports = baseGetTag;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _StateMachine = __webpack_require__(98);
	
	var _StateMachine2 = _interopRequireDefault(_StateMachine);
	
	var _model = __webpack_require__(178);
	
	var _model2 = _interopRequireDefault(_model);
	
	var _callbacks = __webpack_require__(177);
	
	var callbacks = _interopRequireWildcard(_callbacks);
	
	var _transitions = __webpack_require__(179);
	
	var _transitions2 = _interopRequireDefault(_transitions);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var VideoPlayer = function () {
	  function VideoPlayer() {
	    (0, _classCallCheck3.default)(this, VideoPlayer);
	
	    this.model = new _model2.default();
	
	    this.sm = new _StateMachine2.default({
	      initial: 'blank',
	      callbacks: callbacks,
	      transitions: _transitions2.default,
	      name: 'VideoPlayer'
	    });
	  }
	
	  (0, _createClass3.default)(VideoPlayer, [{
	    key: 'playbackSelect',
	    value: function playbackSelect(timestamp, playbackType, position) {
	      this.sm.trigger('playbackSelect', {
	        data: {
	          playbackType: playbackType,
	          position: position
	        },
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackStreamUriAcquired',
	    value: function playbackStreamUriAcquired(timestamp) {
	      this.sm.trigger('playbackStreamUriAcquired', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackStart',
	    value: function playbackStart(timestamp, bitrate, playPointTimestamp) {
	      this.sm.trigger('playbackStart', {
	        data: {
	          bitrate: bitrate,
	          playPointTimestamp: playPointTimestamp
	        },
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackStop',
	    value: function playbackStop(timestamp) {
	      this.sm.trigger('playbackStop', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackHeartbeat',
	    value: function playbackHeartbeat(timestamp) {
	      this.sm.trigger('playbackHeartbeat', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'bufferingStart',
	    value: function bufferingStart(timestamp) {
	      this.sm.trigger('bufferingStart', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'bufferingStop',
	    value: function bufferingStop(timestamp) {
	      this.sm.trigger('bufferingStop', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackPause',
	    value: function playbackPause(timestamp) {
	      this.sm.trigger('playbackPause', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackUnpause',
	    value: function playbackUnpause(timestamp) {
	      this.sm.trigger('playbackUnpause', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackTrickPlayStart',
	    value: function playbackTrickPlayStart(timestamp) {
	      this.sm.trigger('playbackTrickPlayStart', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackTrickPlayRateChange',
	    value: function playbackTrickPlayRateChange(timestamp) {
	      this.sm.trigger('playbackTrickPlayRateChange', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackTrickPlayStop',
	    value: function playbackTrickPlayStop(timestamp, contentPosition) {
	      this.sm.trigger('playbackTrickPlayStop', {
	        data: {
	          contentPosition: contentPosition
	        },
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackFailure',
	    value: function playbackFailure(timestamp) {
	      this.sm.trigger('playbackFailure', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'attemptRestart',
	    value: function attemptRestart(timestamp) {
	      this.sm.trigger('attemptRestart', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'playbackBitRateChange',
	    value: function playbackBitRateChange(timestamp, bitrate) {
	      this.sm.trigger('playbackBitRateChange', {
	        data: {
	          bitrate: bitrate
	        },
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'tick',
	    value: function tick(timestamp) {
	      this.sm.trigger('tick', {
	        options: {
	          timestamp: timestamp
	        }
	      });
	    }
	  }, {
	    key: 'isActive',
	    value: function isActive() {
	      return this.model.playbackStartedTimestamp !== 0;
	    }
	  }, {
	    key: 'getVideoPlayerState',
	    value: function getVideoPlayerState() {
	      var data = {
	        playbackType: this.model.playbackType,
	        uriObtainedMs: this.model.uriObtainedMs,
	        tuneTimeMs: this.model.tuneTimeMs,
	        currentVideoPosition: this.model.currentVideoPosition,
	        lastBufferingTime: this.model.lastBufferingTime,
	        heartBeat: {
	          contentElapsedMs: this.model.contentElapsedMs,
	          clockTimeElapsedMs: this.model.clockTimeElapsedMs,
	          playPointTimestamp: this.model.playPointTimestamp
	        },
	        bitRate: {
	          currentBitRate: this.model.currentBitRate,
	          previousBitRate: this.model.previousBitRate,
	          contentElapsedAtCurrentBitRate: this.model.contentElapsedAtCurrentBitRate,
	          contentElapsedAtPreviousBitRate: this.model.contentElapsedAtPreviousBitRate
	        }
	      };
	
	      this.model.playbackType === 'linear' && delete data.currentVideoPosition;
	      this.model.playbackType === 'vod' && delete data.heartBeat.playPointTimestamp;
	
	      return data;
	    }
	  }]);
	  return VideoPlayer;
	}();
	
	exports.default = new VideoPlayer();

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__(12);
	var call = __webpack_require__(104);
	var isArrayIter = __webpack_require__(102);
	var anObject = __webpack_require__(15);
	var toLength = __webpack_require__(39);
	var getIterFn = __webpack_require__(119);
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
	  var f = ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(8).f;
	var has = __webpack_require__(19);
	var TAG = __webpack_require__(4)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(11);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(79),
	    baseAssignValue = __webpack_require__(80);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;
	
	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(15);
	var dPs = __webpack_require__(226);
	var enumBugKeys = __webpack_require__(60);
	var IE_PROTO = __webpack_require__(67)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(59)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(100).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(69);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(232)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(62)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(325),
	    listCacheDelete = __webpack_require__(326),
	    listCacheGet = __webpack_require__(327),
	    listCacheHas = __webpack_require__(328),
	    listCacheSet = __webpack_require__(329);
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	module.exports = ListCache;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(48);
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	module.exports = assocIndexOf;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(13),
	    isKey = __webpack_require__(322),
	    stringToPath = __webpack_require__(351),
	    toString = __webpack_require__(361);
	
	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString(value));
	}
	
	module.exports = castPath;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(323);
	
	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}
	
	module.exports = getMapData;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	module.exports = isIndex;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21);
	
	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');
	
	module.exports = nativeCreate;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(281),
	    isObjectLike = __webpack_require__(26);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};
	
	module.exports = isArguments;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(90),
	    isLength = __webpack_require__(91);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(122),
	    baseKeysIn = __webpack_require__(286),
	    isArrayLike = __webpack_require__(50);
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}
	
	module.exports = keysIn;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _pick2 = __webpack_require__(96);
	
	var _pick3 = _interopRequireDefault(_pick2);
	
	var _cloneDeep2 = __webpack_require__(140);
	
	var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);
	
	exports.compose = compose;
	exports.pack = pack;
	
	var _prune = __webpack_require__(165);
	
	var _prune2 = _interopRequireDefault(_prune);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO: don't pass analytics instance
	function compose(event, eventData, modelData, analytics) {
	  var message = {
	    state: modelData.state,
	    message: modelData.message,
	    operation: modelData.operation,
	    application: modelData.application
	  };
	
	  message.message.name = event;
	  message.message.sequenceNumber = analytics.messageId;
	  message.message.timestamp = analytics.timestamp;
	
	  var preparedMessage = message;
	  if (analytics.settings.filterFields) {
	    var fields = analytics.eventFields[event];
	    if (fields) {
	      preparedMessage = (0, _pick3.default)(message, fields);
	    }
	  }
	
	  analytics.messageId++; // eslint-disable-line no-param-reassign
	
	  // pack message into json
	  (true) && _Logger2.default.debug('Messages: composed message:\n ' + (0, _stringify2.default)((0, _prune2.default)(message), null, 2));
	  return (0, _cloneDeep3.default)(preparedMessage); // clone to get rid of references to model object
	}
	
	function pack(messages, modelData) {
	  // bulk message with messages from queue
	  var bulk = {
	    domain: modelData.domain,
	    customer: modelData.customer,
	    visit: modelData.visit,
	    messages: messages
	  };
	
	  // clear out empty values
	  var cleaned = (0, _prune2.default)(bulk);
	  (true) && _Logger2.default.debug('Messages: packed bulk message:\n ' + (0, _stringify2.default)(cleaned, null, 2));
	  return (0, _stringify2.default)(cleaned);
	}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setActivePlaybackFields = setActivePlaybackFields;
	exports.onBeforePlaybackSelect = onBeforePlaybackSelect;
	exports.onAfterPlaybackSelect = onAfterPlaybackSelect;
	exports.onBeforePlaybackStreamUriAcquired = onBeforePlaybackStreamUriAcquired;
	exports.onBeforePlaybackExitBeforeStart = onBeforePlaybackExitBeforeStart;
	exports.onAfterPlaybackExitBeforeStart = onAfterPlaybackExitBeforeStart;
	exports.onBeforePlaybackStart = onBeforePlaybackStart;
	exports.onBeforePlaybackStop = onBeforePlaybackStop;
	exports.onAfterPlaybackStop = onAfterPlaybackStop;
	exports.onBeforePlaybackHeartbeat = onBeforePlaybackHeartbeat;
	exports.onAfterPlaybackHeartbeat = onAfterPlaybackHeartbeat;
	exports.onBeforePlaybackBitRateUpshift = onBeforePlaybackBitRateUpshift;
	exports.onBeforePlaybackBitRateDownshift = onBeforePlaybackBitRateDownshift;
	exports.onBeforeBufferingStart = onBeforeBufferingStart;
	exports.onBeforeBufferingStop = onBeforeBufferingStop;
	exports.onAfterBufferingStop = onAfterBufferingStop;
	exports.onBeforePlaybackFailure = onBeforePlaybackFailure;
	exports.onAfterPlaybackFailure = onAfterPlaybackFailure;
	exports.onBeforeAttemptRestart = onBeforeAttemptRestart;
	exports.onBeforeSetSegment = onBeforeSetSegment;
	
	var _videoplayer = __webpack_require__(27);
	
	var _videoplayer2 = _interopRequireDefault(_videoplayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO - where to put this function
	function setActivePlaybackFields(playerState, analytics) {
	  // video position
	  analytics.model.set('state.currentVideoPosition', playerState.currentVideoPosition);
	
	  // heartBeat
	  analytics.model.set('state.playback.heartBeat.contentElapsedMs', playerState.heartBeat.contentElapsedMs);
	  analytics.model.set('state.playback.heartBeat.clockTimeElapsedMs', playerState.heartBeat.clockTimeElapsedMs);
	  analytics.model.set('state.playback.heartBeat.playPointTimestamp', playerState.heartBeat.playPointTimestamp);
	
	  // bitRate
	  analytics.model.set('state.playback.bitRate.currentBitRateBps', playerState.bitRate.currentBitRate);
	  analytics.model.set('state.playback.bitRate.contentElapsedAtCurrentBitRateMs', playerState.bitRate.contentElapsedAtCurrentBitRate);
	  analytics.model.set('state.playback.bitRate.previousBitRateBps', playerState.bitRate.previousBitRate);
	  analytics.model.set('state.playback.bitRate.contentElapsedAtPreviousBitRateMs', playerState.bitRate.contentElapsedAtPreviousBitRate);
	
	  // segment info
	  var segmentInfo = analytics.localStorage.segmentStorage;
	  if (segmentInfo) {
	    analytics.model.set('state.playback.segmentInfo', segmentInfo);
	    delete analytics.localStorage.segmentStorage; // eslint-disable-line no-param-reassign
	  }
	}
	
	function onBeforePlaybackSelect(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	
	  analytics.model.reset('state.content');
	  analytics.model.reset('state.playback');
	  analytics.model.reset('state.search');
	  delete analytics.localStorage.searchObject; // User exits Search Flow, clearing out local storage
	
	  var playbackType = data['state.content.stream.playbackType'];
	  if (playbackType !== 'vod') {
	    delete data['state.content.details.runtime'];
	  }
	
	  var position = void 0;
	  if (playbackType === 'vod') {
	    position = data['state.content.stream.bookmarkPositionSec'] || 0;
	  }
	
	  _videoplayer2.default.playbackSelect(analytics.timestamp, playbackType, position);
	
	  analytics.model.set('state.playback.playbackSelectedTimestamp', analytics.timestamp);
	  // format: visitId|playbackSelectedTimestamp
	  var playbackId = analytics.model.get('visit.visitId') + '|' + analytics.timestamp;
	  analytics.model.set('state.content.stream.playbackId', playbackId);
	}
	
	function onAfterPlaybackSelect(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.view.currentPage.elements');
	}
	
	function onBeforePlaybackStreamUriAcquired(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  if (data['operation.success'] === true) {
	    _videoplayer2.default.playbackStreamUriAcquired(analytics.timestamp);
	    analytics.model.set('state.playback.uriObtainedMs', _videoplayer2.default.getVideoPlayerState().uriObtainedMs);
	  } else {
	    delete data['state.content.stream.contentUri'];
	  }
	}
	
	function onBeforePlaybackExitBeforeStart(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onAfterPlaybackExitBeforeStart(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.content');
	  analytics.model.reset('state.playback');
	}
	
	function onBeforePlaybackStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackStart(analytics.timestamp, data['state.playback.bitRate.currentBitRateBps'], data['state.playback.heartBeat.playPointTimestamp']);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	  analytics.model.set('state.playback.tuneTimeMs', playerState.tuneTimeMs);
	  analytics.model.set('state.playback.playbackStartedTimestamp', analytics.timestamp);
	
	  // runtime
	  var playbackType = analytics.model.get('state.content.stream.playbackType');
	  if (playbackType !== 'vod') {
	    delete data['state.content.details.actualRuntime'];
	  }
	}
	
	function onBeforePlaybackStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	
	  _videoplayer2.default.playbackStop(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onAfterPlaybackStop(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.reset('state.content');
	  analytics.model.reset('state.playback');
	  analytics.model.reset('state.currentVideoPosition');
	  analytics.model.reset('state.entryVideoPosition');
	  analytics.model.reset('state.previousState.entryVideoPosition');
	  analytics.model.reset('state.previousState.exitVideoPosition');
	}
	
	function onBeforePlaybackHeartbeat(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackHeartbeat(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onAfterPlaybackHeartbeat(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.reset('state.playback.heartBeat.contentElapsedMs');
	  analytics.model.reset('state.playback.heartBeat.clockTimeElapsedMs');
	  analytics.model.reset('state.playback.heartBeat.playPointTimestamp');
	  analytics.model.reset('state.playback.segmentInfo');
	}
	
	function onBeforePlaybackBitRateUpshift(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackBitRateChange(analytics.timestamp, data['state.playback.bitRate.currentBitRateBps']);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onBeforePlaybackBitRateDownshift(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackBitRateChange(analytics.timestamp, data['state.playback.bitRate.currentBitRateBps']);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onBeforeBufferingStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.bufferingStart(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onBeforeBufferingStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = data['message.triggeredBy'] || 'application'; // for recovery
	
	  _videoplayer2.default.bufferingStop(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  analytics.model.set('state.playback.bufferingTimeMs', playerState.lastBufferingTime);
	
	  setActivePlaybackFields(playerState, analytics);
	}
	
	function onAfterBufferingStop(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.reset('state.playback.bufferingTimeMs');
	}
	
	function onBeforePlaybackFailure(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	  data['operation.success'] = false;
	  data['application.error.errorType'] = 'playback';
	  if (!data['application.error.errorCode']) {
	    data['application.error.errorCode'] = 'unknown';
	  }
	
	  _videoplayer2.default.playbackFailure(analytics.timestamp);
	
	  if (from !== 'initiating') {
	    var playerState = _videoplayer2.default.getVideoPlayerState();
	    setActivePlaybackFields(playerState, analytics);
	  }
	
	  analytics.localStorage.playbackFailureTimestamp = analytics.timestamp;
	}
	
	function onAfterPlaybackFailure(event, from, into, args) {
	  var analytics = args.analytics;
	
	  // Generate new ID after failure
	  // format: visitId|playbackFailureTimestamp
	  var playbackId = analytics.model.get('visit.visitId') + '|' + analytics.localStorage.playbackFailureTimestamp;
	  analytics.model.set('state.content.stream.playbackId', playbackId);
	  delete analytics.localStorage.playbackFailureTimestamp;
	}
	
	function onBeforeAttemptRestart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.attemptRestart(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  analytics.model.set('state.currentVideoPosition', playerState.currentVideoPosition);
	
	  // segment info
	  var segmentInfo = analytics.localStorage.segmentStorage;
	  if (segmentInfo) {
	    analytics.model.set('state.content.stream.segmentInfo', segmentInfo);
	    delete analytics.localStorage.segmentStorage;
	  }
	
	  analytics.model.set('state.playback.playbackSelectedTimestamp', analytics.timestamp);
	}
	
	function onBeforeSetSegment(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  if (data) {
	    if (!analytics.localStorage.segmentStorage) {
	      analytics.localStorage.segmentStorage = [];
	    }
	    analytics.localStorage.segmentStorage.push(data);
	  }
	}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(182);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(191);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(190);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

	module.exports = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(29);
	var TAG = __webpack_require__(4)('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};
	
	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);
	var document = __webpack_require__(3).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(29);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(37);
	var $export = __webpack_require__(2);
	var redefine = __webpack_require__(114);
	var hide = __webpack_require__(16);
	var has = __webpack_require__(19);
	var Iterators = __webpack_require__(31);
	var $iterCreate = __webpack_require__(222);
	var setToStringTag = __webpack_require__(34);
	var getPrototypeOf = __webpack_require__(109);
	var ITERATOR = __webpack_require__(4)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';
	
	var returnThis = function () { return this; };
	
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(40)('meta');
	var isObject = __webpack_require__(10);
	var has = __webpack_require__(19);
	var setDesc = __webpack_require__(8).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(18)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 25.4.1.5 NewPromiseCapability(C)
	var aFunction = __webpack_require__(28);
	
	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	}
	
	module.exports.f = function (C) {
	  return new PromiseCapability(C);
	};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(16);
	module.exports = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(68)('keys');
	var uid = __webpack_require__(40);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(3);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(10);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(3);
	var core = __webpack_require__(1);
	var LIBRARY = __webpack_require__(37);
	var wksExt = __webpack_require__(72);
	var defineProperty = __webpack_require__(8).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(4);


/***/ }),
/* 73 */
/***/ (function(module, exports) {



/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(235);
	var global = __webpack_require__(3);
	var hide = __webpack_require__(16);
	var Iterators = __webpack_require__(31);
	var TO_STRING_TAG = __webpack_require__(4)('toStringTag');
	
	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');
	
	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21),
	    root = __webpack_require__(11);
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');
	
	module.exports = Map;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(330),
	    mapCacheDelete = __webpack_require__(331),
	    mapCacheGet = __webpack_require__(332),
	    mapCacheHas = __webpack_require__(333),
	    mapCacheSet = __webpack_require__(334);
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	
	module.exports = MapCache;


/***/ }),
/* 77 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}
	
	module.exports = arrayMap;


/***/ }),
/* 78 */
/***/ (function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	module.exports = arrayPush;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(80),
	    eq = __webpack_require__(48);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignValue;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(132);
	
	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}
	
	module.exports = baseAssignValue;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(142),
	    overRest = __webpack_require__(137),
	    setToString = __webpack_require__(138);
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}
	
	module.exports = baseRest;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}
	
	module.exports = baseUnary;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	var Uint8Array = __webpack_require__(263);
	
	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}
	
	module.exports = cloneArrayBuffer;


/***/ }),
/* 84 */
/***/ (function(module, exports) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;
	
	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}
	
	module.exports = copyArray;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(136);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayFilter = __webpack_require__(269),
	    stubArray = __webpack_require__(146);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;
	
	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};
	
	module.exports = getSymbols;


/***/ }),
/* 87 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(93);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	module.exports = toKey;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(11),
	    stubFalse = __webpack_require__(359);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
	
	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;
	
	module.exports = isBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(97)(module)))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(25),
	    isObject = __webpack_require__(14);
	
	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ }),
/* 91 */
/***/ (function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(25),
	    getPrototype = __webpack_require__(85),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(25),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}
	
	module.exports = isSymbol;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(122),
	    baseKeys = __webpack_require__(285),
	    isArrayLike = __webpack_require__(50);
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	
	module.exports = keys;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var baseMerge = __webpack_require__(287),
	    createAssigner = __webpack_require__(304);
	
	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = createAssigner(function(object, source, srcIndex) {
	  baseMerge(object, source, srcIndex);
	});
	
	module.exports = merge;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	var basePick = __webpack_require__(289),
	    flatRest = __webpack_require__(306);
	
	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var pick = flatRest(function(object, paths) {
	  return object == null ? {} : basePick(object, paths);
	});
	
	module.exports = pick;


/***/ }),
/* 97 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _capitalize = __webpack_require__(163);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StateMachine = function () {
	  function StateMachine(config) {
	    (0, _classCallCheck3.default)(this, StateMachine);
	
	    this.initial = config.initial;
	    this.current = config.initial;
	    this.transitions = config.transitions;
	    this.ignored = {};
	    this.callbacks = config.callbacks;
	    this.name = config.name || 'default';
	  }
	
	  (0, _createClass3.default)(StateMachine, [{
	    key: 'trigger',
	    value: function trigger(event, args) {
	      (true) && _Logger2.default.info('StateMachine(' + this.name + '): Triggering event ' + event + ' in state ' + this.current);
	      if (!this.transitions[event]) {
	        if (true) {
	          _Logger2.default.error('StateMachine(' + this.name + '): No event ' + event + ' in configuration');
	          _Logger2.default.debug('StateMachine(' + this.name + '): Valid events are: ' + (0, _stringify2.default)((0, _keys2.default)(this.transitions)));
	          throw new Error('Invalid event');
	        } else {
	          return;
	        }
	      }
	
	      if (this.isIgnored(event)) {
	        (true) && _Logger2.default.warning('StateMachine(' + this.name + '): event ' + event + ' is ignored in the current state ' + this.current);
	        return;
	      }
	
	      if (this.cannot(event)) {
	        if (this.current === this.initial) {
	          (true) && _Logger2.default.warning('StateMachine(' + this.name + '): Unexpected event ' + event + ' received before initialization');
	        } else {
	          (true) && _Logger2.default.error('StateMachine(' + this.name + '): Unexpected event ' + event + ' received in state ' + this.current);
	          if (this.current !== 'DISABLED') {
	            (true) && _Logger2.default.error('Analytics partially disabled until the next tune');
	            this.invalidEvent(event, this.current, into, args);
	            this.current = 'DISABLED';
	          }
	        }
	        if (true) {
	          throw new Error('Invalid event');
	        }
	        return;
	      }
	
	      var from = this.current;
	      var into = this.transitions[event][from] || this.transitions[event]['*'];
	
	      if (into === '*') {
	        // Didn't transition
	        into = this.current;
	      }
	
	      (true) && from !== into && _Logger2.default.info('StateMachine(' + this.name + '): Transitioning from ' + from + ' state into ' + into + ' state');
	      if (from !== into) {
	        this.beforeLeaveState(event, from, into, args);
	      }
	
	      this.beforeEvent(event, from, into, args);
	
	      if (from !== into) {
	        this.current = into;
	        this.changeState(event, from, into, args);
	      }
	
	      this.afterEvent(event, from, into, args);
	
	      if (from !== into) {
	        this.afterEnterState(event, from, into, args);
	      }
	    }
	  }, {
	    key: 'is',
	    value: function is(state) {
	      return state === this.current;
	    }
	  }, {
	    key: 'can',
	    value: function can(event) {
	      return !!(this.transitions[event] && (this.transitions[event][this.current] || this.transitions[event]['*']));
	    }
	  }, {
	    key: 'cannot',
	    value: function cannot(event) {
	      return !this.can(event);
	    }
	  }, {
	    key: 'isIgnored',
	    value: function isIgnored(event) {
	      return this.ignored[this.current] && this.ignored[this.current].indexOf(event) !== -1;
	    }
	  }, {
	    key: 'setIgnored',
	    value: function setIgnored(rules) {
	      this.ignored = rules;
	    }
	  }, {
	    key: 'invalidEvent',
	    value: function invalidEvent(event, from, into, args) {
	      this.callbacks.onInvalidEvent && this.callbacks.onInvalidEvent(event, from, into, args);
	    }
	  }, {
	    key: 'beforeEvent',
	    value: function beforeEvent(event, from, into, args) {
	      this.beforeAnyEvent(event, from, into, args);
	      this.beforeThisEvent(event, from, into, args);
	    }
	  }, {
	    key: 'beforeAnyEvent',
	    value: function beforeAnyEvent(event, from, into, args) {
	      this.callbacks.onBeforeEvent && this.callbacks.onBeforeEvent(event, from, into, args);
	    }
	  }, {
	    key: 'beforeThisEvent',
	    value: function beforeThisEvent(event, from, into, args) {
	      var callbackName = 'onBefore' + (0, _capitalize.capitalizeFirstLetter)(event);
	      this.callbacks[callbackName] && this.callbacks[callbackName](event, from, into, args);
	    }
	  }, {
	    key: 'afterEvent',
	    value: function afterEvent(event, from, into, args) {
	      this.afterAnyEvent(event, from, into, args);
	      this.afterThisEvent(event, from, into, args);
	    }
	  }, {
	    key: 'afterAnyEvent',
	    value: function afterAnyEvent(event, from, into, args) {
	      this.callbacks.onAfterEvent && this.callbacks.onAfterEvent(event, from, into, args);
	    }
	  }, {
	    key: 'afterThisEvent',
	    value: function afterThisEvent(event, from, into, args) {
	      var callbackName = 'onAfter' + (0, _capitalize.capitalizeFirstLetter)(event);
	      this.callbacks[callbackName] && this.callbacks[callbackName](event, from, into, args);
	    }
	  }, {
	    key: 'beforeLeaveState',
	    value: function beforeLeaveState(event, from, into, args) {
	      var callbackName = 'onBeforeLeave' + (0, _capitalize.capitalizeFirstLetter)(from);
	      this.callbacks[callbackName] && this.callbacks[callbackName](event, from, into, args);
	    }
	  }, {
	    key: 'changeState',
	    value: function changeState(event, from, into, args) {
	      this.callbacks.onChangeState && this.callbacks.onChangeState(event, from, into, args);
	    }
	  }, {
	    key: 'afterEnterState',
	    value: function afterEnterState(event, from, into, args) {
	      var callbackName = 'onAfterEnter' + (0, _capitalize.capitalizeFirstLetter)(into);
	      this.callbacks[callbackName] && this.callbacks[callbackName](event, from, into, args);
	    }
	  }]);
	  return StateMachine;
	}();
	
	exports.default = StateMachine;

/***/ }),
/* 99 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = uuid;
	/* eslint-disable no-bitwise */
	function uuid() {
	  var d = new Date().getTime();
	  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
	  });
	
	  return id;
	}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(3).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(9) && !__webpack_require__(18)(function () {
	  return Object.defineProperty(__webpack_require__(59)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(31);
	var ITERATOR = __webpack_require__(4)('iterator');
	var ArrayProto = Array.prototype;
	
	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(29);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(15);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__(4)('iterator');
	var SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }
	
	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(32);
	var createDesc = __webpack_require__(33);
	var toIObject = __webpack_require__(17);
	var toPrimitive = __webpack_require__(70);
	var has = __webpack_require__(19);
	var IE8_DOM_DEFINE = __webpack_require__(101);
	var gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(9) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(110);
	var hiddenKeys = __webpack_require__(60).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(19);
	var toObject = __webpack_require__(24);
	var IE_PROTO = __webpack_require__(67)('IE_PROTO');
	var ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(19);
	var toIObject = __webpack_require__(17);
	var arrayIndexOf = __webpack_require__(211)(false);
	var IE_PROTO = __webpack_require__(67)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(2);
	var core = __webpack_require__(1);
	var fails = __webpack_require__(18);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 112 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	var newPromiseCapability = __webpack_require__(64);
	
	module.exports = function (C, x) {
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(3);
	var core = __webpack_require__(1);
	var dP = __webpack_require__(8);
	var DESCRIPTORS = __webpack_require__(9);
	var SPECIES = __webpack_require__(4)('species');
	
	module.exports = function (KEY) {
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__(15);
	var aFunction = __webpack_require__(28);
	var SPECIES = __webpack_require__(4)('species');
	module.exports = function (O, D) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__(12);
	var invoke = __webpack_require__(220);
	var html = __webpack_require__(100);
	var cel = __webpack_require__(59);
	var global = __webpack_require__(3);
	var process = global.process;
	var setTask = global.setImmediate;
	var clearTask = global.clearImmediate;
	var MessageChannel = global.MessageChannel;
	var Dispatch = global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (__webpack_require__(29)(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
	    defer = function (id) {
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in cel('script')) {
	    defer = function (id) {
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set: setTask,
	  clear: clearTask
	};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);
	module.exports = function (it, TYPE) {
	  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(57);
	var ITERATOR = __webpack_require__(4)('iterator');
	var Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(1).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ }),
/* 120 */
/***/ (function(module, exports) {

	module.exports = {"startSession":{"blank":"appInitializing"},"playbackSelect":{"initiating":"initiating","navigating":"initiating","failed":"initiating","DISABLED":"initiating","playing":"initiating","buffering":"initiating","appInitializing":"initiating","appInitialized":"initiating"},"playbackExitBeforeStart":{"initiating":"navigating"},"playbackStreamUriAcquired":{"initiating":"initiating"},"playbackStart":{"initiating":"playing","restarting":"playing"},"playbackStop":{"restarting":"navigating","playing":"navigating","buffering":"navigating","paused":"navigating"},"bufferingStart":{"playing":"buffering"},"bufferingStop":{"buffering":"playing"},"playbackPause":{"playing":"paused"},"playbackUnpause":{"paused":"playing"},"playbackFailure":{"playing":"failed","initiating":"failed","buffering":"failed"},"attemptRestart":{"failed":"restarting","restarting":"restarting"},"playbackTrickPlayStart":{"playing":"scrubbing","paused":"scrubbing","buffering":"scrubbing"},"playbackTrickPlayRateChange":{"scrubbing":"scrubbing"},"playbackTrickPlayStop":{"scrubbing":"playing"},"playbackBitRateUpshift":{"playing":"playing","scrubbing":"scrubbing","buffering":"buffering","paused":"paused"},"playbackBitRateDownshift":{"playing":"playing","scrubbing":"scrubbing","buffering":"buffering","paused":"paused"},"playbackHeartbeat":{"playing":"playing"},"loginStart":{"navigating":"authenticating","appInitializing":"authenticating"},"loginStop":{"authenticating":"navigating"},"pageView":{"appInitializing":"navigating","appInitialized":"navigating","*":"*"},"modalView":{"appInitializing":"navigating","appInitialized":"navigating","*":"*"},"selectAction":{"*":"*"},"selectContent":{"*":"*"},"searched":{"*":"*"},"searchClosed":{"*":"*"},"adBreakStart":{"playing":"playing"},"adBreakStop":{"playing":"playing"},"adStart":{"playing":"playing"},"adStop":{"playing":"playing"},"apiCall":{"*":"*"},"error":{"*":"*"},"connectionChanged":{"*":"*"},"logout":{"failed":"navigating","restarting":"navigating","initiating":"navigating","*":"*"},"inVisitOauthRefresh":{"*":"*"},"userConfigSet":{"navigating":"appInitialized"},"pinEntry":{"*":"*"},"requestToRecord":{"*":"*"},"requestToDeleteRecording":{"*":"*"},"requestToEditRecording":{"*":"*"},"requestToCancelRecording":{"*":"*"},"setVideoZone":{"*":"*"},"setAccountFeatures":{"*":"*"},"setNetworkStatus":{"*":"*"},"setExperimentConfigurations":{"*":"*"},"setAutoAccessEnabled":{"*":"*"},"setSegment":{"*":"*"},"pageViewInit":{"*":"*"},"pageViewPartiallyRendered":{"*":"*"},"purchaseStart":{"*":"*"},"purchaseStop":{"*":"*"},"applicationActivity":{"*":"*"},"checkAvailableChannels":{"*":"*"},"forcedLogin":{"*":"*"},"experimentStarted":{"*":"*"},"requestToRemind":{"*":"*"},"requestToEditReminder":{"*":"*"},"requestToDeleteReminder":{"*":"*"},"switchScreen":{"*":"*"},"setApplicationName":{"*":"*"},"displayChange":{"*":"*"},"setCpuAverageUsage":{"*":"*"},"setPlayerTestFields":{"*":"*"}}

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(42),
	    stackClear = __webpack_require__(345),
	    stackDelete = __webpack_require__(346),
	    stackGet = __webpack_require__(347),
	    stackHas = __webpack_require__(348),
	    stackSet = __webpack_require__(349);
	
	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}
	
	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	
	module.exports = Stack;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(293),
	    isArguments = __webpack_require__(49),
	    isArray = __webpack_require__(13),
	    isBuffer = __webpack_require__(89),
	    isIndex = __webpack_require__(46),
	    isTypedArray = __webpack_require__(144);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;
	
	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = arrayLikeKeys;


/***/ }),
/* 123 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array == null ? 0 : array.length;
	
	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}
	
	module.exports = arrayReduce;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(80),
	    eq = __webpack_require__(48);
	
	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignMergeValue;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(78),
	    isFlattenable = __webpack_require__(320);
	
	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;
	
	  predicate || (predicate = isFlattenable);
	  result || (result = []);
	
	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = baseFlatten;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(44),
	    toKey = __webpack_require__(88);
	
	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object);
	
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	module.exports = baseGet;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(78),
	    isArray = __webpack_require__(13);
	
	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}
	
	module.exports = baseGetAllKeys;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFindIndex = __webpack_require__(277),
	    baseIsNaN = __webpack_require__(282),
	    strictIndexOf = __webpack_require__(350);
	
	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}
	
	module.exports = baseIndexOf;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(79),
	    castPath = __webpack_require__(44),
	    isIndex = __webpack_require__(46),
	    isObject = __webpack_require__(14),
	    toKey = __webpack_require__(88);
	
	/**
	 * The base implementation of `_.set`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet(object, path, value, customizer) {
	  if (!isObject(object)) {
	    return object;
	  }
	  path = castPath(path, object);
	
	  var index = -1,
	      length = path.length,
	      lastIndex = length - 1,
	      nested = object;
	
	  while (nested != null && ++index < length) {
	    var key = toKey(path[index]),
	        newValue = value;
	
	    if (index != lastIndex) {
	      var objValue = nested[key];
	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
	      if (newValue === undefined) {
	        newValue = isObject(objValue)
	          ? objValue
	          : (isIndex(path[index + 1]) ? [] : {});
	      }
	    }
	    assignValue(nested, key, newValue);
	    nested = nested[key];
	  }
	  return object;
	}
	
	module.exports = baseSet;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(11);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
	
	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	
	  buffer.copy(result);
	  return result;
	}
	
	module.exports = cloneBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(97)(module)))

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(83);
	
	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}
	
	module.exports = cloneTypedArray;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21);
	
	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());
	
	module.exports = defineProperty;


/***/ }),
/* 133 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(78),
	    getPrototype = __webpack_require__(85),
	    getSymbols = __webpack_require__(86),
	    stubArray = __webpack_require__(146);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;
	
	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
	  var result = [];
	  while (object) {
	    arrayPush(result, getSymbols(object));
	    object = getPrototype(object);
	  }
	  return result;
	};
	
	module.exports = getSymbolsIn;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	var baseCreate = __webpack_require__(275),
	    getPrototype = __webpack_require__(85),
	    isPrototype = __webpack_require__(87);
	
	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}
	
	module.exports = initCloneObject;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(267);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = overRest;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	var baseSetToString = __webpack_require__(292),
	    shortOut = __webpack_require__(344);
	
	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);
	
	module.exports = setToString;


/***/ }),
/* 139 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	module.exports = toSource;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	var baseClone = __webpack_require__(274);
	
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_SYMBOLS_FLAG = 4;
	
	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}
	
	module.exports = cloneDeep;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(126);
	
	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}
	
	module.exports = get;


/***/ }),
/* 142 */
/***/ (function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(50),
	    isObjectLike = __webpack_require__(26);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(284),
	    baseUnary = __webpack_require__(82),
	    nodeUtil = __webpack_require__(339);
	
	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	
	module.exports = isTypedArray;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	var baseSet = __webpack_require__(129);
	
	/**
	 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
	 * it's created. Arrays are created for missing index properties while objects
	 * are created for all other missing properties. Use `_.setWith` to customize
	 * `path` creation.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.set(object, 'a[0].b.c', 4);
	 * console.log(object.a[0].b.c);
	 * // => 4
	 *
	 * _.set(object, ['x', '0', 'y', 'z'], 5);
	 * console.log(object.x[0].y.z);
	 * // => 5
	 */
	function set(object, path, value) {
	  return object == null ? object : baseSet(object, path, value);
	}
	
	module.exports = set;


/***/ }),
/* 146 */
/***/ (function(module, exports) {

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}
	
	module.exports = stubArray;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeApiCall = onBeforeApiCall;
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeApiCall(event, from, into, args) {
	  var data = args.data;
	  data['message.triggeredBy'] = 'application';
	
	  if (true) {
	    _Logger2.default.info('Callbacks::onBeforeApiCall(): API response code: ' + data['application.api.responseCode']);
	    _Logger2.default.info('Callbacks::onBeforeApiCall(): API host: ' + data['application.api.host']);
	    _Logger2.default.info('Callbacks::onBeforeApiCall(): API path: ' + data['application.api.path']);
	    _Logger2.default.info('Callbacks::onBeforeApiCall(): API query parameters: ' + data['application.api.queryParameters']);
	  }
	}

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeError = onBeforeError;
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeError(event, from, into, args) {
	  var data = args.data;
	
	  data['message.triggeredBy'] = data['message.triggeredBy'] || 'application'; // for analytics error
	  data['message.category'] = 'error';
	  data['operation.success'] = false;
	  if (!data['application.error.errorCode']) {
	    data['application.error.errorCode'] = 'unknown';
	  }
	
	  if (true) {
	    _Logger2.default.info('Callbacks::onBeforeError(): Error code: ' + data['application.error.errorCode']);
	  }
	}

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	exports.onBeforeEvent = onBeforeEvent;
	exports.onChangeState = onChangeState;
	exports.onAfterEvent = onAfterEvent;
	exports.onInvalidEvent = onInvalidEvent;
	
	var _messages = __webpack_require__(52);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeEvent(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	  var options = args.options;
	
	  if (options && options.timestamp) {
	    analytics.timestamp = options.timestamp;
	  } else {
	    analytics.timestamp = Date.now();
	  }
	
	  // reset feature object if navigation event and message.context is empty (wrong event for flow, exiting it)
	  if (analytics.currentFlow && analytics.isNavigation(event)) {
	    if (!data['message.context']) {
	      analytics.model.reset('message.feature');
	      delete analytics.currentFlow; // end of flow
	    }
	  }
	
	  if (data['message.context']) {
	    if (analytics.currentFlow !== data['message.context']) {
	      analytics.currentFlow = data['message.context']; // begin new flow
	
	      // generate new transactionId
	      var transactionId = analytics.model.get('visit.visitId') + '|' + analytics.timestamp;
	      data['message.feature.transactionId'] = transactionId;
	    }
	
	    var newFeatureStepName = data['message.feature.featureStepName'];
	
	    if (newFeatureStepName) {
	      // set flag to true if feature step name changed
	      var oldFeatureStepName = analytics.model.get('message.feature.featureStepName');
	      if (oldFeatureStepName !== newFeatureStepName) {
	        data['message.feature.featureStepChanged'] = true;
	      }
	
	      // append latest step name to array
	      var completedSteps = analytics.model.get('message.feature.completedSteps') || [];
	      completedSteps.push(newFeatureStepName);
	      analytics.model.set('message.feature.completedSteps', completedSteps);
	    }
	  }
	}
	
	// actual transition
	function onChangeState(event, from, into, args) {
	  var analytics = args.analytics;
	
	  var previousState = analytics.model.get('state.name');
	
	  if (previousState) {
	    analytics.model.set('state.previousState.name', previousState);
	    analytics.model.set('state.previousState.entryTimestamp', analytics.model.get('state.entryTimestamp'));
	    analytics.model.set('state.previousState.exitTimestamp', analytics.timestamp);
	  }
	
	  analytics.model.set('state.name', analytics.sm.current);
	  analytics.model.set('state.entryTimestamp', analytics.timestamp);
	}
	
	function onAfterEvent(event, from, into, args) {
	  var data = args.data;
	  var options = args.options;
	  var analytics = args.analytics;
	
	  if (!options.noBatchSet) {
	    analytics.model.batchSet(data); // save prepared data into the model
	  }
	
	  // Handle only real events
	  if (!options.isFakeEvent) {
	    var message = (0, _messages.compose)(event, args.data, analytics.model.getData(), analytics); // create a JSON string from one event
	    analytics.queue.push(message);
	
	    if (analytics.flushedEvents.has(event)) {
	      analytics.queue.flush();
	    }
	
	    analytics.model.reset('application');
	    analytics.model.reset('operation');
	    var feature = analytics.model.get('message.feature');
	    analytics.model.reset('message');
	
	    if (analytics.currentFlow) {
	      if (!analytics.isNavigation(event) || data['message.context'] && analytics.currentFlow === data['message.context']) {
	        analytics.model.set('message.feature', feature); // restore feature
	        analytics.model.set('message.feature.featureStepChanged', false);
	      }
	    }
	
	    delete analytics.timestamp;
	  }
	  analytics.saveState();
	}
	
	function onInvalidEvent(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	
	  analytics.heartBeatTimer.stop();
	  analytics.track('error', { // TODO: maybe do something about paths here
	    'message.category': 'error',
	    'message.triggeredBy': 'analytics',
	    'application.error.errorType': 'analytics',
	    'application.error.errorMessage': 'Unexpected event ' + event + ' received in state ' + from + '. Analytics partially disabled until the next tune',
	    'application.error.errorExtras': { inputData: (0, _stringify2.default)(data) },
	    'operation.success': false
	  });
	}

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(54);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _api = __webpack_require__(147);
	
	var api = _interopRequireWildcard(_api);
	
	var _error = __webpack_require__(148);
	
	var error = _interopRequireWildcard(_error);
	
	var _general = __webpack_require__(149);
	
	var general = _interopRequireWildcard(_general);
	
	var _login = __webpack_require__(151);
	
	var login = _interopRequireWildcard(_login);
	
	var _navigation = __webpack_require__(152);
	
	var navigation = _interopRequireWildcard(_navigation);
	
	var _search = __webpack_require__(153);
	
	var search = _interopRequireWildcard(_search);
	
	var _select = __webpack_require__(154);
	
	var select = _interopRequireWildcard(_select);
	
	var _session = __webpack_require__(155);
	
	var session = _interopRequireWildcard(_session);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _extends3.default)({}, api, error, general, login, navigation, search, select, session);

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _merge2 = __webpack_require__(95);
	
	var _merge3 = _interopRequireDefault(_merge2);
	
	exports.onBeforeLoginStart = onBeforeLoginStart;
	exports.onBeforeLoginStop = onBeforeLoginStop;
	exports.onAfterLoginStop = onAfterLoginStop;
	exports.onBeforeLogout = onBeforeLogout;
	exports.onAfterLogout = onAfterLogout;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeLoginStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'authentication';
	  if (data['operation.operationType'] === 'manualAuth') {
	    data['message.triggeredBy'] = 'user';
	    data['operation.userEntry.entryType'] = 'username';
	  } else {
	    data['message.triggeredBy'] = 'application';
	  }
	  var failedAttempts = analytics.model.get('visit.login.failedAttempts');
	  data['visit.login.failedAttempts'] = failedAttempts || 0;
	
	  // TODO: deal with localstorage
	  analytics.localStorage.loginStartTimestamp = analytics.timestamp;
	
	  // TODO maybe find a way not to save fields 1 by 1
	  analytics.localStorage.operation = {
	    'operation.operationType': data['operation.operationType'],
	    'operation.userEntry.text': data['operation.userEntry.text'],
	    'operation.userEntry.entryType': data['operation.userEntry.entryType']
	  };
	}
	
	function onBeforeLoginStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'authentication';
	  data['message.triggeredBy'] = 'application';
	
	  analytics.localStorage.oAuthToken = data.oAuthToken;
	  delete data.oAuthToken; // TODO: improve
	
	  data['visit.login.loginCompletedTimestamp'] = analytics.timestamp;
	  var loginStartTimestamp = analytics.localStorage.loginStartTimestamp;
	  var loginDurationMs = data['visit.login.loginCompletedTimestamp'] - loginStartTimestamp;
	  data['visit.login.loginDurationMs'] = loginDurationMs;
	
	  if (analytics.localStorage.operation) {
	    (0, _merge3.default)(data, analytics.localStorage.operation);
	  }
	
	  if (data['operation.success'] === false) {
	    var failedAttempts = analytics.model.get('visit.login.failedAttempts');
	    data['visit.login.failedAttempts'] = failedAttempts + 1;
	  }
	}
	
	function onAfterLoginStop(event, from, into, args) {
	  var analytics = args.analytics;
	  delete analytics.localStorage.operation;
	}
	
	function onBeforeLogout(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'authentication';
	  data['message.triggeredBy'] = 'user';
	  data['operation.operationType'] = 'logout';
	}
	
	function onAfterLogout(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.reset('visit.login');
	  analytics.model.set('visit.login.failedAttempts', 0);
	  delete analytics.localStorage.loginStartTimestamp;
	  delete analytics.localStorage.oAuthToken;
	}

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _merge2 = __webpack_require__(95);
	
	var _merge3 = _interopRequireDefault(_merge2);
	
	exports.onBeforePageViewInit = onBeforePageViewInit;
	exports.onBeforePageViewPartiallyRendered = onBeforePageViewPartiallyRendered;
	exports.onBeforePageView = onBeforePageView;
	exports.onBeforeModalView = onBeforeModalView;
	exports.onAfterModalView = onAfterModalView;
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforePageViewInit(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  analytics.localStorage.pageViewTriggeredBy = data['message.triggeredBy'];
	  analytics.localStorage.pageViewContext = data['message.context'];
	  // We don't actually want to set this into the model
	  delete data['message.triggeredBy'];
	  delete data['message.context'];
	
	  var currentSequenceNumber = analytics.model.get('state.view.currentPage.pageSequenceNumber');
	  var nextSequenceNumber = typeof currentSequenceNumber !== 'undefined' ? currentSequenceNumber + 1 : 0;
	
	  data['state.view.currentPage.pageSequenceNumber'] = nextSequenceNumber;
	  data['state.view.currentPage.renderDetails.renderInitTimestamp'] = analytics.timestamp;
	  data['state.view.currentPage.renderDetails.viewRenderedStatus'] = 'noRender';
	
	  // TODO: improve this
	  var pageViewedTime = void 0;
	  var renderInitTimestamp = analytics.model.get('state.view.currentPage.renderDetails.renderInitTimestamp');
	  if (renderInitTimestamp) {
	    pageViewedTime = analytics.timestamp - renderInitTimestamp;
	  }
	
	  // Transition between pages
	
	  // reset first in case we're missing some fields and some fields might not get overwritten
	  analytics.model.reset('state.view.previousPage');
	
	  // set currentPage to previousPage and remove fields that are not present in the specs
	  analytics.model.set('state.view.previousPage', analytics.model.get('state.view.currentPage'));
	  analytics.model.reset('state.view.previousPage.channelLineup');
	  analytics.model.reset('state.view.previousPage.elements');
	  analytics.model.reset('state.view.previousPage.navigation');
	  analytics.model.reset('state.view.previousPage.renderDetails');
	
	  analytics.model.reset('state.view.currentPage');
	
	  pageViewedTime && analytics.model.set('state.view.previousPage.pageViewedTimeMs', pageViewedTime);
	
	  if (true) {
	    _Logger2.default.info('Callbacks::onBeforePageViewInit(): Current page name: ' + data['state.view.currentPage.pageName']);
	    _Logger2.default.info('Callbacks::onBeforePageViewInit(): Application section: ' + data['state.view.currentPage.appSection']);
	  }
	}
	
	function onBeforePageViewPartiallyRendered(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  var duration = analytics.timestamp - analytics.model.get('state.view.currentPage.renderDetails.renderInitTimestamp');
	
	  data['state.view.currentPage.renderDetails.partialRenderedMs'] = duration;
	  data['state.view.currentPage.renderDetails.partialRenderedTimestamp'] = analytics.timestamp;
	  data['state.view.currentPage.renderDetails.viewRenderedStatus'] = 'partial';
	}
	
	function onBeforePageView(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'navigation';
	  data['message.triggeredBy'] = analytics.localStorage.pageViewTriggeredBy;
	
	  var viewRenderedStatus = data['state.view.currentPage.renderDetails.viewRenderedStatus'];
	
	  if (viewRenderedStatus === 'complete') {
	    var duration = analytics.timestamp - analytics.model.get('state.view.currentPage.renderDetails.renderInitTimestamp');
	    data['state.view.currentPage.renderDetails.fullyRenderedTimestamp'] = analytics.timestamp;
	    data['state.view.currentPage.renderDetails.fullyRenderedMs'] = duration;
	
	    var isLazyLoad = analytics.model.get('state.view.currentPage.renderDetails.isLazyLoad');
	    var hasPartial = analytics.model.get('state.view.currentPage.renderDetails.partialRenderedTimestamp') || analytics.model.get('state.view.currentPage.renderDetails.partialRenderedMs');
	    if (!isLazyLoad || !hasPartial) {
	      data['state.view.currentPage.renderDetails.partialRenderedTimestamp'] = analytics.timestamp;
	      data['state.view.currentPage.renderDetails.partialRenderedMs'] = duration;
	    }
	  }
	
	  // TODO: re-work this for more generic use
	  var currentPageName = analytics.model.get('state.view.currentPage.pageName'); // Search Flow: to get currentPage name
	  // 'Search Flow: check for current page, if user returns to search page after curated result page, use saved search object from local storage
	  if (currentPageName === 'search' && analytics.localStorage.searchObject) {
	    var searchObject = analytics.localStorage.searchObject;
	    (0, _merge3.default)(data, searchObject);
	  }
	}
	
	function onBeforeModalView(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'navigation';
	
	  if (true) {
	    _Logger2.default.info('Callbacks::onBeforeModalView(): Modal name: ' + data['state.view.modal.name']);
	  }
	}
	
	function onAfterModalView(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.view.modal');
	}

/***/ }),
/* 153 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeSearched = onBeforeSearched;
	exports.onBeforeSearchClosed = onBeforeSearchClosed;
	exports.onAfterSearchClosed = onAfterSearchClosed;
	function onBeforeSearched(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'search';
	  data['operation.operationType'] = 'searchEntered';
	
	  var currentPageName = analytics.model.get('state.view.currentPage.pageName');
	  // Search Flow: save the search data in the local storage from search page.
	  // TODO: re-work this to more generic use, e.g. pageStorage[model.currentPage].data
	  if (currentPageName === 'search') {
	    analytics.localStorage.searchObject = { // TODO: improve so we don't do this 1 by 1
	      'state.search.numberOfSearchResults': data['state.search.numberOfSearchResults'],
	      'state.search.selectedResultName': data['state.search.selectedResultName'],
	      'state.search.selectedResultFacet': data['state.search.selectedResultFacet'],
	      'state.search.text': data['state.search.text'],
	      'state.search.searchType': data['state.search.searchType'],
	      'state.search.results': data['state.search.results'],
	      'state.search.resultsMs': data['state.search.resultsMs'],
	      'state.search.queryId': data['state.search.queryId'],
	      'state.search.searchId': data['state.search.searchId']
	    };
	  }
	}
	
	function onBeforeSearchClosed(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'search';
	  data['message.triggeredBy'] = 'user';
	
	  var searchId = analytics.model.get('state.search.searchId');
	
	  analytics.model.reset('state.search');
	  delete analytics.localStorage.searchObject; // User exits Search Flow, clearing out local storage
	
	  analytics.model.set('state.search.searchId', searchId);
	  analytics.model.set('operation.operationType', 'searchClosed');
	}
	
	function onAfterSearchClosed(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.search.searchId');
	}

/***/ }),
/* 154 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeSelectAction = onBeforeSelectAction;
	exports.onAfterSelectAction = onAfterSelectAction;
	function onBeforeSelectAction(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	
	  if (data['operation.userPreferencesSelections'] || data['operation.userPreferenceCategory']) {
	    analytics.localStorage.preferences = {
	      'operation.userPreferencesSelections': data['operation.userPreferencesSelections'],
	      'operation.userPreferenceCategory': data['operation.userPreferenceCategory']
	    };
	  }
	}
	
	function onAfterSelectAction(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.view.currentPage.elements');
	  analytics.model.reset('state.view.modal');
	}

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeStartSession = onBeforeStartSession;
	exports.onBeforeUserConfigSet = onBeforeUserConfigSet;
	
	var _uuid = __webpack_require__(99);
	
	var _uuid2 = _interopRequireDefault(_uuid);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeStartSession(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'application';
	  data['message.triggeredBy'] = 'user';
	
	  // TODO: improve default value handling logic
	  !data['visit.visitId'] && analytics.model.set('visit.visitId', (0, _uuid2.default)());
	  !data['visit.connection.connectionType'] && analytics.model.set('visit.connection.connectionType', 'unknown');
	
	  analytics.model.set('visit.visitStartTimestamp', analytics.timestamp);
	  analytics.model.set('visit.applicationDetails.venonaVersion', analytics.libraryVersion);
	  analytics.model.set('visit.applicationDetails.venonaRequirementsVersion', analytics.venonaRequirementsVersion);
	
	  if (true) {
	    var visitId = analytics.model.get('visit.visitId') || data['visit.visitId'];
	    _Logger2.default.info('Callbacks::onBeforeStartSession(): Current visit ID: ' + visitId);
	  }
	}
	
	function onBeforeUserConfigSet(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'application';
	  data['message.triggeredBy'] = 'application';
	}

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _set = __webpack_require__(189);
	
	var _set2 = _interopRequireDefault(_set);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _pick2 = __webpack_require__(96);
	
	var _pick3 = _interopRequireDefault(_pick2);
	
	var _StateMachine = __webpack_require__(98);
	
	var _StateMachine2 = _interopRequireDefault(_StateMachine);
	
	var _model = __webpack_require__(158);
	
	var _model2 = _interopRequireDefault(_model);
	
	var _MessageQueue = __webpack_require__(159);
	
	var _MessageQueue2 = _interopRequireDefault(_MessageQueue);
	
	var _messages = __webpack_require__(52);
	
	var _post = __webpack_require__(164);
	
	var _post2 = _interopRequireDefault(_post);
	
	var _Timer = __webpack_require__(160);
	
	var _Timer2 = _interopRequireDefault(_Timer);
	
	var _Validator = __webpack_require__(161);
	
	var _Validator2 = _interopRequireDefault(_Validator);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	var _Transitions = __webpack_require__(120);
	
	var _Transitions2 = _interopRequireDefault(_Transitions);
	
	var _Categories = __webpack_require__(254);
	
	var _Categories2 = _interopRequireDefault(_Categories);
	
	var _FlushedEvents = __webpack_require__(255);
	
	var _FlushedEvents2 = _interopRequireDefault(_FlushedEvents);
	
	var _LocalStorage = __webpack_require__(166);
	
	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var AnalyticsCore = function () {
	  function AnalyticsCore(callbacks, map, specs) {
	    var _this = this;
	
	    (0, _classCallCheck3.default)(this, AnalyticsCore);
	
	    this.eventChecks = specs.checks;
	    this.eventFields = specs.fields;
	    this.fieldMapping = map;
	    this.venonaRequirementsVersion = specs.version;
	    this.flushedEvents = new _set2.default(_FlushedEvents2.default);
	
	    this.currentFlow = undefined;
	
	    this.settings = {
	      endpoint: 'https://v-collector.dp-bkp.prd-aws.charter.net/api/collector', // collector endpoint
	      sendInterval: 10000, // timer for periodically sending messages
	      maxMessageSize: 5000, // maximum message size
	      heartBeatInterval: 60000, // heartBeat timer // TODO: extract heartbeat stuff somehow
	      maxBulkQueueSize: 50, // max unsent bulk messages
	      bulkMessageTTL: 1800000, // time to live for messages in bulk queue
	      validation: false, // API field validation enabled
	      filterFields: true, // filter out fields from messages
	      storageDuration: 1800000, // TTL of data saved in storage
	      backgroundedVisitTTL: 1800000, // Time after which restoring a foregrounded app will create a new visit ID
	      isOnline: true // is application currently online
	    };
	
	    this.onSetCallbacks = {
	      maxMessageSize: function maxMessageSize(value) {
	        return _this.queue.setMaxSize(value);
	      },
	      isOnline: function isOnline(value, oldValue) {
	        return _this.connectionChanged(value, oldValue);
	      }
	    };
	
	    this.libraryVersion = ("5.11.0");
	
	    this.sm = new _StateMachine2.default({
	      initial: 'blank',
	      callbacks: callbacks,
	      transitions: _Transitions2.default,
	      name: 'Core'
	    });
	
	    this.queue = new _MessageQueue2.default(this.settings.maxMessageSize, this.sendMessages.bind(this));
	    this.bulkQueue = [];
	
	    this.model = new _model2.default();
	
	    this.validator = new _Validator2.default(this.eventChecks, this.model, this.fieldMapping);
	
	    this.localStorage = {};
	
	    this.timestamp = undefined;
	    this.messageId = 0;
	
	    this.sendTimer = new _Timer2.default(function () {
	      (true) && _Logger2.default.debug('Core: triggering flush timer');
	      _this.queue.flush();
	    }, this.settings.sendInterval);
	
	    this.heartBeatTimer = new _Timer2.default(function () {
	      // TODO: maybe extract this?
	      (true) && _Logger2.default.debug('Core: triggering heartbeat timer');
	      _this.track('playbackHeartbeat');
	    }, this.settings.heartBeatInterval);
	
	    this.features = {
	      playback: true,
	      login: true,
	      navigation: true,
	      select: true,
	      search: true,
	      ads: true,
	      error: true,
	      api: true
	    };
	  }
	
	  (0, _createClass3.default)(AnalyticsCore, [{
	    key: 'get',
	    value: function get(param) {
	      return this.settings[param];
	    }
	  }, {
	    key: 'set',
	    value: function set(param, value) {
	      var oldValue = this.settings[param];
	      this.settings[param] = value;
	      this.onSetCallbacks[param] && this.onSetCallbacks[param](value, oldValue);
	    }
	  }, {
	    key: 'setFeatures',
	    value: function setFeatures(conf) {
	      var _this2 = this;
	
	      (0, _keys2.default)(conf).forEach(function (key) {
	        typeof _this2.features[key] !== 'undefined' && (_this2.features[key] = conf[key]);
	      });
	    }
	  }, {
	    key: 'isDisabled',
	    value: function isDisabled(event) {
	      var category = _Categories2.default[event];
	      return this.features[category] === false;
	    }
	  }, {
	    key: 'connectionChanged',
	    value: function connectionChanged(isOnline, wasOnline) {
	      if (!wasOnline && isOnline) {
	        (true) && _Logger2.default.info('Core: connection restored, triggering send');
	        this.sendBulkMessages();
	      }
	    }
	  }, {
	    key: 'commonEvent',
	    value: function commonEvent(event, data, options) {
	      (true) && _Logger2.default.info('Core:: ' + event);
	      (true) && _Logger2.default.debug('Core: received data:\n' + (0, _stringify2.default)(data, null, 2));
	      var sanitized = this.check(event, data);
	      var fields = this.prepareFields(event, sanitized);
	      (true) && _Logger2.default.debug('Core: prepared data:\n' + (0, _stringify2.default)(fields, null, 2));
	      this.track(event, fields, options);
	    }
	  }, {
	    key: 'track',
	    value: function track(event) {
	      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	      (true) && _Logger2.default.info('Core: tracking event ' + event);
	      if (!this.isDisabled(event)) {
	        this.sm.trigger(event, { data: data, options: options, analytics: this });
	      } else {
	        (true) && _Logger2.default.warning('Core: feature ' + _Categories2.default[event] + ' is disabled');
	      }
	    }
	  }, {
	    key: 'sendMessages',
	    value: function sendMessages(messages) {
	      // reset timer
	      this.sendTimer.start();
	      if (messages.length === 0) {
	        (true) && _Logger2.default.warning('Core: tried to send bulk message with no events');
	        return;
	      }
	
	      (true) && _Logger2.default.info('Core: preparing bulk message to send');
	      // generate a new bulk message
	      var bulkMessage = (0, _messages.pack)(messages, this.model.getData());
	      if (this.bulkQueue.length > this.settings.maxBulkQueueSize - 1) {
	        this.bulkQueue.shift();
	      }
	      this.bulkQueue.push({
	        data: bulkMessage,
	        timestamp: Date.now()
	      });
	
	      this.sendBulkMessages();
	    }
	  }, {
	    key: 'sendBulkMessages',
	    value: function sendBulkMessages() {
	      var _this3 = this;
	
	      // send prepared bulk messages to the endpoint
	      if (this.settings.isOnline) {
	        (true) && _Logger2.default.info('Core: ' + this.bulkQueue.length + ' bulk messages in queue');
	        var now = Date.now();
	        this.bulkQueue.forEach(function (msg) {
	          if (now - msg.timestamp <= _this3.settings.bulkMessageTTL) {
	            (true) && _Logger2.default.info('Core: sending bulk message to ' + _this3.settings.endpoint);
	            (0, _post2.default)(_this3.settings.endpoint, msg.data, _this3.localStorage.oAuthToken).catch(function () {
	              // We don't handle failed requests for now
	            });
	          } else {
	            (true) && _Logger2.default.warning('Core: bulk message expired, discarding');
	          }
	        });
	
	        this.bulkQueue = [];
	      } else {
	        (true) && _Logger2.default.warning('Core: Connection state set to false, skipping send');
	      }
	    }
	  }, {
	    key: 'check',
	    value: function check(event, data, options) {
	      if (this.settings.validation) {
	        if (true) {
	          _Logger2.default.info('Core: validating data for event ' + event);
	          var result = this.validator.validate(event, data, options);
	          if (result.warnings.length) {
	            _Logger2.default.warning('Core: validation warnings:\n' + result.warnings.join('\n'));
	          }
	          if (result.errors.length) {
	            _Logger2.default.error('Core: validation failed:\n' + result.errors.join('\n'));
	            throw new Error('Validation failed');
	          }
	          return result.sanitized;
	        }
	        _Logger2.default.warning('Validation will not work in production build');
	      }
	      return data;
	    }
	  }, {
	    key: 'isPlayback',
	    value: function isPlayback(event) {
	      return _Categories2.default[event] && (_Categories2.default[event] === 'playback' || _Categories2.default[event] === 'ad');
	    }
	  }, {
	    key: 'isNavigation',
	    value: function isNavigation(event) {
	      return _Categories2.default[event] && (_Categories2.default[event] === 'navigation' || _Categories2.default[event] === 'select');
	    }
	  }, {
	    key: 'prepareFields',
	    value: function prepareFields(event, fields) {
	      var eventMap = this.fieldMapping[event];
	      var paths = (0, _keys2.default)(eventMap);
	      /* eslint-disable no-param-reassign */
	      var data = paths.reduce(function (result, path) {
	        if (fields[eventMap[path]] !== undefined) {
	          result[path] = fields[eventMap[path]];
	        }
	        return result;
	      }, {});
	      return data;
	    }
	  }, {
	    key: 'useDefaultStorage',
	    value: function useDefaultStorage() {
	      this.storage = new _LocalStorage2.default();
	    }
	  }, {
	    key: 'setStorage',
	    value: function setStorage(storageObj) {
	      (true) && this.checkStorage(storageObj);
	      this.storage = storageObj;
	    }
	  }, {
	    key: 'removeStorage',
	    value: function removeStorage() {
	      delete this.storage;
	    }
	  }, {
	    key: 'checkStorage',
	    value: function checkStorage(storageObj) {
	      (true) && _Logger2.default.info('Core: checking provided storage object');
	      var testKey = 'key-' + Date.now();
	      var testValue = 'value-' + Date.now();
	      storageObj.set(testKey, testValue);
	      if (storageObj.get(testKey) !== testValue) {
	        throw new Error('Core: provided storage object API not working');
	      }
	      storageObj.reset(testKey);
	      if (storageObj.get(testKey) !== null) {
	        throw new Error('Core: provided storage object API not working');
	      }
	    }
	  }, {
	    key: 'getPersistedState',
	    value: function getPersistedState() {
	      var allModelData = this.model.getData();
	      var filteredModel = (0, _pick3.default)(allModelData, [// keep only relevant fields for persisting
	      'domain', 'customer', 'visit', 'state.previousState', 'state.view', 'state.name', 'state.entryTimestamp']);
	      filteredModel.state.name = 'navigating'; // reset state
	
	      return (0, _stringify2.default)({
	        model: filteredModel,
	        settings: this.settings,
	        features: this.features,
	        sm: {
	          current: 'navigating',
	          ignored: this.sm.ignored
	        },
	        messageQueue: {
	          buffer: this.queue.buffer,
	          currentSize: this.queue.currentSize
	        },
	        bulkQueue: this.bulkQueue,
	        localStorage: this.localStorage,
	        messageId: this.messageId
	      });
	    }
	  }, {
	    key: 'saveState',
	    value: function saveState() {
	      if (this.storage) {
	        this.storage.set('library-state', this.getPersistedState(), this.settings.storageDuration);
	      }
	    }
	  }, {
	    key: 'getStoredState',
	    value: function getStoredState() {
	      return this.storage && this.storage.get('library-state');
	    }
	  }, {
	    key: 'loadPersistedState',
	    value: function loadPersistedState(savedState) {
	      var state = JSON.parse(savedState);
	
	      this.settings = state.settings;
	      this.features = state.features;
	
	      this.sm.current = state.sm.current;
	      this.sm.setIgnored(state.sm.ignored);
	
	      this.queue.maxSize = state.settings.maxMessageSize;
	      this.queue.buffer = state.messageQueue.buffer;
	      this.queue.currentSize = state.messageQueue.currentSize;
	
	      this.bulkQueue = state.bulkQueue;
	      this.localStorage = state.localStorage;
	      this.messageId = state.messageId;
	
	      this.model.data = state.model;
	    }
	  }]);
	  return AnalyticsCore;
	}();
	
	exports.default = AnalyticsCore;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(54);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _toConsumableArray2 = __webpack_require__(194);
	
	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _isPlainObject = __webpack_require__(92);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _AnalyticsCore = __webpack_require__(156);
	
	var _AnalyticsCore2 = _interopRequireDefault(_AnalyticsCore);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Common analytics API's
	 * @typicalname analytics
	 * @private
	*/
	var BaseAnalytics = function () {
	  function BaseAnalytics(callbacks, map, specs) {
	    (0, _classCallCheck3.default)(this, BaseAnalytics);
	
	    this.core = new _AnalyticsCore2.default(callbacks, map, specs);
	    this.log = _Logger2.default;
	  }
	
	  /**
	  * Fetch parameter value from library settings
	  * @param {string} param - parameter name
	  * @returns {string|int} parameter value
	  */
	
	
	  (0, _createClass3.default)(BaseAnalytics, [{
	    key: 'get',
	    value: function get(param) {
	      (true) && _Logger2.default.info('API: get');
	      (true) && _Logger2.default.debug('API: ' + param + ' is equal to ' + this.core.get(param));
	      return this.core.get(param);
	    }
	
	    /**
	    * Set parameter value to library settings
	    * @param {string} param - parameter name
	    * @param {string} value - parameter value
	    */
	
	  }, {
	    key: 'set',
	    value: function set(param, value) {
	      (true) && _Logger2.default.info('API: set');
	      (true) && _Logger2.default.debug('API: setting ' + param + ' to ' + value);
	      this.core.set(param, value);
	    }
	
	    /**
	    * Enable or disable certain analytics features
	    * @param {object.<string, bool>} config
	    * @example setFeatures({ playback: true, login: true, navigation: true, select: false, search: false, ad: true, error: true, api: true })
	    */
	
	  }, {
	    key: 'setFeatures',
	    value: function setFeatures(config) {
	      (true) && _Logger2.default.info('API: setFeatures');
	      (true) && _Logger2.default.debug('API: setting features ' + (0, _stringify2.default)(config));
	      this.core.setFeatures(config);
	    }
	
	    /**
	    * Set rules for ignoring events in certain states
	    * @param {object.<string, string[]>} rules
	    * @example addIgnoredEvents({ scrubbing: ['playbackPause'] })
	    * @returns {bool} shows if rules were successfuly set
	    */
	
	  }, {
	    key: 'addIgnoredEvents',
	    value: function addIgnoredEvents(rules) {
	      (true) && _Logger2.default.info('API: addIgnoredEvents');
	      if ((0, _isPlainObject2.default)(rules) && (0, _keys2.default)(rules).every(function (stateName) {
	        return Array.isArray(rules[stateName]) && rules[stateName].every(function (event) {
	          return typeof event === 'string';
	        });
	      })) {
	        (true) && _Logger2.default.debug('API: adding ignore rules ' + (0, _stringify2.default)(rules));
	        this.core.sm.setIgnored(rules);
	        return true;
	      }
	      (true) && _Logger2.default.warning('API: Invalid config for ignored events - ' + (0, _stringify2.default)(rules));
	      return false;
	    }
	
	    /**
	    * Get list of events after which the message queue is flushed
	    * @returns {array} list of events
	    */
	
	  }, {
	    key: 'getFlushedEvents',
	    value: function getFlushedEvents() {
	      (true) && _Logger2.default.info('API: getFlushedEvents');
	      return [].concat((0, _toConsumableArray3.default)(this.core.flushedEvents));
	    }
	
	    /**
	    * Add events that will trigger an automatic flush
	    * @param {array|string} list of events or single event
	    */
	
	  }, {
	    key: 'addFlushedEvents',
	    value: function addFlushedEvents() {
	      var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	      (true) && _Logger2.default.info('API: addFlushedEvents');
	      (true) && _Logger2.default.debug('API: adding flushed events ' + (0, _stringify2.default)(events));
	      if (typeof events === 'string') {
	        this.core.flushedEvents.add(events);
	      } else if (Array.isArray(events) && events.every(function (item) {
	        return typeof item === 'string';
	      })) {
	        this.core.flushedEvents = [].concat((0, _toConsumableArray3.default)(this.core.flushedEvents), (0, _toConsumableArray3.default)(events));
	      }
	    }
	
	    /**
	    * Get the current state from the state machine
	    * @returns {string} current state
	    */
	
	  }, {
	    key: 'getCurrentLibraryState',
	    value: function getCurrentLibraryState() {
	      (true) && _Logger2.default.info('API: getCurrentLibraryState');
	      return this.core.sm.current;
	    }
	
	    /**
	    * Get the current visitId
	    * @returns {string} visitId
	    */
	
	  }, {
	    key: 'getVisitId',
	    value: function getVisitId() {
	      (true) && _Logger2.default.info('API: getVisitId');
	      return this.core.model.get('visit.visitId');
	    }
	
	    /**
	    * Force flush the message queue
	    */
	
	  }, {
	    key: 'flush',
	    value: function flush() {
	      (true) && _Logger2.default.info('API: flush');
	      this.core.queue.flush();
	    }
	
	    /**
	    * Use default localStorage based storage
	    */
	
	  }, {
	    key: 'useDefaultStorage',
	    value: function useDefaultStorage() {
	      (true) && _Logger2.default.info('API: useDefaultStorage');
	      this.core.useDefaultStorage();
	    }
	
	    /**
	    * Add persistent storage object to library
	    * @param {object} storage object that provides persistence API
	    * @throws {Error} Will throw an error in development mode if storage API's are not working
	    */
	
	  }, {
	    key: 'setStorage',
	    value: function setStorage(storageObj) {
	      (true) && _Logger2.default.info('API: setStorage');
	      this.core.setStorage(storageObj);
	    }
	
	    /**
	    * Remove persistent storage object from library
	    */
	
	  }, {
	    key: 'removeStorage',
	    value: function removeStorage() {
	      (true) && _Logger2.default.info('API: removeStorage');
	      this.core.removeStorage();
	    }
	  }, {
	    key: 'restartFlow',
	    value: function restartFlow() {
	      delete this.core.currentFlow;
	      this.core.model.reset('message.feature');
	    }
	
	    /**
	    * Initialize library and track startSession event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'init',
	    value: function init(fields, options) {
	      (true) && _Logger2.default.info('API: init');
	      var savedState = this.core.getStoredState();
	
	      if (savedState) {
	        // Resume session
	        (true) && _Logger2.default.info('API: resumeSession');
	        this.core.loadPersistedState(savedState);
	        // this.track('resumeSession');  // Track resume event when it's implemented
	      } else {
	        this.core.commonEvent('startSession', fields, options);
	      }
	      this.core.sendTimer.start();
	    }
	
	    /**
	    * Track loginStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'loginStart',
	    value: function loginStart(fields, options) {
	      this.core.commonEvent('loginStart', fields, options);
	    }
	
	    /**
	    * Track loginStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'loginStop',
	    value: function loginStop(fields, options) {
	      this.core.commonEvent('loginStop', fields, options);
	    }
	
	    /**
	    * Track logout event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'logout',
	    value: function logout(fields, options) {
	      (true) && _Logger2.default.info('API: logout');
	      this.core.track('logout', {}, options);
	    }
	
	    /**
	    * Track userConfigSet event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'userConfigSet',
	    value: function userConfigSet() {
	      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var options = arguments[1];
	
	      this.core.commonEvent('userConfigSet', fields, options);
	    }
	
	    /**
	    * Track selectAction event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'selectAction',
	    value: function selectAction(fields, options) {
	      this.core.commonEvent('selectAction', fields, options);
	    }
	
	    /**
	    * Track apiCall event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'apiCall',
	    value: function apiCall(fields, options) {
	      this.core.commonEvent('apiCall', fields, options);
	    }
	
	    /**
	    * Track error event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'error',
	    value: function error(fields, options) {
	      this.core.commonEvent('error', fields, options);
	    }
	
	    /**
	    * Track searched event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'searched',
	    value: function searched(fields, options) {
	      this.core.commonEvent('searched', fields, options);
	    }
	
	    /**
	    * Track searchClosed event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'searchClosed',
	    value: function searchClosed(fields, options) {
	      (true) && _Logger2.default.info('API: searchClosed');
	      this.core.track('searchClosed', {}, options);
	    }
	
	    /**
	    * Track pageViewInit event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'pageViewInit',
	    value: function pageViewInit(fields) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	      (true) && _Logger2.default.info('API: pageViewInit');
	      // TODO: add to util function
	      var renderDetails = this.core.model.get('state.view.currentPage.renderDetails');
	      if (renderDetails && renderDetails.renderInitTimestamp && renderDetails.viewRenderedStatus !== 'complete' && renderDetails.viewRenderedStatus !== 'timeout') {
	        this.core.track('pageView', {
	          'message.triggeredBy': this.core.localStorage.pageViewTriggeredBy,
	          'message.category': 'navigation'
	        }, options);
	      }
	
	      (true) && _Logger2.default.debug('API: received data:\n' + (0, _stringify2.default)(fields, null, 2));
	      var sanitized = this.core.check('pageView', fields);
	
	      var data = this.core.prepareFields('pageView', sanitized);
	      (true) && _Logger2.default.debug('API: prepared data:\n' + (0, _stringify2.default)(data, null, 2));
	
	      this.core.track('pageViewInit', data, (0, _extends3.default)({}, options, {
	        isFakeEvent: true
	      }));
	    }
	
	    /**
	    * Track pageViewPartiallyRendered event
	     * @param {long} [options.timestamp]
	    */
	
	  }, {
	    key: 'pageViewPartiallyRendered',
	    value: function pageViewPartiallyRendered() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      (true) && _Logger2.default.info('API: pageViewPartiallyRendered');
	      this.core.track('pageViewPartiallyRendered', {}, (0, _extends3.default)({}, options, {
	        isFakeEvent: true
	      }));
	    }
	
	    /**
	    * Track pageViewCompleted event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    */
	
	  }, {
	    key: 'pageViewCompleted',
	    value: function pageViewCompleted(fields) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	      (true) && _Logger2.default.info('API: pageViewComplete');
	
	      var updatedFields = (0, _extends3.default)({}, fields, { context: this.core.localStorage.pageViewContext });
	      var sanitized = this.core.check('setPageViewFeature', updatedFields, {
	        safe: ['context']
	      });
	      var data = this.core.prepareFields('setPageViewFeature', sanitized);
	      data['state.view.currentPage.renderDetails.viewRenderedStatus'] = 'complete'; // TODO: maybe differently?
	      data['message.context'] = sanitized.context; // TODO: same issue as before
	      (true) && _Logger2.default.debug('API: prepared data:\n' + (0, _stringify2.default)(data, null, 2));
	      this.core.track('pageView', data, options);
	    }
	
	    /**
	    * Track pageViewTimeout event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    */
	
	  }, {
	    key: 'pageViewTimeout',
	    value: function pageViewTimeout(fields, options) {
	      (true) && _Logger2.default.info('API: pageViewTimeout');
	
	      var updatedFields = (0, _extends3.default)({}, fields, { context: this.core.localStorage.pageViewContext });
	      var sanitized = this.core.check('setPageViewFeature', updatedFields, {
	        safe: ['context']
	      });
	      var data = this.core.prepareFields('setPageViewFeature', sanitized);
	      data['state.view.currentPage.renderDetails.viewRenderedStatus'] = 'timeout'; // TODO: maybe differently?
	      data['message.context'] = sanitized.context; // TODO: same issue as before
	      (true) && _Logger2.default.debug('API: prepared data:\n' + (0, _stringify2.default)(data, null, 2));
	
	      this.core.track('pageView', data, options);
	    }
	
	    /**
	    * Track modalView event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'modalView',
	    value: function modalView(fields, options) {
	      this.core.commonEvent('modalView', fields, options);
	    }
	  }]);
	  return BaseAnalytics;
	}();
	
	exports.default = BaseAnalytics;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _get2 = __webpack_require__(141);
	
	var _get3 = _interopRequireDefault(_get2);
	
	var _set2 = __webpack_require__(145);
	
	var _set3 = _interopRequireDefault(_set2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Model = function () {
	  function Model() {
	    (0, _classCallCheck3.default)(this, Model);
	    this.data = {};
	  }
	
	  (0, _createClass3.default)(Model, [{
	    key: 'set',
	    value: function set(path, value) {
	      (0, _set3.default)(this.data, path, value);
	    }
	  }, {
	    key: 'get',
	    value: function get(path) {
	      return (0, _get3.default)(this.data, path);
	    }
	  }, {
	    key: 'reset',
	    value: function reset(path) {
	      (0, _set3.default)(this.data, path, undefined);
	    }
	  }, {
	    key: 'batchSet',
	    value: function batchSet(data) {
	      var _this = this;
	
	      var fullPaths = (0, _keys2.default)(data);
	      fullPaths.forEach(function (path) {
	        _this.set(path, data[path]);
	      });
	    }
	  }, {
	    key: 'getData',
	    value: function getData() {
	      return this.data;
	    }
	  }]);
	  return Model;
	}();
	
	exports.default = Model;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Queue = function () {
	  function Queue(maxSize, onFlushCallback) {
	    (0, _classCallCheck3.default)(this, Queue);
	
	    this.onFlush = onFlushCallback;
	    this.buffer = [];
	    this.currentSize = 0;
	    this.maxSize = maxSize;
	  }
	
	  (0, _createClass3.default)(Queue, [{
	    key: 'push',
	    value: function push(message) {
	      var messageSize = (0, _stringify2.default)(message).length;
	      this.buffer.push(message);
	      this.currentSize += messageSize;
	      if (this.currentSize >= this.maxSize) {
	        (true) && _Logger2.default.debug('MessageQueue: queue size exceeds maximum (' + this.maxSize + ') - flushing');
	        this.flush();
	      }
	    }
	  }, {
	    key: 'setMaxSize',
	    value: function setMaxSize(maxSize) {
	      this.maxSize = maxSize;
	    }
	  }, {
	    key: 'flush',
	    value: function flush() {
	      if (this.buffer.length) {
	        this.onFlush(this.buffer);
	        this.buffer = [];
	        this.currentSize = 0;
	      }
	    }
	  }]);
	  return Queue;
	}();
	
	exports.default = Queue;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Timer = function () {
	  function Timer(callback, interval) {
	    (0, _classCallCheck3.default)(this, Timer);
	
	    this.id = null;
	    this.callback = callback;
	    this.interval = interval;
	  }
	
	  (0, _createClass3.default)(Timer, [{
	    key: "start",
	    value: function start(delay) {
	      this.delay = this.delay || delay;
	      this.clear();
	      this.run();
	    }
	  }, {
	    key: "pause",
	    value: function pause() {
	      this.clear();
	      // calculate remaining time
	      this.delay = this.interval - (Date.now() - this.startTime);
	    }
	  }, {
	    key: "stop",
	    value: function stop() {
	      this.clear();
	      this.delay = null;
	      this.startTime = null;
	    }
	  }, {
	    key: "run",
	    value: function run() {
	      var _this = this;
	
	      var interval = this.delay || this.interval;
	      this.id = setTimeout(function () {
	        _this.delay = null;
	        // restart recursive timer
	        _this.run();
	        // execute callback function
	        _this.callback();
	      }, interval);
	
	      // store timeout start time
	      this.startTime = Date.now();
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      clearTimeout(this.id);
	      this.id = null;
	    }
	  }]);
	  return Timer;
	}();
	
	exports.default = Timer;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _set2 = __webpack_require__(145);
	
	var _set3 = _interopRequireDefault(_set2);
	
	var _get2 = __webpack_require__(141);
	
	var _get3 = _interopRequireDefault(_get2);
	
	var _difference2 = __webpack_require__(353);
	
	var _difference3 = _interopRequireDefault(_difference2);
	
	var _validators = __webpack_require__(162);
	
	var _validators2 = _interopRequireDefault(_validators);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Validator = function () {
	  function Validator(rules, model, map) {
	    (0, _classCallCheck3.default)(this, Validator);
	
	    this.rules = rules;
	    this.model = model;
	    this.map = map;
	  }
	
	  (0, _createClass3.default)(Validator, [{
	    key: 'validate',
	    value: function validate(event, attributes) {
	      var _this = this;
	
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	      if (!attributes) {
	        throw new Error('No data for ' + event + ' provided for validation');
	      }
	      var eventRules = this.rules[event];
	      if (!eventRules) {
	        throw new Error('No event ' + event + ' in validation rules');
	      }
	      if (this.map && !this.map[event]) {
	        throw new Error('No event ' + event + ' in path map');
	      }
	
	      var sanitized = {};
	      var errors = [];
	      var warnings = [];
	
	      var removedFields = this.getRemovedKeys(event, attributes, eventRules, options);
	      if (removedFields.length) {
	        warnings.push(event + ': Removed unexpected keys [' + removedFields.join(', ') + '] from event ' + event);
	      }
	
	      (0, _keys2.default)(eventRules).forEach(function (attribute) {
	        var path = _this.getDataPath(event, attribute);
	        if (path === undefined) {
	          errors.push('MISSING PATH MAPPING: ' + event + ': ' + attribute);
	        } else {
	          // main validator loop
	          if (options && options.safe && options.safe.indexOf(path) !== -1) {
	            return; // Safe attribute, skip validation
	          }
	          var value = (0, _get3.default)(attributes, path);
	          var success = true;
	          for (var validatorName in _validators2.default) {
	            // eslint-disable-line
	            var allRules = eventRules[attribute][validatorName];
	            if (allRules) {
	              var rule = _this.chooseRule(allRules, attributes, event);
	              if (rule) {
	                var result = _validators2.default[validatorName](value, path, rule);
	                if (result.success === false) {
	                  success = false;
	                  var errorMessage = result.message;
	                  if (rule.condition) {
	                    errorMessage = errorMessage + ' if ' + _this.formatConditionError(attributes, rule.condition, event);
	                  }
	                  errors.push(errorMessage);
	                  break;
	                }
	              }
	            }
	          }
	
	          if (success && value !== undefined) {
	            (0, _set3.default)(sanitized, path, value);
	          }
	        }
	      });
	
	      if (options && options.safe) {
	        // Append "safe" attributes
	        options.safe.forEach(function (attr) {
	          (0, _set3.default)(sanitized, attr, attributes[attr]);
	        });
	      }
	
	      return {
	        sanitized: sanitized,
	        errors: errors,
	        warnings: warnings
	      };
	    }
	  }, {
	    key: 'getDataPath',
	    value: function getDataPath(event, path) {
	      return this.map ? this.map[event][path] : path;
	    }
	  }, {
	    key: 'getRemovedKeys',
	    value: function getRemovedKeys(event, attributes, eventRules, options) {
	      var _this2 = this;
	
	      return (0, _difference3.default)( // Find unexpected attributes passed to validator
	      (0, _keys2.default)(attributes).filter(function (key) {
	        return attributes[key] !== undefined;
	      }), // input data minut empty values
	      (0, _keys2.default)(eventRules).map( // All expected keys from rules + safe keys
	      function (path) {
	        return _this2.getDataPath(event, path);
	      }).concat(options.safe || []));
	    }
	
	    // Select rule where condition is applicable
	
	  }, {
	    key: 'chooseRule',
	    value: function chooseRule(allRules, attributes, event) {
	      var _this3 = this;
	
	      return allRules.find(function (rule) {
	        if (rule.condition) {
	          // complex condition
	          return rule.condition.some(function (orRule) {
	            return _this3.checkCondition(attributes, orRule, event);
	          }); // One of the conditions in the rule is valid
	        }
	        return true; // primitive condition, always valid
	      });
	    }
	
	    // Required if deviceType=roku or applicationName=roku
	    // each item in array is an OR rule
	    // requiredIf: [
	    //   { visit.device.deviceType: ['roku'] }
	    //   { visit.device.applicationName: ['Roku'] }
	    // ]
	    //
	    // Required if deviceType=roku and applicationVersion=1.0.0
	    // each item inside object is an AND rule
	    // requiredIf: [
	    //   { visit.device.deviceType: ['roku'] , visit.device.applicationVersion: ['1.0.0'] }
	    // ]
	    //
	    // Required if deviceType is not roku
	    // ! symbol as negative
	    // requiredIf: [
	    //   { !visit.device.deviceType: ['roku'] }
	    // ]
	    //
	    // Required if applicationType is not Android and not iOS
	    // for same field - multiple values are set as array
	    // requiredIf: [
	    //   { !visit.applicationDetails.applicationType: ['Android', 'iOS'] }
	    // ]
	    //
	    // Condition fields will be checked against input data first, and if fields are not present there - against the model
	
	  }, {
	    key: 'checkCondition',
	    value: function checkCondition(data, rules, event) {
	      var _this4 = this;
	
	      return (0, _keys2.default)(rules).every(function (rulePath) {
	        var isInverted = rulePath[0] === '!';
	        var path = isInverted ? rulePath.slice(1) : rulePath;
	        var apiPath = _this4.getDataPath(event, path);
	        var value = typeof (0, _get3.default)(data, apiPath) !== 'undefined' ? (0, _get3.default)(data, apiPath) : _this4.model.get(path);
	
	        // !field: [A, B] => !A && !B
	        if (isInverted) {
	          return rules[rulePath].every(function (ruleValue) {
	            return _this4.compare(value, ruleValue, isInverted);
	          });
	        }
	        // field: [A, B] => A || B
	        return rules[rulePath].some(function (ruleValue) {
	          return _this4.compare(value, ruleValue, isInverted);
	        });
	      });
	    }
	  }, {
	    key: 'formatConditionError',
	    value: function formatConditionError(data, rules, event) {
	      var _this5 = this;
	
	      var ruleString = rules.map(function (rule) {
	        var res = (0, _keys2.default)(rule).map(function (rulePath) {
	          var isInverted = rulePath[0] === '!';
	          var path = isInverted ? rulePath.slice(1) : rulePath;
	          var apiPath = _this5.getDataPath(event, path);
	          var inModel = typeof (0, _get3.default)(data, apiPath) === 'undefined';
	
	          var value = isInverted ? rule[rulePath].join(' and ') : rule[rulePath].join(' or ');
	          var formatted = isInverted ? path + ' != ' + value : path + ' = ' + value;
	          return inModel ? 'MODEL::' + formatted : formatted;
	        });
	        return '(' + res.join(' and ') + ')';
	      });
	      return ruleString.join(' or ');
	    }
	  }, {
	    key: 'compare',
	    value: function compare(first, second, isInverted) {
	      if (isInverted) {
	        return second === 'anullValue' ? first !== undefined : first !== second;
	      }
	      return second === 'anullValue' ? first === undefined : first === second;
	    }
	  }]);
	  return Validator;
	}();
	
	exports.default = Validator;

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _isInteger = __webpack_require__(181);
	
	var _isInteger2 = _interopRequireDefault(_isInteger);
	
	var _values = __webpack_require__(187);
	
	var _values2 = _interopRequireDefault(_values);
	
	var _isPlainObject = __webpack_require__(92);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { // ordered
	  required: required,
	  allowed: allowed,
	  type: type,
	  elementType: elementType,
	  restrictedTo: restrictedTo,
	  min: min,
	  max: max,
	  minLength: minLength,
	  maxLength: maxLength
	};
	
	
	function allowed(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined && rule.value === false) {
	    result.success = false;
	    result.message = 'ALLOWED: attribute [' + attribute + '] is not allowed';
	  }
	
	  return result;
	}
	
	function elementType(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    var values = void 0;
	    if (Array.isArray(inputValue)) {
	      values = inputValue;
	    } else if ((0, _isPlainObject2.default)(inputValue)) {
	      values = (0, _values2.default)(inputValue);
	    } else {
	      throw new Error('Input value [' + inputValue + '] for attribute [' + attribute + '] is not an array or object!');
	    }
	
	    if (!values.every(function (item) {
	      return checkType(item, rule.value);
	    })) {
	      result.success = false;
	      result.message = 'ELEMENT TYPE: All values [' + values.join() + '] for attribute [' + attribute + '] should be of type [' + rule.value + ']';
	    }
	  }
	
	  return result;
	}
	
	function max(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	  if (inputValue !== undefined) {
	    if (typeof inputValue === 'number') {
	      if (inputValue > rule.value) {
	        result.success = false;
	        result.message = 'MAX: Value [' + inputValue + '] for attribute [' + attribute + '] expected to be more than [' + rule.value + ']';
	      }
	    } else {
	      throw new Error('Input value [' + inputValue + '] for attribute [' + attribute + '] is not a number!');
	    }
	  }
	  return result;
	}
	
	function maxLength(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    if (typeof inputValue === 'string' || Array.isArray(inputValue)) {
	      if (inputValue.length > rule.value) {
	        var valueAsString = typeof inputValue === 'string' ? inputValue : inputValue.join();
	        result.success = false;
	        result.message = 'MAX LENGTH: Input value [' + valueAsString + '] for attribute [' + attribute + '] expected to be at most of length [' + rule.value + ']';
	      }
	    } else {
	      throw new Error('Input value [' + inputValue + '] for [' + attribute + '] is not an array or string!');
	    }
	  }
	
	  return result;
	}
	
	function min(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    if (typeof inputValue === 'number') {
	      if (inputValue < rule.value) {
	        result.success = false;
	        result.message = 'MIN: Value [' + inputValue + '] for attribute [' + attribute + '] expected to be less than [' + rule.value + ']';
	      }
	    } else {
	      throw new Error('Input value [' + inputValue + '] for attribute [' + attribute + '] is not a number!');
	    }
	  }
	
	  return result;
	}
	
	function minLength(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    if (typeof inputValue === 'string' || Array.isArray(inputValue)) {
	      if (inputValue.length < rule.value) {
	        var valueAsString = typeof inputValue === 'string' ? inputValue : inputValue.join();
	        result.success = false;
	        result.message = 'MIN LENGTH: Input value [' + valueAsString + '] for attribute [' + attribute + '] expected to be at least of length [' + rule.value + ']';
	      }
	    } else {
	      throw new Error('Input value [' + inputValue + '] for [' + attribute + '] is not an array or string!');
	    }
	  }
	  return result;
	}
	
	function required(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue === undefined) {
	    result.break = true;
	    if (rule.value === true) {
	      result.success = false;
	      result.message = 'REQUIRED: attribute [' + attribute + '] is required';
	    }
	  }
	
	  return result;
	}
	
	function restrictedTo(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    if (rule.value.indexOf(inputValue) === -1) {
	      result.success = false;
	      result.message = 'RESTRICTED: Input value [' + inputValue + '] for attribute [' + attribute + '] is not allowed. Must be one of: [' + rule.value.join() + ']';
	    }
	  }
	
	  return result;
	}
	
	function type(inputValue, attribute, rule) {
	  var result = {
	    success: true
	  };
	
	  if (inputValue !== undefined) {
	    if (!checkType(inputValue, rule.value)) {
	      result.success = false;
	      result.message = 'TYPE: Input value [' + inputValue + '] for attribute [' + attribute + '] is should be of type: [' + rule.value + ']';
	    }
	  }
	
	  return result;
	}
	
	function checkType(value, typeName) {
	  switch (typeName) {
	    case 'int':
	    case 'integer':
	    case 'long':
	      {
	        return typeof value === 'number' && (0, _isInteger2.default)(value);
	      }
	    case 'double':
	      {
	        return typeof value === 'number';
	      }
	    case 'string':
	      {
	        return typeof value === 'string';
	      }
	    case 'boolean':
	      {
	        return typeof value === 'boolean';
	      }
	    case 'array':
	      {
	        return Array.isArray(value);
	      }
	    case 'object':
	    case 'map':
	      {
	        return (0, _isPlainObject2.default)(value);
	      }
	    default:
	      {
	        throw new Error('Unknown data type ' + typeName + '!');
	      }
	  }
	}

/***/ }),
/* 163 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.capitalizeFirstLetter = capitalizeFirstLetter;
	function capitalizeFirstLetter(string) {
	  return string[0].toUpperCase() + string.slice(1);
	}

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promise = __webpack_require__(188);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Post `data`
	 */
	function post(url, data, token) {
	  return new _promise2.default(function (resolve, reject) {
	    var xhr = new XMLHttpRequest();
	
	    // on state change
	    xhr.onreadystatechange = function () {
	      if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	          resolve();
	        } else {
	          reject(xhr.status);
	        }
	      }
	    };
	
	    xhr.open('post', url, true);
	    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	    token && xhr.setRequestHeader('Authorization', 'OAuth oauth_token=' + token);
	    xhr.send(data);
	  });
	}
	
	exports.default = post;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof2 = __webpack_require__(55);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _keys = __webpack_require__(23);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _cloneDeep2 = __webpack_require__(140);
	
	var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);
	
	var _pull2 = __webpack_require__(357);
	
	var _pull3 = _interopRequireDefault(_pull2);
	
	exports.default = pruneObject;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function pruneObject(obj) {
	  var copy = (0, _cloneDeep3.default)(obj);
	  return prune(copy);
	}
	
	function prune(obj) {
	  (0, _keys2.default)(obj).forEach(function (key) {
	    var value = obj[key];
	    if (value === undefined || value === null || typeof value === 'number' && isNaN(value) || value === '' || (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && (0, _keys2.default)(prune(value)).length === 0) {
	      delete obj[key]; // eslint-disable-line no-param-reassign
	    }
	  });
	  // remove any leftover undefined values from the delete operation on an array
	  if (Array.isArray(obj)) {
	    (0, _pull3.default)(obj, undefined);
	  }
	
	  return obj;
	}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Storage = function () {
	  function Storage() {
	    (0, _classCallCheck3.default)(this, Storage);
	    this.expirationSuffix = 'expkey';
	    this.isAvailable = false;
	
	    this.isAvailable = this.checkAvailability();
	  }
	
	  /**
	  * Set value to storage
	  * @param {string} key - storage key
	  * @param {string} data - serialized data to save
	  * @param {string} [storageDuration] - saved data lifetime
	  */
	
	
	  (0, _createClass3.default)(Storage, [{
	    key: 'set',
	    value: function set(key, data, storageDuration) {
	      (true) && _Logger2.default.debug('Storage: setting value to key ' + key);
	      if (this.isAvailable) {
	        window.localStorage.setItem(key, data);
	        if (storageDuration) {
	          var storeUntil = Date.now() + storageDuration;
	          (true) && _Logger2.default.debug('Storage: setting expiration for key ' + key + ' until ' + storeUntil + ' (' + storageDuration + 'ms)');
	          window.localStorage.setItem(this.getExpirationKeyName(key), storeUntil);
	        }
	      } else {
	        (true) && _Logger2.default.warning('Storage: LocalStorage not available');
	      }
	    }
	
	    /**
	    * Get value from storage
	    * @param {string} key - storage key
	    * @returns {string|null} stored serialized data
	    */
	
	  }, {
	    key: 'get',
	    value: function get(key) {
	      (true) && _Logger2.default.debug('Storage: getting value at key ' + key);
	      if (this.isAvailable) {
	        (true) && _Logger2.default.debug('Storage: checking expiration for key ' + key);
	        var storeUntil = window.localStorage.getItem(this.getExpirationKeyName(key));
	        if (storeUntil && Date.now() > storeUntil) {
	          (true) && _Logger2.default.warning('Storage: Data for key ' + key + ' has expired');
	          window.localStorage.removeItem(key);
	          window.localStorage.removeItem(this.getExpirationKeyName(key));
	          return null;
	        }
	        return window.localStorage.getItem(key);
	      }
	      (true) && _Logger2.default.warning('Storage: LocalStorage not available');
	      return null;
	    }
	
	    /**
	    * Remove value from storage
	    * @param {string} key - storage key
	    */
	
	  }, {
	    key: 'reset',
	    value: function reset(key) {
	      (true) && _Logger2.default.debug('Storage: resetting value at key ' + key);
	      if (this.isAvailable) {
	        window.localStorage.removeItem(key);
	        window.localStorage.removeItem(this.getExpirationKeyName(key));
	      } else {
	        (true) && _Logger2.default.warning('Storage: LocalStorage not available');
	      }
	    }
	
	    /**
	    * Check if storage is available
	    * @returns {bool}
	    */
	
	  }, {
	    key: 'checkAvailability',
	    value: function checkAvailability() {
	      (true) && _Logger2.default.info('Storage: checking localStorage availability');
	      try {
	        if (!window && !window.localStorage) {
	          // This can also throw an exception
	          return false;
	        }
	        var key = 'test-' + Date.now();
	        window.localStorage.setItem(key, 'test');
	        window.localStorage.removeItem(key);
	        (true) && _Logger2.default.info('Storage: LocalStorage is available');
	        return true;
	      } catch (e) {
	        (true) && _Logger2.default.info('Storage: LocalStorage not available');
	        return false;
	      }
	    }
	
	    /**
	    * Get expiration key name for provided data key
	    * @param {string} key - storage key
	    * @returns {string} expiration key
	    */
	
	  }, {
	    key: 'getExpirationKeyName',
	    value: function getExpirationKeyName(key) {
	      return key + '-' + this.expirationSuffix;
	    }
	  }]);
	  return Storage;
	}(); /**
	     * Example storage object implementation
	     * Uses two key approach for storing data and TTL separately to avoid parsing large data objects when checking fir expiration
	     */
	
	
	exports.default = Storage;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var analytics = __webpack_require__(168).default; // eslint-disable-line import/no-dynamic-require
	
	module.exports = analytics;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(185);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(193);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(192);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _BaseAnalytics2 = __webpack_require__(157);
	
	var _BaseAnalytics3 = _interopRequireDefault(_BaseAnalytics2);
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	var _callbacks = __webpack_require__(171);
	
	var _callbacks2 = _interopRequireDefault(_callbacks);
	
	var _VenonaFieldMapping = __webpack_require__(256);
	
	var _VenonaFieldMapping2 = _interopRequireDefault(_VenonaFieldMapping);
	
	var _VenonaSpecTools = __webpack_require__(257);
	
	var _VenonaSpecTools2 = _interopRequireDefault(_VenonaSpecTools);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Video analytics API
	 * @typicalname analytics
	 * @extends BaseAnalytics
	*/
	var Analytics = function (_BaseAnalytics) {
	  (0, _inherits3.default)(Analytics, _BaseAnalytics);
	
	  function Analytics() {
	    (0, _classCallCheck3.default)(this, Analytics);
	    return (0, _possibleConstructorReturn3.default)(this, (Analytics.__proto__ || (0, _getPrototypeOf2.default)(Analytics)).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Analytics, [{
	    key: 'setSegment',
	
	
	    /**
	    * Report newly downloaded video segment
	    * @param {bool} fields.segmentIsAd
	    * @param {string} fields.queryParameters
	    * @param {int} fields.sequenceNumber
	    * @param {string} fields.segmentUrl
	    * @param {int} fields.sizeBytes
	    * @param {int} fields.downloadDurationMs
	    * @param {string} fields.ipAddress
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	    value: function setSegment(fields) {
	      this.core.commonEvent('setSegment', fields, { isFakeEvent: true, noBatchSet: true });
	    }
	
	    /**
	    * Report videoZone fields
	    * @param {string} fields.division
	    * @param {string} fields.lineup
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setVideoZone',
	    value: function setVideoZone(fields) {
	      this.core.commonEvent('setVideoZone', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report accountFeatures fields
	    * @param {bool} fields.accessibility
	    * @param {bool} fields.boxless
	    * @param {bool} fields.cDvr
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setAccountFeatures',
	    value: function setAccountFeatures(fields) {
	      this.core.commonEvent('setAccountFeatures', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report networkStatus field
	    * @param {string} fields.networkStatus
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setNetworkStatus',
	    value: function setNetworkStatus(fields) {
	      this.core.commonEvent('setNetworkStatus', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report autoAccessEnabled field
	    * @param {string} fields.autoAccessEnabled
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setAutoAccessEnabled',
	    value: function setAutoAccessEnabled(fields) {
	      this.core.commonEvent('setAutoAccessEnabled', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report experiment fields
	    * @param {object} fields
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setExperimentConfigurations',
	    value: function setExperimentConfigurations(fields) {
	      this.core.commonEvent('setExperimentConfigurations', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Change application name
	    * @param {object} fields
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setApplicationName',
	    value: function setApplicationName(fields) {
	      this.core.commonEvent('setApplicationName', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report average cpu usage
	    * @param {object} fields
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setCpuAverageUsage',
	    value: function setCpuAverageUsage(fields) {
	      this.core.commonEvent('setCpuAverageUsage', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Report player test fields
	    * @param {object} fields
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'setPlayerTestFields',
	    value: function setPlayerTestFields(fields) {
	      this.core.commonEvent('setPlayerTestFields', fields, { isFakeEvent: true });
	    }
	
	    /**
	    * Track inVisitOauthRefresh event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'inVisitOauthRefresh',
	    value: function inVisitOauthRefresh(fields, options) {
	      this.core.commonEvent('inVisitOauthRefresh', fields, options);
	    }
	
	    /**
	    * Track playbackSelect event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackSelect',
	    value: function playbackSelect(fields, options) {
	      this.core.commonEvent('playbackSelect', fields, options);
	    }
	
	    /**
	    * Track playbackExitBeforeStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    */
	
	  }, {
	    key: 'playbackExitBeforeStart',
	    value: function playbackExitBeforeStart(fields, options) {
	      (true) && _Logger2.default.info('API: playbackExitBeforeStart');
	      this.core.track('playbackExitBeforeStart', {}, options);
	    }
	
	    /**
	    * Track playbackStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackStart',
	    value: function playbackStart(fields, options) {
	      this.core.commonEvent('playbackStart', fields, options);
	    }
	
	    /**
	    * Track playbackStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackStop',
	    value: function playbackStop(fields, options) {
	      this.core.commonEvent('playbackStop', fields, options);
	    }
	
	    /**
	    * Track playbackBitRateUpshift event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackBitRateUpshift',
	    value: function playbackBitRateUpshift(fields, options) {
	      this.core.commonEvent('playbackBitRateUpshift', fields, options);
	    }
	
	    /**
	    * Track playbackBitRateDownshift event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackBitRateDownshift',
	    value: function playbackBitRateDownshift(fields, options) {
	      this.core.commonEvent('playbackBitRateDownshift', fields, options);
	    }
	
	    /**
	    * Track attemptRestart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'attemptRestart',
	    value: function attemptRestart(fields, options) {
	      this.core.commonEvent('attemptRestart', fields, options);
	    }
	
	    /**
	    * Track playbackFailure event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackFailure',
	    value: function playbackFailure(fields, options) {
	      this.core.commonEvent('playbackFailure', fields, options);
	    }
	
	    /**
	    * Track playbackStreamUriAcquired event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackStreamUriAcquired',
	    value: function playbackStreamUriAcquired(fields, options) {
	      this.core.commonEvent('playbackStreamUriAcquired', fields, options);
	    }
	
	    /**
	    * Track playbackTrickPlayStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackTrickPlayStart',
	    value: function playbackTrickPlayStart(fields, options) {
	      this.core.commonEvent('playbackTrickPlayStart', fields, options);
	    }
	
	    /**
	    * Track playbackTrickPlayRateChange event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackTrickPlayRateChange',
	    value: function playbackTrickPlayRateChange(fields, options) {
	      this.core.commonEvent('playbackTrickPlayRateChange', fields, options);
	    }
	
	    /**
	    * Track playbackTrickPlayStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackTrickPlayStop',
	    value: function playbackTrickPlayStop(fields, options) {
	      this.core.commonEvent('playbackTrickPlayStop', fields, options);
	    }
	
	    /**
	    * Track adBreakStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'adBreakStart',
	    value: function adBreakStart(fields, options) {
	      this.core.commonEvent('adBreakStart', fields, options);
	    }
	
	    /**
	    * Track adBreakStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'adBreakStop',
	    value: function adBreakStop(fields, options) {
	      (true) && _Logger2.default.info('API: adBreakStop');
	      this.core.track('adBreakStop', {}, options);
	    }
	
	    /**
	    * Track adStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'adStart',
	    value: function adStart(fields, options) {
	      this.core.commonEvent('adStart', fields, options);
	    }
	
	    /**
	    * Track adStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'adStop',
	    value: function adStop(fields, options) {
	      this.core.commonEvent('adStop', fields, options);
	    }
	
	    /**
	    * Track playbackPause event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackPause',
	    value: function playbackPause(fields, options) {
	      if (fields && fields.triggeredBy === 'user') {
	        // for compatibility reasons only user triggered pause events need to be processed
	        this.core.commonEvent('playbackPause', fields, options);
	      } else {
	        (true) && _Logger2.default.warning('API: Pause ignored - not triggered by user.');
	      }
	    }
	
	    /**
	    * Track playbackUnpause event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'playbackUnpause',
	    value: function playbackUnpause(fields, options) {
	      if (fields && fields.triggeredBy === 'user') {
	        // for compatibility reasons only user triggered pause events need to be processed
	        this.core.commonEvent('playbackUnpause', fields, options);
	      } else {
	        (true) && _Logger2.default.warning('API: Unpause ignored - not triggered by user.');
	      }
	    }
	
	    /**
	    * Track bufferingStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'bufferingStart',
	    value: function bufferingStart(fields, options) {
	      (true) && _Logger2.default.info('API: bufferingStart');
	      this.core.track('bufferingStart', {}, options);
	    }
	
	    /**
	    * Track bufferingStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'bufferingStop',
	    value: function bufferingStop(fields, options) {
	      (true) && _Logger2.default.info('API: bufferingStop');
	      this.core.track('bufferingStop', {}, options);
	    }
	
	    /**
	    * Track selectContent event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'selectContent',
	    value: function selectContent(fields, options) {
	      this.core.commonEvent('selectContent', fields, options);
	    }
	
	    /**
	    * Track pinEntry event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'pinEntry',
	    value: function pinEntry(fields, options) {
	      this.core.commonEvent('pinEntry', fields, options);
	    }
	
	    /**
	    * Track requestToRecord event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToRecord',
	    value: function requestToRecord(fields, options) {
	      this.core.commonEvent('requestToRecord', fields, options);
	    }
	
	    /**
	    * Track requestToDeleteRecording event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToDeleteRecording',
	    value: function requestToDeleteRecording(fields, options) {
	      this.core.commonEvent('requestToDeleteRecording', fields, options);
	    }
	
	    /**
	    * Track requestToEditRecording event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToEditRecording',
	    value: function requestToEditRecording(fields, options) {
	      this.core.commonEvent('requestToEditRecording', fields, options);
	    }
	
	    /**
	    * Track requestToCancelRecording event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToCancelRecording',
	    value: function requestToCancelRecording(fields, options) {
	      this.core.commonEvent('requestToCancelRecording', fields, options);
	    }
	
	    /**
	    * Track purchaseStart event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'purchaseStart',
	    value: function purchaseStart(fields, options) {
	      this.core.commonEvent('purchaseStart', fields, options);
	    }
	
	    /**
	    * Track purchaseStop event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'purchaseStop',
	    value: function purchaseStop(fields, options) {
	      this.core.commonEvent('purchaseStop', fields, options);
	    }
	
	    /**
	    * Track applicationActivity event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'applicationActivity',
	    value: function applicationActivity(fields, options) {
	      this.core.commonEvent('applicationActivity', fields, options);
	    }
	
	    /**
	    * Track checkAvailableChannels event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'checkAvailableChannels',
	    value: function checkAvailableChannels(fields, options) {
	      this.core.commonEvent('checkAvailableChannels', fields, options);
	    }
	
	    /**
	    * Track forcedLogin event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'forcedLogin',
	    value: function forcedLogin(fields, options) {
	      this.core.commonEvent('forcedLogin', fields, options);
	    }
	
	    /**
	    * Track requestToRemind event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToRemind',
	    value: function requestToRemind(fields, options) {
	      this.core.commonEvent('requestToRemind', fields, options);
	    }
	
	    /**
	    * Track requestToEditReminder event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToEditReminder',
	    value: function requestToEditReminder(fields, options) {
	      this.core.commonEvent('requestToEditReminder', fields, options);
	    }
	
	    /**
	    * Track requestToDeleteReminder event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'requestToDeleteReminder',
	    value: function requestToDeleteReminder(fields, options) {
	      this.core.commonEvent('requestToDeleteReminder', fields, options);
	    }
	
	    /**
	    * Track switchScreen event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'switchScreen',
	    value: function switchScreen(fields, options) {
	      this.core.commonEvent('switchScreen', fields, options);
	    }
	
	    /**
	    * Track displayChange event
	    * @param {object} fields
	    * @param {long} [options.timestamp]
	    * @throws {Error} Will throw an error if validation is enabled and fails
	    */
	
	  }, {
	    key: 'displayChange',
	    value: function displayChange(fields, options) {
	      this.core.commonEvent('displayChange', fields, options);
	    }
	  }]);
	  return Analytics;
	}(_BaseAnalytics3.default); /**
	                             * Analytics JS SDK.
	                             */
	
	exports.default = new Analytics(_callbacks2.default, _VenonaFieldMapping2.default, _VenonaSpecTools2.default);

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeAdBreakStart = onBeforeAdBreakStart;
	exports.onBeforeAdBreakStop = onBeforeAdBreakStop;
	exports.onAfterAdBreakStop = onAfterAdBreakStop;
	exports.onBeforeAdStart = onBeforeAdStart;
	exports.onBeforeAdStop = onBeforeAdStop;
	exports.onAfterAdStop = onAfterAdStop;
	
	var _videoplayer = __webpack_require__(27);
	
	var _videoplayer2 = _interopRequireDefault(_videoplayer);
	
	var _playback = __webpack_require__(53);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeAdBreakStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'ad';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackHeartbeat(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.ad.adBreakStartTimestamp', analytics.timestamp);
	  analytics.model.set('state.ad.adBreakStartPositionSec', playerState.currentVideoPosition);
	}
	
	// TODO: don't just import from other file
	function onBeforeAdBreakStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'ad';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackHeartbeat(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  var adBreakElapsedMs = analytics.timestamp - analytics.model.get('state.ad.adBreakStartTimestamp');
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.ad.adBreakElapsedMs', adBreakElapsedMs);
	}
	
	function onAfterAdBreakStop(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.ad');
	}
	
	function onBeforeAdStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'ad';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackHeartbeat(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.ad.startTimestamp', analytics.timestamp);
	}
	
	function onBeforeAdStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'ad';
	  data['message.triggeredBy'] = 'application';
	
	  _videoplayer2.default.playbackHeartbeat(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  var adElapsedMs = analytics.timestamp - analytics.model.get('state.ad.startTimestamp');
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.ad.adElapsedMs', adElapsedMs);
	}
	
	function onAfterAdStop(event, from, into, args) {
	  var analytics = args.analytics;
	
	  // ad break fields should be persisted
	  analytics.model.reset('state.ad.id');
	  analytics.model.reset('state.ad.title');
	  analytics.model.reset('state.ad.number');
	  analytics.model.reset('state.ad.commodityCode');
	  analytics.model.reset('state.ad.vast');
	  analytics.model.reset('state.ad.campaign');
	  analytics.model.reset('state.ad.startTimestamp');
	  analytics.model.reset('state.ad.adDurationSec');
	  analytics.model.reset('state.ad.adElapsedMs');
	  analytics.model.reset('state.ad.adStoppedReason');
	  analytics.model.reset('state.ad.deviceAdId');
	}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeEvent = onBeforeEvent;
	exports.onChangeState = onChangeState;
	exports.onAfterEvent = onAfterEvent;
	
	var _videoplayer = __webpack_require__(27);
	
	var _videoplayer2 = _interopRequireDefault(_videoplayer);
	
	var _messages = __webpack_require__(52);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeEvent(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	  var options = args.options;
	
	  if (options && options.timestamp) {
	    analytics.timestamp = options.timestamp;
	  } else {
	    analytics.timestamp = Date.now();
	  }
	
	  // reset feature object if navigation event and message.context is empty (wrong event for flow, exiting it)
	  if (analytics.currentFlow && analytics.isNavigation(event)) {
	    if (!data['message.context']) {
	      analytics.model.reset('message.feature');
	      delete analytics.currentFlow; // end of flow
	    }
	  }
	
	  if (data['message.context']) {
	    if (analytics.currentFlow !== data['message.context']) {
	      analytics.currentFlow = data['message.context']; // begin new flow
	
	      // generate new transactionId
	      var transactionId = analytics.model.get('visit.visitId') + '|' + analytics.timestamp;
	      data['message.feature.transactionId'] = transactionId;
	    }
	
	    var newFeatureStepName = data['message.feature.featureStepName'];
	
	    if (newFeatureStepName) {
	      // set flag to true if feature step name changed
	      var oldFeatureStepName = analytics.model.get('message.feature.featureStepName');
	      if (oldFeatureStepName !== newFeatureStepName) {
	        data['message.feature.featureStepChanged'] = true;
	      }
	
	      // append latest step name to array
	      var completedSteps = analytics.model.get('message.feature.completedSteps') || [];
	      completedSteps.push(newFeatureStepName);
	      analytics.model.set('message.feature.completedSteps', completedSteps);
	    }
	  }
	
	  // Handle only real events
	  if (!options.isFakeEvent) {
	    // if playback is active and event is not playback (there is no such interface in the videoplayer)
	    if (_videoplayer2.default.isActive() && !analytics.isPlayback(event)) {
	      _videoplayer2.default.tick(analytics.timestamp);
	      var playerState = _videoplayer2.default.getVideoPlayerState();
	      analytics.model.set('state.currentVideoPosition', playerState.currentVideoPosition);
	    }
	    // Reset heartBeat time on every playback event
	    if (analytics.isPlayback(event)) {
	      analytics.heartBeatTimer.stop();
	    }
	  }
	}
	
	// actual transition (change state name, current content position, etc)
	function onChangeState(event, from, into, args) {
	  var analytics = args.analytics;
	
	  var previousState = analytics.model.get('state.name');
	
	  if (previousState) {
	    analytics.model.set('state.previousState.name', previousState);
	    analytics.model.set('state.previousState.entryTimestamp', analytics.model.get('state.entryTimestamp'));
	    analytics.model.set('state.previousState.exitTimestamp', analytics.timestamp);
	  }
	
	  analytics.model.set('state.name', analytics.sm.current);
	  analytics.model.set('state.entryTimestamp', analytics.timestamp);
	
	  // keep tracking previous positions during playback (including stop)
	  if (_videoplayer2.default.isActive() || event === 'playbackStop') {
	    analytics.model.set('state.previousState.entryVideoPosition', analytics.model.get('state.entryVideoPosition'));
	
	    var currentContPos = analytics.model.get('state.currentVideoPosition'); // already calculated in onBeforeEvent callback
	    analytics.model.set('state.entryVideoPosition', currentContPos);
	    analytics.model.set('state.previousState.exitVideoPosition', currentContPos);
	  }
	}
	
	function onAfterEvent(event, from, into, args) {
	  var data = args.data;
	  var options = args.options;
	  var analytics = args.analytics;
	
	  if (!options.noBatchSet) {
	    analytics.model.batchSet(data); // save prepared data into the model
	  }
	
	  // Handle only real events
	  if (!options.isFakeEvent) {
	    var message = (0, _messages.compose)(event, args.data, analytics.model.getData(), analytics); // create a JSON string from one event
	    analytics.queue.push(message);
	
	    if (analytics.flushedEvents.has(event) || analytics.currentFlow === 'stream2') {
	      analytics.queue.flush();
	    }
	
	    analytics.model.reset('application');
	    analytics.model.reset('operation');
	    analytics.model.reset('state.playback.heartbeat');
	    analytics.model.reset('state.playback.bitRate');
	    analytics.model.reset('state.playback.segmentInfo');
	    var feature = analytics.model.get('message.feature');
	    analytics.model.reset('message');
	
	    if (analytics.currentFlow) {
	      if (!analytics.isNavigation(event) || data['message.context'] && analytics.currentFlow === data['message.context']) {
	        analytics.model.set('message.feature', feature); // restore feature
	        analytics.model.set('message.feature.featureStepChanged', false);
	      }
	    }
	
	    delete analytics.timestamp;
	
	    // Actually restart heartBeat timer if we're playing
	    if (analytics.isPlayback(event)) {
	      if (analytics.sm.current === 'playing') {
	        analytics.heartBeatTimer.start();
	      }
	      analytics.model.reset('state.playback.frames');
	      analytics.model.reset('state.playback.buffer');
	    }
	  }
	  analytics.saveState();
	}

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends2 = __webpack_require__(54);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _callbacks = __webpack_require__(150);
	
	var _callbacks2 = _interopRequireDefault(_callbacks);
	
	var _ad = __webpack_require__(169);
	
	var ad = _interopRequireWildcard(_ad);
	
	var _general = __webpack_require__(170);
	
	var general = _interopRequireWildcard(_general);
	
	var _login = __webpack_require__(172);
	
	var login = _interopRequireWildcard(_login);
	
	var _navigation = __webpack_require__(173);
	
	var navigation = _interopRequireWildcard(_navigation);
	
	var _ondemand = __webpack_require__(174);
	
	var ondemand = _interopRequireWildcard(_ondemand);
	
	var _playback = __webpack_require__(53);
	
	var playback = _interopRequireWildcard(_playback);
	
	var _recovery = __webpack_require__(175);
	
	var recovery = _interopRequireWildcard(_recovery);
	
	var _select = __webpack_require__(176);
	
	var select = _interopRequireWildcard(_select);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _extends3.default)({}, _callbacks2.default, ad, general, login, navigation, ondemand, playback, recovery, select);

/***/ }),
/* 172 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeInVisitOauthRefresh = onBeforeInVisitOauthRefresh;
	exports.onBeforeForcedLogin = onBeforeForcedLogin;
	function onBeforeInVisitOauthRefresh(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'authentication';
	  data['message.triggeredBy'] = 'application';
	
	  analytics.localStorage.oAuthToken = data.oAuthToken;
	  delete data.oAuthToken; // TODO: improve
	
	  if (data['operation.success'] === false) {
	    data['application.error.errorType'] = 'authentication';
	  }
	}
	
	function onBeforeForcedLogin(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'authentication';
	  data['message.triggeredBy'] = 'application';
	}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _merge2 = __webpack_require__(95);
	
	var _merge3 = _interopRequireDefault(_merge2);
	
	exports.onBeforePinEntry = onBeforePinEntry;
	exports.onBeforeRequestToRecord = onBeforeRequestToRecord;
	exports.onBeforeRequestToDeleteRecording = onBeforeRequestToDeleteRecording;
	exports.onBeforeRequestToEditRecording = onBeforeRequestToEditRecording;
	exports.onBeforeRequestToCancelRecording = onBeforeRequestToCancelRecording;
	exports.onBeforePurchaseStart = onBeforePurchaseStart;
	exports.onBeforePurchaseStop = onBeforePurchaseStop;
	exports.onAfterPurchaseStop = onAfterPurchaseStop;
	exports.onBeforeApplicationActivity = onBeforeApplicationActivity;
	exports.onBeforeCheckAvailableChannels = onBeforeCheckAvailableChannels;
	exports.onBeforeRequestToRemind = onBeforeRequestToRemind;
	exports.onBeforeRequestToEditReminder = onBeforeRequestToEditReminder;
	exports.onBeforeRequestToDeleteReminder = onBeforeRequestToDeleteReminder;
	exports.onBeforeSwitchScreen = onBeforeSwitchScreen;
	exports.onBeforeDisplayChange = onBeforeDisplayChange;
	
	var _uuid = __webpack_require__(99);
	
	var _uuid2 = _interopRequireDefault(_uuid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforePinEntry(event, from, into, args) {
	  var data = args.data;
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforeRequestToRecord(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforeRequestToDeleteRecording(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforeRequestToEditRecording(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforeRequestToCancelRecording(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforePurchaseStart(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	}
	
	function onBeforePurchaseStop(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	
	  data['message.category'] = 'contentDiscovery';
	
	  if (analytics.localStorage.preferences) {
	    (0, _merge3.default)(data, analytics.localStorage.preferences);
	  }
	}
	
	function onAfterPurchaseStop(event, from, into, args) {
	  var analytics = args.analytics;
	  delete analytics.localStorage.preferences;
	}
	
	function onBeforeApplicationActivity(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'navigation';
	  data['message.triggeredBy'] = 'user';
	
	  if (data['operation.operationType'] === 'backgrounded') {
	    // TODO: should get field moved
	    analytics.model.set('visit.applicationDetails.appBackgroundedTimestamp', analytics.timestamp);
	  } else if (data['operation.operationType'] === 'foregrounded') {
	    var appBackgroundedTimestamp = analytics.model.get('visit.applicationDetails.appBackgroundedTimestamp');
	    if (analytics.settings.backgroundedVisitTTL && analytics.timestamp - appBackgroundedTimestamp >= analytics.settings.backgroundedVisitTTL) {
	      analytics.model.set('visit.previousVisitId', analytics.model.get('visit.visitId'));
	      analytics.model.set('visit.visitId', (0, _uuid2.default)());
	    }
	  }
	}
	
	function onBeforeCheckAvailableChannels(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'navigation';
	  data['message.triggeredBy'] = 'application';
	}
	
	function onBeforeRequestToRemind(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	
	  if (data['operation.success'] === false) {
	    data['application.error.errorType'] = 'reminder';
	  }
	}
	
	function onBeforeRequestToEditReminder(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	
	  if (data['operation.success'] === false) {
	    data['application.error.errorType'] = 'reminder';
	  }
	}
	
	function onBeforeRequestToDeleteReminder(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'contentDiscovery';
	  data['message.triggeredBy'] = 'user';
	
	  if (data['operation.success'] === false) {
	    data['application.error.errorType'] = 'reminder';
	  }
	}
	
	function onBeforeSwitchScreen(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'navigation';
	  data['message.triggeredBy'] = 'user';
	
	  if (data['operation.success'] === false) {
	    data['application.error.errorType'] = 'switchScreen';
	  }
	}
	
	function onBeforeDisplayChange(event, from, into, args) {
	  var data = args.data;
	  data['message.category'] = 'navigation';
	  data['message.triggeredBy'] = 'user';
	}

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforePlaybackPause = onBeforePlaybackPause;
	exports.onBeforePlaybackUnpause = onBeforePlaybackUnpause;
	exports.onBeforePlaybackTrickPlayStart = onBeforePlaybackTrickPlayStart;
	exports.onBeforePlaybackTrickPlayRateChange = onBeforePlaybackTrickPlayRateChange;
	exports.onBeforePlaybackTrickPlayStop = onBeforePlaybackTrickPlayStop;
	exports.onAfterPlaybackTrickPlayStop = onAfterPlaybackTrickPlayStop;
	
	var _videoplayer = __webpack_require__(27);
	
	var _videoplayer2 = _interopRequireDefault(_videoplayer);
	
	var _playback = __webpack_require__(53);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforePlaybackPause(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'user';
	
	  _videoplayer2.default.playbackPause(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	}
	
	// TODO: don't just import from other file
	function onBeforePlaybackUnpause(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	
	  _videoplayer2.default.playbackUnpause(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	}
	
	function onBeforePlaybackTrickPlayStart(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'user';
	
	  _videoplayer2.default.playbackTrickPlayStart(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  var scrubStartValue = data['state.playback.trickPlay.scrubStartPositionSec'];
	  var scrubStartPositionSec = scrubStartValue !== undefined ? scrubStartValue : playerState.currentVideoPosition;
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.playback.trickPlay.scrubStartPositionSec', scrubStartPositionSec);
	}
	
	function onBeforePlaybackTrickPlayRateChange(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'user';
	
	  _videoplayer2.default.playbackTrickPlayRateChange(analytics.timestamp);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	}
	
	function onBeforePlaybackTrickPlayStop(event, from, into, args) {
	  var data = args.data;
	  var analytics = args.analytics;
	
	  data['message.category'] = 'playback';
	  data['message.triggeredBy'] = 'user';
	
	  var scrubEndPositionSec = data['state.playback.trickPlay.scrubEndPositionSec'];
	  _videoplayer2.default.playbackTrickPlayStop(analytics.timestamp, scrubEndPositionSec);
	  var playerState = _videoplayer2.default.getVideoPlayerState();
	
	  (0, _playback.setActivePlaybackFields)(playerState, analytics);
	  analytics.model.set('state.playback.trickPlay.scrubEndPositionSec', scrubEndPositionSec);
	}
	
	function onAfterPlaybackTrickPlayStop(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.reset('state.playback.trickPlay.scrubSpeed');
	  analytics.model.reset('state.playback.trickPlay.scrubType');
	  analytics.model.reset('state.playback.trickPlay.scrubStartPositionSec');
	  analytics.model.reset('state.playback.trickPlay.scrubEndPositionSec');
	}

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeLeavePaused = onBeforeLeavePaused;
	exports.onBeforeLeaveBuffering = onBeforeLeaveBuffering;
	
	var _Logger = __webpack_require__(5);
	
	var _Logger2 = _interopRequireDefault(_Logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeLeavePaused(event, from, into, args) {
	  var analytics = args.analytics;
	
	  if (event !== 'playbackUnpause') {
	    (true) && _Logger2.default.warning('Recovery: inserting missed playbackUnpause before ' + event);
	    analytics.track('playbackUnpause', {
	      'message.triggeredBy': 'analytics',
	      'message.category': 'playback'
	    });
	  }
	}
	
	function onBeforeLeaveBuffering(event, from, into, args) {
	  var analytics = args.analytics;
	
	  if (event !== 'bufferingStop') {
	    (true) && _Logger2.default.warning('Recovery: inserting missed bufferingStop before ' + event);
	    analytics.track('bufferingStop', {
	      'message.triggeredBy': 'analytics',
	      'message.category': 'playback'
	    });
	  }
	
	  if (into === 'initiating') {
	    (true) && _Logger2.default.warning('Recovery: inserting missed playbackStop before ' + event);
	    analytics.track('playbackStop', {
	      'message.triggeredBy': 'analytics',
	      'message.category': 'playback'
	    });
	  }
	}

/***/ }),
/* 176 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeSelectContent = onBeforeSelectContent;
	exports.onAfterSelectContent = onAfterSelectContent;
	exports.onBeforeSelectAction = onBeforeSelectAction;
	exports.onAfterSelectAction = onAfterSelectAction;
	function onBeforeSelectContent(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.localStorage.activeContentIdentifiers = analytics.model.get('state.content.identifiers');
	  analytics.model.reset('state.content.identifiers');
	}
	
	function onAfterSelectContent(event, from, into, args) {
	  var analytics = args.analytics;
	
	  analytics.model.set('state.content.identifiers', analytics.localStorage.activeContentIdentifiers);
	  delete analytics.localStorage.activeContentIdentifiers;
	
	  analytics.model.reset('state.view.currentPage.elements');
	  analytics.model.reset('state.search.selectedResultName');
	  analytics.model.reset('state.search.selectedResultFacet');
	}
	
	function onBeforeSelectAction(event, from, into, args) {
	  var analytics = args.analytics;
	  var data = args.data;
	
	  if (data['operation.userPreferencesSelections'] || data['operation.userPreferenceCategory']) {
	    analytics.localStorage.preferences = {
	      'operation.userPreferencesSelections': data['operation.userPreferencesSelections'],
	      'operation.userPreferenceCategory': data['operation.userPreferenceCategory']
	    };
	  }
	
	  analytics.localStorage.activeContent = analytics.model.get('state.content');
	  analytics.model.reset('state.content');
	}
	
	function onAfterSelectAction(event, from, into, args) {
	  var analytics = args.analytics;
	  analytics.model.reset('state.search.selectedResultName');
	  analytics.model.reset('state.search.selectedResultFacet');
	  analytics.model.reset('state.view.currentPage.elements');
	  analytics.model.reset('state.view.modal');
	
	  analytics.model.set('state.content', analytics.localStorage.activeContent);
	  delete analytics.localStorage.activeContent;
	}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onBeforeEvent = onBeforeEvent;
	exports.onAfterEvent = onAfterEvent;
	exports.onBeforePlaybackSelect = onBeforePlaybackSelect;
	exports.onBeforePlaybackStreamUriAcquired = onBeforePlaybackStreamUriAcquired;
	exports.onBeforePlaybackStart = onBeforePlaybackStart;
	exports.onBeforePlaybackStop = onBeforePlaybackStop;
	exports.onBeforeBufferingStart = onBeforeBufferingStart;
	exports.onBeforeBufferingStop = onBeforeBufferingStop;
	exports.onBeforePlaybackUnpause = onBeforePlaybackUnpause;
	exports.onBeforePlaybackTrickPlayRateChange = onBeforePlaybackTrickPlayRateChange;
	exports.onBeforePlaybackTrickPlayStop = onBeforePlaybackTrickPlayStop;
	exports.onBeforePlaybackBitRateChange = onBeforePlaybackBitRateChange;
	exports.onBeforeAttemptRestart = onBeforeAttemptRestart;
	exports.onBeforeTick = onBeforeTick;
	
	var _videoplayer = __webpack_require__(27);
	
	var _videoplayer2 = _interopRequireDefault(_videoplayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function onBeforeEvent(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.contentElapsedMs = 0;
	  model.clockTimeElapsedMs = 0;
	
	  if (from === 'playing') {
	    if (event !== 'tick') {
	      model.contentElapsedAtCurrentBitRate = options.timestamp - model.lastHeartbeatEventTimestamp;
	      model.calculateHeartbeat(options.timestamp);
	    }
	
	    if (model.playbackType === 'vod') {
	      model.calculateCurrentVideoPosition(options.timestamp);
	    }
	  }
	}
	
	function onAfterEvent(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  if (event !== 'playbackBitRateChange') {
	    delete model.previousBitRate;
	    delete model.contentElapsedAtPreviousBitRate;
	  }
	
	  if (event !== 'tick' && event !== 'playbackSelect' && event !== 'playbackStreamUriAcquired' && event !== 'playbackStop' && event !== 'attemptRestart') {
	    model.lastHeartbeatEventTimestamp = options.timestamp;
	  }
	
	  model.lastEventTimestamp = options.timestamp;
	}
	
	function onBeforePlaybackSelect(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var data = args.data;
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.reset();
	
	  model.playbackType = data.playbackType; // vod or linear
	
	  model.playbackType === 'vod' && data.position !== undefined && (model.bookmarkPosition = data.position);
	
	  model.playbackSelectedTimestamp = options.timestamp;
	}
	
	function onBeforePlaybackStreamUriAcquired(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.uriObtainedMs = options.timestamp - model.playbackSelectedTimestamp;
	}
	
	function onBeforePlaybackStart(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var data = args.data;
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  if (model.playbackType === 'linear') {
	    if (typeof data.playPointTimestamp !== 'undefined') {
	      model.playPointTimestamp = data.playPointTimestamp;
	    } else {
	      model.playPointTimestamp = options.timestamp;
	    }
	  }
	
	  from !== 'restarting' && model.playbackType === 'vod' && model.calculateCurrentVideoPosition(options.timestamp, model.bookmarkPosition);
	
	  delete model.bookmarkPosition;
	
	  model.currentBitRate = data.bitrate;
	  model.tuneTimeMs = options.timestamp - model.playbackSelectedTimestamp;
	
	  model.playbackStartedTimestamp = options.timestamp;
	}
	
	function onBeforePlaybackStop() {
	  var model = _videoplayer2.default.model;
	
	  model.playbackStartedTimestamp = 0; // playback ended
	
	  model.lastEventTimestamp = 0;
	  model.lastHeartbeatEventTimestamp = 0;
	}
	
	function onBeforeBufferingStart(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.bufferingTimestamp = options.timestamp;
	}
	
	function onBeforeBufferingStop(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.refreshHeartbeat(options.timestamp);
	
	  model.lastBufferingTime = options.timestamp - model.bufferingTimestamp;
	
	  model.bufferingTimestamp = 0;
	}
	
	function onBeforePlaybackUnpause(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.refreshHeartbeat(options.timestamp);
	
	  model.pauseTimestamp = 0;
	}
	
	function onBeforePlaybackTrickPlayRateChange(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.refreshHeartbeat(options.timestamp);
	}
	
	function onBeforePlaybackTrickPlayStop(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var data = args.data;
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.refreshHeartbeat(options.timestamp);
	
	  model.calculateCurrentVideoPosition(options.timestamp, data.contentPosition);
	
	  model.trickplayTimestamp = 0;
	}
	
	function onBeforePlaybackBitRateChange(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var data = args.data;
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  model.contentElapsedAtPreviousBitRate = model.contentElapsedAtCurrentBitRate;
	  model.contentElapsedAtCurrentBitRate = 0;
	  model.previousBitRate = model.currentBitRate;
	  model.currentBitRate = data.bitrate;
	
	  model.clockTimeElapsedMs = options.timestamp - model.lastHeartbeatEventTimestamp;
	}
	
	function onBeforeAttemptRestart() {
	  var model = _videoplayer2.default.model;
	
	  model.contentElapsedAtCurrentBitRate = 0;
	}
	
	function onBeforeTick(event, from, into) {
	  var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { data: {}, options: {} };
	
	  var options = args.options;
	  var model = _videoplayer2.default.model;
	
	  if (model.bufferingTimestamp === 0 && model.playbackType === 'linear') {
	    model.playPointTimestamp += options.timestamp - model.lastEventTimestamp;
	  }
	}

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(6);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(7);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PlayerModel = function () {
	  function PlayerModel() {
	    (0, _classCallCheck3.default)(this, PlayerModel);
	
	    this.playbackType = undefined;
	    this.uriObtainedMs = 0;
	    this.tuneTimeMs = 0;
	    this.lastBufferingTime = 0;
	
	    // content
	    this.currentVideoPosition = 0;
	    this.contentElapsedMs = 0;
	    this.clockTimeElapsedMs = 0;
	    this.bookmarkPosition = 0;
	
	    // bitrate fields
	    this.currentBitRate = 0;
	    this.previousBitRate = undefined;
	    this.contentElapsedAtCurrentBitRate = 0;
	    this.contentElapsedAtPreviousBitRate = undefined;
	
	    // timestamps
	    this.playbackSelectedTimestamp = 0;
	    this.playbackStartedTimestamp = 0;
	    this.lastEventTimestamp = 0;
	    this.lastHeartbeatEventTimestamp = 0;
	    this.bufferingTimestamp = 0;
	    this.playbackFailTimestamp = 0;
	    this.playPointTimestamp = 0;
	  }
	
	  (0, _createClass3.default)(PlayerModel, [{
	    key: 'reset',
	    value: function reset() {
	      this.currentVideoPosition = 0;
	      this.playPointTimestamp = 0;
	      this.contentElapsedMs = 0;
	      this.clockTimeElapsedMs = 0;
	      this.contentElapsedAtCurrentBitRate = 0;
	      this.currentBitRate = 0;
	      this.lastEventTimestamp = 0;
	      this.lastHeartbeatEventTimestamp = 0;
	      this.playbackStartedTimestamp = 0;
	    }
	  }, {
	    key: 'refreshHeartbeat',
	    value: function refreshHeartbeat(timestamp) {
	      this.contentElapsedMs = 0;
	      this.contentElapsedAtCurrentBitRate = 0;
	      this.clockTimeElapsedMs = timestamp - this.lastHeartbeatEventTimestamp;
	    }
	
	    // contentElapsedMs, clockTimeElapsedMs, playPointTimestamp
	
	  }, {
	    key: 'calculateHeartbeat',
	    value: function calculateHeartbeat(timestamp) {
	      var contentElapsedSinceLastEventMs = timestamp - this.lastEventTimestamp;
	      var contentElapsedSinceLastHeartbeatMs = timestamp - this.lastHeartbeatEventTimestamp;
	
	      this.contentElapsedMs = contentElapsedSinceLastHeartbeatMs;
	      this.clockTimeElapsedMs = contentElapsedSinceLastHeartbeatMs;
	
	      if (this.playbackType === 'linear' && this.bufferingTimestamp === 0) {
	        this.playPointTimestamp = this.playPointTimestamp + contentElapsedSinceLastEventMs;
	      }
	    }
	
	    // currentVideoPosition
	
	  }, {
	    key: 'calculateCurrentVideoPosition',
	    value: function calculateCurrentVideoPosition(timestamp, contentPosition) {
	      if (typeof contentPosition !== 'undefined') {
	        this.currentVideoPosition = contentPosition; // set from bookmark
	      } else {
	        this.currentVideoPosition = this.currentVideoPosition + Math.round((timestamp - this.lastEventTimestamp) / 1000);
	      }
	    }
	  }]);
	  return PlayerModel;
	}();
	
	exports.default = PlayerModel;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _pick2 = __webpack_require__(96);
	
	var _pick3 = _interopRequireDefault(_pick2);
	
	var _Transitions = __webpack_require__(120);
	
	var _Transitions2 = _interopRequireDefault(_Transitions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var playerTransitions = (0, _pick3.default)(_Transitions2.default, ['playbackSelect', 'playbackStreamUriAcquired', 'playbackStart', 'playbackStop', 'playbackHeartbeat', 'bufferingStart', 'bufferingStop', 'playbackPause', 'playbackUnpause', 'playbackFailure', 'attemptRestart', 'playbackTrickPlayStart', 'playbackTrickPlayRateChange', 'playbackTrickPlayStop']);
	
	playerTransitions.playbackSelect.blank = 'initiating';
	playerTransitions.tick = { '*': '*' };
	playerTransitions.playbackBitRateChange = _Transitions2.default.playbackBitRateUpshift;
	
	exports.default = playerTransitions;

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(195), __esModule: true };

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(197), __esModule: true };

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(198), __esModule: true };

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(199), __esModule: true };

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(200), __esModule: true };

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(201), __esModule: true };

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(203), __esModule: true };

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(204), __esModule: true };

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(205), __esModule: true };

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(206), __esModule: true };

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(207), __esModule: true };

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(208), __esModule: true };

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(186);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(183);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(55);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(55);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(180);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(41);
	__webpack_require__(234);
	module.exports = __webpack_require__(1).Array.from;


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(1);
	var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
	module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(236);
	module.exports = __webpack_require__(1).Number.isInteger;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(237);
	module.exports = __webpack_require__(1).Object.assign;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(238);
	var $Object = __webpack_require__(1).Object;
	module.exports = function create(P, D) {
	  return $Object.create(P, D);
	};


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(239);
	var $Object = __webpack_require__(1).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(240);
	module.exports = __webpack_require__(1).Object.getPrototypeOf;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(241);
	module.exports = __webpack_require__(1).Object.keys;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(242);
	module.exports = __webpack_require__(1).Object.setPrototypeOf;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(246);
	module.exports = __webpack_require__(1).Object.values;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(73);
	__webpack_require__(41);
	__webpack_require__(74);
	__webpack_require__(243);
	__webpack_require__(247);
	__webpack_require__(248);
	module.exports = __webpack_require__(1).Promise;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(73);
	__webpack_require__(41);
	__webpack_require__(74);
	__webpack_require__(244);
	__webpack_require__(251);
	__webpack_require__(250);
	__webpack_require__(249);
	module.exports = __webpack_require__(1).Set;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(245);
	__webpack_require__(73);
	__webpack_require__(252);
	__webpack_require__(253);
	module.exports = __webpack_require__(1).Symbol;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(41);
	__webpack_require__(74);
	module.exports = __webpack_require__(72).f('iterator');


/***/ }),
/* 209 */
/***/ (function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(30);
	
	module.exports = function (iter, ITERATOR) {
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(17);
	var toLength = __webpack_require__(39);
	var toAbsoluteIndex = __webpack_require__(233);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx = __webpack_require__(12);
	var IObject = __webpack_require__(61);
	var toObject = __webpack_require__(24);
	var toLength = __webpack_require__(39);
	var asc = __webpack_require__(214);
	module.exports = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || asc;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this);
	    var self = IObject(O);
	    var f = ctx(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);
	var isArray = __webpack_require__(103);
	var SPECIES = __webpack_require__(4)('species');
	
	module.exports = function (original) {
	  var C;
	  if (isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(213);
	
	module.exports = function (original, length) {
	  return new (speciesConstructor(original))(length);
	};


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var dP = __webpack_require__(8).f;
	var create = __webpack_require__(38);
	var redefineAll = __webpack_require__(66);
	var ctx = __webpack_require__(12);
	var anInstance = __webpack_require__(56);
	var forOf = __webpack_require__(30);
	var $iterDefine = __webpack_require__(62);
	var step = __webpack_require__(106);
	var setSpecies = __webpack_require__(115);
	var DESCRIPTORS = __webpack_require__(9);
	var fastKey = __webpack_require__(63).fastKey;
	var validate = __webpack_require__(118);
	var SIZE = DESCRIPTORS ? '_s' : 'size';
	
	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = validate(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        validate(this, NAME);
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(validate(this, NAME), key);
	      }
	    });
	    if (DESCRIPTORS) dP(C.prototype, 'size', {
	      get: function () {
	        return validate(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function (iterated, kind) {
	      this._t = validate(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return step(0, entry.k);
	      if (kind == 'values') return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(57);
	var from = __webpack_require__(210);
	module.exports = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(3);
	var $export = __webpack_require__(2);
	var meta = __webpack_require__(63);
	var fails = __webpack_require__(18);
	var hide = __webpack_require__(16);
	var redefineAll = __webpack_require__(66);
	var forOf = __webpack_require__(30);
	var anInstance = __webpack_require__(56);
	var isObject = __webpack_require__(10);
	var setToStringTag = __webpack_require__(34);
	var dP = __webpack_require__(8).f;
	var each = __webpack_require__(212)(0);
	var DESCRIPTORS = __webpack_require__(9);
	
	module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    C = wrapper(function (target, iterable) {
	      anInstance(target, C, NAME, '_c');
	      target._c = new Base();
	      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
	        anInstance(this, C, KEY);
	        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    IS_WEAK || dP(C.prototype, 'size', {
	      get: function () {
	        return this._c.size;
	      }
	    });
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);
	
	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(8);
	var createDesc = __webpack_require__(33);
	
	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(20);
	var gOPS = __webpack_require__(65);
	var pIE = __webpack_require__(32);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ }),
/* 220 */
/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(10);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(38);
	var descriptor = __webpack_require__(33);
	var setToStringTag = __webpack_require__(34);
	var IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(16)(IteratorPrototype, __webpack_require__(4)('iterator'), function () { return this; });
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys = __webpack_require__(20);
	var toIObject = __webpack_require__(17);
	module.exports = function (object, el) {
	  var O = toIObject(object);
	  var keys = getKeys(O);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) if (O[key = keys[index++]] === el) return key;
	};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(3);
	var macrotask = __webpack_require__(117).set;
	var Observer = global.MutationObserver || global.WebKitMutationObserver;
	var process = global.process;
	var Promise = global.Promise;
	var isNode = __webpack_require__(29)(process) == 'process';
	
	module.exports = function () {
	  var head, last, notify;
	
	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };
	
	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if (Observer) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise && Promise.resolve) {
	    var promise = Promise.resolve();
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(20);
	var gOPS = __webpack_require__(65);
	var pIE = __webpack_require__(32);
	var toObject = __webpack_require__(24);
	var IObject = __webpack_require__(61);
	var $assign = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(18)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(8);
	var anObject = __webpack_require__(15);
	var getKeys = __webpack_require__(20);
	
	module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(17);
	var gOPN = __webpack_require__(108).f;
	var toString = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys = __webpack_require__(20);
	var toIObject = __webpack_require__(17);
	var isEnum = __webpack_require__(32).f;
	module.exports = function (isEntries) {
	  return function (it) {
	    var O = toIObject(it);
	    var keys = getKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) if (isEnum.call(O, key = keys[i++])) {
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-setmap-offrom/
	var $export = __webpack_require__(2);
	var aFunction = __webpack_require__(28);
	var ctx = __webpack_require__(12);
	var forOf = __webpack_require__(30);
	
	module.exports = function (COLLECTION) {
	  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
	    var mapFn = arguments[1];
	    var mapping, A, n, cb;
	    aFunction(this);
	    mapping = mapFn !== undefined;
	    if (mapping) aFunction(mapFn);
	    if (source == undefined) return new this();
	    A = [];
	    if (mapping) {
	      n = 0;
	      cb = ctx(mapFn, arguments[2], 2);
	      forOf(source, false, function (nextItem) {
	        A.push(cb(nextItem, n++));
	      });
	    } else {
	      forOf(source, false, A.push, A);
	    }
	    return new this(A);
	  } });
	};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-setmap-offrom/
	var $export = __webpack_require__(2);
	
	module.exports = function (COLLECTION) {
	  $export($export.S, COLLECTION, { of: function of() {
	    var length = arguments.length;
	    var A = Array(length);
	    while (length--) A[length] = arguments[length];
	    return new this(A);
	  } });
	};


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(10);
	var anObject = __webpack_require__(15);
	var check = function (O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = __webpack_require__(12)(Function.call, __webpack_require__(107).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(69);
	var defined = __webpack_require__(58);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(69);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx = __webpack_require__(12);
	var $export = __webpack_require__(2);
	var toObject = __webpack_require__(24);
	var call = __webpack_require__(104);
	var isArrayIter = __webpack_require__(102);
	var toLength = __webpack_require__(39);
	var createProperty = __webpack_require__(218);
	var getIterFn = __webpack_require__(119);
	
	$export($export.S + $export.F * !__webpack_require__(105)(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(209);
	var step = __webpack_require__(106);
	var Iterators = __webpack_require__(31);
	var toIObject = __webpack_require__(17);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(62)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(2);
	
	$export($export.S, 'Number', { isInteger: __webpack_require__(221) });


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(2);
	
	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(225) });


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(2);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(38) });


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(2);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(9), 'Object', { defineProperty: __webpack_require__(8).f });


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(24);
	var $getPrototypeOf = __webpack_require__(109);
	
	__webpack_require__(111)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(24);
	var $keys = __webpack_require__(20);
	
	__webpack_require__(111)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(2);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(231).set });


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(37);
	var global = __webpack_require__(3);
	var ctx = __webpack_require__(12);
	var classof = __webpack_require__(57);
	var $export = __webpack_require__(2);
	var isObject = __webpack_require__(10);
	var aFunction = __webpack_require__(28);
	var anInstance = __webpack_require__(56);
	var forOf = __webpack_require__(30);
	var speciesConstructor = __webpack_require__(116);
	var task = __webpack_require__(117).set;
	var microtask = __webpack_require__(224)();
	var newPromiseCapabilityModule = __webpack_require__(64);
	var perform = __webpack_require__(112);
	var promiseResolve = __webpack_require__(113);
	var PROMISE = 'Promise';
	var TypeError = global.TypeError;
	var process = global.process;
	var $Promise = global[PROMISE];
	var isNode = classof(process) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
	
	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[__webpack_require__(4)('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch (e) { /* empty */ }
	}();
	
	// helpers
	var sameConstructor = LIBRARY ? function (a, b) {
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	} : function (a, b) {
	  return a === b;
	};
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value);
	            if (domain) domain.exit();
	          }
	          if (result === reaction.promise) {
	            reject(TypeError('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = perform(function () {
	        if (isNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else if (handler = global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  if (promise._h == 1) return false;
	  var chain = promise._a || promise._c;
	  var i = 0;
	  var reaction;
	  while (chain.length > i) {
	    reaction = chain[i++];
	    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
	  } return true;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(global, function () {
	    var handler;
	    if (isNode) {
	      process.emit('rejectionHandled', promise);
	    } else if (handler = global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};
	
	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(66)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
	    return sameConstructor($Promise, C)
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__(34)($Promise, PROMISE);
	__webpack_require__(115)(PROMISE);
	Wrapper = __webpack_require__(1)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
	    return promiseResolve(this, x);
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(105)(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(215);
	var validate = __webpack_require__(118);
	var SET = 'Set';
	
	// 23.2 Set Objects
	module.exports = __webpack_require__(217)(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, strong);


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(3);
	var has = __webpack_require__(19);
	var DESCRIPTORS = __webpack_require__(9);
	var $export = __webpack_require__(2);
	var redefine = __webpack_require__(114);
	var META = __webpack_require__(63).KEY;
	var $fails = __webpack_require__(18);
	var shared = __webpack_require__(68);
	var setToStringTag = __webpack_require__(34);
	var uid = __webpack_require__(40);
	var wks = __webpack_require__(4);
	var wksExt = __webpack_require__(72);
	var wksDefine = __webpack_require__(71);
	var keyOf = __webpack_require__(223);
	var enumKeys = __webpack_require__(219);
	var isArray = __webpack_require__(103);
	var anObject = __webpack_require__(15);
	var toIObject = __webpack_require__(17);
	var toPrimitive = __webpack_require__(70);
	var createDesc = __webpack_require__(33);
	var _create = __webpack_require__(38);
	var gOPNExt = __webpack_require__(227);
	var $GOPD = __webpack_require__(107);
	var $DP = __webpack_require__(8);
	var $keys = __webpack_require__(20);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(108).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(32).f = $propertyIsEnumerable;
	  __webpack_require__(65).f = $getOwnPropertySymbols;
	
	  if (DESCRIPTORS && !__webpack_require__(37)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
	
	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);
	
	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    replacer = args[1];
	    if (typeof replacer == 'function') $replacer = replacer;
	    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
	      if ($replacer) value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(16)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(2);
	var $values = __webpack_require__(228)(false);
	
	$export($export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-promise-finally
	'use strict';
	var $export = __webpack_require__(2);
	var core = __webpack_require__(1);
	var global = __webpack_require__(3);
	var speciesConstructor = __webpack_require__(116);
	var promiseResolve = __webpack_require__(113);
	
	$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
	  var C = speciesConstructor(this, core.Promise || global.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-promise-try
	var $export = __webpack_require__(2);
	var newPromiseCapability = __webpack_require__(64);
	var perform = __webpack_require__(112);
	
	$export($export.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = newPromiseCapability.f(this);
	  var result = perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
	__webpack_require__(229)('Set');


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
	__webpack_require__(230)('Set');


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(2);
	
	$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(216)('Set') });


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71)('asyncIterator');


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71)('observable');


/***/ }),
/* 254 */
/***/ (function(module, exports) {

	module.exports = {"startSession":"session","userConfigSet":"session","playbackSelect":"playback","playbackStreamUriAcquired":"playback","playbackExitBeforeStart":"playback","playbackStart":"playback","playbackStop":"playback","bufferingStart":"playback","bufferingStop":"playback","playbackPause":"playback","playbackUnpause":"playback","playbackFailure":"playback","attemptRestart":"playback","playbackTrickPlayStart":"playback","playbackTrickPlayRateChange":"playback","playbackTrickPlayStop":"playback","playbackBitRateUpshift":"playback","playbackBitRateDownshift":"playback","playbackHeartbeat":"playback","loginStart":"login","loginStop":"login","logout":"login","inVisitOauthRefresh":"login","pageView":"navigation","modalView":"navigation","selectAction":"select","selectContent":"select","searched":"search","searchClosed":"search","adBreakStart":"ad","adBreakStop":"ad","adStart":"ad","adStop":"ad","error":"error","apiCall":"apiCall","pinEntry":"navigation","requestToRecord":"navigation","requestToDeleteRecording":"navigation","requestToEditRecording":"navigation","requestToCancelRecording":"navigation","setVideoZone":"session","setAccountFeatures":"session","setNetworkStatus":"session","setAutoAccessEnabled":"session","setExperimentConfigurations":"session","setSegment":"playback","pageViewInit":"navigation","pageViewPartiallyRendered":"navigation","purchaseStart":"navigation","purchaseStop":"navigation","applicationActivity":"navigation","checkAvailableChannels":"navigation","forcedLogin":"login","requestToRemind":"navigation","requestToEditReminder":"navigation","requestToDeleteReminder":"navigation","switchScreen":"navigation","setApplicationName":"session","displayChange":"navigation"}

/***/ }),
/* 255 */
/***/ (function(module, exports) {

	module.exports = ["loginStart","loginStop","logout","error","playbackFailure","userConfigSet"]

/***/ }),
/* 256 */
/***/ (function(module, exports) {

	module.exports = {"adBreakStart":{"state.ad.adBreakNumber":"adBreakNumber"},"adStart":{"state.ad.campaign":"adCampaign","state.ad.commodityCode":"commodityCode","state.ad.deviceAdId":"deviceAdId","state.ad.id":"adId","state.ad.number":"adNumber","state.ad.title":"adTitle","state.ad.vast":"vast"},"adStop":{"state.ad.adDurationSec":"adDurationSec","state.ad.adStoppedReason":"adStoppedReason"},"apiCall":{"application.api.apiCached":"apiCached","application.api.host":"host","application.api.httpVerb":"httpVerb","application.api.path":"path","application.api.queryParameters":"queryParameters","application.api.responseCode":"responseCode","application.api.responseText":"responseText","application.api.responseTimeMs":"responseTimeMs","application.api.serviceResult":"serviceResult","application.api.traceId":"traceId","operation.success":"success","application.api.maxRetryCount":"maxRetryCount","application.api.retry":"retry","application.api.retryCount":"retryCount"},"attemptRestart":{"operation.operationType":"operationType"},"error":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","application.error.errorType":"errorType","application.error.clientErrorCode":"clientErrorCode"},"inVisitOauthRefresh":{"oAuthToken":"oAuthToken","operation.operationType":"operationType","operation.success":"success","visit.login.oauthExpirationTimestamp":"oAuthExpirationTimestamp","application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","application.error.clientErrorCode":"clientErrorCode"},"loginStart":{"operation.operationType":"authType","operation.userEntry.text":"username"},"loginStop":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","oAuthToken":"oAuthToken","operation.success":"success","visit.login.oauthExpirationTimestamp":"oAuthExpirationTimestamp","visit.login.authAttemptId":"authAttemptId","application.error.errorType":"errorType","application.error.clientErrorCode":"clientErrorCode"},"modalView":{"message.triggeredBy":"triggeredBy","message.context":"context","state.view.modal.loadTimeMs":"loadTimeMs","state.view.modal.modalType":"modalType","state.view.modal.name":"modalName","state.view.modal.text":"modalText","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","message.feature.featureStepName":"featureStepName"},"pageView":{"message.triggeredBy":"triggeredBy","message.context":"context","state.view.currentPage.appSection":"appSection","state.view.currentPage.pageDisplayType":"pageDisplayType","state.view.currentPage.pageId":"pageId","state.view.currentPage.pageName":"pageName","state.view.currentPage.pageType":"pageType","state.view.currentPage.pageViewType":"pageViewType","state.view.currentPage.renderDetails.isLazyLoad":"isLazyLoad","state.view.currentPage.settings":"settings","state.view.currentPage.sortAndFilter.appliedFilters":"appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts":"appliedSorts","state.view.currentPage.billing.billDueDate":"billDueDate","state.view.currentPage.billing.billEndDate":"billEndDate","state.view.currentPage.billing.billProgress":"billProgress","state.view.currentPage.billing.billStartDate":"billStartDate","state.view.currentPage.billing.ccVendor":"ccVendor","state.view.currentPage.billing.paymentMethod":"paymentMethod","state.view.currentPage.billing.recentCharges":"recentCharges"},"playbackBitRateDownshift":{"state.playback.bitRate.currentBitRateBps":"currentBitRateBps"},"playbackBitRateUpshift":{"state.playback.bitRate.currentBitRateBps":"currentBitRateBps"},"playbackFailure":{"application.error.errorCode":"errorCode","application.error.errorMessage":"errorMessage","application.error.errorExtras":"errorExtras","application.error.clientErrorCode":"clientErrorCode"},"playbackPause":{"message.triggeredBy":"triggeredBy"},"playbackSelect":{"message.context":"context","message.triggeredBy":"triggeredBy","operation.operationType":"operationType","state.content.contentClass":"contentClass","state.content.contentFormat":"contentFormat","state.content.identifiers.dvrRecordingId":"dvrRecordingId","state.content.identifiers.platformSeriesId":"platformSeriesId","state.content.identifiers.providerAssetId":"providerAssetId","state.content.identifiers.tmsGuideId":"tmsGuideId","state.content.identifiers.tmsProgramId":"tmsProgramId","state.content.identifiers.tmsSeriesId":"tmsSeriesId","state.content.stream.bookmarkPositionSec":"bookmarkPositionSec","state.content.stream.closedCaptioningCapable":"closedCaptioningCapable","state.content.stream.drmType":"drmType","state.content.stream.entitled":"entitled","state.content.stream.parentallyBlocked":"parentallyBlocked","state.content.stream.playbackType":"playbackType","state.content.stream.price":"price","state.content.stream.programmerCallSign":"callSign","state.content.stream.programmerFavorited":"favorite","state.content.stream.purchaseType":"purchaseType","state.content.stream.recordingStartTimestamp":"recordingStartTimestamp","state.content.stream.recordingStopTimestamp":"recordingStopTimestamp","state.content.stream.sapCapable":"sapCapable","state.content.stream.scrubbingCapability":"scrubbingCapability","state.content.stream.streamingFormat":"streamingFormat","state.content.purchaseId":"purchaseId","state.content.details.runtime":"runtime","state.content.rentalDurationHours":"rentalDurationHours","state.content.rentalExpirationDate":"rentalExpirationDate","state.view.currentPage.elements.elementIndex":"elementIndex","state.view.currentPage.elements.elementType":"elementType","state.view.currentPage.elements.standardizedName":"elementStandardizedName","state.view.currentPage.pageSection.index":"pageSectionIndex","state.view.currentPage.pageSection.name":"pageSectionName","state.view.currentPage.pageSubSection.index":"pageSubSectionIndex","state.view.currentPage.pageSubSection.name":"pageSubSectionName","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","message.feature.featureStepName":"featureStepName"},"playbackStart":{"state.playback.bitRate.currentBitRateBps":"currentBitRateBps","state.playback.heartBeat.playPointTimestamp":"playPointTimestamp","state.content.details.actualRuntime":"actualRuntime","state.content.stream.numberOfAudioSources":"numberOfAudioSources"},"playbackStop":{"message.triggeredBy":"triggeredBy"},"playbackStreamUriAcquired":{"operation.success":"success","state.content.stream.contentUri":"contentUri"},"playbackTrickPlayRateChange":{"state.playback.trickPlay.scrubSpeed":"scrubSpeed","state.playback.trickPlay.scrubType":"scrubType"},"playbackTrickPlayStart":{"state.playback.trickPlay.scrubSpeed":"scrubSpeed","state.playback.trickPlay.scrubStartPositionSec":"startPositionSec","state.playback.trickPlay.scrubType":"scrubType"},"playbackTrickPlayStop":{"state.playback.trickPlay.scrubEndPositionSec":"endPositionSec"},"playbackUnpause":{"message.triggeredBy":"triggeredBy"},"searched":{"message.triggeredBy":"triggeredBy","state.search.numberOfSearchResults":"numberOfSearchResults","state.search.queryId":"queryId","state.search.results":"results","state.search.resultsMs":"resultsMs","state.search.searchId":"searchId","state.search.searchType":"searchType","state.search.text":"searchText","message.triggeredUsing":"triggeredUsing","state.search.searchResults":"searchResults"},"selectAction":{"message.context":"context","operation.operationType":"operationType","state.view.currentPage.elements.elementIndex":"elementIndex","state.view.currentPage.elements.uiName":"elementUiName","state.view.currentPage.elements.elementType":"elementType","state.view.currentPage.elements.standardizedName":"elementStandardizedName","state.view.currentPage.navigation.navGlobal.name":"navGlobalName","state.view.currentPage.navigation.navPagePrimary.name":"navPagePrimaryName","state.view.currentPage.navigation.navPageSecondary.name":"navPageSecondaryName","state.view.currentPage.pageSection.displayType":"pageSectionDisplayType","state.view.currentPage.pageSection.index":"pageSectionIndex","state.view.currentPage.pageSection.name":"pageSectionName","state.view.currentPage.pageSection.numberOfItems":"pageSectionNumberOfItems","state.view.currentPage.pageSubSection.displayType":"pageSubSectionDisplayType","state.view.currentPage.pageSubSection.index":"pageSubSectionIndex","state.view.currentPage.pageSubSection.name":"pageSubSectionName","state.view.currentPage.pageSubSection.numberOfItems":"pageSubSectionNumberOfItems","state.view.currentPage.sortAndFilter.appliedFilters":"appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts":"appliedSorts","message.category":"category","message.triggeredUsing":"triggeredUsing","operation.toggleState":"toggleState","state.search.searchId":"searchId","state.search.searchType":"searchType","message.feature.currentStep":"featureCurrentStep","message.feature.previousStep":"featurePreviousStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.recordingOptions":"recordingOptions","operation.addOnsSelected":"addOnsSelected","state.view.modal.modalType":"modalType","state.view.modal.name":"modalName","message.triggeredBy":"triggeredBy","operation.userEntry.entryType":"entryType","operation.userEntry.text":"entryText","state.content.contentClass":"contentClass","state.content.contentFormat":"contentFormat","state.content.identifiers.dvrRecordingId":"dvrRecordingId","state.content.identifiers.platformSeriesId":"platformSeriesId","state.content.identifiers.providerAssetId":"providerAssetId","state.content.identifiers.tmsGuideId":"tmsGuideId","state.content.identifiers.tmsProgramId":"tmsProgramId","state.content.identifiers.tmsSeriesId":"tmsSeriesId","state.content.purchaseId":"purchaseId","state.content.rentalDurationHours":"rentalDurationHours","state.content.rentalExpirationDate":"rentalExpirationDate","state.content.stream.bookmarkPositionSec":"bookmarkPositionSec","state.content.stream.closedCaptioningCapable":"closedCaptioningCapable","state.content.stream.drmType":"drmType","state.content.stream.entitled":"entitled","state.content.stream.parentallyBlocked":"parentallyBlocked","state.content.stream.playbackId":"playbackId","state.content.stream.playbackType":"playbackType","state.content.stream.price":"price","state.content.stream.programmerCallSign":"programmerCallSign","state.content.stream.programmerFavorited":"programmerFavorited","state.content.stream.purchaseType":"purchaseType","state.content.stream.recordingStartTimestamp":"recordingStartTimestamp","state.content.stream.recordingStopTimestamp":"recordingStopTimestamp","state.content.stream.sapCapable":"sapCapable","state.content.stream.scrubbingCapability":"scrubbingCapability","state.content.stream.streamingFormat":"streamingFormat","operation.userPreferenceCategory":"userPreferenceCategory","operation.userPreferencesSelections":"userPreferencesSelections","message.feature.featureStepName":"featureStepName","state.view.currentPage.elements.elementIntValue":"elementIntValue","state.view.currentPage.elements.elementStringValue":"elementStringValue","operation.billing.paymentAmount":"paymentAmount","operation.billing.paymentDate":"paymentDate","operation.billing.paymentDueDate":"paymentDueDate","operation.billing.paymentMethod":"paymentMethod","operation.billing.statementAge":"statementAge"},"selectContent":{"state.search.selectedResultFacet":"selectedResultFacet","state.search.selectedResultName":"selectedResultName","state.view.currentPage.elements.elementIndex":"elementIndex","state.view.currentPage.elements.elementType":"elementType","state.view.currentPage.elements.standardizedName":"elementStandardizedName","state.view.currentPage.elements.uiName":"elementUiName","state.view.currentPage.navigation.navGlobal.name":"navGlobalName","state.view.currentPage.navigation.navPagePrimary.name":"navPagePrimaryName","state.view.currentPage.navigation.navPageSecondary.name":"navPageSecondaryName","state.view.currentPage.pageSection.displayType":"pageSectionDisplayType","state.view.currentPage.pageSection.index":"pageSectionIndex","state.view.currentPage.pageSection.name":"pageSectionName","state.view.currentPage.pageSection.numberOfItems":"pageSectionNumberOfItems","state.view.currentPage.pageSubSection.displayType":"pageSubSectionDisplayType","state.view.currentPage.pageSubSection.index":"pageSubSectionIndex","state.view.currentPage.pageSubSection.name":"pageSubSectionName","state.view.currentPage.pageSubSection.numberOfItems":"pageSubSectionNumberOfItems","operation.operationType":"operationType","state.content.identifiers.providerAssetId":"providerAssetId","state.content.identifiers.tmsGuideId":"tmsGuideId","state.content.identifiers.tmsProgramId":"tmsProgramId","state.content.identifiers.tmsSeriesId":"tmsSeriesId","message.category":"category","state.search.queryId":"queryId","message.triggeredBy":"triggeredBy","message.triggeredUsing":"triggeredUsing","state.content.stream.startTimestamp":"streamStartTimestamp"},"startSession":{"customer":"customer","domain":"domain","visit.applicationDetails.appDisplayDefinition":"appDisplayDefinition","visit.applicationDetails.appVersion":"appVersion","visit.applicationDetails.applicationName":"applicationName","visit.applicationDetails.applicationType":"applicationType","visit.applicationDetails.drmEnabled":"drmEnabled","visit.applicationDetails.environment":"environment","visit.applicationDetails.environment.environmentName":"environment.environmentName","visit.applicationDetails.referrerLink":"referrerLink","visit.connection.connectionType":"connectionType","visit.connection.networkCellCarrier":"networkCellCarrier","visit.connection.networkCellNetworkType":"networkCellNetworkType","visit.device.availableStorage":"availableStorage","visit.device.deviceBuild":"deviceBuild","visit.device.deviceType":"deviceType","visit.device.model":"deviceModel","visit.device.linkedDevice.id":"linkedDeviceId","visit.device.linkedDevice.name":"linkedDeviceName","visit.device.operatingSystem":"operatingSystem","visit.device.uuid":"deviceUUID","visit.device.vendorId":"vendorId","visit.device.deviceFormFactor":"formFactor","visit.screenResolution":"screenResolution","visit.settings":"settings","visit.account.accountNumber":"accountNumber","visit.externalApps":"externalApps","visit.visitId":"visitId","visit.previousVisitId":"previousVisitId","visit.talkingGuide":"talkingGuide","visit.thirdPartyAccess.requesterId":"requesterId","visit.thirdPartyAccess.resourceId":"resourceId","visit.applicationDetails.referrerLocation":"referrerLocation","visit.device.manufacturer":"manufacturer","visit.device.usedStorage":"usedStorage"},"setSegment":{"isAd":"segmentIsAd","queryParameters":"queryParameters","sequenceNumber":"sequenceNumber","segmentUrl":"segmentUrl","sizeBytes":"sizeBytes","downloadDurationMs":"downloadDurationMs","ipAddress":"ipAddress"},"setVideoZone":{"visit.videoZone.division":"division","visit.videoZone.lineup":"lineup"},"setAccountFeatures":{"visit.account.accountFeatures.accessibility":"accessibility","visit.account.accountFeatures.boxless":"boxless","visit.account.accountFeatures.cDvr":"cDvr"},"setNetworkStatus":{"visit.connection.networkStatus":"networkStatus"},"setPageViewFeature":{"message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","message.feature.featureStepName":"featureStepName"},"pinEntry":{"message.category":"category","message.context":"context","operation.userEntry.pinType":"pinType","operation.success":"success","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","message.feature.featureStepName":"featureStepName"},"setExperimentConfigurations":{"visit.experimentUuids":"experimentUuids","visit.variantUuids":"variantUuids"},"requestToRecord":{"message.context":"context","operation.success":"success","operation.recordingOptions":"recordingOptions","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","application.error.errorCode":"errorCode","application.error.errorMessage":"errorMessage","application.error.errorExtras":"errorExtras","application.error.errorType":"errorType","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"requestToDeleteRecording":{"message.context":"context","operation.success":"success","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","application.error.errorCode":"errorCode","application.error.errorMessage":"errorMessage","application.error.errorExtras":"errorExtras","application.error.errorType":"errorType","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"checkAvailableChannels":{"state.view.currentPage.channelLineup.availableChannels":"availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels":"numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels":"numberUnavailableChannels"},"purchaseStart":{"message.context":"context","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","message.feature.featureStepName":"featureStepName"},"purchaseStop":{"message.context":"context","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.success":"success","application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","message.triggeredBy":"triggeredBy","message.feature.featureStepName":"featureStepName","application.error.errorType":"errorType","application.error.clientErrorCode":"clientErrorCode"},"switchScreen":{"message.triggeredUsing":"triggeredUsing","operation.success":"success","operation.switchScreenDirection":"switchScreenDirection","operation.switchScreenId":"switchScreenId","application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","application.error.clientErrorCode":"clientErrorCode"},"userConfigSet":{"visit.mirroring":"***PLACEHOLDER***"},"applicationActivity":{"operation.operationType":"operationType"},"forcedLogin":{"operation.operationType":"operationType"},"requestToEditRecording":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","application.error.errorType":"errorType","message.context":"context","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.recordingOptions":"recordingOptions","operation.success":"success","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"requestToDeleteReminder":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.success":"success","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"requestToEditReminder":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.success":"success","operation.reminderOptions":"reminderOptions","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"requestToRemind":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.success":"success","operation.reminderOptions":"reminderOptions","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"requestToCancelRecording":{"application.error.errorCode":"errorCode","application.error.errorExtras":"errorExtras","application.error.errorMessage":"errorMessage","application.error.errorType":"errorType","message.context":"context","message.feature.currentStep":"featureCurrentStep","message.feature.featureName":"featureName","message.feature.featureType":"featureType","message.feature.numberOfSteps":"featureNumberOfSteps","operation.success":"success","message.feature.featureStepName":"featureStepName","application.error.clientErrorCode":"clientErrorCode"},"setAutoAccessEnabled":{"visit.settings.autoAccessEnabled":"autoAccessEnabled"},"setApplicationName":{"visit.applicationDetails.applicationName":"applicationName"},"modalCancel":{"message.context":"***PLACEHOLDER***","message.triggeredBy":"***PLACEHOLDER***","state.view.modal.loadTimeMs":"***PLACEHOLDER***","state.view.modal.modalType":"***PLACEHOLDER***","state.view.modal.name":"***PLACEHOLDER***","state.view.modal.text":"***PLACEHOLDER***","state.view.currentPage.pageName":"***PLACEHOLDER***"},"displayChange":{"visit.screenResolution":"screenResolution"},"setCpuAverageUsage":{"visit.device.cpu.averageUsage":"cpuAverageUsage"},"setPlayerTestFields":{"state.playback.buffer.bufferLengthMs":"bufferLengthMs","state.playback.frames.droppedFrames":"droppedFrames","state.playback.frames.frameRate":"frameRate"}}

/***/ }),
/* 257 */
/***/ (function(module, exports) {

	module.exports = {"version":"2017-11-14:3aede363a5cb8601f143a57de1b3400e55d3be05","domain":"video","checks":{"adBreakStart":{"state.ad.adBreakNumber":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"adStart":{"state.ad.campaign":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.ad.commodityCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.ad.deviceAdId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["iOS","Android"]}],"value":true},{"value":false}]},"state.ad.id":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.ad.number":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"state.ad.title":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["iOS"]}],"value":true},{"value":false}]},"state.ad.vast":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"adStop":{"state.ad.adDurationSec":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"state.ad.adStoppedReason":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"apiCall":{"application.api.apiCached":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"value":false}]},"application.api.host":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.httpVerb":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.maxRetryCount":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.api.path":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.queryParameters":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.api.responseCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.responseText":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.api.responseTimeMs":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.retry":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.api.retryCount":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.api.serviceResult":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"application.api.traceId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["SpecGuide"],"!application.api.apiName":["adobeSession"]}],"value":true},{"value":false}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"applicationActivity":{"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["backgrounded","foregrounded"]}]}},"attemptRestart":{"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["playbackResumeSelected","playbackRestartSelected"]}]}},"checkAvailableChannels":{"state.view.currentPage.channelLineup.availableChannels":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"maxLength":[{"value":10}]},"state.view.currentPage.channelLineup.numberAvailableChannels":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.currentPage.channelLineup.numberUnavailableChannels":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"displayChange":{"visit.screenResolution":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"error":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","playback","api","generic","application","cyclops","cdvr","tdcs","deviceAvailability","msoAvailability","stream2","tvod"]}]}},"forcedLogin":{"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["manualAuth","resumeAuth","autoAccess","verifierAuth","tokenExchange"]}]}},"inVisitOauthRefresh":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"oAuthToken":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[true]}],"value":true},{"value":false}]},"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["refreshAuth","verifierAuth"]}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.login.oauthExpirationTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.account.loginCompletedTimestamp":["anullValue"]}],"value":true},{"condition":[{"operation.success":[true]}],"value":true},{"value":false}]}},"loginStart":{"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["manualAuth","autoAccess","resumeAuth","verifierAuth","tokenExchange"]}]},"operation.userEntry.text":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["manualAuth"],"visit.applicationDetails.applicationType":["OVP","Android","iOS","Roku","SpecGuide","SamsungTV"]}],"value":true},{"value":false}]}},"loginStop":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","deviceAvailability","msoAvailability"]}]},"oAuthToken":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[true]}],"value":true},{"value":false}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.login.authAttemptId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["autoAccess"]}],"value":true},{"value":false}]},"visit.login.oauthExpirationTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.account.loginCompletedTimestamp":["anullValue"]}],"value":true},{"condition":[{"operation.success":[true]}],"value":true},{"value":false}]}},"modalCancel":{"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["tvodFlow","cdvr","parentalControlFlow","dvr","onDemandFlow","rdvr","reminders","stream2"]}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"state.view.currentPage.pageName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.modal.loadTimeMs":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.modal.modalType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["options","message","error","confirmation"]}]},"state.view.modal.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.modal.text":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.view.modal.modalType":["options"]}],"value":true},{"value":false}]}},"modalView":{"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["tvodFlow","cdvr","parentalControlFlow","dvr","onDemandFlow","rdvr","reminders","stream2"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","dvr"],"state.view.modal.modalType":["options","message"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","dvr"],"state.view.modal.modalType":["options","message"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","dvr"],"state.view.modal.modalType":["options","message"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","dvr"],"state.view.modal.modalType":["options","message"]}],"value":true},{"value":false}],"min":[{"value":1}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"state.view.modal.loadTimeMs":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.modal.modalType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["error","message","notification","confirmation","options"]}]},"state.view.modal.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.modal.text":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.view.modal.modalType":["options"]}],"value":true},{"value":false}]}},"pageView":{"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["tvodFlow","cdvr","stream2","parentalControlFlow","dvr","rdvr"]}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"state.view.currentPage.appSection":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["appIntro","appLobby","apps","curatedCatalog","curatedVideoStore","dvrManager","guide","liveTv","myLibrary","preAuthentication","search","settings","stream2","termsPolicies","tvGo","error"]}]},"state.view.currentPage.billing.billDueDate":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}]},"state.view.currentPage.billing.billEndDate":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}]},"state.view.currentPage.billing.billProgress":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}]},"state.view.currentPage.billing.billStartDate":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}]},"state.view.currentPage.billing.ccVendor":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["amex","visa","masterCard","noneOnFile"]}]},"state.view.currentPage.billing.paymentMethod":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["autoPayCC","autoPayACH","manualPay"]}]},"state.view.currentPage.billing.recentCharges":{"type":[{"value":"double"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["billing"]}],"value":true},{"value":false}]},"state.view.currentPage.pageDisplayType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.currentPage.pageType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageViewType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["refresh","refocus","normal","overlayVisible"]}]},"state.view.currentPage.renderDetails.isLazyLoad":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.currentPage.settings":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"],"state.view.currentPage.pageName":["guideOptions"]}],"value":true},{"value":false}]},"state.view.currentPage.sortAndFilter.appliedFilters":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"],"state.view.currentPage.pageName":["guideOptions"]}],"value":true},{"value":false}]},"state.view.currentPage.sortAndFilter.appliedSorts":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"],"state.view.currentPage.pageName":["guideOptions"]}],"value":true},{"value":false}]}},"pinEntry":{"message.category":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["navigation","contentDiscovery"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["parentalControlFlow","tvodFlow"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"min":[{"value":1}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.userEntry.pinType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["parentalControl","purchaseControl"]}]}},"playbackBitRateDownshift":{"state.playback.bitRate.currentBitRateBps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"playbackBitRateUpshift":{"state.playback.bitRate.currentBitRateBps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"playbackFailure":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"playbackPause":{"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]}},"playbackSelect":{"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["tvodFlow","dvr"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","dvr"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","dvr"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","dvr"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","dvr"]}],"value":true},{"value":false}],"min":[{"value":1}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["playbackPlaySelected","playbackResumeSelected","playbackRestartSelected","playbackStartOverSelected"]}]},"state.content.contentClass":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["linear","slinear","ppv","tod","svod","fod","trailer","extra","dvr","cdvr"]}]},"state.content.contentFormat":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.content.contentClass":["cdvr"],"!visit.applicationDetails.applicationType":["Android"]}],"value":true},{"condition":[{"!state.content.contentClass":["cdvr"],"!visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"],"!state.view.currentPage.appSection":["myLibrary"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["HD","SD","3D"]}]},"state.content.details.runtime":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["vod"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"condition":[{"!state.content.stream.playbackType":["linear","dvr","download","other"],"!visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"],"!state.view.currentPage.appSection":["myLibrary"]}],"value":true},{"value":false}],"min":[{"value":1}]},"state.content.identifiers.dvrRecordingId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["dvr","cdvr"]}],"value":true},{"value":false}]},"state.content.identifiers.platformSeriesId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.identifiers.providerAssetId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["vod"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsGuideId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["linear"]}],"value":true},{"condition":[{"state.content.stream.playbackType":["dvr"],"visit.applicationDetails.applicationType":["iOS","Android","Xbox","Roku","SamsungTV","OVP"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsProgramId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["vod"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsSeriesId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.purchaseId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"value":false}]},"state.content.rentalDurationHours":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.contentClass":["tod"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"value":false}]},"state.content.rentalExpirationDate":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.contentClass":["tod"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"value":false}]},"state.content.stream.bookmarkPositionSec":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.closedCaptioningCapable":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.content.contentClass":["cdvr"]}],"value":true},{"value":false}]},"state.content.stream.drmType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["aes","cisco","playReady","widevine","adobePrimeTime","fairplay","other"]}]},"state.content.stream.entitled":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.content.stream.parentallyBlocked":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.content.stream.playbackType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["linear","vod","dvr","download","other"]}]},"state.content.stream.price":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.contentClass":["ppv","tod"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"value":false}]},"state.content.stream.programmerCallSign":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["linear"]}],"value":true},{"value":false}]},"state.content.stream.programmerFavorited":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.purchaseType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.contentClass":["ppv","tod"],"visit.applicationDetails.applicationType":["iOS","Xbox","Roku","SpecGuide","SamsungTV","OVP"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["buy","rent"]}]},"state.content.stream.recordingStartTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["dvr","cdvr"]}],"value":true},{"value":false}]},"state.content.stream.recordingStopTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["dvr","cdvr"]}],"value":true},{"value":false}]},"state.content.stream.sapCapable":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.content.stream.scrubbingCapability":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["none","rewind","fastforward","all"]}]},"state.content.stream.streamingFormat":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["hls","smooth","dash"]}]},"state.view.currentPage.elements.elementIndex":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.elements.elementType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["button","link"]}]},"state.view.currentPage.elements.standardizedName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.triggeredBy":["application"]}],"value":true},{"value":false}]},"state.view.currentPage.pageSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["conversionArea","guideArea","episodeListArea","liveTvArea","contentArea"]}]},"state.view.currentPage.pageSubSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"playbackStart":{"state.content.details.actualRuntime":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.content.stream.playbackType":["vod"]}],"value":true},{"value":false}],"min":[{"value":1000}]},"state.content.stream.numberOfAudioSources":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.playback.bitRate.currentBitRateBps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}]},"state.playback.heartBeat.playPointTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"playbackStop":{"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["Roku"]}],"value":true},{"value":true}],"restrictedTo":[{"value":["user","application","hdmiDisconnect","timeout"],"condition":[{"visit.applicationDetails.applicationType":["Roku"]}]},{"value":["application","user"]}]}},"playbackStreamUriAcquired":{"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.content.stream.contentUri":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[true]}],"value":true},{"value":false}]}},"playbackTrickPlayRateChange":{"state.playback.trickPlay.scrubSpeed":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Android","iOS"]}],"value":true},{"value":false}]},"state.playback.trickPlay.scrubType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Android","iOS"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["rewind","fastForward","jumpForward","jumpBack","restart"]}]}},"playbackTrickPlayStart":{"state.playback.trickPlay.scrubSpeed":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Android","iOS"]}],"value":true},{"value":false}]},"state.playback.trickPlay.scrubStartPositionSec":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.playback.trickPlay.scrubType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Android","iOS"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["rewind","fastForward","jumpForward","jumpBack","restart"]}]}},"playbackTrickPlayStop":{"state.playback.trickPlay.scrubEndPositionSec":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"playbackUnpause":{"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]}},"purchaseStart":{"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["tvodFlow","stream2"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"min":[{"value":1}]}},"purchaseStop":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false],"message.triggeredBy":["application"]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false],"message.triggeredBy":["application"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["tvod","stream2"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["tvodFlow","stream2"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow"]}],"value":true},{"value":false}],"min":[{"value":1}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToCancelRecording":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}],"restrictedTo":[{"value":["cdvr","dvr"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["cdvr","dvr"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToDeleteRecording":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}],"restrictedTo":[{"value":["cdvr","dvr"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["cdvr","dvr"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToDeleteReminder":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToEditRecording":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}],"restrictedTo":[{"value":["rdvr","dvr","cdvr"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["rdvr","dvr","cdvr"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.recordingOptions":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToEditReminder":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.reminderOptions":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToRecord":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}],"restrictedTo":[{"value":["cdvr","dvr"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["cdvr"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.recordingOptions":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"requestToRemind":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":1}]},"operation.reminderOptions":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"searched":{"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"message.triggeredUsing":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["remote","backButton"]}]},"state.search.numberOfSearchResults":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.search.queryId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.search.results":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.search.numberOfSearchResults":[0],"!visit.applicationDetails.applicationType":["iOS","Android"]}],"value":true},{"value":false}],"maxLength":[{"value":5,"condition":[{"!state.search.numberOfSearchResults":[0],"!visit.applicationDetails.applicationType":["iOS","Android"]}]}]},"state.search.resultsMs":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}],"max":[{"value":60000}]},"state.search.searchId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.search.searchResults":{"type":[{"value":"array"}],"elementType":[{"value":"object"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.search.numberOfSearchResults":[0],"!visit.applicationDetails.applicationType":["Xbox","SamsungTV","Roku","OVP","SpecGuide"]}],"value":true},{"value":false}],"maxLength":[{"value":10,"condition":[{"!state.search.numberOfSearchResults":[0],"!visit.applicationDetails.applicationType":["Xbox","SamsungTV","Roku","OVP","SpecGuide"]}]}]},"state.search.searchType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["predictive","keyword","default"]}]},"state.search.text":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Xbox"]}],"value":true},{"value":false}]}},"selectAction":{"message.category":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["navigation","search","contentDiscovery"]}]},"message.context":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["tvodFlow","cdvr","parentalControlFlow","stream2","dvr","rdvr","reminders","onDemandFlow"]}]},"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","stream2","dvr","reminders"],"state.view.modal.modalType":["options","message","aNullValue"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","stream2","dvr","reminders"],"state.view.modal.modalType":["options","message","aNullValue"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","stream2","dvr","reminders"],"state.view.modal.modalType":["options","message","aNullValue"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["tvodFlow","cdvr","stream2","dvr","reminders"],"state.view.modal.modalType":["options","message","aNullValue"]}],"value":true},{"value":false}],"min":[{"value":1}]},"message.feature.previousStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["stream2"]}],"value":true},{"value":false}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"message.triggeredUsing":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["OVP"],"message.triggeredBy":["user"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["remote","backButton","mouse","keyboard","controller","deviceVolumeControl"]}]},"operation.addOnsSelected":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"operation.billing.paymentAmount":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"operation.billing.paymentDate":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"operation.billing.paymentDueDate":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"operation.billing.paymentMethod":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["autoPayCC","autoPayACH","oneTimePayment"]}]},"operation.billing.statementAge":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["accessibilityToggle","actionTileSelect","autoDismiss","autoplayToggle","buttonClick","closedCaptionLanguage","closedCaptionStyle","closedCaptionTextSize","closedCaptionToggle","curatedSearchCastAndCrew","curatedSearchEvents","curatedSearchNetworks","curatedSearchSports","curatedSearchTeam","dataReset","doubleButtonClick","favoriteToggle","filterApplied","guideNarrationToggle","infoBarActivation","modalLaunch","navigationClick","networkSelection","parentalControlToggle","parentalControlNetworkToggle","playButtonClicked","picker","pinch","ratingRestrictionsUpdated","remoteControlClick","remoteControlBack","secondaryAudioToggle","sapToggle","searchStarted","sortApplied","swipe","toolTipLaunch","unpinch","volumeChange","watchListAdd","watchListRemove","wideScreenToggle"]}]},"operation.recordingOptions":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"message.context":["cdvr"],"message.feature.featureType":["cdvrRequestToRecord","cdvrRequestToEdit"]}],"value":true},{"value":false}]},"operation.toggleState":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["favoriteToggle","closedCaptionToggle","sapToggle","guideNarrationToggle","accessiblityToggle","wideScreenToggle","secondaryAudioToggle","parentalControlToggle","parentalControlNetworkToggle"]}],"value":true},{"value":false}]},"operation.userEntry.entryType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["picker"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["ccSettingsText","ccSettingsTextTransparency","ccSettingsFont","ccSettingsFontSize","ccSettingsFontEdge","ccSettingsBackground","ccSettingsBackgroundTransparency","ccSettingsWindow","ccSettingsWindowTransparency"]}]},"operation.userEntry.text":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["picker"]}],"value":true},{"value":false}]},"operation.userPreferenceCategory":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["ratingsLocked","networksBlocked","networkFavorites","surferGuideFiltersApplied","stream2AddOnsSelected"]}]},"operation.userPreferencesSelections":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.contentClass":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["linear","slinear","ppv","tod","svod","fod","trailer","extra","dvr","cdvr"]}]},"state.content.contentFormat":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["HD","SD","3D"]}]},"state.content.identifiers.dvrRecordingId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.identifiers.platformSeriesId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.identifiers.providerAssetId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["playButtonClicked"],"state.content.stream.playbackType":["vod"],"visit.applicationDetails.applicationType":["Android","OVP","Xbox","SamsungTv","Roku","SpecGuide"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsGuideId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["playButtonClicked"],"state.content.stream.playbackType":["linear","dvr"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsProgramId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["playButtonClicked"],"state.content.stream.playbackType":["vod"],"visit.applicationDetails.applicationType":["Android","OVP","Xbox","SamsungTv","Roku","SpecGuide"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsSeriesId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.purchaseId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.rentalDurationHours":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.rentalExpirationDate":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.bookmarkPositionSec":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.closedCaptioningCapable":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.drmType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["aes","cisco","playReady","widevine","adobePrimeTime","fairplay","other"]}]},"state.content.stream.entitled":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.parentallyBlocked":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.playbackId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.playbackType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["playButtonClicked"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["linear","vod","dvr","download","other"]}]},"state.content.stream.price":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.programmerCallSign":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.programmerFavorited":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.purchaseType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["buy","rent"]}]},"state.content.stream.recordingStartTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.recordingStopTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.sapCapable":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.stream.scrubbingCapability":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["none","rewind","fastforward","all"]}]},"state.content.stream.streamingFormat":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["hls","smooth","dash"]}]},"state.search.searchId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["searchStarted"]}],"value":true},{"value":false}]},"state.search.searchType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["searchStarted"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["predictive","keyword","default"]}]},"state.view.currentPage.elements.elementIndex":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.elements.elementIntValue":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.elements.elementStringValue":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.elements.elementType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["link","button","singleSelectCheckBox","multiSelectCheckBox","slidingMenu","toggle","boxArt","cell","autoplayTimer","volumeControl"]}]},"state.view.currentPage.elements.standardizedName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"state.view.currentPage.elements.uiName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.navigation.navGlobal.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.navigation.navPagePrimary.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["curatedCollections","episodes","info"]}]},"state.view.currentPage.navigation.navPageSecondary.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["curatedFeatured","curatedTvShows","curatedMovies","curatedKids","curatedNetworks","curatedVideoStore"]}]},"state.view.currentPage.pageSection.displayType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["contentArea","conversionArea","episodeListArea","episodeConversionArea","guideArea","guideOptionsSelectArea","loginArea","logoutArea","navGlobal","navPagePrimary","navPageSecondary","searchResultsArea","settingsSelectArea","liveTvArea"]}]},"state.view.currentPage.pageSection.numberOfItems":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.displayType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.numberOfItems":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.sortAndFilter.appliedFilters":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["filterApplied"]}],"value":true},{"value":false}]},"state.view.currentPage.sortAndFilter.appliedSorts":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["sortApplied"]}],"value":true},{"value":false}]},"state.view.modal.modalType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["options","message","error","confirmation"]}]},"state.view.modal.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"selectContent":{"message.category":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["search","navigation"]}]},"message.triggeredBy":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["user","application"]}]},"message.triggeredUsing":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["remote","backButton","controller","mouse"]}]},"operation.operationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["searchResultSelected","defaultSearchResultSelected","assetSelection","episodeSelection"]}]},"state.content.identifiers.providerAssetId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.identifiers.tmsGuideId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.content.identifiers.tmsProgramId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["assetSelection"]}],"value":true},{"value":false}]},"state.content.identifiers.tmsSeriesId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["episodeSelection"]}],"value":true},{"value":false}]},"state.content.stream.startTimestamp":{"type":[{"value":"long"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["guide"]}],"value":true},{"value":false}]},"state.search.queryId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["defaultSearchResultSelected"]}],"value":false},{"condition":[{"operation.operationType":["searchResultSelected"]}],"value":true},{"value":false}]},"state.search.selectedResultFacet":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["searchResultSelected"]}],"value":true},{"condition":[{"operation.operationType":["defaultSearchResultSelected"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["person","movie","series","sports","network","title","team","other"]}]},"state.search.selectedResultName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.operationType":["searchResultSelected"]}],"value":true},{"condition":[{"operation.operationType":["defaultSearchResultSelected"]}],"value":true},{"value":false}]},"state.view.currentPage.elements.elementIndex":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"!state.view.currentPage.pageName":["guide","liveTvMiniGuide"]}],"value":true},{"value":false}]},"state.view.currentPage.elements.elementType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["link","button","singleSelectCheckBox","multiSelectCheckBox","slidingMenu","toggle","boxArt","cell","autoplayTimer","volumeControl"]}]},"state.view.currentPage.elements.standardizedName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.elements.uiName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.navigation.navGlobal.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.navigation.navPagePrimary.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["curatedCollections","episodes","info"]}]},"state.view.currentPage.navigation.navPageSecondary.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["curatedFeatured","curatedTvShows","curatedMovies","curatedKids","curatedNetworks","curatedVideoStore"]}]},"state.view.currentPage.pageSection.displayType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["contentArea","conversionArea","episodeListArea","episodeConversionArea","guideArea","guideOptionsSelectArea","loginArea","logoutArea","navGlobal","navPagePrimary","navPageSecondary","searchResultsArea","settingsSelectArea","liveTvArea"]}]},"state.view.currentPage.pageSection.numberOfItems":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.displayType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.index":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"state.view.currentPage.pageSubSection.numberOfItems":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"setAccountFeatures":{"visit.account.accountFeatures.accessibility":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.account.accountFeatures.boxless":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.account.accountFeatures.cDvr":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"setApplicationName":{"visit.applicationDetails.applicationName":{"type":[{"value":"string"}],"allowed":[{"condition":[{"visit.applicationDetails.applicationType":["OVP"]}],"value":true},{"value":false}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["OVP"]}],"value":true},{"value":true}],"restrictedTo":[{"value":["SpecU","OneApp"],"condition":[{"visit.applicationDetails.applicationType":["OVP"]}]},{"value":["OneApp","SpecU","Spectrum Guide","TVGo","SPECNET","SMB"]}]}},"setAutoAccessEnabled":{"visit.settings.autoAccessEnabled":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"setCpuAverageUsage":{"visit.device.cpu.averageUsage":{"type":[{"value":"double"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}]}},"setExperimentConfigurations":{"visit.experimentUuids":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.variantUuids":{"type":[{"value":"array"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"setNetworkStatus":{"visit.connection.networkStatus":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["onNet","offNet","unknown"]}]}},"setPageViewFeature":{"message.feature.currentStep":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["featureTour"]},{"message.context":["tvodFlow","dvr","cdvr"]}],"value":true},{"value":false}]},"message.feature.featureName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["featureTour"]},{"message.context":["tvodFlow","dvr","cdvr"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["authentication","stream2","tvod","featureTour","featureTourFull","releaseTour","cdvr","dvr","rdvr","reminders"]}]},"message.feature.featureStepName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["selectAction_rent","purchaseStart","pinEntryParentalControl","confirmPinEntryPurchase","pinEntryPurchase","pinEntryOnDemand","rentConfirmation","purchaseStop","playbackSelect","productPage","cdvrConfirmRecord","requestToRecord","cdvrConfirmDeletion","requestToDeleteRecording","cdvrConfirmCancellation","requestToCancelRecording","cdvrConfirmEdit","requestToEditRecording","stream2SignUp","stream2Premiums","stream2AddOns","stream2FinalPrice","stream2PurchaseAgreement","stream2CancelConfirmation","stream2PurchaseConfirmation","stream2Error","stream2Packages","stream2PremiumExtras","requestToDeleteReminder","requestToEditReminder","requestToRemind","selectAction_dvrOpenSchedulingModal","setRecording","selectAction_dvrDeleteRecording","deleteRecordingConfirmation","selectAction_dvrEditRecording","editRecording","setSeriesRecording","setEpisodeRecording","cancelRecordingConfirmation","recordingConflict","selectAction_setReminderStart","setEpisodeReminder","setSeriesReminder"]}]},"message.feature.featureType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["featureTour"]},{"message.context":["tvodFlow","dvr","cdvr"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["featureTour","announcement","wizard","stream2BuyFlow","tvodPurchase","cdvrRequestToRecord","cdvrRequestToDelete","cdvrRequestToCancel","cdvrRequestToEdit","dvrRequestToRecord","dvrRequestToDelete","dvrRequestToEdit","rdvrRequestToRecord","rdvrRequestToDelete","rdvrRequestToEdit","requestToDeleteReminder","requestToEditReminder","requestToRemind"]}]},"message.feature.numberOfSteps":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"condition":[{"state.view.currentPage.pageName":["featureTour"]},{"message.context":["tvodFlow","dvr","cdvr"]}],"value":true},{"value":false}],"min":[{"value":1}]}},"setPlayerTestFields":{"state.playback.buffer.bufferLengthMs":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}]},"state.playback.frames.droppedFrames":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}]},"state.playback.frames.frameRate":{"type":[{"value":"int"}],"allowed":[{"value":true}],"required":[{"value":true}],"min":[{"value":0}]}},"setSegment":{"isAd":{"type":[{"value":"boolean"}]},"queryParameters":{"type":[{"value":"string"}]},"sequenceNumber":{"type":[{"value":"int"}],"required":[{"value":true}]},"segmentUrl":{"type":[{"value":"string"}],"required":[{"value":true}]},"sizeBytes":{"type":[{"value":"int"}],"required":[{"value":true}]},"downloadDurationMs":{"type":[{"value":"int"}],"required":[{"value":true}]},"ipAddress":{"type":[{"value":"string"}]}},"setVideoZone":{"visit.videoZone.division":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.videoZone.lineup":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"startSession":{"customer":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["Charter"]}]},"domain":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.account.accountNumber":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.account.loginCompletedTimestamp":["anullValue"]}],"value":true},{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"value":false}]},"visit.applicationDetails.appDisplayDefinition":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["sd","hd"]}]},"visit.applicationDetails.appVersion":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.applicationDetails.applicationName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["OneApp","SpecU","Spectrum Guide","TVGo","SPECNET","SMB"]}]},"visit.applicationDetails.applicationType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["OVP","Android","Xbox","Xbox360","iOS","Roku","SpecGuide","SamsungTV","TVGo","SPECNET","SMB"]}]},"visit.applicationDetails.drmEnabled":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.applicationDetails.environment":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.applicationDetails.environment.environmentName":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["prod","dev","sita","sitb","pidev","staging","reno","virtual-dev","virtual-qa","pistaging","figaro-prod"]}]},"visit.applicationDetails.referrerLink":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.applicationDetails.referrerLocation":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.connection.connectionType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Roku","Android","iOS"]}],"value":true},{"value":false}],"restrictedTo":[{"value":["wifi","wired","cell","offline","unknown"]}]},"visit.connection.networkCellCarrier":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["jio","cricket","sprint","airtel","t-mobile","verizon","at&t","boost","airtel","jio 4g","verizon wireless","vodafone in","unknown","idea"]}]},"visit.connection.networkCellNetworkType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["lte","4g","3g","hsdpa","hspa","ehrpd","evod","gprs","hspa+","hsupa","umts","unknown","edge"]}]},"visit.device.availableStorage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.device.deviceBuild":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SamsungTV"]}],"value":true},{"value":false}]},"visit.device.deviceFormFactor":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["pc","phone","tablet","tv"]}]},"visit.device.deviceType":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["iPhone","iPad","iPod touch","simulator","iPhone Simulator","iPad Simulator","androidTablet","androidPhone","webBrowser","stb","roku","xbox","xbox360","samsungTV","uwp"]}]},"visit.device.linkedDevice.id":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.device.linkedDevice.name":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.device.manufacturer":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["Android"]}],"value":true},{"value":false}]},"visit.device.model":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.device.operatingSystem":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]},"visit.device.usedStorage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.device.uuid":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"!visit.applicationDetails.applicationType":["Roku","Android","iOS"]}],"value":true},{"value":false}]},"visit.device.vendorId":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.externalApps":{"type":[{"value":"array"}],"elementType":[{"value":"object"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"condition":[{"visit.applicationDetails.applicationType":["SpecGuide"]}],"value":true},{"value":false}]},"visit.previousVisitId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.screenResolution":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.settings":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.talkingGuide":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]},"visit.thirdPartyAccess.requesterId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationName":["TVGo"]}],"value":true},{"value":false}]},"visit.thirdPartyAccess.resourceId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"visit.applicationDetails.applicationName":["TVGo"]}],"value":true},{"value":false}]},"visit.visitId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]}},"switchScreen":{"application.error.clientErrorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorCode":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"condition":[{"operation.success":[false]}],"value":true},{"value":false}]},"application.error.errorExtras":{"type":[{"value":"map"}],"elementType":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"application.error.errorMessage":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}]},"message.triggeredUsing":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":false}],"restrictedTo":[{"value":["remote"]}]},"operation.success":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":true}]},"operation.switchScreenDirection":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}],"restrictedTo":[{"value":["toTv"]}]},"operation.switchScreenId":{"type":[{"value":"string"}],"allowed":[{"value":true}],"required":[{"value":true}]}},"userConfigSet":{"visit.mirroring":{"type":[{"value":"boolean"}],"allowed":[{"value":true}],"required":[{"value":false}]}}},"fields":{"adBreakStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"adBreakStop":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"adStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.campaign","state.ad.commodityCode","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.ad.vast","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"adStop":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"apiCall":["application.api.apiCached","application.api.host","application.api.httpVerb","application.api.maxRetryCount","application.api.path","application.api.queryParameters","application.api.responseCode","application.api.responseText","application.api.responseTimeMs","application.api.retry","application.api.retryCount","application.api.serviceResult","application.api.traceId","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"applicationActivity":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"attemptRestart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"bufferingStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"bufferingStop":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.bufferingTimeMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"checkAvailableChannels":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"displayChange":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"error":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"forcedLogin":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"inVisitOauthRefresh":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"loginStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.userEntry.entryType","operation.userEntry.text","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"loginStop":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.success","operation.userEntry.entryType","operation.userEntry.text","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"logout":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"modalCancel":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"modalView":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"pageView":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"pinEntry":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackBitRateDownshift":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackBitRateUpshift":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.ad.adBreakElapsedMs","state.ad.adBreakNumber","state.ad.adBreakStartPositionSec","state.ad.adBreakStartTimestamp","state.ad.adDurationSec","state.ad.adElapsedMs","state.ad.adStoppedReason","state.ad.deviceAdId","state.ad.id","state.ad.number","state.ad.startTimestamp","state.ad.title","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackExitBeforeStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackFailure":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.success","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackHeartbeat":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackPause":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackSelect":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackStop":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackStreamUriAcquired":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.success","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackTrickPlayRateChange":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.trickPlay.scrubEndPositionSec","state.playback.trickPlay.scrubSpeed","state.playback.trickPlay.scrubStartPositionSec","state.playback.trickPlay.scrubType","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackTrickPlayStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.trickPlay.scrubEndPositionSec","state.playback.trickPlay.scrubSpeed","state.playback.trickPlay.scrubStartPositionSec","state.playback.trickPlay.scrubType","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackTrickPlayStop":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.trickPlay.scrubEndPositionSec","state.playback.trickPlay.scrubSpeed","state.playback.trickPlay.scrubStartPositionSec","state.playback.trickPlay.scrubType","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"playbackUnpause":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.playback.bitRate.contentElapsedAtCurrentBitRateMs","state.playback.bitRate.contentElapsedAtPreviousBitRateMs","state.playback.bitRate.currentBitRateBps","state.playback.bitRate.previousBitRateBps","state.playback.buffer.bufferLengthMs","state.playback.frames.droppedFrames","state.playback.frames.frameRate","state.playback.heartBeat.clockTimeElapsedMs","state.playback.heartBeat.contentElapsedMs","state.playback.heartBeat.playPointTimestamp","state.playback.playbackSelectedTimestamp","state.playback.playbackStartedTimestamp","state.playback.segmentInfo","state.playback.tuneTimeMs","state.playback.uriObtainedMs","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"purchaseStart":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"purchaseStop":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToCancelRecording":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToDeleteRecording":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToDeleteReminder":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","operation.success","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToEditRecording":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToEditReminder":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToRecord":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"requestToRemind":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"searchClosed":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.search.numberOfSearchResults","state.search.queryId","state.search.results","state.search.resultsMs","state.search.searchId","state.search.searchResults","state.search.searchType","state.search.selectedResultFacet","state.search.selectedResultName","state.search.text","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"searched":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.search.numberOfSearchResults","state.search.queryId","state.search.results","state.search.resultsMs","state.search.searchId","state.search.searchResults","state.search.searchType","state.search.selectedResultFacet","state.search.selectedResultName","state.search.text","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"selectAction":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.billing.paymentAmount","operation.billing.paymentDate","operation.billing.paymentDueDate","operation.billing.paymentMethod","operation.billing.statementAge","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.content.contentClass","state.content.contentFormat","state.content.details.actualRuntime","state.content.details.runtime","state.content.identifiers.dvrRecordingId","state.content.identifiers.platformSeriesId","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.purchaseId","state.content.rentalDurationHours","state.content.rentalExpirationDate","state.content.stream.bookmarkPositionSec","state.content.stream.closedCaptioningCapable","state.content.stream.contentUri","state.content.stream.drmType","state.content.stream.entitled","state.content.stream.numberOfAudioSources","state.content.stream.parentallyBlocked","state.content.stream.playbackId","state.content.stream.playbackType","state.content.stream.price","state.content.stream.programmerCallSign","state.content.stream.programmerFavorited","state.content.stream.purchaseType","state.content.stream.recordingStartTimestamp","state.content.stream.recordingStopTimestamp","state.content.stream.sapCapable","state.content.stream.scrubbingCapability","state.content.stream.streamingFormat","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.search.numberOfSearchResults","state.search.queryId","state.search.results","state.search.resultsMs","state.search.searchId","state.search.searchResults","state.search.searchType","state.search.selectedResultFacet","state.search.selectedResultName","state.search.text","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"selectContent":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.operationType","state.content.identifiers.providerAssetId","state.content.identifiers.tmsGuideId","state.content.identifiers.tmsProgramId","state.content.identifiers.tmsSeriesId","state.content.stream.startTimestamp","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.search.numberOfSearchResults","state.search.queryId","state.search.results","state.search.resultsMs","state.search.searchId","state.search.searchResults","state.search.searchType","state.search.selectedResultFacet","state.search.selectedResultName","state.search.text","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"startSession":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"switchScreen":["application.error.clientErrorCode","application.error.errorCode","application.error.errorExtras","application.error.errorMessage","application.error.errorType","message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","operation.addOnsSelected","operation.dvrOperation","operation.operationType","operation.recordingOptions","operation.reminderOptions","operation.success","operation.switchScreenDirection","operation.switchScreenId","operation.toggleState","operation.userEntry.entryType","operation.userEntry.pinType","operation.userEntry.text","operation.userPreferenceCategory","operation.userPreferencesSelections","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"],"userConfigSet":["message.category","message.context","message.feature.completedSteps","message.feature.currentStep","message.feature.featureName","message.feature.featureStepChanged","message.feature.featureStepName","message.feature.featureType","message.feature.numberOfSteps","message.feature.previousStep","message.feature.transactionId","message.name","message.sequenceNumber","message.timestamp","message.triggeredBy","message.triggeredUsing","state.currentVideoPosition","state.entryTimestamp","state.entryVideoPosition","state.name","state.previousState.entryTimestamp","state.previousState.entryVideoPosition","state.previousState.exitTimestamp","state.previousState.exitVideoPosition","state.previousState.name","state.view.currentPage.appSection","state.view.currentPage.billing.billDueDate","state.view.currentPage.billing.billEndDate","state.view.currentPage.billing.billProgress","state.view.currentPage.billing.billStartDate","state.view.currentPage.billing.ccVendor","state.view.currentPage.billing.paymentMethod","state.view.currentPage.billing.recentCharges","state.view.currentPage.channelLineup.availableChannels","state.view.currentPage.channelLineup.numberAvailableChannels","state.view.currentPage.channelLineup.numberUnavailableChannels","state.view.currentPage.elements.elementIndex","state.view.currentPage.elements.elementIntValue","state.view.currentPage.elements.elementStringValue","state.view.currentPage.elements.elementType","state.view.currentPage.elements.entitledItems","state.view.currentPage.elements.numberOfItems","state.view.currentPage.elements.parentallyBlockedItems","state.view.currentPage.elements.selectedOptions","state.view.currentPage.elements.standardizedName","state.view.currentPage.elements.uiName","state.view.currentPage.navigation.navGlobal.name","state.view.currentPage.navigation.navPagePrimary.name","state.view.currentPage.navigation.navPageSecondary.name","state.view.currentPage.pageDisplayType","state.view.currentPage.pageId","state.view.currentPage.pageName","state.view.currentPage.pageSection.displayType","state.view.currentPage.pageSection.index","state.view.currentPage.pageSection.name","state.view.currentPage.pageSection.numberOfItems","state.view.currentPage.pageSequenceNumber","state.view.currentPage.pageSubSection.displayType","state.view.currentPage.pageSubSection.index","state.view.currentPage.pageSubSection.name","state.view.currentPage.pageSubSection.numberOfItems","state.view.currentPage.pageType","state.view.currentPage.pageViewType","state.view.currentPage.renderDetails.fullyRenderedMs","state.view.currentPage.renderDetails.fullyRenderedTimestamp","state.view.currentPage.renderDetails.isLazyLoad","state.view.currentPage.renderDetails.partialRenderedMs","state.view.currentPage.renderDetails.partialRenderedTimestamp","state.view.currentPage.renderDetails.renderInitTimestamp","state.view.currentPage.renderDetails.viewRenderedStatus","state.view.currentPage.settings","state.view.currentPage.sortAndFilter.appliedFilters","state.view.currentPage.sortAndFilter.appliedSorts","state.view.mirroring","state.view.modal.loadTimeMs","state.view.modal.modalType","state.view.modal.name","state.view.modal.text","state.view.previousPage.appSection","state.view.previousPage.pageDisplayType","state.view.previousPage.pageId","state.view.previousPage.pageName","state.view.previousPage.pageSection.displayType","state.view.previousPage.pageSection.index","state.view.previousPage.pageSection.name","state.view.previousPage.pageSection.numberOfItems","state.view.previousPage.pageSequenceNumber","state.view.previousPage.pageSubSection.displayType","state.view.previousPage.pageSubSection.index","state.view.previousPage.pageSubSection.name","state.view.previousPage.pageSubSection.numberOfItems","state.view.previousPage.pageType","state.view.previousPage.pageViewType","state.view.previousPage.pageViewedTimeMs","state.view.previousPage.settings","state.view.previousPage.sortAndFilter.appliedFilters","state.view.previousPage.sortAndFilter.appliedSorts"]}}

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21),
	    root = __webpack_require__(11);
	
	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');
	
	module.exports = DataView;


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(313),
	    hashDelete = __webpack_require__(314),
	    hashGet = __webpack_require__(315),
	    hashHas = __webpack_require__(316),
	    hashSet = __webpack_require__(317);
	
	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	
	module.exports = Hash;


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21),
	    root = __webpack_require__(11);
	
	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');
	
	module.exports = Promise;


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21),
	    root = __webpack_require__(11);
	
	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');
	
	module.exports = Set;


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(76),
	    setCacheAdd = __webpack_require__(341),
	    setCacheHas = __webpack_require__(342);
	
	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;
	
	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}
	
	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	
	module.exports = SetCache;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(11);
	
	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;
	
	module.exports = Uint8Array;


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(21),
	    root = __webpack_require__(11);
	
	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');
	
	module.exports = WeakMap;


/***/ }),
/* 265 */
/***/ (function(module, exports) {

	/**
	 * Adds the key-value `pair` to `map`.
	 *
	 * @private
	 * @param {Object} map The map to modify.
	 * @param {Array} pair The key-value pair to add.
	 * @returns {Object} Returns `map`.
	 */
	function addMapEntry(map, pair) {
	  // Don't return `map.set` because it's not chainable in IE 11.
	  map.set(pair[0], pair[1]);
	  return map;
	}
	
	module.exports = addMapEntry;


/***/ }),
/* 266 */
/***/ (function(module, exports) {

	/**
	 * Adds `value` to `set`.
	 *
	 * @private
	 * @param {Object} set The set to modify.
	 * @param {*} value The value to add.
	 * @returns {Object} Returns `set`.
	 */
	function addSetEntry(set, value) {
	  // Don't return `set.add` because it's not chainable in IE 11.
	  set.add(value);
	  return set;
	}
	
	module.exports = addSetEntry;


/***/ }),
/* 267 */
/***/ (function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ }),
/* 268 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;
	
	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}
	
	module.exports = arrayEach;


/***/ }),
/* 269 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];
	
	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = arrayFilter;


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(128);
	
	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}
	
	module.exports = arrayIncludes;


/***/ }),
/* 271 */
/***/ (function(module, exports) {

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array == null ? 0 : array.length;
	
	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}
	
	module.exports = arrayIncludesWith;


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(36),
	    keys = __webpack_require__(94);
	
	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && copyObject(source, keys(source), object);
	}
	
	module.exports = baseAssign;


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(36),
	    keysIn = __webpack_require__(51);
	
	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
	  return object && copyObject(source, keysIn(source), object);
	}
	
	module.exports = baseAssignIn;


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(121),
	    arrayEach = __webpack_require__(268),
	    assignValue = __webpack_require__(79),
	    baseAssign = __webpack_require__(272),
	    baseAssignIn = __webpack_require__(273),
	    cloneBuffer = __webpack_require__(130),
	    copyArray = __webpack_require__(84),
	    copySymbols = __webpack_require__(301),
	    copySymbolsIn = __webpack_require__(302),
	    getAllKeys = __webpack_require__(307),
	    getAllKeysIn = __webpack_require__(308),
	    getTag = __webpack_require__(310),
	    initCloneArray = __webpack_require__(318),
	    initCloneByTag = __webpack_require__(319),
	    initCloneObject = __webpack_require__(135),
	    isArray = __webpack_require__(13),
	    isBuffer = __webpack_require__(89),
	    isObject = __webpack_require__(14),
	    keys = __webpack_require__(94);
	
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_FLAT_FLAG = 2,
	    CLONE_SYMBOLS_FLAG = 4;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;
	
	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, bitmask, customizer, key, object, stack) {
	  var result,
	      isDeep = bitmask & CLONE_DEEP_FLAG,
	      isFlat = bitmask & CLONE_FLAT_FLAG,
	      isFull = bitmask & CLONE_SYMBOLS_FLAG;
	
	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;
	
	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      result = (isFlat || isFunc) ? {} : initCloneObject(value);
	      if (!isDeep) {
	        return isFlat
	          ? copySymbolsIn(value, baseAssignIn(result, value))
	          : copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, baseClone, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);
	
	  var keysFunc = isFull
	    ? (isFlat ? getAllKeysIn : getAllKeys)
	    : (isFlat ? keysIn : keys);
	
	  var props = isArr ? undefined : keysFunc(value);
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	  });
	  return result;
	}
	
	module.exports = baseClone;


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	
	/** Built-in value references. */
	var objectCreate = Object.create;
	
	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());
	
	module.exports = baseCreate;


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(262),
	    arrayIncludes = __webpack_require__(270),
	    arrayIncludesWith = __webpack_require__(271),
	    arrayMap = __webpack_require__(77),
	    baseUnary = __webpack_require__(82),
	    cacheHas = __webpack_require__(295);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * The base implementation of methods like `_.difference` without support
	 * for excluding multiple arrays or iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      isCommon = true,
	      length = array.length,
	      result = [],
	      valuesLength = values.length;
	
	  if (!length) {
	    return result;
	  }
	  if (iteratee) {
	    values = arrayMap(values, baseUnary(iteratee));
	  }
	  if (comparator) {
	    includes = arrayIncludesWith;
	    isCommon = false;
	  }
	  else if (values.length >= LARGE_ARRAY_SIZE) {
	    includes = cacheHas;
	    isCommon = false;
	    values = new SetCache(values);
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee == null ? value : iteratee(value);
	
	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === computed) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (!includes(values, computed, comparator)) {
	      result.push(value);
	    }
	  }
	  return result;
	}
	
	module.exports = baseDifference;


/***/ }),
/* 277 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);
	
	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseFindIndex;


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(305);
	
	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ }),
/* 279 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}
	
	module.exports = baseHasIn;


/***/ }),
/* 280 */
/***/ (function(module, exports) {

	/**
	 * This function is like `baseIndexOf` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOfWith(array, value, fromIndex, comparator) {
	  var index = fromIndex - 1,
	      length = array.length;
	
	  while (++index < length) {
	    if (comparator(array[index], value)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseIndexOfWith;


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(25),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	
	module.exports = baseIsArguments;


/***/ }),
/* 282 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}
	
	module.exports = baseIsNaN;


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(90),
	    isMasked = __webpack_require__(324),
	    isObject = __webpack_require__(14),
	    toSource = __webpack_require__(139);
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	module.exports = baseIsNative;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(25),
	    isLength = __webpack_require__(91),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;
	
	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	
	module.exports = baseIsTypedArray;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(87),
	    nativeKeys = __webpack_require__(337);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = baseKeys;


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14),
	    isPrototype = __webpack_require__(87),
	    nativeKeysIn = __webpack_require__(338);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];
	
	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = baseKeysIn;


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(121),
	    assignMergeValue = __webpack_require__(124),
	    baseFor = __webpack_require__(278),
	    baseMergeDeep = __webpack_require__(288),
	    isObject = __webpack_require__(14),
	    keysIn = __webpack_require__(51);
	
	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    if (isObject(srcValue)) {
	      stack || (stack = new Stack);
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
	        : undefined;
	
	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}
	
	module.exports = baseMerge;


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	var assignMergeValue = __webpack_require__(124),
	    cloneBuffer = __webpack_require__(130),
	    cloneTypedArray = __webpack_require__(131),
	    copyArray = __webpack_require__(84),
	    initCloneObject = __webpack_require__(135),
	    isArguments = __webpack_require__(49),
	    isArray = __webpack_require__(13),
	    isArrayLikeObject = __webpack_require__(143),
	    isBuffer = __webpack_require__(89),
	    isFunction = __webpack_require__(90),
	    isObject = __webpack_require__(14),
	    isPlainObject = __webpack_require__(92),
	    isTypedArray = __webpack_require__(144),
	    toPlainObject = __webpack_require__(360);
	
	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = object[key],
	      srcValue = source[key],
	      stacked = stack.get(srcValue);
	
	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;
	
	  var isCommon = newValue === undefined;
	
	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
	
	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}
	
	module.exports = baseMergeDeep;


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	var basePickBy = __webpack_require__(290),
	    hasIn = __webpack_require__(355);
	
	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick(object, paths) {
	  return basePickBy(object, paths, function(value, path) {
	    return hasIn(object, path);
	  });
	}
	
	module.exports = basePick;


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(126),
	    baseSet = __webpack_require__(129),
	    castPath = __webpack_require__(44);
	
	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy(object, paths, predicate) {
	  var index = -1,
	      length = paths.length,
	      result = {};
	
	  while (++index < length) {
	    var path = paths[index],
	        value = baseGet(object, path);
	
	    if (predicate(value, path)) {
	      baseSet(result, castPath(path, object), value);
	    }
	  }
	  return result;
	}
	
	module.exports = basePickBy;


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(77),
	    baseIndexOf = __webpack_require__(128),
	    baseIndexOfWith = __webpack_require__(280),
	    baseUnary = __webpack_require__(82),
	    copyArray = __webpack_require__(84);
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype;
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/**
	 * The base implementation of `_.pullAllBy` without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to remove.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns `array`.
	 */
	function basePullAll(array, values, iteratee, comparator) {
	  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
	      index = -1,
	      length = values.length,
	      seen = array;
	
	  if (array === values) {
	    values = copyArray(values);
	  }
	  if (iteratee) {
	    seen = arrayMap(array, baseUnary(iteratee));
	  }
	  while (++index < length) {
	    var fromIndex = 0,
	        value = values[index],
	        computed = iteratee ? iteratee(value) : value;
	
	    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
	      if (seen !== array) {
	        splice.call(seen, fromIndex, 1);
	      }
	      splice.call(array, fromIndex, 1);
	    }
	  }
	  return array;
	}
	
	module.exports = basePullAll;


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(352),
	    defineProperty = __webpack_require__(132),
	    identity = __webpack_require__(142);
	
	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};
	
	module.exports = baseSetToString;


/***/ }),
/* 293 */
/***/ (function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(35),
	    arrayMap = __webpack_require__(77),
	    isArray = __webpack_require__(13),
	    isSymbol = __webpack_require__(93);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	module.exports = baseToString;


/***/ }),
/* 295 */
/***/ (function(module, exports) {

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}
	
	module.exports = cacheHas;


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(83);
	
	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}
	
	module.exports = cloneDataView;


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

	var addMapEntry = __webpack_require__(265),
	    arrayReduce = __webpack_require__(123),
	    mapToArray = __webpack_require__(335);
	
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1;
	
	/**
	 * Creates a clone of `map`.
	 *
	 * @private
	 * @param {Object} map The map to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned map.
	 */
	function cloneMap(map, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
	  return arrayReduce(array, addMapEntry, new map.constructor);
	}
	
	module.exports = cloneMap;


/***/ }),
/* 298 */
/***/ (function(module, exports) {

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;
	
	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}
	
	module.exports = cloneRegExp;


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

	var addSetEntry = __webpack_require__(266),
	    arrayReduce = __webpack_require__(123),
	    setToArray = __webpack_require__(343);
	
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1;
	
	/**
	 * Creates a clone of `set`.
	 *
	 * @private
	 * @param {Object} set The set to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned set.
	 */
	function cloneSet(set, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
	  return arrayReduce(array, addSetEntry, new set.constructor);
	}
	
	module.exports = cloneSet;


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(35);
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
	
	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}
	
	module.exports = cloneSymbol;


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(36),
	    getSymbols = __webpack_require__(86);
	
	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return copyObject(source, getSymbols(source), object);
	}
	
	module.exports = copySymbols;


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(36),
	    getSymbolsIn = __webpack_require__(134);
	
	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn(source, object) {
	  return copyObject(source, getSymbolsIn(source), object);
	}
	
	module.exports = copySymbolsIn;


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

	var root = __webpack_require__(11);
	
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];
	
	module.exports = coreJsData;


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(81),
	    isIterateeCall = __webpack_require__(321);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ }),
/* 305 */
/***/ (function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;
	
	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

	var flatten = __webpack_require__(354),
	    overRest = __webpack_require__(137),
	    setToString = __webpack_require__(138);
	
	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest(func) {
	  return setToString(overRest(func, undefined, flatten), func + '');
	}
	
	module.exports = flatRest;


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetAllKeys = __webpack_require__(127),
	    getSymbols = __webpack_require__(86),
	    keys = __webpack_require__(94);
	
	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}
	
	module.exports = getAllKeys;


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

	var baseGetAllKeys = __webpack_require__(127),
	    getSymbolsIn = __webpack_require__(134),
	    keysIn = __webpack_require__(51);
	
	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}
	
	module.exports = getAllKeysIn;


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(35);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];
	
	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}
	
	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}
	
	module.exports = getRawTag;


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

	var DataView = __webpack_require__(258),
	    Map = __webpack_require__(75),
	    Promise = __webpack_require__(260),
	    Set = __webpack_require__(261),
	    WeakMap = __webpack_require__(264),
	    baseGetTag = __webpack_require__(25),
	    toSource = __webpack_require__(139);
	
	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';
	
	var dataViewTag = '[object DataView]';
	
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);
	
	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;
	
	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = baseGetTag(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';
	
	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}
	
	module.exports = getTag;


/***/ }),
/* 311 */
/***/ (function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	module.exports = getValue;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(44),
	    isArguments = __webpack_require__(49),
	    isArray = __webpack_require__(13),
	    isIndex = __webpack_require__(46),
	    isLength = __webpack_require__(91),
	    toKey = __webpack_require__(88);
	
	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = castPath(path, object);
	
	  var index = -1,
	      length = path.length,
	      result = false;
	
	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}
	
	module.exports = hasPath;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}
	
	module.exports = hashClear;


/***/ }),
/* 314 */
/***/ (function(module, exports) {

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}
	
	module.exports = hashDelete;


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}
	
	module.exports = hashGet;


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}
	
	module.exports = hashHas;


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(47);
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}
	
	module.exports = hashSet;


/***/ }),
/* 318 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = array.constructor(length);
	
	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}
	
	module.exports = initCloneArray;


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(83),
	    cloneDataView = __webpack_require__(296),
	    cloneMap = __webpack_require__(297),
	    cloneRegExp = __webpack_require__(298),
	    cloneSet = __webpack_require__(299),
	    cloneSymbol = __webpack_require__(300),
	    cloneTypedArray = __webpack_require__(131);
	
	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, cloneFunc, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return cloneArrayBuffer(object);
	
	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);
	
	    case dataViewTag:
	      return cloneDataView(object, isDeep);
	
	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      return cloneTypedArray(object, isDeep);
	
	    case mapTag:
	      return cloneMap(object, isDeep, cloneFunc);
	
	    case numberTag:
	    case stringTag:
	      return new Ctor(object);
	
	    case regexpTag:
	      return cloneRegExp(object);
	
	    case setTag:
	      return cloneSet(object, isDeep, cloneFunc);
	
	    case symbolTag:
	      return cloneSymbol(object);
	  }
	}
	
	module.exports = initCloneByTag;


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(35),
	    isArguments = __webpack_require__(49),
	    isArray = __webpack_require__(13);
	
	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
	
	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}
	
	module.exports = isFlattenable;


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(48),
	    isArrayLike = __webpack_require__(50),
	    isIndex = __webpack_require__(46),
	    isObject = __webpack_require__(14);
	
	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(13),
	    isSymbol = __webpack_require__(93);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}
	
	module.exports = isKey;


/***/ }),
/* 323 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}
	
	module.exports = isKeyable;


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(303);
	
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());
	
	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}
	
	module.exports = isMasked;


/***/ }),
/* 325 */
/***/ (function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}
	
	module.exports = listCacheClear;


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(43);
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype;
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}
	
	module.exports = listCacheDelete;


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(43);
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	module.exports = listCacheGet;


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(43);
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	module.exports = listCacheHas;


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(43);
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	module.exports = listCacheSet;


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(259),
	    ListCache = __webpack_require__(42),
	    Map = __webpack_require__(75);
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}
	
	module.exports = mapCacheClear;


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(45);
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}
	
	module.exports = mapCacheDelete;


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(45);
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}
	
	module.exports = mapCacheGet;


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(45);
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}
	
	module.exports = mapCacheHas;


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(45);
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;
	
	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}
	
	module.exports = mapCacheSet;


/***/ }),
/* 335 */
/***/ (function(module, exports) {

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);
	
	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}
	
	module.exports = mapToArray;


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(356);
	
	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;
	
	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });
	
	  var cache = result.cache;
	  return result;
	}
	
	module.exports = memoizeCapped;


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(136);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);
	
	module.exports = nativeKeys;


/***/ }),
/* 338 */
/***/ (function(module, exports) {

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = nativeKeysIn;


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(133);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;
	
	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());
	
	module.exports = nodeUtil;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(97)(module)))

/***/ }),
/* 340 */
/***/ (function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ }),
/* 341 */
/***/ (function(module, exports) {

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}
	
	module.exports = setCacheAdd;


/***/ }),
/* 342 */
/***/ (function(module, exports) {

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}
	
	module.exports = setCacheHas;


/***/ }),
/* 343 */
/***/ (function(module, exports) {

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);
	
	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}
	
	module.exports = setToArray;


/***/ }),
/* 344 */
/***/ (function(module, exports) {

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;
	
	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;
	
	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);
	
	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}
	
	module.exports = shortOut;


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(42);
	
	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	  this.size = 0;
	}
	
	module.exports = stackClear;


/***/ }),
/* 346 */
/***/ (function(module, exports) {

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);
	
	  this.size = data.size;
	  return result;
	}
	
	module.exports = stackDelete;


/***/ }),
/* 347 */
/***/ (function(module, exports) {

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}
	
	module.exports = stackGet;


/***/ }),
/* 348 */
/***/ (function(module, exports) {

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}
	
	module.exports = stackHas;


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(42),
	    Map = __webpack_require__(75),
	    MapCache = __webpack_require__(76);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache) {
	    var pairs = data.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}
	
	module.exports = stackSet;


/***/ }),
/* 350 */
/***/ (function(module, exports) {

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;
	
	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = strictIndexOf;


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

	var memoizeCapped = __webpack_require__(336);
	
	/** Used to match property names within property paths. */
	var reLeadingDot = /^\./,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoizeCapped(function(string) {
	  var result = [];
	  if (reLeadingDot.test(string)) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});
	
	module.exports = stringToPath;


/***/ }),
/* 352 */
/***/ (function(module, exports) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	module.exports = constant;


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

	var baseDifference = __webpack_require__(276),
	    baseFlatten = __webpack_require__(125),
	    baseRest = __webpack_require__(81),
	    isArrayLikeObject = __webpack_require__(143);
	
	/**
	 * Creates an array of `array` values not included in the other given arrays
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons. The order and references of result values are
	 * determined by the first array.
	 *
	 * **Note:** Unlike `_.pullAll`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {...Array} [values] The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @see _.without, _.xor
	 * @example
	 *
	 * _.difference([2, 1], [2, 3]);
	 * // => [1]
	 */
	var difference = baseRest(function(array, values) {
	  return isArrayLikeObject(array)
	    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
	    : [];
	});
	
	module.exports = difference;


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

	var baseFlatten = __webpack_require__(125);
	
	/**
	 * Flattens `array` a single level deep.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, [3, [4]], 5]]);
	 * // => [1, 2, [3, [4]], 5]
	 */
	function flatten(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? baseFlatten(array, 1) : [];
	}
	
	module.exports = flatten;


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(279),
	    hasPath = __webpack_require__(312);
	
	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}
	
	module.exports = hasIn;


/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(76);
	
	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;
	
	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}
	
	// Expose `MapCache`.
	memoize.Cache = MapCache;
	
	module.exports = memoize;


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(81),
	    pullAll = __webpack_require__(358);
	
	/**
	 * Removes all given values from `array` using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
	 * to remove elements from an array by predicate.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.0.0
	 * @category Array
	 * @param {Array} array The array to modify.
	 * @param {...*} [values] The values to remove.
	 * @returns {Array} Returns `array`.
	 * @example
	 *
	 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
	 *
	 * _.pull(array, 'a', 'c');
	 * console.log(array);
	 * // => ['b', 'b']
	 */
	var pull = baseRest(pullAll);
	
	module.exports = pull;


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

	var basePullAll = __webpack_require__(291);
	
	/**
	 * This method is like `_.pull` except that it accepts an array of values to remove.
	 *
	 * **Note:** Unlike `_.difference`, this method mutates `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Array
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to remove.
	 * @returns {Array} Returns `array`.
	 * @example
	 *
	 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
	 *
	 * _.pullAll(array, ['a', 'c']);
	 * console.log(array);
	 * // => ['b', 'b']
	 */
	function pullAll(array, values) {
	  return (array && array.length && values && values.length)
	    ? basePullAll(array, values)
	    : array;
	}
	
	module.exports = pullAll;


/***/ }),
/* 359 */
/***/ (function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(36),
	    keysIn = __webpack_require__(51);
	
	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}
	
	module.exports = toPlainObject;


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(294);
	
	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}
	
	module.exports = toString;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=analytics.js.map