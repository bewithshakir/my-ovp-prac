'use strict';

(function () {
    'use strict';

    RecordingsCache.$inject = ["RecordingsCacheIntervals", "$window", "$timeout", "dateUtil", "$interval", "$rootScope"];
    angular.module('ovpApp.rdvr.recordingsCache', ['ovpApp.config', 'ovpApp.legacy.DateUtil']).constant('RecordingsCacheIntervals', {
        DIRTY: 30,
        EXPIRED: 120,
        AGED: 15
    }).factory('RecordingsCache', RecordingsCache);

    /* @ngInject */
    function RecordingsCache(RecordingsCacheIntervals, $window, $timeout, dateUtil, $interval, $rootScope) {
        var Cache = function Cache(type, stb) {
            this.type = type;
            this.stb = stb;
            this.timeCreatedUtcMsec = new Date().getTime();
            this.lastRefreshTimeUtcMsec = null;
            this.json = null;
            this.lastDirtiedTimeUtcMsec = null;
            this.deserializedTimeUtcMsec = null;
            this.isFailed = false;
            this.failureReason = null;
            this.scheduledRemovalPromise = null;
        };

        Cache.prototype.scheduleRemoval = function () {
            var self = this;
            $interval.cancel(this.scheduledRemovalPromise);
            this.scheduledRemovalPromise = $interval(function () {
                if (self.shouldFetchFromService()) {
                    $rootScope.$broadcast('recordings-cache-expired', self);
                    $interval.cancel(self.scheduledRemovalPromise);
                }
            }, 1000);
        };

        Cache.prototype.getLastRefreshTimeUtcMsec = function () {
            return this.lastRefreshTimeUtcMsec;
        };

        Cache.prototype.getType = function () {
            return this.type;
        };

        Cache.prototype.setLastRefreshTimeUtcSec = function (time) {
            this.lastRefreshTimeUtcMsec = time;
        };

        Cache.prototype.setDeserializedTimeUtcSec = function (time) {
            this.deserializedTimeUtcMsec = time;
        };

        Cache.prototype.dirtyIntervalNotMet = function () {
            return this.lastDirtiedTimeUtcMsec && new Date().getTime() - this.lastDirtiedTimeUtcMsec < this.getDirtyIntervalMsec();
        };

        Cache.prototype.isExpired = function () {
            return this.lastRefreshTimeUtcMsec && new Date().getTime() - this.lastRefreshTimeUtcMsec > this.getExpiredIntervalMsec();
        };

        Cache.prototype.isAged = function () {
            return new Date().getTime() - this.lastRefreshTimeUtcMsec > this.getAgedIntervalMsec();
        };

        //1.  user has made an action that has dirtied the cache and has made it past dirty interval
        //2.  user has made it past the expired interval
        Cache.prototype.shouldFetchFromService = function () {
            var shouldFetch = false;
            if (this.isDirty() && !this.dirtyIntervalNotMet()) {
                shouldFetch = true;
            }

            if (this.isExpired()) {
                shouldFetch = true;
            }
            return shouldFetch;
        };

        Cache.createKey = function (type, stb) {
            if (stb && stb.macAddressNormalized) {
                return 'rdvr.' + type + '.' + stb.macAddressNormalized;
            }
        };

        Cache.prototype.getKey = function () {
            return Cache.createKey(this.type, this.stb);
        };

        Cache.prototype.getStb = function () {
            return this.stb;
        };

        Cache.prototype.getAgedIntervalMsec = function () {
            return RecordingsCacheIntervals.AGED * 1000;
        };

        Cache.prototype.getExpiredIntervalMsec = function () {
            return RecordingsCacheIntervals.EXPIRED * 1000;
        };

        Cache.prototype.getDirtyIntervalMsec = function () {
            return RecordingsCacheIntervals.DIRTY * 1000;
        };

        Cache.prototype.getIntervalUntilRefreshAllowedSec = function () {
            var interval = this.getDirtyIntervalMsec() - (new Date().getTime() - this.lastDirtiedTimeUtcMsec);
            if (interval < 0) {
                interval = 0;
            }
            return interval;
        };

        Cache.prototype.deserialize = function (serializedjson) {
            var json = angular.fromJson(serializedjson);
            this.type = json.type;
            this.stb = json.stb;
            this.timeCreatedUtcMsec = json.timeCreatedUtcMsec;
            this.lastRefreshTimeUtcMsec = json.lastRefreshTimeUtcMsec;
            this.lastDirtiedTimeUtcMsec = json.lastDirtiedTimeUtcMsec;
            this.deserializedTimeUtcMsec = new Date().getTime();
            this.json = json.json;
            this.scheduleRemoval();
        };

        Cache.prototype.isDirty = function () {
            return this.lastDirtiedTimeUtcMsec !== null;
        };

        Cache.prototype.dirtied = function () {
            this.lastDirtiedTimeUtcMsec = new Date().getTime();
        };

        Cache.prototype.update = function (json) {
            this.json = json;
            this.dirtied();
        };

        Cache.prototype.refreshCompleted = function (json) {
            this.json = json;
            this.lastRefreshTimeUtcMsec = new Date().getTime();
            this.scheduleRemoval();
        };

        Cache.prototype.refreshFailed = function (failure) {
            this.isFailed = true;
            this.failureReason = failure;
            this.json = null;
            this.lastRefreshTimeUtcMsec = new Date().getTime();
        };

        Cache.prototype.getJson = function () {
            return this.json;
        };

        Cache.prototype.toString = function () {
            return 'type: ' + this.type + '\n stb: ' + this.stb ? this.stb.macAddressNormalized : 'undefined' + '\n time created: ' + dateUtil.formatDate(new Date(this.timeCreatedUtcMsec), 'mmm dd hh:nn:ss') + '\n last refresh: ' + dateUtil.formatDate(new Date(this.lastRefreshTimeUtcMsec), 'mmm dd hh:nn:ss') + '\n last dirtied: ' + dateUtil.formatDate(new Date(this.lastDirtiedTimeUtcMsec), 'mmm dd hh:nn:ss') + '\n last read from local storage: ' + dateUtil.formatDate(new Date(this.deserializedTimeUtcMsec), 'mmm dd hh:nn:ss') + '\n dirty interval not met: ' + this.dirtyIntervalNotMet() + '\n is aged: ' + this.isAged() + '\n is expired: ' + this.isExpired() + '\n is failed: ' + this.isFailed + '\n failure reason: ' + this.failureReason;
        };
        return Cache;
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/recordings-cache.js.map
