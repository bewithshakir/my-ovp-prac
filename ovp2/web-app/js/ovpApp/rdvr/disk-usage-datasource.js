(function () {
    'use strict';

    angular
        .module('ovpApp.rdvr.datasource')
        .factory('DiskUsageDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, rdvrCacheService, recordingsListType) {
        return class DiskUsageDatasource extends AbstractDatasource {
            constructor(stb) {
                super(stb, recordingsListType.DISK_USAGE, {
                    data: {usedPercentage: 0, freePercentage: 100}
                });

                if (this.stb && this.stb.dvr) {
                    this.source = this.reset.map(() => true)
                        .startWith(false)
                        .flatMapLatest(force => {
                            return this.fetch(force)
                                .startWith(this.initialValue)
                                .takeUntil(this.reset);
                        })
                        .do(result => this.saveToCache(result))
                        .map(result => this.convertResultBeforeEmitting(result))
                        .shareReplay(1);
                } else {
                    this.source = rx.Observable.never();
                }
            }

            fetch(force) {
                if (force) {
                    this.clearCache();
                }

                // There's only ever one batch for disk usage, but it's still worth reusing the caching logic
                return this.batchGetWithCache({
                        getter: this.getOneDiskUsageBatch.bind(this)
                    })
                    .catch(e => {
                        return rx.Observable.just({
                            data: {usedPercentage: 0, freePercentage: 100},
                            error: e
                        });
                    });
            }

            getOneDiskUsageBatch() {
                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                const fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrDiskUsage;
                return rxhttp.get(fullUrl, {withCredentials: true})
                    .retry(2);
            }
        };
    }
})();
