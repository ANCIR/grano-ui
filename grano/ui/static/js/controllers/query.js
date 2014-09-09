
function QueryCtrl($scope, $routeParams, $http, $q, metadata, queryState) {
  $scope.loadProject($routeParams.slug);

  var allSchemata = [];
  metadata.getSchemata(function(schemata) {
    allSchemata = schemata;
  });

  $scope.loading = false;
  $scope.objects = queryState.objects;

  $scope.$on('querySend', function() {
    $scope.loading = true;
  });

  $scope.$on('queryUpdate', function(event, result) {
    $scope.loading = false;
  });

  $scope.getFieldAttribute = function(field, type) {
    var attribute = {'label': field.name};
    field.type = field.type || type;
    angular.forEach(allSchemata, function(s) {
      if (s.obj == field.type && s.name == field.schema) {
        angular.forEach(s.attributes, function(a) {
          if (a.name == field.name) attribute = a;
        });
      }
    });
    return attribute;
  };
  
  queryState.init();
  queryState.sync();
};

QueryCtrl.$inject = ['$scope', '$routeParams', '$http', '$q', 'metadata', 'queryState'];
