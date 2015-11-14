app.factory('configService', [function () {

    var configurations = [];
    configurations['lookupUrl'] = "https://api.consumerfinance.gov/data/hmda/concept/"
    return {
        getConfig:function(what){
            return configurations[what];
        }
    };
}]);