/*globals mockData*/
describe('resultsViewModelDefinition', function () {
    'use strict';

    var resultsViewModelDefinition, delegateUtils;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_resultsViewModelDefinition_, _delegateUtils_) {
        resultsViewModelDefinition = _resultsViewModelDefinition_;
        delegateUtils = _delegateUtils_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(resultsViewModelDefinition).toBeDefined();
        let ins = resultsViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins).toBeDefined();
    });

    it('should have relevant information', function() {
        delegateUtils.getPersonImageUri = () => 'mock person image uri';
        let data = {
            resultDisplay: 'Person',
            searchStringMatch: 'mock search string match',
            uri: 'mock uri'
        }, result = resultsViewModelDefinition.createInstance(data);
        
        expect(result.name).toBe(data.searchStringMatch);
        expect(result.resultDisplay).toBe(data.resultDisplay);
        expect(result.clickRoute).toEqual([ 'search.person', { query : 'mock search string match', uri : 'mock uri' } ]);
    });
    
    it('should have valid image uri value', function () {
        delegateUtils.getPersonImageUri = () => 'mock person image uri';
        let result1 = resultsViewModelDefinition.createInstance({
            resultDisplay: 'Person'
        });
        
        expect(result1.imageUri).toBe('mock person image uri');
        
        delegateUtils.createProductImageFunction = () => (() => 'mock product image uri');
        let result2 = resultsViewModelDefinition.createInstance({
            resultDisplay: 'Team'
        });
        
        expect(result2.imageUri).toBe('mock product image uri');
    });
});
