app.controller('homeController', function homeController($scope,dataService) {
    $scope.name = "A Team";
    $scope.config = {
        title: 'Products',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
            display: true,
            //could be 'left, right'
            position: 'right'
        }
    };

    $scope.data = {
        series: ['Wells Fargo', 'BoA', 'Capital One'],
        data: [{
            x: "Wells Fargo",
            y: [10]
        }, {
            x: "BoA",
            y: [30]
        }, {
            x: "CapitalOne",
            y: [51]
        }]
    };

});