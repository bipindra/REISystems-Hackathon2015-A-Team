'use strict'
describe('dataService test', function () {
    describe('when I call dataService', function () {
        beforeEach(function () {
            module('myApp');
        });

        var def;
        var $injector;
        beforeEach(inject(function (_$state_, _$q_, _$templateCache_, _$location_, _$rootScope_, _$injector_) {
            
            $injector = _$injector_;
        }));


       
        it('returns lookup Url ', function () {
            var service = $injector.get('configService');
            expect(service.getConfig('lookupUrl')).toEqual('https://api.consumerfinance.gov/data/hmda/concept/');
        });
    });
});