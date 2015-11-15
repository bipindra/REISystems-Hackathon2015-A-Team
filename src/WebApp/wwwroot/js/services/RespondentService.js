app.factory('respondentService', ['$q', 'dataService', function ($q, dataService) {

    function getRespondents(filter) {
        var url = configService.getConfig('institutionsUrl') + filter;
        return dataService.getData(url);
    }

    return {
        getRespondents: getRespondents
    };
}]);