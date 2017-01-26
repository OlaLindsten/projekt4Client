
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

module.controller("homeCtrl", function ($scope, recipeService, $rootScope) {
    var promise = recipeService.getRecipe();
    console.log("hej");
    promise.then(function (data) {
        $scope.recipes = data.data;
        console.log(data.data);
        console.log("hej2");
    });


    $scope.deleteRecipe = function (id, author) {
        if ($rootScope.user === author) {
            return recipeService.deleteRecipe(id);
        } else {
            alert("inte ditt recept");
            console.log(author);
        }
    };
});

module.controller("viewRecipeCtrl", function ($scope, $stateParams, recipeService) {
    console.log($stateParams.id);
    var promise = recipeService.getRecipeId($stateParams.id);
    promise.then(function (data) {
        $scope.recipe = data.data;
        console.log($scope.recipe);
    });

    var promise2 = recipeService.getRecipeIngredients($stateParams.id);
    promise2.then(function (data) {
        console.log("hejsn inge");
        console.log(data.data);
        $scope.ingredients = data.data;
    });

});

module.controller("addRecipeCtrl", function ($scope, $rootScope, recipeService) {

    recipeService.getRecipe().then(function (data) {
        $scope.recipe = data.data;
        console.log(data.data);
        console.log("hejsan");
    });

    var promise = recipeService.getCategory();
    promise.then(function (data) {
        $scope.category = data.data;

        console.log("tjabba");
    });

    $scope.addRecipe = function () {
        console.log("name"+$scope.rec_name);
        console.log("description"+$scope.rec_desc);
        console.log("instruktion"+$scope.rec_inst);
        console.log("author"+$scope.rec_aut);
        console.log("category"+$scope.rec_cat);
        console.log("img"+$scope.rec_img);
        recipeService.addRecipe($scope.rec_name, $scope.rec_desc, $scope.rec_inst, Number($scope.rec_aut), $scope.category, $scope.rec_img);
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

    this.getRecipeIngredients = function (id) {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/ingredients/" + id;
        $http.get(url).then(function (data) {
            deffer.resolve(data);
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

    this.getCategory = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/projekt4/webresources/category";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
            console.log(data);

        });
        return deffer.promise;
    };

    this.addRecipe = function (rec_name, rec_desc, rec_inst, $scope, rec_img) {
        var data = {
            recipe_name: rec_name,
            recipe_description: rec_desc,
            recipe_instruction: rec_inst,
            recipe_author: $rootScope.user,
            category_name: $scope.category,
            image: rec_img
            
        };
        
        console.log($scope.category);

        var url = "http://localhost:8080/projekt4/webresources/recipe";
        console.log(rec_name);
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);

        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Recept tillagd");
        }), (function (data) {
            console.log("Det blev fel");
            console.log(data);
        });
        console.log($rootScope.user);
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

    this.deleteRecipe = function (id, author) {
        var url = "http://localhost:8080/projekt4/webresources/recipe/" + id;

        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        console.log(auth);
        console.log(url);
        console.log("bajs");
        $http({
            url: url,
            method: "DELETE",
            headers: {'Authorization': auth}

        }).then(function (data) {
            console.log("Receipe borttagen");
            alert("recipe Deleted");
        }).error(function (data) {
            console.log("det blev fel");
            alert("It is not your recipe");
        });
        console.log("bajs");
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