(function () {
    'use strict';
    angular.module('ovpApp.buyFlow', [
        'ovpApp.buyFlow.router',
        'ovpApp.config',
        'ovpApp.buyFlow.service',
        'ovpApp.buyFlow.baseOffer',
        'ovpApp.buyFlow.extrasAndPremiums',
        'ovpApp.buyFlow.collapsedStep',
        'ovpApp.buyFlow.review',
        'ovpApp.buyFlow.confirmation',
        'ovpApp.buyFlow.welcome',
        'ovpApp.components.modalKite'
    ])
    .component('buyFlow', {
        bindings: {},
        templateUrl: '/js/ovpApp/buyFlow/buyFlow.html',
        controller: class BuyFlow {
            /* @ngInject */
            constructor(config, $q, $state, $location, $anchorScroll, buyFlowService, alert, modalKite,
                $rootScope, rx, $log) {
                angular.extend(this, {config, $q, $state, $location, $anchorScroll, buyFlowService, alert, modalKite,
                    $rootScope, rx, $log});
                this.prices = [];
                this.activeStep = 1;
            }

            $onInit() {
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
                    onContinue: () => {

                        // Analytics
                        this.$rootScope.$broadcast('Analytics:select', {
                            context: 'stream2',
                            elementUiName: 'Select and Continue',
                            elementStandardizedName: 'confirm',
                            featureCurrentStep: 2
                        });

                        this.buyFlowService.addBaseToCart(this.offerId).then(cart => {
                            this.cartId = cart.id;
                        }, () => {
                            this.openErrorModal();
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
                    onContinue: () => {
                        let selectedBundles = this.steps[1].offerings
                        .filter((val) => val.checked)
                        .map((bundle) => bundle.id);

                        // Analytics
                        this.$rootScope.$broadcast('Analytics:select', {
                            context: 'stream2',
                            elementUiName: 'Continue',
                            elementStandardizedName: 'confirm',
                            featureCurrentStep: 3
                        });

                        this.buyFlowService.addExtrasToCart(this.cartId, selectedBundles).then(() => {}, () => {
                            this.openErrorModal();
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
                    onContinue: () => {
                        let selectedPremiums = this.steps[2].offerings
                        .filter((val) => val.checked)
                        .map((bundle) => bundle.id);

                        // Analytics
                        this.$rootScope.$broadcast('Analytics:select', {
                            context: 'stream2',
                            elementUiName: 'Continue',
                            elementStandardizedName: 'confirm',
                            featureCurrentStep: 4
                        });

                        this.buyFlowService.addPremiumsToCart(this.cartId, selectedPremiums).then(() => {
                            this.updateCart();
                        }, () => {
                            this.openErrorModal();
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

                this.buyFlowService.getBaseOffers()
                    .then(result => {
                        this.updatePrice(result[0].price, result[0].name);
                        this.steps[0].offerings = result;
                        const offerId = result[0].id;
                        this.offerId = offerId;
                        return this.$q.all([
                            this.buyFlowService.getExtras(offerId),
                            this.buyFlowService.getPremiums(offerId)
                        ]);
                    }, () => {
                        this.openErrorModal();
                    })
                    .then(([extras, premiums]) => {
                        this.steps[1].offerings = extras;
                        this.steps[2].offerings = premiums;

                        // Analytics: Lazily loaded steps/pages now have all content (barring thumbnails),
                        // and can be fully rendered, not just partially rendered.
                        try {
                            this.steps
                                .filter((step) => step.analytics && step.analytics.isLazyLoad === true)
                                .forEach(step => {
                                    // Mark this step as fully loaded.
                                    step.analytics.loaded = true;

                                    // Issue page complete if this is the active step right now.
                                    if (step.collapsed === false) {
                                        this.$rootScope.$emit('Analytics:pageChangeComplete');
                                    }
                                });
                        } catch (ex) {
                            this.$log.error('Error', ex);
                        }
                    }, () => {
                        this.openErrorModal();
                    });

                // Analytics: Record that first page is displayed to user.
                this.analyticsPageChangeForStep(this.steps[0]);
            }

            previousStep(step) {
                step.collapsed = true;
                const prev = Math.max(0, this.steps.indexOf(step) - 1);
                this.steps[prev].collapsed = false;
                this.activeStep = this.steps[prev].number;

                // Analytics
                this.analyticsPageChangeForStep(this.steps[prev]);
            }

            nextStep(step) {
                step.collapsed = true;
                const next = Math.min(this.steps.length - 1, this.steps.indexOf(step) + 1);
                this.steps[next].collapsed = false;
                this.activeStep = this.steps[next].number;
                if (step.onContinue) {
                    step.onContinue.call(this);
                }

                // Analytics (must be after onContinue())
                this.analyticsPageChangeForStep(this.steps[next]);
            }

            showDivider(step, index) {
                if (index === 0 && this.steps[0].collapsed === true) {
                    return true;
                }
                if (step.collapsed && this.steps[index - 1] && this.steps[index - 1].collapsed === true) {
                    return true;
                } else {
                    return false;
                }
            }

            titleClick(step) {
                this.steps.forEach(s => s.collapsed = true);
                step.collapsed = false;

                // Analytics
                this.analyticsPageChangeForStep(step);
            }

            /**
             * Emit pageChange events for given step for analytics purposes.
             *
             * @param step The step for which pageChange events are needed.
             */
            analyticsPageChangeForStep(step) {
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
            analyticsCollectSelectedOfferings() {
                let addOns = {};

                try {
                    this.rx.Observable.from(
                        Array.concat(this.steps[1].offerings,
                            this.steps[2].offerings))
                        .filter((val) => val.checked)
                        .forEach((bundle) => {
                            addOns[bundle.id] = bundle.name;
                        });
                } catch (ex) {
                    this.$log.error('Error', ex);
                }

                return addOns;
            }

            updatePrice(price, component) {
                const curr = this.prices.filter((p) => p.component === component);
                if (curr.length) {
                    const i = this.prices.indexOf(curr[0]);
                    if (i !== -1) {
                        this.prices.splice(i, 1);
                    }
                }
                this.prices.push({component: component, price: parseFloat(price)});
            }

            price() {
                return this.prices.reduce((acc, current) => {
                    return acc + current.price;
                }, 0);
            }

            cancel() {
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

            purchase() {

                // Analytics (must happen before the navigation)
                this.$rootScope.$broadcast('Analytics:select', {
                    context: 'stream2',
                    elementUiName: 'Agree & Purchase',
                    elementStandardizedName: 'confirm',
                    featureCurrentStep: 5,
                    addOnsSelected: this.analyticsCollectSelectedOfferings()
                });

                return this.buyFlowService.purchase(this.cartId).then(() => {
                    this.$state.go('buyFlow.confirmation');
                }, () => {
                    this.openErrorModal();
                });
            }

            getCart() {
                return this.buyFlowService.getSummary(this.cartId);
            }

            updateCart() {
                this.getCart().then(cart => {
                    this.cart = cart;
                });
            }

            openErrorModal() {
                this.modalKite.open({
                    size: 'lg',
                    title: 'Unable to Complete Request.',
                    body: 'We’re sorry, something didn\'t work quite right, but there\'s been no charge.',
                    primaryButtonText: 'OK',
                    onPrimaryButton: () => {
                        this.modalKite.close();
                    },
                    onClose: () => {
                        this.$state.go('buyFlow.welcome');
                    }
                });
            }
        }
    });
})();
