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

        $scope.showChart = false;
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

        lookupService.getLookup('denial_reason').then(function (data) {
            var lookupResults = angular.fromJson(data).table.data;
            var newData = [];
            for (var i in lookupResults) {
                newData.push({ Code: lookupResults[i]._id, Value: lookupResults[i].name });
            }
            $scope.lookupDenialReason = newData;
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

    function SearchClickHandler() {
        $scope.showChart = false;
        $scope.showLenderDropdown = false;
        $scope.showButtons = true;
        $scope.showTable = false;
        var input = {
            "select": [escape('COUNT()'), 'loan_type', 'loan_type_name', 'action_taken', 'respondent_id'],
            "where": [{
                "key": "action_taken",
                "value": "(1,2)",
                "operator": " in "
            }],
            "orderBy": {
                "columns": ['count'],
                "suffix": "DESC"
            },
            "groupBy": ['loan_type', 'loan_type_name', 'action_taken', 'respondent_id'],
            "limit": 100
        };

        if ($scope.SelectedLoanPurposeCode &&  $scope.SelectedLoanPurposeCode !== "" && $scope.SelectedLoanPurposeCode !== "0") {
            input.where.push({
                "key": "loan_purpose",
                "value": $scope.SelectedLoanPurposeCode,
                "operator": "="
            });
        }
        
        if ($scope.SelectedStateCode && $scope.SelectedStateCode !== "" && $scope.SelectedStateCode !== "00")
        {
            input.where.push({
                    "key": "state_code",
                    "value": $scope.SelectedStateCode,
                    "operator": "="
                });
        }
        var tempcountyCode = $scope.SelectedCountyCode.toString().substr(2, 3);
        if (tempcountyCode && tempcountyCode !== "" && tempcountyCode !== "0")
        {
            input.where.push({
                "key": "county_code",
                "value": tempcountyCode,
                "operator": "="
            });
        }

        var t = function (q) {
            var query = queryService.getQueryString(q);
            return configService.getConfig('larUrl') + '?' + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        }
        input.limit = 1;
        var finalQuery = t(input);
        
        var url = finalQuery;
        $rootScope.loading = true;
        
        console.log(url);
        dataService.getData(url)
        .then(function (data) {
                input.limit = data.total;
            var url = t(input);
            
            dataService.getData(url).then(function (newData) {
                $scope.allData = newData.results;
                var x = alasql('SELECT respondent_id  from ? where loan_type = 1 GROUP by respondent_id', [newData.results]);
                var y = alasql('SELECT respondent_id  from ? where loan_type = 2  GROUP by respondent_id', [newData.results]);
                var z = alasql('SELECT respondent_id  from ? where loan_type = 3  GROUP by respondent_id', [newData.results]);
                var a = alasql('SELECT respondent_id  from ? where loan_type = 4  GROUP by respondent_id', [newData.results]);

                $scope.TotalLender = (x.length == 1 && !x[0].respondent_id) ? 0 : x.length;
                $scope.TotalFHA = (y.length == 1 && !y[0].respondent_id) ? 0 : y.length;
                $scope.TotalVA = (z.length == 1 && !z[0].respondent_id) ? 0 : z.length;
                $scope.TotalFSA = (a.length == 1 && !a[0].respondent_id) ? 0 : a.length;
                $scope.data = newData;
                window.data = newData;
                $rootScope.loading = false;
                $('[data-toggle="tooltip"]').tooltip({ template: "<div class='tooltip' ><div class='tooltip-inner' style='text-align:left; max-width:5000px'></div></div>", html: true });
                
            });
        }, function (data) {
            $rootScope.loading = false;
        });

        return;
     }

    function PopulateLenderTableClick(type) {
        
        //$scope.showTable = true;
        $scope.All = type == 1 ? true : false;
        $scope.FHA = type == 2 ? true : false;
        $scope.VA = type == 3 ? true : false;
        $scope.FSA = type == 4 ? true : false;
        
        var where = "";
        if (type != 0) {
            where = "and loan_type=" + type;
        }
        var data = alasql('SELECT top 10 respondent_id as Name, respondent_id as Address  from ? WHERE action_taken in (2,1) ' + where + ' GROUP by respondent_id ', [$scope.data.results]);

        for (var x in data) {
            data[x]["FHA"] = $scope.FHA;
            data[x]["VA"] = $scope.VA;
            data[x]["FSA"] = $scope.FSA;
        }
        

        //for chart
        $scope.Loan_Type = type;
        $scope.chartData = ShowChart($scope.allData, type);;
        
        //end chart 
        var list = [];
        
        for (var i = 0; i < data.length; i++) {
            list.push("'" + data[i].Name + "'");
        }

        $scope.pieConfig1 = {};
        $scope.pieChartDataAll = {};
        $scope.LenderSelected(list.join(','), true);

        var query = queryService.getQueryString({
            "select": ['respondent_id', 'respondent_name', 'respondent_address', escape('COUNT()')],
            "where": [{
                "key": "respondent_id",
                "value": "(" + list.join(',') + ")",
                "operator": " IN"
            }],
            "orderBy": {
                "columns": ['count'],
                "suffix": "DESC"
            },
            "groupBy": ['respondent_id', 'respondent_name', 'respondent_address'],
            limit: data.length
        });

        $scope.showTable = data.length > 0;
   
        var finalQuery = configService.getConfig('institutionsUrl') + '?' + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        dataService.getData(finalQuery).then(function (res) {
       
            var newData = alasql("select respondent_id, respondent_name as Name,respondent_address as Address from ? Group by respondent_id,respondent_name,respondent_address", [res.results]);
            for (var x in newData) {
                newData[x]["FHA"] = $scope.FHA;
                newData[x]["VA"] = $scope.VA;
            }
            $scope.LendersData = newData;

            $scope.SelectedLenderValue = $scope.LendersData[0].Name;
            $scope.showLenderDropdown = true;
            if ($scope.LendersData[0] && $scope.LendersData[0].respondent_id != undefined) {
                $scope.LenderSelected($scope.LendersData[0].respondent_id, false);
            }
        }, function (error) {
            console.log(error);
        });
    }

    function ShowChart(allData, type) {
        $scope.showChart = true;
        var where = '';
        if (type != 0) {
            where = 'WHERE loan_type=' + type;
        }
        var allData = alasql('select * from ? ' + where, [$scope.allData]);
        var ys = [];
        var ysOrder = [];
        for (var x = 0; x < allData.length; x++) {
            var item = allData[x];
            if (!ys[item.respondent_id]) {
                ys[item.respondent_id] = [];
            }
            ys[item.respondent_id]["action_taken_" + item.action_taken] = item.count;
            ysOrder.push(item.respondent_id);
        }
        var final = [];

        for (var i = 0; i < ysOrder.length; i++) {
            var x = ysOrder[i];
            var item = ys[x];
            var itemx = item[x];
            var a1 = 0, a2 = 0;
            if (item) {
                a1 = item["action_taken_1"] || 0;
                a2 = item["action_taken_2"] || 0;
        }
            final.push({
                respondent_id:x ,
                action_taken_1: a1,
                action_taken_2: a2
            });
        }

        final = final.sort(function (a, b) {
            var amax = (a.action_taken_1);
            var bmax = (b.action_taken_1);
            return  bmax -amax;
        });
        
        var chartData = uiDataGeneratorService.createChartData(final, { x_field: "respondent_id", y_fields: ["action_taken_1", "action_taken_2"] });

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
        chartData.data = alasql('SELECT top 20 * from ? ', [chartData.data]);
        return chartData;
    }

    $scope.PopulateLenderTable = PopulateLenderTableClick;
    $scope.SearchClicked = SearchClickHandler;

    $scope.LenderSelected = function (selectedLender, allLenders) {


        $rootScope.loading = true;

        var url = "";
        var lenderName = "";
        if (selectedLender.respondent_id == undefined) {
            url = GetPieChartQuery(selectedLender)
            lenderName = "Denial Reason : All Lenders";
        }
        else {
            url = GetPieChartQuery(selectedLender.respondent_id)
            lenderName = selectedLender.Name;
            $scope.SelectedLenderValue = lenderName;
            $scope.showLenderDropdown = true;
        }

        dataService.getData(url)
        .then(function (data) {
            if (!data.results) {
                dataService.getData(url)
                    .then(function (data) {

                        CreatePieChart(lenderName,data.results, allLenders);
                    }, function (data) {
                        $rootScope.loading = false;
                    });
            } else {
                CreatePieChart(lenderName,data.results,allLenders);
            }
        }, function (data) {
            $rootScope.loading = false;
        });

        function GetPieChartQuery(respondents) {


            var respondentSelect = [escape('COUNT()'), 'respondent_id', 'denial_reason_1'];
            var respondentsWhere = {
                "key": "respondent_id",
                "value": "'" + respondents + "'",
                "operator": "="
            };
            var respondentGroupBy = ['respondent_id', 'denial_reason_1'];


            if (respondents.indexOf(",") > 0) {
                respondentsWhere = {
                    "key": "respondent_id",
                    "value": " (" + respondents + ") ",
                    "operator": " IN "
                }
                respondentSelect = [escape('COUNT()'), 'denial_reason_1'];
                respondentGroupBy = ['denial_reason_1'];
            }



        var input = {
                "select": respondentSelect,
            "where": [
                    respondentsWhere,
            {
                "key": "loan_type",
                "value": $scope.Loan_Type,
                "operator": "="
            },
            ],
            "orderBy": {
                "columns": ['count'],
                "suffix": "DESC"
            },
                "groupBy": respondentGroupBy,
            "limit": 100
        };

        if ($scope.SelectedLoanPurposeCode && $scope.SelectedLoanPurposeCode !== "" && $scope.SelectedLoanPurposeCode !== "0") {
            input.where.push({
                "key": "loan_purpose",
                "value": $scope.SelectedLoanPurposeCode,
                "operator": "="
            });
        }

        if ($scope.SelectedStateCode && $scope.SelectedStateCode !== "" && $scope.SelectedStateCode !== "00") {
            input.where.push({
                "key": "state_code",
                "value": $scope.SelectedStateCode,
                "operator": "="
            });
        }
        var tempcountyCode = $scope.SelectedCountyCode.toString().substr(2, 3);
        if (tempcountyCode && tempcountyCode !== "" && tempcountyCode !== "0") {
            input.where.push({
                "key": "county_code",
                "value": tempcountyCode,
                "operator": "="
            });
        }


        var t = function (q) {
            var query = queryService.getQueryString(q);
            return configService.getConfig('larUrl') + '?' + query.toString().replace(/\$/g, escape('$')).replace(/ /g, '+') + "&%24offset=0&%24format=json";
        }
        input.limit = 100;
        var finalQuery = t(input);

        var url = finalQuery;

            return finalQuery;
            }

        function CreatePieChart(lenderName,lendersData, allLenders) {
            //var lendersData = data.results;

            //var result = [];

            var pieChartData = { data: [] };
            var sumDenialReasons = alasql('SELECT SUM([count]) as Total from ? where denial_reason_1 > 0', [lendersData])
           if (lendersData)
            for (var i = 0; i < lendersData.length; i++) {
                if (lendersData[i].denial_reason_1) {
                    var x = "Not Specified";
                    var lookupValue = alasql('SELECT Value from ? where Code = ' + lendersData[i].denial_reason_1, [$scope.lookupDenialReason]);//lendersData[i].respondent_id;

                    if (lookupValue && lookupValue.length > 0) {
                        x = lookupValue[0].Value;
                    }


                    var y = [];
                    //y.push(lendersData[i].count)
                    y.push(Math.round((lendersData[i].count * 100 )/ sumDenialReasons[0].Total));

                        pieChartData.data.push({ x: x, y: y, tooltip: x + "(" + y[0] + ")" });
                }
            }
            var title =  lenderName;

            $scope.pieConfig = {
                title: "Denial Reasons : All Lenders",
                tooltips: true,
                labels: false,
                mouseover: function () { },
                mouseout: function () { },
                click: function () { },
                legend: {
                    display: true,
                    //could be 'left, right'
                    position: 'left'
                }
            };

            if (!allLenders)
            {
                $scope.pieConfig1 = {
                    title: title,
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
}

            pieChartData.data = alasql('SELECT * from ? ', [pieChartData.data]);

            if (!allLenders) {
            $scope.pieChartData = pieChartData;
            }
            else {
                $scope.pieChartDataAll = pieChartData;
            }




            $rootScope.loading = false;
        }



    }


});