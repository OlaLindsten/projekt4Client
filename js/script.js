
var module = angular.module("projekt4", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    });
});

module.controller("homeCtrl", function ($scope, $rootScope, recipeService) {
    var promise = recipeService.getRecipe();
    promise.then(function (data) {
        $scope.recipe = data.data;
    });
});

module.service("recipeService", function ($q, $http, $rootScope) {
    this.getRecipe = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/recipes";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);

        $http({
            url: url,
            method: "GET",
            headers: {'Authorization': auth}
        }).then(function (data, status) {
            deffer.resolve(data);
        });
        return deffer.promise;
  };
  });
  
  module.controller("logInCtrl", function ($scope, $rootScope, recipeService) {
      
      $scope.createUser = function (){
          recipeService.createUser($scope.username, $scope.password);
      };
  });
  
  module.service("recipeService", function ($q, $http, $rootScope) {
    this.createUser = function (username, password) {
        
        var data ={
            username: username,
            password: password
        };
            
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/user";
        
        $http({
            url: url,
            method: "POST",
            data: data
        }).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
  };
  });