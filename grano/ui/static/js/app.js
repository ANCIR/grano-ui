var grano = angular.module('grano', ['ngRoute', 'ngAnimate', 'ngSanitize', 'angularFileUpload', 'ui.bootstrap', 'grano.config']);

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

  $routeProvider.when('/p/:slug/query', {
    templateUrl: 'query.html',
    controller: QueryCtrl,
    reloadOnSearch: false
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
  });

  $routeProvider.when('/p/:slug/entities/new', {
    templateUrl: 'entities/edit.html',
    controller: EntitiesEditCtrl
  });

  $routeProvider.when('/p/:slug/entities/:id', {
    templateUrl: 'entities/view.html',
    controller: EntitiesViewCtrl
  });

  $routeProvider.when('/p/:slug/entities/:id/edit', {
    templateUrl: 'entities/edit.html',
    controller: EntitiesEditCtrl
  });

  $routeProvider.when('/p/:slug/relations/new', {
    templateUrl: 'relations/edit.html',
    controller: RelationsEditCtrl
  });

  $routeProvider.when('/p/:slug/relations/:id', {
    templateUrl: 'relations/view.html',
    controller: RelationsViewCtrl
  });

  $routeProvider.when('/p/:slug/relations/:id/edit', {
    templateUrl: 'relations/edit.html',
    controller: RelationsEditCtrl
  });

  $routeProvider.when('/p/:slug/import', {
    templateUrl: 'imports/index.html',
    controller: ImportIndexCtrl
  });

  $routeProvider.when('/p/:slug/import/modes', {
    templateUrl: 'imports/modes.html',
    controller: ImportModesCtrl
  });

  $routeProvider.when('/p/:slug/import/mapping', {
    templateUrl: 'imports/mapping.html',
    controller: ImportMappingCtrl
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(false);
}]);
