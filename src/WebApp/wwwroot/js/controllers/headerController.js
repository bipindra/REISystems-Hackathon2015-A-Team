'use strict'
app.controller('headerController', function headerController($rootScope, $scope, lookupService, queryService, dataService, configService, uiDataGeneratorService) {

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

    }

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
        $scope.showButtons = true;
        $scope.showTable = false;
        var input={
            "select": [escape('COUNT()'),'loan_type', 'loan_type_name', 'action_taken', 'respondent_id'],
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
            }, {
                "key": "action_taken",
                "value": "(1,2)",
                "operator": " in "
            }],
            "orderBy": {
                "columns": ['count'],
                "suffix": "DESC"
            },
            "groupBy": ['loan_type', 'loan_type_name', 'action_taken', 'respondent_id'],
            "limit":100
        };
        var t = function (q) {
            var query = queryService.getQueryString(q);
            return configService.getConfig('larUrl') + '?'+ query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        }
        input.limit = 1;
        var finalQuery = t(input);
        
        var url = finalQuery;
        $rootScope.loading = true;
        dataService.getData(url)
        .then(function (data) {
                input.limit = data.total;
            var url = t(input);
            
            dataService.getData(url).then(function (newData) {
                $scope.allData = newData.results;
                var x = alasql('SELECT respondent_id  from ? GROUP by respondent_id', [newData.results]);
                var y = alasql('SELECT respondent_id  from ? where loan_type = 2  GROUP by respondent_id', [newData.results]);
                var z = alasql('SELECT respondent_id  from ? where loan_type = 3  GROUP by respondent_id', [newData.results]);
                var a = alasql('SELECT respondent_id  from ? where loan_type = 4  GROUP by respondent_id', [newData.results]);

                $scope.TotalLender = (x.length == 1 && !x[0].respondent_id) ? 0 : x.length;
                $scope.TotalFHA = (y.length == 1 && !y[0].respondent_id) ? 0 : y.length;
                $scope.TotalVA = (z.length == 1 && !z[0].respondent_id) ? 0 : z.length;
                $scope.TotalFSA = (a.length == 1 && !a[0].respondent_id) ? 0 : a.length;
                $scope.data = newData;
                window.data = newData;
                CreateChart(newData.results);
                $rootScope.loading = false;
                
            });
        }, function (data) {
            $rootScope.loading = false;
        });

        return;
     }
    
    function CreateChart(data) {
        console.log(data);

        //data = alasql('SELECT * from ? ', [data]);

        var ys = [];
        for (var x = 0; x < data.length; x++) {
            var item = data[x];
            if (!ys[item.respondent_id]) {
                ys[item.respondent_id] = [];
            }
            ys[item.respondent_id]["loan_type_" + item.loan_type] = item.count;

        }
        var final = [];
        for (var x in ys) {
            final.push({
                respondent_id: x,
                loan_type_1: ys[x]["loan_type_1"],
                loan_type_2: ys[x]["loan_type_2"],
                loan_type_3: ys[x]["loan_type_3"]
            });
        }
        var chartData = uiDataGeneratorService.createChartData(final, { x_field: "respondent_id", y_fields: ["loan_type_1", "loan_type_2"] });
        console.log(chartData);

        $scope.config = {
            title: 'Products',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };
        chartData.series = ["Conventional"," FHA "]
        chartData.data = alasql('SELECT top 5 * from ? ', [chartData.data]);
        $scope.chartData = chartData;
    }



    $scope.PopulateLenderTable = function (type) {
        

        //$scope.showTable = true;
        $scope.All = type == 0 ? true : false;
        $scope.FHA = type == 1 ? true : false;;
        $scope.VA = type == 2 ? true : false;;

        var where = "";
        if (type != 0) {
            where = "and loan_type=" + type;
        }
        var data = alasql('SELECT top 10 respondent_id as Name, respondent_id as Address  from ? WHERE action_taken in (2,1) '+where+' GROUP by respondent_id ', [$scope.data.results]);

        for (var x in data) {
            data[x]["FHA"] = $scope.FHA;
            data[x]["VA"] = $scope.VA;
        }
        

        //for chart
        where = '';
        if (type != 0) {
            where = 'WHERE loan_type=' + type;
        }
        var allData = alasql('select * from ? '+where, [ $scope.allData]);
        var ys = [];
        for (var x = 0; x < allData.length; x++) {
            var item = allData[x];
            if (!ys[item.respondent_id]) {
                ys[item.respondent_id] = [];
            }
            ys[item.respondent_id]["action_taken_" + item.action_taken] = item.count;

        }
        var final = [];
        for (var x in ys) {
            final.push({
                respondent_id: x,
                action_taken_1: ys[x]["action_taken_1"],
                action_taken_2: ys[x]["action_taken_2"]
            });
        }

        var chartData = uiDataGeneratorService.createChartData(final, { x_field: "respondent_id", y_fields: ["action_taken_1", "action_taken_2"] });
        console.log(chartData);

        $scope.config = {
            title: 'Approvals/Disapprovals',
            tooltips: true,
            labels: false,
            mouseover: function () { },
            mouseout: function () { },
            click: function () { },
            legend: {
                display: true,
                //could be 'left, right'
                position: 'right'
            }
        };
        chartData.series = ["Approved ", " Rejected "]
        chartData.data = alasql('SELECT top 5 * from ? ', [chartData.data]);
        $scope.chartData = chartData;
        
        //end chart 
        var list = [];
        
        for (var i = 0; i < data.length; i++) {
            list.push("'"+data[i].Name+"'");
        }
        var query = queryService.getQueryString({
            "select": ['respondent_id', 'respondent_name', 'respondent_address',escape('COUNT()')],
            "where": [{
                "key": "respondent_id",
                "value": "("+list.join(',')+")",
                "operator": " IN"
            }],
            "orderBy": {
                "columns": ['count'],
                "suffix": "DESC"
            },
            "groupBy": ['respondent_id','respondent_name','respondent_address'],
            limit:data.length
        });

        $scope.showTable = data.length>0;
   
        var finalQuery = configService.getConfig('institutionsUrl') +'?'+ query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        dataService.getData(finalQuery).then(function (res) {
       
            var newData = alasql("select respondent_name as Name,respondent_address as Address from ? Group by respondent_name,respondent_address", [res.results]);
            for (var x in newData) {
                newData[x]["FHA"] = $scope.FHA;
                newData[x]["VA"] = $scope.VA;
            }
            $scope.LendersData = newData;
        }, function (error) {
            console.log(error);});

        
        //$scope.LendersData = [
        //    { Name: 'Test', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test address." },
        //    { Name: 'Test1', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test1 address." },
        //    { Name: 'Test2', FHA: $scope.FHA, VA: $scope.VA, Address: "This is test2 address." }
        //];
    }

});