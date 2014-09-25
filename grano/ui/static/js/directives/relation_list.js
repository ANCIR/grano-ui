grano.directive('gnRelationList', ['core', '$http', '$sce', '$modal', 'metadata',
    function (core, $http, $sce, $modal, metadata) {
    return {
        restrict: 'E',
        scope: {
            'entity': '=',
            'direction': '@'
        },
        templateUrl: 'directives/relation_list.html',
        link: function (scope, element, attrs, model) {
            scope.relations = {};
            scope.schemata = [];
            scope.localName = scope.direction == 'inbound' ? 'target' : 'source';
            scope.oppositeName = scope.direction == 'inbound' ? 'source' : 'target';
            
            scope.load = function(url) {
                scope.relations = {};
                $http.get(url).then(function(res) {
                    scope.relations = res.data;
                });
            };

            scope.canAdd = function() {
                return scope.schemata.length > 0;
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

                metadata.getSchemata().then(function(ss) {
                    var schemata = [];
                    angular.forEach(ss, function(s) {
                        if (s.obj == 'relation') {
                            schemata.push(s);    
                        }
                    });
                    scope.schemata = schemata;
                });
            });

        }
    };
}]);
