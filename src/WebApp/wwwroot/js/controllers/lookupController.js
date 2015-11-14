'use strict'

app.controller('lookupController', ['lookupService', '$scope', function (lookupService, $scope) {
    var ctrl = $scope;
    var t = this;
    lookupService.getLookup('fips').then(function (data) {
        ctrl.lookupResults = angular.fromJson(data).table.data;
        var newData = [];
        for (var i in ctrl.lookupResults) {
            newData.push(ctrl.lookupResults[i]._id);
        }
        ctrl.lookupData = newData;
        
        t.GetCountiesInState = function (stateCode) {
            var counties = [];
            for (var i in ctrl.lookupData) {
                if (ctrl.lookupData[i].toString().startsWith(stateCode))
                { counties.push(ctrl.lookupResults[i].county_name); }
            }
            return counties;
        };
        ctrl.counties = t.GetCountiesInState('02');
    });
    
}]);