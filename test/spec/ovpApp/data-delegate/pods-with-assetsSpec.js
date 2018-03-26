/*globals mockData*/
describe('podsWithAssetsDefinition', function () {
    'use strict';

    var podsWithAssetsDefinition, EntitlementsService;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_podsWithAssetsDefinition_, _EntitlementsService_) {
        podsWithAssetsDefinition = _podsWithAssetsDefinition_;
        EntitlementsService = _EntitlementsService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(podsWithAssetsDefinition).toBeDefined();
        let ins = podsWithAssetsDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins.name).toBe('mock name');
    });

    it('should have relevant information', function() {
        let data = {
            name: 'mock name',
            type: 'network list',
            availableOutOfHome: true,
            context: {id: 'abcd'},
            twcTvNetworkDisplayMode: 'pods with asset display mode',
            uiHint: 'mock ui hint',
            uri: 'http://mockuri'
        }, podsWithAssets = podsWithAssetsDefinition.createInstance(data);
        
        expect(podsWithAssets.name).toBe(data.name);
        expect(podsWithAssets.type).toBe(data.type);
        expect(podsWithAssets.availableOutOfHome).toBe(data.availableOutOfHome);
        expect(podsWithAssets.context).toEqual(data.context);
        expect(podsWithAssets.twcTvNetworkDisplayMode).toBe(data.twcTvNetworkDisplayMode);
        expect(podsWithAssets.uiHint).toBe(data.uiHint);
        expect(podsWithAssets.uri).toBe(data.uri);
    });
    
    it('should have valid categories value', function () {
        let podsWithAssets = podsWithAssetsDefinition.createInstance({
            results: [{id: '1'}, {id: '2'}, {id: '3'}]
        });

        expect(podsWithAssets.categories.length).toBe(3);
    });
    
    it('should have valid entitlement', function () {
        let podsWithAssets1 = podsWithAssetsDefinition.createInstance({details: {entitled: true}}),
            podsWithAssets2 = podsWithAssetsDefinition.createInstance({details: {entitled: false}});
        expect(podsWithAssets1.isEntitled).toBe(true);
        expect(podsWithAssets2.isEntitled).toBe(false);

        EntitlementsService.isVodNetworkEntitled = () => false;
        let podsWithAssets3 = podsWithAssetsDefinition.createInstance({product_providers: [1, 2]});
        expect(podsWithAssets3.isEntitled).toBe(false);

        EntitlementsService.isVodNetworkEntitled = () => true;
        podsWithAssets3 = podsWithAssetsDefinition.createInstance({product_providers: [1, 2]});
        expect(podsWithAssets3.isEntitled).toBe(true);
    });
});
