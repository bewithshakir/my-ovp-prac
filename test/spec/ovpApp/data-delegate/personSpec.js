describe('personViewModelDefinition', function () {
    'use strict';

    let definition, mockPerson;

    beforeEach(function () {
        module('ovpApp.dataDelegate');
    });

    beforeEach(inject(function (personViewModelDefinition) {
        definition = personViewModelDefinition;
        mockPerson = {
            actorType: "Actor",
            character: "Varek",
            name: "Jason Behr",
            parentAsset: undefined,
            role: "actor",
            tmsPersonId: 160551
        }
    }));

    describe('name', function () {
        it('should provide access to name', function () {
            let instance = definition.createInstance(mockPerson);
            expect(instance.name).toEqual(mockPerson.name);
        });
    });

    describe('role', function () {
        it('should provide access to role', function () {
            let instance = definition.createInstance(mockPerson);
            expect(instance.role).toEqual(mockPerson.role);
        });
    });

    describe('roleText', function () {
        it('should handle characters', function () {
            let instance = definition.createInstance(mockPerson);
            expect(instance.roleText).toEqual('as Varek');
        });

        it('should handle actors without characters', function () {
            mockPerson.character = undefined;
            let instance = definition.createInstance(mockPerson);
            expect(instance.roleText).toEqual('Actor');
        });

        it('should handle actors in other roles', function () {
            let person = {
                actorType: 'Host',
                name: 'Trevor Noah',
                role: "actor",
                tmsPersonId: 649933
            }
            let instance = definition.createInstance(person);
            expect(instance.roleText).toEqual('Host');
        });

        it('should handle nonactors', function () {
            let person = {
                name: "Jim Isaac",
                role: "director",
                tmsPersonId: 162600
            }
            let instance = definition.createInstance(person);
            expect(instance.roleText).toEqual('director')
        });
    });

    describe('clickRoute', function () {
        it('should work with no parent asset', function () {
            let instance = definition.createInstance(mockPerson);
            expect(instance.clickRoute).toEqual([
                'search.person',
                {
                    query: mockPerson.name,
                    tmsPersonId: mockPerson.tmsPersonId,
                    tmsId: undefined,
                    role: mockPerson.role
                }]);
        });

        it('should work with directors', function () {
            let person = {
                name: "Jim Isaac",
                role: "director",
                tmsPersonId: 162600
            }
            let instance = definition.createInstance(person);
            expect(instance.clickRoute).toEqual([
                'search.person',
                {
                    query: person.name,
                    tmsPersonId: person.tmsPersonId,
                    tmsId: undefined,
                    role: person.role
                }]);
        });

        it('should work with parent asset with tmsProgramIds', function () {
            mockPerson.parentAsset = {
                tmsProgramIds: [1, 2, 3]
            };
            let instance = definition.createInstance(mockPerson);
            expect(instance.clickRoute).toEqual([
                'search.person',
                {
                    query: mockPerson.name,
                    tmsPersonId: mockPerson.tmsPersonId,
                    tmsId: 1,
                    role: mockPerson.role
                }]);
        });

        it('should work with parent asset with latest episode', function () {
            mockPerson.parentAsset = {
                latestEpisode: {
                    tmsProgramIds: [1, 2, 3]
                }
            };
            let instance = definition.createInstance(mockPerson);
            expect(instance.clickRoute).toEqual([
                'search.person',
                {
                    query: mockPerson.name,
                    tmsPersonId: mockPerson.tmsPersonId,
                    tmsId: 1,
                    role: mockPerson.role
                }]);
        });
    });

    describe('imageUri', function () {
        
    });

    describe('parentAsset', function () {
        it('should provide access to parentAsset', function () {
            mockPerson.parentAsset = {hello: 'world'};
            let instance = definition.createInstance(mockPerson);
            expect(instance.parentAsset).toEqual(mockPerson.parentAsset);
        });
    });
});
