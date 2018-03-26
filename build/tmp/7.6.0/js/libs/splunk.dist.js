(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["splunk"] = factory();
	else
		root["splunk"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2017 Charter Communications, Inc.
 *
 * This module contains unpublished, confidential, proprietary
 * material.  The use and dissemination of this material are
 * governed by a license.  The above copyright notice does not
 * evidence any actual or intended publication of this material.
 *
 * @author pushkarkathuria
 */



var ThrottleService = function (config) {
    var reportFrequencyMs;
    var maxBufferSizeRecords;
    var url;
    var apiKey;

    var _messageBuffer = {
        contents: [],
        appendMessage: function appendMessage(message) {
            this.contents.push(message); // an array of objects, where each object is a splunk record
        },
        reset: function reset() {
            this.contents = [];
        }
    };
    var bufferContents; // holds the JSON stringified message

    return {
        init: init,
        queue: queue,
        flush: flush
    };

    function init(config) {
        reportFrequencyMs = parseInt(config.splunkControlParameters.reportFrequencyMs), maxBufferSizeRecords = parseInt(config.splunkControlParameters.maxBufferSizeRecords), url = config.splunk.url();
        apiKey = config.oAuth.consumerKey;
        // Start the timer to send the messages to the splunk.
        var interval = setInterval(_report, reportFrequencyMs);
    }

    /**
     * Queue a message to be sent to Splunk
     *
     * @param data the data to be sent to Splunk
     */
    function queue(data) {
        _messageBuffer.appendMessage(data);

        if (_messageBuffer.contents.length >= maxBufferSizeRecords) {
            _report();
        }
    }

    function _report() {
        if (_messageBuffer.contents.length <= 0) {
            return true;
        }

        try {
            bufferContents = JSON.stringify(_messageBuffer.contents);
        } catch (e) {
            bufferContents = null;
            _messageBuffer.reset(); // get rid of the bad data that we can't parse anyway
            return; // no reason to send a message without any data
        }

        $.ajax({
            'type': 'POST',
            'global': false,
            'url': url,
            'data': bufferContents,
            'contentType': 'application/json; charset=utf-8',
            'apiKey': apiKey,
            error: function error(jqXHR, textStatus, errorThrown) {
                // On a successful call, Splunk doesn't return any JSON, just the string 'OK'. This causes
                // the parse error because it tries to parse
                // it as JSON. so if the status is 200 then we do not need to log the error.
                if (jqXHR.status === 200) {
                    return;
                }
            }
        });

        // Clear the buffer now.
        _messageBuffer.reset();
    }

    /**
     * Force sending any queued requests to Splunk immediately.
     */
    function flush() {
        _report();
    }
}();

var splunk = function () {

    var messageHeader, heartbeatMessage;
    var sequence = 0,
        timerPromise = null,
        heartbeatFrequencyMs = null,
        // set to null to initially start the timer
    loggingEnabled = null,
        playerStatusEnabled = null,
        heartbeatEnabled = null,
        messageHeader = {
        deviceId: null, // use the same GUID created by our Event Gateway Session
        deviceType: window.navigator.userAgent,
        division: null, // resolved via promise below once the user logs in
        domain: location.host,
        appState: null,
        environment: null,
        lineup: null, // resolved via promise below once the user logs in
        appVersion: null,
        osVersion: null,
        browserVersion: null,
        level: null, // populated by the specific message:  <FATAL, ERROR, INFO, DEBUG, TRACE>
        stb: null, // stb mac-address,
        adBlockerEnabled: null // ad blocker
    },
        heartbeatMessage = {
        type: 'heartbeat',
        typeData: {
            // App creates a unique ID (not necessarily globally unique) at startup to track session
            // This ID plus the device ID is a globally unique session.
            userSessionId: null,
            config: {
                // true if the capability exists and IPVS capabilities call says authorized for
                // RDVR (dvroperations in capabilities call)
                rdvr: null, // resolved via promise below

                // true if IPVS capabilities call says authorized
                cdvr: null, // resolved via promise below

                // true if IPVS capabilities call says authorized
                tuneToChannel: null, // resolved via promise below

                // true if the capability exists and IPVS capabilities call says authorized
                viewGuide: null, // resolved via promise below

                // true if IPVS capabilities call says authorized
                watchLive: null, // resolved via promise below

                // true if IPVS capabilities call says authorized
                watchOnDemand: null, // resolved via promise below

                // true if IPVS capabilities call tvod enabled AND activity config says rent
                tvodRent: null, // resolved via promise below

                // true if IPVS capabilities call tvod enabled AND activity config says play
                tvodPlay: null, // resolved via promise below

                // true if IPVS says customer is in the IP video beta trial
                ipVideoBeta: null // resolved below
            },
            inHome: null, // resolved via event below
            flashPlayerVersion: null // resolved via event below
        }
    },
        timers = {};

    return {
        init: init,
        buildLogMessage: buildLogMessage,
        setDivision: setDivision,
        setLineup: setLineup,
        setStbInfo: setStbInfo,
        setInHome: setInHome,
        setAppState: setAppState,
        setAdBlocker: setAdBlocker,
        startTimer: startTimer,
        endTimer: endTimer,
        sendMessage: sendMessage,
        sendHeartbeat: sendHeartbeat,
        sendServiceError: sendServiceError,
        sendPlayerError: sendPlayerError,
        sendError: sendError,
        sendPlayerStatus: sendPlayerStatus,
        sendCustomMessage: sendCustomMessage,
        updateCapabilities: updateCapabilities,
        updateFlashPlayerVersion: updateFlashPlayerVersion,
        setUserSessionId: setUserSessionId,
        setAppVersion: setAppVersion,
        setEnvironment: setEnvironment,
        setOSVersion: setOSVersion,
        setBrowserVersion: setBrowserVersion,
        setDeviceId: setDeviceId,
        updateConfiguration: updateConfiguration,
        flush: flush

    };

    function init(config) {
        ThrottleService.init(config);
    }
    /**
     * build the log message that needs to be sent to splunk
     */
    function buildLogMessage(message) {
        var payload = _.clone(messageHeader);
        payload.date = new Date().toISOString();
        payload.seq = sequence++;
        payload.url = window.location.href;
        _.extend(payload, message);

        return payload;
    }

    /**
     * build and queue a Splunk heartbeat message
     */
    function sendHeartbeat() {

        if (!heartbeatEnabled) {
            return;
        }

        var message = buildLogMessage(heartbeatMessage);
        message.level = 'INFO';
        sendMessage(message);
    }

    /**
     *  Create a Splunk message with the specified message data and queue it to be sent to Splunk
     *
     *  @param {Object} message - the data describing the specific event being reported
     */
    function sendMessage(message) {
        //TODO - check how throttle service will be injected?
        if (!loggingEnabled) {
            return;
        }

        ThrottleService.queue(message);
    }

    /**
     * Send a message which doesn't fit into any of the other categories
     * @param {object} payload data to send
     * @param {string} logLevel log level of the message. Defaults to ERROR
     */
    function sendCustomMessage(payload, logLevel) {
        logLevel = logLevel || 'ERROR';
        var message = buildLogMessage();
        message.level = logLevel;
        message.msg = payload;
        sendMessage(message);
    }

    function updateCapabilities(capabilities) {
        heartbeatMessage.typeData.config.rdvr = capabilities[0];
        heartbeatMessage.typeData.config.viewGuide = capabilities[1];
        heartbeatMessage.typeData.config.watchLive = capabilities[2];
        heartbeatMessage.typeData.config.watchOnDemand = capabilities[3];
        heartbeatMessage.typeData.config.tuneToChannel = capabilities[4];
        heartbeatMessage.typeData.config.cdvr = capabilities[5];
        heartbeatMessage.typeData.config.tvodRent = capabilities[6];
        heartbeatMessage.typeData.config.tvodPlay = capabilities[7];
    }

    function updateConfiguration(config) {
        loggingEnabled = config.getBool(config.splunkControlParameters.splunkLoggingEnabled);
        playerStatusEnabled = config.getBool(config.splunkControlParameters.splunkPlayerStatusEnabled);
        heartbeatEnabled = config.getBool(config.splunkControlParameters.splunkHeartbeatEnabled);

        heartbeatMessage.typeData.config.ajaxAnalyticsEnabled = config.getBool(config.ajaxAnalyticsEnabled);
        heartbeatMessage.typeData.config.splunkPlayerStatusEnabled = config.getBool(config.splunkControlParameters.splunkPlayerStatusEnabled);
        heartbeatMessage.typeData.config.splunkHeartbeatEnabled = config.getBool(config.splunkControlParameters.splunkHeartbeatEnabled);
        heartbeatMessage.typeData.config.easEnabled = config.getBool(config.easEnabled);
        heartbeatMessage.typeData.config.useAlternateDAIScheme = config.useAlternateDAIScheme;
        heartbeatMessage.typeData.config.useDAIforLIVE = config.useDAIforLIVE;
        heartbeatMessage.typeData.config.useDAIforVOD = config.useDAIforVOD;
        heartbeatMessage.typeData.config.useDRMforLIVE = config.useDRMforLIVE;
        heartbeatMessage.typeData.config.useDRMforVOD = config.useDRMforVOD;

        updateHeartbeatInterval(config);
    }

    // stop the heartbeat timer and start it again with a different interval if necessary
    function updateHeartbeatInterval(config) {
        var oldHeartbeatFrequencyMs = heartbeatFrequencyMs;
        heartbeatFrequencyMs = parseInt(config.splunkControlParameters.heartbeatFrequencyMs);
        if (oldHeartbeatFrequencyMs != heartbeatFrequencyMs) {
            clearInterval(timerPromise);
            if (loggingEnabled && heartbeatEnabled) {
                timerPromise = setInterval(sendHeartbeat, heartbeatFrequencyMs);
            }
        }
    }

    /**
    * build and queue a Splunk player status message. For actual errors with the player itself, please
    * use the sendPlayerError() API.
    *
    * @param {String} statusDetails - error properties as specified in the Common Splunk Logging Standards
    * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
    */
    function sendPlayerStatus(statusDetails) {
        if (!playerStatusEnabled) {
            return;
        }

        var playerStatusDetails = formatPlayerStatusDetails(statusDetails);
        var message = buildLogMessage(playerStatusDetails);
        message.level = 'INFO';
        sendMessage(message);
    }

    function formatPlayerStatusDetails(statusDetails) {
        var playerStatusProperties = {};

        playerStatusProperties.type = 'playerStatus';
        playerStatusProperties.typeData = statusDetails;
        return playerStatusProperties;
    }

    /**
    * Set division in the message header.
    */
    function setDivision(division) {
        messageHeader.division = division;
    }

    /**
    * Set Lineup in the message header.
    */
    function setLineup(lineup) {
        messageHeader.lineup = lineup;
    }

    /**
    * Set stb info in the message header.
    */
    function setStbInfo(stb) {
        messageHeader.stb = stb;
    }

    /**
    * Set inHome data from hearbeatMessage in the message header.
    */
    function setInHome(behindOwnModem) {
        heartbeatMessage.typeData.inHome = behindOwnModem;
    }

    /**
    * Set appstate in the message header.
    */
    function setAppState(appState) {
        messageHeader.appState = appState;
    }

    /**
    * Set adBlocker status in the message header.
    */
    function setAdBlocker(adBlockerInstalled) {
        messageHeader.adBlockerEnabled = adBlockerInstalled;
    }

    function startTimer(name) {
        timers[name] = Date.now();
    }

    function endTimer(name) {
        if (timers[name]) {
            var elapsed = Date.now() - timers[name];
            delete timers[name];
            sendStats({
                type: 'navigation',
                elapsedMS: elapsed
            });
        }
    }

    /**
    * build and queue a Splunk heartbeat message
    */
    function sendHeartbeat() {

        if (!heartbeatEnabled) {
            return;
        }

        var message = buildLogMessage(heartbeatMessage);
        message.level = 'INFO';
        sendMessage(message);
    }

    /**
    * build and queue a Splunk service error message
    *
    * @param {String} errorDetails - error properties as specified in the Common Splunk Logging Standards
    * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
    */
    function sendServiceError(errorDetails) {
        var serviceErrorDetails = formatServiceErrorDetails(errorDetails);
        var message = buildLogMessage(serviceErrorDetails);
        message.level = 'ERROR';

        sendMessage(message);
    }

    function formatServiceErrorDetails(errorDetails) {
        var serviceErrorProperties = {};
        serviceErrorProperties.type = 'backendService';
        serviceErrorProperties.typeData = errorDetails;
        return serviceErrorProperties;
    }

    /**
    * build and queue a Splunk player error message
    *
    * @param {String} errorDetails - error properties as specified in the Common Splunk Logging Standards
    * http://mystropedia.corp.mystrotv.com/display/NGC/Common+Splunk+Logging+Standards
    */
    function sendPlayerError(errorDetails) {
        var playerErrorDetails = formatPlayerErrorDetails(errorDetails);
        var message = buildLogMessage(playerErrorDetails);
        message.level = 'ERROR';
        sendMessage(message);
    }

    function sendError(exception, cause, source, config) {
        if (config.splunkControlParameters.splunkExceptionLoggingEnabled) {
            if (typeof exception == 'string' || !exception) {
                exception = new Error(exception);
            }
            var errorMessage = {
                type: 'browserException',
                source: source,
                typeData: {
                    exception: exception.message,
                    stacktrace: exception.stack
                }
            };
            var message = buildLogMessage(errorMessage);
            message.level = 'ERROR';
            sendMessage(message);
        }
    }

    function sendStats(statMessage) {
        var message = buildLogMessage(statMessage);
        message.level = 'INFO';
        sendMessage(message);
    }

    function formatPlayerErrorDetails(errorDetails) {
        var playerErrorProperties = {};
        playerErrorProperties.type = 'playerError';
        playerErrorProperties.typeData = errorDetails;
        return playerErrorProperties;
    }

    /**
    * this message will update flash player version in hearbeat message
    */
    function updateFlashPlayerVersion(version) {
        heartbeatMessage.typeData.flashPlayerVersion = version;
    }

    /**
    * this method will set splunk session ID
    */
    function setUserSessionId(sessionId) {
        console.debug('Splunk logging session id : ' + sessionId);
        heartbeatMessage.typeData.userSessionId = sessionId;
    }

    /**
    * this method will set app version
    */
    function setAppVersion(version) {
        messageHeader.appVersion = version;
    }

    /**
    * This method will set environment
    */
    function setEnvironment(environment) {
        messageHeader.environment = environment;
    }

    /**
    * This function will set OS version in messageHeader Object
    */
    function setOSVersion(osVersion) {
        messageHeader.osVersion = osVersion;
    }

    /**
    * This function will set browserVersion in messageHeader Object
    */
    function setBrowserVersion(browserVersion) {
        messageHeader.browserVersion = browserVersion;
    }

    /**
    * This function will set Device Id in messageHeader Object
    */
    function setDeviceId(deviceId) {
        messageHeader.deviceId = deviceId;
    }

    function flush() {
        ThrottleService.flush();
    }
}();

module.exports = splunk;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});