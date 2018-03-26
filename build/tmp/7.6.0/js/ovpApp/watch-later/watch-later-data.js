'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    watchLaterData.$inject = ["NNSService", "BookmarkService", "delegateFactory", "$rootScope", "entryService", "rxhttp", "$q", "config"];
    angular.module('ovpApp.watchlater.data', ['ovpApp.dataDelegate', 'ovpApp.services.bookmark', 'ovpApp.services.rxUtils']).factory('watchLaterData', watchLaterData);

    /* @ngInject */
    function watchLaterData(NNSService, BookmarkService, delegateFactory, $rootScope, entryService, rxhttp, $q, config) {
        var savedCategories = undefined;

        var service = {
            getCategories: getCategories,

            _private: {
                //exposed for unit testing
                onAdd: onAdd,
                onDelete: onDelete,
                onClear: onClear
            }
        };

        activate();

        return service;

        ////////////////

        function activate() {
            $rootScope.$on('watchlater:add', onAdd('saved'));
            $rootScope.$on('watchlater:delete', onDelete('saved'));
            $rootScope.$on('watchlater:clear', onClear('saved'));
            $rootScope.$on('inprogress:add', onAdd('inProgress', true));
            $rootScope.$on('inprogress:delete', onDelete('inProgress'));
            $rootScope.$on('inprogress:clear', onClear('inProgress'));
        }

        function onAdd(categoryContext) {
            var needsFetch = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            return function (event, asset) {
                var cat = getCategory(categoryContext);
                if (cat) {
                    if (needsFetch) {
                        return NNSService.fetchAssetData(asset).then(function (a) {
                            return doAdd(a, cat.media);
                        });
                    } else {
                        doAdd(asset, cat.media);
                    }
                }
            };
        }

        function onDelete(categoryContext) {
            return function (event, asset) {
                var cat = getCategory(categoryContext);
                if (cat) {
                    doDelete(asset, cat.media);
                }
            };
        }

        function onClear(categoryContext) {
            return function () {
                var cat = getCategory(categoryContext);
                if (cat) {
                    replaceArrayContents(cat.media, []);
                }
            };
        }

        function getCategory(context) {
            return savedCategories && savedCategories.find(function (c) {
                return c.context === context;
            });
        }

        function doAdd(asset, arrayRef) {
            doDelete(asset, arrayRef); // in case it's already there, we want to move it to the front
            arrayRef.unshift(asset);
        }

        function doDelete(asset, arrayRef) {
            var index = arrayRef.findIndex(function (ast) {
                if (ast.tmsProgramIds) {
                    return angular.equals(ast.tmsProgramIds, asset.tmsProgramIds);
                } else {
                    return ast.tmsSeriesId == asset.tmsSeriesId;
                }
            });

            if (index >= 0) {
                arrayRef.splice(index, 1);
            }
        }

        function replaceArrayContents(arrayRef, newContents) {
            arrayRef.splice.apply(arrayRef, [0, arrayRef.length].concat(_toConsumableArray(newContents)));
        }

        function getCategories() {
            return entryService.forDefaultProfile().then(function (services) {
                return rxhttp.get(config.piHost + services.watchLater(), { withCredentials: true }).retry(3).map(function (response) {
                    return response.data.results.map(delegateFactory.createInstance);
                })['do'](function (categories) {
                    return savedCategories = categories;
                }).toPromise($q);
            });
        }
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/watch-later/watch-later-data.js.map
