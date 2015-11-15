'use strict'
describe('query service test', function () {
    describe('when I call dataService', function () {
        beforeEach(function () {
            module('myApp');
        });

        var def;
        var $injector;
        beforeEach(inject(function (_$state_, _$q_, _$templateCache_, _$location_, _$rootScope_, _$injector_) {

            $injector = _$injector_;
        }));



        it('returns query string with just one column to select ', function () {
            var service = $injector.get('queryService');
            var dummy = {
                "select": ["applicant_income_000s"],
                "where": [],
                "orderBy": {
                    "columns": [],
                    "suffix": ""
                },
                "groupBy": []
            };
            expect(service.getQueryString(dummy)).toEqual('$select=applicant_income_000s');
        });
    });
});