'use strict';
angular.module('callPalApp')
.factory('backend',function($http,$q,principal) {
    return {
      signin: function(username,password) {
          var deferred = $q.defer();

          $http.get('/api/signin', {data: {
            username: username,
            password: password
        }}).then(function(result) {
            var userInfo = {
              username: result.data.username
            };
            deferred.resolve(userInfo);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      },
      signup: function(username,password) {
          var deferred = $q.defer();

          $http.post('/api/signup', {
            username: username,
            password: password
        }).then(function(result) {
            var userInfo = {
              username: result.data.username
            };
            deferred.resolve(userInfo);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
    },
    deleteDevice: function(id) {
        var deferred = $q.defer();

        $http.post('/api/deleteDevice', {
          id: id
      }).then(function(result) {
          var deviceInfo = {
            id: result.data.id
          };
          deferred.resolve(deviceInfo);
        }, function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
  },
  getDevice: function(id) {
      var deferred = $q.defer();

      $http.get('/api/device', {data:{
        id: id
    }}).then(function(result) {
        var device = result.data;
        deferred.resolve(device);
      }, function(error) {
        deferred.reject(error);
      });
    return deferred.promise;
},
  devices: function() {
      var username = principal.identity().username;
      var deferred = $q.defer();

      $http.get('/api/devices',{data: {username: username}})
      .then(function(result) {
        var deviceInfo = result.data;
        deferred.resolve(deviceInfo);
      }, function(error) {
        deferred.reject(error);
      });
    return deferred.promise;
},
device: function(device) {
    var username = principal.identity().username;
    var deferred = $q.defer();

    $http.post('/api/device', {
      device: device,
      username: username
  }).then(function(result) {
      var deviceInfo = result.data;
      deferred.resolve(deviceInfo);
    }, function(error) {
      deferred.reject(error);
    });
  return deferred.promise;
},
  };
  });
