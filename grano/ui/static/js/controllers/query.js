
function QueryCtrl($scope, $routeParams, $http, $q, metadata, queryState) {
  $scope.loadProject($routeParams.slug);

  var allSchemata = [];
  metadata.getSchemata(function(schemata) {
    allSchemata = schemata;
  });

  $scope.loading = false;

  $scope.$on('querySend', function() {
    $scope.loading = true;
  });

  $scope.$on('queryUpdate', function(event, result) {
    $scope.loading = false;
  });

  queryState.init();
  queryState.sync();
};

QueryCtrl.$inject = ['$scope', '$routeParams', '$http', '$q', 'metadata', 'queryState'];
