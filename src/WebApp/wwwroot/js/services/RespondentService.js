app.factory('respondentService', ['$q', 'dataService', 'configService', function ($q, dataService, configService) {

    function getRespondents(filter) {
        var url = configService.getConfig('institutionsUrl') + filter;
        return dataService.getData(url);
    }

    return {
        getRespondents: getRespondents
    };
}]);