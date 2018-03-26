describe('ovpApp.product.focusRestore', function () {
    'use strict';
    let productFocusRestore, mockState, mockParams;

    beforeEach(module('ovpApp.product.focusRestore'));

    beforeEach(module(function ($provide) {
        mockState = {};
        mockParams = {}

        $provide.value('$state', mockState);
        $provide.value('$stateParams', mockParams);
    }));

    beforeEach(inject(function (_productFocusRestore_) {
        productFocusRestore = _productFocusRestore_;
    }));

    describe('getIndex', function () {
        it('should return index when going back', function () {
            mockState.current = {
                name: 'product.movie',
            };
            mockParams.foo = 'first';
            productFocusRestore.setIndex(5);

            let result = productFocusRestore.getIndex();
            expect(result).toEqual(5);
        });

        it('should return undefined when going to another product page', function () {
            mockState.current = {
                name: 'product.movie',
            };
            mockParams.foo = 'first';
            productFocusRestore.setIndex(5);
            mockParams.foo = 'second';

            let result = productFocusRestore.getIndex();
            expect(result).toEqual(undefined);
        });

        it('should be able to back track multiple times', function () {
            mockState.current = {
                name: 'product.movie',
            };
            mockParams.foo = 'first';
            productFocusRestore.setIndex(5);
            mockParams.foo = 'second';
            productFocusRestore.setIndex(10);

            expect(productFocusRestore.getIndex()).toEqual(10);
            mockParams.foo = 'first'
            expect(productFocusRestore.getIndex()).toEqual(5);
        });
    });
});
