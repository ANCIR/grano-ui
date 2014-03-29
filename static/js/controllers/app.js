function AppCtrl($scope, $window, $routeParams, $location, $modal, $http, session, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config
    
    core.setTitle('Welcome');

    $scope.loadProject = function(slug) {
        $scope.project = false;
        if (slug) {
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

AppCtrl.$inject = ['$scope', '$window', '$routeParams', '$location', '$modal', '$http', 'session', 'core', 'config'];
