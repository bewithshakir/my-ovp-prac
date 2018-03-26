/*globals mockData*/
describe('categoryListViewModelDefinition', function () {
    'use strict';

    var categoryListViewModelDefinition,
        EntitlementsService,
        selectn = (obj, prop) => {
            try {
                return eval('obj.' + prop);
            } catch (err) {
                return undefined;
            }
        };

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_categoryListViewModelDefinition_, _EntitlementsService_) {
        categoryListViewModelDefinition = _categoryListViewModelDefinition_;
        EntitlementsService = _EntitlementsService_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(categoryListViewModelDefinition).toBeDefined();
        let ins = categoryListViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins.name).toBe('mock name');
    });

    it('should have relevant information', function() {
        let catListData = {
            name: 'catList',
            availableOutOfHome: false,
            context: 'context',
            twcTvNetworkDisplayMode: 'display mode',
            uiHint: 'ui hint',
            uri: 'http://test',
            total_results: 23
        }, catList = categoryListViewModelDefinition.createInstance(catListData);
        expect(catList.type).toBe(catListData.type);
        expect(catList.availableOutOfHome).toBe(catListData.availableOutOfHome);
        expect(catList.context).toBe(catListData.context);
        expect(catList.name).toBe(catListData.name);
        expect(catList.twcTvNetworkDisplayMode).toBe(catListData.twcTvNetworkDisplayMode);
        expect(catList.uiHint).toBe(catListData.uiHint);
        expect(catList.uri).toBe(catListData.uri);
        expect(catList.totalResults).toBe(catListData.total_results);
    });
    
    it('should have valid media value', function () {
        let catListData = {
            media: [
                {name: 'one'},
                {name: 'two'},
                {name: 'three'}
            ]
        }, catList = categoryListViewModelDefinition.createInstance(catListData);
        expect(catList.media.length).toBe(3);
        for(let i = 0; i < catListData.media.length; i++) {
            expect(catList.media[i].name).toBe(catListData.media[i].name);
        }
    });
    
    it('should have valid categories value', function () {
        let catListData = {
            categories: {
                results: [
                    {name: 'one'},
                    {name: 'two'},
                    {name: 'three'}
                ]
            }
        }, catList = categoryListViewModelDefinition.createInstance(catListData);
        expect(catList.categories.length).toBe(3);
        for(let i = 0; i < catListData.categories.results.length; i++) {
            expect(catList.categories[i].name).toBe(catListData.categories.results[i].name);
        }
    });
    
    it('should have valid entitlement value - part1', function () {
        let catList1 = categoryListViewModelDefinition.createInstance({details: {entitled: true}}),
            catList2 = categoryListViewModelDefinition.createInstance({details: {entitled: false}}),
            catList3 = categoryListViewModelDefinition.createInstance({entitled: true}),
            catList4 = categoryListViewModelDefinition.createInstance({entitled: false, details: {entitled: false}});
        expect(catList1.isEntitled).toBe(true);
        expect(catList2.isEntitled).toBe(false);
        expect(catList3.isEntitled).toBe(true);
        expect(catList4.isEntitled).toBe(false);
    });
    
    it('should have valid entitlement value - part2', function () {
        EntitlementsService.isVodNetworkEntitled = () => false;
        let catList5 = categoryListViewModelDefinition.createInstance({product_providers: [1, 2]});
        expect(catList5.isEntitled).toBe(false);

        EntitlementsService.isVodNetworkEntitled = () => true;
        catList5 = categoryListViewModelDefinition.createInstance({product_providers: [1, 2]});
        expect(catList5.isEntitled).toBe(true);
    });
});
