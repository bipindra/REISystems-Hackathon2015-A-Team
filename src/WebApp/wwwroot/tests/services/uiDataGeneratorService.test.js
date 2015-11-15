'use strict'
describe('Data Generator Service Test test', function () {
    describe('WHen i Call CreateChartData', function () {
        beforeEach(function () {
            module('myApp');
        });

        var def;
        var $injector;
        beforeEach(inject(function (_$state_, _$q_, _$templateCache_, _$location_, _$rootScope_, _$injector_) {
           
            $injector = _$injector_;
        }));



        it('returns data for charts', function () {
            var service = $injector.get('uiDataGeneratorService');
            var expected = ({ data: [({ x: 'name', y: [1] })] });
            var input = service.createChartData([{ a: 'name', b: 1 }], { x_field: 'a', y_fields: ['b'] });
           expect(input).toEqual(expected);
        });
    });
});

