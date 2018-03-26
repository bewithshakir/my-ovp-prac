'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    homePage.$inject = ["rxhttp", "entryService", "profileService", "$q", "config"];
    angular.module('ovpApp.services.homePage', ['ovpApp.services.entry', 'ovpApp.services.rxUtils', 'ovpApp.services.profileService', 'ovpApp.messages']).factory('homePage', homePage);

    /* @ngInject */
    function homePage(rxhttp, entryService, profileService, $q, config) {
        var promise = undefined;

        return getHomePage;

        ////////////////

        function getHomePage() {
            if (!promise) {
                promise = $q.all([entryService.forDefaultProfile(), profileService.isCdvrEnabled()]).then(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2);

                    var services = _ref2[0];
                    var isCdvrEnabled = _ref2[1];

                    return rxhttp.get(config.piHost + services.homePage(), {
                        withCredentials: true,
                        ignoreNNSParams: true,
                        // Added these default parameters to get all possible menu items
                        // Use capability to show / hide menu items
                        // This api is used to get the menu item names and it's sequence
                        params: {
                            cdvrEnabled: isCdvrEnabled ? true : false,
                            dvr: isCdvrEnabled ? false : true,
                            dvrManager: true,
                            tuneToChannel: true,
                            watchOnDemand: true,
                            watchLive: true,
                            tvodRent: true,
                            tvodWatch: true
                        }
                    }).retry(3).map(function (response) {
                        return response.data.results;
                    }).toPromise($q);
                }, function (err) {
                    promise = null;
                    $q.reject(err);
                });
            }
            return promise;
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/services/home-page.js.map
