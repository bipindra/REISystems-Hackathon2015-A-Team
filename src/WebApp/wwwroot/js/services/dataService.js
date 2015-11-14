'use strict'
app.factory('dataService', ['$http', '$q', function ($http, $q) {

    function getData(url) {
        var deferred = $q.defer();
        var config = {};
        $http.get(url, config).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function getDataP(url) {

        var deferred = $q.defer();
        var config = {};
        $http.jsonp(url, config).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    }

    function convertToChartData(inputData) {
        return {
            data: inputData
        };
    }
    return {
        getData: getData,
        getDataP:getDataP,
        convertToChartData: convertToChartData
    };
}]);


