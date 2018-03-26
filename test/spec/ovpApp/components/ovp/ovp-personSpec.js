describe('ovpApp.directives.person', function () {
    'use strict';

    let scope, element, controller, mockCapabilitiesService, mockStateService,
        $compile, $q, $componentController;

    beforeEach(module('test.templates'));
    beforeEach(module('ovpApp.directives.person'));

    beforeEach(module(function ($provide) {
        mockCapabilitiesService = {};
        mockStateService = {
            current: {name: 'current'},
            previous: {name: 'previous'}
        };
        $provide.value('$state', mockStateService);
        $provide.value('$stateParams', {});
        $provide.value('searchFocusIndex', {
            set: angular.noop,
            get: () => { return {}; },
            reset: angular.noop
        });
        $provide.value('capabilitiesService', mockCapabilitiesService);
    }));

    beforeEach(inject(function($rootScope, _$compile_, _$q_, _$componentController_) {
        mockCapabilitiesService.isAccessibilityEnabled = jasmine.createSpy().and.returnValue(_$q_.resolve(false));
        mockStateService.go = jasmine.createSpy().and.returnValue(_$q_.resolve());
        mockStateService.includes = jasmine.createSpy().and.returnValue(false);

        scope = $rootScope.$new();
        $compile = _$compile_;
        $q = _$q_;
        $componentController = _$componentController_;
    }));

    function createElement(options = {}) {
        scope.person = {
            name: 'inigo montoya',
            roleText: 'actor',
            imageUri: jasmine.createSpy().and.returnValue('uri'),
            clickRoute: ['search', {some: 'params'}]
        };
        scope.options = options;
        element = angular.element('<ovp-person person="person" options="options"></ovp-person>');
        element = $compile(element)(scope);
        controller = $componentController('ovpPerson', 
            {$scope: scope, $element: element},
            {person: scope.person, options: scope.options});
        scope.$apply();
    }

    describe('image', function () {
        it('should default to 147 pixels', function () {
            createElement();
            let img = element.find('.thumbnail').find('img');
            expect(img.length).toEqual(1);
            expect(scope.person.imageUri).toHaveBeenCalledWith({width:147});
            expect(img.attr('src')).toEqual('uri');
        });

        it('should override based on options', function () {
            createElement({
                imageWidth: 123456
            });

            let img = element.find('.thumbnail').find('img');
            expect(img.length).toEqual(1);
            expect(scope.person.imageUri).toHaveBeenCalledWith({width:123456});
            expect(img.attr('src')).toEqual('uri');
        });
    });

    it('should display name', function () {
        createElement();

        let name = element.find('.name');
        expect(name.text()).toEqual('inigo montoya')
    });

    it('should display role', function () {
        createElement();

        let role = element.find('.role').find('small');
        expect(role.text()).toEqual('actor');
    });

    describe('click', function () {
        it('should route if accessibility is disabled', function () {
            createElement();

            controller.accessibilityEnabled = false;
            controller.click();
            expect(mockStateService.go).toHaveBeenCalled();
        }); 

        it('should route irrespective of accessibility', function () {
            // links should always work irrespective of accessibility.
            createElement();
            
            controller.accessibilityEnabled = true;
            controller.click();
            expect(mockStateService.go).toHaveBeenCalled();
        });

        it('routing from product page', function () {
            mockStateService.includes = jasmine.createSpy().and.callFake(stateName => {
                return stateName === 'product';
            });

            createElement();

            controller.accessibilityEnabled = false;
            controller.click();

            // blank page loads immediately, and thus provides feedback
            expect(mockStateService.go).toHaveBeenCalledWith('search.blank');
            scope.$apply();
            expect(mockStateService.go).toHaveBeenCalledWith('search', {some: 'params'}, {location: 'replace'});
        });

        it('routing from search page', function () {
            mockStateService.includes = jasmine.createSpy().and.callFake(stateName => {
                return stateName === 'search';
            });

            createElement();

            controller.accessibilityEnabled = false;
            controller.click({
                type: 'click'
            });

            expect(mockStateService.go).toHaveBeenCalledWith('search', {some: 'params'}, {});
        });

        it('routing from elsewhere', function () {
            mockStateService.includes = jasmine.createSpy().and.returnValue(false);

            createElement();

            controller.accessibilityEnabled = false;
            controller.click({
                type: 'click'
            });

            // blank page loads immediately, and thus provides feedback
            expect(mockStateService.go).toHaveBeenCalledWith('search.blank');
            scope.$apply();
            expect(mockStateService.go).toHaveBeenCalledWith('search', {some: 'params'}, {location: 'replace'});
        });
    });
});
