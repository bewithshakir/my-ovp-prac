
describe('ovpApp.analytics.analyticsAssetHelper', function () {
    'use strict';

    var subject;

    beforeEach(function () {
        module('ovpApp.analytics.analyticsAssetHelper');
    });

    beforeEach(inject(function(_analyticsAssetHelper_){
        subject = _analyticsAssetHelper_;
    }));

    it('getTmsProgramId() should return empty tmsProgramId if no value exists', function() {

        // No value for null or empty values
        expect(subject.getTmsProgramId(null)).toBeUndefined();
        expect(subject.getTmsProgramId({})).toBeUndefined();

        // Asset defined with empty tmsProgramIds array.
        expect(subject.getTmsProgramId({tmsProgramIds:[]})).toBeUndefined();
    });

    it('getTmsProgramId() should return tmsProgramId as a string if value exists', function() {

        // Asset defined with a scalar value.
        expect(subject.getTmsProgramId({tmsProgramId:5})).toEqual('5');
        expect(typeof subject.getTmsProgramId({tmsProgramId:5})).toEqual('string');

        // Asset defined with a populated tmsProgramIds array.
        expect(subject.getTmsProgramId({tmsProgramIds:[7]})).toEqual('7');

        // Asset defined with a multiple values in tmsProgramIds array.
        expect(subject.getTmsProgramId({tmsProgramIds:[7,8]})).toEqual('7');

        // Returns string, even though given int values.
        expect(typeof subject.getTmsProgramId({tmsProgramIds:[7,8]})).toEqual('string');
    });

    it('getProviderAssetId() should return empty providerAssetId if no value exists', function() {

        // No value for null or empty values
        expect(subject.getProviderAssetId(null)).toBeUndefined();
        expect(subject.getProviderAssetId({})).toBeUndefined();

        // Asset defined with empty tmsProgramIds array.
        expect(subject.getProviderAssetId({providerAssetIds:[]})).toBeUndefined();
    });

    it('getProviderAssetId() should return providerAssetId as a string if value exists', function() {

        // Asset defined with a scalar value.
        expect(subject.getProviderAssetId({providerAssetId:5})).toEqual('5');
        expect(typeof subject.getProviderAssetId({providerAssetId:5})).toEqual('string');

        // Asset defined with a populated tmsProgramIds array.
        expect(subject.getProviderAssetId({providerAssetIds:[7]})).toEqual('7');

        // Asset defined with a multiple values in tmsProgramIds array.
        expect(subject.getProviderAssetId({providerAssetIds:[7,8]})).toEqual('7');

        // Returns string, even though given int values.
        expect(typeof subject.getProviderAssetId({providerAssetIds:[7,8]})).toEqual('string');
    });

    it('getTmsSeriesId() should return empty tmsSeriesId if no value exists', function() {

        // No value for null or empty values
        expect(subject.getTmsSeriesId(null)).toBeUndefined();
        expect(subject.getTmsSeriesId({})).toBeUndefined();

        // Asset defined with empty tmsProgramIds array.
        expect(subject.getTmsSeriesId({tmsSeriesIds:[]})).toBeUndefined();
    });

    it('getTmsSeriesId() should return tmsSeriesId as a string if value exists', function() {

        // Asset defined with a scalar value.
        expect(subject.getTmsSeriesId({tmsSeriesId:5})).toEqual('5');
        expect(typeof subject.getTmsSeriesId({tmsSeriesId:5})).toEqual('string');

        // Asset defined with a populated tmsProgramIds array.
        expect(subject.getTmsSeriesId({tmsSeriesIds:[7]})).toEqual('7');

        // Asset defined with a multiple values in tmsProgramIds array.
        expect(subject.getTmsSeriesId({tmsSeriesIds:[7,8]})).toEqual('7');

        // Returns string, even though given int values.
        expect(typeof subject.getTmsSeriesId({tmsSeriesIds:[7,8]})).toEqual('string');
    });

    it('isParentallyBlocked() should return false unless definitively blocked', function() {

        // Fallthrough: If no asset, or empty asset, should return false.
        expect(subject.isParentallyBlocked(null)).toEqual(false);
        expect(subject.isParentallyBlocked({})).toEqual(false);

        // Test 'isBlockedByParentalControls' field
        expect(subject.isParentallyBlocked({isBlockedByParentalControls: false})).toEqual(false);
        expect(subject.isParentallyBlocked({
            isBlockedByParentalControls: true
        })).toEqual(true);

        // Test 'parentallyBlockedByChannel' field
        expect(subject.isParentallyBlocked({
            defaultStream: {
                streamProperties: {
                    parentallyBlockedByChannel: false
                }
            }
        })).toEqual(false);
        expect(subject.isParentallyBlocked({
            defaultStream: {
                streamProperties: {
                    parentallyBlockedByChannel: true
                }
            }
        })).toEqual(true);

        // Test 'parentallyBlockedByRating' field
        expect(subject.isParentallyBlocked({
            defaultStream: {
                streamProperties: {
                    parentallyBlockedByRating: false
                }
            }
        })).toEqual(false);
        expect(subject.isParentallyBlocked({
            defaultStream: {
                streamProperties: {
                    parentallyBlockedByRating: true
                }
            }
        })).toEqual(true);
    });

    it('should convert content classes to lowercase, regardless of validity', function() {

        // Valid, or valid-ish content classes
        expect(subject.getContentClass({contentClass:'linear'})).toEqual('linear');
        expect(subject.getContentClass({contentClass:'slinear'})).toEqual('slinear');
        expect(subject.getContentClass({contentClass:'ppv'})).toEqual('ppv');
        expect(subject.getContentClass({contentClass:'tvod'})).toEqual('tvod');
        expect(subject.getContentClass({contentClass:'tod'})).toEqual('tod');
        expect(subject.getContentClass({contentClass:'svod'})).toEqual('svod');
        expect(subject.getContentClass({contentClass:'fod'})).toEqual('fod');
        expect(subject.getContentClass({contentClass:'fvod'})).toEqual('fvod');
        expect(subject.getContentClass({contentClass:'trailer'})).toEqual('trailer');
        expect(subject.getContentClass({contentClass:'extra'})).toEqual('extra');
        expect(subject.getContentClass({contentClass:'dvr'})).toEqual('dvr');
        expect(subject.getContentClass({contentClass:'cdvr'})).toEqual('cdvr');

        // Clearly invalid content class
        expect(subject.getContentClass({contentClass:'bogus'})).toEqual('bogus');
    });

    it('should propagate null or missing content classes', function() {
        expect(subject.getContentClass({contentClass:null})).toBeNull();
        expect(subject.getContentClass({contentClass:''})).toEqual(null);
    });

    it('should properly execute convertAllValuesToStrings()', function() {
        let data = {
            propertyBoolTrue: true,
            propertyBoolFalse: false,
            propertyString1 : 'someString',
            propertyInteger0 : 0,
            propertyInteger1 : 1,
            propertyFloat0 : 0.0,
            propertyFloat1 : 1.1,
            object1: {}
        };

        let conversion = subject.convertAllValuesToStrings(data);

        console.log('converted from, to', data, conversion);

        expect(typeof conversion.propertyBoolTrue).toEqual('string');
        expect(typeof conversion.propertyBoolFalse).toEqual('string');
        expect(typeof conversion.propertyString1).toEqual('string');
        expect(typeof conversion.propertyInteger0).toEqual('string');
        expect(typeof conversion.propertyInteger1).toEqual('string');
        expect(typeof conversion.propertyFloat0).toEqual('string');
        expect(typeof conversion.propertyFloat1).toEqual('string');
        expect(typeof conversion.object1).toEqual('undefined');
    });

    it('should not break convertAllValuesToStrings() with null or empty objects', function() {

        expect(subject.convertAllValuesToStrings(null)).not.toEqual(null);
        expect(subject.convertAllValuesToStrings({})).not.toEqual(null);
    });

    it('should not detect on-demand content classes', function() {
        expect(subject.isOnDemandContentClass(null)).toEqual(false);
        expect(subject.isOnDemandContentClass('')).toEqual(false);
        expect(subject.isOnDemandContentClass(' ')).toEqual(false);
        expect(subject.isOnDemandContentClass('linear')).toEqual(false);
        expect(subject.isOnDemandContentClass('cdvr')).toEqual(false);
        expect(subject.isOnDemandContentClass('trailer')).toEqual(false);
        expect(subject.isOnDemandContentClass('extra')).toEqual(false);
        expect(subject.isOnDemandContentClass('cdvr')).toEqual(false);
        expect(subject.isOnDemandContentClass('ppv')).toEqual(false);

        expect(subject.isOnDemandContentClass('tod')).toEqual(true);
        expect(subject.isOnDemandContentClass('fod')).toEqual(true);
        expect(subject.isOnDemandContentClass('svod')).toEqual(true);
        expect(subject.isOnDemandContentClass('vod')).toEqual(true);
    });
});
