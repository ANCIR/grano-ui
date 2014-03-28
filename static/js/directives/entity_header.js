grano.directive('gnEntityHeader', ['core', '$http', '$route', '$location', '$modal', 'core', 'config', 'schemata',
    function (core, $http, $route, $location, $modal, core, config, schemata) {
    return {
        restrict: 'AE',
        scope: {
            'entity': '='
        },
        templateUrl: 'entities/header.html',
        link: function (scope, element, attrs, model) {
            scope.config = config;

            scope.deleteEntity = function() {
                var d = $modal.open({
                    templateUrl: 'entities/delete.html',
                    controller: 'EntitiesDeleteCtrl',
                    resolve: {
                        entity: function () { return scope.entity; }
                    }
                });
            };

            scope.$watch('entity', function(e) {
                if (!e || !e.project) return;
                scope.project = e.project;
            });
        }
    };
}]);
