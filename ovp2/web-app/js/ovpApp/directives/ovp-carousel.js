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
(function () {
    'use strict';
    angular.module('ovpApp.directives.carousel', [])
    .factory('carouselCoordinator', carouselCoordinator)
    .component('ovpCarousel', {
        bindings: {
            items: '<',
            options: '<',
            onLimitChanged: '&?'
        },
        transclude: true,
        templateUrl: '/js/ovpApp/directives/ovp-carousel-template.html',
        controller: class OvpCarousel {
            /* @ngInject */
            constructor($element, $window, $log, carouselCoordinator, $q, $document,
                $timeout) {
                angular.extend(this, {$element, $window, $log, carouselCoordinator, $q, $document,
                    $timeout});
            }

            $onInit() {
                this.transformation = {};
                this.elements = [];
                this.elementWidths = [];
                this.scrollIndex = 0;

                this.boundMeasureViewport = this.measureViewport.bind(this);
                angular.element(this.$window).on('resize', this.boundMeasureViewport);
            }

            $onChanges(changes) {
                if (changes.options) {
                    this.applyDefaultOptions(changes.options.currentValue);
                }
                if (changes.items && !changes.items.isFirstChange()) {
                    if (!this.waitUntilVisibleDefer) {
                        this.waitUntilVisible()
                            .then(() => this.measureElements());
                    } // else, we're already waiting. Don't try to measure multiple times.
                }
            }

            $postLink() {
                this.carouselCoordinator.setTimeoutZero(() => {
                    this.waitUntilVisible()
                        .then(() => {
                            this.measureElements();
                            this.measureViewport();
                            this.updateCss();
                            this.updateLimit();
                        });
                    this.$element.find('.carousel-layout').on('scroll', this.onLayoutScrolled);
                });
            }

            $doCheck() {
                if (this.waitUntilVisibleDefer) {
                    if (this.$element.hasClass('ng-hide') === false) {
                        this.waitUntilVisibleDefer.resolve();
                        this.waitUntilVisibleDefer = undefined;
                    }
                }
            }

            $onDestroy() {
                angular.element(this.$window).off('resize', this.boundMeasureViewport);
                this.$element.find('.carousel-layout').off('scroll', this.onLayoutScrolled);
            }


            leftClick($event) {
                $event.stopPropagation();

                this.scrollIndex = this.prevIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);

                this.updateCss();
                this.updateLimit();
            }

            rightClick($event) {
                $event.stopPropagation();

                let oldIndex = this.scrollIndex;
                this.scrollIndex = this.nextIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                if (oldIndex === this.scrollIndex && this.options.showReturnArrow) {
                    this.scrollIndex = 0;
                }

                this.updateCss();
                this.updateLimit();
            }

            leftArrowClass() {
                let isAtEnd = this.scrollIndex ===
                    this.prevIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
                let classList = {
                    'hidden': this.isSinglePage(),
                    'arrow-hidden': isAtEnd,
                    'arrow-left': true
                };
                classList[this.options.arrowIconClass] = true;
                return classList;
            }

            rightArrowClass() {
                let classObj = {
                    'hidden': this.isSinglePage()
                };
                classObj[this.options.arrowIconClass] = true;

                let isAtEnd = this.scrollIndex ===
                    this.nextIndex(this.elementWidths, this.viewportWidth, this.scrollIndex);
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

            onKeydown(event) {
                const keys = {left: 37, up: 38, right: 39, down: 40, tab: 9};
                if (!this.options.useArrows) {
                    if (event.keyCode == keys.tab) {
                        this.$timeout(() => {
                            let index = this.findIndex(this.$document[0].activeElement);
                            if (index >= 0) {
                                this.focus(index);
                            }
                        }, 0);
                    }
                    return;
                }

                if (event.keyCode == keys.left || event.keyCode == keys.up) {
                    let index = this.findIndex(event.target);
                    this.focus(index - 1);
                    event.preventDefault();
                } else if (event.keyCode == keys.right || event.keyCode == keys.down) {
                    let index = this.findIndex(event.target);
                    this.focus(index + 1);
                    event.preventDefault();
                } else if (event.keyCode == keys.tab) {
                    // reset focus to first element so shift-tab can move to prev carousel
                    this.focus(0);
                    // Deliberately not calling preventDefault()
                }
            }

            ////////////////

            waitUntilVisible() {
                if (this.$element.hasClass('ng-hide')) {
                    this.waitUntilVisibleDefer = this.waitUntilVisibleDefer || this.$q.defer();
                    return this.waitUntilVisibleDefer.promise;
                } else {
                    return this.$q.resolve();
                }
            }

            applyDefaultOptions(newOptions) {
                const defaults = {
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
                    carouselCoordinator.setTimeoutZero(() => this.focus(this.options.initialFocus));
                }
                this.setLabelInstructions();
            }

            setLabelInstructions() {
                if (!this.options.description) {
                    this.options.ariaLabel = this.options.title +
                        (this.options.useArrows ? ', Move through items in the row with the ' +
                        'right and left arrow keys; select a program using the enter key. Tab will take' +
                        ' you to the next row' : '');
                } else {
                    this.options.ariaLabel = this.options.title + ', ' + this.options.description;
                }
            }

            measureElements() {
                this.elements = this.$element.find('.carousel-items').children();
                this.elementCountDirty = false;

                if (this.elements.length === 0 && this.items.length > 0) {
                    this.$log.warn('carousel unexpectedly found no child this.elements.' +
                        ' If using a limitTo filter, make sure it starts > 0');
                }

                if (this.options.supportVariableWidth) {
                    // Need to measure every one of them
                    this.elementWidths = Array.from(this.elements).map(e => angular.element(e).outerWidth(true));
                } else {
                    // Just need to measure one and then copy the value
                    let firstItemWidth = this.elements.outerWidth(true);
                    this.elementWidths = this.items.map(() => firstItemWidth);
                }
            }

            measureViewport() {
                this.viewportWidth = this.$element.find('.carousel-layout').innerWidth();
            }


            isSinglePage() {
                let totalWidth = this.elementWidths.reduce((a, b) => a + b, 0) - 1;
                return totalWidth <= this.viewportWidth;
            }

            lastVisibleIndex(elementWidths, viewportWidth, currentIndex) {
                let accumulatedWidth = 0;
                for (let i = currentIndex; i < this.elementWidths.length; i++) {
                    accumulatedWidth += this.elementWidths[i];
                    if (accumulatedWidth > this.viewportWidth) {
                        return i - 1;
                    }
                }

                return this.elementWidths.length - 1;
            }

            nextIndex(elementWidths, viewportWidth, currentIndex) {
                let distanceFromRight = [];
                elementWidths.reduceRight((a, b, i) => distanceFromRight[i] = a + b, 0);

                let differencePx = 0;
                for (let i = currentIndex; i < elementWidths.length; i++) {
                    differencePx += elementWidths[i];
                    let endOfViewport = distanceFromRight[i] <= viewportWidth;
                    let fullPage = differencePx > viewportWidth;
                    if (fullPage) {
                        // We subtract 1 to leave one item on the left visible, for context
                        return Math.max(0, i - 1);
                    } else if (endOfViewport) {
                        return i;
                    }
                }

                return currentIndex;
            }

            prevIndex(elementWidths, viewportWidth, currentIndex) {
                let differencePx = 0;
                for (let i = currentIndex; i >= 0; i--) {
                    differencePx += elementWidths[i];
                    let fullPage = differencePx > viewportWidth;
                    if (fullPage) {
                        // we add 1 to leave one item on the right visible, for context
                        return Math.min(elementWidths.length - 1, i + 1);
                    }
                }

                // Left edge
                return 0;
            }

            updateCss() {
                let scrollPx = this.elementWidths.reduce((a, b, i) => i >= this.scrollIndex ? a : a + b, 0);
                let translateXCss = 'translateX(' + (-scrollPx) + 'px)',
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
            updateLimit(index = this.scrollIndex) {
                if (!this.onLimitChanged) {
                    // No one's listening
                    return;
                } else if (this.options.supportVariableWidth) {
                    this.$log.warn('you registered for limit changes, but that ' +
                        'isn\'t supported in variable width mode');
                    this.onLimitChanged({limit: this.elementWidths.length});
                    return;
                }

                let left = this.nextIndex(this.elementWidths, this.viewportWidth, index);
                let i, accumulatedWidth = 0;
                for (i = left; i < this.elementWidths.length; i++) {
                    if (accumulatedWidth > this.viewportWidth) {
                        // This item is the first one that will be invisible after the next scroll
                        break;
                    }
                    accumulatedWidth += this.elementWidths[i];
                }

                let limit = Math.min(i, this.elementWidths.length);
                this.onLimitChanged({limit});
                this.elementCountDirty = true;
            }

            findIndex(el) {
                const maximumDepth = 10;
                let index;
                let elArray = Array.from(this.elements);
                for (let i = 0; i < maximumDepth; i++) {
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

            focus(index) {
                if (this.elementCountDirty) {
                    this.measureElements();
                }

                let newFocus = this.elements[index];
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

            onLayoutScrolled(event) {
                // The layout scrolled, because the focus changed and couldn't fit in the
                // viewport. This can happen when tabbing rapidly, since the css animation
                // may not have completed. In any event, we want to keep the control in the
                // hands of the css, not the scroll postition, so we need to reset it.
                event.target.scrollLeft = 0;
            }

            // Used by components inside the carousel to determine their appropriate tab index
            itemTabIndex(item) {
                if (this.options.useArrows) {
                    let index = this.items.indexOf(item);
                    return index === 0 ? '' : '-1';
                } else {
                    return '';
                }
            }
        }
    });

    /* @ngInject */
    function carouselCoordinator($timeout) {
        // Coordinates multiple carousels so they can do their resize logic all at once and not
        // kick off redundant $digest cycles
        const service = {
            setTimeoutZero
        };

        let promise;

        return service;

        //////////

        function setTimeoutZero(callback) {
            if (!promise) {
                promise = $timeout(angular.noop, 0);
                promise.then(() => promise = undefined);
            }

            promise.then(callback);
        }
    }
})();
