grano.directive('gnEntityPreview', ['core', '$http', 'schemata', function (core, $http, schemata) {
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
