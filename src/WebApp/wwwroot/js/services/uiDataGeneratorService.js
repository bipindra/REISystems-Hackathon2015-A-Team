app.factory('uiDataGeneratorService', [function () {
    function CreateChartData(data, config) {
        var result = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var x = data[i][config.x_field];
            result[x] = result[x] || { x: x, y: [] };
            
            for (var j = 0; j < config.y_field.length; j++) {

                var yData = data[i][config.y_field[j]] || 0;
                result[x].y.push(yData);
            }

            
        }
        var final = [];
        for (var item in result) {
            final.push(result[item]);
        }
        return { data: final };
    }

    return {
       CreateChartData: CreateChartData
    };
}]);