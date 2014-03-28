grano.directive('gnRelationList', ['core', '$http', '$sce', '$modal', 'schemata',
    function (core, $http, $sce, $modal, schemata) {
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

            scope.deleteRelation = function(relation) {
                var d = $modal.open({
                    templateUrl: 'relations/delete.html',
                    controller: 'RelationsDeleteCtrl',
                    resolve: {
                        relation: function () { return relation; }
                    }
                });
            };

            scope.$watch('entity', function(e) {
                if (!e || !e.id) return;

                scope.project = e.project;
                var url = core.call('/relations?' + scope.localName + '=' + e.id);
                scope.load(url);
            });

        }
    };
}]);
