'use strict';

/**
 * @ngdoc function
 * @name callPalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the callPalApp
 */
angular.module('callPalApp')
  .controller('LoginCtrl', function ($scope,backend,principal,$state) {
    $scope.signin = function(params) {
    var prom = backend.signin(params.username,params.password);
    prom.then(function(result){
        principal.authenticate({
          name: result.username,
          roles: ['User']
        });
        $state.go('home');
    },function(error){
        //not authenticated
    });

    //if ($scope.returnToState) $state.go($scope.returnToState.name, $scope.returnToStateParams);
    //else $state.go('home');

    };
    $scope.signup = function(params){
        var prom = backend.signup(params.username,params.password);
        prom.then(function(result){
            $state.go('success');
        },function(error){
            //sign up error
        });
    }
  });
