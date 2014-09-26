function AccountCtrl($scope, $location, $modalInstance, $http, core, session) {
    $scope.session = {logged_in: false};
    $scope.account = {};

    session.get(function(data) {
        $scope.session = data;
        $scope.account = data.account;
    });

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.update = function(form) {
        var res = $http.post(core.call('/accounts/' + $scope.account.id),
            $scope.account);
        res.success(function(data) {
            $scope.account = data;
            $scope.session.account = data;
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };
    
}

AccountCtrl.$inject = ['$scope', '$location', '$modalInstance', '$http', 'core', 'session'];
