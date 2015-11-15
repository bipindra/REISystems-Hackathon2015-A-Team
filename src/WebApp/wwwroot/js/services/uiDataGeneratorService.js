app.factory('uiDataGeneratorService', [function (translater) {
    function CreateChartData(data, config) {
        var result = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var x = data[i][config.x_field];

            var y = [];
            if (translater)
                translater(data[i], config.y_fields);// [];
            else
                for (var j = 0; j < config.y_fields.length; j++) {
                y.push(data[i][config.y_fields[j]] || 0);
            }
            result.push({ x: x, y: y });
        }
        return { data: result };
    }

    return {
       createChartData: CreateChartData
    };
}]);