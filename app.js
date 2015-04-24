// MODULE
var weatherApp = angular.module("weatherApp", ['ngRoute', 'ngResource']);


// ROUTES
weatherApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl: "pages/home.html",
        controller: "homeController"
    })
    .when('/forecast',{
        templateUrl: "pages/forecast.html",
        controller: "forecastController"
    })
    .when('/forecast/:days',{ //pattern match
        templateUrl: "pages/forecast.html",
        controller: "forecastController"
    })
    .otherwise('/')
})

// SERVICES: Custom. Angular services starts with $
weatherApp.service("cityService", function(){
    this.city = "New York, NY";
    
    this.fahrenheitConversion = function(degK){
        return Math.round((1.8 * (degK - 273) + 32));
    };
})

// CONTROLLERS
weatherApp.controller("homeController", [ '$scope', 'cityService', function($scope, cityService){ //Dependencies are being injected twice for minification safety.
    $scope.city = cityService.city;
    
    $scope.$watch("city", function(){
        cityService.city = $scope.city;
    })
}]);

weatherApp.controller("forecastController", [ '$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService){
    $scope.city = cityService.city,
        
    $scope.days = $routeParams.days || 2;
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
        callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    console.log($scope.weatherResult);
    
    /*$scope.convertToFahrenheit = function(degK){
        return Math.round((1.8 * (degK - 273) + 32));
    };*/
    $scope.convertToFahrenheit = cityService.fahrenheitConversion;
    
    $scope.convertToDate = function(dt){
        return new Date(dt * 1000);
    };
    
    $scope.backgroundImage = function(){
        //code goes here 
    }
    
}]);