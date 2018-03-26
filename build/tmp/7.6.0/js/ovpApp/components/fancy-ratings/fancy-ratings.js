'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    /**
     * fancyRatings
     *
     * Displays metacritic or common sense media rating
     *
     * Example Usage:
     * <fancy-ratings rating="someInputValue" type="metacritic"></fancy-ratings>
     *
     * Bindings:
     *    rating: (Number) numerical rating
     *    type: (String) 'metacritic' or 'common-sense-media'
     *    height: (Number) Height in pixels of the images. Defaults to 48
     */
    angular.module('ovpApp.components.fancy-ratings', ['ovpApp.config']).component('fancyRatings', {
        bindings: {
            rating: '<',
            type: '<',
            height: '<'
        },
        template: '\n                <div class="$ctrl.type" ng-if="$ctrl.rating">\n                   <img class="icon" ng-src="{{$ctrl.iconSrc}}" alt="$ctrl.labelText">\n                   <img class="label" ng-src="{{$ctrl.labelSrc}}" alt="$ctrl.labelText">\n                </div>',
        controller: (function () {
            /* @ngInject */

            FancyRatings.$inject = ["config"];
            function FancyRatings(config) {
                _classCallCheck(this, FancyRatings);

                this.config = config;
            }

            _createClass(FancyRatings, [{
                key: '$onChanges',
                value: function $onChanges(changes) {
                    if (changes.height && this.height === undefined) {
                        this.height = 48;
                    }

                    if (changes.rating) {
                        if (this.type === 'metacritic') {
                            //Force this to a 3 digit string with leading 0s
                            this.rating = this.rating && (parseInt(this.rating) + 1000).toString().substring(1);
                        } else if (this.type === 'common-sense-media') {
                            //Force to a 2 digit string
                            this.rating = this.rating && (parseInt(this.rating) + 100).toString().substring(1);
                        }
                    }

                    if (changes.type || changes.height) {
                        this.iconSrc = this.calculateIconSrc();
                    }

                    if (changes.type || changes.height || changes.rating) {
                        this.labelSrc = this.calculateLabelSrc();
                    }
                }
            }, {
                key: 'calculateIconSrc',
                value: function calculateIconSrc() {
                    var baseUrl = this.config.image_api + '/supporting';
                    var prefix = this.getImagePrefix();

                    return baseUrl + '?image=' + prefix + 'logo-mini&height=' + this.height;
                }
            }, {
                key: 'calculateLabelSrc',
                value: function calculateLabelSrc() {
                    var baseUrl = this.config.image_api + '/supporting';
                    var prefix = this.getImagePrefix();

                    return baseUrl + '?image=' + prefix + this.rating + '&height=' + this.height;
                }
            }, {
                key: 'getImagePrefix',
                value: function getImagePrefix() {
                    if (this.type === 'common-sense-media') {
                        return 'cs-';
                    } else if (this.type === 'metacritic') {
                        return 'mc-';
                    }
                }
            }]);

            return FancyRatings;
        })()
    });
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/components/fancy-ratings/fancy-ratings.js.map
