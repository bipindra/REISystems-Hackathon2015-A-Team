app.factory('lookupService', ['$q','dataService','configService', function ( $q,dataService,configService) {
    function getLookup(table) {
        var url = configService.getConfig('lookupUrl') + table + ".json";
        return dataService.getData(url);
    }

    return {
        getLookup: getLookup
    };
}]);