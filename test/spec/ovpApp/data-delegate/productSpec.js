/*globals mockData*/
describe('productViewModelDefinition', function () {
    'use strict';

    var productViewModelDefinition, BookmarkService;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_productViewModelDefinition_, _BookmarkService_) {
        productViewModelDefinition = _productViewModelDefinition_;
        BookmarkService = _BookmarkService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(productViewModelDefinition).toBeDefined();
        let ins = productViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins).toBeDefined();
    });

    it('should have relevant information', function() {
        let data = {
            resultDisplay: 11,
            availableOndemand: true,
            tmsProgramId: 'EP12345',
            uri: 'mock uri'
        }, product = productViewModelDefinition.createInstance(data);
        
        expect(product.resultDisplay).toBe(data.resultDisplay);
        expect(product.playable).toBe(data.availableOndemand);
        expect(product.clickRoute).toEqual(['product.event', {
            tmsId: data.tmsProgramId,
            uri: data.uri
        }]);
    });
    
    it('should have valid bookmark value', function() {
        BookmarkService.getBookmarkByTmsProgramId = function() {
            return {
                playMarkerSeconds: 10,
                runtimeSeconds: 100
            };
        };
        let product = productViewModelDefinition.createInstance({});
        
        expect(product.bookmark).toEqual({playMarkerSeconds: 10, runtimeSeconds : 100});
        expect(product.playedPct).toBe(10);
    })
});
