function AppCtrl($scope, $window, $routeParams, $location, $modal, session, core, config) {
    $scope.session = {logged_in: false};
    $scope.config = config
    
    core.setTitle('Welcome');

    session.get(function(data) {
        $scope.session = data;
    });

    $scope.showAccount = function() {
        var d = $modal.open({
            templateUrl: 'account.html',
            controller: 'AccountCtrl',
            backdrop: false
        });
    };
}

AppCtrl.$inject = ['$scope', '$window', '$routeParams', '$location', '$modal', 'session', 'core', 'config'];
