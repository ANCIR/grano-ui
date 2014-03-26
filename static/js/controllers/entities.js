
function EntitiesIndexCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    var params = {project: $routeParams.slug, 'limit': 25},
        filterTimeout = null;

    $scope.navSection = 'entities';
    $scope.query = {value: ''};
    $scope.project = {};
    $scope.entities = {};
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
        core.setTitle($scope.project.label);
    });

    $scope.updateFilter = function() {
        if (filterTimeout) {
            $timeout.cancel(filterTimeout);
        }

        filterTimeout = $timeout(function() {
            $location.search('q', $scope.query.value);
            $scope.updateSearch();
        }, 500);
    };

    $scope.updateSearch = function() {
        var fparams = angular.copy(params);
        angular.extend(fparams, $location.search());
        if (fparams.q) {
            fparams.q += '*';
        }
        $scope.loadEntities('/api/1/entities/_search', fparams);
    }

    $scope.loadEntities = function(url, params) {
        $http.get(url, {params: params}).then(function(res) {
            $scope.entities = res.data;
        });
    };

    $scope.updateSearch();
}

EntitiesIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function EntitiesViewCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    $scope.navSection = 'entities';

    $scope.project = {};
    $scope.entity = {};
    
    $http.get('/api/1/projects/' + $routeParams.slug).then(function(res) {
        $scope.project = res.data;
    });

    $http.get('/api/1/entities/' + $routeParams.id).then(function(res) {
        $scope.entity = res.data;
        $scope.json = JSON.stringify(res.data, null, "  ");
        core.setTitle(res.data.properties.name.value);
    });
}

EntitiesViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];
