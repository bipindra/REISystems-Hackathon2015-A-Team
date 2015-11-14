app.factory('lookupService', ['$q', 'dataService', 'configService', function ($q, dataService, configService) {
    var cache = [];
    function getLookup(table) {
        var url = configService.getConfig('lookupUrl') + table + ".json";
        var deferred = $q.defer();
        if (cache[table])
        {
            deferred.resolve(cache[table]);
        }
        else {
            dataService.getData(url).then(function (response) {
                cache[table] = response;
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;
    }

    return {
        getLookup: getLookup
    };
}]);