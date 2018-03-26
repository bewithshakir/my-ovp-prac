/* globals inject, window */
/* jshint jasmine: true */

describe('ovpApp.login', function () {
    'use strict';

    var $scope,
        LoginController,
        profileService,
        connectivityService,
        loginService,
        streamPlusService,
        messages,
        ovpStorage,
        storageKeys,
        formElem,
        $q,
        $state,
        $compile;

    beforeEach(module('ovpApp.login'));
    beforeEach(module('ovpApp.services.profileService', function($provide) {
        $provide.value('profileService', mockProfileService);
    }));

    /* jscs: disable */
    beforeEach(inject(function (_$controller_, _subViews_, _loginService_,
                                _$rootScope_, _$injector_, _ovpStorage_, _storageKeys_,
                                _$q_, _$state_, _$compile_, _profileService_, _messages_, $httpBackend,
                                _connectivityService_, _streamPlusService_) {

        $scope = _$rootScope_.$new();
        $q = _$q_;
        $state = _$state_;
        $compile = _$compile_;
        profileService = _profileService_;
        connectivityService = _connectivityService_;
        messages = _messages_;
        ovpStorage = _ovpStorage_;
        storageKeys = _storageKeys_;
        streamPlusService = _streamPlusService_;

        $scope.model = {form: {username: '', password: ''}};
        var elem = angular.element('<form name="loginForm" novalidate><input name="username" ng-model="form.username" required /><input name="password" ng-model="form.password" required /></form>');
        $compile(elem)($scope);
        formElem = $scope.loginForm;

        loginService = _loginService_;
        loginService.error = function () {};
        loginService.authorize = function () {
            return $q.resolve(true);
        };

        loginService.hasAcceptedParentalControlsWarning = function () {
            return $q.when(false);
        };
        loginService.acceptParentalControlsWarning = angular.noop;
        loginService.authorize = angular.noop;
        loginService.redirect = angular.noop;
        loginService.hasFeatures = function() {
            return true;
        };
        LoginController = _$controller_('LoginController', {
            $scope: $scope,
            subViews: _subViews_,
            $element: angular.element('<div></div>')
        });
        //Make sure this isn't set
        $httpBackend.whenGET(/.*\.html$/).respond('');
        $httpBackend.when('GET', '/tdcs/public/errors?apiKey=void&clientType=ONEAPP-OVP').respond('');

        spyOn(ovpStorage, 'initUserStorage').and.returnValue($q.resolve());
    }));
    /* jscs: enable */

    describe('Login controller', function () {
        it('should default to login form', function () {
            expect($scope.login.subViews).toBeDefined();
            expect($scope.login.subView).toBe($scope.login.subViews.FORM);
        });

        it('should call enterSite after successful authentication', function () {
            var deferred = $q.defer(), auth = $q.defer();
            spyOn($scope, 'enterSite');
            loginService.authenticate = function () {
                return deferred.promise;
            };
            loginService.authorize = function() {
                return auth.promise;
            }
            $scope.authenticate(formElem);
            deferred.resolve();
            auth.resolve();
            $scope.$apply();

            expect($scope.enterSite).toHaveBeenCalled();
        });

        it('should show parental controls after successful capabilities verification', function () {
            $scope.enterSite();
            $scope.$apply();

            expect($scope.login.subView).toBe($scope.login.subViews.PARENTAL);
        });

        it('should call redirect after successful authorization and' +
            ' parental controls acceptance', function () {
            var authDeferred = $q.defer(),
                authorDeferred = $q.defer();

            spyOn(profileService, 'getFirstAvailableState').and.returnValue($q.resolve('ovp.livetv'));
            spyOn($state, 'go');
            loginService.authenticate = function () {
                return authDeferred.promise;
            };
            $scope.authenticate(formElem);
            authDeferred.resolve();

            loginService.authorize = function () {
                return authorDeferred.promise;
            };
            authorDeferred.resolve({inUs: true, ovpConfig: {}});
            $scope.parentalControlsWarningAccepted();

            $scope.$apply();

            expect($state.go).toHaveBeenCalledWith('ovp.livetv');
        });

        it('should redirect to the proper page after login', function () {
            var authDeferred = $q.defer(),
                authorDeferred = $q.defer();
            spyOn(profileService, 'hasCapability').and.returnValue($q.resolve('watchlive'));
            spyOn($state, 'go');
            loginService.authenticate = function () {
                return authDeferred.promise;
            };
            $scope.authenticate(formElem);
            authDeferred.resolve();

            loginService.authorize = function () {
                return authorDeferred.promise;
            };

            authorDeferred.resolve({inUs: true, ovpSec: {}, ovpConfig: {}});
            $scope.parentalControlsWarningAccepted();
            $scope.$apply();

            expect($state.go).toHaveBeenCalledWith('ovp.livetv');
        });

        it('should not let user use twctv if no capabilities', function () {
            var authDeferred = $q.defer(),
                authorDeferred = $q.defer();
            spyOn($state, 'go');
            spyOn(profileService, 'canUseTwctv').and.returnValue($q.reject());

            streamPlusService.isStreamPlusEligible = function () {
                return $q.reject();
            };

            loginService.authenticate = function () {
                return authDeferred.promise;
            };

            authDeferred.resolve();

            loginService.authorize = function () {
                return authorDeferred.promise;
            };
            $scope.authenticate(formElem);
            authorDeferred.resolve({inUs: true, ovpSec: {}, ovpConfig: {}});
            $scope.parentalControlsWarningAccepted();
            $scope.$apply();
            expect($state.go).toHaveBeenCalledWith('novideoservice');
        });

        it('should redirect to the next available service if livetv is unavailable', function () {
            var authDeferred = $q.defer(),
                authorDeferred = $q.defer();
            spyOn($state, 'go');
            spyOn(profileService, 'canWatchLive').and.returnValue($q.resolve(false));
            spyOn(profileService, 'getFirstAvailableState').and.returnValue($q.resolve('ovp.ondemand'));

            loginService.authenticate = function () {
                return authDeferred.promise;
            };
            $scope.authenticate(formElem);
            authDeferred.resolve();

            loginService.authorize = function () {
                return authorDeferred.promise;
            };
            authorDeferred.resolve({inUs: true, ovpSec: {}, ovpConfig: {}});
            $scope.parentalControlsWarningAccepted();
            $scope.$apply();

            expect($state.go).toHaveBeenCalledWith('ovp.ondemand');
        });
    });
});
