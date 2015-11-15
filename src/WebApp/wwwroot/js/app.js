// Write your Javascript code.
var app = angular.module('myApp', ['ui.router', 'angularCharts'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('exhome', {
            url: '/exhome',
            templateUrl: 'templates/home/index.htm',
            controller: 'homeController'

        })

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home/header.htm',
            controller: 'headerController'

        });



}]);


window.onerror = function (a, b, c) {
    alert(a + b + c);
}