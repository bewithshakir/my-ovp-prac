(function () {
    'use strict';

    angular
        .module('ovpApp.watchlater.data', [
            'ovpApp.dataDelegate',
            'ovpApp.services.bookmark',
            'ovpApp.services.rxUtils'])
        .factory('watchLaterData', watchLaterData);

    /* @ngInject */
    function watchLaterData(NNSService, BookmarkService, delegateFactory,
        $rootScope, entryService, rxhttp, $q, config) {
        let savedCategories;

        let service = {
            getCategories,

            _private: {
                //exposed for unit testing
                onAdd,
                onDelete,
                onClear
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

        function onAdd(categoryContext, needsFetch = false) {
            return function (event, asset) {
                let cat = getCategory(categoryContext);
                if (cat) {
                    if (needsFetch) {
                        return NNSService.fetchAssetData(asset)
                            .then(a => doAdd(a, cat.media));
                    } else {
                        doAdd(asset, cat.media);
                    }
                }
            };
        }

        function onDelete(categoryContext) {
            return function (event, asset) {
                let cat = getCategory(categoryContext);
                if (cat) {
                    doDelete(asset, cat.media);
                }
            };
        }

        function onClear(categoryContext) {
            return function () {
                let cat = getCategory(categoryContext);
                if (cat) {
                    replaceArrayContents(cat.media, []);
                }
            };
        }

        function getCategory(context) {
            return savedCategories && savedCategories.find(c => c.context === context);
        }

        function doAdd(asset, arrayRef) {
            doDelete(asset, arrayRef); // in case it's already there, we want to move it to the front
            arrayRef.unshift(asset);
        }

        function doDelete(asset, arrayRef) {
            let index = arrayRef.findIndex(ast => {
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
            arrayRef.splice(0, arrayRef.length, ...newContents);
        }

        function getCategories() {
            return entryService.forDefaultProfile()
                .then(services =>
                    rxhttp.get(config.piHost + services.watchLater(), {withCredentials: true})
                        .retry(3)
                        .map(response => response.data.results.map(delegateFactory.createInstance))
                        .do(categories => savedCategories = categories)
                        .toPromise($q)
                );
        }
    }
})();
