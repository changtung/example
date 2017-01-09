'use strict';

/**
 * @ngdoc function
 * @name callPalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the callPalApp
 */
angular.module('callPalApp')
  .controller('MainCtrl', function ($scope,$state,principal) {
      $scope.principal = principal;
      $scope.signout = function() {
            principal.authenticate(null);
            $state.go('signin');
        };
  });
