'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
    'use strict';

    factory.$inject = ["AbstractDatasource", "$q", "rx", "rxhttp", "config", "rdvrCacheService", "recordingsListType"];
    angular.module('ovpApp.rdvr.datasource').factory('SeriesPriorityDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, rdvrCacheService, recordingsListType) {
        return (function (_AbstractDatasource) {
            _inherits(SeriesPriorityDatasource, _AbstractDatasource);

            function SeriesPriorityDatasource(stb) {
                var _this = this;

                _classCallCheck(this, SeriesPriorityDatasource);

                _get(Object.getPrototypeOf(SeriesPriorityDatasource.prototype), 'constructor', this).call(this, stb, recordingsListType.PRIORITY, {
                    data: []
                });

                if (this.stb && this.stb.dvr) {
                    this.source = this.reset.map(function () {
                        return true;
                    }).startWith(false).flatMapLatest(function (force) {
                        return _this.fetch(force).startWith(_this.initialValue).takeUntil(_this.reset);
                    })['do'](function (result) {
                        return _this.saveToCache(result);
                    }).map(function (result) {
                        return _this.convertResultBeforeEmitting(result);
                    }).shareReplay(1);
                } else {
                    this.source = rx.Observable.never();
                }
            }

            _createClass(SeriesPriorityDatasource, [{
                key: 'fetch',
                value: function fetch(force) {
                    if (force) {
                        this.clearCache();
                    }

                    return this.batchGetWithCache({
                        getter: this.getOneSeriesPriorityBatch.bind(this),
                        initialParams: 0
                    })['catch'](function (error) {
                        return rx.Observable.just({ data: [], error: error });
                    }).scan(this.mergeBatches);
                }
            }, {
                key: 'saveToCache',
                value: function saveToCache(result) {
                    if (result === this.initialValue) {
                        return;
                    }

                    rdvrCacheService.createNewCache(this.stb, recordingsListType.PRIORITY, {
                        data: result.data,
                        nextParams: result.nextParams
                    });
                }
            }, {
                key: 'clearCache',
                value: function clearCache() {
                    rdvrCacheService.clearCache(recordingsListType.PRIORITY, this.stb);
                }
            }, {
                key: 'getOneSeriesPriorityBatch',
                value: function getOneSeriesPriorityBatch(startIndex) {
                    var url = config.piHost + config.nrsApi + this.getDvrBase() + this.stb.macAddressNormalized + config.services.dvrSeriesPriorities;

                    var params = {
                        startIndex: startIndex,
                        maxEventCount: 100
                    };

                    return rxhttp.get(url, { params: params, withCredentials: true }).retry(2).map(function (result) {
                        var hasMore = result.data.totalCount > result.data.series.length + startIndex;
                        if (hasMore && result.data.series.length > 0) {
                            result.nextParams = result.data.series.length + startIndex;
                        }

                        result.data = result.data.series;

                        return result;
                    });
                }
            }, {
                key: 'setSeriesPriorities',
                value: function setSeriesPriorities(priorities) {
                    if (!this.stb || !this.stb.dvr) {
                        return $q.resolve();
                    }

                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrSeriesPriorities;

                    return rxhttp.put(fullUrl, { priorities: priorities }, { withCredentials: true }).retry(2).toPromise($q);
                }
            }]);

            return SeriesPriorityDatasource;
        })(AbstractDatasource);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/series-priority-datasource.js.map
