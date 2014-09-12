/* 
Source: https://github.com/pudo/kompromatron/blob/master/kompromatron/static/js/granoexplorer.js

Steal here: http://bl.ocks.org/d3noob/5141278

*/

grano.directive('gnQueryGraph', ['$window', function($window) {
    return {
      restrict: 'EA',
      scope: {
        'project': '='
      },
      link: function(scope, element, attrs) {
        // TODO: work d3 into angular properly?
        var nodes = {}, links = {};
        var color = d3.scale.category20b();
        var vis = d3.select(element[0]).append("svg"),
            path_group = vis.append("svg:g"),
            path = null,
            node = null;
        var w = null, h = null, min_r = null, max_r = null;

        var force = d3.layout.force();

        vis.append("svg:defs").selectAll("marker")
                .data(["end"])
            .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 20)
                //.attr("refY", -1.5)
                .attr("refY", -1.5)
                .attr("markerWidth", 5)
                .attr("markerHeight", 5)
                .attr("fill", "#ccc")
                .attr("orient", "auto")
            .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

        angular.element($window).bind('resize', function() {
            update();
        });

        function scaleGraph() {
            w = $(element[0]).width();
            h = w * 0.6;
            $(element[0]).find('svg').height(h);
            max_r = w * (1/30);
            min_r = 0.3 * max_r;

            var dist = max_r * 4;

            force.stop()
                .linkDistance(dist)
                .chargeDistance(dist * 2)
                .gravity(0.01)
                .charge(-100)
                .size([w, h])
        }

        function updateGraph() {
            var nodeList = [],
                linkList = [],
                nodeIndexes = {};

            for (var query in nodes) {
                for (var nodeId in nodes[query]) {
                    if (angular.isUndefined(nodeIndexes[nodeId])) {
                        nodeList.push(nodes[query][nodeId]);
                        nodeIndexes[nodeId] = nodeList.length - 1;    
                    }
                }    
            }
            
            for (var query in links) {
                for (var linkId in links[query]) {
                    link = links[query][linkId];
                    linkList.push({
                        source: nodeIndexes[link.source],
                        target: nodeIndexes[link.target],
                        schema: link.schema,
                        id: link.id
                    });
                }    
            }

            return {
                'nodes': nodeList,
                'links': linkList
            }
        }

        function radiusScale(nodes) {
            var min_deg = 10000, max_deg = 0;
            for (var i in nodes) {
                var d = nodes[i].degree;
                if (d > max_deg) {
                    max_deg = d;
                }
                if (d < min_deg) {
                    min_deg = d;
                }
            }
            //console.log(min_deg, max_deg);
            return d3.scale.linear()
                .domain([min_deg, max_deg])
                .rangeRound([min_r, max_r]);
        }

        function update() {
            scaleGraph();

            var graph = updateGraph(),
                scale = radiusScale(graph.nodes);

            var getRadius = function(d) {
              d.radius = scale(d.degree || 0);
              return d.radius;
            };

            //var goodPos = [[w / 4, h / 3], [w * 3 / 4, h / 3]];

            force
                //.gravity(0)
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            path = path_group.selectAll("path")
                .data(force.links());


            path.enter().append("svg:path")
                    .attr("class", "link")
                    .attr("marker-end", "url(#end)");

            path.exit().remove();

            vis.selectAll(".node").remove();
            // define the nodes
            node = vis.selectAll(".node")
                    .data(force.nodes())
                .enter().append("g")
                    .attr("class", "node")
                    .on('dblclick', expandNode)
                    .call(force.drag);

            node.append('svg:circle')
                .attr('r', getRadius)

            // add the text 
            node.append("text")
                .attr("x", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
        }

        var expandNode = function(d) {
            var q_name = 'expand_' + d.id,
                q = {
                    'id': d.id,
                    'schemata': null,
                    'degree': null,
                    'properties': {'name': null},
                    'relations': [{
                        'schema': null,
                        'reverse': null,
                        'other': {
                            'id': null,
                            'degree': null,
                            'schemata': null,
                            'properties': {'name': null}
                        }
                    }]
                };
            scope.$emit('querySet', q_name, q);
        }

        force.on('tick', function() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) {
                    d.x = Math.max(d.radius, Math.min(w - d.radius, d.x));
                    d.y = Math.max(d.radius, Math.min(h - d.radius, d.y));
                    return "translate(" + d.x + "," + d.y + ")";
                });
        });

        scope.$on('queryResult', function(event, queryName, data) {
            var queryNodes = {},
                queryLinks = {};

            var getNodes = function(obj) {
                if (obj === null || angular.isUndefined(obj)) {
                    return;
                }
                if (angular.isArray(obj)) {
                    return angular.forEach(obj, function(o) { getNodes(o); });
                }

                angular.forEach(['inbound', 'outbound', 'relations'], function(key) {
                    getLinks(obj[key], obj.id);
                });

                var schemata = [];
                angular.forEach(obj.schemata, function(s) { schemata.push(s.name); });
                queryNodes[obj.id] = {
                    'id': obj.id,
                    'isRoot': false,
                    'schemata': schemata,
                    'degree': obj.degree,
                    'name': obj.properties.name.value
                };
            };

            var getLinks = function(obj, parent) {
                if (obj === null || angular.isUndefined(obj)) {
                    return;
                }
                if (angular.isArray(obj)) {
                    return angular.forEach(obj, function(o) { getLinks(o, parent); });
                }

                var child_id = null;
                angular.forEach(['source', 'target', 'other'], function(key) {
                    getNodes(obj[key]);
                    if (!angular.isUndefined(obj[key])) {
                        child_id = obj[key].id;
                    }
                });

                queryLinks[obj.id] = {
                    'id': obj.id,
                    'schema': obj.schema.name,
                    'source': obj.reverse ? child_id : parent,
                    'target': obj.reverse ? parent : child_id
                };
            };
            
            getNodes(data.results);
            nodes[queryName] = queryNodes;
            links[queryName] = queryLinks;

            update();
        });

    }};
}]);
