/**
 * Copyright 2015 Time Warner Cable, Inc.
 *
 * This module contains unpublished, confidential, proprietary
 * material.  The use and dissemination of this material are
 * governed by a license.  The above copyright notice does not
 * evidence any actual or intended publication of this material.
 */

(function (define) {
   define(function (require, exports, module) {
      exports.Lazy = require('lazyTimer').LazyTimer;
      exports.Inactivity = require('inactivityTimer');
      exports.Retry = require('retryTimer').RetryTimer;
      return exports;
   });

} ( // Help Node out by setting up define.
   typeof module === 'object' && module.exports && typeof define !== 'function' ?
      function (factory) { module.exports = factory(require, exports, module); } :
      define
   ));

