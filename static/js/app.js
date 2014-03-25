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

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(false);
}]);
