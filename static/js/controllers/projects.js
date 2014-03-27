
function ProjectsViewCtrl($scope, $routeParams, $location, $http, $modal, $timeout, config, session) {
    $scope.navSection = 'project';
    $scope.project = {};
    
    $http.get(config.API_ROOT + '/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
    });
}

ProjectsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'config', 'session'];


function ProjectsNewCtrl($scope, $routeParams, $modalInstance, $location, $http, config, session) {
    $scope.project = {};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.create = function(form) {
        var res = $http.post(config.API_ROOT + '/projects', $scope.project);
        res.success(function(data) {
            $location.path('/p/' + data.slug);
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };
}

ProjectsNewCtrl.$inject = ['$scope', '$routeParams', '$modalInstance', '$location', '$http', 'session'];


function ProjectsEditCtrl($scope, $route, $routeParams, $location, $http, config, core) {
    $scope.navSection = 'settings';
    $scope.project = {};

    $http.get(config.API_ROOT + '/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
        core.setTitle($scope.project.label);
    });

    $scope.update = function(form) {
        var res = $http.post(config.API_ROOT + '/projects/' + $scope.project.slug, $scope.project);
        res.success(function(data) {
            $route.reload();
        });
        res.error(grano.handleFormError(form));
    };
}

ProjectsEditCtrl.$inject = ['$scope', '$route', '$routeParams', '$location', '$http', 'config', 'core'];
