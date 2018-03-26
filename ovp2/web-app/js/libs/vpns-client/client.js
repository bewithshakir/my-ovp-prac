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
      'use strict';

      var ppp = require('ppp');
      var param = require('jquery').param;
      var $ = require('jquery');
      var _ = require('underscore');
      var diff = require('underscore').difference;
      var intersect = require('underscore').intersection;
      var compose = require('underscore').compose;
      var selectn = require('selectn');
      var Timer = require('hnav-timers').Lazy;
      var RetryTimer = require('hnav-timers').Retry;
      var noop = require('noop');
      var store = window.localStorage;
      var registrationService = require('./registrationService');
      var StateMachine = require('javascript-state-machine');

      /**
      * service types map
      */

      var service = {
         connect: 'vpnspush',
         disconnect: 'vpnspush',
         join: 'vpnspush',
         check: 'vpnspush',
         registration: 'vpnsservice',
         subscribe: 'vpnsservice'
      };

      /**
      * service version (as depicted in endpoing URI)
      */

      var apiVersion = {
         '1.5': 'v1_5'
      };
      
      /**
      * Generates a join request for a specific notification type
      *
      * @param  {String} joinMetaData
      * notification type
      *
      * @return {Promise}
      * jQuery promise object
      */

      function requestJoin(joinMetadata) {
         return joinMetadata.map(function (metadata) {
            var type = metadata.notificationType;
            var filters = this.filters()[type];

            var filterNames = Object.keys(filters || {});

            var query = { clientId: this.clientId(), notificationType: type, id: metadata.id };
            filterNames.forEach(function (name) {
               query[name] = filters[name];
            }, this);

            return this.send('join', { query: query });
         }.bind(this));
      }
      
      /**
      * Process `#connect()` data.
      *
      * @param  {Object} data
      * `#connect()` response data (JSON)
      *
      * @param  {Object} status
      * `#connect()` response status
      *
      * @param  {Object} xhr
      * `#connect()` xhr
      *
      * @return {String}
      * value of `X-VPNS-NOTIFY-SESSIONID` header
      */

      function processConnectData(data, status, xhr) {
         var headerId = 'X-VPNS-NOTIFY-SESSIONID';
         var sessionId = xhr.getResponseHeader(headerId);
         var defer = ppp.Promise.defer();

         if (sessionId && sessionId.length > 1) {
            // set sessionId value
            this.sessionId(sessionId)
            defer.resolve(sessionId);
         } else if (sessionId && sessionId.length === 0) {
            defer.reject({ message: 'Rejecting empty sessionId: ' + xhr.getAllResponseHeaders() });
         } else if (!this.sessionId()) {
            defer.reject({ message: 'Unable to locate: ' + headerId + ' in headers: ' + xhr.getAllResponseHeaders() });
         } else {
            defer.resolve(this.sessionid());
         }

         return defer;
      }
      
      /**
      * jQuery `$.ajax()` dataFilter
      *
      * mitigates errors from empty JSON responses
      *
      * @param {String} data
      * stringified HTTP response body
      *
      * @param {Object} type
      * mime/content-type (e.g. json)
      */

      function ifEmptyJson(data, type) {
         return (type === 'json' && data.length === 0)
            ? JSON.stringify({})
            : data;
      }
      
      /**
      * VPNS client constructor
      *
      * @param {Object} options
      * configuration options
      */

      function Client(options) {
         if (!(this instanceof Client)) { return new Client(options); }
      
         // 23 hours => (1000 * 60 * 60 * hours)
         var registrationRetryIntervalMsec = 82800000;
      
         // configurable attributes
         options || (options = {});
         this.deviceId(options.deviceId || 'HNAVClientTest');
         this.msgTypes(options.msgTypes || []);
         this.apiVersion(options.apiVersion || '1.5');
         this.filters(options.filters || {});
         this.baseUri(options.baseUri || 'https://vpns-sys.timewarnercable.com');
      
         // configurable callbacks
         this.onError(options.onError || noop);
         this.onMessage(options.onMessage || noop);
         if (options.log) {
            this.log = function () {
               return options.log;
            };
         }
      
         // credentials (injected)
         this.authorization(options.authorization);
      
         // setup store
         this._store = options.store || store;

         Client.VPNS_CLIENT_ID = options.clientIdKey || 'twc.hnav.vpns.client.id';
         Client.VPNS_SESSION_ID = options.sessionIdKey || 'twc.hnav.vpns.session.id';
         Client.VPNS_AVAILABLE_TYPES = options.availableTypesKey || 'twc.hnav.vpns.available_types';
         Client.VPNS_REGISTRATION_DATA = options.registrationDataKey || 'twc.hnav.vpns.registration.data';
      
         // credentials (injected or via local storage)
         this.clientId(options.clientId || this._store.getItem(Client.VPNS_CLIENT_ID));
         this.sessionId(options.sessionId || this._store.getItem(Client.VPNS_SESSION_ID));

         var storedAvailableTypes = this._store.getItem(Client.VPNS_AVAILABLE_TYPES);
         if (storedAvailableTypes) {
            this.available(JSON.parse(storedAvailableTypes));
         }

         var registrationData = this._store.getItem(Client.VPNS_REGISTRATION_DATA);
         if (registrationData) {
            this.joinMetadata(registrationService.join(JSON.parse(registrationData), this.msgTypes()));
         }

         // initialize retry delay timer
         this._retryTimer = new RetryTimer({
            callback: this.onRetryTimeout.bind(this),
            maxTimeout: registrationRetryIntervalMsec,
            log: this.log()
         });
      
         // install registration timer
         this._registrationTimer = new Timer({
            callback: this.createInvalidateRegistrationHandler('registration timer'),
            intervalMsec: registrationRetryIntervalMsec,
            log: this.log()
         });

         this.log().info('Client started');

         this.initStateMachine();
      }

      var states = Client.states = {
         INIT: 'init',
         REGISTER: 'register',
         CONNECT: 'connect',
         DISCONNECT: 'disconnect',
         SUBSCRIBE: 'subscribe',
         JOIN: 'join',
         CHECK: 'check',
         RECHECK: 'recheck',
         INVALIDATE: 'invalidate',
         EXIT: 'exit'
      };

      var transitions = Client.transitions = {
         START: 'start',
         RECONNECT: 'reconnect',
         CHECK: 'check',
         SUCCESS: 'success',
         FAIL: 'fail',
         EXIT: 'exit'
      };

      Client.prototype.initStateMachine = function () {
         this.stateMachine = StateMachine.create({
            initial: states.INIT,
            events: [
               { name: transitions.START, to: states.REGISTER },
               { name: transitions.CHECK, from: [states.INIT, states.RECHECK], to: states.CHECK },
               { name: transitions.SUCCESS, from: states.REGISTER, to: states.SUBSCRIBE },
               { name: transitions.SUCCESS, from: states.SUBSCRIBE, to: states.DISCONNECT },
               { name: transitions.SUCCESS, from: states.DISCONNECT, to: states.CONNECT },
               { name: transitions.FAIL, from: states.DISCONNECT, to: states.CONNECT },
               { name: transitions.SUCCESS, from: states.CONNECT, to: states.JOIN },
               { name: transitions.SUCCESS, from: states.JOIN, to: states.CHECK },
               { name: transitions.SUCCESS, from: states.CHECK, to: states.RECHECK },
               { name: transitions.FAIL, from: [states.REGISTER, states.CONNECT, states.SUBSCRIBE, states.JOIN, states.CHECK], to: states.INVALIDATE },
               { name: transitions.RECONNECT, from: states.CHECK, to: states.CONNECT },
               { name: transitions.EXIT, to: states.EXIT }
            ]
         });

         this.stateMachine['onleave' + states.INVALIDATE] = this._waitForRetryTimeout.bind(this);
         this.stateMachine['on' + transitions.FAIL] = this._retryTimer.onFailure.bind(this._retryTimer);
         this.stateMachine['onenter' + states.REGISTER] = this._register.bind(this);
         this.stateMachine['onenter' + states.DISCONNECT] = this._disconnect.bind(this);
         this.stateMachine['onenter' + states.CONNECT] = this._connect.bind(this);
         this.stateMachine['onenter' + states.SUBSCRIBE] = this._subscribe.bind(this);
         this.stateMachine['onenter' + states.JOIN] = this._join.bind(this);
         this.stateMachine['onenter' + states.CHECK] = this._check.bind(this);
         this.stateMachine['onenter' + states.RECHECK] = this._recheck.bind(this);
         this.stateMachine['onenter' + states.INVALIDATE] = this._invalidateRegistration.bind(this);
         this.stateMachine['onafter' + states.JOIN] = this._registrationTimer.start.bind(this._registrationTimer);
      };

      Client.prototype.start = function () {
         if (this.isActiveRegistration()) {
            this.stateMachine.check();
         } else {
            this.stateMachine.start();
         }
         return this;
      };

      Client.prototype._recheck = function () {
         this.stateMachine.check();
      };

      Client.prototype._waitForRetryTimeout = function () {
         return StateMachine.ASYNC;
      };
      
      /**
      * Creates a log4j style logger for VPNS client connected to the existing legacy logger
      */
      Client.prototype.log = (function () {
         var logger;

         return function () {
            var client = this;
            if (!logger) {
               logger = ["trace", "debug", "info", "warn", "error", "fatal"].reduce(function (protoLevel, level) {
                  protoLevel[level] = function (error) {
                     return client.reportError(error, level);
                  };
                  return protoLevel;
               }, {});
            }
            return logger;
         }
      } ());
      
      /**
      * Report (bubble up) errors to the configured `onError` handler without throwing
      * and exception or rejecting a promise.
      *
      * @param {Error|Mixed} error
      * error object
      *
      * @param {String} level
      * log level (default: fatal)
      */

      Client.prototype.reportError = function (error, level) {
         var onError = this.onError();
         onError(error, level);
      };
      
      /**
      * Reports a debug message to logger
      *
      * @param {String} message
      */
      Client.prototype.reportDebug = function (message) {
         this.onError()(message, 'debug');
      };
      
      /**
      * Retry timer timeout handler
      * Reports the next exponential backoff timeout.
      */

      Client.prototype.onRetryTimeout = function () {
         var onError = this.onError();
         var timeout = this._retryTimer.getNextTimeout();
         var message = 'Increasing Retry Timeout to: ' + timeout.ms + ' ms (' + timeout.sec + ' sec).';

         onError({ message: message });

         if (!this.stateMachine.is(states.EXIT)) {
            this.stateMachine.transition();
         }
      };
      
      /**
      * Build a VPNS service URL.
      *
      * @param  {String} endpoint
      * The endpoint type (e.g. `registration`, `connect`, `check`, ...).
      *
      * @return {String}
      * VPNS endpoint URL.
      */

      Client.prototype.url = function (type) {
         var endpoint = service[type];
         var version = apiVersion[this.apiVersion()];

         if (!endpoint) {
            throw new TypeError('Unknown Url Type: ' + type);
         }

         return [this.baseUri(), endpoint, version, type].join('/');
      };
      
      /**
      * accessor for base URI.
      *
      * @param  {String} [input]
      * sets base URI if this parameter is given.
      *
      * @return {String}
      * returns base URI if no parameters are given.
      */

      Client.prototype.baseUri = function (input) {
         if (![].slice.call(arguments).length) {
            return this._baseUri;
         }

         this._baseUri = input;
         return this;
      };
      
      /**
      * accessor for api version string.
      *
      * @param  {String} [input]
      * sets api version string if this parameter is given.
      *
      * @return {String}
      * returns api version string if no parameters are given.
      */

      Client.prototype.apiVersion = function (input) {
         if (![].slice.call(arguments).length) {
            return this._apiVersion;
         }

         this._apiVersion = input;
         return this;
      };
      
      /**
      * accessor for notification filters.
      *
      * @param  {String} [input]
      * sets notification filters if this parameter is given.
      *
      * @return {String}
      * returns notification filters if no parameters are given.
      */

      Client.prototype.filters = function (input) {
         if (![].slice.call(arguments).length) {
            return this._filters;
         }

         this._filters = input;
         return this;
      };
      
      /**
      * accessor for oauth `authorization` string.
      *
      * @param  {String} [input]
      * sets oauth authorization string if this parameter is given.
      *
      * @return {String}
      * returns oauth authorization string if no parameters are given.
      */

      Client.prototype.authorization = function (input) {
         if (![].slice.call(arguments).length) {
            return this._authorization;
         }

         this._authorization = input;
         return this;
      };
      
      /**
      * accessor for client identifier `clientId`.
      *
      * @param  {String} [input]
      * sets client identifier if this parameter is given.
      *
      * @return {String}
      * returns client identifier if no parameters are given.
      */

      Client.prototype.clientId = function (input) {
         if (![].slice.call(arguments).length) {
            return this._clientId;
         }
      
         // localStorage persistance
         this._store.setItem(Client.VPNS_CLIENT_ID, input);

         if (this._clientId !== input) {
            this._clientId = input;
            this.log().info('Setting VPNS client ID to ' + this._clientId);
         }

         return this;
      };
      
      /**
      * accessor for message types.
      *
      * @param  {Array} [input]
      * sets message types if this parameter is given.
      *
      * @return {Array}
      * returns message types if no parameters are given.
      */

      Client.prototype.msgTypes = function (input) {
         if (![].slice.call(arguments).length) {
            return this._msgTypes;
         }

         if (!input.length) {
            throw new TypeError('`msgTypes` must be a non-empty array.');
         }

         this._msgTypes = input;
         return this;
      };
      
      /**
      * accessor for mutually available message types.
      *
      * Those that are available on the server and configured at the client
      *
      * @param  {Array} [input]
      * sets available message types if this parameter is given.
      *
      * @return {Array}
      * returns available message types if no parameters are given.
      */

      Client.prototype.available = function (input) {
         if (![].slice.call(arguments).length) {
            return this._available;
         }

         this._available = intersect(input, this.msgTypes());
         return this;
      };
      
      
      /**
      * Stores a factory for generating Registration.Service request payloads
      *
      * @param  {function} [input]
      *
      * @return {function}
      */

      Client.prototype.servicePayloadFactory = function (input) {
         if (![].slice.call(arguments).length) {
            return this._servicePayloadFactory;
         }

         this._servicePayloadFactory = input;
         return this;
      };
      
      /**
      * Stores join metadata
      *
      * @param  {Array} [input]
      *
      * @return {Array}
      */

      Client.prototype.joinMetadata = function (input) {
         if (![].slice.call(arguments).length) {
            return this._joinMetadata;
         }

         this._joinMetadata = input;
         return this;
      };
      
      /**
      * accessor for device identifier `deviceId`.
      *
      * @param  {String} [input]
      * sets device identifier if this parameter is given.
      *
      * @return {String}
      * returns device identifier if no parameters are given.
      */

      Client.prototype.deviceId = function (input) {
         if (![].slice.call(arguments).length) {
            return this._deviceId;
         }

         this._deviceId = input;
         return this;
      };
      
      /**
      * accessor for session identifier `sessionId`.
      *
      * @param  {String} [input]
      * sets session identifier if this parameter is given.
      *
      * @return {String}
      * returns session identifier if no parameters are given.
      */

      Client.prototype.sessionId = function (input) {
         if (![].slice.call(arguments).length) {
            return this._sessionId;
         }
      
         // localStorage persistance
         this.reportDebug('Setting sessionId to ' + input);
         this._store.setItem(Client.VPNS_SESSION_ID, input);
         this._sessionId = input;

         return this;
      };
      
      /**
      * accessor for `onMessage` callback.
      *
      * @param  {String} [input]
      * sets `onMessage` callback if this parameter is given.
      *
      * @return {String}
      * returns `onMessage` callback if no parameters are given.
      */

      Client.prototype.onMessage = function (input) {
         if (![].slice.call(arguments).length) {
            return this._onMessage;
         }

         this._onMessage = input;
         return this;
      };
      
      /**
      * accessor for `onError` callback.
      *
      * @param  {Function} [input]
      * sets `onError` callback if this parameter is given.
      *
      * @return {Function}
      * returns `onError` callback if no parameters are given.
      */

      Client.prototype.onError = function (input) {
         if (![].slice.call(arguments).length) {
            return this._onError;
         }

         this._onError = input;
         return this;
      };
      
      /**
      * accessor for `halted`.
      *
      * @param  {Boolean} [input]
      * sets `halted` if this parameter is given.
      *
      * @return {Boolean}
      * returns `halted` value if no parameters are given.
      */

      Client.prototype.halted = function (input) {
         if (![].slice.call(arguments).length) {
            return !!this._halted;
         }

         this._halted = !!input;
         return this;
      };
      
      /**
      * halt
      */

      Client.prototype.halt = function () {
         this._invalidateRegistration();
         this.halted(true);
      };
      
      /**
      * resume
      */

      Client.prototype.resume = function () {
         this.halted(false);
      };
      
      /**
      * Process `#registration()` data.
      *
      * @param  {Object} data
      * `#register()` response data (JSON)
      *
      * @return {Promise}
      * jQuery promise
      */

      Client.prototype._processRegistrationData = function (data) {
         var clientId = selectn('Registration.Client.id', data);
         var registrationServiceData = selectn('Registration.Service', data);
         var available = registrationService.types(registrationServiceData);
      
         /**
               * Create a method which generates Registration.Service payloads while injecting an operation.  Operation
               * will be 'create' or 'delete'
               * @param operation
               * @returns {*}
               */
         var servicePayloadFactory = function (operation) {
            return registrationService.subscribe(registrationServiceData, operation, this.msgTypes());
         }.bind(this);

         var invalid = this.invalidTypes(available);
         var defer = ppp.Promise.defer();
         var error;

         if (clientId) {
            // set clientId
            this.clientId(clientId);

            if (invalid.length) {
               error = { message: 'Configured type(s): "' + invalid.join(', ') + '" not available. Available types are: "' + available.join(', ') + '".' };
               this.reportDebug(error);
            }
      
            // set mutually available types
            this.available(available);
            // Save the available types so that they can be re-read in cases of restored sessions
            this._store.setItem(Client.VPNS_AVAILABLE_TYPES, JSON.stringify(available));
            // Save registration data so that we can use that to rejoin when we get invalid session error
            this._store.setItem(Client.VPNS_REGISTRATION_DATA, JSON.stringify(registrationServiceData));
      
            // Save a service payload generator (for subscribe and unsubscribe calls)
            this.servicePayloadFactory(servicePayloadFactory);
      
            // Creates and stores metadata for processing join requests
            this.joinMetadata(registrationService.join(registrationServiceData, this.msgTypes()));

            defer.resolve(clientId);
         } else {
            error = { message: 'No `clientId` found in: ' + JSON.stringify(data) };
            defer.reject(error);
         }

         return defer.promise;
      };
      
      /**
      * Whether configured message types are valid given available types.
      *
      * @param  {Array} available
      * list of available message types.
      * @return {Boolean}
      * whether configured message types are valid given available types.
      */

      Client.prototype.invalidTypes = function (available) {
         return diff(this.msgTypes(), available);
      };
      
      /**
      * Send an HTTP request to a specific endpoint.
      *
      * @param  {String} endpoint
      * The endpoint type (e.g. `registration`, `join`, `check`).
      *
      * @param {Object} options ajax options
      *
      * @param {RetryOptions} [retryOptions] optional retryOptions
      *
      * @return {Promise}
      * A promise which is fulfilled with a successful connection and rejected if there errors connecting to services.  This
      * promise can encapsulates multiple requests due to _createRetryAjaxWrapper behavior, but will only resolve or reject
      * on a single AJAX request
      */

      Client.prototype.send = function (endpoint, options, retryOptions) {
         if (this.stateMachine.is(states.END)) {
            return;
         }

         options = options || {};

         var method = options.method || 'GET';
         var query = options.query;
         var data = options.data;
         var dataType = options.dataType ? options.dataType : data && 'json';
         var timeout = options.timeout || 15000;
         var url = this.url(endpoint);
         var headers = {
            accept: 'application/json'
         };
      
         // build url
         if (query) {
            url += ['?', param(query, true)].join('');
         }
      
         // authorization request header
         if (this.authorization()) {
            headers.Authorization = this.authorization();
         }
      
         // session id request header
         if (this.sessionId()) {
            headers['X-VPNS-NOTIFY-SESSIONID'] = this.sessionId();
         }

         this.reportDebug('Sending request: ' + endpoint + ' with sessionId: ' + this.sessionId());

         var ajaxOptions = {
            url: url,
            type: method,
            data: data && JSON.stringify(data),
            headers: headers,
            // ensure we are not timing out before the server times us out at 20000
            timeout: timeout,
            dataType: dataType,
            xhrFields: endpoint === 'connect' ? {} : { withCredentials: true },
            dataFilter: ifEmptyJson,
            contentType: 'application/json'
         };
      
         // Intended JQuery defer.  Putting this back to jspromise-vow causes unresolved test failures due to changes in async behavior
         var defer = $.Deferred();

         this._createRetryAjaxWrapper({
            ajaxOptions: ajaxOptions,
            defer: defer,
            retryCount: _.isUndefined(options.retryCount) ? 3 : options.retryCount,
            retryOptions: _({
               logDescription: 'VPNS pre-invalidation retry for endpoint ' + endpoint
            }).extend(retryOptions)
         })();
      
         // Return the wrapped defer
         return defer;
      };
      
      /**
      * Controls the retry logic for a single end-point
      *
      * @param {Object} options
      * @param {Object} options.ajaxOptions
      * @param {Promise} options.defer
      * @param {integer} options.retryCount The maximum number of retries
      * @param {RetryOptions} options.retryOptions RetryTimer options
      * @param {constructor} [options.retryClass=RetryClass] constructor like function for RetryTimer like objects
      *
      * @returns {function} The wrapped ajax request
      */
      Client.prototype._createRetryAjaxWrapper = function (options) {
         var ajaxOptions = options.ajaxOptions;
         var maxFailureCount = options.retryCount;
         var defer = options.defer;
         var log = this.log();
         var RetryClass = options.retryClass || RetryTimer;
         var retryOptions = _(options.retryOptions || {}).defaults({
            startingTimeout: 25000,
            maxTimeout: 40000,
            distributionMs: 8000,
            multiplier: 1.5,
            log: log
         });

         var failureCount = 0;
         var retryTimer = new RetryClass(retryOptions);

         var doAjax = function () {
            // log first time as trace, after that debug
            (failureCount ? log.debug : log.trace).bind(log)('Begin start of try number ' + (failureCount + 1) + ' of a promised wrapped ajax request with retry');
            retryTimer.start();

            if (this.stateMachine.is(states.EXIT)) {
               var msg = 'Aborting AJAX request';
               log.error(msg);
               defer.reject(msg);
               return;
            }
            $.ajax(ajaxOptions).then(function () {
               log.trace('Successful response from VPNS server');
               // Success
               retryTimer.clearTimer();
               defer.resolve.apply(defer, arguments);
               // Done
            })
            // Initiate a retry.  If the retry count is met, then reject the parent promise
               .fail(function (xhr, status, text) {
                  // Conditions which cause a full invalidation of VPNS-- either a series of 3 back-to-back failed calls or an error 400
                  if (++failureCount >= maxFailureCount || xhr.status === 400) {
                     log.error({
                        msg: 'Propagating AJAX failure',
                        url: ajaxOptions.url,
                        errorCount: failureCount,
                        status: status,
                        text: text
                     });
                     retryTimer.clearTimer();
                     defer.reject.apply(defer, arguments);
                  } else {
                     log.error({
                        msg: 'Starting retry timer on this request due to perceived instability of VPNS',
                        url: ajaxOptions.url,
                        errorCount: failureCount,
                        status: status,
                        text: text
                     });
                     // The retry time will recall doAjax
                     retryTimer.onFailure();
                  }
               }.bind(this))
         }.bind(this);

         retryTimer.setCallback(doAjax, this);

         return doAjax;
      };

      Client.prototype.onNextResponse = function () {
         if (!this._nextResponseDefered) {
            this._nextResponseDefered = ppp.Promise.defer();
            var log = this.log();
            this._nextResponseDefered.promise.then(function (xhr, status, response) {
               log.debug('AJAX endpoint response success');
            }, function (xhr, status, response) {
               log.debug('AJAX endpoint response failure');
            });
         }
         return this._nextResponseDefered.promise;
      };

      Client.prototype._onSuccessFactory = function (topic) {
         return function () {
            this.reportDebug('VPNS client success for ' + topic);
            this.stateMachine.success();
            if (this._nextResponseDefered) {
               this._nextResponseDefered.resolve();
               this._nextResponseDefered = null;
            }
         }.bind(this)
      };

      Client.prototype._onFailureFactory = function (topic) {
         return function () {
            this.reportDebug('VPNS client failure for ' + topic);
            if (!this.stateMachine.is(states.EXIT)) {
               this.stateMachine.fail();
               if (this._nextResponseDefered) {
                  this._nextResponseDefered.reject(new Error('Failed response'));
                  this._nextResponseDefered = null;
               }
            }
         }.bind(this)
      };
      
      /**
      * register device by ID with the VPNS service.
      *
      * on success: retrieve and set `clientId`.
      * on failure: call error handler and unsubscribe all
      *
      * @param  {String} deviceId
      * ID of device to register with VPNS service
      *
      * @return {Promise}
      * Returns a jQuery Promise object
      *
      * see: http://jira.corp.mystrotv.com/browse/HNAVC-2807?focusedCommentId=290872&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-290872
      *
      * @private
      */

      Client.prototype._register = function () {

         if (this.isActiveRegistration()) {
            var defer = ppp.Promise.defer();
            defer.resolve(this.clientId());
            return defer;
         }
      
         // if we register, we must join & subscribe
         this._registrationPending = true;

         var postInfo = {
            Registration: {
               id: this.deviceId(),
               Device: { id: this.deviceId() },
               operation: 'create'
            }
         };
      
         // provides registration promise
         return this.send('registration', { method: 'POST', data: postInfo })
            .then(this._processRegistrationData.bind(this))
            .then(this._onSuccessFactory('register'), this._onFailureFactory('register'));
      };
      
      /**
      * Create an invalidateRegistrationHandler scoped to return logs with source name on error
      *
      * @param {string} source name for debug logs
      * @returns {function}
      */
      Client.prototype.createInvalidateRegistrationHandler = function (source) {
         return function () {
            this.reportDebug('Invalidating VPNS registration due to ' + source);
            this._invalidateRegistration();
         }.bind(this);
      };
      
      /**
      * Invalidate registration information
      *
      * - mark client as _NOT_ having an active registration
      *
      * @return {Client} this
      * provides a fluent interface
      *
      * @private
      */

      Client.prototype._invalidateRegistration = function () {
         this.sessionId("");
         this.clientId("");

         this._registrationTimer.stop();
         this.stateMachine.start();

         return this;
      };

      /**
      * Whether client has an active registration
      *
      * @return {Boolean}
      * whether client has an active registration
      */

      Client.prototype.isActiveRegistration = function () {
         return Boolean(this.clientId() && this.sessionId());
      };
      
      /**
      * Client registration
      *
      * No-operation if already registered
      *
      * @return {Client} this
      * provides a fluent interface
      */

      Client.prototype.register = function () {
         var register = this._register.bind(this);
         var connect = this._connect.bind(this);
         var subscribe = this._subscribe.bind(this);
         var join = this._join.bind(this);
         var startTimer = this._registrationTimer.start.bind(this._registrationTimer);
      
         // always return registration promise
         this._registrationPromise = register()
            .then(connect)
            .then(subscribe)
            .then(join)
            .then(startTimer);
         return this._registrationPromise;
      };
      
      /**
      * Create a new client session.
      *
      * Pulls session id from response headers and sets `#sessionId()`.
      *
      * Examples:
      *
      *    var client  = vpnsClient();
      *    var connect = client._connect.bind(client);
      *
      *    client.register().then(connect);
      *
      * @return {Promise}
      * jQuery promise
      *
      * @private
      */

      Client.prototype._connect = function () {
         return this.send('connect')
            .then(processConnectData.bind(this))
            .then(this._onSuccessFactory('connect'), this._onFailureFactory('connect'));
      };
      
      /**
      * Disconnect current session.
      *
      * Examples:
      *
      *    var client  = vpnsClient();
      *    var disconnect = client._disconnect.bind(client);
      *
      *    client.register().then(disconnect);
      *
      * @return {Promise}
      * jQuery promise
      *
      * @private
      */

      Client.prototype._disconnect = function () {
         if (this.sessionId()) {
            return this.send('disconnect', {retryCount: 0}) // Do not retry
               .then(this._onSuccessFactory('disconnect'), this._onFailureFactory('disconnect'));
         } else {
            var defer = ppp.Promise.defer();
            this._onSuccessFactory('disconnect')();
            defer.resolve();
            return defer;
         }
      };

      /**
      * Subscribe to point-to-point push notifications
      *
      * Examples:
      *
      *    var client    = vpnsClient();
      *    ...
      *    var subscribe = client._subscribe.bind(client);
      *
      *    client.register().then(connect).then(subscribe)
      *
      * @return {Promise}
      * jQuery promise
      *
      * @private
      */

      Client.prototype._subscribe = function () {
         if (!this._registrationPending) { return; }

         var json = {
            Registration: {
               operation: 'update',
               Client: { id: this.clientId() },
               Service: this.servicePayloadFactory()('create') || { Notification: [] }
            }
         };

         return this.send('registration', { method: 'POST', data: json })
            .then(this._onSuccessFactory('subscribe'), this._onFailureFactory('subscribe'));
      };
      
      /**
      * Un-subscribe from all point-to-point push notifications
      *
      * @return {Promise}
      * jQuery promise
      */

      Client.prototype.unsubscribe = function () {
         // bail-out if we don't have a sessionId() since that would fail the request.
         if (!this.sessionId()) { return; }

         var json = {
            Registration: {
               operation: 'update',
               Client: { id: this.clientId() },
               Service: this.servicePayloadFactory()('delete') || { Notification: [] }
            }
         };

         return this.send('registration', { method: 'POST', data: json });
      };
      
      /**
      * Join VPNS Notification Topics with filters.
      *
      * Examples:
      *
      *    var client    = vpnsClient();
      *    ...
      *    var join      = client._join.bind(client);
      *
      *    client
      *       .register()
      *       .then(connect)
      *       .then(subscribe)
      *       .then(join)
      *
      * @return {Promise}
      * jQuery promise
      *
      * @private
      */

      Client.prototype._join = function () {
         if (!this._registrationPending) { return; }

         var types = this.msgTypes();
      
         // generate a list of `Point-To-Point` join requests as promises
         var p2p = [
            this.send('join', { query: { clientId: this.clientId() } }),
            this.send('join', { query: { clientId: this.clientId(), id: this.deviceId() } })
         ];
      
         // generate a list of `Broadcast` join requests as promises
         var broadcast = requestJoin.call(this, this.joinMetadata());
         var requests = broadcast.concat(p2p);
      
         // all join requests in parallel
         return ppp.Promise.all(requests)
            .then(this._retryTimer.onSuccess.bind(this._retryTimer))
            .then(this._onSuccessFactory('join'), this._onFailureFactory('join'));
      };
      
      /**
      * Check for VPNS Notifications.
      *
      * Examples:
      *
      *    var client    = vpnsClient();
      *    ...
      *    var check     = client.check.bind(client);
      *
      *    client.register().then(check);
      *
      * @return {Promise}
      * jQuery promise
      */

      Client.prototype._check = function () {
         return this.send('check', {
            dataType: 'json',
            timeout: 30000
         }, {
               // Check needs a greater timeout in order to account for the increase long-poll timeout
               startingTimeout: 45000,
               maxTimeout: 60000
            })
            .then(this.notify.bind(this))
            .then(this._onSuccessFactory('check'), function (err) {
                if (err.status === 400) {
                    this._registrationPending = true; // To re-join
                    this.stateMachine.reconnect();
                } else {
                    this._onFailureFactory('check')();
                }
            }.bind(this));
      };
      
      /**
      * Check for VPNS Notifications.
      *
      * Examples:
      *
      *    var client = vpnsClient();
      *    ...
      *    var check = client.check.bind(client);
      *
      *    client.register().then(check);
      *
      * @return {Promise}
      * jQuery promise
      */

      Client.prototype.notify = function (message) {
         var callback = this.onMessage();
      
         // bail if message is empty
         if (_.isEmpty(message)) {
            return;
         }
      
         // forward message
         try {
            callback(message);
         } catch (e) {
            this.onError()(e, 'error');
         }
      };
      
      
      /**
      * Parks the state machine in an end condition.  Used by the tests to turn off existing clients and stop them from continuing to make requests.
      */
      Client.prototype.end = function () {
         this._retryTimer.clearTimer();
         _.isFunction(this.stateMachine.transition) && this.stateMachine.transition();
         this.stateMachine.exit();
      };

      return Client;
   });

} ( // Help Node out by setting up define.
   typeof module === 'object' && module.exports && typeof define !== 'function' ?
      function (factory) { module.exports = factory(require, exports, module); } :
      define
   ));
