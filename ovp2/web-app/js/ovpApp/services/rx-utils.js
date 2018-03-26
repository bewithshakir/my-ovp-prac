(function () {
    'use strict';
    angular.module('ovpApp.services.rxUtils', ['rx'])
    .factory('rxhttp', rxhttp)
    .factory('createObservableFunction', createObservableFunction);

    /**
     * Mimics the behavior of $http, except it returns an observable instead of a promise
     *
     * @param  {object} requestConfig config for an $http request.
     * @return {observable}           observable which either emits the response, or errors
     */
    /* @ngInject */
    function rxhttp($http, $q, rx) {

        let service = rootFunction;

        createShortMethods('get', 'delete', 'head', 'jsonp');

        createShortMethodsWithData('post', 'put', 'patch');

        service.defaults = $http.defaults;
        service.pendingRequests = $http.pendingRequests;

        return service;

        //////////////////////

        function rootFunction(requestConfig) {
            return rx.Observable.create(function (observer) {
                let canceller = $q.defer();
                requestConfig.timeout = canceller.promise;

                $http(requestConfig)
                    .then(function (response) {
                        observer.onNext(response);
                        observer.onCompleted();
                    }, function (error) {
                        observer.onError(error);
                    });

                return function () {
                    canceller.resolve();
                };
            });
        }

        function createShortMethods(...names) {
            names.forEach(function (name) {
                rootFunction[name] = function (url, config = {}) {
                    return rootFunction(angular.extend({}, config, {
                        method: name,
                        url: url
                    }));
                };
            });
        }

        function createShortMethodsWithData(...names) {
            names.forEach(function (name) {
                rootFunction[name] = function (url, data, config = {}) {
                    return rootFunction(angular.extend({}, config, {
                        method: name,
                        url: url,
                        data: data
                    }));
                };
            });
        }
    }

    /**
     * Creates a function subject. This is both a function and an observable. If the function
     * is called, anything subscribed to it will be notified
     *
     * Usage:
     *
     * let onDestroy = createObservableFunction();
     * let otherObservable = rx.Observable.interval(500)
     *     .takeUntil(onDestroy)
     * onDestroy();
     *
     *
     * @return {Subject}
     */
    /* @ngInject */
    function createObservableFunction(rx) {
        return function () {
            const subject = Object.assign(
                (...params) => subject.onNext(params),
                rx.Observable.prototype,
                rx.Subject.prototype);

            rx.Subject.call(subject);

            return subject;
        };
    }
}());
