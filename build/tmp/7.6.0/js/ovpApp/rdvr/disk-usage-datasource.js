'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
    'use strict';

    factory.$inject = ["AbstractDatasource", "$q", "rx", "rxhttp", "config", "rdvrCacheService", "recordingsListType"];
    angular.module('ovpApp.rdvr.datasource').factory('DiskUsageDatasource', factory);

    /* @ngInject */
    function factory(AbstractDatasource, $q, rx, rxhttp, config, rdvrCacheService, recordingsListType) {
        return (function (_AbstractDatasource) {
            _inherits(DiskUsageDatasource, _AbstractDatasource);

            function DiskUsageDatasource(stb) {
                var _this = this;

                _classCallCheck(this, DiskUsageDatasource);

                _get(Object.getPrototypeOf(DiskUsageDatasource.prototype), 'constructor', this).call(this, stb, recordingsListType.DISK_USAGE, {
                    data: { usedPercentage: 0, freePercentage: 100 }
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

            _createClass(DiskUsageDatasource, [{
                key: 'fetch',
                value: function fetch(force) {
                    if (force) {
                        this.clearCache();
                    }

                    // There's only ever one batch for disk usage, but it's still worth reusing the caching logic
                    return this.batchGetWithCache({
                        getter: this.getOneDiskUsageBatch.bind(this)
                    })['catch'](function (e) {
                        return rx.Observable.just({
                            data: { usedPercentage: 0, freePercentage: 100 },
                            error: e
                        });
                    });
                }
            }, {
                key: 'getOneDiskUsageBatch',
                value: function getOneDiskUsageBatch() {
                    var baseUrl = config.piHost + config.nrsApi + this.getDvrBase();
                    var fullUrl = baseUrl + this.stb.macAddressNormalized + config.services.dvrDiskUsage;
                    return rxhttp.get(fullUrl, { withCredentials: true }).retry(2);
                }
            }]);

            return DiskUsageDatasource;
        })(AbstractDatasource);
    }
})();
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/disk-usage-datasource.js.map
