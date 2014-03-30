
function ProjectsViewCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    $scope.setSection('project');
    $scope.loadProject($routeParams.slug);
}

ProjectsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function ProjectsNewCtrl($scope, $routeParams, $modalInstance, $location, $http, core, session) {
    $scope.project = {};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.create = function(form) {
        var res = $http.post(core.call('/projects'), $scope.project);
        res.success(function(data) {
            $location.path('/p/' + data.slug);
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };
}

ProjectsNewCtrl.$inject = ['$scope', '$routeParams', '$modalInstance', '$location', '$http', 'core', 'session'];


function ProjectsEditCtrl($scope, $route, $routeParams, $location, $http, $modal, core) {
    $scope.setSection('settings');
    $scope.loadProject($routeParams.slug);

    $scope.update = function(form) {
        var res = $http.post(core.call('/projects/' + $scope.project.slug), $scope.project);
        res.success(function(data) {
            $route.reload();
        });
        res.error(grano.handleFormError(form));
    };

    $scope.deleteProject = function() {
        var d = $modal.open({
            templateUrl: 'projects/delete.html',
            controller: 'ProjectsDeleteCtrl',
            resolve: {
                project: function () { return $scope.project; }
            }
        });
    }
}

ProjectsEditCtrl.$inject = ['$scope', '$route', '$routeParams', '$location', '$http', '$modal', 'core'];


function ProjectsDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, project) {
    $scope.project = project;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var res = $http.delete($scope.project.api_url);
        res.error(function(data) {
            $location.path('/');
            $modalInstance.dismiss('ok');
        });
    };
}

ProjectsDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'project'];
