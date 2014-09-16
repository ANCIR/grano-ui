
function QueryCtrl($scope, $timeout, $routeParams, $location, $http, core, metadata) {
  $scope.loadProject($routeParams.slug);
  $scope.loading = true;
  $scope.showPanel = true;

  var queries = {},
      defaultQuery = [{
        'id': null,
        'degree': null,
        'schema': null,
        'properties': {'name': null}
      }];

  $scope.$on('querySet', function(event, name, query) {
    if (!angular.equals(query, queries[name])) {
      queries[name] = query;
      $location.search('queries', angular.toJson(queries));
      var params = {'query': angular.toJson(query)};
      $timeout(function() {
        $scope.$broadcast('queryUpdate', name, query);  
      });
      $scope.loading = true;
      var res = $http.get(core.call('/projects/' + $routeParams.slug + '/query'), {'params': params});
      res.then(function(rd) {
        $scope.$broadcast('queryResult', name, rd.data);
        $scope.loading = false;
      });
    }
  });

  $scope.setMode = function(modeName) {
    $scope.mode = modeName || 'graph';
    $location.search('mode', $scope.mode);
    $scope.$broadcast('queryMode', $scope.mode);  
  }
  
  var init = function() {
    var search = $location.search();
    $scope.setMode(search.mode);

    if (!search.queries) {
      $scope.$broadcast('querySet', 'root', defaultQuery);
    } else {
      var qs = angular.fromJson(search.queries);
      angular.forEach(qs, function(v, k) {
        $scope.$broadcast('querySet', k, v);
      });
    }
  };

  init();
};

QueryCtrl.$inject = ['$scope', '$timeout', '$routeParams', '$location', '$http', 'core', 'metadata'];
