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
      * InactivtyTimer calls a callback after a timeout, unless reset or stopped
      * @constructor
      */
      function InactivityTimer(options) {
         options = options || {};
         // Allow options.timeOutInMs to be zero, but if undefined, then use default from settings
         this.timeOutInMs = options.timeOutInMs
         if (this.timeOutInMs === undefined) {
            this.timeOutInMs = InactivityTimer.DEFAULT_TIMEOUT;
         }
      
         this.context = options.context;
         this.callback = options.callback;
      }
      
      InactivityTimer.DEFAULT_TIMEOUT = 5000;
      
      /**
      * Returns true if the timer is running
      */
      InactivityTimer.prototype._isActive = function () {
         return this.timer !== undefined && this.timeOutInMs !== undefined;
      };
      
      /**
      * Internal timeout handler which delegates to callback
      */
      InactivityTimer.prototype._timerWentOff = function () {
         if (this.context) {
            this.callback.call(this.context);
         } else {
            if (this.callback) {
               this.callback();
            }
         }
      
         this.timer = undefined;
      };
      
      /**
      *
      * @param timeOutInMsec
      */
      InactivityTimer.prototype.setTimeOutInMs = function (timeOutInMsec) {
         this.timeOutInMs = timeOutInMsec;
      };
      
      /**
      * Wraps window.setTimeout so that it can be stubbed for tests
      */
      InactivityTimer.prototype.createTimeout = function (callback, timeout) {
         return window.setTimeout(callback, timeout);
      };
      
      /**
      * Starts the inactivity timer.
      */
      InactivityTimer.prototype.start = function () {
         this.stop();
         this.timer = this.createTimeout(this._timerWentOff.bind(this), this.timeOutInMs);
      };
      
      /**
      * Stops the inactivity timer.
      */
      InactivityTimer.prototype.stop = function () {
         clearTimeout(this.timer);
         this.timer = undefined;
      };
      
      /**
      * Reset time out. it will stop the active timer and start a
      * new timer.
      */
      InactivityTimer.prototype.reset = function () {
         //if the timer hasn't started reset should not start the timer.
         if (!this._isActive()) {
            return;
         }
         this.start();
      };
      
      
      return InactivityTimer;
   });
} ( // Help Node out by setting up define.
   typeof module === 'object' && module.exports && typeof define !== 'function' ?
      function (factory) { module.exports = factory(require, exports, module); } :
      define
   ));

