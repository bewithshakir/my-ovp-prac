'use strict';

(function () {
    'use strict';
    OvpRatingController.$inject = ["$scope", "ratingLookup"];
    angular.module('ovpApp.components.ovp.rating', []).constant('ratingLookup', {
        'ADULT': 'twcicon-rating-adult',
        'G': 'twcicon-rating-g',
        'NC-17': 'twcicon-rating-nc17',
        'NR': 'twcicon-rating-nr',
        'PG-13': 'twcicon-rating-pg13',
        'PG': 'twcicon-rating-pg',
        'R': 'twcicon-rating-r',
        'TV-14': 'twcicon-rating-tv14',
        'TV-G': 'twcicon-rating-tvg',
        'TV-MA': 'twcicon-rating-tvma',
        'TV-PG': 'twcicon-rating-tvpg',
        'TV-Y': 'twcicon-rating-tvy',
        'TV-Y7': 'twcicon-rating-tvy7'
    }).directive('ovpRating', OvpRatingDirective);

    /* @ngInject */
    function OvpRatingDirective() {
        var directive = {
            bindToController: true,
            controller: OvpRatingController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                rating: '='
            },
            templateUrl: '/js/ovpApp/components/ovp/ovp-rating/ovp-rating.html'
        };

        return directive;
    }

    /* @ngInject */
    function OvpRatingController($scope, ratingLookup) {
        var vm = this;

        vm.ratingData = [];

        activate();

        ///////////////////

        function activate() {
            $scope.$watch(function () {
                return vm.rating;
            }, function (nv) {
                nv = angular.isArray(nv) ? nv : [nv];
                vm.ratingData = nv.map(function (rating) {
                    var ratingClassObj = {};
                    if (ratingLookup[rating]) {
                        ratingClassObj[ratingLookup[rating]] = true;
                    }
                    return {
                        'class': ratingClassObj,
                        label: rating
                    };
                });
            });
        }
    }
})();
//# sourceMappingURL=../../../../maps-babel/ovpApp/components/ovp/ovp-rating/ovp-rating.js.map
