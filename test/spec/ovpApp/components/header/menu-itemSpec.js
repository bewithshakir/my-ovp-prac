/*jshint undef: false */
/*jshint nomen: true */
describe('ovpApp.components.header.menuItem', function () {
    'use strict';

    var $state,
        $rootScope,
        messages,
        $window,
        $q,
        $controller,
        capabilitiesService,
        alert,
        $httpBackend,
        mockEvent = {
            preventDefault: function () {},
            stopPropagation: function () {}
        };

    beforeEach(module('ovpApp.components.header.menuItem'));

    beforeEach(inject(function (_$controller_, _$rootScope_,
                                 _$window_, _$q_, _$state_,
                                _$httpBackend_, _alert_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $state = _$state_;
        $q = _$q_;
        $window = _$window_;
        $httpBackend = _$httpBackend_;
        alert = _alert_;
    }));


    describe('itemClicked', function () {
        it('should show disabled message if disabled', function () {
            let savedArgs = {};
            let ctrl = $controller('MenuItemController', {
                alert: {
                    open: function (args) {
                        savedArgs = args;
                        return {
                            result: $q.defer()
                        };
                    }
                }
            });

            ctrl.item = {
                enabled: false,
                disabledMessage: () => 'a',
                disabledTitle: () => 'b'
            }

            ctrl._private.itemClicked(mockEvent);

            expect(savedArgs).toEqual({ showCloseIcon : true, message : 'a', title : 'b', buttonText: 'OK', analyticsModalName: null});
        });

        it('should call $state.go if enabled', function () {
            let ctrl = $controller('MenuItemController', {
                $state: $state
            });

            ctrl.item = {
                enabled: true,
                link: 'L',
                linkParams: 'P',
                linkOptions: 'O'
            }

            spyOn($state, 'go').and.callFake(function () {});

            ctrl._private.itemClicked(mockEvent);

            expect($state.go).toHaveBeenCalledWith('L', 'P', 'O');
        });
    });
});
