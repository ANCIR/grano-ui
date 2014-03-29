function AppCtrl($scope, $window, $routeParams, $location, $modal, $http,
        $route, session, schemata, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config;
    $scope.navSection = 'project';

    
    core.setTitle('Welcome');

    $scope.loadProject = function(slug) {
        $scope.project = false;
        $scope.frameSchemata = [];
        if (!slug) return;
    
        var url = core.call('/projects/' + $routeParams.slug);
        $http.get(url).then(function(res) {
            $scope.project = res.data;
            //$rootScope.project = res.data;
            core.setTitle($scope.project.label);
        });
    };

    $scope.setSection = function(section) {
        $scope.navSection = section;
    }

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
