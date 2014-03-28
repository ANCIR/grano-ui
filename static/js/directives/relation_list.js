grano.directive('gnRelationList', ['core', '$http', '$sce', 'schemata', function (core, $http, $sce, schemata) {
    return {
        restrict: 'E',
        scope: {
            'entity': '=',
            'direction': '@'
        },
        templateUrl: 'directives/relation_list.html',
        link: function (scope, element, attrs, model) {
            scope.relations = {};
            scope.localName = scope.direction == 'inbound' ? 'target' : 'source';
            scope.oppositeName = scope.direction == 'inbound' ? 'source' : 'target';
            
            scope.load = function(url) {
                $http.get(url).then(function(res) {
                    scope.relations = res.data;
                });
            };

            scope.$watch('entity', function(e) {
                if (!e || !e.id) return;

                var url = core.call('/relations?' + scope.localName + '=' + e.id);
                scope.load(url);
            });

        }
    };
}]);
