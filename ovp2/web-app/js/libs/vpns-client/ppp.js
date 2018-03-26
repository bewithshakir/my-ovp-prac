/*!
 * PPP - A slim promise implementation
 * Copyright (c) 2015 David Braden V, <neonphog@neonphog.com>
 * Offered for use under the MIT open source license
 * @license http://opensource.org/licenses/MIT
 */

(function (__factory, __root) {

  if (typeof define == 'function' && define.amd) {
    define(['exports'], function (__exports) {
      __factory(__exports, __root);
    });
  } else if (typeof exports != 'undefined') {
    __factory(exports, __root);
  } else {
    var orig = __root.ppp;
    __root.ppp = {
      noConflict: function () {
        __root.ppp = orig;
        return this;
      }
    };
    __factory(__root.ppp, __root);
  }

}(function (__exports, __root) {
  'use strict';

  /*
   * The goals of this project:
   *   - to provide a simple, no-frills, compliant promise implementation.
   *   - to limit the use of closure scope / function binding in an effort to
   *     lower memory thrashing in projects that make extensive promise use.
   *   - to provide a measure of debug-ability despite asynchronous execution.
   */

  __exports.version =
  // VERSION:START
  "0.8.6"
  // VERSION:END
  ;

  // debug stacktracing - if true, trace stacks through async triggers
  var _debugStackTrace = false;

  var _hasStacks = false;
  try {
    throw new Error;
  } catch (e) {
    _hasStacks = !!e.stack;
  }

  var pppFileName;

  var STATE_INIT = 'i';
  var STATE_PENDING = 'p';
  var STATE_FULFILLED = 'f';
  var STATE_REJECTED = 'r';

  // jscs doesn't handle the immed-exec function very well
  // jscs:disable
  /**
   * @private
   * Provide function queue that, if possible,
   * is faster than setTimeout(fn, 0)
   *
   * @param {function} fn
   * @param {object} ctx
   * @param {array} args
   */
  // jscs:enable
  var _nextTick = (function () {
    var callNext;
    var running = false;

    var queue = [];

    function execQueued() {
      var q = queue;
      queue = [];
      for (var i = 0, l = q.length; i < l; ++i) {
        q[i][0].apply(q[i][1], q[i][2]);
      }
      if (queue.length) {
        callNext();
      } else {
        running = false;
      }
    }

    var MO = __root.MutationObserver || __root.WebKitMutationObserver;

    if (typeof setImmediate === 'function') {
      callNext = function nextTickSetImmediate () {
        setImmediate(execQueued);
      };
    } else if (typeof process === 'object' && process.nextTick) {
      callNext = function nextTickNextTick () {
        process.nextTick(execQueued);
      };
    } else if (typeof document != 'undefined' &&
        document.createTextNode && MO) {
      var num = 1, node = document.createTextNode('');

      new MO(execQueued).observe(
        node, {characterData: true});

      callNext = function nextTickMutation () {
        node.data = (num *= -1);
      };
    } else if (typeof MessageChannel !== 'undefined') {
      var c = new MessageChannel;
      // Somewhat convoluted, this is from Q
      // (https://github.com/kriskowal/q/blob/
      //  75058c0d70d36dd7e814c13493866043df39c858/q.js#L210)
      var trueCallNext = function nextTickMessageStage2 () {
        c.port2.postMessage(0);
      };
      c.port1.onmessage = function nextTickOnMessage () {
        callNext = trueCallNext;
        c.port1.onmessage = execQueued;
        execQueued();
      };
      callNext = function nextTickMessageStage1 () {
        setTimeout(execQueued, 0);
        trueCallNext();
      };
    } else {
      callNext = function nextTickSetTimeout () {
        setTimeout(execQueued, 0);
      };
    }

    return function nextTick (fn, ctx, args) {
      queue.push([fn, ctx, args]);
      if (!running) {
        running = true;
        callNext();
      }
    };
  })();

  var _errObj = {e: null};
  /**
   * @private
   * It helps profiling if all try-catches flow through a single point.
   * One might be tempted to fn.apply(ctx, args) where args is an array,
   * but this creates an un-needed array object, and apply is slower than call.
   */
  function _tryCatch(fn, ctx, arg1, arg2, arg3, arg4) {
    try {
      return fn.call(ctx, arg1, arg2, arg3, arg4);
    } catch (e) {
      _errObj.e = e;
      return _errObj;
    }
  }

  /**
   * @private
   * Simple extend
   */
  function _extend(o, n) {
    for (var i in n) {
      o[i] = n[i];
    }
  }

  /**
   * @private
   * For older browser support, bind a context via closure
   */
  function _bind(fn, ctx) {
    return function () {
      fn.apply(ctx, arguments);
    };
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Called on a `_nextTick` to invoke a callback when promise is resolved.
   */
  function _invokeResolveCallback(cb, cbCtx, thenP) {
    /* jshint validthis:true */
    var res = _tryCatch(__invokeResolveCallback, this, cb, cbCtx, thenP);
    if (res === _errObj) {
      if (thenP) {
        _debugStackTrace && _makeStackTraceLong(_errObj.e, thenP);
        _simpleReject.call(thenP, _errObj.e);
      }
      _errObj.e = null;
    }
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Called on a `_nextTick` to invoke a callback when promise is resolved.
   */
  function __invokeResolveCallback(cb, cbCtx, thenP) {
    /* jshint validthis:true */
    if (typeof cb != 'function') {
      if (thenP) {
        _simpleResolve.call(thenP, this._d);
      }
      return;
    }
    var res;
    if (cbCtx) {
      res = cb.call(cbCtx, this._d);
    } else {
      res = cb(this._d);
    }
    if (thenP) {
      _resolve.call(thenP, res);
    }
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Called on a `_nextTick` to invoke a callback when promise is rejected.
   */
  function _invokeRejectCallback(cb, cbCtx, thenP) {
    /* jshint validthis:true */
    var res = _tryCatch(__invokeRejectCallback, this, cb, cbCtx, thenP);
    if (res === _errObj) {
      if (thenP) {
        _debugStackTrace && _makeStackTraceLong(_errObj.e, thenP);
        _simpleReject.call(thenP, _errObj.e);
      }
      _errObj.e = null;
    }
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Called on a `_nextTick` to invoke a callback when promise is rejected.
   */
  function __invokeRejectCallback(cb, cbCtx, thenP) {
    /* jshint validthis:true */
    if (typeof cb != 'function') {
      if (thenP) {
        _simpleReject.call(thenP, this._d);
      }
      return;
    }
    var res;
    if (cbCtx) {
      res = cb.call(cbCtx, this._d);
    } else {
      res = cb(this._d);
    }
    if (thenP) {
      _resolve.call(thenP, res);
    }
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * simple resolve, we have already decided to resolve this promise: do it
   */
  function _simpleResolve(data) {
    /* jshint validthis:true */
    if (this._s !== undefined && this._s !== STATE_INIT) {
      return;
    }

    _debugStackTrace && _applyStackTrace(this, 'resolve');

    this._d = data;
    this._s = STATE_FULFILLED;
    for (var i = 0, l = this._c.length; i < l; ++i) {
      var c = this._c[i];
      _nextTick(_invokeResolveCallback, this, [
        c[0], c[2], c[3]]);
    }
    this._c = null;
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * simple reject, we have already decided to reject this promise: do it
   */
  function _simpleReject(data) {
    /* jshint validthis:true */
    if (this._s !== undefined && this._s !== STATE_INIT) {
      return;
    }

    if (_debugStackTrace) {
      _applyStackTrace(this, 'reject');
      if (data instanceof Error) {
        _makeStackTraceLong(data, this);
      }
    }

    this._d = data;
    this._s = STATE_REJECTED;
    for (var i = 0, l = this._c.length; i < l; ++i) {
      var c = this._c[i];
      _nextTick(_invokeRejectCallback, this, [
        c[1], c[2], c[3]]);
    }
    this._c = null;
  }

  /**
   * @private
   */
  function _getThen(obj) {
    return obj && obj.then;
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * execute resolve procedure
   */
  function _resolve(data) {
    /* jshint validthis:true */
    if (this._s !== undefined && this._s !== STATE_INIT) {
      return;
    }

    if (data instanceof Defer) {
      data = data.promise;
    }

    var pend, res;

    if (this === data) {
      throw new TypeError("Cannot resolve a promise with itself");
    }

    _debugStackTrace && _applyStackTrace(this, '_resolve');


    if (data instanceof Promise) {
      pend = new PendH(this);

      // We don't need thenP in this case,
      // so directly call this method without it.
      res = _tryCatch(_then, data, pend.resolve, pend.reject, pend, null);
      if (res === _errObj) {
        _debugStackTrace && _makeStackTraceLong(_errObj.e, this);
        pend.reject(_errObj.e);
        _errObj.e = null;
      }

      return;
    }

    var gotThen = _tryCatch(_getThen, null, data);
    if (gotThen === _errObj) {
      _debugStackTrace && _makeStackTraceLong(_errObj.e, this);
      _simpleReject.call(this, _errObj.e);
      _errObj.e = null;
      return;
    }

    if ((
        (typeof data == 'object' && data !== null) ||
        typeof data == 'function') && typeof gotThen == 'function') {
      pend = new PendH(this);

      // Note: cannot use context param, as data may be a different
      // thenable implementation
      res = _tryCatch(
        gotThen, data, _bind(pend.resolve, pend), _bind(pend.reject, pend));
      if (res === _errObj) {
        _debugStackTrace && _makeStackTraceLong(_errObj.e, this);
        pend.reject(_errObj.e);
        _errObj.e = null;
      }

      return;
    }

    _simpleResolve.call(this, data);
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * If promise is already complete, invoke callback immediately,
   * otherwise store to be invoked on resolve/reject.
   */
  function _then(onSuccess, onError, context, thenP) {
    /* jshint validthis:true */
    if (this._s === STATE_FULFILLED) {
      _nextTick(_invokeResolveCallback, this, [
        onSuccess, context, thenP]);
      return;
    } else if (this._s === STATE_REJECTED) {
      _nextTick(_invokeRejectCallback, this, [
        onError, context, thenP]);
      return;
    }

    this._c.push([onSuccess, onError, context, thenP]);
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Validate our set of sub-promises, see if we should resolve/reject parent.
   */
  function _checkAll() {
    /* jshint validthis:true */

    if (this.isComplete()) {
      return;
    }

    var sub, i, l;

    var allResolved = true;
    for (i = 0, l = this._subs.length; i < l; ++i) {
      sub = this._subs[i];
      if (!sub.isResolved()) {
        allResolved = false;
      }
      if (sub.isRejected()) {
        this._subs = null;
        _simpleReject.call(this, sub.valueOf());
        return;
      }
    }

    if (allResolved) {
      var subVals = [];
      for (i = 0, l = this._subs.length; i < l; ++i) {
        sub = this._subs[i];
        subVals.push(sub.valueOf());
      }
      this._subs = null;
      _simpleResolve.call(this, subVals);
    }
  }

  /**
   * @private [super-private-member: should be called with `this` as a promise]
   *
   * Validate our set of sub-promises, see if we should resolve/reject parent.
   */
  function _checkRace() {
    /* jshint validthis:true */

    if (this.isComplete()) {
      return;
    }

    var sub, i, l;

    for (i = 0, l = this._subs.length; i < l; ++i) {
      sub = this._subs[i];
      if (sub.isResolved()) {
        this._subs = null;
        _simpleResolve.call(this, sub.valueOf());
        return;
      } else if (sub.isRejected()) {
        this._subs = null;
        _simpleReject.call(this, sub.valueOf());
        return;
      }
    }
  }

  /**
   * @private
   *
   * Some browsers only generate stack traces when an error is actually caught
   */
  function _getError(promise) {
    try {
      throw new Error;
    } catch (e) {
      return e;
    }
  }

  /**
   * @private
   *
   * Tag promise with additional stacktrace info
   */
  function _applyStackTrace(p, name) {
    if (typeof p._r != 'string') {
      p._r = '';
    }

    var e = _getError();
    _makeStackTraceLong(e, p);
    p._r += "Triggered from " + name + ":\n";
    p._r += e.stack;

    return;
  }

  /**
   * @constructor
   *
   * This is a helper class, when a `then` returns a thenable,
   * we need to track some additional state to ensure the parent
   * promise is only resolved a single time.
   */
  function PendH(p) {
    this._p = p;
    p._p = this;
    this._p._s = STATE_PENDING;
  }

  _extend(PendH.prototype, {

    /**
     * sub-promise is resolved, resolve the parent
     */
    resolve: function (v) {
      if (!this._p || this._p._p !== this) {
        this._p = null;
        return;
      }
      if (this._p._s !== STATE_PENDING) {
        this._p._p = null;
        this._p = null;
      }
      this._p._s = STATE_INIT;
      var p = this._p;
      this._p._p = null;
      this._p = null;
      _resolve.call(p, v);
    },

    /**
     * sub-promise is rejected, reject the parent
     */
    reject: function (v) {
      if (!this._p || this._p._p !== this) {
        this._p = null;
        return;
      }
      if (this._p._s !== STATE_PENDING) {
        this._p._p = null;
        this._p = null;
      }
      this._p._s = STATE_INIT;
      var p = this._p;
      this._p._p = null;
      this._p = null;
      _simpleReject.call(p, v);
    }
  });

  /**
   * @constructor
   *
   * This is a simple promise implementation.
   */
  function Promise(executor) {
    // TODO - once UglifyJS2 truly supports --mangle-regex,
    // make these vars more descriptive
    this._c = [];
    //this._s = undefined;
    //this._d = undefined;

    if (typeof executor == 'function') {
      executor(_bind(_simpleResolve, this), _bind(_simpleReject, this));
    }

    if (_debugStackTrace) {
      var e = _getError();
      // Coerce a new copy of the string, to prevent memory leak
      this.stack = e.stack + '';
    }
  }

  _extend(Promise.prototype, {

    /**
     * @return {*} If we have been resolved or rejected,
     *    this returns the data that was passed to `resolve` or `reject`.
     */
    valueOf: function () {
      return this._d;
    },

    /**
     * @return {boolean} `true` if we have been resolved
     */
    isResolved: function () {
      return this._s === STATE_FULFILLED;
    },

    /**
     * @return {boolean} `true` if we have been rejected
     */
    isRejected: function () {
      return this._s === STATE_REJECTED;
    },

    /**
     * @return {boolean} `true` if we have been either resolved or rejected
     */
    isComplete: function () {
      return this._s === STATE_FULFILLED || this._s === STATE_REJECTED;
    },

    /**
     * Call to receive callbacks
     *
     * @param {function} onSuccess
     * @param {function} [onError]
     * @param {*} [context]
     *
     * @example `p.then(function onSuccess() {})`
     * @example `p.then(function onSuccess() {}, function onError() {})`
     * @example `p.then(myObj.onSuccess, myObj)`
     * @example `p.then(myObj.onSuccess, myObj.onError, myObj)`
     */
    then: function (onSuccess, onError, context) {
      if (onError && typeof onError != 'function') {
        context = onError;
        onError = null;
      }

      var thenP = new Promise;

      if (_debugStackTrace && thenP) {
        thenP.source = this;
      }

      _then.call(this, onSuccess, onError, context, thenP);

      return thenP;
    },

    /**
     * Shortcut to register only an onError callback
     *
     * @param {function} onError
     * @param {*} [context]
     */
    'catch': function (onError, context) {
      return this.then(null, onError, context);
    },

    /**
     * If `setDebugStackTrace` was set to `true` when this promise was either
     * resolved or rejected, this will return a stacktrace captured during
     * the resolve or reject request. Otherwise this will return `null`.
     */
    getStackTrace: function () {
      return this._r;
    }

  });

  __exports.Promise = Promise;

  /**
   * @constructor
   *
   * This is a simple promise implementation.
   */
  function Defer() {
    this.promise = new Promise;
  }

  _extend(Defer.prototype, {

    /**
     * Mark promise as resolved (success)
     *
     * @param {*} data - will be sent to callbacks
     */
    resolve: function (data) {
      _simpleResolve.call(this.promise, data);
      return this;
    },

    /**
     * Mark promise as rejected (error)
     *
     * @param {*} data - will be sent to callbacks
     */
    reject: function (data) {
      _simpleReject.call(this.promise, data);
      return this;
    }

  });

  // The following are static functions exported on the `Promise` object
  _extend(Promise, {

    // allow access to the `Defer` constructor
    'Defer': Defer,

    /**
     * This function is non-standard, but is available in Chrome native Promise
     */
    'defer': function () {
      return new Defer;
    },

    /**
     * Returns a new, already resolved promise.
     *
     * @param {*} [data]
     */
    'resolve': function (data) {
      var p = new Promise;
      _resolve.call(p, data);
      return p;
    },

    /**
     * Returns a new, already rejected promise.
     *
     * @param {*} [data]
     */
    'reject': function (data) {
      var p = new Promise;
      _simpleReject.call(p, data);
      return p;
    },

    /**
     * Returns a promise instance.
     * Non-standard, but useful coersion function.
     *
     * @param {*} [data]
     *
     * @example `ppp.when(otherPromise).then()`
     */
    'when': function (data) {
      if (data instanceof Promise) {
        return data;
      } else if (data instanceof Defer) {
        return data.promise;
      }

      var p = new Promise;
      _resolve.call(p, data);
      return p;
    },

    /**
     * Returns a promise built off iterable `subs` that will be rejected if any
     * of the promises in `subs` are rejected, or resolved if all are resolved.
     *
     * @param {iterable} subs - iterable of other promises
     *
     * @example `ppp.all([p1, p2]).then()`
     */
    'all': function (subs) {
      var out = new Promise;
      var length = 0;

      out._subs = [];

      var i, l, keys = Object.keys(subs);
      for (i = 0, l = keys.length; i < l; ++i) {
        ++length;

        var s = Promise.when(subs[keys[i]]);
        _then.call(s, _checkAll, _checkAll, out, null);
        out._subs.push(s);
      }

      if (!length) {
        _simpleResolve.call(out, []);
        return out;
      }

      // already complete?
      _checkAll.call(out);

      return out;
    },

    /**
     * Returns a promise built off iterable `subs` that will be rejected or
     * resolved in the same manner as the first sub item to do so.
     *
     * @param {iterable} subs - iterable of other promises
     *
     * @example `ppp.race([p1, p2]).then()`
     */
    'race': function (subs) {
      var out = new Promise;
      var length = 0;

      out._subs = [];

      var i, l, keys = Object.keys(subs);
      for (i = 0, l = keys.length; i < l; ++i) {
        ++length;

        var s = Promise.when(subs[keys[i]]);
        _then.call(s, _checkRace, _checkRace, out, null);
        out._subs.push(s);
      }

      if (!length) {
        _simpleResolve.call(out, []);
        return out;
      }

      // already complete?
      _checkRace.call(out);

      return out;
    },

    /**
     * If called with `true` promises will capture stack traces when either
     * `resolve` or `reject` are called.
     * Accesible via: `promise.getResolveStackTrace()`
     */
    'setDebugStackTrace': function (val) {
      if (!_hasStacks) {
        _debugStackTrace = false;
      } else {
        _debugStackTrace = val;
      }
    }

  });

  // From Q.js-- support long stack traces for async promises
  // long stack traces

  var STACK_JUMP_SEPARATOR = "From previous event:";

  /**
   * @private
   */
  function _makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and PPP
    // cruft, then concatenating with the stack trace of `promise`. See Q#57.
    if (_debugStackTrace &&
      promise.stack &&
      typeof error === "object" &&
      error !== null &&
      error.stack &&
      error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
      ) {
      var stacks = [];
      for (var p = promise; !!p; p = p.source) {
        if (p.stack) {
          stacks.unshift(p.stack);
        }
      }
      stacks.unshift(error.stack);

      var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
      error.stack = _filterStackString(concatedStacks);
    }
  }

  /**
   * @private
   */
  function _filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];

      if (!_isInternalFrame(line) && !_isNodeFrame(line) && line) {
        desiredLines.push(line);
      }
    }
    return desiredLines.join("\n");
  }

  /**
   * @private
   */
  function _isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
      stackLine.indexOf("(node.js:") !== -1;
  }

  var _stackRE = [
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    /at .+ \((.+):(\d+):(?:\d+)\)$/,

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    /at ([^ ]+):(\d+):(?:\d+)$/,

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    /.*@(.+):(\d+)$/,

    // Chrome style: "at code (filename:lineNumber:columnNumber)"
    /at .*\(([^ ]+):(\d+):(?:\d+)\)$/
  ];

  /**
   * @private
   */
  function _getFileName(stackLine) {
    for (var i = 0, l = _stackRE.length; i < l; ++i) {
      var res = _stackRE[i].exec(stackLine);
      if (res) {
        // we also have the line number in res[2]
        return res[1];
      }
    }
  }

  /**
   * @private
   */
  function _isInternalFrame(stackLine) {
    var fileName = _getFileName(stackLine);

    if (!fileName) {
      return false;
    }

    return fileName === pppFileName;
  }

  if (_hasStacks) {
    // Grab our own filename for filtering
    try {
      throw new Error;
    } catch (e) {
      var lines = e.stack.split("\n");
      var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
      pppFileName = _getFileName(firstLine);
    }
  }

}, this));

