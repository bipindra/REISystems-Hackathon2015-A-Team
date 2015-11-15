app.factory('uiDataGeneratorService', [function () {
    function CreateChartData(data, config) {
        var result = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var x = data[i][config.x_field];

            var y = [];
            for (var j = 0; j < config.y_field.length; j++) {
                y.push(data[i][config.y_field[j]]);
            }
            result.push({ x: x, y: y });
        }
        return { data: result };
    }

    return {
       CreateChartData: CreateChartData
    };
}]);