(function () {
    'use strict';

    angular
        .module('ovpApp.directives.lazySrc', [])
        .directive('lazySrc', lazySrc)
        .directive('scrollable', scrollable)
        .factory('lazyImageLoader', lazyImageLoader);

    /* @ngInject */
    function scrollable($rootScope) {
        // Usage:
        // <div scrollable></div>
        //
        // Creates: causes events to be emitted when the element scrolls. This allows the lazy loader
        //    to detect the scrolls, even though the window itself is not scrolling.
        let directive = {
            link: function (scope, element) {
                element.on('scroll', () => $rootScope.$emit('scrollable:scrolled', element));

                scope.$on('$destroy', () => element.off('scroll'));
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

        let directive = {
            link: link,
            restrict: 'A'
        };

        return directive;

        ////////////////

        function link($scope, element, attributes) {
            let image = new LazyImage(element, angular.fromJson(attributes.lazyConfig));
            lazyImageLoader.addImage(image);

            attributes.$observe('lazySrc', image.setSource);

            $scope.$on('$destroy', () => lazyImageLoader.removeImage(image));
        }

        function LazyImage(element, config = {}) {
            let imageLoadedDefer = $q.defer();
            let fallback = config.fallback;
            let source = null;
            let isRendered = false;
            let height = null;

            element.on('error', onError);

            return {
                isVisible,
                render,
                setSource
            };

            ///////////////

            function isVisible(topFoldOffset, bottomFoldOffset) {
                if (height === null) {
                    height = element.height();
                }

                let top = element.offset().top;
                let bottom = (top + height);
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
        let images = [];
        let renderDelay = 100;
        let preloadPx = 100;
        let win = angular.element($window);
        let isWatchingWindow = false;
        let renderPromise;
        let unsubscribe;

        let service = {
            addImage,
            removeImage
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
            let index = images.indexOf(image);
            if (index > -1) {
                images.splice(index, 1);
            }

            if (images.length === 0) {
                clearRenderTimer();
                stopWatching();
            }
        }

        function checkImages() {
            let windowHeight = win.height();
            let scrollTop = win.scrollTop();

            let topFoldOffset = scrollTop;
            let bottomFoldOffset = topFoldOffset + windowHeight + preloadPx;

            let promises = images.filter(image => image.isVisible(topFoldOffset, bottomFoldOffset))
                .map(image => image.render());

            images = images.filter(image => !image.isVisible(topFoldOffset, bottomFoldOffset));

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

        function startRenderTimer(delay = renderDelay) {
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
