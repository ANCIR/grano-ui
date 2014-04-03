
function ImportIndexCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, core, session) {

    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');

    $scope.uploadFile = function() {
        var d = $modal.open({
            templateUrl: 'dataimport/upload.html',
            controller: 'ImportUploadCtrl',
            resolve: {
                project: function() { return $scope.project; }
            }
        });
    };
}

ImportIndexCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', 'core', 'session'];


function ImportUploadCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modalInstance, $timeout, $upload, core, project) {
    $scope.file = null;
    $scope.uploadProgress = null;
    
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.upload = function() {
        $scope.uploadProgress = 1;
        $scope.upload = $upload.upload({
            url: core.call('/files'),
            data: {project: project.slug},
            file: $scope.file,
        }).progress(function(evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
            $modalInstance.dismiss('ok');
            $location.search({'file': data.id});
            $location.path('/p/' + project.slug + '/import/modes');
            $scope.uploadProgress = null;
        });
    };

    $scope.onFileSelect = function($files) {
        if ($files.length > 0) {
            $scope.file = $files[0];
        };
    };
}

ImportUploadCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modalInstance', '$timeout', '$upload', 'core', 'project'];


function ImportModesCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, core, session) {

    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');

    $scope.data = {mode: null};

    $scope.uploadFile = function() {
        var d = $modal.open({
            templateUrl: 'dataimport/upload.html',
            controller: 'ImportUploadCtrl',
            resolve: {
                project: function() { return $scope.project; }
            }
        });
    };

    $scope.defineMapping = function() {
        $location.search({'file': $location.search().file, 'mode': $scope.data.mode});
        $location.path('/p/' + $scope.project.slug + '/import/mapping');
    };
}

ImportModesCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', 'core', 'session'];


function ImportMappingCtrl($scope, $rootScope, $routeParams, $location, $http,
    $modal, $timeout, core, session) {

    $scope.loadProject($routeParams.slug);
    $scope.setSection('import');

}

ImportMappingCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    '$modal', '$timeout', 'core', 'session'];
