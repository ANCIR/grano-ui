grano.directive('gnQueryTable', ['core', '$http', 'queryUtils', 'metadata',
    function (core, $http, queryUtils, metadata) {
    return {
      restrict: 'E',
      scope: {
        'project': '='
      },
      templateUrl: 'directives/query_table.html',
      link: function (scope, element, attrs, model) {

        var attributes = {},
            queries = {};

        scope.rows = [];
        scope.columns = [];
        scope.headers = {};

        scope.removeColumn = function(level, name) {
          var layers = queries['root'];
          delete layers[level].fields.properties[name];
          scope.$emit('querySet', 'root', queryUtils.pack(layers));
        };

        var sortColumns = function(a, b) {
          a = a.split('.', 2);
          b = b.split('.', 2);
          if (a[0] != b[0]) return a[0] > b[0] ? 1 : -1;
          if (a[1] == 'name') return -1;
          if (b[1] == 'name') return 1;
          return a[1] > b[1] ? 1 : -1;
        };

        var getAttribute = function(obj, name) {
          //console.log(obj, name);
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

        scope.$on('queryUpdate', function(event, name, query) {
          queries[name] = queryUtils.unpack(query, 0);
        });
        
        scope.$on('queryResult', function(event, name, data) {
          if (name != 'root') return;

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
                //layers = queries[name];

            var traverse = function(obj, level) {
              if (!angular.isArray(obj)) {
                obj = [obj];
              }

              angular.forEach(obj, function(o) {
                angular.forEach(o.properties, function(v, k) {
                  var key = level + '.' + k;
                  if (columns.indexOf(key) == -1) {
                    columns.push(key);
                    headers[key] = {
                      'attr': getAttribute(o, k),
                      'obj': o.obj,
                      'level': level
                    };
                  }
                  currentRow[key] = {'id': o.id, 'value': v};
                });

                var next = queryUtils.nextLevel(o);
                if (next !== null) {
                  traverse(o[next], level+1);
                } else {
                  rows.push(angular.copy(currentRow));
                  //currentRow = {};
                }
              });
            };

            traverse(data.results, 0);

            scope.columns = columns.sort(sortColumns);
            scope.headers = headers;
            scope.rows = rows;
          });
        });

      }
    };
}]);
