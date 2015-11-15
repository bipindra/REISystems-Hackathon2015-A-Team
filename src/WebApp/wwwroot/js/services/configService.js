app.factory('configService', [function () {

    var configurations = [];
    configurations['lookupUrl'] = "https://api.consumerfinance.gov/data/hmda/concept/";
    configurations['larUrl'] = "https://api.consumerfinance.gov/data/hmda/slice/hmda_lar.json?";
    configurations['institutionsUrl'] = "https://api.consumerfinance.gov/data/hmda/slice/institutions.json?";
    return {
        getConfig:function(what){
            return configurations[what];
        }
    };
}]);