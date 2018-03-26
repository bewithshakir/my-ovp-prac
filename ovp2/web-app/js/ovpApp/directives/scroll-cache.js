(function () {
    'use strict';

    angular
        .module('ovpApp.directives.scrollCache', [
            'ui.router'
        ])
        .directive('scrollCache', scrollCache);

    /* @ngInject */
    function scrollCache($state, $window, $timeout, $location, $anchorScroll, ovpStorage,
    storageKeys, $rootScope, $transitions) {

        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        function link() {

            function setScrollPos(key, coords) {
                var cacheArray = ovpStorage.getItem(storageKeys.onDemandScrollCachePosition);
                if (!cacheArray) {
                    cacheArray = {};
                }
                cacheArray[key] = coords;
                ovpStorage.setItem(storageKeys.onDemandScrollCachePosition, cacheArray);
            }

            function getScrollPos(key) {

                var scrollPos;
                var cacheArray = ovpStorage.getItem(storageKeys.onDemandScrollCachePosition);
                if (cacheArray && key) {
                    scrollPos = cacheArray[key] || 0;
                    return scrollPos;
                }
                return 0;
            }

            function getKey() {
                var key;
                if ($state.params && $state.params.category) {
                    key = $state.params.category.toString();
                    if ($state.params.catUrl) {
                        key += ':' + $state.params.catUrl;
                    }

                    if ($state.params && $state.params.page) {
                        key += ':' + $state.params.page;
                    }

                    return key;
                }

                return undefined;
            }

            $rootScope.$on('ondemand:contentLoaded', () => {
                var key = getKey();
                var prevScrollPos;
                if ($location.hash()) {
                    $anchorScroll();
                } else {
                    if (key) {
                        prevScrollPos = getScrollPos(key);
                        $timeout(() => {
                            $window.scrollTo(0, prevScrollPos);
                        }, 0);
                    }
                }
            });

            $transitions.onStart({}, function (transition) {
                const toState = transition.to();
                const toParams = transition.params('to');
                const key = getKey();
                let keyParts;

                if (!key) {
                    return;
                }

                keyParts = key.split(':');

                if (toState.name.startsWith('ovp.ondemand')) {
                    if (toParams.category && key) {
                        if (toParams.category === keyParts[0]) {
                            setScrollPos(key, $window.pageYOffset);
                        } else {
                            setScrollPos(key, 0);
                        }
                    }
                } else {
                    ovpStorage.removeItem(storageKeys.onDemandScrollCachePosition);
                }
            });
        }
    }
})();
