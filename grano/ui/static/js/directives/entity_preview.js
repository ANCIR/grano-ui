grano.directive('gnEntityPreview', ['core', '$http', '$route', '$location', '$modal', 'core', 'config', 'metadata',
    function (core, $http, $route, $location, $modal, core, config, metadata) {
    return {
        restrict: 'E',
        scope: {
            'preview': '=',
            'project': '='
        },
        templateUrl: 'entities/preview.html',
        link: function (scope, element, attrs, model) {
            //scope.config = config;
            scope.entity = {};

            scope.reloadEntity = function(id) {
                $http.get(core.call('/entities/' + id)).then(function(res) {
                    scope.entity = res.data;
                    core.setTitle(scope.entity.properties.name.value);
                });
            };

            scope.deleteEntity = function() {
                var d = $modal.open({
                    templateUrl: 'entities/delete.html',
                    controller: 'EntitiesDeleteCtrl',
                    resolve: {
                        entity: function () { return scope.entity; }
                    }
                });
            };

            scope.$watch('preview', function(e) {
                if (!e || !e.id) return;
                scope.entity = e;
                
                // check for the full REST:
                if (!e.created_at) {
                    scope.reloadEntity(e.id);
                }
            });

            scope.$watch('project', function(p) {
                if (!p || !p.slug) return;
                metadata.getAttributes('entity').then(function(attributes) {
                    scope.attributes = attributes;
                });
            });
        }
    };
}]);
