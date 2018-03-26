/**
 * Copyright 2013 Time Warner Cable, Inc.
 *
 * This module contains unpublished, confidential, proprietary
 * material.  The use and dissemination of this material are
 * governed by a license.  The above copyright notice does not
 * evidence any actual or intended publication of this material.
 */

if (typeof define !== 'function') {var define = require('amdefine')(module); }
define(function (require, exports, module) {
   'use strict';

   /**
    * Compile a list of notification objects from each `Registration.Service` object.
    * Does not attempt to de-dupe. If that is needed, it should be done at the server.
    *
    * @param  {array} input
    * json value from key `Registration.Service`.
    *
    * @return {array}
    * collection of notification objects with keys "Status" and "type".
    */

   function parseArray(input) {
      var out = [];

      input.forEach(function (input) {
         out = out.concat(input.Notification);
      });

      return out;
   }

   /**
    * Retrieve notification objects directly from `Registration.Service.Notification` property.
    *
    * @param  {object} input
    * json value from key `Registration.Service`.
    *
    * @return {array}
    * collection of notification objects with keys "Status" and "type".
    */

   function parse(input) {
      return Array.isArray(input && input.Notification) ? [].concat(input.Notification) : [];
   }

   /**
    * Parses multiple VPNS registration service (`Registration.Service`) JSON response formats.
    *
    * @param  {object|array} input
    * json value from key `Registration.Service`.
    *
    * @return {array}
    * collection of notification objects with keys "Status" and "type".
    */

   exports.parse = function (input) {
      return Array.isArray(input) ? parseArray(input) : parse(input);
   }

   /**
    * Build a list of available and/or subscribed notificaton types.
    *
    * @param  {object|array} input
    * json value from key `Registration.Service`.
    *
    * @return {String[]}
    * list of notification types. (i.e. ['HNavConfirmVersion', 'SppChangeNotification', 'Alert'])
    */

   exports.types = function (input) {
      // get collection of notification objects with keys "Status" and "type".
      var service = exports.parse(input);
      var types   = [];

      // accumulate list of `.type` values where `.Status === 'available' or 'subscribed'`
      service.forEach(function (notification) {
         if (regexIsActive.test(notification.Status)) { types.push(notification.type); }
      });

      return types;
   }


   /**
    * Reformats a Registration.Service response from VPNS into a subscribe payload
    *
    * @param {Array|Object} input json value from key `Registration.Service`.
    * @param {String} operation the operation type to inject into the response
    * @param {Array} [allowed] optional array of value to allow.  If included, then only notification types which are present in this array will be returned
    *
    * @returns {Array} VPNS subscribe Service payload
    */
   exports.subscribe = function (input, operation, allowed) {
      // Transform the registration response to a connect response, optionally filtering against allowed types
      return (Array.isArray(input) ? input : [ input ]).reduce(function (services, service) {
         var notifications = service && service.Notification || [];
         notifications = Array.isArray(notifications) ? notifications : [ notifications ];
         services.push({
            id: service.id,
            idType: service.idType,
            Notification: notifications.reduce(function (notifications, notification) {
               // Only add active notification that are included in the allowed array (if it exists)
               if (regexIsActive.test(notification.Status) && (!allowed || allowed.indexOf(notification.type) !== -1)) {
                  notifications.push({
                     operation: operation,
                     type: notification.type
                  });
               }
               return notifications;
            }, [])
         });

         return services;
      }, []);
   };

   /**
    * Creates join metadata from a Registration.Service response
    *
    * @param {Array|Object} input json value from key `Registration.Service`.
    * @param {Array} [allowed] optional array of value to allow.  If included, then only notification types which are present in this array will be returned
    *
    * @returns {Array} VPNS join metadata
    */
   exports.join = function (input, allowed) {
      return (Array.isArray(input) ? input : [ input ]).reduce(function (services, service) {
         var notifications = service && service.Notification || [];
         notifications = Array.isArray(notifications) ? notifications : [ notifications ];
         return services.concat(notifications.reduce(function (notifications, notification) {
            // Only add active notification that are included in the allowed array (if it exists)
            if (regexIsActive.test(notification.Status) && (!allowed || allowed.indexOf(notification.type) !== -1)) {
               notifications.push({
                  id: service.id,
                  notificationType: notification.type
               });
            }
            return notifications;
         }, []));
      }, []);
   };

   var regexIsActive = exports.isActive =  /^\s*(available|subscribed)\s*$/i;

});
