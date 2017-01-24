
var module = angular.module("projekt4", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("addRecipe", {
        url: "/addRecipe",
        templateUrl: "templates/addRecipe.html",
        controller: "addRecipeCtrl"
    }).state("viewRecipe", {
        url: "/viewRecipe/:id",
        templateUrl: "templates/viewRecipe.html",
        controller: "viewRecipeCtrl"
    }).state("register", {
        url: "/register",
        templateUrl: "templates/register.html",
        controller: "registerCtrl"
    });
});

module.controller("homeCtrl", function ($scope, $rootScope, recipeService) {
    var promise = recipeService.getRecipe();
    console.log("hej");
    promise.then(function (data) {
        console.log("hej2");
        $scope.recipe = data.data;
        console.log(data.data);
    });
});

module.controller("viewRecipeCtrl", function ($scope, $stateParams, $rootScope, recipeService) {
    var promise = recipeService.getRecipeId($stateParams.id);
    promise.then(function (data) {
        $scope.recipe = data.data;
        console.log($scope.recipe);
    });
    var promise2 = recipeService.getIngredient();
    promise2.then(function (data) {
        $scope.ingredients = data.data;
        console.log(data.data);
    });


});

module.controller("addRecipeCtrl", function ($scope, $rootScope, recipeService, LoginService) {

    recipeService.getRecipe().then(function (data) {
        $scope.recipe = data.data;
        console.log(data.data);
    });

    $scope.loggIn = function () {
        LoginService.loggIn($scope.username, $scope.password);
    };

    $scope.addRecipe = function () {
        recipeService.addRecipe($scope.rec_name, $scope.rec_des, $scope.rec_ins, $scope.rec_cat);
    };
});

module.service("recipeService", function ($q, $http, $rootScope) {

    this.getRecipe = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/recipes";
        $http.get(url).then(function (data) {
            console.log("hej_!");
            deffer.resolve(data);
            console.log(data);

        });
        return deffer.promise;
    };

    this.getIngredient = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/ingredient";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
            console.log(data);

        });
        return deffer.promise;
    };

    this.getRecipeId = function (id) {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/recipe/" + id;
        console.log(url);
        $http({
            url: url,
            method: "GET",
            params: {id: id}
        }).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };

    this.addRecipe = function (rec_name, rec_des, rec_ins, rec_cat) {
        var data = {
            rec_name: recipe_name,
            rec_des: recipe_description,
            rec_ins: recipe_instruction,
            rec_cat: category_name

        };
        var url = "http://localhost:8080/projekt4/webresources/recipe";
        console.log(recipe_name);
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);

        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}
        }).then(function (data, status) {
            console.log("Recept tillagd");
        })
                .error(function (data, status) {
                    console.log("Det blev fel");
                    console.log(data, status);
                });
    };


    this.loggIn = function (username, password) {
        var url = "http://localhost:8080/projekt4/webresources/login";
        var auth = "Basic " + window.btoa(username + ":" + password);
        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': auth}

        }).then(function (data) {
            console.log("Du är inloggad!");
            $rootScope.isLoggedIn = true;
            $rootScope.user = username;
            $rootScope.pass = password;

        });

    };

    this.createUser = function (username, password) {
        var data = {
            username: username,
            password: password
        };
        var url = "http://localhost:8080/projekt4/webresources/user";

        $http({
            url: url,
            method: "POST",
            data: data
        }).then(function (data) {
            console.log("Användare tillagd, du kan nu logga in");
        }, function (data) {
            alert("Användare finns redan försök igen");
        });

    };

});

module.controller("logInCtrl", function ($scope, $rootScope, recipeService) {

    $scope.loggIn = function () {
        recipeService.loggIn($scope.username, $scope.password);
    };
});

module.controller("registerCtrl", function ($scope, recipeService) {
    $scope.createUser = function () {
        recipeService.createUser($scope.username, $scope.password);
    };
});