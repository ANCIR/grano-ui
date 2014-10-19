
function ProjectsViewCtrl($scope, $routeParams, $location) {
    $location.path('/p/' + $routeParams.slug + '/entities');
}

ProjectsViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core'];


function ProjectsNewCtrl($scope, $routeParams, $modalInstance, $location, $http, core, session) {
    $scope.project = {};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.create = function(form) {
        var res = $http.post(core.call('/projects'), $scope.project);
        session.reset();
        res.success(function(data) {
            $location.path('/p/' + data.slug);
            $modalInstance.dismiss('ok');
        });
        res.error(grano.handleFormError(form));
    };
}

ProjectsNewCtrl.$inject = ['$scope', '$routeParams', '$modalInstance', '$location', '$http', 'core', 'session'];


function ProjectsEditCtrl($scope, $route, $routeParams, $location, $http, $modal, metadata, core) {
    $scope.loadProject($routeParams.slug);

    $scope.update = function(form) {
        var res = $http.post(core.call('/projects/' + $scope.project.slug), $scope.project);
        res.success(function(data) {
            metadata.reset();
            $location.path('/p/' + $routeParams.slug);
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

    $scope.truncateProject = function() {
        var d = $modal.open({
            templateUrl: 'projects/truncate.html',
            controller: 'ProjectsTruncateCtrl',
            resolve: {
                project: function () { return $scope.project; }
            }
        });
    }
}

ProjectsEditCtrl.$inject = ['$scope', '$route', '$routeParams', '$location', '$http', '$modal', 'metadata', 'core'];


function ProjectsDeleteCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, metadata, project) {
    $scope.project = project;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function() {
        var res = $http.delete($scope.project.api_url);
        res.error(function(data) {
            metadata.reset();
            $location.path('/');
            $modalInstance.dismiss('ok');
        });
    };
}

ProjectsDeleteCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'metadata', 'project'];


function ProjectsTruncateCtrl($scope, $routeParams, $location, $http, $route, $modal, $modalInstance, metadata, project) {
    $scope.project = project;

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.truncate = function() {
        var res = $http.delete($scope.project.api_url + '/_truncate');
        res.then(function(data) {
            metadata.reset();
            $location.path('/#/' + project.slug);
            $modalInstance.dismiss('ok');
        });
    };
}

ProjectsTruncateCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$route', '$modal', '$modalInstance', 'metadata', 'project'];
