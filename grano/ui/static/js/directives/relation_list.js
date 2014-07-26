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

            scope.createRelation = function() {
                var d = $modal.open({
                    templateUrl: 'relations/new.html',
                    controller: 'RelationsNewCtrl',
                    resolve: {
                        project: function () { return scope.project; },
                        source: function () {
                            return scope.localName == 'source' ? scope.entity : null;
                        },
                        target: function () {
                            return scope.localName == 'target' ? scope.entity : null;
                        }
                    }
                });
            };

            scope.$watch('entity', function(e) {
                if (!e || !e.id) return;

                scope.project = e.project;
                var url = core.call('/relations?' + scope.localName + '=' + e.id);
                scope.load(url);

                if (scope.project) {
                    schemata.get(scope.project.slug, 'relation').then(function(ss) {
                        scope.schemata = [];
                        angular.forEach(ss, function(s) {
                            if (s.obj == 'relation') scope.schemata.push(s);
                        });
                    });    
                }
            });

        }
    };
}]);
