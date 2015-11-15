'use strict'
app.controller('headerController', function headerController($scope, lookupService, queryService, dataService, configService) {

    $scope.SelectedLoanPurposeValue = 'Select Loan Purpose';
    $scope.SelectedLoanPurposeCode = 0


    $scope.SelectedStateCode = 0;
    $scope.SelectedStateValue = 'Select State';

    $scope.SelectedCountyCode = 0;
    $scope.SelectedCountyValue = 'Select County';

    GetLookups()

    function GetLookups() {



        lookupService.getLookup('fips').then(function (data) {
            var results = angular.fromJson(data).table.data;
            $scope.lookupData = [];
            for (var i in results) {
                $scope.lookupData.push({ Code: results[i]._id, Value: results[i].county_name })
            }

        });

        lookupService.getLookup('state_code').then(function (data) {
            var results = angular.fromJson(data).table.data;
            var states = [{ Code: 0, Value: 'Select State' }];
            for (var i in results) {
                //if (i.length === 1)
                //{
                //    debugger;
                //    results[i]._id = '0' + results[i]._id;
                //}
                states.push({ Code: results[i]._id, Value: results[i].name })
            }
            $scope.lookupState = states;
        });

        lookupService.getLookup('loan_purpose').then(function (data) {
            var lookupResults = angular.fromJson(data).table.data;
            var newData = [{ Code: 0, Value: 'Select Loan Purpose' }];
            for (var i in lookupResults) {
                newData.push({ Code: lookupResults[i]._id, Value: lookupResults[i].name });
            }
            $scope.lookupLoanPurpose = newData;
        });

        //lookupService.getLookup('state_code').then(function (data) {
        //    var lookupResults = angular.fromJson(data).table.data;
        //    var newData = [];
        //    for (var i in lookupResults) {
        //        newData.push({ Code: lookupResults[i]._id, Value: lookupResults[i].name });
        //    }
        //    $scope.lookupLoanPurpose = newData;
        //});
    }




    //$scope.lookupLoanPurpose = 
    //    [
    //                    { Code: 0, Value: 'Select Loan Purpose' },
    //                    { Code: 1, Value: 'Home purchase' },
    //                    { Code: 2, Value: 'Home improvement' },
    //                    { Code: 3, Value: 'Refinancing' }
    //    ];



    //$scope.lookupState =
    //    [
    //                    { Code: 0, Value: 'Select State' },
    //                    { Code: 1, Value: 'VA' },
    //                    { Code: 2, Value: 'MD' },
    //                    { Code: 3, Value: 'DC' }
    //    ];




    $scope.LoanPurposeSelected = function (LoanPurposeCode, LoanPurposeValue) {
        $scope.SelectedLoanPurposeValue = LoanPurposeValue;
        $scope.SelectedLoanPurposeCode = LoanPurposeCode;
    }

    $scope.StateSelected = function (StateCode, StateValue) {


        if (StateCode < 10) {
            StateCode = '0' + StateCode;
        }

        $scope.SelectedStateCode = StateCode;
        $scope.SelectedStateValue = StateValue;
        $scope.SelectedCountyCode = 0;
        $scope.SelectedCountyValue = 'Select County';

        var counties = [{ Code: 0, Value: 'Select County' }];
        for (var index = 0; index < $scope.lookupData.length; index++) {
            if ($scope.lookupData[index].Code.toString().startsWith(StateCode))
            { counties.push($scope.lookupData[index]) }
            $scope.lookupCounty = counties;
        }

    }

    $scope.CountySelected = function (CountyCode, CountyValue) {
        $scope.SelectedCountyCode = CountyCode;
        $scope.SelectedCountyValue = CountyValue;
    }

    $scope.SearchClicked = function () {
        var query = queryService.getQueryString({
            "select": ['loan_type', 'loan_type_name', 'action_taken', 'respondent_id'],
            "where": [{
                "key": "state_code",
                "value": $scope.SelectedStateCode,
                "operator": "="
            }, {
                "key": "county_code",
                "value": $scope.SelectedCountyCode.toString().substr(2, 3),
                "operator": "="
            }, {
                "key": "loan_purpose",
                "value": $scope.SelectedLoanPurposeCode,
                "operator": "="
            }],
            "orderBy": {
                "columns": ['respondent_id'],
                "suffix": "DESC"
            },
            "groupBy": ['loan_type', 'loan_type_name', 'action_taken', 'respondent_id']
        });
        var finalQuery = configService.getConfig('larUrl') + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        alert(finalQuery);
        makeCall(finalQuery);
        //dataService.getData(finalQuery).then(function (data) {
        //    if (angular.fromJson(data))
        //    $scope.loanData = angular.fromJson(data).results;
        //var respondentIds = "";
        //for(var i in $scope.loanData)
        //{
        //    respondentIds += $scope.loanData[i].respondent_id.toString() + ", ";
        //}
        //var where = "(" + respondentIds + ")";
        //query = queryService.getQueryString({
        //    "select": ['respondent_id', 'respondent_name', 'respondent_address', 'respondent_city',
        //        'respondent_state', 'respondent_zip_code'],
        //    "where": [{
        //        "key": "respondent_id",
        //        "value": where,
        //        "operator": "IN"
        //    }],
        //    "orderBy": {
        //        "columns": ['respondent_name','respondent_id'],
        //        "suffix": "DESC"
        //    },
        //    "groupBy": []
        //});
        //finalQuery = configService.getConfig('institutionsUrl') + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        //alert(finalQuery);
        //dataService.getData(finalQuery).then(function (data) {
        //    $scope.lenderData = angular.fromJson(data).results;
        //});
        //});
        alert('Loan Purpose : ' + $scope.SelectedLoanPurposeCode + ', State : ' + $scope.SelectedStateCode + ', County :' + $scope.SelectedCountyCode);
    }
    function makeCall(query, then) {
        dataService.getData(query).then(function (data) {
            if (angular.fromJson(data).computing === null) {
                $scope.loanData = angular.fromJson(data).results;
                var respondentIds = "";
                for (var i in $scope.loanData) {
                    respondentIds += "'" + $scope.loanData[i].respondent_id.toString() + "',";
                }
                var where = "(" + respondentIds.substr(0, respondentIds.length - 1) + ")";
                query = queryService.getQueryString({
                    "select": ['respondent_id', 'respondent_name', 'respondent_address', 'respondent_city',
                        'respondent_state', 'respondent_zip_code'],
                    "where": [{
                        "key": "respondent_id",
                        "value": where,
                        "operator": " IN"
                    }],
                    "orderBy": {
                        "columns": ['respondent_name', 'respondent_id'],
                        "suffix": "DESC"
                    },
                    "groupBy": []
                });
                var finalQuery = configService.getConfig('institutionsUrl') + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
                alert(finalQuery);
                makeNextCall(finalQuery);

            }

            else
                makeCall(query);
        });
    }
    function makeNextCall(query) {
        dataService.getData(query).then(function (data) {
            if (angular.fromJson(data).computing === null) {
                $scope.lenderData = angular.fromJson(data).results;
            }
            else
                makeNextCall(query)
        });
    }

    $scope.PopulateLenderTable = function (type) {
        debugger;
        $scope.All = type == 0 ? true : false;
        $scope.FHA = type == 1 ? true : false;;
        $scope.VA = type == 2 ? true : false;;
        $scope.LendersData = [
            { Name: 'Test', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test address." },
            { Name: 'Test1', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test1 address." },
            { Name: 'Test2', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test2 address." }
        ];
    }

});