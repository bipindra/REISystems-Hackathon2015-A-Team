'use strict'
app.factory('dataService', ['$http', '$q', function ($http, $q) {

    function getData(url) {
        var deferred = $q.defer();
        var config = {};
        $http.get(url, config).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            try {
                url = response.config.url;
                url = url.replace(/json/g, 'jsonp') + '&%24callback=JSON_CALLBACK';
                getDataP(url).then(function (res) {
                    deferred.resolve(res);
                }, function (res) {
                    deferred.reject(res);
                });;
            }catch(e){
                deferred.reject(response.data);
            }
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


