/*globals mockData*/
describe('networkListViewModelDefinition', function () {
    'use strict';

    var networkListViewModelDefinition, EntitlementsService;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_networkListViewModelDefinition_, _EntitlementsService_) {
        networkListViewModelDefinition = _networkListViewModelDefinition_;
        EntitlementsService = _EntitlementsService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(networkListViewModelDefinition).toBeDefined();
        let ins = networkListViewModelDefinition.createInstance({
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
            twcTvNetworkDisplayMode: 'network display mode',
            uiHint: 'mock ui hint',
            uri: 'http://mockuri'
        }, networkList = networkListViewModelDefinition.createInstance(data);
        
        expect(networkList.name).toBe(data.name);
        expect(networkList.type).toBe(data.type);
        expect(networkList.availableOutOfHome).toBe(data.availableOutOfHome);
        expect(networkList.context).toEqual(data.context);
        expect(networkList.twcTvNetworkDisplayMode).toBe(data.twcTvNetworkDisplayMode);
        expect(networkList.uiHint).toBe(data.uiHint);
        expect(networkList.uri).toBe(data.uri);
    });
    
    it('should have valid networks value', function () {
        let networkList1 = networkListViewModelDefinition.createInstance({
            media: [{id: '1'}, {id: '2'}]
        }), networkList2 = networkListViewModelDefinition.createInstance({
            results: [{id: '1'}, {id: '2'}, {id: '3'}]
        });
        
        expect(networkList1.networks.length).toBe(2);
        expect(networkList2.networks.length).toBe(3);
    });
});
