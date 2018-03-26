'use strict';

(function () {
    'use strict';

    buyFlowService.$inject = ["config", "$http", "$q", "$rootScope"];
    angular.module('ovpApp.buyFlow.service', []).factory('buyFlowService', buyFlowService);

    /** @ngInject */
    function buyFlowService(config, $http, $q, $rootScope) {

        var pi = config.piHost;

        var service = {
            getBaseOffers: getBaseOffers,
            getExtras: getExtras,
            getPremiums: getPremiums,
            addBaseToCart: addBaseToCart,
            addExtrasToCart: addExtrasToCart,
            addPremiumsToCart: addPremiumsToCart,
            getSummary: getSummary,
            purchase: purchase
        };
        return service;

        /////////

        /**
         * Starting point for the buy flow. Gets a list of offers for the user to choose from
         * (there may be only one)
         *
         * @return {Promise<[Offer]>} Promise which resolves to an array of offers
         *
         * With an Offer being:
         * {
         *    channels: [Channel]
         *    description: string
         *    hasAdOns: boolean
         *    id: string
         *    imageUrl: string
         *    name: string
         *    price: string
         * }
         *
         * With a Channel being
         * {
         *    id: string
         *    networkName: string
         *    tmsId: number
         * }
         *
         */
        function getBaseOffers() {
            var url = '' + pi + config.streamPlus.offers + config.streamPlus.base;
            var options = { withCredentials: true };
            return $http.get(url, options).then(function (result) {
                return result.data.offers;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        /**
         * Get extra offerings related to a base offering
         *
         * @param {string} baseOfferId
         * @return {Promise<Offer>}
         */
        function getExtras(baseOfferId) {
            return getMore(baseOfferId, 'extras');
        }

        /**
         * Get premium offerings related to a base offering
         *
         * @param {string} baseOfferId
         * @return {Promise<Offer>}
         */
        function getPremiums(baseOfferId) {
            return getMore(baseOfferId, 'premiums');
        }

        // Private helper method
        function getMore(baseOfferId, category) {
            if (baseOfferId === undefined || category === undefined) {
                return $q.resolve();
            }

            var url = '' + pi + config.streamPlus.offers + config.streamPlus.base + '/' + baseOfferId + '/' + category;
            var options = { withCredentials: true };
            return $http.get(url, options).then(function (result) {
                return result.data.Offers;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        /**
         * Starting point for purchasing an offer.
         *
         * @param {string} baseId ID of the baseOffer to begin purchasing
         *
         * @return {Promise<Cart>} Promise which resolves to a cart object
         *
         * With a Cart being:
         * {
         *    baseOffer: [Offer]
         *    extraOffers: [Offer]
         *    premiumOffers: [Offer]
         *    id: string
         * }
         */
        function addBaseToCart(baseId) {
            var url = '' + pi + config.streamPlus.offers + config.streamPlus.cart + '/base';
            return $http.post(url, [baseId]).then(function (result) {
                return result.data.Cart;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        /**
         * Add extras offers to a cart. To get a cartID, you'll need to have started a cart using addBaseToCart.
         *
         * @param {string} cartId
         * @param {string | [string]} extraIds
         *
         * @return {Promise<Cart>}
         */
        function addExtrasToCart(cartId, extraIds) {
            if (!angular.isArray(extraIds)) {
                extraIds = [extraIds];
            }
            return addToCart(cartId, extraIds, 'extras');
        }

        /**
         * Add premium offers to a cart. To get a cartID, you'll need to have started a cart using addBaseToCart.
         *
         * @param {string} cartId
         * @param {string | [string]} premiumIds
         *
         * @return {Promise<Cart>}
         */
        function addPremiumsToCart(cartId, premiumIds) {
            if (!angular.isArray(premiumIds)) {
                premiumIds = [premiumIds];
            }
            return addToCart(cartId, premiumIds, 'premiums');
        }

        //Private helper method
        function addToCart(cartId, selectionIds, category) {
            var url = cartUrl(cartId, category);
            return $http.put(url, selectionIds).then(function (result) {
                return result.data.Cart;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        /**
         * Get a summary of the cart's contents, including prices
         * @param {string} cartId
         * @return {Promise<CartSummary>}
         *
         * With a CartSummary having all the parameters of Cart, plus:
         * {
         *    baseOfferCount: number
         *    baseOfferPrice: string
         *    extraOfferCount: number
         *    extraOfferPrice: string
         *    premiumOfferCount: number
         *    premiumOfferPrice: string
         *    price: string
         * }
         */
        function getSummary(cartId) {
            var url = cartUrl(cartId, 'summarize');
            var options = { withCredentials: true };
            return $http.get(url, options).then(function (result) {
                return result.data.Cart;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        /**
         * Purchase a cart. The final step in teh buy flow.
         * @param {string} cartId
         *
         * @return {Promise}
         */
        function purchase(cartId) {
            var url = cartUrl(cartId, 'purchase');
            return $http.put(url).then(function (result) {
                return result.data;
            }, function (err) {
                $rootScope.$emit('Analytics:error', {
                    httpError: err,
                    errorType: 'stream2'
                });
                return $q.reject(err);
            });
        }

        //Pricate helper method
        function cartUrl(cartId, category) {
            return '' + pi + config.streamPlus.offers + config.streamPlus.cart + '/' + cartId + '/' + category;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/buyFlow/buyFlow-service.js.map
