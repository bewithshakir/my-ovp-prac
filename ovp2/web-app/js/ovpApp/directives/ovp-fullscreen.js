/* globals document, Element*/
(function () {
    'use strict';

    angular
        .module('ovpApp.directives.ovp-fullscreen', [])
        .directive('ovpFullscreenToggle', ovpFullscreenToggle)
        .factory('ovpFullscreen', ovpFullscreen);

    /* @ngInject */
    function ovpFullscreenToggle($document, $timeout, $parse, ovpFullscreen) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attr) {
            let cb = $parse(attr.ovpFullscreenToggle) || angular.noop,
                callback = () => {
                    $timeout(() => cb(scope, {isEnabled: ovpFullscreen.isEnabled()}));
                };

            $document.on('webkitfullscreenchange ' +
                'mozfullscreenchange ' +
                'fullscreenchange ' +
                'MSFullscreenChange ' +
                'fullscreenChange',
                callback);

            scope.$on('$destroy', () => {
                $document.off('webkitfullscreenchange ' +
                    'mozfullscreenchange ' +
                    'fullscreenchange ' +
                    'MSFullscreenChange ' +
                    'fullscreenChange',
                    callback);
            });
        }
    }

    /* @ngInject */
    function ovpFullscreen() {
        let service = {
            isEnabled,
            toggle,
            exitFullscreen
        };
        return service;

        ////////////////

        function isEnabled() {
            return (!!document.fullscreenElement ||
                !!document.mozFullScreenElement ||
                !!document.webkitFullscreenElement ||
                !!document.msFullscreenElement);
        }

        function toggle(playerElement) {
            if (!isEnabled()) {
                if (playerElement.requestFullscreen) {
                    playerElement.requestFullscreen();
                } else if (playerElement.msRequestFullscreen) {
                    playerElement.msRequestFullscreen();
                } else if (playerElement.mozRequestFullScreen) {
                    playerElement.mozRequestFullScreen();
                } else if (playerElement.webkitRequestFullscreen) {
                    playerElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                exitFullscreen();
            }
        }

        function exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
}());
