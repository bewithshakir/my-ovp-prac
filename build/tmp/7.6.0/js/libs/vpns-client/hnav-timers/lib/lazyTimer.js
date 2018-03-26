/*!
 * COPYRIGHT 2015.  ALL RIGHTS RESERVED.  THIS MODULE CONTAINS
 * TIME WARNER CABLE CONFIDENTIAL AND PROPRIETARY INFORMATION.
 * THE INFORMATION CONTAINED HEREIN IS GOVERNED BY LICENSE AND
 * SHALL NOT BE DISTRIBUTED OR COPIED WITHOUT WRITTEN PERMISSION
 * FROM TIME WARNER CABLE.
 */
(function (define) {
   define(function (require, exports, module) {
      /**
      * Allows caller to set a callback that re-occurs on a set interval which happens across an
      * even distribution of time.
      *
      * The primary intent is to keep a multitude (i.e. millions) of client instances from
      * hitting services all at the same time.
      *
      * @param {Object} options
      *
      * @param {Number} options.intervalMsec
      * Interval in milliseconds of the timer.
      *
      * @param {Boolean} [options.deferStart]
      * If `true`, timer does not auto-start.
      *
      * @param {Object} options.distributionMsec
      * Amount of time centered on the interval over which the timeout may be spread.
      *
      * - If not specified, zero is assumed.
      * - If set, this must be less than the intervalMsec.
      *
      * @param {Function} options.callback
      * Function called when timer expires.
      *
      * @throws {TypeError}
      * Throws TypeError if the required options are not set.
      *
      * @constructor
      * @class
      */
      var LazyTimer = function (options) {
         this._distributionMsec = options.distributionMsec || 0;
      
         if (!options ||
            !options.callback ||
            !options.intervalMsec ||
            options.intervalMsec <= this._distributionMsec) {
            throw new TypeError('Must provide a callback, nonzero interval, and valid distribution');
         }
      
         this._intervalMsec = options.intervalMsec;
         this._callback = options.callback;
      
         if (!options.deferStart) {
            this.start();
         }
      };
      
      /**
      * Start the timer. If it is already running, this call has no effect.
      */
      LazyTimer.prototype.start = function () {
         if (this._timerId) {
            // Timer already running. This is not an error, but do nothing.
            return;
         }
      
         // Create an offset centered around the interval
         var offsetMsec  = (this._distributionMsec * Math.random()) - (this._distributionMsec / 2);
      
         this._timerId = this._setTimeout(this._intervalMsec + offsetMsec);
      };
      
      /**
      * Check if timer has been started.
      */
      LazyTimer.prototype.isStarted = function () {
         return this._timerId !== undefined;
      };
      
      /**
      * Stop the timer. This clears the existing timer. If start() is
      * subsequently called, a new interval is set.
      */
      LazyTimer.prototype.stop = function () {
         this._clearTimeout(this._timerId);
         this._timerId = undefined;
      };
      
      LazyTimer.prototype._onTimeout = function () {
         this._timerId = undefined;
      
         // Restart the timer at a new random spot within the interval
         // if a new interval has been set it will now be honored
         this.start();
      
         this._callback();
      };
      
      LazyTimer.prototype._setTimeout = function (timeoutMsec) {
         return setTimeout(this._onTimeout.bind(this), timeoutMsec);
      };
      
      LazyTimer.prototype._clearTimeout = function (id) {
         return clearTimeout(id);
      };
      
      return {
         LazyTimer: LazyTimer,
         _setTimer: setTimeout
      };
   });

} ( // Help Node out by setting up define.
   typeof module === 'object' && module.exports && typeof define !== 'function' ?
      function (factory) { module.exports = factory(require, exports, module); } :
      define
   ));

