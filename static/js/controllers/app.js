function AppCtrl($scope, $window, $routeParams, $location, $modal, session, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config
    
    core.setTitle('Welcome');

    session.get(function(data) {
        $scope.session = data;
    });

    $scope.showAccount = function() {
        var d = $modal.open({
            templateUrl: '/static/templates/account.html',
            controller: 'AccountCtrl'
        });
    };
}

AppCtrl.$inject = ['$scope', '$window', '$routeParams', '$location', '$modal', 'session', 'core', 'config'];
