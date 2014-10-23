grano.numWords = {
  1: 'First',
  2: 'Second',
  3: 'Third',
  4: 'Fourth',
  5: 'Fifth',
  6: 'Sixth'
}

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
            schemata = {},
            levelNames = {},
            queries = {};

        scope.rows = [];
        scope.columns = [];
        scope.headers = {};

        scope.removeColumn = function(level, name) {
          var layers = queries['root'];
          delete layers[level].fields.properties[name];
          scope.$emit('querySet', 'root', queryUtils.pack(layers));
        };

        scope.addColumn = function(level, name) {
          var layers = queries['root'];
          layers[level].fields.properties[name] = null;
          scope.$emit('querySet', 'root', queryUtils.pack(layers));
        };

        var getAvailableColumns = function () {
          var layers = [];
          for (var layerId in queries['root']) {
            var attrs = [],
                num = Math.floor(layerId/2) + 1,
                layer = queries['root'][layerId];

            var baseSchema = layer.obj == 'entity' ? 'Entity' : 'Relation',
                schema = layer.filters.schema || baseSchema;    
            for (var i in attributes[schema]) {
              var attr = attributes[schema][i];
              if (angular.isUndefined(layer.fields.properties[attr.name])) {
                attrs.push(attr);
              }
            }

            if (attrs.length) {
              layers.push({
                'obj': layer.obj,
                'level': layerId,
                'attributes': attrs
              });  
            }
          }
          return layers;
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
          var schema = obj.schema.name;
          for (var attr in attributes[schema]) {
            if (attr == name) {
              var a = angular.copy(attributes[schema][attr]);
              a.schema = schema; 
              return a;
            }
          }
        };

        var updateLevelNames = function(name) {
          // make names for layers of the query ("first entity, second entity")
          var names = [], seen = [];
          for (var level in queries[name]) {
            var qd = queries[name][level],
                baseSchema = qd.obj == 'entity' ? 'Entity' : 'Relation',
                schema = qd.filters.schema || baseSchema;
            //console.log(schema, schemata);
            if (schemata[schema]) {
              schema = schemata[schema].label;
            }
            seen.push(schema);
            var sameCount = 0;
            for (var i in seen) {
              if (seen[i] == schema) {
                sameCount++;
              }
            }
            if (sameCount > 1) {
              schema = grano.numWords[sameCount] + ' ' + schema.toLowerCase();
            }
            names.push(schema);
          }
          levelNames[name] = names;
        }

        scope.getLevelName = function(level) {
          var names = levelNames['root'] || []
          return names[level] || '';
        };

        scope.$on('queryUpdate', function(event, name, query) {
          queries[name] = queryUtils.unpack(query, 0);
        });


        scope.$on('queryResult', function(event, name, data) {
          if (name != 'root') return;
          
          metadata.getSchemata().then(function(ss) {
            angular.forEach(ss, function(schema) {
              var attrs = {};
              angular.forEach(schema.attributes, function(a) {
                attrs[a.name] = a;
              });
              attributes[schema.name] = attrs;
              schemata[schema.name] = schema;
            });

            scope.availableColumns = getAvailableColumns();

            var columns = [],
                headers = {},
                rows = [];

            var traverse = function(row, obj, level) {
              var row = angular.copy(row);
              if (!angular.isArray(obj)) {
                obj = [obj];
              }

              angular.forEach(obj, function(o) {
                angular.forEach(o.properties, function(v, k) {
                  var key = level + '.' + k;
                  if (columns.indexOf(key) == -1) {
                    columns.push(key);
                    var attr = getAttribute(o, k);
                    headers[key] = {
                      'attr': attr,
                      'label': attr.label.toLowerCase(),
                      'obj': o.obj,
                      'level': level
                    };
                  }
                  row[key] = {'id': o.id, 'value': v};
                });

                var next = queryUtils.nextLevel(o);
                if (next !== null) {
                  traverse(row, o[next], level+1);
                } else {
                  if (rows.indexOf(row) == -1) {
                    rows.push(row);
                  }
                }
              });
            };
            
            updateLevelNames(name);
            traverse({}, data.results, 0);

            scope.columns = columns.sort(sortColumns);
            scope.headers = headers;
            scope.rows = rows;

          });
        });

      }
    };
}]);
