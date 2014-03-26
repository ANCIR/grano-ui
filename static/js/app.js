var grano = angular.module('grano', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'grano.config']);

grano.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: HomeCtrl
  });

  $routeProvider.when('/p/:slug', {
    templateUrl: 'projects/view.html',
    controller: ProjectsViewCtrl
  });

  $routeProvider.when('/p/:slug/settings', {
    templateUrl: 'projects/edit.html',
    controller: ProjectsEditCtrl
  });

  $routeProvider.when('/p/:slug/schemata', {
    templateUrl: 'schemata/index.html',
    controller: SchemataIndexCtrl
  });

  $routeProvider.when('/p/:slug/permissions', {
    templateUrl: 'permissions/index.html',
    controller: PermissionsIndexCtrl
  });

  $routeProvider.when('/p/:slug/entities', {
    templateUrl: 'entities/index.html',
    controller: EntitiesIndexCtrl
  });

  $routeProvider.when('/p/:slug/entities/:id', {
    templateUrl: 'entities/view.html',
    controller: EntitiesViewCtrl
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(false);
}]);
