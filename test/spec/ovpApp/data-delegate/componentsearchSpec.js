/*globals mockData*/
describe('componentsearchViewModelDefinition', function () {
    'use strict';

    var componentsearchViewModelDefinition;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_componentsearchViewModelDefinition_) {
        componentsearchViewModelDefinition = _componentsearchViewModelDefinition_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(componentsearchViewModelDefinition).toBeDefined();
        let ins = componentsearchViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins.queryString).toBe('mock name');
    });

    it('should have relevant information', function() {
        let data = {
            name: 'search item',
            results: [{name: 'one', numResults: 1}, {name: 'two', numResults: 1}],
            num_results: 2
        }, compSearch = componentsearchViewModelDefinition.createInstance(data);
        expect(compSearch.queryString).toBe(data.name);
        expect(compSearch.numCategories).toBe(data.num_results);
        for(let i = 0 ; i < data.results.length; i++) {
            expect(compSearch.categories[i].name).toBe(data.results[i].name);
        }
        expect(compSearch.numResults).toBe(2);
    });
});
