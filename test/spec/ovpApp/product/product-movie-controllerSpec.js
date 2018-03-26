
describe('ovpApp.product.movieController', function () {
    'use strict';

    var $scope, prodMovieController;


    beforeEach(function () {
        //var p = module('ovpApp.product.viewModel');
        //var mod = module('ovpApp.product.movie');
        console.log('Whatis that  the ', module);
    })

    /* jscs: disable */
    beforeEach(inject(function (_$controller_, _$rootScope_, _$injector_) {

        $scope = _$rootScope_.$new();

        prodMovieController = _$controller_('ProductMovieController', {
            $scope: $scope,
            subViews: _subViews_
        });
    }));
});
