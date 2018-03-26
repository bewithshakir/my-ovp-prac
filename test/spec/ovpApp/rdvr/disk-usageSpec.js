/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.rdvr.diskUsage', function () {
    'use strict';

    var stbService, rdvrService, controller, onNext, mockRdvrService;

    beforeEach(module('ovpApp.rdvr.diskUsage'));
    beforeEach(module(function ($provide) {
        $provide.value('errorCodesService', mockErrorCodesService);
    }))

    beforeEach(module(function ($provide) {
        mockRdvrService = {
            getDiskUsage: jasmine.createSpy()
        };

        $provide.value('rdvrService', mockRdvrService);
    }))

    beforeEach(inject(function ($componentController, _stbService_) {
        stbService = _stbService_;

        controller = $componentController('diskUsage');
    }));

    
    describe('subscription', () => {        
        it('should call getDiskUsage when stb changes', () => {
            controller.getDiskUsage = jasmine.createSpy();
            controller.$onChanges({
                stb: {
                    currentValue: 'whatever'
                }
            });

            expect(controller.getDiskUsage).toHaveBeenCalledWith('whatever');
        });
    });
    

    describe('diskUsageReceived', function () {
        it('should work in success case', function () {
            controller.onDiskUsageReceived({
                data: {
                    usedPercentage: 0.3
                }
            });

            expect(controller.usedPercent).toEqual(30);
        });

        it('should treat error as 0% full', function () {
            controller.onDiskUsageReceived({
                error: 'oh noes!'
            });

            expect(controller.usedPercent).toEqual(0);
        });
    });
});
