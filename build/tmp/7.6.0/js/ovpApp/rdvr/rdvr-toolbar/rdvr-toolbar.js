'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * rdvr-toolbar
     *
     * Renders a set of widgets for the top of the rdvr pages
     *
     * Example Usage:
     * <rdvr-toolbar options="someInputValue"></rdvr-toolbar>
     *
     * Bindings:
     *    options: ([type]) [description]
     */
    angular.module('ovpApp.rdvr.rdvrToolbar', ['ovpApp.stbPicker', 'ovpApp.renameStb']).component('rdvrToolbar', {
        bindings: {
            options: '<'
        },
        templateUrl: '/js/ovpApp/rdvr/rdvr-toolbar/rdvr-toolbar.html',
        controller: (function () {
            /* @ngInject */

            RdvrToolbar.$inject = ["$timeout", "$interval", "dateUtil", "rx", "stbService", "modal", "$q"];
            function RdvrToolbar($timeout, $interval, dateUtil, rx, stbService, modal, $q) {
                _classCallCheck(this, RdvrToolbar);

                angular.extend(this, { $timeout: $timeout, $interval: $interval, dateUtil: dateUtil, rx: rx, stbService: stbService, modal: modal, $q: $q });
            }

            _createClass(RdvrToolbar, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.subscription = this.stbService.currentStbSource.filter(function (stb) {
                        return stb && stb.dvr === true;
                    }).subscribe(function (stb) {
                        return _this.stb = stb;
                    });
                }
            }, {
                key: '$onDestroy',
                value: function $onDestroy() {
                    this.subscription.dispose();
                }
            }, {
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.options) {
                        this.showToggler = changes.options.showToggler || false;
                    }
                }
            }, {
                key: 'showDvrPicker',
                value: function showDvrPicker() {
                    var _this2 = this;

                    this.modal.open({
                        component: 'stb-picker',
                        windowClass: 'ovp-watch-on-tv-picker-container',
                        showCloseIcon: false,
                        ariaDescribedBy: 'picker-description',
                        ariaLabelledBy: 'picker-label',
                        resolve: {
                            stbs: function stbs() {
                                return _this2.$q.all([_this2.stbService.getSTBs(), _this2.stbService.getCurrentStb()]).then(function (_ref) {
                                    var _ref2 = _slicedToArray(_ref, 2);

                                    var stbs = _ref2[0];
                                    var current = _ref2[1];

                                    return stbs.filter(function (s) {
                                        return s.dvr;
                                    })
                                    // Move the selected set top box to the front of the list
                                    .sort(function (a, b) {
                                        if (a.macAddress === current.macAddress) {
                                            return -1;
                                        } else if (b.macAddress === current.macAddress) {
                                            return 1;
                                        }
                                        return 0;
                                    });
                                });
                            },
                            title: function title() {
                                return 'Select your DVR';
                            },
                            ariaDescription: function ariaDescription() {
                                return 'Choose a DVR device from the list to manage';
                            }
                        }
                    }).result.then(this.stbService.setCurrentStb);
                }
            }, {
                key: 'renameStb',
                value: function renameStb() {
                    var _this3 = this;

                    this.modal.open({
                        component: 'rename-stb',
                        windowClass: 'ovp-watch-on-tv-picker-container',
                        showCloseIcon: false,
                        ariaLabelledBy: 'rename-label',
                        resolve: {
                            stb: function stb() {
                                return _this3.stb;
                            }
                        }
                    });
                }
            }]);

            return RdvrToolbar;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/rdvr/rdvr-toolbar/rdvr-toolbar.js.map
