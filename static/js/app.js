var grano = angular.module('grano', ['ngRoute', 'ngAnimate', 'ngSanitize', 'datePicker', 'ui.bootstrap', 'grano.config']);

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

  $routeProvider.when('/p/:slug/schemata/new/:obj', {
    templateUrl: 'schemata/view.html',
    controller: SchemataViewCtrl
  });

  $routeProvider.when('/p/:slug/schemata/:name', {
    templateUrl: 'schemata/view.html',
    controller: SchemataViewCtrl
  });

  $routeProvider.when('/p/:slug/permissions', {
    templateUrl: 'permissions/index.html',
    controller: PermissionsIndexCtrl
  });

  $routeProvider.when('/p/:slug/entities', {
    templateUrl: 'entities/index.html',
    controller: EntitiesIndexCtrl,
    reloadOnSearch: false
  });

  $routeProvider.when('/p/:slug/entities/new', {
    templateUrl: 'entities/new.html',
    controller: EntitiesNewCtrl
  });

  $routeProvider.when('/p/:slug/entities/:id', {
    templateUrl: 'entities/view.html',
    controller: EntitiesViewCtrl
  });

  $routeProvider.when('/p/:slug/relations/:id', {
    templateUrl: 'relations/view.html',
    controller: RelationsViewCtrl
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(false);
}]);
