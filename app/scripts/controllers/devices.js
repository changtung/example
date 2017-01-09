'use strict';

/**
 * @ngdoc function
 * @name callPalApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the callPalApp
 */
angular.module('callPalApp')
  .controller('DevicesCtrl', function ($scope,backend,$state,$stateParams) {

      $scope.delete = function(id){
          var prom = backend.deleteDevice(id);
          prom.then(function(result){
              $state.go('devices');
          })
      }
      $scope.create = function(params){
          var prom = backend.device(params);
          prom.then(function(result){
              $state.go('devices');
          })
      }
      $scope.update = function(params){
          console.log('params edit: ',params);
          var prom = backend.device(params);
          prom.then(function(result){
              $state.go('devices');
          })
      };
      $scope.devices = function(){
          var prom = backend.devices();
          prom.then(function(result){
              if ( result != undefined )
                $scope.items = result;
          })
      };
      $scope.getDevice = function(id){
          var prom = backend.getDevice(id);
          prom.then(function(result){
              if ( result != undefined )
                $scope.params = result;
          })
      }
      if ( $stateParams.ID != null ){
        $scope.getDevice($stateParams.ID);
    }
      else
        $scope.devices();
  });
