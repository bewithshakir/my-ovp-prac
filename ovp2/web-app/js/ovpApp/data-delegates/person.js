(function () {
    'use strict';

    angular
        .module('ovpApp.dataDelegate')
        .factory('personViewModelDefinition', personViewModelDefinition);

    /* @ngInject */
    function personViewModelDefinition(DataDelegate, config, delegateFactory, delegateUtils) {
        let cached = delegateUtils.cached;

        return new DataDelegate({
            name: 'name',
            role: 'role',
            roleText: cached(function (data) {
                if (data.character) {
                    return `as ${data.character}`;
                } else if (data.role == 'actor') {
                    return data.actorType;
                } else {
                    return data.role;
                }
            }),
            clickRoute: cached(function (data) {
                let id;
                if (this.parentAsset && this.parentAsset.tmsProgramIds) {
                    id = this.parentAsset.tmsProgramIds[0];
                } else if (this.parentAsset && this.parentAsset.latestEpisode) {
                    id = this.parentAsset.latestEpisode.tmsProgramIds[0];
                }

                return [
                    'search.person',
                    {
                        query: data.name,
                        tmsPersonId: data.tmsPersonId,
                        tmsId: id,
                        role: data.role
                    }
                ];
            }),
            imageUri: cached(delegateUtils.getPersonImageUri),
            parentAsset: 'parentAsset'
        });
    }
})();
