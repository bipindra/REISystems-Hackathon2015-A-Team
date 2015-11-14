app.factory('lookupService', ['$q','dataService','configService', function ( $q,dataService,configService) {
    function getLookup(table) {

    }

    return {
        getLookup: getLookup
    };
}]);
