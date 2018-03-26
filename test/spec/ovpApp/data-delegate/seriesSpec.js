/*globals mockData*/
describe('seriesViewModelDefinition', function () {
    'use strict';

    var seriesViewModelDefinition, delegateUtils;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (_seriesViewModelDefinition_, _delegateUtils_) {
        seriesViewModelDefinition = _seriesViewModelDefinition_;
        delegateUtils = _delegateUtils_;
    }));

    /* jscs: disable */
    it('can create an instance', function () {
        expect(seriesViewModelDefinition).toBeDefined();
        let ins = seriesViewModelDefinition.createInstance({
            name: 'mock name'
        });
        expect(ins).toBeDefined();
    });

    it('should have relevant information', function() {
        delegateUtils.createProductImageFunction = () => (() => 'mock product image uri');
        let data = {
            resultDisplay: 'Person',
            tmsSeriesId: 'mockTmsSeriesId',
            uri: 'mock uri',
            availableOndemand: true
        }, series = seriesViewModelDefinition.createInstance(data);
        
        expect(series.resultDisplay).toBe(data.resultDisplay);
        expect(series.playable).toBe(data.availableOndemand);
        expect(series.clickRoute).toEqual([ 'product.series', { tmsSeriesId : data.tmsSeriesId, uri : data.uri } ]);
    });
});
