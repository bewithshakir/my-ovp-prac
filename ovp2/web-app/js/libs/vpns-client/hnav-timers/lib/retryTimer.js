/*!
 * COPYRIGHT 2015.  ALL RIGHTS RESERVED.  THIS MODULE CONTAINS
 * TIME WARNER CABLE CONFIDENTIAL AND PROPRIETARY INFORMATION.
 * THE INFORMATION CONTAINED HEREIN IS GOVERNED BY LICENSE AND
 * SHALL NOT BE DISTRIBUTED OR COPIED WITHOUT WRITTEN PERMISSION
 * FROM TIME WARNER CABLE.
 */

(function (define) {
   define(function (require, exports, module) {
      var sprintf = require('sprintf').sprintf;
      
      /**
      * From hnavclient/src/javascript/util/primitive:
      * 
      * This function is __usually__ what you want when you call `parseInt(value, 10)`.
      *
      * This is a safer, faster way to a value to integer value without having to deal with `NaN` values.
      *
      * When argument is not a number, always return 0.
      *
      * @param {*} val
      * Value to be cast to integer.
      */
      function toInteger(value) {
         return true === value ? 0 : parseInt(value, 10) || ~~value;
      }
      
      // expose `DEFAULTS`
      
      var DEFAULTS = exports.DEFAULTS = {
         timeout: 1000 * 6,          // 6 seconds
         distributionMsec: 1000 * 4, // 4 seconds
         maxTimeout: 1000 * 60 * 5,  // 5 minutes
         multiplier: 2               // x2 every failure
      };
      
      // expose `Retrytimer`
      
      exports.RetryTimer = RetryTimer;
      
      /**
      * Functions for managing retry with exponential backoff.
      * Useful for service errors to avoid hammering the server.
      *
      *
      * @typedef {Options} RetryOptions
      * @param {RetryOptions} options
      *
      * @param {Function} options.callback
      * Called on timeout
      *
      * @param {*} options.context
      * `this` context when calling `context`
      *
      * @param {Array} options.args
      * Arguments to be passed along to `callback` call
      *
      * @param {Number} options.startingTimeout
      * Timeout will default to this, and be reset to this on success
      *
      * @param {Number} options.maxTimeout
      * Timeout will not grow beyond this value
      *
      * @param {Number} options.multiplier
      * Timeout will be multiplied by this on failure
      *
      * @param {Object} [options.distributionMsec]
      * Amount of time centered on the interval over which the timeout may be spread.
      *
      * @param {Object} [options.log]
      * A logger to use for failures and recoveries. If omitted, failures and recoveries will not be logged
      *
      * @param {String} [options.logDescription]
      * A short piece of text included with log statements to identify the purpose of this retry time. For example, if
      * logDescription is set to "Epg data", then log statements will look like "Epg data failure, retry in xxx seconds"
      *
      * @param {Boolean} [options.logToDebug]
      * By default, logging is done at error level. If this is set to true, debug level logging is used instead.
      *
      * @constructor
      * @class
      */
      
      function RetryTimer(options) {
         options = options || {};
      
         this.setCallback(options.callback, options.context);
         this.setArguments(options.args);
         this.setMaxTimeout(options.maxTimeout);
         this.setMultiplier(options.multiplier);
         this.setDistribution(options.distributionMsec);
         this.setStartingTimeout(options.startingTimeout);
         this.setLog(options.log);
         this.setLogDescription(options.logDescription);
         this.setLogToDebug(options.logToDebug);
      
         this._boundRunCallback = this._runCallback.bind(this);
      
         this.failureCount = 0;
      }
      
      /**
      * Get the next timeout value
      *
      * ## Examples
      *
      *    this.getNextTimeout().ms
      *    this.getNextTimeout().sec
      *
      * @return {Object} nextTimeout
      * next timeout object.
      *
      * @return {Number} nextTimeout.ms
      * next timeout value in milliseconds.
      *
      * @return {Number} nextTimeout.sec
      * next timeout value in seconds.
      */
      
      RetryTimer.prototype.getNextTimeout = function () {
         var ms  = ((this.getTimeout() * this.multiplier) + this.offset());
         var sec = ms / 1000;
      
         return { ms: ms, sec: sec };
      };
      
      /**
      * Increment the timeout per the multiplier.
      * @chainable
      */
      
      RetryTimer.prototype.incrementTimeout = function () {
         this.setTimeout(this.getNextTimeout().ms);
      
         if (this.getTimeout() > this.maxTimeout) {
            this.setTimeout(this.maxTimeout);
         }
      
         return this;
      };
      
      /**
      * Get the current timeout value.
      *
      * @return {Number}
      * The current timeout value in milliseconds.
      */
      
      RetryTimer.prototype.getTimeout = function () {
         return this._timeout || this.startingTimeout;
      };
      
      /**
      * Get the current timeout value
      *
      * @return {Number}
      * The current timeout value in seconds.
      */
      
      RetryTimer.prototype.getTimeoutSec = function () {
         return parseInt(this.getTimeout() / 1000, 10);
      };
      
      /**
      * Force the next timeout to a specific value.
      *
      * @param {Number} timeout
      * The new timeout value.
      *
      * @chainable
      */
      
      RetryTimer.prototype.setTimeout = function (timeout) {
         this._timeout = timeout;
         return this;
      };
      
      /**
      * Set callback function (optionally context) to be called when timeout elapses.
      *
      * @param {Function} callback
      * function to be called when timeout elapses.
      *
      * @param {Object} context
      * `this` context when calling `callback`.
      *
      * @chainable
      */
      
      RetryTimer.prototype.setCallback = function (callback, context) {
         this.context  = context || this;
         this.callback = callback || function () {};
      
         return this;
      };
      
      /**
      * Arguments to be passed along to `callback` call.
      *
      * @param {Array} args
      * Arguments array to be applied to `callback`.
      *
      * @chainable
      */
      
      RetryTimer.prototype.setArguments = function (args) {
         this.args = Array.isArray(args) ? args : [];
         return this;
      };
      
      /**
      * Set the starting timeout value.
      *
      * Timeout starts with this value and is reset to this value upon success.
      *
      * Call without params to reset to default.
      *
      * @param {Number} options.startingTimeout
      * Timeout will default to this, and be reset to this on success.
      *
      * @chainable
      */
      
      RetryTimer.prototype.setStartingTimeout = function (timeout) {
         this.startingTimeout = timeout || DEFAULTS.timeout;
         return this;
      };
      
      /**
      * Set the max timeout value.
      *
      * The timeout will never grow beyond this value.
      *
      * Call without params to reset to default.
      *
      * @param {Number} options.maxTimeout
      * Timeout will not grow beyond this value
      *
      * @chainable
      */
      
      RetryTimer.prototype.setMaxTimeout = function (maxTimeout) {
         this.maxTimeout = maxTimeout || DEFAULTS.maxTimeout;
         return this;
      };
      
      /**
      * Set the onFailure timeout multiplier.
      *
      * Call without params to reset to default.
      *
      * @param {Number} options.multiplier
      * Timeout will be multiplied by this on failure
      *
      * @chainable
      */
      
      RetryTimer.prototype.setMultiplier = function (multiplier) {
         this.multiplier = multiplier || DEFAULTS.multiplier;
         return this;
      };
      
      /**
      * Set the `_distributionMsec` value.
      *
      * @param {Number} options.distributionMsec
      * Random distribution will be calculated based on this value.
      *
      * @chainable
      */
      
      RetryTimer.prototype.setDistribution = function (distributionMsec) {
         if (this.startingTimeout <= distributionMsec) {
            throw new TypeError(sprintf('Invalid distribution: %s <= %s', this.startingTimeout, distributionMsec));
         }
      
         this._distributionMsec = toInteger(distributionMsec) || DEFAULTS.distributionMsec;
         this._offset = 0;
      
         return this;
      };
      
      /**
      * Set the `_log` value.
      *
      * Logs will be sent to the log on error, as well as on recovery from error
      *
      * @param {Object} log Logger object
      *
      * @chainable
      */
      RetryTimer.prototype.setLog = function (log) {
         this._log = function () {
            if (log) {
               if (this._logToDebug) {
                  return log.debug.apply(log, arguments);
               } else {
                  return log.error.apply(log, arguments);
               }
            }
         };
         return this;
      };
      
      /**
      * Set the `_logDescription` value.
      *
      * This description will be included in any logs generated due to errors or recovery from errors
      *
      * @param {String} description
      *
      * @chainable
      */
      RetryTimer.prototype.setLogDescription = function (description) {
         this._logDescription = description || "";
         return this;
      };
      
      /**
      * Set the `_logToDebug` value.
      *
      * Normally logging is done at error level. _logToDebug is true, it is done at debug level instead
      *
      * @param {Boolean} value
      *
      * @chainable
      */
      RetryTimer.prototype.setLogToDebug = function (value) {
         this._logToDebug = value;
         return this;
      };
      
      /**
      * Create an offset centered around the interval
      *
      * @return {Number}
      * Calculated offset.
      */
      
      RetryTimer.prototype.offset = function () {
         if (!this._offset) {
            this._offset = Math.floor(Math.random() * this._distributionMsec);
         }
      
         return this._offset;
      };
      
      /**
      * Clear any currently set timer.
      *
      * You may wish to call this in the event of a scheduled poll
      * to eliminate any chance of multiple requests going out at once.
      *
      * @chainable
      */
      
      RetryTimer.prototype.clearTimer = function () {
         clearTimeout(this._timerId);
      
         delete this._timerId;
      
         return this;
      };
      
      /**
      * Call on a service failure to schedule the next retry.
      */
      
      RetryTimer.prototype.onFailure = function () {
         this.failureCount++;
         var msg = this._logDescription + " failure. Failure count = " + this.failureCount + ". Retry in " + this.getTimeoutSec() + " sec";
         this._log(msg);
      
         this.clearTimer();
      
         // run callback.
         this._timerId = setTimeout(this._boundRunCallback, this.getTimeout());
      
         this.incrementTimeout();
      
         return this;
      };
      
      /**
      * Call on a request success to clear all timers
      * and reset the timeout back to starting value.
      *
      * @param {Object} options
      * Options hash.
      *
      * @param {Boolean} options.runCallback
      * A value of `true` results in the the retry callback being invoked in spite of success.
      *
      * @chainable
      */
      
      RetryTimer.prototype.onSuccess = function (options) {
         options = options || {};
      
         // reset timeout to starting timeout.
         this.setTimeout(this.startingTimeout);
      
         this.clearTimer();
      
         // optionally re-run callback.
         if (options.runCallback) {
            this._timerId = setTimeout(this._boundRunCallback, this.getTimeout());
         }
      
         if (this.failureCount > 0) {
            this._log("NOT AN ERROR, " + this._logDescription + " retries were successful after " + this.failureCount + " failures");
         }
         this.failureCount = 0;
      
         return this;
      };
      
      /**
      * Start timer sequence.
      */
      
      RetryTimer.prototype.start = function () {
         this._timerId = setTimeout(this._boundRunCallback, this.getTimeout());
         return this;
      };
      
      /**
      * Check if timer has been started.
      */
      
      RetryTimer.prototype.isStarted = function () {
         return this._timerId !== undefined;
      };
      
      /**
      * Run the user's callback function
      *
      * @private
      */
      
      RetryTimer.prototype._runCallback = function () {
         this.clearTimer();
         this.callback.apply(this.context, this.args);
      };
      
      return exports;
   });
   
} ( // Help Node out by setting up define.
   typeof module === 'object' && module.exports && typeof define !== 'function' ?
      function (factory) { module.exports = factory(require, exports, module); } :
      define
   ));

