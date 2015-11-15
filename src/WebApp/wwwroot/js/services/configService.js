app.factory('configService', [function () {

    var configurations = [];
    configurations['lookupUrl'] = "https://api.consumerfinance.gov/data/hmda/concept/"
    configurations['institutionsUrl'] = "https://api.consumerfinance.gov:443/data/hmda/slice/institutions.json"
    configurations['larUrl'] = "https://api.consumerfinance.gov:443/data/hmda/slice/hmda_lar.json";
    return {
        getConfig:function(what){
            return configurations[what];
        }
    };
}]);