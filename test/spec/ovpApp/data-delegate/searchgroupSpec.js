/*globals mockData*/
describe('searchgroupViewModelDefinition', function () {
    'use strict';

    var searchgroupViewModelDefinition, delegateUtils;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_searchgroupViewModelDefinition_, _delegateUtils_) {
        searchgroupViewModelDefinition = _searchgroupViewModelDefinition_;
        delegateUtils = _delegateUtils_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(searchgroupViewModelDefinition).toBeDefined();
        let ins = searchgroupViewModelDefinition.createInstance({
            title: 'mock title'
        });
        expect(ins).toBeDefined();
    });

    it('should have relevant information', function() {
        delegateUtils.getPersonImageUri = () => 'mock person image uri';
        let data = {
            title: 'Person',
            results: [1, 2],
            num_results: 2
        }, result = searchgroupViewModelDefinition.createInstance(data);
        
        expect(result.title).toBe(data.title);
        expect(result.numResults).toBe(data.num_results);
        expect(result.results.length).toBe(2);
    });
});
