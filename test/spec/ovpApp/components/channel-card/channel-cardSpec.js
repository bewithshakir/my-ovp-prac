describe('ovpApp.components.channelCard', function () {
    'use strict';

    let scope, element, mockFn, controller, $componentController, $q, alertObj;

    beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.components.channelCard'));

    beforeEach(module(function ($provide) {
        $provide.value('$state', {go: jasmine.createSpy()})
        $provide.value('errorCodesService', mockErrorCodesService);
        $provide.value('profileService', mockProfileService);
    }));

    beforeEach(function () {
        /*
         Mock functions with embedded spies, to ensure the dialog get created
         and shown
         */
        alertObj = jasmine.createSpyObj('alert', ['open']);
        mockFn = {
            alert: alertObj
        };

        /*
         Mocking dependencies
         */
        module(function ($provide) {
            $provide.value('alert', mockFn.alert);
        });
    });

    beforeEach(inject(function($rootScope, $compile, _$componentController_, _$q_) {
        $q = _$q_;

        scope = $rootScope.$new();
        scope.channel = {
            name: 'Test Channel Name',
            imageUri: jasmine.createSpy().and.returnValue('imageurl'),
            isEntitled: true
        };
        scope.options = {};

        $componentController = _$componentController_;

        element = angular.element('<channel-card channel="channel" options="options"></channel-card>');
        element = $compile(element)(scope);

        controller = $componentController('channelCard',
            {$scope: scope, $element: element},
            {channel: scope.channel, options: scope.options}
        );

        scope.$apply();
    }));

    afterEach(function () {
        element = null;
        scope = null;
        mockFn = null;
    });

    it('should default to not rendering name', function () {
        let el = element.find('.channel-name');
        expect(el.length).toEqual(0);
    });

    it('should not render name if explicitly set to false', function () {
        scope.options = {showChannelName: false};
        scope.$apply();
        let el = element.find('.channel-name');
        expect(el.length).toEqual(0);
    });

    it('should render name if explicitly set to true', function () {
        scope.options = {showChannelName: true};
        scope.$apply();

        let el = element.find('.channel-name');
        expect(el.length).toEqual(1);
        let caption = el.find('.caption');
        expect(caption.length).toEqual(1);
        expect(caption.text()).toEqual('Test Channel Name');
    });

    it('should render changed name', function () {
        scope.options = {showChannelName: true};
        scope.channel = {name: 'new name'};
        scope.$apply();

        let el = element.find('.channel-name');
        expect(el.length).toEqual(1);
        let caption = el.find('.caption');
        expect(caption.length).toEqual(1);
        expect(caption.text()).toEqual('new name');
    });

    it('should render an image', function () {
        let img = element.find('.thumbnail').find('img');
        expect(img.length).toEqual(1);
        expect(scope.channel.imageUri).toHaveBeenCalled();
        expect(img.attr('src')).toEqual('imageurl');
    });

    describe('channel is entitled', function () {
        it('should not show unentitled icon', function () {
            let keyIcon = element.find('.twcicon-svg.twcicon-svg-key.ng-hide');
            expect(keyIcon.length).toEqual(1);
            expect(scope.channel.isEntitled).toEqual(true);
        });

        it('should click through', function () {
            controller.click();
            expect(controller.$state.go).toHaveBeenCalled();
        });
    });

    describe('channel is not entitled', function () {
        beforeEach(inject(function($compile) {
            scope.channel.isEntitled = false;
            element = $compile(element)(scope);
            scope.$apply();
        }));

        afterEach(function () {
            element = null;
            scope.channel.isEntitled = true;
        });

        it('should show unentitled icon', function () {
            let keyIconHidden = element.find('.twcicon-svg.twcicon-svg-key.ng-hide');
            let keyIcon = element.find('.twcicon-svg.twcicon-svg-key');
            expect(keyIconHidden.length).toEqual(0);
            expect(keyIcon.length).toEqual(1);
            expect(scope.channel.isEntitled).toEqual(false);
        });

        it('should show unsubscribed alert dialog', function () {
            controller.click();
            scope.$apply();
            expect(alertObj.open).toHaveBeenCalled();
        });
    });


});
