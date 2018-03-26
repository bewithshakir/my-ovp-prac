(function () {
    'use strict';
    angular.module('ovpApp.rdvr.cacheService', [
        'ovpApp.rdvr.recordingsCache',
        'ovpApp.services.ovpStorage',
        'ovpApp.rdvr.rdvrService'
    ])

    .factory('rdvrCacheService', rdvrCacheService);

    /* @ngInject */
    function rdvrCacheService($log, RecordingsCache, recordingsListType, ovpStorage, $rootScope) {
        let cacheMap = [];

        let service = {
            getCache,
            createNewCache,
            updateCache,
            clearCache
        };

        activate();

        return service;

        /////////////

        function activate() {
            init();
            subscribe();
        }

        /**
         * Reads through OVP storage on initialization and will populate
         * cache only if the cache is dirty or has been refreshed before
         * the refresh time interval
         * Sets the cache on the rootScope for messaging purposes.
         */
        function init() {
            var i,
                storageItem,
                cache,
                storageItems = ovpStorage.localStorage;

            for (i in storageItems) {
                if (storageItems.hasOwnProperty(i)) {
                    storageItem = i;
                    if ((storageItem.indexOf('rdvr.' + recordingsListType.COMPLETED) > -1) ||
                        (storageItem.indexOf('rdvr.' + recordingsListType.SCHEDULED) > -1) ||
                        (storageItem.indexOf('rdvr.' + recordingsListType.SERIES_PRIORITY) > -1) ||
                        (storageItem.indexOf('rdvr.' + recordingsListType.DISK_USAGE) > -1)) {

                        cache = getCacheFromStorage(storageItem);
                        let isOldFormat = !cache.getJson() || !cache.getJson().data;
                        if (cache.isAged() || isOldFormat) {
                            deleteCache(cache);
                        } else {
                            cacheMap[storageItem] = cache;
                        }
                    }
                }
            }
        }


        function subscribe() {
            $rootScope.$on('recordings-cache-expired', function (event, cache) {
                if (cache) {
                    deleteCache(cache);
                }
            });
        }

        function getCacheFromStorage(key) {
            var serializedCache = ovpStorage.getItem(key),
                cache;

            if (serializedCache) {
                cache = new RecordingsCache();
                cache.deserialize(serializedCache);
            }
            return cache;
        }

        function deleteCache(recordingsCache) {
            var type = recordingsCache.getType(), stb = recordingsCache.getStb(),
                key = RecordingsCache.createKey(type, stb);

            delete cacheMap[key];
            ovpStorage.removeItem(key);
        }
        function getCache(type, stb) {
            const cacheKey = RecordingsCache.createKey(type, stb);
            const cache = cacheMap[cacheKey];
            if (cache && cache.shouldFetchFromService()) {
                clearCache(cacheKey);
            }
            return cacheMap[cacheKey];
        }
        function createNewCache(type, stbInfo, data) {
            var cache = new RecordingsCache(type, stbInfo);
            cache.refreshCompleted(data);
            saveCacheToStorage(cache);
            cacheMap[RecordingsCache.createKey(type, stbInfo)] = cache;
        }
        function updateCache(type, stbInfo, json) {
            let cache = getCache(type, stbInfo);
            if (!cache) {
                cache = new RecordingsCache(type, stbInfo);
            }
            cache.update(json);
            saveCacheToStorage(cache);
        }
        function saveCacheToStorage(recordingsCache) {
            ovpStorage.setItem(recordingsCache.getKey(), angular.toJson(recordingsCache));
        }
        function clearCache(type, stbInfo) {
            const key = RecordingsCache.createKey(type, stbInfo);
            delete cacheMap[key];
            ovpStorage.removeItem(key);
            if (type === recordingsListType.SCHEDULED) {
                $rootScope.$broadcast('DVR:clearScheduledRecordingsCache');
            }
        }
    }
}());
