/* 
Source: https://github.com/pudo/kompromatron/blob/master/kompromatron/static/js/granoexplorer.js

Steal here: http://bl.ocks.org/d3noob/5141278

*/

grano.directive('gnQueryGraph', [function() {
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
        var w = $(element[0]).width(), h = $(element[0]).height(), r = 10;

        var force = d3.layout.force()
            .linkDistance(80)
            .charge(-20)
            .size([w, h]);

        vis.append("svg:defs").selectAll("marker")
                .data(["end"])
            .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
            .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");


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

        function update() {
            var max_r = 20,
                graph = updateGraph();
            //var getRadius = function(d) {
            //  return d.isRoot ? 15 : Math.max(5, Math.min(max_r, Math.sqrt(d.weight * 4)));
            //};

            var getRadius = function(d) {
                return 5;
            }

            var goodPos = [[w / 4, h / 3], [w * 3 / 4, h / 3]];

            force
                .gravity(0)
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
                    .on('mousedown', expandNode)
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
                    'properties': {'name': null},
                    'relations': [{
                        'schema': null,
                        'reverse': null,
                        'other': {
                            'id': null,
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
                    d.x = Math.max(r, Math.min(w - r, d.x));
                    d.y = Math.max(r, Math.min(h - r, d.y));
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
