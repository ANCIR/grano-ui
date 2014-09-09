grano.directive('gnQueryPanel', [function() {
    return {
      restrict: 'EA',
      scope: {
        'project': '='
      },
      link: function(scope, element, attrs) {

        var nextLevel = function(obj) {
          var keys = ['relations', 'other'];
          if (obj != null) {
              for (var i in keys) {

                if (!angular.isUndefined(obj[keys[i]])) {
                  return keys[i];
                }
              }  
          }
          return null;
        };

        var pack = function(objects) {
            var obj = objects[0],
                tail = objects.slice(1),
                query = {};

            angular.forEach(['fields', 'filters'], function(s) {
                angular.forEach(obj[s], function(v, k) {
                    if (k == 'properties') {
                        v = angular.extend(query.properties || {}, v);
                    }
                    query[k] = v;
                });
            });

            var propcount = 0;
            angular.forEach(query.properties, function() { propcount++; });
            if (propcount == 0) {
                delete query.properties;
            }

            if (tail.length) {
                if (obj.obj == 'relation') {
                    query['other'] = pack(tail);
                } else {
                    query['relations'] = pack(tail);
                }
            }
            return obj.as_list ? new Array(query) : query;
        };

        var unpack = function(query, depth) {
            var level = {
                as_list: false,
                fields: {properties: {}},
                filters: {properties: {}},
                obj: (depth % 2) == 0 ? 'entity' : 'relation'
            };
            if (angular.isArray(query)) {
                level.as_list = true;
                query = query.length ? query[0] : null;
            }

            var get = function(name, obj, key, prefix) {
                if (!angular.isUndefined(obj)) {
                    if (angular.isArray(obj)) {
                        if (obj.length) {
                            obj = obj[0];
                        } else {
                            obj = null;
                        }
                    } 
                    if (angular.isObject(obj) && key) {
                        obj = obj[key];
                    }
                    

                    if (obj == null) {
                        var target = level.fields;
                        if (prefix) target = target[prefix];
                        target[name] = obj;
                    } else {
                        var target = level.filters;
                        if (prefix) target = target[prefix];
                        target[name] = obj;
                    }
                }
            }

            get('id', query.id)
            if (level.obj == 'entity') {
                get('schemata', query.schemata, 'name');
            } else {
                get('schema', query.schema, 'name');
            }
            angular.forEach(query.properties || {}, function(v, k) {
                get(k, v, 'value', 'properties');
            });

            var next = nextLevel(query);
            return next == null ? [level] : [level].concat(unpack(query[next], depth+1));
        };

        var q = [{
            'id': null, 'properties': {'name': {'value': null}}, 'relations': [{'schema': 'foo', 'other': {'id': null}}]
        }];
        var unpacked = unpack(q, 0);
        console.log(unpacked);
        var packed = pack(unpacked);
        console.log(packed);
    }};
}]);
