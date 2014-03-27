grano.directive('gnEntityPreview', ['core', '$http', function (core, $http) {
    return {
        restrict: 'E',
        scope: {
            'preview': '='
        },
        templateUrl: 'entities/preview.html',
        link: function (scope, element, attrs, model) {
            scope.entity = {};
            scope.$watch('preview', function(e) {
                if (!e || !e.id) return;
                scope.entity = e;
                
                // check for the full REST:
                if (!e.created_at) {
                    $http.get('/api/1/entities/' + e.id).then(function(res) {
                        scope.entity = res.data;
                        //console.log(scope.entity);
                        core.setTitle(scope.entity.properties.name.value);
                    });
                }
            });
        }
    };
}]);
