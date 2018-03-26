/**
 * OVP keydown
 *
 * Usage:
 *   <div class="player">
 *     <div ovp-keydown="{space: playPause, enter: playPause}" ovp-prevent-default ovp-stop-propagation></div>
 *     <div ovp-keydown="{'ctrl+down': mute}" ovp-prevent-default ovp-stop-propagation></div>
 *   </div>
 *
 * Key is jQuery event key - https://api.jquery.com/keydown/
 * Value is handler method
 * `ovp-prevent-default` and `ovp-stop-propagation` attributes are to prevent the default and stop propagating event
 *
 * Special keys: ctrl, shift, meta, alt
 * Other keys: escape, arrowright, arrowleft, arrowup, arrowdown, backspace, capslock, tab, a, b, ?, /, 1, 2, 3, etc...
 */
(() => {
    'use strict';

    angular
        .module('ovpApp.directives.keydown', ['rx'])
        .factory('globalKeydown', globalKeydown)
        .directive('ovpKeydown', ovpKeydown)
        .directive('ovpClick', ovpClick)
        .constant('keyMap', {
            3: 'break',
            8: 'delete',
            9: 'tab',
            12: 'clear',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            19: 'pause',
            27: 'escape',
            32: 'spacebar',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home ',
            37: 'arrowleft',
            38: 'arrowup',
            39: 'arrowright',
            40: 'arrowdown',
            41: 'select',
            42: 'print',
            43: 'execute',
            45: 'insert',
            46: 'delete',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            58: ':',
            60: '<',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z'
        });

    /* @ngInject */
    function ovpClick($parse) {
        return {
            link: function ($scope, $element, $attrs) {
                if (angular.isUndefined($attrs.tabindex)) {
                    $element.attr('tabindex', '0');
                }
                var callbackFn = $parse($attrs.ovpClick),
                    click = function ($event) {
                        $scope.$apply(function () {
                            callbackFn($scope, {$event: $event});
                        });
                    },
                    keyup = function ($event) {
                        // Some browsers use keyCode and others use which.
                        const keys = {enter: 13, space: 32};
                        const keyCode = $event.which || $event.keyCode;
                        if (keyCode === keys.enter || keyCode === keys.space) {
                            // We want keyup to perform the click functionality and it should not be propagated further
                            $event.preventDefault();
                            $event.stopPropagation();

                            $scope.$apply(function () {
                                callbackFn($scope, {$event: $event});
                            });
                        }
                    };
                $element.on('click', click);
                $element.on('keyup', keyup);
                $scope.$on('$destroy', () => {
                    $element.off('click', click);
                    $element.off('keyup', keyup);
                });
            }
        };
    }

    /* @ngInject */
    function ovpKeydown($timeout, keyMap) {
        let directive = {
            link: link,
            restrict: 'A',
            scope: {
                'ovpKeydown': '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            let params = {};
            $timeout(() => {
                angular.forEach(scope.ovpKeydown, (val, key) => {
                    let keys = key.split('+').map((a) => a.trim().toLowerCase());
                    if (keys.length === 1) {
                        params[keys[0]] = val;
                    } else if (keys.length === 2) {
                        params[keys[1]] = {
                            key: keys[0],
                            callback: val
                        };
                    }
                });
            });
            angular.element(element).on('keydown', (event) => {
                let handler = null;
                let key = event.key;
                if (event.key === 'Esc') {
                    //key comes as 'Esc' on Internet Explorer so we need to map it with 'escape'
                    key = 'escape';
                }
                //On Safari we do not get the key but only the keyCode so need to fallback
                //on the keycode to get the handler.
                handler = key ? params[key.toLowerCase()] : params[keyMap[event.keyCode].toLowerCase()];

                if (angular.isFunction(handler) &&
                    !event.metaKey && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                    handler(event);
                    prevent(event, attrs);
                } else if (angular.isObject(handler) &&
                    angular.isFunction(handler.callback) &&
                    event[handler.key + 'Key'] === true) {
                    handler.callback(event);
                    prevent(event, attrs);
                }
            });
            scope.$on('$destroy', () => {
                angular.element(element).off('keydown', '**');
            });

            function prevent(event) {
                if (angular.isDefined(attrs.ovpPreventDefault)) {
                    event.preventDefault();
                }
                if (angular.isDefined(attrs.ovpStopPropagation)) {
                    event.stopPropagation();
                }
            }
        }
    }

    function globalKeydown($document, rx) {
        let observable = rx.Observable.fromEvent($document[0].body, 'keydown');
        return {observable};
    }
})();
