/*globals mockData*/
describe('mediaListViewModelDefinition', function () {
    'use strict';

    var mediaListViewModelDefinition, EntitlementsService;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_mediaListViewModelDefinition_, _EntitlementsService_) {
        mediaListViewModelDefinition = _mediaListViewModelDefinition_;
        EntitlementsService = _EntitlementsService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(mediaListViewModelDefinition).toBeDefined();
        let ins = mediaListViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins.name).toBe('mock name');
    });

    it('should have relevant information', function() {
        let data = {
            name: 'mock name',
            type: 'media list',
            availableOutOfHome: true,
            context: {title: 'mock title'},
            twcTvNetworkDisplayMode: 'mock mode',
            uiHint: 'mock hint',
            uri: 'http://mockuri',
            total_results: 2,
            media: [1, 2]
        }, mediaList = mediaListViewModelDefinition.createInstance(data);
        
        expect(mediaList.name).toBe(data.name);
        expect(mediaList.type).toBe(data.type);
        expect(mediaList.availableOutOfHome).toBe(data.availableOutOfHome);
        expect(mediaList.context).toEqual(data.context);
        expect(mediaList.twcTvNetworkDisplayMode).toBe(data.twcTvNetworkDisplayMode);
        expect(mediaList.uiHint).toBe(data.uiHint);
        expect(mediaList.uri).toBe(data.uri);
        expect(mediaList.totalResults).toBe(data.media.length);
        expect(mediaList.media).toEqual(data.media);
    });
    
    it('should have valid entitlement', function () {
        let mediaList1 = mediaListViewModelDefinition.createInstance({details: {entitled: true}}),
            mediaList2 = mediaListViewModelDefinition.createInstance({details: {entitled: false}});
        expect(mediaList1.isEntitled).toBe(true);
        expect(mediaList2.isEntitled).toBe(false);

        EntitlementsService.isVodNetworkEntitled = () => false;
        let mediaList3 = mediaListViewModelDefinition.createInstance({product_providers: [1, 2]});
        expect(mediaList3.isEntitled).toBe(false);

        EntitlementsService.isVodNetworkEntitled = () => true;
        mediaList3 = mediaListViewModelDefinition.createInstance({product_providers: [1, 2]});
        expect(mediaList3.isEntitled).toBe(true);
    });
});
