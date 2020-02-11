d3.csv("./data-csv/extinctbubble.csv").then ( function(data,error) {

    var width = 1000,
    height = 750,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 12;


    var categories = Array.from(new Set(data.map(d => d.category)))

const n = data.length, // total number of nodes
    m = categories.length; // number of distinct clusters

// const color = d3.scaleSequential(d3.inter)
//     .domain(d3.range(m));





var div = d3.select("#extinct-bubble-chart")
.append("div")  // declare the tooltip div 
.attr("class", "extincttooltip")              // apply the 'tooltip' class
.style("opacity", 0); 

let colorarray=['#a9a9a9', '#f3bb09','#771e1e','#129812','#0c0cca']
var color = d3.scaleOrdinal(colorarray);

// The largest node for each cluster.
const clusters = new Array(m);

const getNodes = () => {
  
  const dist = 100;	
  
  return data.map(function(elem) {
    let i = categories.findIndex(c => c == elem.category) || '',
        r = +elem.size,
        d = {
          cluster: i,
          radius: r*1.2,
          x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;
  });
}  

let nodes = getNodes();
   
const svg = d3.select('#extinct-bubble-chart').select('svg')
    .attr("width", width)
    .attr("height", height);


    var toolTip = d3.tip()
                    .attr('class', 'd3-tip-extinct')
                    .offset([0, 0])
                    .direction('s')
                    
                    // .html(data.forEach(function(d) {
                    //     console.log(data)
                    //     var Scientificname = d.sciname;
                    //     console.log(Scientificname)
                        
                    //         return  "<p>"+d.sciname+
                    //         "</p></br> " 
                    .html(function(d, i) {
                                console.log(d)
                                console.log(d.index)
                                x=data[d.index].sciname
                                y=data[d.index].commonname
                                return "<p>Scientificname : <i>" + data[d.index].sciname + "</i></br> " +
                               "Common name : " + data[d.index].commonname + "</br> " +
                                "Year Of Assessment : " + data[d.index].year1 + "</br> " +
                                "Last Recorded in the Wild : " + data[d.index].year2 + "</br> "
    
                                
                                
                     });
                    
                     function mouseOverEvent(d, i){
                        
                      var x=data[d.index].sciname;
                      var y=data[d.index].commonname;
                      div.html("<p>Scientificname : <i>" + data[d.index].sciname + "</i></br> " +
                      "Common name : " + data[d.index].commonname + "</br> " +
                        "Year Of Assessment : " + data[d.index].year1 + "</br> " +
                        "Last Recorded in the Wild : " + data[d.index].year2 + "</br> ")
                          .style("left", (d3.event.screenX - 500) + "px")			 
                          .style("top", (d3.event.screenY - 60) + "px");
                        div.transition()
                          .duration(500)	
                          .style("opacity", 0);
                        div.transition()
                          .duration(200)	
                          .style("opacity", .9);	



                        // svg.append(div);
                        //createSparkLine(d,i);
                        //  svg.call(toolTip);
                        //  toolTip.show(d, this);
                         d3.select(this)
                         .style("stroke", "black")
                                     .style("stroke-width",3);
             //                         
                     }
             
                     function mouseOutEvent(d,i){
                                //  toolTip.hide(d, this);
                                 d3.select(this)
                                     .style("stroke", "black")
                                     .style("stroke-width",0);
                                div.style("opacity", 0); 
                               
                             }
                        //      var node = svg.selectAll("circle")
                        //      .data(nodes)
                        //      .enter().append("g");//.call(force.drag);
                         
                         
                        //  node.append("circle")
                        //      .style("fill", function (d) {
                        //      return color(d.cluster);
                        //      })
                        //      .attr("r", function(d){return d.radius})
                        //      .on("mousemove", mouseOverEvent)
                        //                  .on("mouseout", mouseOutEvent);                            

// Move d to be adjacent to the cluster node.
// from: https://bl.ocks.org/mbostock/7881887
const cluster = () => {

  var nodes,
    strength = 0.1;

  function force (alpha) {

    // scale + curve alpha value
    alpha *= strength * alpha;

    nodes.forEach(function(d) {
			var cluster = clusters[d.cluster];
    	if (cluster === d) return;
      
      let x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;

      if (l != r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    });

  }

  force.initialize = function (_) {
    nodes = _;
  }

  force.strength = _ => {
    strength = _ == null ? strength : _;
    return force;
  };

  return force;

}

const removeAll = () => {
  const node = svg.selectAll("circle").remove();
}
  
function drawNodes(targetCenter) {
    
  const node = svg.selectAll("circle")
    .data(nodes)
  .enter().append("circle")
    .style("fill", function(d) { return color(d.cluster/10); })    
    .on("mousemove", mouseOverEvent)
    .on("mouseout", mouseOutEvent); 
  
  const layoutTick = e => {
  	node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.radius; });
	}
  
  const force = d3.forceSimulation()
  // keep entire simulation balanced around screen center
  .force('center', d3.forceCenter(targetCenter.x, targetCenter.y))

  // cluster by section
  .force('cluster', cluster()
    .strength(0.2))

  // apply collision with padding
  .force('collide', d3.forceCollide(d => d.radius + padding)
    .strength(0.7))

  .on('tick', layoutTick)
	.nodes(nodes);
}

  
const targets = [ {x: 350, y: 300}];	
  
const drawTargets = () => {
  
  svg.selectAll("rect")
    .data(targets)
  .enter().append("rect")
  	.attr("width", 5)
  	.attr("height", 5)
  	.attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .style("fill", "red");
} 
  
const draw = () => {
  drawTargets();
  let count = 0;
  
  drawNodes(targets[count]);
//   const moveTarget = () => {
//     removeAll();
//     nodes = getNodes();
//     drawNodes(targets[count]);

//     count++;
//     if (count >=1) count = 0;
//     //
    
//   }
//   setInterval(moveTarget, 1500)
}

draw();


});