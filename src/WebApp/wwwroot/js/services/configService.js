app.factory('configService', [function () {

    var configurations = [];

    return {
        getConfig:function(what){
            return configurations[what];
        }
    };
}]);