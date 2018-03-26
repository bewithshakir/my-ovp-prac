'use strict';

(function () {
    'use strict';

    AccessibilityService.$inject = ["ovpStorage", "storageKeys", "$q", "$window"];
    init.$inject = ["$rootScope", "$document"];
    angular.module('ovpApp.services.accessibility', ['ovpApp.services.ovpStorage']).factory('AccessibilityService', AccessibilityService).run(init);

    /* @ngInject */
    function AccessibilityService(ovpStorage, storageKeys, $q, $window) {
        return {
            isEnabled: function isEnabled() {
                var explicitlyEnabled = ovpStorage.getItem(storageKeys.accessibilityEnabled);

                // Return true if not set at all or is explicitly enabled.
                return $q.resolve(explicitlyEnabled !== false);
            },
            enable: function enable() {
                ovpStorage.setItem(storageKeys.accessibilityEnabled, true);
                // TODO: Analytics Event
                // $rootScope.$emit('EG:accessibilityToggled', {
                //     enabled: true
                // });
                $window.location.reload();
                return $q.resolve();
            },
            disable: function disable() {
                ovpStorage.setItem(storageKeys.accessibilityEnabled, false);
                $window.location.reload();
                return $q.resolve();
            }
        };
    }

    function init($rootScope, $document) {
        // Private function to remove focus outline on mousedown and mousemove event
        var lastMouseEvent = null,
            isMouseMoveEvent = function isMouseMoveEvent(event) {
            // STVWEB-1407: mousemove event is triggered onscroll even when mouse was not moved
            // To avoid this mouse event check whether mouse really moved or not
            return event.type === 'mousemove' && (!lastMouseEvent || event.screenX !== lastMouseEvent.screenX || event.screenY !== lastMouseEvent.screenY);
        },
            mouseEventHandler = function mouseEventHandler(event) {
            // NVDA + window combination
            // Application will raise mouse event even when
            // user presses enter or spacebar key on any link or button
            // To check this case we need to check event.buttons
            // API reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
            if (!$rootScope.focusClass && (isMouseMoveEvent(event) || event.buttons > 0)) {
                $rootScope.$applyAsync(function () {
                    $rootScope.focusClass = 'focus-outline-none';
                });
            }
            // Store last event to check for mouse move
            lastMouseEvent = event;
        },
            keyEventHandler = function keyEventHandler(event) {
            var keyCode = event.which || event.keyCode;

            // ignore keyEvents on input other than the tab key.
            if (keyCode !== 9 && event.target.nodeName === 'INPUT' && $rootScope.focusClass === 'focus-outline-none') {
                return;
            }
            if ($rootScope.focusClass) {
                // has 'focus-outline-none' class
                $rootScope.$applyAsync(function () {
                    $rootScope.focusClass = '';
                });
            }
        };
        // Used addEventListener to process events during the capturing phase
        $document[0].body.addEventListener('mousedown', function (event) {
            mouseEventHandler(event);
        }, true);
        $document[0].body.addEventListener('mousemove', function (event) {
            mouseEventHandler(event);
        }, true);
        $document[0].body.addEventListener('keydown', function (event) {
            keyEventHandler(event);
        }, true);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/accessibility.js.map
