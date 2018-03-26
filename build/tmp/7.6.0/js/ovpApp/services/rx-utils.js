'use strict';

(function () {
    'use strict';
    rxhttp.$inject = ["$http", "$q", "rx"];
    createObservableFunction.$inject = ["rx"];
    angular.module('ovpApp.services.rxUtils', ['rx']).factory('rxhttp', rxhttp).factory('createObservableFunction', createObservableFunction);

    /**
     * Mimics the behavior of $http, except it returns an observable instead of a promise
     *
     * @param  {object} requestConfig config for an $http request.
     * @return {observable}           observable which either emits the response, or errors
     */
    /* @ngInject */
    function rxhttp($http, $q, rx) {

        var service = rootFunction;

        createShortMethods('get', 'delete', 'head', 'jsonp');

        createShortMethodsWithData('post', 'put', 'patch');

        service.defaults = $http.defaults;
        service.pendingRequests = $http.pendingRequests;

        return service;

        //////////////////////

        function rootFunction(requestConfig) {
            return rx.Observable.create(function (observer) {
                var canceller = $q.defer();
                requestConfig.timeout = canceller.promise;

                $http(requestConfig).then(function (response) {
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

        function createShortMethods() {
            for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
                names[_key] = arguments[_key];
            }

            names.forEach(function (name) {
                rootFunction[name] = function (url) {
                    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                    return rootFunction(angular.extend({}, config, {
                        method: name,
                        url: url
                    }));
                };
            });
        }

        function createShortMethodsWithData() {
            for (var _len2 = arguments.length, names = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                names[_key2] = arguments[_key2];
            }

            names.forEach(function (name) {
                rootFunction[name] = function (url, data) {
                    var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
            var subject = Object.assign(function () {
                for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    params[_key3] = arguments[_key3];
                }

                return subject.onNext(params);
            }, rx.Observable.prototype, rx.Subject.prototype);

            rx.Subject.call(subject);

            return subject;
        };
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/rx-utils.js.map
