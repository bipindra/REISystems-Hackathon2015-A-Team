
app.factory('queryService', function () {

    var getSoQLQueryString = function (queryObj) {
        var queryResult = "";
        if (typeof (queryObj) !== "undefined" && queryObj !== null) {

            //Resolve Select
            var select = "";
            var defaultSelectParams = [];

            if (queryObj.select && queryObj.select.length > 0) {
                select = "$select=" + queryObj.select.join(",");
            } else {
                select = "$select=" + defaultSelectParams.join(",");
            }

            queryResult = select;

            //Resolve Where
            var where = "";
            var tempWhereArray = [];
            if (queryObj.where && queryObj.where.length > 0) {
                for (var i = 0; i < queryObj.where.length; i++) {
                    if (queryObj.where[i].key && queryObj.where[i].value && queryObj.where[i].operator && queryObj.where[i].key !== "" && queryObj.where[i].value !== "" && queryObj.where[i].operator !== "") {
                        tempWhereArray.push(queryObj.where[i].key + escape(queryObj.where[i].operator) + queryObj.where[i].value);
                    }
                }

                if (tempWhereArray.length > 0) {
                    where = "$where=" + tempWhereArray.join("+AND+");
                }

                if (where !== "") {
                    queryResult = queryResult + "&" + where;
                }
            }

            //Resolve OrderBy
            var orderByStr = "";
            if (queryObj.orderBy && queryObj.orderBy.columns && queryObj.orderBy.columns.length > 0) {
                orderByStr = queryObj.orderBy.columns.join(",");

                if (queryObj.orderBy.suffix && queryObj.orderBy.suffix !== "") {
                    orderByStr = orderByStr + "+" + queryObj.orderBy.suffix;
                } else {
                    orderByStr = orderByStr + "+" + "ASC";
                }
            }

            if (orderByStr !== "") {
                orderByStr = "$orderBy=" + orderByStr;
                queryResult = queryResult + "&" + orderByStr;
            }

            //Resolve GroupBy
            var groupByStr = "";
            if (queryObj.groupBy && queryObj.groupBy.length > 0) {
                groupByStr = queryObj.groupBy.join(",");
            }

            if (groupByStr !== "") {
                groupByStr = "$group=" + groupByStr;
                queryResult = queryResult + "&" + groupByStr;
            }

            //Resolve limit
            var limitStr = "";
            if (queryObj.limit && queryObj.limit !== "") {
                limitStr = "$limit=" + queryObj.limit;
                queryResult = queryResult + "&" + limitStr;
            }
        }
        return queryResult;
    };

    return {
        getQueryString: getSoQLQueryString
    };
})