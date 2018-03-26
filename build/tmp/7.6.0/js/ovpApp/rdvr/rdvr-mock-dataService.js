'use strict';

angular.module('ovpApp.rdvr.mockDataService', ['ngResource', 'ngMockE2E']).run(['$resource', '$httpBackend', '$log', function ($resource, $httpBackend, $log) {
    'use strict';

    $log.info('############################################################');
    $log.info('############ This will instantiate mock services ###########');
    $log.info('############################################################');

    // passThought for all non backend service calls
    $httpBackend.whenGET(/^\/*js\/ovpApp\/*/).passThrough();

    $httpBackend.whenGET(/.*\/usage/).respond($resource('/js/test/fixtures/rdvr/diskUsage.json').get());

    $httpBackend.whenGET(/.*\/stbs/).respond($resource('/js/test/fixtures/rdvr/setTopBoxes.json').get());

    $httpBackend.whenGET(/.*\/recorded(([\?\&]maxEventCount=[0-9]+)|([\?\&]startIndex=0))+/).respond($resource('/js/test/fixtures/rdvr/recorded.json').get());

    $httpBackend.whenGET(/.*\/recorded(([\?\&]maxEventCount=[0-9]+)|([\?\&]startIndex=50))+/).respond($resource('/js/test/fixtures/rdvr/recorded.50.json').get());

    $httpBackend.whenGET(/.*\/recording/).respond($resource('/js/test/fixtures/rdvr/recordings.json').get());

    $httpBackend.whenGET(/.*\/recorded\/play\/[0-9]+\/[A-Z0-9]+\/[0-9]+/).respond(200);

    $httpBackend.whenPUT(/.*\/recorded\/delete/).respond($resource('/js/test/fixtures/rdvr/recorded.delete.json').get());

    $httpBackend.whenGET(/.*\/nmdepgs\/v1\/guide\/channels/).respond($resource('/js/test/fixtures/rdvr/channels.json').get());

    $httpBackend.whenGET(/.*\/scheduled$/).respond(206, $resource('/js/test/fixtures/rdvr/scheduled.json').get());

    $httpBackend.whenGET(/.*\/scheduled\?startUnixTimestampSeconds=1410237000$/).respond(206, $resource('/js/test/fixtures/rdvr/scheduled.1410237000.json').get());

    $httpBackend.whenGET(/.*\/scheduled\?startUnixTimestampSeconds=1410426000$/).respond(200, $resource('/js/test/fixtures/rdvr/scheduled.1410426000.json').get());

    $httpBackend.whenDELETE(/.*\/scheduled\/[0-9]+\/[A-Z0-9]+\/[0-9]+\//).respond(200, '');

    (function setupUpdateSchedule() {
        var scheduled = $resource('/js/test/fixtures/rdvr/scheduled.json').get();
        scheduled.$promise.then(function () {

            // If the 2nd list item on the scheduled tab
            // is updated, lead the user to the conflicts
            // modal.
            var scheduled2ndRow = scheduled.recordings[1];
            $httpBackend.whenPUT(new RegExp(['.*', 'schedule', scheduled2ndRow.mystroServiceId, scheduled2ndRow.tmsProgramId, scheduled2ndRow.startUnixTimestampSeconds].join('/') + '/')).respond(409, $resource('/js/test/fixtures/rdvr/conflicts.json').get());

            $httpBackend.whenPUT(/.*\/schedule\/[0-9]+\/[A-Z0-9]+\/[0-9]+\//).respond(200, '');
        });
    })();

    $httpBackend.whenGET(/.*\/scheduled\/conflicts\/[0-9]+\/[A-Z0-9]+\/[0-9]+\/series/).respond(200, $resource('/js/test/fixtures/rdvr/conflicts.json').get());
}]);
//# sourceMappingURL=../../maps-babel/ovpApp/rdvr/rdvr-mock-dataService.js.map
