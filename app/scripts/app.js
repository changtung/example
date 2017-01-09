'use strict';

/**
 * @ngdoc overview
 * @name callPalApp
 * @description
 * # callPalApp
 *
 * Main module of the application.
 */
angular
  .module('callPalApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMockE2E',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
      //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");
    //
    // Now set up the states
    $stateProvider
    .state('home', {
      url: "/home",
      data: {
          roles: ["User"]
        },
      templateUrl: "views/partials/devices.html",
      resolve: {
  authorize: ['authorization',
    function(authorization) {
      return authorization.authorize();
    }
  ]
}
    })
    .state('signin', {
      url: "/signin",
      data: {
          roles: []
        },
      controller:"LoginCtrl",
      templateUrl: "views/partials/signin.html"
    })
    .state('signup', {
      url: "/signup",
      data: {
          roles: []
        },
      controller: "LoginCtrl",
      templateUrl: "views/partials/signup.html"
    })
    .state('success', {
      url: "/success",
      data: {
          roles: []
        },
      templateUrl: "views/partials/success.html"
    })
    .state('accessdenied', {
      url: "/accessdenied",
      data: {
          roles: []
        },
      templateUrl: "views/partials/accessdenied.html"
    })
      .state('devices', {
        url: "/devices",
        templateUrl: "views/partials/devices.html",
        data: {
          roles: ['User']
        },
        resolve: {
    authorize: ['authorization',
      function(authorization) {
        return authorization.authorize();
      }
    ]
  }
      })
      .state('create', {
        url: "/create",
        templateUrl: "views/partials/create.html",
        data: {
          roles: ['User']
        },
        controller: 'DevicesCtrl',
        resolve: {
    authorize: ['authorization',
      function(authorization) {
        return authorization.authorize();
      }
    ]
  }
      })
      .state('edit', {
        url: "/edit/:ID",
        templateUrl: "views/partials/edit.html",
        data: {
          roles: ['User']
        },
        controller: 'DevicesCtrl',
        resolve: {
    authorize: ['authorization',
      function(authorization) {
        return authorization.authorize();
      }
    ]
  }
      })
      .state('devices.list', {
        url: "/list",
        templateUrl: "views/partials/devices.list.html",
        controller: 'DevicesCtrl'
    });
  }).run(function($rootScope, $location,$httpBackend,$state, $stateParams, authorization, principal) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
             // track the state the user wants to go to; authorization service needs this
             $rootScope.toState = toState;
             $rootScope.toStateParams = toStateParams;
             // if the principal is resolved, do an authorization check immediately. otherwise,
             // it'll be done when the state it resolved.
             if (principal.isIdentityResolved()) authorization.authorize();
           });
      //mockup backend
      var lib = new localStorageDB("library534534", localStorage);

      // Check if the database was just created. Useful for initial database setup
      if( lib.isNew() ) {

          // create the "books" table
          lib.createTable("devices", ["manufacturer", "bios", "type","user_id"]);
          lib.createTable("users", ["username", "password"]);

          // commit the database to localStorage
          // all create/drop/insert/update/delete operations should be committed
          lib.commit();
      }

      //mock backend
      $httpBackend.whenGET(/^views\//).passThrough();

      $httpBackend.whenPOST('/api/signup').respond(function(method, url, data) {
          var user = angular.fromJson(data);
          lib.insert("users",user);
          lib.commit();
          return [200, user, {}];
        });

        $httpBackend.whenGET('/api/signin').respond(function(method, url, data) {
            var user = angular.fromJson(data);


            var us = lib.queryAll("users", {
                  query: {username: user.username, password: user.password}
              });
            if ( us.length > 0 )
              return [200, us[0], {}];
            else
              return [400, {error: 'not authenticated'}, {}];
          });
          $httpBackend.whenGET('/api/device').respond(function(method, url, data) {
              var device = angular.fromJson(data);


              var d = lib.queryAll("devices", {
                    query: {ID: device.id}
                });
                return [200, d[0], {}];
            });
      $httpBackend.whenGET('/api/devices').respond(function(method, url, data) {
          var data = angular.fromJson(data);

          var us = lib.queryAll("users", {
                query: {username: data.username}
            });
          var d = lib.queryAll("devices", {
                query: {user_id: us[0].ID}
            });
            var q = lib.queryAll("devices", {

              });

            return [200, d, {}];
        });

        $httpBackend.whenPOST('/api/device').respond(function(method, url, data) {
            var data = angular.fromJson(data);

            var us = lib.queryAll("users", {
                  query: {username: data.username}
              });

            data.device.user_id = us[0].ID;
            var device = data.device;
            console.log('data',data);
            if ( device.ID != null )//edit
            {
                lib.update("devices", {ID: device.ID}, function(row) {
                    row.manufacturer = device.manufacturer;
                    row.bios = device.bios;
                    row.type = device.type;
                    row.user_id = device.user_id;
                    // the update callback function returns to the modified record
                    return row;
                });

            }
            else{
                lib.insert("devices", device);
            }
            lib.commit();
              return [200, data, {}];
          });
          $httpBackend.whenPOST('/api/deleteDevice').respond(function(method, url, data) {
              var data = angular.fromJson(data);

              lib.deleteRows("devices", {ID: data.id});
              lib.commit();
              return [200, data, {}];
            });
  });
