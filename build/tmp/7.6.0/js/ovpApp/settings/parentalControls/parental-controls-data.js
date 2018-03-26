'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

(function () {
    'use strict';

    parentalControlsData.$inject = ["parentalControlsService", "$q"];
    angular.module('ovpApp.settings.parentalControls.data', ['ovpApp.services.parentalControlsService']).factory('parentalControlsData', parentalControlsData);

    /* @ngInject */
    function parentalControlsData(parentalControlsService, $q) {
        var service = {
            getChannelCards: getChannelCards,
            getRatingBlocks: getRatingBlocks
        };
        return service;

        ////////////////

        function getChannelCards() {
            return parentalControlsService.parentalControlsByChannel().then(function (channels) {
                var channelCards = [];

                channels.forEach(function (channel) {
                    if (channel.linearCount == 1 && channel.vodCount == 1) {
                        channelCards.push(channel);
                    } else {
                        channel.services.forEach(function (service) {
                            return channelCards.push(service);
                        });
                    }
                });
                return { channels: channels, channelCards: channelCards };
            });
        }

        function getRatingBlocks() {
            return $q.all([parentalControlsService.getUnblockedTvRating(), parentalControlsService.getUnblockedMovieRating()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var tvRating = _ref2[0];
                var movieRating = _ref2[1];

                return { tvRating: tvRating, movieRating: movieRating };
            });
        }
    }
})();
//# sourceMappingURL=../../../maps-babel/ovpApp/settings/parentalControls/parental-controls-data.js.map
