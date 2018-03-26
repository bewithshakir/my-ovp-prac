/*
 * COPYRIGHT 2014.  ALL RIGHTS RESERVED.  THIS MODULE CONTAINS
 * TIME WARNER CABLE CONFIDENTIAL AND PROPRIETARY INFORMATION.
 * THE INFORMATION CONTAINED HEREIN IS GOVERNED BY LICENSE AND
 * SHALL NOT BE DISTRIBUTED OR COPIED WITHOUT WRITTEN PERMISSION
 * FROM TIME WARNER CABLE.
 */

if (typeof define !== 'function') {var define = require('amdefine')(module); }
define(function (require, exports, module) {
   'use strict';

   var sprintf = require('sprintf').sprintf;
   var _ = require('_');

   var keyExtractor = function (options, key) {
      if (_.isUndefined(options[key])) {
         try {
            throw new Error(sprintf('Expect options: %s to have argument: %s', JSON.stringify(options), key));
         } catch (e) {
            throw new Error(sprintf('Expect options: %s to have argument: %s', options, key));
         }
      }
      return options[key];
   };

   var OptionsDsl = function (options) {
      this.isDefined = !!options;
      this.options = options;
   };


   OptionsDsl.prototype = {
      expectKeys: function (objectToExtend, keys) {
         var obj;

         if (Array.isArray(objectToExtend)) {
            obj = {};
            keys = objectToExtend;
         } else if (Array.isArray(keys)) {
            obj = objectToExtend;
         } else {
            throw new Error("Expect to see an array, or an object and an array");
         }

         if (!this.isDefined) {
            throw new Error(sprintf('Undefined options can not contain a %s key', keys));
         }

         var options = this.options;
         return keys.reduce(function (prev, cur) {
            prev[cur] = keyExtractor(options, cur);
            return prev;
         }, obj);
      },
      expect: function (key) {
         if (!this.isDefined) {
            throw new Error(sprintf('Undefined options can not contain a %s key', key));
         }

         return keyExtractor(this.options, key);
      },
      defaults: function (/* var arg */) {
         var obj = arguments[0];

         var total = arguments.length;
         for (var i = 0; i < total; i++) {
            _(obj).defaults(arguments[i]);
         }

         return obj;
      },
      get: function (key) {
         if (typeof key === "undefined") {
            return this.options;
         }
         return this.options[key];
      }
   };

   var Options = module.exports = function () {

   };
   Options.prototype = {
      options: function (options) {
         return Options.for(options);
      }
   };

   _(Options).extend({ // Static methods
      for: function (options) {
         if (options instanceof OptionsDsl) {
            return options;
         }
         return new OptionsDsl(options);
      }
   });
});