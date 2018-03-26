/**
 * ovpGridList
 *
 * Lays out a grid of items and a list of items. Optionally includes a grid list toggle, or one can be
 * supplied elsewhere on the page and paired up by using the same id.
 *
 * example usage:
 *
 * <ovp-grid-list items="vm.someArray" options="vm.someOptionsObject">
 *    <grid-items>
 *       <div ng-repeat="asset in vm.someArray">
 *          This content for {{asset.title}} will be visible in grid mode
 *       </div>
 *    </grid-items>
 *    <list-items>
 *       <div ng-repeat="asset in vm.someArray">
 *          This content for {{asset.title}} will be visible in list mode
 *       </div>
 *    </list-items>
 * </ovp-grid-list>
 *
 * OR, with grid only:
 *
 * <ovp-grid-list items="vm.channels" options="{gridOnly: true}">
 *    <grid-items>
 *       <channel-card ng-repeat="channel in vm.channels" channel="channel"></channel-card>
 *    </grid-items>
 * </ovp-grid-list>
 *
 * OR, with external toggle:
 *
 * <grid-list-toggler id="'someUniqueString'"></grid-list-toggler>
 * <ovp-grid-list items="vm.assets" options="{showPagination: false, id: 'someUniqueString'}">
 *   <grid-items>
 *      <ovp-product ng-repeat="asset in vm.assets" asset="asset"></ovp-product>
 *   </grid-items>
 *   <list-items>
 *      <ovp-product ng-repeat="asset in vm.assets" asset="asset" template='list'></ovp-product>
 *   </list-items>
 * </ovp-grid-list>
 *
 * Bindings:
 *    items: (array) the array of objects being rendered. Note that the same array must also be passed into
 *       the ng-repeat (or similar directive like dir-paginate).
 *    options: (object) options to modify the grid-list behavior (see below)
 *    onPageChanged: (function) callback to execute when the page changes. Useful for server side pagination
 *    onViewChanged: (function) callback for when the view changes (from grid to list and vice versa)
 *
 * Options:
 *    id: (string) an optional identifier to pair up a gridlist with a gridlist toggle. Used for saving
 *        state to local storage, and for differentiating multiple gridlists on a single page
 *    defaultState: (string) which mode to start in, either 'grid' or 'list'. Defaults to grid.
 *    useLocalStorage: (boolean) if true, the state will be saved to local storage using the specified id.
 *       A value loaded from local storage will trump the value set in the defaultState option.
 *
 *    showHeader: (boolean) if false, the header on top of the grid-list will be hidden. This means no
 *       title, total, pagination, grid/list toggle, nor filter will be visible, regardless of their
 *       settings. Defaults to true.
 *    title: (string) string to display in the header
 *    showTotal: (boolean) if true, the title will be appended with the count of the items. Defaults to false
 *    totalItems: (number) when server side pagination is being used, the number of items in the array would
 *       give the wrong count of items, so this will update the total in the title to the correct value. Not
 *       necessary if the items binding represents the full set of data.
 *    showToggle: (boolean) if true, the grid/list toggle will show if necessary. If false, toggle will be
 *       always hidden. Defaults to true
 *    showPagination (boolean) if true, pagination will show if necessary. If false, pagination will be
 *       always hidden. Defaults to true
 *    showFilter: (boolean) if true, a filter dropdown will be displayed. Defaults to false.
 *    filters: (array) array of filters. Each element of the array should look as follows
 *       {
 *          text: 'filtertext'
 *          clickCallback: function () {}  // optional
 *       }
 *    filterStartingIndex: (number) index to highlight in the filter list
 *
 *    listOnly: (boolean) if true, only the list view will be shown. This automatically overrides
 *       defaultState and showToggle.
 *    gridOnly: (boolean) if true, only the grid view will be shown. This automatically overrides
 *       defaultState and showToggle.
 *
 *    minimumGridItemSeparation (number) minimum number of pixels between grid items. The separation may be
 *       more depending on screen size, but will always be at least this much. defaults to 15
 *
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    dirPaginationControlsDirectiveDecorator.$inject = ["$delegate"];
    angular.module('ovpApp.directives.gridList', ['ovpApp.directives.gridList.toggler', 'ovpApp.directives.gridList.togglerService', 'ovpApp.directives.dropdown', 'ovpApp.services.ovpStorage', 'angularUtils.directives.dirPagination', 'rx']).decorator('dirPaginationControlsDirective', dirPaginationControlsDirectiveDecorator).component('ovpGridList', {
        bindings: {
            items: '<',
            options: '<',
            onPageChanged: '&?',
            onViewChanged: '&'
        },
        transclude: {
            grid: '?gridItems',
            list: '?listItems'
        },
        templateUrl: '/js/ovpApp/directives/ovp-grid-list.html',
        controller: (function () {
            /* @ngInject */

            OvpGridList.$inject = ["$scope", "$element", "$timeout", "gridListTogglerService", "ovpStorage", "$log", "$window", "$state"];
            function OvpGridList($scope, $element, $timeout, gridListTogglerService, ovpStorage, $log, $window, $state) {
                _classCallCheck(this, OvpGridList);

                angular.extend(this, { $scope: $scope, $element: $element, $timeout: $timeout, gridListTogglerService: gridListTogglerService, ovpStorage: ovpStorage,
                    $log: $log, $window: $window, $state: $state });
            }

            _createClass(OvpGridList, [{
                key: '$onInit',
                value: function $onInit() {
                    this.gridCalculationComplete = false;
                    angular.element(this.$window).on('resize', this.onResize.bind(this));
                    this.viewallPage = false;
                    if (this.$state.current.name.indexOf('viewall') !== -1) {
                        this.viewallPage = true;
                    }
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.options) {
                        this.applyDefaultOptions(changes.options.currentValue);
                    }
                    if (changes.items) {
                        this.recalculateGrid();
                    }
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    angular.element(this.$window).off('resize', this.onResize);
                    if (this.toggleSubscription) {
                        this.toggleSubscription.dispose();
                    }
                }

                /////////////////

            }, {
                key: 'applyDefaultOptions',
                value: function applyDefaultOptions(newOptions) {
                    var defaults = {
                        title: '',
                        defaultState: 'grid',
                        showHeader: true,
                        showToggle: true,
                        showFilter: false,
                        showPagination: true,
                        showTotal: false,
                        minimumGridItemSeparation: 15
                    };

                    this.options = angular.extend({}, defaults, newOptions);

                    this.chooseDefaultState();

                    if (this.options.listOnly || this.options.gridOnly) {
                        this.options.showToggle = false;
                    }

                    if (!this.options.filters || this.options.filters.length === 0) {
                        this.options.showFilter = false;
                    }

                    this.filterConfig = {
                        activeIndex: this.options.filterStartingIndex,
                        buttonLabel: 'Filter',
                        showLabel: true,
                        focusOnLoad: this.options.focusFilter
                    };
                }
            }, {
                key: 'chooseDefaultState',
                value: function chooseDefaultState() {
                    var _this = this;

                    var proposedState = undefined;
                    if (this.options.listOnly) {
                        proposedState = 'list';
                        this.state = proposedState;
                    } else if (this.options.gridOnly) {
                        proposedState = 'grid';
                        this.state = proposedState;
                    } else {
                        var fromLocalStorage = undefined;
                        if (this.options.useLocalStorage) {
                            if (!this.options.id) {
                                this.$log.warn('id not supplied; gridlist state can neither be loaded nor saved');
                            } else {
                                fromLocalStorage = this.ovpStorage.getItem(this.options.id);
                            }
                        }
                        proposedState = fromLocalStorage || this.options.defaultState;
                    }

                    var registration = this.gridListTogglerService.register(proposedState, this.options.id);
                    if (!this.options.listOnly && !this.options.gridOnly) {
                        this.state = registration.state;
                        this.onViewChanged({ view: registration.state });
                        this.toggleSubscription = registration.source.subscribe(function (newState) {
                            return _this.toggle(newState);
                        });
                    }
                }
            }, {
                key: 'recalculateGrid',
                value: function recalculateGrid() {
                    var _this2 = this;

                    if (this.state !== 'grid') {
                        return;
                    }

                    this.gridCalculationComplete = false;
                    this.$timeout(function () {
                        _this2.measureItems();
                        _this2.onResize();
                    });
                }
            }, {
                key: 'measureItems',
                value: function measureItems() {
                    this.itemWidth = this.$element.find('grid-items').children().outerWidth(true);
                }
            }, {
                key: 'onResize',
                value: function onResize() {
                    if (this.state !== 'grid') {
                        return;
                    }

                    var container = this.$element.find('.grid-container');
                    var children = container.children().children();
                    var itemWidthPlus = this.itemWidth + this.options.minimumGridItemSeparation * 2;
                    var containerWidth = container.innerWidth();
                    var columns = Math.max(1, Math.floor(containerWidth / itemWidthPlus));
                    var padding = 0;

                    if (children.length <= columns) {
                        padding = this.options.minimumGridItemSeparation;
                    } else {
                        var extraSpace = containerWidth - columns * this.itemWidth;
                        padding = Math.floor(extraSpace / (columns * 2));
                    }

                    children.css('padding', '0 ' + padding + 'px');
                    this.gridCalculationComplete = true;

                    this.$scope.$apply();
                }
            }, {
                key: 'toggle',
                value: function toggle(newState) {
                    if (this.state != newState && !this.listOnly && !this.gridOnly) {
                        this.state = newState;
                        if (this.state == 'grid') {
                            this.recalculateGrid();
                        }

                        if (this.options.useLocalStorage && this.options.id) {
                            this.ovpStorage.setItem(this.options.id, newState);
                        }

                        this.onViewChanged({ view: newState });
                    }
                }
            }, {
                key: 'pageChanged',
                value: function pageChanged(page) {
                    if (this.onPageChanged) {
                        this.onPageChanged(page);
                    }
                    this.gridCalculationComplete = false;
                }
            }, {
                key: 'hasPagination',
                value: function hasPagination() {
                    return this.options.showPagination === true;
                }
            }]);

            return OvpGridList;
        })()
    });

    /* @ngInject */
    function dirPaginationControlsDirectiveDecorator($delegate) {
        var directive = $delegate[0];
        var link = directive.link;
        var focusedElement = undefined;

        directive.compile = function () {
            return function (scope, element, attrs) {
                link.apply(this, arguments);
                scope.position = attrs.position;
                scope.focusedElement = focusedElement;
                scope.setPosition = function (pageNumber, position) {
                    focusedElement = position + pageNumber;
                    scope.focusedElement = focusedElement;
                };
            };
        };

        return $delegate;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/directives/ovp-grid-list.js.map
