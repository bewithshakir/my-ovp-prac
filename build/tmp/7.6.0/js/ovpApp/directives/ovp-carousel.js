/**
 * ovpCarousel
 *
 * Surrounds a group of elements with a container which lays them out horizontally
 * and provides buttons for navigating.
 *
 * example usage:
 *
 * <ovp-carousel items="vm.someArray">
 *   <div ng-repeat="thingie in vm.someArray">{{thingie.name}}</div>
 * </ovp
 *
 * OR, with options, a nested component, and lazy loading:
 *
 * <ovp-carousel items="vm.someArray"
 *    options="vm.configObj"
 *    on-limit-changed="vm.onLimitChanged(limit)">
 *
 *    <ovp-product ng-repeat="asset in vm.someArray | limitTo: vm.limit"
 *       asset="asset"
 *       options="vm.optionsForOvpProduct">
 *    </ovp-product>
 *
 * </ovp-carousel>
 *
 * Bindings:
 *    items: (array) the array of objects being rendered. Note that the same array
 *       must also be passed into the ng-repeat (or similar directive like
 *       dir-paginate).
 *    options: (object) options to modify the carousel behavior (see below)
 *    onLimitChanged: (function) Notifies that the number of items that need to be
 *       on the dom has changed. This is optionally used to improve performance by
 *       limiting the carousel to only the minimum number of items needed. The
 *       component which is using ovp-carousel is responsible for setting the limitTo
 *       parameter on the ng-repeat. The limitTo must start with a nonzero value or
 *       the carousel will be unable to determine element widths.
 *
 * Options:
 *
 *    showReturnArrow: (bool) if true, the right arrow will turn into a return arrow
 *       when reaching the end. If false, the arrow will disappear. Defaults to true
 *    title: (string) a title for the carousel
 *    showTitle: (bool) if true and a title is provided, the carousel will display the
 *       title above the carousel. If false, title will not be displayed, though it
 *       will still be used for aria information. Defaults to true
 *    arrowIconClass: (string) use to overwrite the css class on the arrow icons
 *    useArrows: (bool) if true, arrows are used to navigate between items. Defaults to true
 *    supportVariableWidth: (bool) if true, the carousel will do extra calculations
 *        to support this.elements which do not all have the same width. Does not work
 *        in conjunction with
 *    describedby: (string) if provided, theh carousel will use an aria-describedby
 *
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    carouselCoordinator.$inject = ["$timeout"];
    angular.module('ovpApp.directives.carousel', []).factory('carouselCoordinator', carouselCoordinator).component('ovpCarousel', {
        bindings: {
            items: '<',
            options: '<',
            onLimitChanged: '&?'
        },
        transclude: true,
        templateUrl: '/js/ovpApp/directives/ovp-carousel-template.html',
        controller: (function () {
            /* @ngInject */

            OvpCarousel.$inject = ["$element", "$window", "$log", "carouselCoordinator", "$q", "$document", "$timeout"];
            function OvpCarousel($element, $window, $log, carouselCoordinator, $q, $document, $timeout) {
                _classCallCheck(this, OvpCarousel);

                angular.extend(this, { $element: $element, $window: $window, $log: $log, carouselCoordinator: carouselCoordinator, $q: $q, $document: $document,
                    $timeout: $timeout });
            }

            _createClass(OvpCarousel, [{
                key: '$onInit',
                value: function $onInit() {
                    this.transformation = {};
                    this.elements = [];
                    this.elementWidths = [];
                    this.scrollIndex = 0;

                    this.boundMeasureViewport = this.measureViewport.bind(this);
                    angular.element(this.$window).on('resize', this.boundMeasureViewport);
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    var _this = this;

                    if (changes.options) {
                        this.applyDefaultOptions(changes.options.currentValue);
                    }
                    if (changes.items && !changes.items.isFirstChange()) {
                        if (!this.waitUntilVisibleDefer) {
                            this.waitUntilVisible().then(function () {
                                return _this.measureElements();
                            });
                        } // else, we're already waiting. Don't try to measure multiple times.
                    }
                }
            }, {
                key: '$postLink',
                value: function $postLink() {
                    var _this2 = this;

                    this.carouselCoordinator.setTimeoutZero(function () {
                        _this2.waitUntilVisible().then(function () {
                            _this2.measureElements();
                            _this2.measureViewport();
                            _this2.updateCss();
                            _this2.updateLimit();
                        });
                        _this2.$element.find('.carousel-layout').on('scroll', _this2.onLayoutScrolled);
                    });
                }
            }, {
                key: '$doCheck',
                value: function $doCheck() {
                    if (this.waitUntilVisibleDefer) {
                        if (this.$element.hasClass('ng-hide') === false) {
                            this.waitUntilVisibleDefer.resolve();
                            this.waitUntilVisibleDefer = undefined;
                        }
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    angular.element(this.$window).off('resize', this.boundMeasureViewport);
                    this.$element.find('.carousel-layout').off('scroll', this.onLayoutScrolled);
                }
            }, {
                key: 'leftClick',
                value: function leftClick($event) {
                    $event.stopPropagation();

                    this.scrollIndex = this.prevIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);

                    this.updateCss();
                    this.updateLimit();
                }
            }, {
                key: 'rightClick',
                value: function rightClick($event) {
                    $event.stopPropagation();

                    var oldIndex = this.scrollIndex;
                    this.scrollIndex = this.nextIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                    if (oldIndex === this.scrollIndex && this.options.showReturnArrow) {
                        this.scrollIndex = 0;
                    }

                    this.updateCss();
                    this.updateLimit();
                }
            }, {
                key: 'leftArrowClass',
                value: function leftArrowClass() {
                    var isAtEnd = this.scrollIndex === this.prevIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                    var classList = {
                        'hidden': this.isSinglePage(),
                        'arrow-hidden': isAtEnd,
                        'arrow-left': true
                    };
                    classList[this.options.arrowIconClass] = true;
                    return classList;
                }
            }, {
                key: 'rightArrowClass',
                value: function rightArrowClass() {
                    var classObj = {
                        'hidden': this.isSinglePage()
                    };
                    classObj[this.options.arrowIconClass] = true;

                    var isAtEnd = this.scrollIndex === this.nextIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                    if (isAtEnd) {
                        if (this.options.showReturnArrow) {
                            classObj['return-arrow'] = true;
                        } else {
                            classObj['arrow-hidden'] = true;
                            classObj['arrow-right'] = true;
                        }
                    } else {
                        classObj['arrow-right'] = true;
                    }
                    return classObj;
                }
            }, {
                key: 'onKeydown',
                value: function onKeydown(event) {
                    var _this3 = this;

                    var keys = { left: 37, up: 38, right: 39, down: 40, tab: 9 };
                    if (!this.options.useArrows) {
                        if (event.keyCode == keys.tab) {
                            this.$timeout(function () {
                                var index = _this3.findIndex(_this3.$document[0].activeElement);
                                if (index >= 0) {
                                    _this3.focus(index);
                                }
                            }, 0);
                        }
                        return;
                    }

                    if (event.keyCode == keys.left || event.keyCode == keys.up) {
                        var index = this.findIndex(event.target);
                        this.focus(index - 1);
                        event.preventDefault();
                    } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                        var index = this.findIndex(event.target);
                        this.focus(index + 1);
                        event.preventDefault();
                    } else if (event.keyCode == keys.tab) {
                        // reset focus to first element so shift-tab can move to prev carousel
                        this.focus(0);
                        // Deliberately not calling preventDefault()
                    }
                }

                ////////////////

            }, {
                key: 'waitUntilVisible',
                value: function waitUntilVisible() {
                    if (this.$element.hasClass('ng-hide')) {
                        this.waitUntilVisibleDefer = this.waitUntilVisibleDefer || this.$q.defer();
                        return this.waitUntilVisibleDefer.promise;
                    } else {
                        return this.$q.resolve();
                    }
                }
            }, {
                key: 'applyDefaultOptions',
                value: function applyDefaultOptions(newOptions) {
                    var _this4 = this;

                    var defaults = {
                        showReturnArrow: true,
                        title: '',
                        showTitle: true,
                        arrowIconClass: 'default-arrow-icon',
                        useArrows: true,
                        supportVariableWidth: false,
                        describedby: null
                    };

                    this.options = angular.extend({}, defaults, newOptions);
                    this.limit = this.options.initialLimit;
                    if (angular.isNumber(this.options.initialFocus)) {
                        carouselCoordinator.setTimeoutZero(function () {
                            return _this4.focus(_this4.options.initialFocus);
                        });
                    }
                    this.setLabelInstructions();
                }
            }, {
                key: 'setLabelInstructions',
                value: function setLabelInstructions() {
                    if (!this.options.description) {
                        this.options.ariaLabel = this.options.title + (this.options.useArrows ? ', Move through items in the row with the ' + 'right and left arrow keys; select a program using the enter key. Tab will take' + ' you to the next row' : '');
                    } else {
                        this.options.ariaLabel = this.options.title + ', ' + this.options.description;
                    }
                }
            }, {
                key: 'measureElements',
                value: function measureElements() {
                    var _this5 = this;

                    this.elements = this.$element.find('.carousel-items').children();
                    this.elementCountDirty = false;

                    if (this.elements.length === 0 && this.items.length > 0) {
                        this.$log.warn('carousel unexpectedly found no child this.elements.' + ' If using a limitTo filter, make sure it starts > 0');
                    }

                    if (this.options.supportVariableWidth) {
                        // Need to measure every one of them
                        this.elementWidths = Array.from(this.elements).map(function (e) {
                            return angular.element(e).outerWidth(true);
                        });
                    } else {
                        (function () {
                            // Just need to measure one and then copy the value
                            var firstItemWidth = _this5.elements.outerWidth(true);
                            _this5.elementWidths = _this5.items.map(function () {
                                return firstItemWidth;
                            });
                        })();
                    }
                }
            }, {
                key: 'measureViewport',
                value: function measureViewport() {
                    this.viewportWidth = this.$element.find('.carousel-layout').innerWidth();
                }
            }, {
                key: 'isSinglePage',
                value: function isSinglePage() {
                    var totalWidth = this.elementWidths.reduce(function (a, b) {
                        return a + b;
                    }, 0) - 1;
                    return totalWidth <= this.viewportWidth;
                }
            }, {
                key: 'lastVisibleIndex',
                value: function lastVisibleIndex(elementWidths, viewportWidth, currentIndex) {
                    var accumulatedWidth = 0;
                    for (var i = currentIndex; i < this.elementWidths.length; i++) {
                        accumulatedWidth += this.elementWidths[i];
                        if (accumulatedWidth > this.viewportWidth) {
                            return i - 1;
                        }
                    }

                    return this.elementWidths.length - 1;
                }
            }, {
                key: 'nextIndex',
                value: function nextIndex(elementWidths, viewportWidth, currentIndex) {
                    var distanceFromRight = [];
                    elementWidths.reduceRight(function (a, b, i) {
                        return distanceFromRight[i] = a + b;
                    }, 0);

                    var differencePx = 0;
                    for (var i = currentIndex; i < elementWidths.length; i++) {
                        differencePx += elementWidths[i];
                        var endOfViewport = distanceFromRight[i] <= viewportWidth;
                        var fullPage = differencePx > viewportWidth;
                        if (fullPage) {
                            // We subtract 1 to leave one item on the left visible, for context
                            return Math.max(0, i - 1);
                        } else if (endOfViewport) {
                            return i;
                        }
                    }

                    return currentIndex;
                }
            }, {
                key: 'prevIndex',
                value: function prevIndex(elementWidths, viewportWidth, currentIndex) {
                    var differencePx = 0;
                    for (var i = currentIndex; i >= 0; i--) {
                        differencePx += elementWidths[i];
                        var fullPage = differencePx > viewportWidth;
                        if (fullPage) {
                            // we add 1 to leave one item on the right visible, for context
                            return Math.min(elementWidths.length - 1, i + 1);
                        }
                    }

                    // Left edge
                    return 0;
                }
            }, {
                key: 'updateCss',
                value: function updateCss() {
                    var _this6 = this;

                    var scrollPx = this.elementWidths.reduce(function (a, b, i) {
                        return i >= _this6.scrollIndex ? a : a + b;
                    }, 0);
                    var translateXCss = 'translateX(' + -scrollPx + 'px)',
                        translateZCss = ' translateZ(0)';

                    this.transformation = {
                        transform: translateXCss + translateZCss,
                        '-webkit-transform': translateXCss + translateZCss,
                        '-moz-transform': translateXCss + translateZCss,
                        '-ms-transform': translateXCss,
                        '-o-transform': translateXCss + translateZCss
                    };
                }

                /**
                 * Helper method for lazy-loading of carousel items. Based on the current index, calculates how many
                 * items the ng-repeat must show in order to be able to scroll a page and not inconvenience the user.
                 *
                 * Note: In variable width mode, it's impossible to predict how many not-yet-rendered items are needed
                 * so variable width + lazy loading isn't supported.
                 *
                 * @param  {number} index index the user is interacting with. Defaults to the scroll index
                 */
            }, {
                key: 'updateLimit',
                value: function updateLimit() {
                    var index = arguments.length <= 0 || arguments[0] === undefined ? this.scrollIndex : arguments[0];

                    if (!this.onLimitChanged) {
                        // No one's listening
                        return;
                    } else if (this.options.supportVariableWidth) {
                        this.$log.warn('you registered for limit changes, but that ' + 'isn\'t supported in variable width mode');
                        this.onLimitChanged({ limit: this.elementWidths.length });
                        return;
                    }

                    var left = this.nextIndex(this.elementWidths, this.viewportWidth, index);
                    var i = undefined,
                        accumulatedWidth = 0;
                    for (i = left; i < this.elementWidths.length; i++) {
                        if (accumulatedWidth > this.viewportWidth) {
                            // This item is the first one that will be invisible after the next scroll
                            break;
                        }
                        accumulatedWidth += this.elementWidths[i];
                    }

                    var limit = Math.min(i, this.elementWidths.length);
                    this.onLimitChanged({ limit: limit });
                    this.elementCountDirty = true;
                }
            }, {
                key: 'findIndex',
                value: function findIndex(el) {
                    var maximumDepth = 10;
                    var index = undefined;
                    var elArray = Array.from(this.elements);
                    for (var i = 0; i < maximumDepth; i++) {
                        index = elArray.indexOf(el);
                        if (index > -1) {
                            return index;
                        } else {
                            el = el.parentElement;
                            if (!el) {
                                break;
                            }
                        }
                    }

                    return -1;
                }
            }, {
                key: 'focus',
                value: function focus(index) {
                    if (this.elementCountDirty) {
                        this.measureElements();
                    }

                    var newFocus = this.elements[index];
                    if (newFocus) {
                        angular.element(newFocus).find('a, .carousel-selectable').focus();
                    }

                    if (index > this.lastVisibleIndex(this.elementWidths, this.viewportWidth, this.scrollIndex)) {
                        this.scrollIndex = this.nextIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                        this.updateCss();
                    } else if (index < this.scrollIndex) {
                        this.scrollIndex = this.prevIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                        this.updateCss();
                    }

                    this.updateLimit(index);
                }
            }, {
                key: 'onLayoutScrolled',
                value: function onLayoutScrolled(event) {
                    // The layout scrolled, because the focus changed and couldn't fit in the
                    // viewport. This can happen when tabbing rapidly, since the css animation
                    // may not have completed. In any event, we want to keep the control in the
                    // hands of the css, not the scroll postition, so we need to reset it.
                    event.target.scrollLeft = 0;
                }

                // Used by components inside the carousel to determine their appropriate tab index
            }, {
                key: 'itemTabIndex',
                value: function itemTabIndex(item) {
                    if (this.options.useArrows) {
                        var index = this.items.indexOf(item);
                        return index === 0 ? '' : '-1';
                    } else {
                        return '';
                    }
                }
            }]);

            return OvpCarousel;
        })()
    });

    /* @ngInject */
    function carouselCoordinator($timeout) {
        // Coordinates multiple carousels so they can do their resize logic all at once and not
        // kick off redundant $digest cycles
        var service = {
            setTimeoutZero: setTimeoutZero
        };

        var promise = undefined;

        return service;

        //////////

        function setTimeoutZero(callback) {
            if (!promise) {
                promise = $timeout(angular.noop, 0);
                promise.then(function () {
                    return promise = undefined;
                });
            }

            promise.then(callback);
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/ovp-carousel.js.map
