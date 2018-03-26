/*!
 * COPYRIGHT 2014.  ALL RIGHTS RESERVED.  THIS MODULE CONTAINS
 * TIME WARNER CABLE CONFIDENTIAL AND PROPRIETARY INFORMATION.
 * THE INFORMATION CONTAINED HEREIN IS GOVERNED BY LICENSE AND
 * SHALL NOT BE DISTRIBUTED OR COPIED WITHOUT WRITTEN PERMISSION
 * FROM TIME WARNER CABLE.
 */

if (typeof define !== 'function') {var define = require('amdefine')(module); }
define(function (require, exports, module) {
   'use strict';

   var is = exports;

   /**
    * Whether an object reference is a basic object
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a basic object
    */

   exports.object = function (object) {
      return '[object Object]' == ({}).toString.call(object);
   };

   /**
    * Whether an object reference is a function
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a function
    */

   exports.isFunction = function (object) {
      return 'function' == typeof object;
   };

   /**
    * Alias for: `isFunction`
    */

   exports.function = exports.isFunction;

   /**
    * Whether an object reference is an array
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is an array
    */

   exports.isArray = function (object) {
      return '[object Array]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isArray`
    */

   exports.array = exports.isArray;

   /**
    * Whether an object reference is undefined
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is undefined
    */

   exports.isUndefined = function (object) {
      return object === void 0;
   };

   /**
    * Alias for: `isUndefined`
    */

   exports.undefined = exports.isUndefined;

   /**
    * Whether an object reference is a string
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a string
    */

   exports.isString = function (object) {
      return '[object String]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isString`
    */

   exports.string = exports.isString;

   /**
    * Whether an object reference is a boolean
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a boolean
    */

   exports.isBoolean = function (object) {
      return '[object Boolean]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isBoolean`
    */

   exports.boolean = exports.isBoolean;

   /**
    * Whether an object reference is a date
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a date
    */

   exports.isDate = function (object) {
      return '[object Date]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isDate`
    */

   exports.date = exports.isDate;

   /**
    * Whether an object reference is a number
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a number
    */

   exports.isNumber = function (object) {
      return '[object Number]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isNumber`
    */

   exports.number = exports.isNumber;

   /**
    * Whether an object reference is a finite number
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a number
    */

   exports.isFiniteNumber = function (object) {
      return is.number(object)
         && isFinite(object)
         && object > -9007199254740992
         && object < 9007199254740992;
   };

   /**
    * Alias for: `isFiniteNumber`
    */

   exports.finiteNumber = exports.isFiniteNumber;

   /**
    * Whether an object reference is an integer
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is an integer
    */

   exports.isInteger = function (object) {
      return is.finiteNumber(object)
         && Math.floor(object) === +object;
   };

   /**
    * Alias for: `isInteger`
    */

   exports.integer = exports.isInteger;

   /**
    * Whether an object reference is a float
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a float
    */

   exports.isFloat = function (object) {
      return is.finiteNumber(object)
         && Math.floor(object) !== +object;
   };

   /**
    * Alias for: `isFloat`
    */

   exports.float = exports.isFloat;

   /**
    * Whether an object reference is a regular expression
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is a regular expression
    */

   exports.isRegexp = function (object) {
      return '[object RegExp]' == ({}).toString.call(object);
   };

   /**
    * Alias for: `isRegexp`
    */

   exports.regexp = exports.isRegexp;

   /**
    * Whether an object has any enumerable properties
    *
    * Object is empty if:
    *
    *    - null
    *    - undefined
    *    - boolean false
    *    - no enumerable properties
    *    - not an object (primitive)
    *
    * @param  {Mixed}
    * object to check
    *
    * @return {Boolean}
    * whether the object is empty
    */

   exports.isEmpty = function (object) {
      /*jshint eqnull:true*/

      // empty when: null or undefined
      if (object == null) { return true; }

      // empty when: boolean false
      if (object === false) { return true; }

      // empty when: array or string has length < 1
      if (is.array(object) || is.string(object)) {
         return object.length === 0;
      }

      // empty when: basic object has no enumerable own-properties
      if (is.object(object)) {
         return !Object.keys(object).length;
      }

      // not empty
      return false;
   };

   /**
    * Alias for: `isEmpty`
    */

   exports.empty = exports.isEmpty;

   /**
    * Whether an object reference is null or 'undefined'
    *
    * @param  {Mixed}
    * object reference to check
    *
    * @return {Boolean}
    * whether the object is null or 'undefined'
    */

   exports.isNullOrUndefined = function (object) {
      return object === null || object === undefined;
   }

   /**
    * Alias for: `isNullOrUndefined`
    */

   exports.nullOrUndefined = exports.isNullOrUndefined;
});

