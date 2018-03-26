/* globals inject */
/* jshint jasmine: true */

describe('ovpApp.settings.devices', function () {
    'use strict';

    var $scope, mockStbService, mockAlert, ctrl, $httpBackend;


    /* jscs: disable */
    beforeEach(function () {
        mockStbService = {};

        mockAlert = {
            open: jasmine.createSpy().and.returnValue({
                result: { then: () => {} }
            })
        };


        mockStbService.data = [{
                dvr: true,
                name: 'one',
                macAddress: '00:00:00:00:00:00'
            },
            {
                dvr: false,
                name: 'two',
                macAddress: '10:00:00:00:00:00'
            }];

        mockStbService.getSTBs = function () {
            return {
                then: function(cb) {
                    cb(mockStbService.data);
                    return {catch: () => {}};
                }
            };
        };

        mockStbService.postStbName = function (stb, newName) {
            mockStbService.namePosted = {stb: stb, newName: newName};
        };

        mockStbService.getCurrentStb = function () {
            return {
                then: function(cb) {
                    cb(mockStbService.data[0]);
                    return {catch: () => {}};
                }
            };
        };

        module('ovpApp.settings.devices', function ($provide) {
            $provide.value('stbService', mockStbService);
            $provide.value('errorCodesService', mockErrorCodesService);
        });

    });

    beforeEach(inject(function ($controller, $rootScope, stbService, _$httpBackend_) {
        $rootScope = $rootScope;
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;

        ctrl = $controller('DevicesController', {
            $scope: $scope,
            $rootScope: $rootScope,
            stbService: stbService,
            alert: mockAlert,
            $state: {current:{}}
        });

        $scope.$apply();
    }));

    describe('devices controller', function () {
        describe('begin edit', function () {
            it('should show popup if not a dvr', function () {
                ctrl.beginEdit(ctrl.stbs[1]);

                expect(mockAlert.open).toHaveBeenCalled();
                expect(ctrl.stbs[0].oldName).toEqual(undefined);
                expect(ctrl.stbs[1].isEditing).not.toEqual(true);
            });

            it('should begin editing if a dvr', function () {
                ctrl.beginEdit(ctrl.stbs[0]);

                expect(mockAlert.open).not.toHaveBeenCalled();
                expect(ctrl.stbs[0].oldName).toEqual(ctrl.stbs[0].name);
                expect(ctrl.stbs[0].isEditing).toEqual(true);
            });
        });

        describe('save edit', function () {
            it('should end editing if name has not changed', function () {
                ctrl.stbs[0].oldName = ctrl.stbs[0].name;
                ctrl.saveEdit(ctrl.stbs[0]);

                expect(mockStbService.namePosted).toEqual(undefined);
                expect(ctrl.stbs[0].isEditing).toEqual(false);
                expect(ctrl.stbs[0].oldName).toEqual(undefined);
            });

            it('should end editing and post new name if it has changed', function () {
                ctrl.stbs[0].oldName = ctrl.stbs[0].name + 'old';
                ctrl.saveEdit(ctrl.stbs[0]);

                expect(mockStbService.namePosted).toEqual({stb: ctrl.stbs[0], newName: ctrl.stbs[0].name});
                expect(ctrl.stbs[0].isEditing).toEqual(false);
                expect(ctrl.stbs[0].oldName).toEqual(undefined);
            });

        });
    });
});
