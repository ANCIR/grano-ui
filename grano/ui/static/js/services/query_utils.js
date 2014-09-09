grano.factory('queryUtils', [function() {
    
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

    return {
        nextLevel: nextLevel
    };
}]);
