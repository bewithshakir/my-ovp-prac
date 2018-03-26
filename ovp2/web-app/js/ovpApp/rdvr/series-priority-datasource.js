(function () {
    'use strict';

    angular
        .module('ovpApp.rdvr.datasource')
        .factory('SeriesPriorityDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, rdvrCacheService,
        recordingsListType) {
        return class SeriesPriorityDatasource extends AbstractDatasource {
            constructor(stb) {
                super(stb, recordingsListType.PRIORITY, {
                    data: []
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

                return this.batchGetWithCache({
                        getter: this.getOneSeriesPriorityBatch.bind(this),
                        initialParams: 0
                    })
                    .catch(error => rx.Observable.just({data: [], error}))
                    .scan(this.mergeBatches);
            }

            saveToCache(result) {
                if (result === this.initialValue) {
                    return;
                }

                rdvrCacheService.createNewCache(this.stb, recordingsListType.PRIORITY, {
                    data: result.data,
                    nextParams: result.nextParams
                });
            }

            clearCache() {
                rdvrCacheService.clearCache(recordingsListType.PRIORITY, this.stb);
            }

            getOneSeriesPriorityBatch(startIndex) {
                const url = config.piHost + config.nrsApi + this.getDvrBase() +
                    this.stb.macAddressNormalized + config.services.dvrSeriesPriorities;

                const params = {
                    startIndex: startIndex,
                    maxEventCount: 100
                };

                return rxhttp.get(url, {params, withCredentials: true})
                    .retry(2)
                    .map(result => {
                        const hasMore = result.data.totalCount > result.data.series.length + startIndex;
                        if (hasMore && result.data.series.length > 0) {
                            result.nextParams = result.data.series.length + startIndex;
                        }

                        result.data = result.data.series;

                        return result;
                    });
            }

            setSeriesPriorities(priorities) {
                if (!this.stb || !this.stb.dvr) {
                    return $q.resolve();
                }

                const baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                const fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrSeriesPriorities;

                return rxhttp.put(fullUrl, {priorities}, {withCredentials: true})
                    .retry(2)
                    .toPromise($q);
            }
        };
    }
})();
