
function EntitiesIndexCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    var params = {project: $routeParams.slug, 'limit': 25},
        filterTimeout = null;

    $scope.navSection = 'entities';
    $scope.query = {value: $location.search().q};
    $scope.project = {};
    $scope.entities = {};
    $scope.previewEntity = null;
    
    $http.get(core.call('/projects/' + $routeParams.slug)).then(function(res) {
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
        if (fparams.schema) {
        //    fparams['filter-schemata.name'] = fparams.schema;
            $scope.navSection = 'entities.' + fparams.schema;
        } else {
            $scope.navSection = 'entities';
        }
        $scope.loadEntities(core.call('/entities', fparams));
    }

    $scope.loadEntities = function(url, params) {
        $scope.showEntityPreview(null);
        $http.get(url, {params: params}).then(function(res) {
            $scope.entities = res.data;
        });
    };

    $scope.showEntityPreview = function(entity) {
        if (entity && $scope.previewEntity != null && $scope.previewEntity.id == entity.id) {
            $scope.previewEntity = null;
            $location.search('preview', null);
            core.setTitle($scope.project.label);
            return;
        }
        if (entity && $location.search().preview != entity.id) {
            $location.search('preview', entity.id);        
        }
        $scope.previewEntity = entity;
    };

    $scope.updateSearch();

    if ($location.search().preview) {
        $scope.showEntityPreview({'id': $location.search().preview});
    }
}

EntitiesIndexCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];


function EntitiesViewCtrl($scope, $routeParams, $location, $http, $modal, $timeout, core, session) {
    $scope.navSection = 'entities';

    $scope.project = {};
    $scope.entity = {};
    
    $http.get(core.call('/projects/' + $routeParams.slug)).then(function(res) {
        $scope.project = res.data;
    });

    $http.get(core.call('/entities/' + $routeParams.id)).then(function(res) {
        $scope.entity = res.data;
        $scope.json = JSON.stringify(res.data, null, "  ");
        core.setTitle(res.data.properties.name.value);
    });
}

EntitiesViewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal', '$timeout', 'core', 'session'];
