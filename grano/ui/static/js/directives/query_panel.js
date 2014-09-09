grano.directive('gnQueryPanel', ['queryUtils', function(queryUtils) {
  return {
    restrict: 'EA',
    scope: {
    'project': '='
    },
    templateUrl: 'directives/query_panel.html',
    link: function(scope, element, attrs) {
    scope.layers = [];

    var pack = function(layers) {
      var layer = layers[0],
        tail = layers.slice(1),
        query = {};

      angular.forEach(['fields', 'filters'], function(s) {
        angular.forEach(layer[s], function(v, k) {
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
        if (layer.obj == 'relation') {
          query['other'] = pack(tail);
        } else {
          query['relations'] = pack(tail);
        }
      }
      return layer.as_list ? new Array(query) : query;
    };

    var unpack = function(query, depth) {
      var layer = {
        as_list: false,
        fields: {properties: {}},
        filters: {properties: {}},
        root: depth == 0,
        obj: (depth % 2) == 0 ? 'entity' : 'relation'
      };
      if (angular.isArray(query)) {
        layer.as_list = true;
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
            var target = layer.fields;
            if (prefix) target = target[prefix];
            target[name] = obj;
          } else {
            var target = layer.filters;
            if (prefix) target = target[prefix];
            target[name] = obj;
          }
        }
      }

      get('id', query.id)
      if (layer.obj == 'entity') {
        get('schemata', query.schemata, 'name');
      } else {
        get('schema', query.schema, 'name');
      }
      angular.forEach(query.properties || {}, function(v, k) {
        get(k, v, 'value', 'properties');
      });

      var next = queryUtils.nextLevel(query);
      return next == null ? [layer] : [layer].concat(unpack(query[next], depth+1));
    };

    scope.$on('query', function(e, name, query) {
      if (name == 'root') {
        scope.layers = unpack(query, 0);
      }
    });

    /*
    var q = [{
      'id': null, 'properties': {'name': {'value': null}}, 'relations': [{'schema': 'foo', 'other': {'id': null}}]
    }];
    var unpacked = unpack(q, 0);
    console.log(unpacked);
    var packed = pack(unpacked);
    console.log(packed);
    */

    scope.addLayers = function() {
      var lastObject = scope.layers[scope.layers.length-1];
      if (lastObject.obj == 'entity') {
        scope.layers.push({'obj': 'relation',
                'fields': {'properties': {}},
                'filters': {'properties': {}}});
      }
      scope.layers.push({'obj': 'entity',
              'fields': {'properties': {'name': 'name'}},
              'filters': {'properties': {}}});
    };
  }};
}]);
