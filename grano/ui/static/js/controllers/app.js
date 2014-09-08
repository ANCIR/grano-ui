function AppCtrl($scope, $window, $routeParams, $location, $modal, $http,
        $route, session, metadata, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config;
    $scope.project = false;
    $scope.navQuery = '';

    $scope.searchEntities = function() {
        $location.path('/p/' + $routeParams.slug + '/entities');
        $location.search('q', $scope.navQuery);
    };

    $scope.$on('setProject', function(event, project) {
      $scope.project = project;
    });

    $scope.loadProject = function(slug) {
      metadata.setProject(slug);
      $scope.navQuery = $location.search()['q'];
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
    '$http', '$route', 'session', 'metadata', 'core', 'config'];
