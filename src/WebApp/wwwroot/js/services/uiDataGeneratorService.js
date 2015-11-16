app.factory('uiDataGeneratorService', [function (translater) {
    function CreateChartData(data, config) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            var x =  data[i][config.x_field];

            var y = [];
            var tt = [];
            if (translater)
                translater(data[i], config.y_fields);// [];
            else
                for (var j = 0; j < config.y_fields.length; j++) {
                    {
                        var val = data[i][config.y_fields[j]] || 0;
                        y.push(val);
                        var text = j == 0 ? 'Approved ' : 'Rejected ';
                        tt.push((data[i][config.tooltip_field] || '') + '(' +text  + val + ')');
                    }
            }
            result.push({ x: x, y: y, tooltip:tt });
        }
        return { data: result };
    }

    return {
       createChartData: CreateChartData
    };
}]);