'use strict';

(function () {
    'use strict';

    scrollable.$inject = ["$rootScope"];
    lazySrc.$inject = ["lazyImageLoader", "$q"];
    lazyImageLoader.$inject = ["$window", "$q", "$timeout", "$rootScope"];
    angular.module('ovpApp.directives.lazySrc', []).directive('lazySrc', lazySrc).directive('scrollable', scrollable).factory('lazyImageLoader', lazyImageLoader);

    /* @ngInject */
    function scrollable($rootScope) {
        // Usage:
        // <div scrollable></div>
        //
        // Creates: causes events to be emitted when the element scrolls. This allows the lazy loader
        //    to detect the scrolls, even though the window itself is not scrolling.
        var directive = {
            link: function link(scope, element) {
                element.on('scroll', function () {
                    return $rootScope.$emit('scrollable:scrolled', element);
                });

                scope.$on('$destroy', function () {
                    return element.off('scroll');
                });
            }
        };

        return directive;
    }

    /* @ngInject */
    function lazySrc(lazyImageLoader, $q) {
        // Usage:
        // <img lazy-src='foo.jpg'></img>
        // <img lazy-src='foo.jpg' lazy-config='{fallback:"bar.jpg"}'></img>
        // <img lazy-src='foo.jpg' lazy-config='{fallback:"display:none"}'></img>
        //
        // Creates: Image source will be set only when the image is in the viewport
        //

        var directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        ////////////////

        function link($scope, element, attributes) {
            var image = new LazyImage(element, angular.fromJson(attributes.lazyConfig));
            lazyImageLoader.addImage(image);

            attributes.$observe('lazySrc', image.setSource);

            $scope.$on('$destroy', function () {
                return lazyImageLoader.removeImage(image);
            });
        }

        function LazyImage(element) {
            var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var imageLoadedDefer = $q.defer();
            var fallback = config.fallback;
            var source = null;
            var isRendered = false;
            var height = null;

            element.on('error', onError);

            return {
                isVisible: isVisible,
                render: render,
                setSource: setSource
            };

            ///////////////

            function isVisible(topFoldOffset, bottomFoldOffset) {
                if (height === null) {
                    height = element.height();
                }

                var top = element.offset().top;
                var bottom = top + height;
                return top <= bottomFoldOffset && bottom >= topFoldOffset;
            }

            function render() {
                isRendered = true;
                renderSource();
                return imageLoadedDefer.promise;
            }

            function setSource(newSource) {
                source = newSource;
                if (isRendered && source) {
                    renderSource();
                }
            }

            function renderSource() {
                if (source) {
                    element[0].src = source;
                }
            }

            function onError() {
                if (fallback == 'display:none') {
                    element[0].style.display = 'none';
                    imageLoadedDefer.resolve();
                } else if (fallback) {
                    element[0].src = fallback;
                    // Defer will resolve when the fallback image is loaded
                }

                element.off('error');
            }
        }
    }

    /* @ngInject */
    function lazyImageLoader($window, $q, $timeout, $rootScope) {
        var images = [];
        var renderDelay = 100;
        var preloadPx = 100;
        var win = angular.element($window);
        var isWatchingWindow = false;
        var renderPromise = undefined;
        var unsubscribe = undefined;

        var service = {
            addImage: addImage,
            removeImage: removeImage
        };
        return service;

        ////////////////

        function addImage(image) {
            images[images.length] = image;
            if (!renderPromise) {
                startRenderTimer(0);
            }
            if (!isWatchingWindow) {
                startWatching();
            }
        }

        function removeImage(image) {
            var index = images.indexOf(image);
            if (index > -1) {
                images.splice(index, 1);
            }

            if (images.length === 0) {
                clearRenderTimer();
                stopWatching();
            }
        }

        function checkImages() {
            var windowHeight = win.height();
            var scrollTop = win.scrollTop();

            var topFoldOffset = scrollTop;
            var bottomFoldOffset = topFoldOffset + windowHeight + preloadPx;

            var promises = images.filter(function (image) {
                return image.isVisible(topFoldOffset, bottomFoldOffset);
            }).map(function (image) {
                return image.render();
            });

            images = images.filter(function (image) {
                return !image.isVisible(topFoldOffset, bottomFoldOffset);
            });

            clearRenderTimer();

            if (images.length === 0) {
                stopWatching();
            }

            return $q.all(promises);
        }

        function clearRenderTimer() {
            clearTimeout(renderPromise);
            renderPromise = null;
        }

        function startRenderTimer() {
            var delay = arguments.length <= 0 || arguments[0] === undefined ? renderDelay : arguments[0];

            renderPromise = $timeout(checkImages, delay);
            return renderPromise;
        }

        function startWatching() {
            isWatchingWindow = true;

            win.on('resize', changed);
            win.on('scroll', changed);

            unsubscribe = $rootScope.$on('scrollable:scrolled', changed);
        }

        function stopWatching() {
            isWatchingWindow = false;

            win.off('resize', changed);
            win.off('scroll', changed);

            unsubscribe();
        }

        function changed() {
            if (!renderPromise) {
                startRenderTimer();
            }
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/lazy-src.js.map
