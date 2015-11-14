// Write your Javascript code.
var app = angular.module('myApp', ['ui.router', 'angularCharts'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home/index.htm',
            controller: 'homeController'

        });

}]);


window.onerror = function (a, b, c) {
    alert(a + b + c);
}