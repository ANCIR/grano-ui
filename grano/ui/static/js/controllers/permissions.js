
function PermissionsIndexCtrl($scope, $routeParams, $location, $http, $modal, $q, $timeout, core, session) {
    $scope.loadProject($routeParams.slug);
    $scope.url = core.call('/projects/'+$routeParams.slug+'/permissions');

    $scope.permissions = {};
    $scope.newPermission = {'reader': true, 'editor': true};

    $scope.loadPermissions = function(url) {
        $http.get(url).then(function(res) {
            $scope.url = url;
            $scope.permissions = res.data;
        });
    };

    $scope.save = function(permission) {
        if (!permission.reader) permission.editor = false;
        if (!permission.editor) permission.admin = false;
        var res = $http.post(permission.api_url, permission);
        res.then(function(res) {
            permission.reader = res.data.reader;
            permission.editor = res.data.editor;
            permission.admin = res.data.admin;
        });
    };

    $scope.sanify = function() {
        if ($scope.newPermission.admin) $scope.newPermission.editor = true;
        if ($scope.newPermission.editor) $scope.newPermission.reader = true;
    };

    $scope.create = function() {
        if (!$scope.canCreate()) {
            return;
        }

        var url = core.call('/projects/' + $routeParams.slug + '/permissions'),
            res = $http.post(url, $scope.newPermission);

        $scope.newPermission = {'reader': true};
        res.then(function(res) {
            $scope.loadPermissions($scope.url);
        });
    };

    $scope.canCreate = function() {
        return $scope.newPermission.account;
    }

    $scope.loadAccounts = function(query) {
        var params = {params: {q: query, exclude: []}};
        angular.forEach($scope.permissions.results, function(perm) {
            params.params.exclude.push(perm.account.id);
        });
        var res = $http.get(core.call('/accounts/_suggest'), params);
        return res.then(function(res) {
            return res.data.results;
        });
    };

    $scope.loadPermissions($scope.url);
}

PermissionsIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$q', '$timeout', 'core', 'session'];
