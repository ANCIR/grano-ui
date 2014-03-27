grano.directive('gnEntityPreview', ['core', '$http', '$route', '$location', '$modal', 'schemata',
    function (core, $http, $route, $location, $modal, schemata) {
    return {
        restrict: 'E',
        scope: {
            'preview': '=',
            'project': '='
        },
        templateUrl: 'entities/preview.html',
        link: function (scope, element, attrs, model) {
            scope.entity = {};
            scope.attributes = {};
            scope.inbound = {};
            scope.outbound = {};

            scope.previewNext = function(entity) {
                $location.search('preview', entity.id);
                $route.reload();
            };

            scope.loadInbound = function(url) {
                $http.get(url).then(function(res) {
                    scope.inbound = res.data;
                });
            };

            scope.loadOutbound = function(url) {
                $http.get(url).then(function(res) {
                    scope.outbound = res.data;
                });
            };

            scope.editProperty = function(attribute) {
                var d = $modal.open({
                    templateUrl: 'properties/edit.html',
                    controller: 'PropertiesEditCtrl',
                    backdrop: false,
                    resolve: {
                        obj: function () { return scope.entity; },
                        attribute: function () { return attribute; }
                    }
                });
            };

            scope.$watch('preview', function(e) {
                if (!e || !e.id) return;
                scope.entity = e;
                
                // check for the full REST:
                if (!e.created_at) {
                    $http.get('/api/1/entities/' + e.id).then(function(res) {
                        scope.entity = res.data;
                        core.setTitle(scope.entity.properties.name.value);
                    });
                }

                scope.loadInbound('/api/1/relations?target=' + e.id);
                scope.loadOutbound('/api/1/relations?source=' + e.id);
            });

            scope.$watch('project', function(p) {
                if (!p || !p.slug) return;
                schemata.attributes(p.slug, 'entity').then(function(attributes) {
                    scope.attributes = attributes;
                });
            });
        }
    };
}]);
