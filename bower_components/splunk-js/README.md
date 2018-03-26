# Splunk JS

A easy to plug in JS library to help HTML/JS based IP clients to send out logging information to splunk.

## Dependencies

* [Jquery](https://jquery.com/)
* [UnderscoreJS](http://underscorejs.org/)


## Getting Started

#### Install through bower 

```bash
$ cd path/to/your/project
$ bower install --save splunk-js
```

#### Require 'splunk' in your application

```javascript
let splunk = require('splunk');
```

## List of APIs

Functions  | Explanation
------------- | -------------
init | This function sets certain configuration parameters and starts the timer to send the messages to the splunk.
buildLogMessage | This function builds the _messageHeader_ object that will further be sent to the splunk.
setDivision | This function sets the _division_ parameter in the _messageHeader_ object.
setLineup | This function sets the _lineup_ parameter in the _messageHeader_ object.
setStbInfo | This function sets the _stb_ parameter in the _messageHeader_ object.
setInHome | This function sets the _inHome_ parameter in the _heartbeatMessage_ object.
setAppState | This function sets the _appState_ parameter in the _messageHeader_ object.
setAdBlocker | This function sets the _adBlockerEnabled_ parameter in the _messageHeader_ object.
startTimer | This function will start the timer as soon as we go from one state to the other.
endTimer | This function will clear the timer and internally sends the message to the splunk as soon as transition to a state is complete.
sendMessage | This function creates a queue of splunk messages(_messageHeader_ object) that further will be sent to the Splunk.
sendHeartbeat | This function sends a Heartbeat message to the splunk at specified intervals.
sendServiceError | This function reports error messages to the splunk in case of service side failure.
sendPlayerError | This function reports error messages to the splunk in case of player side failure.
sendError | This function reports exception errors to the splunk.
sendPlayerStatus | This function logs player status to the splunk.
sendCustomMessage | This function is used for custom messages that don't fit into any of the other categories.
updateCapabilities | This function sets certain capability parameters in the _heartbeatMessage_ object.
updateFlashPlayerVersion  | This function sets _flashPlayerVersion_ parameter in the _heartbeatMessage_ object.
setUserSessionId | This function sets _userSessionId_ parameter in the _heartbeatMessage_ object.
setAppVersion | This function sets the _appVersion_ parameter in the _messageHeader_ object.
setEnvironment | This function sets the _environment_ parameter in the _messageHeader_ object.
setOSVersion | This function sets the _osVersion_ parameter in the _messageHeader_ object.
setBrowserVersion | This function sets the _browserVersion_ parameter in the _messageHeader_ object.
setDeviceId  | This function sets the _deviceId_ parameter in the _messageHeader_ object.
updateConfiguration | This function sets certain player related parameters in the _heartbeatMessage_ object.
flush | This function sends all of the queued messages immediately to the Splunk.