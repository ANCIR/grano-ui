function AppCtrl($scope, $window, $routeParams, $location, $modal, $http,
        $route, session, schemata, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config;
    $scope.project = false;
    $scope.navQuery = '';

    core.setTitle('Welcome');

    $scope.searchEntities = function() {
        $location.path('/p/' + $routeParams.slug + '/entities');
        $location.search('q', $scope.navQuery);
    };

    $scope.loadProject = function(slug) {
        if (!slug) {
          $scope.project = false;
          return;
        }
        $scope.navQuery = $location.search()['q'];
        if (!$scope.project || $scope.project.slug != slug) {
          var url = core.call('/projects/' + $routeParams.slug);
          $http.get(url).then(function(res) {
              $scope.project = res.data;
              core.setTitle($scope.project.label);
          });
        }
    };

    session.get(function(data) {
        $scope.session = data;
    });

    $scope.showAccount = function() {
        var d = $modal.open({
            templateUrl: 'account.html',
            controller: 'AccountCtrl'
        });
    };
}

AppCtrl.$inject = ['$scope', '$window', '$routeParams', '$location', '$modal',
    '$http', '$route', 'session', 'schemata', 'core', 'config'];
