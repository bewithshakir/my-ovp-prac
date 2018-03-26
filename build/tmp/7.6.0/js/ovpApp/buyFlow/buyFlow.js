'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';
    angular.module('ovpApp.buyFlow', ['ovpApp.buyFlow.router', 'ovpApp.config', 'ovpApp.buyFlow.service', 'ovpApp.buyFlow.baseOffer', 'ovpApp.buyFlow.extrasAndPremiums', 'ovpApp.buyFlow.collapsedStep', 'ovpApp.buyFlow.review', 'ovpApp.buyFlow.confirmation', 'ovpApp.buyFlow.welcome', 'ovpApp.components.modalKite']).component('buyFlow', {
        bindings: {},
        templateUrl: '/js/ovpApp/buyFlow/buyFlow.html',
        controller: (function () {
            /* @ngInject */

            BuyFlow.$inject = ["config", "$q", "$state", "$location", "$anchorScroll", "buyFlowService", "alert", "modalKite", "$rootScope", "rx", "$log"];
            function BuyFlow(config, $q, $state, $location, $anchorScroll, buyFlowService, alert, modalKite, $rootScope, rx, $log) {
                _classCallCheck(this, BuyFlow);

                angular.extend(this, { config: config, $q: $q, $state: $state, $location: $location, $anchorScroll: $anchorScroll, buyFlowService: buyFlowService, alert: alert, modalKite: modalKite,
                    $rootScope: $rootScope, rx: rx, $log: $log });
                this.prices = [];
                this.activeStep = 1;
            }

            _createClass(BuyFlow, [{
                key: '$onInit',
                value: function $onInit() {
                    var _this = this;

                    this.steps = [{
                        number: 1,
                        title: 'Spectrum TV Stream',
                        id: 'base',
                        offerings: [],
                        collapsed: false,
                        analytics: {
                            context: 'stream2',
                            pageName: 'stream2PackageDescription',
                            isLazyLoad: false
                        },
                        onContinue: function onContinue() {

                            // Analytics
                            _this.$rootScope.$broadcast('Analytics:select', {
                                context: 'stream2',
                                elementUiName: 'Select and Continue',
                                elementStandardizedName: 'confirm',
                                featureCurrentStep: 2
                            });

                            _this.buyFlowService.addBaseToCart(_this.offerId).then(function (cart) {
                                _this.cartId = cart.id;
                            }, function () {
                                _this.openErrorModal();
                            });
                        }
                    }, {
                        number: 2,
                        title: 'Optional Extras',
                        id: 'extras',
                        offerings: [],
                        collapsed: true,
                        analytics: {
                            context: 'stream2',
                            pageName: 'stream2AddOns',
                            isLazyLoad: true,
                            loaded: false
                        },
                        onContinue: function onContinue() {
                            var selectedBundles = _this.steps[1].offerings.filter(function (val) {
                                return val.checked;
                            }).map(function (bundle) {
                                return bundle.id;
                            });

                            // Analytics
                            _this.$rootScope.$broadcast('Analytics:select', {
                                context: 'stream2',
                                elementUiName: 'Continue',
                                elementStandardizedName: 'confirm',
                                featureCurrentStep: 3
                            });

                            _this.buyFlowService.addExtrasToCart(_this.cartId, selectedBundles).then(function () {}, function () {
                                _this.openErrorModal();
                            });
                        }
                    }, {
                        number: 3,
                        title: 'Premiums',
                        id: 'premiums',
                        offerings: [],
                        collapsed: true,
                        analytics: {
                            context: 'stream2',
                            pageName: 'stream2Premiums',
                            isLazyLoad: true,
                            loaded: false
                        },
                        onContinue: function onContinue() {
                            var selectedPremiums = _this.steps[2].offerings.filter(function (val) {
                                return val.checked;
                            }).map(function (bundle) {
                                return bundle.id;
                            });

                            // Analytics
                            _this.$rootScope.$broadcast('Analytics:select', {
                                context: 'stream2',
                                elementUiName: 'Continue',
                                elementStandardizedName: 'confirm',
                                featureCurrentStep: 4
                            });

                            _this.buyFlowService.addPremiumsToCart(_this.cartId, selectedPremiums).then(function () {
                                _this.updateCart();
                            }, function () {
                                _this.openErrorModal();
                            });
                        }
                    }, {
                        number: 4,
                        title: 'Review & Purchase',
                        id: 'review',
                        analytics: {
                            context: 'stream2',
                            pageName: 'stream2PurchaseAgreement',
                            isLazyLoad: false
                        },

                        collapsed: true
                    }];

                    this.buyFlowService.getBaseOffers().then(function (result) {
                        _this.updatePrice(result[0].price, result[0].name);
                        _this.steps[0].offerings = result;
                        var offerId = result[0].id;
                        _this.offerId = offerId;
                        return _this.$q.all([_this.buyFlowService.getExtras(offerId), _this.buyFlowService.getPremiums(offerId)]);
                    }, function () {
                        _this.openErrorModal();
                    }).then(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2);

                        var extras = _ref2[0];
                        var premiums = _ref2[1];

                        _this.steps[1].offerings = extras;
                        _this.steps[2].offerings = premiums;

                        // Analytics: Lazily loaded steps/pages now have all content (barring thumbnails),
                        // and can be fully rendered, not just partially rendered.
                        try {
                            _this.steps.filter(function (step) {
                                return step.analytics && step.analytics.isLazyLoad === true;
                            }).forEach(function (step) {
                                // Mark this step as fully loaded.
                                step.analytics.loaded = true;

                                // Issue page complete if this is the active step right now.
                                if (step.collapsed === false) {
                                    _this.$rootScope.$emit('Analytics:pageChangeComplete');
                                }
                            });
                        } catch (ex) {
                            _this.$log.error('Error', ex);
                        }
                    }, function () {
                        _this.openErrorModal();
                    });

                    // Analytics: Record that first page is displayed to user.
                    this.analyticsPageChangeForStep(this.steps[0]);
                }
            }, {
                key: 'previousStep',
                value: function previousStep(step) {
                    step.collapsed = true;
                    var prev = Math.max(0, this.steps.indexOf(step) - 1);
                    this.steps[prev].collapsed = false;
                    this.activeStep = this.steps[prev].number;

                    // Analytics
                    this.analyticsPageChangeForStep(this.steps[prev]);
                }
            }, {
                key: 'nextStep',
                value: function nextStep(step) {
                    step.collapsed = true;
                    var next = Math.min(this.steps.length - 1, this.steps.indexOf(step) + 1);
                    this.steps[next].collapsed = false;
                    this.activeStep = this.steps[next].number;
                    if (step.onContinue) {
                        step.onContinue.call(this);
                    }

                    // Analytics (must be after onContinue())
                    this.analyticsPageChangeForStep(this.steps[next]);
                }
            }, {
                key: 'showDivider',
                value: function showDivider(step, index) {
                    if (index === 0 && this.steps[0].collapsed === true) {
                        return true;
                    }
                    if (step.collapsed && this.steps[index - 1] && this.steps[index - 1].collapsed === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }, {
                key: 'titleClick',
                value: function titleClick(step) {
                    this.steps.forEach(function (s) {
                        return s.collapsed = true;
                    });
                    step.collapsed = false;

                    // Analytics
                    this.analyticsPageChangeForStep(step);
                }

                /**
                 * Emit pageChange events for given step for analytics purposes.
                 *
                 * @param step The step for which pageChange events are needed.
                 */
            }, {
                key: 'analyticsPageChangeForStep',
                value: function analyticsPageChangeForStep(step) {
                    try {
                        // Do nothing if no step or analytics
                        if (!step || !step.analytics) {
                            return;
                        }

                        this.$rootScope.$emit('Analytics:route-start', {
                            toState: {
                                analytics: step.analytics
                            }
                        });

                        // Lazily loaded pages require the partial-render event before
                        // the pageChangeComplete event.
                        if (step.analytics.isLazyLoad) {

                            // Is page fully loaded?
                            if (step.analytics.loaded) {
                                this.$rootScope.$emit('Analytics:pageChangeComplete');
                            }
                        } else {
                            // Page change is complete.
                            this.$rootScope.$emit('Analytics:pageChangeComplete');
                        }
                    } catch (ex) {
                        this.$log.error('Error', ex);
                    }
                }

                /**
                 * Collect the selected addOns for inclusion in analytics event.
                 *
                 * @return Map object containing selected bundle and premium IDs to names.
                 */
            }, {
                key: 'analyticsCollectSelectedOfferings',
                value: function analyticsCollectSelectedOfferings() {
                    var addOns = {};

                    try {
                        this.rx.Observable.from(Array.concat(this.steps[1].offerings, this.steps[2].offerings)).filter(function (val) {
                            return val.checked;
                        }).forEach(function (bundle) {
                            addOns[bundle.id] = bundle.name;
                        });
                    } catch (ex) {
                        this.$log.error('Error', ex);
                    }

                    return addOns;
                }
            }, {
                key: 'updatePrice',
                value: function updatePrice(price, component) {
                    var curr = this.prices.filter(function (p) {
                        return p.component === component;
                    });
                    if (curr.length) {
                        var i = this.prices.indexOf(curr[0]);
                        if (i !== -1) {
                            this.prices.splice(i, 1);
                        }
                    }
                    this.prices.push({ component: component, price: parseFloat(price) });
                }
            }, {
                key: 'price',
                value: function price() {
                    return this.prices.reduce(function (acc, current) {
                        return acc + current.price;
                    }, 0);
                }
            }, {
                key: 'cancel',
                value: function cancel() {
                    // Analytics (must happen before the navigation)
                    this.$rootScope.$broadcast('Analytics:select', {
                        context: 'stream2',
                        elementUiName: 'Decline',
                        elementStandardizedName: 'cancel',
                        featureCurrentStep: 5,
                        addOnsSelected: this.analyticsCollectSelectedOfferings()
                    });

                    this.$state.go('buyFlow.welcome');
                }
            }, {
                key: 'purchase',
                value: function purchase() {
                    var _this2 = this;

                    // Analytics (must happen before the navigation)
                    this.$rootScope.$broadcast('Analytics:select', {
                        context: 'stream2',
                        elementUiName: 'Agree & Purchase',
                        elementStandardizedName: 'confirm',
                        featureCurrentStep: 5,
                        addOnsSelected: this.analyticsCollectSelectedOfferings()
                    });

                    return this.buyFlowService.purchase(this.cartId).then(function () {
                        _this2.$state.go('buyFlow.confirmation');
                    }, function () {
                        _this2.openErrorModal();
                    });
                }
            }, {
                key: 'getCart',
                value: function getCart() {
                    return this.buyFlowService.getSummary(this.cartId);
                }
            }, {
                key: 'updateCart',
                value: function updateCart() {
                    var _this3 = this;

                    this.getCart().then(function (cart) {
                        _this3.cart = cart;
                    });
                }
            }, {
                key: 'openErrorModal',
                value: function openErrorModal() {
                    var _this4 = this;

                    this.modalKite.open({
                        size: 'lg',
                        title: 'Unable to Complete Request.',
                        body: 'We’re sorry, something didn\'t work quite right, but there\'s been no charge.',
                        primaryButtonText: 'OK',
                        onPrimaryButton: function onPrimaryButton() {
                            _this4.modalKite.close();
                        },
                        onClose: function onClose() {
                            _this4.$state.go('buyFlow.welcome');
                        }
                    });
                }
            }]);

            return BuyFlow;
        })()
    });
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/buyFlow.js.map
