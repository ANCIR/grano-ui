grano.directive('gnQueryTable', ['core', '$http', '$sce', 'metadata',
    function (core, $http, $sce, metadata) {
    return {
      restrict: 'E',
      scope: {
        'project': '='
      },
      templateUrl: 'directives/query_table.html',
      link: function (scope, element, attrs, model) {

        var attributes = {};

        scope.rows = [];
        scope.columns = [];
        scope.headers = {};

        /*
        scope.removeColumn = function(field) {
          var obj = queryState.by_id(field.id);
          angular.forEach(obj.fields.properties, function(p, i) {
            if (p.name == field.name)
              obj.fields.properties.splice(i, 1);
          });
          queryState.sync();
        };
        */

        var getAttribute = function(obj, name) {
          var schemata = obj.schemata || obj.schema;
          if (!angular.isArray(schemata)) {
            schemata = [schemata];
          };
          if (obj.obj == 'entity') { // HACK?
            schemata.push({'name': 'base'});
          }
          for (var i in schemata) {
            var schema = schemata[i].name;
            for (var attr in attributes[schema]) {
              if (attr == name) {
                return attributes[schema][attr];
              }
            }
          }
        };

        var nextLevel = function(obj) {
          var keys = ['relations', 'other'];
          for (var i in keys) {

            if (!angular.isUndefined(obj[keys[i]])) {
              return keys[i];
            }
          }
          return null;
        };

        scope.$on('queryUpdate', function(event, data) {
          metadata.getSchemata().then(function(schemata) {
            angular.forEach(schemata, function(schema) {
              var attrs = {};
              angular.forEach(schema.attributes, function(a) {
                attrs[a.name] = a;
              });  
              attributes[schema.name] = attrs;
            });

            var columns = [],
                headers = {},
                currentRow = {},
                rows = [];

            var traverse = function(obj, level) {
              if (!angular.isArray(obj)) {
                obj = [obj];
              }

              angular.forEach(obj, function(o) {
                angular.forEach(o.properties, function(v, k) {
                  var key = level + '.' + k;
                  if (columns.indexOf(key) == -1) {
                    columns.push(key);
                    headers[key] = getAttribute(o, k);
                  }
                  currentRow[key] = {'id': o.id, 'value': v};
                });

                var next = nextLevel(o);
                if (next !== null) {
                  traverse(o[next], level+1);
                } else {
                  rows.push(currentRow);
                  currentRow = {};
                }
              });
            };

            traverse(data, 0);

            scope.columns = columns;
            scope.headers = headers;
            scope.rows = rows;
          });
        });

      }
    };
}]);
