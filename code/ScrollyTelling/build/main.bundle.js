/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./scrolly.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Chart1Overview/chart1.js":
/*!**********************************!*\
  !*** ./Chart1Overview/chart1.js ***!
  \**********************************/
/*! exports provided: drawLinePlotForOverview */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawLinePlotForOverview", function() { return drawLinePlotForOverview; });
/*
 * File: chart1.js
 * Project: code
 * File Created: October 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */
class ChartOverview {
  constructor() {
    this.chartOverviewsvg = d3.select('#chart1').select('svg');
    this.svgOverviewWidth = +this.chartOverviewsvg.attr('width');
    this.svgOverviewHeight = +this.chartOverviewsvg.attr('height');
    this.chartOverviewPadding = {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    };
    this.chartOverviewHeight = this.svgOverviewHeight - this.chartOverviewPadding.top - this.chartOverviewPadding.bottom;
    this.chartOverviewWidth = this.svgOverviewWidth - this.chartOverviewPadding.right - this.chartOverviewPadding.left;
    this.chartOverviewspecies = '';
    this.chartOverviewColorScale = '';
    this.slideOneChart = '';
  }

  setDataset(dataset) {
    this.dataset = dataset;
  }

  setScale(xScale, yScale) {
    this.xScale = xScale;
    this.yScale = yScale;
  }

}

var chartOverviewInstance = new ChartOverview(); // init once and then keep reusing

d3.csv('./data-csv/Table1b.csv').then(dataset => {
  console.log(dataset);
  chartOverviewInstance.setDataset(dataset); // nest by species

  chartOverviewInstance.chartOverviewspecies = ['Mammals', 'Birds', 'Amphibians', 'Reptiles', 'Fishes'];
  let speciesInformation = {}; // get data for each species per year

  chartOverviewInstance.chartOverviewspecies.forEach(s => {
    speciesInformation[s] = [];
    dataset.filter(d => d.AssessType === 'Total threatened').forEach(d => {
      let obj = {};
      obj.year = +d['Year'];
      obj.qty = +d[s];
      obj.species = s;
      speciesInformation[s].push(obj);
    }); // sort the array based on years

    speciesInformation[s].sort((a, b) => a.year - b.year);
  });
  console.log(speciesInformation);
  let threatenedAmount = [];
  chartOverviewInstance.chartOverviewspecies.forEach(s => {
    speciesInformation[s].forEach(d => {
      // add the species population to list
      threatenedAmount.push(+d.qty);
    });
  });
  let dateExtent = d3.extent(dataset.map(d => +d['Year']));
  let threatenedExtent = d3.extent(threatenedAmount);
  let xScale = d3.scaleLinear().domain(dateExtent).range([0, chartOverviewInstance.chartOverviewWidth]);
  let yScale = d3.scaleLinear().domain(threatenedExtent).range([chartOverviewInstance.chartOverviewHeight, 0]);
  chartOverviewInstance.setScale(xScale, yScale);
  let nested = d3.nest().key(function (d) {
    return d.company; // Nest by company name
  }).entries(speciesInformation);
  let statistics = [];
  Object.keys(speciesInformation).forEach((s, index) => {
    statistics.push({
      key: s,
      value: speciesInformation[s],
      species: s
    });
  });
  console.log(statistics);
  chartOverviewInstance.slideOneChart = chartOverviewInstance.chartOverviewsvg.selectAll('.chart').data(statistics).enter().append('g').attr('class', 'chart').attr('transform', function (d, i) {
    var tx = chartOverviewInstance.chartOverviewPadding.right + chartOverviewInstance.chartOverviewPadding.left;
    var ty = chartOverviewInstance.chartOverviewPadding.top;
    return 'translate(' + [tx, ty] + ')';
  });
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  chartOverviewInstance.slideOneChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + chartOverviewInstance.chartOverviewHeight + ')').call(xAxis);
  var yAxis = d3.axisLeft(yScale);
  chartOverviewInstance.slideOneChart.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis);
  chartOverviewInstance.slideOneChart.append('text').attr('class', 'x axis-label').attr('transform', 'translate(' + [chartOverviewInstance.chartOverviewWidth / 2, chartOverviewInstance.chartOverviewHeight + 34] + ')').text('Year');
  chartOverviewInstance.slideOneChart.append('text').attr('class', 'y axis-label').attr('transform', 'translate(' + [-50, chartOverviewInstance.chartOverviewHeight / 2 + chartOverviewInstance.chartOverviewPadding.bottom] + ') rotate(270)').text('No of threatened species'); // for each species: 

  /*
   * Mammals, Birds, Amphibians, Fishes, Reptiles 
   ['gray', 'yellow', 'green' ,'blue','brown']
   */

  let colorScheme = ['#ddd', '#f3bb09', '#129812', '#0c0cca', '#771e1e'];
  chartOverviewInstance.chartOverviewColorScale = d3.scaleOrdinal(colorScheme).domain(chartOverviewInstance.chartOverviewspecies); // drawLinePlotForOverview(chartOverviewInstance.chartOverviewspecies, chartOverviewColorScale); 
});

function drawLinePlotForOverview() {
  let lineInterpolate = d3.line().x(function (d) {
    return chartOverviewInstance.xScale(d.year);
  }).y(function (d) {
    return chartOverviewInstance.yScale(d.qty);
  });

  if (chartOverviewInstance.slideOneChart === '') {
    return false;
  }

  chartOverviewInstance.slideOneChart.selectAll('.line-plot').data(d => [d.value]).enter().append('path').attr('class', 'line-plot').attr('id', d => d[0].species).attr("data-legend", d => d[0].species).attr('d', lineInterpolate).style('stroke', d => chartOverviewInstance.chartOverviewColorScale(d[0].species));
  d3.selectAll('.line-plot').each((d, i) => {
    if (d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).node() == null) {
      return;
    }

    let totalLength = d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).node().getTotalLength();
    d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(5000).delay(1000 * i).ease(d3.easeLinear).attr('stroke-dashoffset', 0);
  });
  let legendRectSize = 12;
  let legendSpacing = 2; // let legend = chartOverviewInstance.chartOverviewsvg.selectAll('.legend')
  //     .data(chartOverviewInstance.chartOverviewspecies)
  //     .enter()
  //     .append('g')
  //     .attr('class', 'legend')
  //     .attr('transform', function (d, i) {
  //         var height = legendRectSize + legendSpacing;
  //         var offset = height * chartOverviewInstance.chartOverviewspecies.length / 2;
  //         var horz = chartOverviewInstance.chartOverviewWidth + 2 * legendRectSize;
  //         var vert = chartOverviewInstance.chartOverviewHeight - (i * chartOverviewInstance.chartOverviewPadding.top + legendRectSize);
  //         return 'translate(' + horz + ',' + vert + ')';
  //     });
  //
  // legend.append('rect')
  //     .attr('width', legendRectSize)
  //     .attr('height', legendRectSize)
  //     .style('fill', chartOverviewInstance.chartOverviewColorScale)
  //     .style('stroke', chartOverviewInstance.chartOverviewColorScale);
  // legend.append('text')
  //     .attr('x', legendRectSize + legendSpacing)
  //     .attr('y', legendRectSize - legendSpacing)
  //     .text(function (d) { return d; })
  //     .attr('font-size', '0.5rem');

  return true;
}



/***/ }),

/***/ "./Chart2Map/main.js":
/*!***************************!*\
  !*** ./Chart2Map/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

class mapChloropeth {
  constructor() {
    this.mapsvg = d3.select('#map').select('svg');
    this.mapsvgWidth = +this.mapsvg.attr('width');
    this.mapsvgHeight = +this.mapsvg.attr('height');
    this.width = this.mapsvgWidth;
    this.height = this.mapsvgHeight;
    this.expressed = 'mammals';
    this.path = '';
    this.projection = '';
    this.dataMammals = '';
    this.dataReptiles = '';
    this.dataBirds = '';
    this.dataAmphibians = '';
    this.mammalsExtent = '';
    this.BirdExtent = '';
    this.ReptilesExtent = '';
    this.AmphibiansExtent = '';
    this.projection = d3.geoNaturalEarth().scale(this.width / 2 / Math.PI).translate([this.width / 2, this.height / 2]); //translate([this.width/2, this.height/4])

    this.path = d3.geoPath().projection(this.projection);
    this.dataMammals = d3.map();
    this.dataReptiles = d3.map();
    this.dataBirds = d3.map();
    this.dataAmphibians = d3.map();
  }

  setExpressed(expressed) {
    this.expressed = expressed;
  }

  mapColorScale(category) {
    var color;

    if (category == 'mammals') {
      color = d3.scaleSequential(d3.interpolateBlues).domain(this.mammalsExtent);
    }

    if (category == 'birds') {
      color = d3.scaleSequential(d3.interpolateBlues).domain(this.BirdExtent);
    }

    if (category == 'reptiles') {
      color = d3.scaleSequential(d3.interpolateBlues).domain(this.ReptilesExtent);
    }

    if (category == 'amphibians') {
      color = d3.scaleSequential(d3.interpolateBlues).domain(this.AmphibiansExtent);
    }

    return color;
  }

}

var mapOverViewInstance = new mapChloropeth();

function createLegend(color, extentValue) {
  var colorNew = color.domain(extentValue);
  var cb = d3.colorbarV(colorNew, 20, 375);
  mapOverViewInstance.mapsvg.append("g").attr("id", "legend").attr("transform", "translate(" + 60 + "," + 225 + ")").call(cb);
}

function mouseOverEvent(d, i) {
  mapOverViewInstance.mapsvg.call(mapOverViewInstance.toolTip);
  mapOverViewInstance.toolTip.show(d);
  d3.select(this);
}

function mouseOutEvent(d, i) {
  mapOverViewInstance.toolTip.hide(d, this);
  d3.select(this).style("stroke", "black").style("stroke-width", 1);
}

function ready(topo, error) {
  var toolTip = d3.tip().attr('class', 'd3-tip').offset([0, 0]).direction('s').html(function (d) {
    var Name = d["properties"].name;
    var mammals = d.mammals;
    var birds = d.birds;
    var amphibians = d.amphibians;
    var reptiles = d.reptiles;

    if (mapOverViewInstance.expressed == 'mammals') {
      return Name + "</br> " + mammals;
    }

    if (mapOverViewInstance.expressed == 'reptiles') {
      return Name + "</br>" + reptiles;
    }

    if (mapOverViewInstance.expressed == 'birds') {
      return Name + "</br> " + birds;
    }

    if (mapOverViewInstance.expressed == 'amphibians') {
      return Name + "</br>: " + amphibians;
    }
  });
  if (error) throw error;
  var recolorMap = mapOverViewInstance.mapColorScale('mammals');
  createLegend(recolorMap, mapOverViewInstance.mammalsExtent);
  var countries = mapOverViewInstance.mapsvg.append("g").attr("class", "countries").selectAll("path").data(topo.features).enter().append("path").attr("fill", function (d) {
    d.mammals = mapOverViewInstance.dataMammals.get(d.id) || 0;
    d.reptiles = mapOverViewInstance.dataReptiles.get(d.id) || 0;
    d.birds = mapOverViewInstance.dataBirds.get(d.id) || 0;
    d.amphibians = mapOverViewInstance.dataAmphibians.get(d.id) || 0;
    return choropleth(d, recolorMap);
  }).attr("d", mapOverViewInstance.path).on('mouseover', function (d) {
    // console.log("using this");
    // mapOverViewInstance.mapsvg.call(toolTip);
    // toolTip.show(d);
    d3.select(this);
    mousehoverEvent1(d);
  }).on('mouseout', function (d) {
    // toolTip.hide(d);
    d3.select(this).style("stroke", "black").style("stroke-width", 1);
    mousehoverEvent1();
  });
  d3.select("select").on("change", function () {
    changeAttribute(this.value, topo);
  });
}

function mousehoverEvent1(d) {
  var info = "";

  if (d) {
    var Name = d["properties"].name;
    var mammals = d.mammals;
    var birds = d.birds;
    var amphibians = d.amphibians;
    var reptiles = d.reptiles; // console.log(mapOverViewInstance.expressed);

    if (mapOverViewInstance.expressed == 'mammals') {
      info = Name + " : " + mammals;
    }

    if (mapOverViewInstance.expressed == 'reptiles') {
      info = Name + " : " + reptiles;
    }

    if (mapOverViewInstance.expressed == 'birds') {
      info = Name + " : " + birds;
    }

    if (mapOverViewInstance.expressed == 'amphibians') {
      info = Name + " : " + amphibians;
    }
  } // var hover_text = forest.forestSvg


  var hover_text = mapOverViewInstance.mapsvg.selectAll(".m1").data([1]);
  hover_text.exit().remove();
  var hover_text_new = hover_text.enter().append("text").attr("class", "m1");
  hover_text.merge(hover_text_new).transition().duration(300).attr("x", 500).attr("y", 550).attr("z-index", "-1").attr("text-anchor", "middle").style("font-size", "30px").text(function (d) {
    return info;
  });
}

function choropleth(d, recolorMap) {
  //get data value
  var value = d[mapOverViewInstance.expressed]; //if value exis ts, assign it a color; otherwise assign gray

  if (value != 0) {
    return recolorMap(value);
  } else {
    return "#dddddd";
  }

  ;
}

;

function changeAttribute(attribute, topo) {
  mapOverViewInstance.expressed = attribute;
  d3.selectAll(".countries").selectAll("path").data(topo.features) //select every region
  .attr("fill", function (d) {
    var c = mapOverViewInstance.mapColorScale(mapOverViewInstance.expressed);

    if (mapOverViewInstance.expressed == 'mammals') {
      domain = mapOverViewInstance.mammalsExtent;
    }

    if (mapOverViewInstance.expressed == 'birds') {
      domain = mapOverViewInstance.BirdExtent;
    }

    if (mapOverViewInstance.expressed == 'reptiles') {
      domain = mapOverViewInstance.ReptilesExtent;
    }

    if (mapOverViewInstance.expressed == 'amphibians') {
      domain = mapOverViewInstance.AmphibiansExtent;
    }

    mapOverViewInstance.mapsvg.selectAll("#legend").remove();
    createLegend(c, domain); //color enumeration units

    return choropleth(d, c); //->
  });
}

mapOverViewInstance.promises = [d3.json("https://enjalot.github.io/wwsd/data/world/world-110m.geojson"), d3.csv('./data-csv/data-map.csv')];
Promise.all(mapOverViewInstance.promises).then(function (data) {
  topo = data[0];
  data = data[1];
  data.forEach(d => {
    mapOverViewInstance.dataMammals.set(d.code, +d.Mammals);
    mapOverViewInstance.dataReptiles.set(d.code, +d.Reptiles);
    mapOverViewInstance.dataAmphibians.set(d.code, +d.Amphibians);
    mapOverViewInstance.dataBirds.set(d.code, +d.Birds);
    mapOverViewInstance.mammalsExtent = d3.extent(d3.values(mapOverViewInstance.dataMammals, function (data) {
      return d.Mammals;
    }));
    mapOverViewInstance.BirdExtent = d3.extent(d3.values(mapOverViewInstance.dataBirds, function (data) {
      return d.Birds;
    }));
    mapOverViewInstance.ReptilesExtent = d3.extent(d3.values(mapOverViewInstance.dataReptiles, function (data) {
      return d.Reptiles;
    }));
    mapOverViewInstance.AmphibiansExtent = d3.extent(d3.values(mapOverViewInstance.dataAmphibians, function (data) {
      return d.Amphibians;
    }));
  });
  ready(topo);
});

/***/ }),

/***/ "./Chartbubble/extinctBubbleChart.js":
/*!*******************************************!*\
  !*** ./Chartbubble/extinctBubbleChart.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

d3.csv("./data-csv/extinctbubble.csv").then(function (data, error) {
  var width = 1000,
      height = 750,
      padding = 1.5,
      // separation between same-color nodes
  clusterPadding = 6,
      // separation between different-color nodes
  maxRadius = 12;
  var categories = Array.from(new Set(data.map(d => d.category)));
  const n = data.length,
        // total number of nodes
  m = categories.length; // number of distinct clusters
  // const color = d3.scaleSequential(d3.inter)
  //     .domain(d3.range(m));

  let colorarray = ['#a9a9a9', '#f3bb09', '#771e1e', '#129812', '#0c0cca'];
  var color = d3.scaleOrdinal(colorarray); // The largest node for each cluster.

  const clusters = new Array(m);

  const getNodes = () => {
    const dist = 100;
    return data.map(function (elem) {
      let i = categories.findIndex(c => c == elem.category) || '',
          r = +elem.size,
          d = {
        cluster: i,
        radius: r * 1.2,
        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
      };
      if (!clusters[i] || r > clusters[i].radius) clusters[i] = d;
      return d;
    });
  };

  let nodes = getNodes();
  const svg = d3.select('#extinct-bubble-chart').select('svg').attr("width", width).attr("height", height);
  var toolTip = d3.tip().attr('class', 'd3-tip-extinct').offset([0, 0]).direction('s') // .html(data.forEach(function(d) {
  //     console.log(data)
  //     var Scientificname = d.sciname;
  //     console.log(Scientificname)
  //         return  "<p>"+d.sciname+
  //         "</p></br> " 
  .html(function (d, i) {
    console.log(d);
    console.log(d.index);
    x = data[d.index].sciname;
    y = data[d.index].commonname;
    return "<p>Scientificname : <i>" + data[d.index].sciname + "</i></br> " + "Common name : " + data[d.index].commonname + "</br> " + "Year Of Assessment : " + data[d.index].year1 + "</br> " + "Last Recorded in the Wild : " + data[d.index].year2 + "</br> ";
  });

  function mouseOverEvent(d, i) {
    //createSparkLine(d,i);
    svg.call(toolTip);
    toolTip.show(d, this);
    d3.select(this).style("stroke", "black").style("stroke-width", 3); //                         
  }

  function mouseOutEvent(d, i) {
    toolTip.hide(d, this);
    d3.select(this).style("stroke", "black").style("stroke-width", 0);
  } //      var node = svg.selectAll("circle")
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

    function force(alpha) {
      // scale + curve alpha value
      alpha *= strength * alpha;
      nodes.forEach(function (d) {
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
    };

    force.strength = _ => {
      strength = _ == null ? strength : _;
      return force;
    };

    return force;
  };

  const removeAll = () => {
    const node = svg.selectAll("circle").remove();
  };

  function drawNodes(targetCenter) {
    const node = svg.selectAll("circle").data(nodes).enter().append("circle").style("fill", function (d) {
      return color(d.cluster / 10);
    }).on("mousemove", mouseOverEvent).on("mouseout", mouseOutEvent);

    const layoutTick = e => {
      node.attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.y;
      }).attr("r", function (d) {
        return d.radius;
      });
    };

    const force = d3.forceSimulation() // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(targetCenter.x, targetCenter.y)) // cluster by section
    .force('cluster', cluster().strength(0.2)) // apply collision with padding
    .force('collide', d3.forceCollide(d => d.radius + padding).strength(0.7)).on('tick', layoutTick).nodes(nodes);
  }

  const targets = [{
    x: 350,
    y: 300
  }];

  const drawTargets = () => {
    svg.selectAll("rect").data(targets).enter().append("rect").attr("width", 5).attr("height", 5).attr("x", function (d) {
      return d.x;
    }).attr("y", function (d) {
      return d.y;
    }).style("fill", "red");
  };

  const draw = () => {
    drawTargets();
    let count = 0;
    drawNodes(targets[count]); //   const moveTarget = () => {
    //     removeAll();
    //     nodes = getNodes();
    //     drawNodes(targets[count]);
    //     count++;
    //     if (count >=1) count = 0;
    //     //
    //   }
    //   setInterval(moveTarget, 1500)
  };

  draw();
});

/***/ }),

/***/ "./disintegrateAnimal.js":
/*!*******************************!*\
  !*** ./disintegrateAnimal.js ***!
  \*******************************/
/*! exports provided: disintegrateElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disintegrateElement", function() { return disintegrateElement; });
/*
 * File: disintegrateAnimal.js
 * Project: scrolltelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */

/**
 * Demo from "https://github.com/ZachSaucier/Disintegrate/blob/gh-pages/disintegrate-self-contained.html"
 * @param {*} elem 
 */
function disintegrateElement(elem) {
  if (document.querySelector('[data-dis-type="self-contained"]')) {
    // If you do anything with dises, you need to wait for them to 
    // all finish loading
    window.addEventListener("disesLoaded", function () {
      let el = document.querySelector('[data-dis-type="self-contained"]');
      let dises = [disintegrate.getDisObj(el)]; // hack

      dises.forEach(function (disObj) {
        if (disObj.elem.dataset.disType === "self-contained") {
          //   disObj.container.addEventListener("click", function(e) {
          //     disObj.container.classList.add("animate");
          //   });
          // need it to run as soon as vis opens up
          setTimeout(() => {
            disObj.container.classList.add("animate");
          }, 1); //   disObj.elem.addEventListener("disComplete", function(e) {
          //     disObj.container.classList.remove("animate");
          //     // Hack to reset the CSS animations
          //     // see https://stackoverflow.com/a/6303311/2065702 for more info
          //     disObj.elem.remove();
          //     // reveal the underlying text
          //     // $(elem).show(); // happens too late
          //   });

          function resetCSSAnimation(el) {
            el.style.animation = "none";
            setTimeout(function () {
              el.style.animation = "";
            }, 10);
          }
        }
      });

      var ExplodeToRightParticle = function () {
        this.name = "ExplodeToRightParticle";
        this.animationDuration = 500; // in ms

        this.speed = {
          x: 0 + Math.random() * 6,
          y: -1.5 + Math.random() * 3
        };
        this.radius = 0 + Math.random() * 5;
        this.life = 30 + Math.random() * 10;
        this.remainingLife = this.life;
        this.firstRun = true;

        this.draw = ctx => {
          if (this.firstRun) {
            this.firstRun = false;
            this.startX += Math.random() * 20;
          }

          if (this.remainingLife > 0 && this.radius > 0) {
            ctx.beginPath();
            ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ", 1)";
            ctx.fill();
            this.remainingLife--;
            this.radius -= 0.1;
            this.startX += this.speed.x;
            this.startY += this.speed.y;
          }
        };
      };

      disintegrate.addParticleType(ExplodeToRightParticle);

      function genNormalizedVal() {
        return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 3;
      }

      const EaseIn = power => t => Math.pow(t, power),
            EaseOut = power => t => 1 - Math.abs(Math.pow(t - 1, power)),
            EaseInOut = power => t => t < .5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5;

      var HollowCircles = function () {
        this.name = "HollowCircles";
        this.animationDuration = 1000; // in ms

        this.widthScaler = Math.round(50 * genNormalizedVal()); // Normalized val between -50 and 50

        this.numWaves = (genNormalizedVal() + 1 / 2) * 2 + 1;

        this.xPosFunc = t => {
          return Math.sin(this.numWaves * Math.PI * t);
        };

        this.heightScaler = Math.round(65 * (genNormalizedVal() + 1) / 2) + 10; // Normalized val between 10 and 75

        this.yPosFunc = t => {
          return t;
        };

        this.startRadius = 5 + Math.random() * 7;

        this.sizeFunc = t => {
          return 1 - t;
        };

        this.opacityFactor = Math.round((genNormalizedVal() + 1) / 2 * 3 + 1);

        this.opacityFunc = t => {
          return 1 - EaseInOut(this.opacityFactor)(t);
        };

        this.firstRun = true;

        this.draw = (ctx, percent) => {
          percent = percent >= 1 ? 1 : percent;

          if (this.firstRun) {
            this.firstRun = false;
            this.startY += Math.random() * 20;
          }

          let currX = this.startX + this.xPosFunc(percent) * this.widthScaler;
          let currY = this.startY - this.yPosFunc(percent) * this.heightScaler;
          let radius = this.startRadius * this.sizeFunc(percent);
          let currOpacity = this.opacityFunc(percent);
          ctx.beginPath();
          ctx.strokeStyle = "rgba(" + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ',' + currOpacity + ")";
          ctx.arc(currX, currY, radius, 0, Math.PI * 2);
          ctx.stroke();
        };
      };

      disintegrate.addParticleType(HollowCircles);
    });
  }
}



/***/ }),

/***/ "./forestcoverplot/forestcover.js":
/*!****************************************!*\
  !*** ./forestcoverplot/forestcover.js ***!
  \****************************************/
/*! exports provided: buildGraph */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildGraph", function() { return buildGraph; });
class ForestCover {
  constructor() {
    this.forestMargin = {
      top: 50,
      right: 150,
      bottom: 50,
      left: 70
    };
    this.forestWidth = 1100 - this.forestMargin.left - this.forestMargin.right;
    this.forestHeight = 700 - this.forestMargin.top - this.forestMargin.bottom;
    this.forestSvg = d3.select("#forestcoverplot").append("svg").attr("width", this.forestWidth + this.forestMargin.left + this.forestMargin.right).attr("height", this.forestHeight + this.forestMargin.top + this.forestMargin.bottom).append("g").attr("transform", "translate(" + this.forestMargin.left + "," + this.forestMargin.top + ")");
    this.forestDots = this.forestSvg.append('g');
    this.forestDataTime = d3.range(0, 27).map(function (d) {
      return new Date(1990 + d, 10, 3);
    });
    this.selectedYear = 2000;
  }

  setDataset(dataset) {
    this.dataset = dataset;
  }

  setScale(xScale, yScale, rScale) {
    this.xScale = xScale;
    this.yScale = yScale;
    this.rScale = rScale;
  }

  setSelectedYear(year) {
    this.selectedYear = year;
  }

}

var forest = new ForestCover();
var toolTip = d3.tip().attr("class", "d3-tip").offset([-12, 0]).html(function (d) {
  return "<h4 align='center'>" + d['Country'] + "</h4><h3  align='center'>" + parseFloat(d['Area']) + "k sq km</h3></b>"; // return "<h4 align='center'>" + d['Country'] + "</h4><h2  align='center'>"
  //     + parseFloat(d[forest.selectedYear]).toFixed(2) + "%</h2></b>"
});
forest.forestSvg.call(toolTip); // d3.csv('forestcover1990-2016.csv').then((dataset) => {

d3.csv('./data-csv/forestcover1990-2016-2.csv').then(dataset => {
  forest.setDataset(dataset); // Add X axis

  var x = d3.scaleLinear().domain([0, 202]).range([0, forest.forestWidth]);
  var y = d3.scaleLinear().domain([0, 100]).range([forest.forestHeight, 0]);
  var rscale = d3.scaleSqrt().range([1, 30]);
  rscale.domain(d3.extent(forest.dataset, function (d) {
    return d["Area"];
  }));
  forest.setScale(x, y, rscale);
  forest.forestSvg.append("g").attr("transform", "translate(0," + forest.forestHeight + ")").call(d3.axisBottom(forest.xScale).tickSize(0).tickValues([]));
  forest.forestSvg.append("g").attr("transform", "translate(00, 0)").style("font-size", 15).call(d3.axisLeft(forest.yScale).ticks(5)); // buildGraph();
});

function buildGraph() {
  if (forest.selectedYear > 2016) {
    return;
  }

  var year = forest.forestSvg.selectAll(".year").data([1]);
  year.exit().remove();
  var newYear = year.enter().append("text").attr("class", "year");
  year.merge(newYear).transition().duration(200).attr("x", forest.forestWidth / 2).attr("y", 30).attr("z-index", "-1").attr("text-anchor", "middle").style("font-size", "80px").style("opacity", "0.5").text(function (d) {
    return forest.selectedYear;
  });
  var circles = forest.forestDots.selectAll("circle").data(forest.dataset);
  circles.exit().remove();
  var newCircles = circles.enter().append('circle');
  circles.merge(newCircles).transition().duration(400).attr("cx", function (d, i) {
    return forest.xScale(i);
  }).attr("cy", function (d) {
    return forest.yScale(d[forest.selectedYear]);
  }).attr("r", function (d) {
    return forest.rScale(d.Area);
  }).style("fill", function (d) {
    if (d[forest.selectedYear] < 33) {
      return "#c00400";
    }

    return "#129812";
  }).style("opacity", 0.6);
  newCircles.on("mouseover", function (d) {
    mousehoverEvent(d);
  }).on("mouseout", function (d) {
    mousehoverEvent();
  });
  forest.forestSvg.call(toolTip);

  if (forest.selectedYear <= 2015) {
    setTimeout(function () {
      var year = forest.selectedYear + 1;
      forest.setSelectedYear(year);
      buildGraph();
    }, 500);
  }
}

;

function mousehoverEvent(d) {
  var info = "";

  if (d) {
    info = d['Country'] + " : " + parseFloat(d['Area']) + "k sq km";
  }

  var hover_text = forest.forestSvg.selectAll(".year1").data([1]);
  hover_text.exit().remove();
  var hover_text_new = hover_text.enter().append("text").attr("class", "year1");
  hover_text.merge(hover_text_new).transition().duration(200).attr("x", 200).attr("y", 10).attr("z-index", "-1").attr("text-anchor", "middle").style("font-size", "20px").style("opacity", "0.5").text(function (d) {
    return info;
  });
}



/***/ }),

/***/ "./industrializationplot/industrializationplot.js":
/*!********************************************************!*\
  !*** ./industrializationplot/industrializationplot.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * File: industrializationplot.js
 * Project: industrializationplot
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */
class IndustrializationPlot {
  constructor() {
    this.industrializationsvg = d3.select('#industrialization').select('svg');
    this.industrializationsvgWidth = +this.industrializationsvg.attr('width');
    this.industrializationsvgHeight = +this.industrializationsvg.attr('height');
    this.industrializationPadding = {
      top: 20,
      right: 20,
      bottom: 60,
      left: 60
    };
    this.industrializationwHeight = this.industrializationsvgHeight - this.industrializationPadding.top - this.industrializationPadding.bottom;
    this.industrializationWidth = this.industrializationsvgWidth - 2 * this.industrializationPadding.right - 1.5 * this.industrializationPadding.left;
    this.industrializationChartTyep = 'line';
  }

  setDataset(dataset) {
    this.dataset = dataset;
  }

  setIndicators(indicators) {
    this.indicators = indicators;
  }

  setCountries(countries) {
    this.countries = countries;
  }

  setScale(xScale, yScale, xCountryScale) {
    this.xScale = xScale;
    this.yScale = yScale;
    this.xCountryScale = xCountryScale;
  }

  setIndicatorCountryWiseInformation(indicatorCountryWiseInformation) {
    this.indicatorCountryWiseInformation = indicatorCountryWiseInformation;
  }

  setIndicatorYearWiseInformation(indicatorYearWiseInformation) {
    this.indicatorYearWiseInformation = indicatorYearWiseInformation;
  }

}

var industrializationPlotInstance = new IndustrializationPlot(); // init once and then keep reusing

d3.csv('./data-csv/industrializationdata.csv').then(dataset => {
  let headerNames = d3.keys(dataset[0]);
  let uniqueIndicators = dataset;
  industrializationPlotInstance.setDataset(dataset);
  let indicatorsId = Array.from(new Set(dataset.map(d => d['Indicator Id'])));
  let indicators = Array.from(new Set(dataset.map(d => d['Indicator'])));
  let indicatorsInfo = indicatorsId.map((element, index) => {
    return {
      id: element,
      name: indicators[index]
    };
  }); // add select options

  createOptionsForSelection(indicatorsInfo);
  let countryId = Array.from(new Set(dataset.map(d => d['Country ISO3'])));
  let countries = Array.from(new Set(dataset.map(d => d['Country Name'])));
  let countriesInfo = countryId.map((element, index) => {
    return {
      id: element,
      code: countries[index]
    };
  });
  countriesInfo.push({
    id: 180,
    code: 'World Median'
  });
  createOptionsForCountry(countriesInfo);
  industrializationPlotInstance.setIndicators(indicatorsInfo);
  industrializationPlotInstance.setCountries(countriesInfo); // nest by indicator and then year

  /**
   * {indicatorID: [{
   *      year:
   *      details:[{
   *          country: ,
   *          code: ,
   *          value: 0.66
   *       }]
   * }]}
   */

  indicatorYearWiseInformation = {};
  industrializationPlotInstance.indicators.forEach(indicator => {
    indicatorYearWiseInformation[indicator.id] = [];
    const filteredIndicator = dataset.filter(d => d['Indicator Id'] === indicator.id);
    indicatorYearWiseInformation[indicator.id] = getYearWiseInformation(filteredIndicator);
  });
  industrializationPlotInstance.setIndicatorYearWiseInformation(indicatorYearWiseInformation); // nest by indicator and then country

  /**
   * {indicatorID: [{
   *      country:
   *      code:
   *      values: [{
   *          year: 1990,
   *          value: 0.66
   *       }]
   * }]}
   */

  indicatorCountryWiseInformation = {};
  industrializationPlotInstance.indicators.forEach(indicator => {
    indicatorCountryWiseInformation[indicator.id] = [];
    const filteredIndicator = dataset.filter(d => d['Indicator Id'] === indicator.id);
    filteredIndicator.forEach(c => {
      let arr = getYearInformation(c);
      let obj = {};
      obj['country'] = c['Country Name'];
      obj['key'] = c['Country ISO3'];
      obj['code'] = c['Country ISO3'];
      obj['values'] = arr;
      indicatorCountryWiseInformation[indicator.id].push(obj);
    });
    let obj = {};
    obj['country'] = 'World Median';
    obj['key'] = 180;
    obj['code'] = 180;
    obj['values'] = getMedian(indicatorYearWiseInformation[indicator.id]); // year wise median needed

    indicatorCountryWiseInformation[indicator.id].push(obj);
  });
  industrializationPlotInstance.setIndicatorCountryWiseInformation(indicatorCountryWiseInformation); // bubble plot
  // line plot

  let statistics = [];
  let paramId = 3786;
  industrializationPlotInstance.prevParam = 3786;

  if (industrializationPlotInstance.industrializationChartTyep == 'line') {
    statistics = indicatorCountryWiseInformation[paramId];
    drawLineChart(statistics, paramId);
  } else {
    let yearId = 2003;
    statistics = indicatorYearWiseInformation[paramId];
    drawBubblePlot(statistics, paramId, yearId);
  }
});

function drawLineChart(statistics, paramId) {
  industrializationPlotInstance.industrializationsvg.selectAll('.axis').remove();
  industrializationPlotInstance.industrializationsvg.selectAll('.chart').remove();
  let dateExtent = d3.extent(indicatorYearWiseInformation[3786].map(d => +d['year']));
  let countryExtent = [0, 145];
  let valueAmount = [];
  statistics.forEach(d => {
    // add the species population to list
    // valueAmount = valueAmount.concat(d['details'].map(x => +x.value));
    valueAmount = valueAmount.concat(d['values'].map(x => +x.value));
  });
  let valueExtent = d3.extent(valueAmount);
  let xScale = d3.scaleLinear().domain(dateExtent).range([0, industrializationPlotInstance.industrializationWidth]);
  let xCountryScale = d3.scaleLinear().domain(countryExtent).range([0, industrializationPlotInstance.industrializationWidth]);
  let yScale = d3.scaleLinear().domain(valueExtent).range([industrializationPlotInstance.industrializationwHeight, 0]);
  industrializationPlotInstance.setScale(xScale, yScale, xCountryScale); // industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart')
  // .data(industrializationPlotInstance.indicatorCountryWiseInformation[industrializationPlotInstance.prevParam])
  // .exit()
  // .remove();

  industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart').data(statistics).enter().append('g').attr('class', 'chart').attr('transform', function (d, i) {
    var tx = industrializationPlotInstance.industrializationPadding.right + industrializationPlotInstance.industrializationPadding.left;
    var ty = industrializationPlotInstance.industrializationPadding.top;
    return 'translate(' + [tx, ty] + ')';
  });
  industrializationPlotInstance.slideChart.exit().remove();
  industrializationPlotInstance.prevParam = paramId;
  var xAxis = d3.axisBottom(industrializationPlotInstance.xScale).tickFormat(d3.format("d"));
  industrializationPlotInstance.slideChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + industrializationPlotInstance.industrializationwHeight + ')').call(xAxis);
  var yAxis = d3.axisLeft(industrializationPlotInstance.yScale);
  industrializationPlotInstance.slideChart.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis);
  industrializationPlotInstance.slideChart.append('text').attr('class', 'x axis-label').attr('transform', 'translate(' + [industrializationPlotInstance.industrializationWidth / 2, industrializationPlotInstance.industrializationwHeight + 34] + ')').text('Year');
  industrializationPlotInstance.slideChart.append('text').attr('class', 'y axis-label').attr('transform', 'translate(' + [-50, industrializationPlotInstance.industrializationwHeight - 50 + industrializationPlotInstance.industrializationPadding.bottom] + ') rotate(270)').text(industrializationPlotInstance.indicators.find(d => +d.id === +paramId).name);
  drawLinePlotForOverview(paramId);
}

function drawBubblePlot(statistics, paramId, yearId) {
  let dataTime = d3.range(0, 25).map(function (d) {
    return new Date(1990 + d, 10, 3);
  });
  let sliderTime = d3.sliderBottom().min(d3.min(dataTime)).max(d3.max(dataTime)).step(1000 * 60 * 60 * 24 * 365).width(500).ticks(5).tickFormat(d3.timeFormat('%y')).tickValues(dataTime).default(new Date(2003, 10, 3)).on('onchange', val => {
    d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    let selected_year = d3.timeFormat('%Y')(val);
    console.log("changed year");
    let countryCodes = $('#countryParameter').val();
    buildBubblePlot(statistics, paramId, selected_year, countryCodes);
  });

  if ($('#slider-time').find('svg').length == 0) {
    let gTime = d3.select('div#slider-time').append('svg').attr('width', industrializationPlotInstance.industrializationWidth - 100).attr('height', 100).append('g').attr('transform', 'translate(15,30)');
    gTime.call(sliderTime);
  }

  console.log("initial year");
  let countryCodes = $('#countryParameter').val();
  buildBubblePlot(statistics, paramId, yearId, countryCodes);
}

function countryIndex(code) {
  return industrializationPlotInstance.countries.findIndex(d => d.id === code);
}

function buildBubblePlot(statistics, paramId, yearId, countryCodes) {
  if (countryCodes && countryCodes.length !== 0) {
    let stats = [];
    statistics.forEach(s => {
      let obj = {};
      obj.year = s.year;
      obj.details = s['details'].filter(c => countryCodes.findIndex(v => v === c.code || c.code == 180) > -1);
      stats.push(obj);
    });
    statistics = stats;
  }

  industrializationPlotInstance.industrializationsvg.selectAll('.axis').remove();
  industrializationPlotInstance.industrializationsvg.selectAll('.axis-label').remove();
  industrializationPlotInstance.industrializationsvg.selectAll('.chart').remove();
  let countryExtent = [0, 145];
  let xCountryScale = d3.scaleLinear().domain(countryExtent).range([0, industrializationPlotInstance.industrializationWidth]);
  let valueAmount = [];
  statistics = statistics.filter(s => +s.year === +yearId)[0]['details'];
  statistics.forEach(d => {
    // add the species population to list
    // valueAmount = valueAmount.concat(d['details'].map(x => +x.value));
    valueAmount = valueAmount.concat(+d['value']);
  });
  let valueExtent = d3.extent(valueAmount);
  let xScale = d3.scaleLinear().domain(countryExtent).range([0, industrializationPlotInstance.industrializationWidth]);
  let yScale = d3.scaleLinear().domain(valueExtent).range([industrializationPlotInstance.industrializationwHeight, 0]);
  let rscale = d3.scaleSqrt().range([1, 6]);
  rscale.domain(valueAmount);
  industrializationPlotInstance.setScale(xScale, yScale, xCountryScale);
  industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart').data(statistics).enter().append('g').attr('class', 'chart').attr('transform', function (d, i) {
    var tx = industrializationPlotInstance.industrializationPadding.right + industrializationPlotInstance.industrializationPadding.left;
    var ty = industrializationPlotInstance.industrializationPadding.top;
    return 'translate(' + [tx, ty] + ')';
  });
  industrializationPlotInstance.slideChart.exit().remove();
  industrializationPlotInstance.prevParam = paramId;
  var xAxis = d3.axisBottom(industrializationPlotInstance.xScale);
  industrializationPlotInstance.slideChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + industrializationPlotInstance.industrializationwHeight + ')').call(xAxis);
  var yAxis = d3.axisLeft(industrializationPlotInstance.yScale);
  industrializationPlotInstance.slideChart.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis);
  industrializationPlotInstance.slideChart.append('text').attr('class', 'x axis-label').attr('transform', 'translate(' + [industrializationPlotInstance.industrializationWidth / 2, industrializationPlotInstance.industrializationwHeight + 34] + ')').text('Countries');
  industrializationPlotInstance.slideChart.append('text').attr('class', 'y axis-label').attr('transform', 'translate(' + [-50, industrializationPlotInstance.industrializationwHeight / 2 + industrializationPlotInstance.industrializationPadding.bottom] + ') rotate(270)').text(industrializationPlotInstance.indicators.find(d => +d.id === +paramId).name); // if(chartOverviewInstance.slideOneChart === '') {
  //     return false;
  // }

  industrializationPlotInstance.slideChartEnter = industrializationPlotInstance.slideChart.selectAll('circle').data(d => {
    return [d];
  });
  let circleneter = industrializationPlotInstance.slideChartEnter.enter().append('circle');
  let colorBrewer = d3.scaleSequential().domain([1, 200]).interpolator(d3.interpolateYlGnBu);
  circleneter.attr('class', 'bubble').attr('id', d => {
    return `${paramId}-${d['code']}`;
  }).transition().duration(600).attr("cx", d => {
    return xScale(countryIndex(d.code));
  }).attr("cy", function (d) {
    return yScale(d['value']);
  }).attr("r", 5).style("fill", (d, i) => {
    if (d.code === 180) {
      return 'red';
    }

    return colorBrewer(countryIndex(d.code));
  }).style('stroke', '#ccc').style("opacity", 0.65);
  industrializationPlotInstance.slideChart.append('text').attr('class', 'gtooltip').attr('transform', d => {
    return 'translate(' + [xScale(countryIndex(d.code)), yScale(d['value']) - 10] + ')';
  }).text(function (d) {
    let country = industrializationPlotInstance.countries.find(dc => dc.id === d.code);

    if (d.code === 180) {
      country = {};
      country.code = 'World Median';
    }

    return country.code + " in " + yearId + ": " + parseFloat(d['value']).toFixed(2);
  }); // industrializationPlotInstance.industrializationsvg.selectAll('.d3-tip').remove();
  // let toolTip = d3.tip()
  //         .attr("class", "d3-tip")
  //         .offset([40, 0])
  //         .html(d => {
  //             console.log('mmm')
  //             return "<h6 align='center'>" + d['code'] + " in "+yearId+": </h6><p align='center'>"
  //                 + parseFloat(d['value']).toFixed(2) + "%</p>"
  //         });
  // industrializationPlotInstance.industrializationsvg.call(toolTip);
  // circleneter
  //     .on("mouseover", toolTip.show)
  //     .on("mouseout", toolTip.hide);

  industrializationPlotInstance.slideChartEnter.exit().remove();
}

function createOptionsForSelection(indicatorsInfo) {
  select = document.getElementById('industrialParameter');

  for (var i = 0; i < indicatorsInfo.length; i++) {
    let opt = document.createElement('option');
    opt.value = indicatorsInfo[i].id;
    opt.innerHTML = indicatorsInfo[i].name;
    select.appendChild(opt);
  }
}

function createOptionsForCountry(countriesInfo) {
  select = document.getElementById('countryParameter');

  for (var i = 0; i < countriesInfo.length; i++) {
    let opt = document.createElement('option');
    opt.value = countriesInfo[i].id;
    opt.innerHTML = countriesInfo[i].code;
    select.appendChild(opt);
  }
}

function drawLinePlotForOverview(paramId) {
  let lineInterpolate = d3.line().x(function (d) {
    return industrializationPlotInstance.xScale(d.year);
  }).y(function (d) {
    return industrializationPlotInstance.yScale(+d.value);
  }); // if(chartOverviewInstance.slideOneChart === '') {
  //     return false;
  // }

  industrializationPlotInstance.slideChartEnter = industrializationPlotInstance.slideChart.selectAll('.line-plot').data(d => {
    return [d.values];
  });
  let colorBrewer = d3.scaleSequential().domain([1, 200]).interpolator(d3.interpolateYlGnBu);
  let path = industrializationPlotInstance.slideChartEnter.enter().append('path').attr('class', 'line-plot').attr('id', d => `${paramId}-${d[0].code}`).attr('d', lineInterpolate).style('stroke', (d, i) => {
    if (d[0].code === 180) {
      return 'red';
    }

    return colorBrewer(countryIndex(d[0].code));
  }).on('mouseover', function (d, i) {
    d3.select(this).style("stroke-width", '4px');
    let [x, y] = d3.mouse(this);
    mouseyear = Math.floor(industrializationPlotInstance.xScale.invert(x));
    let obj = d.find(c => +c.year === +mouseyear);
    let country = industrializationPlotInstance.countries.find(dc => dc.id === obj.code);

    if (obj.code === 180) {
      country = {};
      country.code = 'World Median';
    }

    let message = `${country.code} in ${obj.year}: ${parseFloat(obj.value).toFixed(2)}`;
    industrializationPlotInstance.industrializationsvg.append("text").attr('class', 'ggtooltip').attr("x", x).attr("y", y - 20).attr('fill', 'black').text(message);
  }).on('mouseout', function () {
    d3.select(this).style("stroke-width", '2px');
    d3.selectAll('.ggtooltip').remove();
  });
  $('#slider-time').find('svg').remove(); // let toolTip = d3.tip()
  //         .attr("class", "d3-tip")
  //         .offset([40, 0])
  //         .html(d => {
  //             console.log(d);
  //             console.log(industrializationPlotInstance.countries);
  //             return "<h6 align='center'>" + d[0]['code'] + " in "+d[0]['year']+"</h6><p align='center'>"
  //                 + parseFloat(d[0]['value']).toFixed(2) + "%</p>"
  //         });
  // industrializationPlotInstance.industrializationsvg.call(toolTip);
  // path
  //     .on("mouseover", toolTip.show)
  //     .on("mouseout", toolTip.hide);
  // let tooltip = industrializationPlotInstance.slideChartEnter.append("g")
  //     .attr("class", "tooltip")
  //     .style("display", "none");
  // tooltip
  //     .append('cirlce')
  //     .attr('r', 2);
  // tooltip.append("text")
  //     .attr('class', 'tooltip-text')
  //     .attr("x", 60)
  //   	.attr("y", 18);
  // let tooltip = industrializationPlotInstance.slideChart.append('text')
  // .attr('class', 'gtooltip')
  // // .attr('transform', d =>{ 
  // //     return  'translate(' + [xScale(countryIndex(d.code)), yScale(d['value'])-10] + ')'
  // // })
  // .text(function(d){
  //     return  d['code'] + " in "+yearId+": "
  //                     + parseFloat(d['value']).toFixed(2);
  // })
  // .on("mousemove", mousemove);;
  // function mousemove() {
  //     var x0 = x.invert(d3.mouse(this)[0]),
  //         i = bisectDate(data, x0, 1),
  //         d0 = data[i - 1],
  //         d1 = data[i],
  //         d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  //     focus.attr("transform", "translate(" + x(d.date) + "," + y(d.likes) + ")");
  //     tooltip.attr("style", "left:" + (x(d.date) + 64) + "px;top:" + y(d.likes) + "px;");
  //     tooltip.select(".tooltip-date").text(dateFormatter(d.date));
  //     tooltip.select(".tooltip-likes").text(formatValue(d.likes));
  // }

  industrializationPlotInstance.slideChartEnter.exit().remove();
  return true;
}

function getYearInformation(instance) {
  const start = 1990;
  const end = 2014;
  let arr = [];

  for (let i = start; i <= end; i++) {
    let value = instance[i];
    let code = instance['Country ISO3'];
    arr.push({
      year: i,
      value: value,
      code: code
    });
  }

  return arr;
}

function getMedian(information) {
  const start = 1990;
  const end = 2014;
  let yearwise = [];

  for (let i = 0; i <= end - start; i++) {
    let year = information[i];
    let value = year['details'][142].value;
    let details = {};
    details['year'] = i + start;
    details['code'] = 180;
    details['value'] = value;
    yearwise.push(details);
  }

  return yearwise;
}

function getYearWiseInformation(filtered) {
  const start = 1990;
  const end = 2014;
  let yearwise = [];

  for (let i = start; i <= end; i++) {
    let arr = [];
    let details = {};
    details['year'] = i;
    details['details'] = filtered.map(c => {
      let obj = {};
      obj['country'] = c['Country Name'];
      obj['code'] = c['Country ISO3'];
      obj['value'] = c[i];
      arr.push(c[i]);
      return obj;
    });
    let median = d3.median(arr);
    let obj = {};
    obj['country'] = 'World Median';
    obj['code'] = 180;
    obj['value'] = median;
    details['details'].push(obj);
    yearwise.push(details);
  }

  return yearwise;
}

$(document).ready(() => {
  $('#countryParameter').select2({
    placeholder: "Select a country to filter",
    allowClear: true,
    width: 400
  });
  $('#countryParameter').on('change', event => {
    console.log($(event.target).val());
    let countryCodes = $(event.target).val();
    let paramId = $('#industrialParameter').val();
    let chartTypeParamter = $('input[name="chartTypeParameter"]:checked').val();
    conditionalCallBack(chartTypeParamter, paramId, countryCodes);
  });
  $('#industrialParameter').on('change', event => {
    let paramId = $(event.target).val();
    let chartTypeParamter = $('input[name="chartTypeParameter"]:checked').val();
    let countryCodes = $('#countryParameter').val();
    conditionalCallBack(chartTypeParamter, paramId, countryCodes);
  });
  $('input[name="chartTypeParameter"]').on('change', event => {
    let chartTypeParameter = $(event.target).val();
    let paramId = $('#industrialParameter').val();
    let countryCodes = $('#countryParameter').val();
    industrializationPlotInstance.industrializationChartTyep = chartTypeParameter; // callback to rerender line graph

    conditionalCallBack(chartTypeParameter, paramId, countryCodes);
  });
});

function conditionalCallBack(chartTypeParameter, paramId, countryCodes) {
  if ($('#countryParameter').val().length !== 0 && chartTypeParameter == 'line') {
    let stats = industrializationPlotInstance.indicatorCountryWiseInformation[paramId].filter(c => {
      return countryCodes.findIndex(v => v === c.code || c.code === 180) > -1;
    });
    drawLineChart(stats, paramId);
  } else if (chartTypeParameter == 'line') {
    drawLineChart(industrializationPlotInstance.indicatorCountryWiseInformation[paramId], paramId);
  } else if ($('#countryParameter').val().length !== 0 && chartTypeParameter == 'bubble') {
    let yearId = 2003;
    statistics = indicatorYearWiseInformation[paramId];
    let stats = [];
    statistics.forEach(s => {
      let obj = {};
      obj.year = s.year;
      obj.details = s['details'].filter(c => countryCodes.findIndex(v => v === c.code || c.code === 180) > -1);
      stats.push(obj);
    });
    drawBubblePlot(stats, paramId, yearId);
  } else if (chartTypeParameter == 'bubble') {
    let yearId = 2003;
    statistics = indicatorYearWiseInformation[paramId];
    drawBubblePlot(statistics, paramId, yearId);
  }
}

/***/ }),

/***/ "./overview-bubble-flags/script-copy.js":
/*!**********************************************!*\
  !*** ./overview-bubble-flags/script-copy.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class BubbleOverview {
  constructor() {}

}

var bubbleOverViewIntance = new BubbleOverview();
bubbleOverViewIntance.promises = [d3.json("./data-csv/continent-names.json"), d3.csv('./data-csv/newcountries2.csv')];
Promise.all(bubbleOverViewIntance.promises).then(function (data) {
  createBubbleChart(data[1], data[0]);
});

function createBubbleChart(countries, continentNames) {
  var CR = countries.map(function (country) {
    return +country.CR;
  });
  var VU = countries.map(function (country) {
    return +country.VU;
  });
  var EX = countries.map(function (country) {
    return +country.EX;
  });
  var LC = countries.map(function (country) {
    return +country.LC;
  });
  var EN = countries.map(function (country) {
    return +country.EN;
  });
  var NT = countries.map(function (country) {
    return +country.NT;
  });
  var meanCR = d3.mean(CR),
      CRExtent = d3.extent(CR),
      CRScaleX,
      CRScaleY;
  var meanVU = d3.mean(VU),
      VUExtent = d3.extent(VU),
      VUScaleX,
      VUScaleY;
  var meanEX = d3.mean(EX),
      EXExtent = d3.extent(EX),
      EXScaleX,
      EXScaleY;
  var meanLC = d3.mean(LC),
      LCExtent = d3.extent(LC),
      LCScaleX,
      LCScaleY;
  var meanNT = d3.mean(NT),
      NTExtent = d3.extent(NT),
      NTScaleX,
      NTScaleY;
  var meanEN = d3.mean(EN),
      ENExtent = d3.extent(EN),
      ENScaleX,
      ENScaleY;
  var continents = d3.set(countries.map(function (country) {
    return country.ContinentCode;
  }));
  var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(continents.values());
  var width = 900,
      height = 700;
  var svg,
      circles,
      circleSize = {
    min: 10,
    max: 40
  };
  circleRadiusScale = d3.scaleSqrt().domain(CRExtent).range([circleSize.min, circleSize.max]);

  if (isChecked('#population', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(CRExtent).range([circleSize.min, circleSize.max]);
  } else if (isChecked('#vulnerable', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(VUExtent).range([circleSize.min, circleSize.max]);
  } else if (isChecked('#extinct', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(EXExtent).range([circleSize.min, circleSize.max]);
  } else if (isChecked('#leastconcern', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(LCExtent).range([circleSize.min, circleSize.max]);
  } else if (isChecked('#endangered', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(ENExtent).range([circleSize.min, circleSize.max]);
  } else if (isChecked('#nearthreatened', false, 'arrangeby')) {
    circleRadiusScale = d3.scaleSqrt().domain(NTExtent).range([circleSize.min, circleSize.max]);
  }

  var forces, forceSimulation;
  createSVG();
  toggleContinentKey(!flagFill());
  createCircles();
  createForces();
  createForceSimulation();
  addFlagDefinitions();
  addFillListener();
  addGroupingListeners();

  function createSVG() {
    svg = d3.select("#bubble-chart").select("svg");
  }

  function toggleContinentKey(showContinentKey) {
    var keyElementWidth = 150,
        keyElementHeight = 30;
    var onScreenYOffset = keyElementHeight * 1.5,
        offScreenYOffset = 100;

    if (d3.select(".continent-key").empty()) {
      createContinentKey();
    }

    var continentKey = d3.select(".continent-key");

    if (showContinentKey) {
      translateContinentKey("translate(0," + (height - onScreenYOffset) + ")");
    } else {
      translateContinentKey("translate(0," + (height + offScreenYOffset) + ")");
    }

    function createContinentKey() {
      var keyWidth = keyElementWidth * continents.values().length;
      var continentKeyScale = d3.scaleBand().domain(continents.values()).range([(width - keyWidth) / 2, (width + keyWidth) / 2]);
      svg.append("g").attr("class", "continent-key").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").selectAll("g").data(continents.values()).enter().append("g").attr("class", "continent-key-element");
      d3.selectAll("g.continent-key-element").append("rect").attr("width", keyElementWidth).attr("height", keyElementHeight).attr("x", function (d) {
        return continentKeyScale(d);
      }).attr("fill", function (d) {
        return continentColorScale(d);
      });
      d3.selectAll("g.continent-key-element").append("text").attr("text-anchor", "middle").attr("x", function (d) {
        return continentKeyScale(d) + keyElementWidth / 2;
      }).text(function (d) {
        return continentNames[d];
      }); // The text BBox has non-zero values only after rendering

      d3.selectAll("g.continent-key-element text").attr("y", function (d) {
        var textHeight = this.getBBox().height; // The BBox.height property includes some extra height we need to remove

        var unneededTextHeight = 4;
        return (keyElementHeight + textHeight) / 2 - unneededTextHeight;
      });
    }

    function translateContinentKey(translation) {
      continentKey.transition().duration(500).attr("transform", translation);
    }
  }

  function flagFill() {
    return isChecked("#flags", true);
  }

  function isChecked(elementID, radio, selectorId) {
    if (radio) {
      return d3.select(elementID).property("checked");
    }

    return '#' + $('#' + selectorId).val() === elementID;
  }

  function createCircles() {
    // circles to be drawn based on what is selected
    var formatPopulation = d3.format(",");
    circles = svg.selectAll("circle").data(countries).enter().append("circle").attr("r", function (d) {
      return circleRadiusScale(d.CR);
    }).on("mouseover", function (d) {
      updateCountryInfo(d);
    }).on("mouseout", function (d) {
      updateCountryInfo();
    });
    updateCircles();

    function updateCountryInfo(country) {
      // info should depend on which radio box is checked - if VU or CR or others etc
      var info = "";

      if (country) {
        info = [country.CountryName, formatPopulation(country.CR)].join(": "); /// info = country.CountryName+ ": CR :"+ country.CR + " VU :" + country.VU;

        if (isChecked("#population", false, 'arrangeby')) info = country.CountryName + ": " + country.CR;
        if (isChecked("#vulnerable", false, 'arrangeby')) info = country.CountryName + ": " + country.VU;
        if (isChecked("#extinct", false, 'arrangeby')) info = country.CountryName + ": " + country.EX;
        if (isChecked("#leastconcern", false, 'arrangeby')) info = country.CountryName + ": " + country.LC;
        if (isChecked("#endangered", false, 'arrangeby')) info = country.CountryName + ": " + country.EN;
        if (isChecked("#nearthreatened", false, 'arrangeby')) info = country.CountryName + ": " + country.NT;
      }

      d3.select("#country-info").html(info);
    }
  }

  function updateCircles() {
    circles.attr("fill", function (d) {
      return flagFill() ? "url(#" + d.CountryCode + ")" : continentColorScale(d.ContinentCode);
    });
  }

  function createForces() {
    var forceStrength = 0.05;
    forces = {
      combine: createCombineForces(),
      countryCenters: createCountryCenterForces(),
      continent: createContinentForces(),
      population: createPopulationForces(),
      vulnerable: createVulnerableForces(),
      leastconcern: createleastconcernForces(),
      endangered: createendangeredForces(),
      nearthreatened: createnearthreatenedForces(),
      extinct: createExtinctForces()
    };

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength)
      };
    }

    function createCountryCenterForces() {
      var projectionStretchY = 0.25,
          projectionMargin = circleSize.max,
          projection = d3.geoEquirectangular().scale((width / 2 - projectionMargin) / Math.PI).translate([width / 2, height * (1 - projectionStretchY) / 2]);
      return {
        x: d3.forceX(function (d) {
          return projection([d.CenterLongitude, d.CenterLatitude])[0];
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return projection([d.CenterLongitude, d.CenterLatitude])[1] * (1 + projectionStretchY);
        }).strength(forceStrength)
      };
    }

    function createContinentForces() {
      return {
        x: d3.forceX(continentForceX).strength(forceStrength),
        y: d3.forceY(continentForceY).strength(forceStrength)
      };

      function continentForceX(d) {
        if (d.ContinentCode === "EU") {
          return left(width);
        } else if (d.ContinentCode === "AF") {
          return left(width);
        } else if (d.ContinentCode === "AS") {
          return right(width);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return right(width);
        }

        return center(width);
      }

      function continentForceY(d) {
        if (d.ContinentCode === "EU") {
          return top(height);
        } else if (d.ContinentCode === "AF") {
          return bottom(height);
        } else if (d.ContinentCode === "AS") {
          return top(height);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return bottom(height);
        }

        return center(height);
      }

      function left(dimension) {
        return dimension / 4;
      }

      function center(dimension) {
        return dimension / 2;
      }

      function right(dimension) {
        return dimension / 4 * 3;
      }

      function top(dimension) {
        return dimension / 4;
      }

      function bottom(dimension) {
        return dimension / 4 * 3;
      }
    }

    function createPopulationForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledCRMargin = circleSize.max;
      CRScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledCRMargin, width - scaledCRMargin * 2]);
      CRScaleY = d3.scaleLinear().domain(CRExtent).range([height - scaledCRMargin, scaledCRMargin * 2]);
      var centerCirclesInScaleBandOffset = CRScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return CRScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return CRScaleY(d.CR);
        }).strength(forceStrength)
      };
    }

    function createnearthreatenedForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledNTMargin = circleSize.max;
      NTScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledNTMargin, width - scaledNTMargin * 2]);
      NTScaleY = d3.scaleLinear().domain(NTExtent).range([height - scaledNTMargin, scaledNTMargin * 2]);
      var centerCirclesInScaleBandOffset = NTScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return NTScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return NTScaleY(d.NT);
        }).strength(forceStrength)
      };
    }

    function createVulnerableForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledVUMargin = circleSize.max;
      VUScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledVUMargin, width - scaledVUMargin * 2]);
      VUScaleY = d3.scaleLinear().domain(VUExtent).range([height - scaledVUMargin, scaledVUMargin * 2]);
      var centerCirclesInScaleBandOffset = VUScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return VUScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return VUScaleY(d.VU);
        }).strength(forceStrength)
      };
    }

    function createExtinctForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledEXMargin = circleSize.max;
      EXScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledEXMargin, width - scaledEXMargin * 2]);
      EXScaleY = d3.scaleLinear().domain(EXExtent).range([height - scaledEXMargin, scaledEXMargin * 2]);
      var centerCirclesInScaleBandOffset = EXScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return EXScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return EXScaleY(d.EX);
        }).strength(forceStrength)
      };
    }

    function createendangeredForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledENMargin = circleSize.max;
      ENScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledENMargin, width - scaledENMargin * 2]);
      ENScaleY = d3.scaleLinear().domain(ENExtent).range([height - scaledENMargin, scaledENMargin * 2]);
      var centerCirclesInScaleBandOffset = ENScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return ENScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return ENScaleY(d.EN);
        }).strength(forceStrength)
      };
    }

    function createleastconcernForces() {
      var continentNamesDomain = continents.values().map(function (continentCode) {
        return continentNames[continentCode];
      });
      var scaledLCMargin = circleSize.max;
      LCScaleX = d3.scaleBand().domain(continentNamesDomain).range([scaledLCMargin, width - scaledLCMargin * 2]);
      LCScaleY = d3.scaleLinear().domain(LCExtent).range([height - scaledLCMargin, scaledLCMargin * 2]);
      var centerCirclesInScaleBandOffset = LCScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function (d) {
          return LCScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
        }).strength(forceStrength),
        y: d3.forceY(function (d) {
          return LCScaleY(d.LC);
        }).strength(forceStrength)
      };
    }
  }

  function createForceSimulation() {
    forceSimulation = d3.forceSimulation().force("x", forces.combine.x).force("y", forces.combine.y).force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(countries).on("tick", function () {
      circles.attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.y;
      });
    });
  }

  function forceCollide(d) {
    // for default I guess? hence D.CR will be fine
    return countryCenterGrouping() || populationGrouping() || leastconcernGrouping() || endangeredGrouping() || extinctGrouping() || nearthreatenedGrouping() || vulnerableGrouping() ? 0 : circleRadiusScale(d.CR) + 1;
  }

  function countryCenterGrouping() {
    return isChecked("#country-centers", false, 'arrangeby');
  }

  function populationGrouping() {
    return isChecked("#population", false, 'arrangeby');
  }

  function vulnerableGrouping() {
    return isChecked("#vulnerable", false, 'arrangeby');
  }

  function extinctGrouping() {
    return isChecked("#extinct", false, 'arrangeby');
  }

  function endangeredGrouping() {
    return isChecked("#endangered", false, 'arrangeby');
  }

  function nearthreatenedGrouping() {
    return isChecked("#nearthreatened", false, 'arrangeby');
  }

  function leastconcernGrouping() {
    return isChecked("#leastconcern", false, 'arrangeby');
  }

  function addFlagDefinitions() {
    var defs = svg.append("defs");
    defs.selectAll(".flag").data(countries).enter().append("pattern").attr("id", function (d) {
      return d.CountryCode;
    }).attr("class", "flag").attr("width", "100%").attr("height", "100%").attr("patternContentUnits", "objectBoundingBox").append("image").attr("width", 1).attr("height", 1).attr("preserveAspectRatio", "xMidYMid slice").attr("xlink:href", function (d) {
      return "./data-csv/flags/" + d.CountryCode + ".svg";
    });
  }

  function addFillListener() {
    d3.selectAll('input[name="fill"]').on("change", function () {
      toggleContinentKey(!flagFill() && !populationGrouping());
      updateCircles();
    });
  }

  function addGroupingListeners() {
    // addListener("#combine", forces.combine);
    // addListener("#country-centers", forces.countryCenters);
    // addListener("#continents", forces.continent);
    // addListener("#population", forces.population);
    // addListener("#vulnerable", forces.vulnerable);
    // addListener("#extinct", forces.extinct);
    // addListener("#endangered", forces.endangered);
    // addListener("#nearthreatened", forces.nearthreatened);
    // addListener("#leastconcern", forces.leastconcern);
    // addListener("#arrangeby", "combine", forces.combine);
    // addListener("#arrangeby", "country-centers", forces.countryCenters);
    // addListener("#arrangeby", "continents", forces.continent);
    // addListener("#arrangeby", "population", forces.population);
    // addListener("#arrangeby", "vulnerable", forces.vulnerable);
    // addListener("#arrangeby", "extinct", forces.extinct);
    // addListener("#arrangeby", "endangered", forces.endangered);
    // addListener("#arrangeby", "nearthreatened", forces.nearthreatened);
    // addListener("#arrangeby", "leastconcern", forces.leastconcern);
    addListener('', '');

    function addListener(selector, id) {
      $('#arrangeby').on("change", function (event) {
        if ($(event.target).val() === 'combine') {
          updateForces(forces.combine);
        } else if ($(event.target).val() === 'country-centers') {
          updateForces(forces.countryCenters);
        } else if ($(event.target).val() === 'continents') {
          updateForces(forces.continent);
        }

        toggleContinentKey(!flagFill() && !populationGrouping() && !vulnerableGrouping() && !leastconcernGrouping() && !extinctGrouping() && !nearthreatenedGrouping() && !endangeredGrouping());

        if (isChecked('#population', false, 'arrangeby')) {
          togglePopulationAxes(populationGrouping());
        } else if (isChecked('#vulnerable', false, 'arrangeby')) {
          toggleVulnerableAxis(vulnerableGrouping());
        } else if (isChecked('#extinct', false, 'arrangeby')) {
          toggleExtinctAxis(extinctGrouping());
        } else if (isChecked('#endangered', false, 'arrangeby')) toggleEndangeredAxis(endangeredGrouping());else if (isChecked('#nearthreatened', false, 'arrangeby')) toggleNearThreatenedAxis(nearthreatenedGrouping());else if (isChecked('#leastconcern', false, 'arrangeby')) toggleLeastConcernAxis(leastconcernGrouping());
      });
      $('#arrangeby').on("change", function (event) {
        if ($(event.target).val() === 'population') {
          updateForces(forces.population);
        } else if ($(event.target).val() === 'vulnerable') {
          updateForces(forces.vulnerable);
        } else if ($(event.target).val() === 'extinct') {
          updateForces(forces.extinct);
        } else if ($(event.target).val() === 'endangered') {
          updateForces(forces.endangered);
        } else if ($(event.target).val() === 'nearthreatened') {
          updateForces(forces.nearthreatened);
        } else if ($(event.target).val() === 'leastconcern') {
          updateForces(forces.leastconcern);
        }

        toggleContinentKey(!flagFill() && !populationGrouping() && !vulnerableGrouping() && !leastconcernGrouping() && !extinctGrouping() && !nearthreatenedGrouping() && !endangeredGrouping());

        if (isChecked('#population', false, 'arrangeby')) {
          togglePopulationAxes(populationGrouping());
        } else if (isChecked('#vulnerable', false, 'arrangeby')) {
          toggleVulnerableAxis(vulnerableGrouping());
        } else if (isChecked('#extinct', false, 'arrangeby')) {
          toggleExtinctAxis(extinctGrouping());
        } else if (isChecked('#endangered', false, 'arrangeby')) toggleEndangeredAxis(endangeredGrouping());else if (isChecked('#nearthreatened', false, 'arrangeby')) toggleNearThreatenedAxis(nearthreatenedGrouping());else if (isChecked('#leastconcern', false, 'arrangeby')) toggleLeastConcernAxis(leastconcernGrouping());
      });
    }

    function updateForces(forces) {
      svg.selectAll("#craxis").remove();
      svg.selectAll("#vuaxis").remove();
      svg.selectAll("#exaxis").remove();
      svg.selectAll("#enaxis").remove();
      svg.selectAll("#ntaxis").remove();
      svg.selectAll("#lcaxis").remove();
      svg.selectAll("#xaxis").remove();
      forceSimulation.force("x", forces.x).force("y", forces.y).force("collide", d3.forceCollide(forceCollide)).alphaTarget(0.5).restart();
    }

    function togglePopulationAxes(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesCR();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesCR() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(CRScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(CRScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "craxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }

    function toggleVulnerableAxis(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesVU();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesVU() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(VUScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(VUScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "vuaxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }

    function toggleEndangeredAxis(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesEN();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesEN() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(ENScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(ENScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "enaxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }

    function toggleLeastConcernAxis(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesLC();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesLC() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(LCScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(LCScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "lcaxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }

    function toggleExtinctAxis(showAxes) {
      // console.log(showAxes)
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesEX();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesEX() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(EXScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(EXScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "exaxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }

    function toggleNearThreatenedAxis(showAxes) {
      // console.log(showAxes)
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;
      createAxesNT();
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxesNT() {
        var numberOfTicks = 10,
            tickFormat = ".0s";
        var xAxis = d3.axisBottom(NTScaleX).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + (height + offScreenYOffset) + ")").call(xAxis).attr("id", "xaxis").selectAll(".tick text").attr("font-size", "16px");
        var yAxis = d3.axisLeft(NTScaleY).ticks(numberOfTicks, tickFormat);
        svg.append("g").attr("class", "y-axis").attr("id", "ntaxis").attr("transform", "translate(" + offScreenXOffset + ",0)").call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis.transition().duration(500).attr("transform", translation);
      }
    }
  }
}

/***/ }),

/***/ "./scrollAnimatedStackedPlot.js":
/*!**************************************!*\
  !*** ./scrollAnimatedStackedPlot.js ***!
  \**************************************/
/*! exports provided: handleStepEnterAnimatedStackedPlot, handleStepExitAnimatedStackedPlot, handleStepProgressAnimatedStackedPlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterAnimatedStackedPlot", function() { return handleStepEnterAnimatedStackedPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitAnimatedStackedPlot", function() { return handleStepExitAnimatedStackedPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressAnimatedStackedPlot", function() { return handleStepProgressAnimatedStackedPlot; });
let rendered = false;

function handleStepEnterAnimatedStackedPlot(response, callback) {
  if (!rendered) {
    rendered = callback();
  }

  response.element.classList.add('is-active');
}

function handleStepExitAnimatedStackedPlot(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressAnimatedStackedPlot(response) {}



/***/ }),

/***/ "./scrollFirstHandler.js":
/*!*******************************!*\
  !*** ./scrollFirstHandler.js ***!
  \*******************************/
/*! exports provided: handleStepEnterFirst, handleStepExitFirst, handleStepProgressFirst */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterFirst", function() { return handleStepEnterFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitFirst", function() { return handleStepExitFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressFirst", function() { return handleStepProgressFirst; });
/*
 * File: handleStepEnterFirst.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */
let rendered = false;

function handleStepEnterFirst(response, callback) {
  if (!rendered) {
    rendered = callback();
  }

  response.element.classList.add('is-active');
}

function handleStepExitFirst(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressFirst(response) {}



/***/ }),

/***/ "./scrollForestCover.js":
/*!******************************!*\
  !*** ./scrollForestCover.js ***!
  \******************************/
/*! exports provided: handleStepEnterForestPlot, handleStepExitForestPlot, handleStepProgressForestPlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterForestPlot", function() { return handleStepEnterForestPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitForestPlot", function() { return handleStepExitForestPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressForestPlot", function() { return handleStepProgressForestPlot; });
let rendered = false;

function handleStepEnterForestPlot(response, callback) {
  if (!rendered) {
    rendered = callback();
  }

  response.element.classList.add('is-active');
}

function handleStepExitForestPlot(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressForestPlot(response) {}



/***/ }),

/***/ "./scrollSecondHandler.js":
/*!********************************!*\
  !*** ./scrollSecondHandler.js ***!
  \********************************/
/*! exports provided: handleStepProgressSecond, handleStepExitSecond, handleStepEnterSecond */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressSecond", function() { return handleStepProgressSecond; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitSecond", function() { return handleStepExitSecond; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterSecond", function() { return handleStepEnterSecond; });
function handleStepEnterSecond(response) {
  response.element.classList.add('is-active');
}

function handleStepExitSecond(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressSecond(response) {}



/***/ }),

/***/ "./scrollStackedPercentHandler.js":
/*!****************************************!*\
  !*** ./scrollStackedPercentHandler.js ***!
  \****************************************/
/*! exports provided: handleStepEnterStackedPercentPlot, handleStepExitStackedPercentPlot, handleStepProgressStackedPercentPlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterStackedPercentPlot", function() { return handleStepEnterStackedPercentPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitStackedPercentPlot", function() { return handleStepExitStackedPercentPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressStackedPercentPlot", function() { return handleStepProgressStackedPercentPlot; });
let rendered = false;

function handleStepEnterStackedPercentPlot(response, callback) {
  if (!rendered) {
    rendered = callback();
  }

  response.element.classList.add('is-active');
}

function handleStepExitStackedPercentPlot(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressStackedPercentPlot(response) {}



/***/ }),

/***/ "./scrollStackedPlotHandler.js":
/*!*************************************!*\
  !*** ./scrollStackedPlotHandler.js ***!
  \*************************************/
/*! exports provided: handleStepEnterStackedPlot, handleStepExitStackedPlot, handleStepProgressStackedPlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterStackedPlot", function() { return handleStepEnterStackedPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitStackedPlot", function() { return handleStepExitStackedPlot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressStackedPlot", function() { return handleStepProgressStackedPlot; });
let rendered = false;

function handleStepEnterStackedPlot(response, callback) {
  if (!rendered) {
    rendered = callback();
  }

  response.element.classList.add('is-active');
}

function handleStepExitStackedPlot(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressStackedPlot(response) {}



/***/ }),

/***/ "./scrollThirdHandler.js":
/*!*******************************!*\
  !*** ./scrollThirdHandler.js ***!
  \*******************************/
/*! exports provided: handleStepProgressThird, handleStepEnterThird, handleStepExitThird */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepProgressThird", function() { return handleStepProgressThird; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepEnterThird", function() { return handleStepEnterThird; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleStepExitThird", function() { return handleStepExitThird; });
/*
 * File: scrollThirdHandler.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */
function handleStepEnterThird(response) {
  response.element.classList.add('is-active');
}

function handleStepExitThird(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgressThird(response) {}



/***/ }),

/***/ "./scrolly.js":
/*!********************!*\
  !*** ./scrolly.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scrollFirstHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scrollFirstHandler */ "./scrollFirstHandler.js");
/* harmony import */ var _scrollSecondHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scrollSecondHandler */ "./scrollSecondHandler.js");
/* harmony import */ var _scrollThirdHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scrollThirdHandler */ "./scrollThirdHandler.js");
/* harmony import */ var _scrollStackedPlotHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scrollStackedPlotHandler */ "./scrollStackedPlotHandler.js");
/* harmony import */ var _scrollStackedPercentHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scrollStackedPercentHandler */ "./scrollStackedPercentHandler.js");
/* harmony import */ var _scrollAnimatedStackedPlot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scrollAnimatedStackedPlot */ "./scrollAnimatedStackedPlot.js");
/* harmony import */ var _scrollForestCover__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./scrollForestCover */ "./scrollForestCover.js");
/* harmony import */ var _disintegrateAnimal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./disintegrateAnimal */ "./disintegrateAnimal.js");
/* harmony import */ var _Chart1Overview_chart1__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Chart1Overview/chart1 */ "./Chart1Overview/chart1.js");
/* harmony import */ var _forestcoverplot_forestcover__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./forestcoverplot/forestcover */ "./forestcoverplot/forestcover.js");
/* harmony import */ var _stacked_plot_animatedStackedPlot__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./stacked plot/animatedStackedPlot */ "./stacked plot/animatedStackedPlot.js");
/* harmony import */ var _industrializationplot_industrializationplot__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./industrializationplot/industrializationplot */ "./industrializationplot/industrializationplot.js");
/* harmony import */ var _industrializationplot_industrializationplot__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_industrializationplot_industrializationplot__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _Chart2Map_main__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Chart2Map/main */ "./Chart2Map/main.js");
/* harmony import */ var _Chart2Map_main__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_Chart2Map_main__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _overview_bubble_flags_script_copy__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./overview-bubble-flags/script-copy */ "./overview-bubble-flags/script-copy.js");
/* harmony import */ var _overview_bubble_flags_script_copy__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_overview_bubble_flags_script_copy__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _Chartbubble_extinctBubbleChart__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Chartbubble/extinctBubbleChart */ "./Chartbubble/extinctBubbleChart.js");
/* harmony import */ var _Chartbubble_extinctBubbleChart__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_Chartbubble_extinctBubbleChart__WEBPACK_IMPORTED_MODULE_14__);
/*
 * File: scrolly.js
 * Project: ScrollyTelling
 * File Created: November 2019
 * Author: Shalini Chaudhuri (you@you.you)
 */















let ScrollerFirst, ScrollerSecond, ScrollerThird, ScrollerStackedPlot, ScrollerForestPlot, ScrollerAnimatedStackedPlot; // global for now

disintegrate.init();
$(document).ready(() => {
  // when the doc body is set up
  setUpBody(); // set up the scrollama instance

  setUpScrollerFirst();
  setUpScrollerSecond();
  setUpScrollerThird();
  setUpScrollerAnimatedStackedPlot();
  setupScrollForestPlot();
  setUpCarousel(); // Set up responsive resizing

  $(document).on('resize', event => {
    Scroller.resize;
  });
});
/**
 * Prototype function to check scrolly
 */

function setUpBody() {
  let container = document.querySelector('#narrative');
  let texts = container.querySelector('.scroll__text');
  let steps = texts.querySelectorAll('.step'); // steps.forEach(function (step) {
  //     var v = 100 + Math.floor(Math.random() * window.innerHeight / 4);
  //     step.style.padding = v + 'px 0px';
  // });

  let el = document.querySelector('.animalimage');
  Object(_disintegrateAnimal__WEBPACK_IMPORTED_MODULE_7__["disintegrateElement"])('.prob_introduction');
  setTimeout(() => {
    $('.prob_introduction').toggleClass('active');
  }, 500);
  setTimeout(() => {
    $(el).remove();
  }, 3000);
}
/**
 * Set up scrollama instance with the callbacks and params
 */


function setUpScrollerFirst() {
  ScrollerFirst = scrollama(); // define the params for scrollama instance

  ScrollerFirst.setup({
    container: '#narrative',
    step: '#scroll_first .step',
    offset: '0.5'
  }).onStepEnter(response => {
    Object(_scrollFirstHandler__WEBPACK_IMPORTED_MODULE_0__["handleStepEnterFirst"])(response, _Chart1Overview_chart1__WEBPACK_IMPORTED_MODULE_8__["drawLinePlotForOverview"]);
  }).onStepExit(response => {
    Object(_scrollFirstHandler__WEBPACK_IMPORTED_MODULE_0__["handleStepExitFirst"])(response);
  }).onStepProgress(response => {
    Object(_scrollFirstHandler__WEBPACK_IMPORTED_MODULE_0__["handleStepProgressFirst"])(response);
  });
}

function setUpScrollerSecond() {
  ScrollerSecond = scrollama(); // define the params for scrollama instance

  ScrollerSecond.setup({
    container: '#narrative',
    step: '#scroll_second .step',
    offset: '0.5'
  }).onStepEnter(response => {
    Object(_scrollSecondHandler__WEBPACK_IMPORTED_MODULE_1__["handleStepEnterSecond"])(response);
  }).onStepExit(response => {
    Object(_scrollSecondHandler__WEBPACK_IMPORTED_MODULE_1__["handleStepExitSecond"])(response);
  }).onStepProgress(response => {
    Object(_scrollSecondHandler__WEBPACK_IMPORTED_MODULE_1__["handleStepProgressSecond"])(response);
  });
}

function setUpScrollerThird() {
  ScrollerThird = scrollama(); // define the params for scrollama instance

  ScrollerThird.setup({
    container: '#narrative',
    step: '#scroll_third .step',
    offset: '0.5'
  }).onStepEnter(response => {
    Object(_scrollThirdHandler__WEBPACK_IMPORTED_MODULE_2__["handleStepEnterThird"])(response);
  }).onStepExit(response => {
    Object(_scrollThirdHandler__WEBPACK_IMPORTED_MODULE_2__["handleStepExitThird"])(response);
  }).onStepProgress(response => {
    Object(_scrollThirdHandler__WEBPACK_IMPORTED_MODULE_2__["handleStepProgressThird"])(response);
  });
}

function setUpScrollerStackedPlot() {
  ScrollerStackedPlot = scrollama(); // define the params for scrollama instance

  ScrollerStackedPlot.setup({
    container: '#narrative',
    step: '#scroll_stacked_plot .step',
    offset: '0.5'
  }).onStepEnter(response => {// handleStepEnterStackedPlot(response, stackedPlt.drawStackedPlot);
  }).onStepExit(response => {
    Object(_scrollStackedPlotHandler__WEBPACK_IMPORTED_MODULE_3__["handleStepExitStackedPlot"])(response);
  }).onStepProgress(response => {
    Object(_scrollStackedPlotHandler__WEBPACK_IMPORTED_MODULE_3__["handleStepProgressStackedPlot"])(response);
  });
}

function setUpScrollerStackedPercentPlot() {
  ScrollerStackedPlot = scrollama(); // define the params for scrollama instance

  ScrollerStackedPlot.setup({
    container: '#narrative',
    step: '#scroll_stacked_percent .step',
    offset: '0.5'
  }).onStepEnter(response => {// handleStepEnterStackedPercentPlot(response, stackedPerPlt.drawStackedPlot);
  }).onStepExit(response => {
    Object(_scrollStackedPercentHandler__WEBPACK_IMPORTED_MODULE_4__["handleStepExitStackedPercentPlot"])(response);
  }).onStepProgress(response => {
    Object(_scrollStackedPercentHandler__WEBPACK_IMPORTED_MODULE_4__["handleStepProgressStackedPercentPlot"])(response);
  });
}

function setupScrollForestPlot() {
  ScrollerForestPlot = scrollama(); // define the params for scrollama instance

  ScrollerForestPlot.setup({
    container: '#narrative',
    step: '#forest_cover .step',
    offset: '0.5'
  }).onStepEnter(response => {
    Object(_scrollForestCover__WEBPACK_IMPORTED_MODULE_6__["handleStepEnterForestPlot"])(response, _forestcoverplot_forestcover__WEBPACK_IMPORTED_MODULE_9__["buildGraph"]);
  }).onStepExit(response => {
    Object(_scrollForestCover__WEBPACK_IMPORTED_MODULE_6__["handleStepExitForestPlot"])(response);
  }).onStepProgress(response => {
    Object(_scrollForestCover__WEBPACK_IMPORTED_MODULE_6__["handleStepProgressForestPlot"])(response);
  });
}

function setUpScrollerAnimatedStackedPlot() {
  ScrollerAnimatedStackedPlot = scrollama(); // define the params for scrollama instance

  ScrollerAnimatedStackedPlot.setup({
    container: '#narrative',
    step: '#animatedstackedplot .step',
    offset: '0.5'
  }).onStepEnter(response => {
    Object(_scrollAnimatedStackedPlot__WEBPACK_IMPORTED_MODULE_5__["handleStepEnterAnimatedStackedPlot"])(response, _stacked_plot_animatedStackedPlot__WEBPACK_IMPORTED_MODULE_10__["update"]);
  }).onStepExit(response => {
    Object(_scrollAnimatedStackedPlot__WEBPACK_IMPORTED_MODULE_5__["handleStepExitAnimatedStackedPlot"])(response);
  }).onStepProgress(response => {
    Object(_scrollAnimatedStackedPlot__WEBPACK_IMPORTED_MODULE_5__["handleStepProgressAnimatedStackedPlot"])(response);
  });
}

function setUpCarousel() {
  $('.carousel').carousel({
    interval: 5000,
    pause: 'hover'
  });
}

/***/ }),

/***/ "./stacked plot/animatedStackedPlot.js":
/*!*********************************************!*\
  !*** ./stacked plot/animatedStackedPlot.js ***!
  \*********************************************/
/*! exports provided: drawBars, update */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawBars", function() { return drawBars; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update", function() { return update; });
class AnimatedStackedPlot {
  constructor() {
    this.animatedSvgMargin = {
      top: 20,
      right: 150,
      bottom: 40,
      left: 80
    };
    this.width = 1000 - this.animatedSvgMargin.left - this.animatedSvgMargin.right;
    this.height = 600 - this.animatedSvgMargin.top - this.animatedSvgMargin.bottom;
    this.animatedSvg = d3.select("#animatedstackedplot").select('svg').attr('width', this.width + this.animatedSvgMargin.left + this.animatedSvgMargin.right).attr('height', this.height + this.animatedSvgMargin.top + this.animatedSvgMargin.bottom).append('g').attr('transform', 'translate(' + this.animatedSvgMargin.left + ',' + this.animatedSvgMargin.top + ')');
  }

  setDataset(dataset) {
    this.dataset = dataset;
  }

}

var aspt = new AnimatedStackedPlot(); // var dataFile = "stackedplot.csv";

var dataFile = "./data-csv/stackedplot.csv";
d3.csv(dataFile).then(dataset => {
  aspt.setDataset(dataset); // var input = {'data': aspt.dataset, 'width': aspt.width, 'height': aspt.height},
  //     canvas = setUpSvgCanvas(input);

  drawBars();
});

function drawBars() {
  var input = {
    'data': aspt.dataset,
    'width': aspt.width,
    'height': aspt.height
  },
      canvas = setUpSvgCanvas(input);
  var params = {
    'input': input,
    'canvas': canvas
  };
  initialize(params);
  update(params);
  return true;
}

function initialize(params) {
  // unpacking params
  var canvas = params.canvas,
      input = params.input; // unpacking canvas

  var svg = canvas.svg,
      margin = canvas.margin,
      width = params.width = canvas.width,
      height = params.height = canvas.height; // processing Data and extracting binNames and clusterNames

  var formattedData = formatData(input.data),
      blockData = params.blockData = formattedData.blockData,
      binNames = params.binNames = formattedData.binNames,
      clusterNames = params.clusterNames = formattedData.clusterNames; // initialize color

  var colorScaleStacked = setUpColors().domain(clusterNames); // initialize scales and axis

  var scales = initializeScales(width, height),
      xScaleStacked = scales.x,
      yScaleStacked = params.y = scales.y;
  xScaleStacked.domain(binNames);
  yScaleStacked.domain([0, d3.max(blockData, function (d) {
    return d.y1;
  })]).nice();
  initializeAxis(svg, xScaleStacked, yScaleStacked, height, width); // initialize bars

  var barStacked = params.bar = svg.selectAll('.bar').data(blockData).enter().append('g').attr('class', 'bar');
  barStacked.append('rect').attr('x', function (d) {
    return xScaleStacked(d.x);
  }).attr('y', function (d) {
    return yScaleStacked(0);
  }).attr('width', xScaleStacked.bandwidth()).attr('height', 0).attr('fill', function (d) {
    return colorScaleStacked(d.cluster);
  }); // heights is a dictionary to store bar height by cluster
  // this hierarchy is important for animation purposes
  // each bar above the chosen bar must collapse to the top of the
  // selected bar, this function defines this top

  params.heights = setUpHeights(clusterNames, blockData); // defining max of each bin to convert later to percentage

  params.maxPerBin = setUpMax(clusterNames, blockData); // variable to store chosen cluster when bar is clicked

  var chosen = params.chosen = {
    cluster: null
  }; // initialize legend

  var legend = params.legend = svg.selectAll('.legend').data(clusterNames).enter().append('g').attr('class', 'legend');
  legend.append('rect').attr('x', width - 20).attr('y', function (d, i) {
    return 20 * (clusterNames.length - 1 - i);
  }).attr('height', 18).attr('width', 18).attr('fill', function (d) {
    return colorScaleStacked(d);
  }).on('click', function (d) {
    chosen.cluster = chosen.cluster === d ? null : d;
    update(params);
  });
  legend.append('text').attr('x', 560).attr('y', function (d, i) {
    return 20 * (clusterNames.length - 1 - i);
  }).text(function (d) {
    return d;
  }).attr('dy', '.95em'); // initialize checkbox options

  d3.select("#myCheckbox").on("change", function () {
    update(params);
  });
  params.view = false;
}

function update(params) {
  // retrieving params to avoid putting params.x everywhere
  var svgAnimated = params.canvas.svg,
      margin = params.canvas.margin,
      y = params.y,
      blockData = params.blockData,
      heights = params.heights,
      chosen = params.chosen,
      width = params.width,
      height = params.height,
      bar = params.bar,
      clusterNames = params.clusterNames,
      binNames = params.binNames,
      legend = params.legend,
      maxPerBin = params.maxPerBin,
      view = params.view;
  var transDuration = 700; // re-scaling data if view is changed to percentage
  // and re-scaling back if normal view is selected

  var newView = d3.select("#myCheckbox").property("checked");

  if (newView) {
    if (view != newView) {
      blockData.forEach(function (d) {
        d.y0 /= maxPerBin[d.x];
        d.y1 /= maxPerBin[d.x];
        d.height /= maxPerBin[d.x];
      });
      heights = setUpHeights(clusterNames, blockData);
    }
  } else {
    if (view != newView) {
      blockData.forEach(function (d) {
        d.y0 *= maxPerBin[d.x];
        d.y1 *= maxPerBin[d.x];
        d.height *= maxPerBin[d.x];
      });
      heights = setUpHeights(clusterNames, blockData);
    }
  }

  params.view = newView; // update Y axis

  if (chosen.cluster == null) {
    y.domain([0, d3.max(blockData, function (d) {
      return d.y1;
    })]).nice();
  } else {
    y.domain([0, d3.max(heights[chosen.cluster])]).nice();
  }

  if (newView) {
    y.domain([0, 1]).nice();
  }

  var axisY = d3.axisLeft(y);

  if (newView) {
    axisY.tickFormat(d3.format(".0%"));
  }

  svgAnimated.selectAll('.axisY').transition().duration(transDuration).call(axisY); // update legend

  legend.selectAll('rect').transition().duration(transDuration).attr('height', function (d) {
    return choice(chosen.cluster, d, 18, 18, 0);
  }).attr('y', function (d) {
    var i = clusterNames.indexOf(d);

    if (i > clusterNames.indexOf(chosen.cluster)) {
      return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 0);
    } else {
      return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 18);
    }
  });
  legend.selectAll('text').transition().duration(transDuration).attr('y', function (d) {
    var i = clusterNames.indexOf(d);

    if (i > clusterNames.indexOf(chosen.cluster)) {
      return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 0);
    } else {
      return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 18);
    }
  }).style('font-size', function (d, i) {
    return choice(chosen.cluster, d, '15px', '15px', '0px');
  }).attr('x', function (d) {
    return choice(chosen.cluster, d, width, width, width - this.getComputedTextLength() / 2);
  }); // update bars

  bar.selectAll('rect').on('click', function (d) {
    chosen.cluster = chosen.cluster === d.cluster ? null : d.cluster;
    update(params);
  }).transition().duration(transDuration).attr('y', function (d) {
    return choice(chosen.cluster, d.cluster, y(d.y1), y(d.height), myHeight(chosen, d, clusterNames, binNames, y, heights));
  }).attr('height', function (d) {
    return choice(chosen.cluster, d.cluster, height - y(d.height), height - y(d.height), 0);
  });
  return true;
} // heights is a dictionary to store bar height by cluster
// this hierarchy is important for animation purposes


function setUpHeights(clusterNames, blockData) {
  var heights = {};
  clusterNames.forEach(function (cluster) {
    var clusterVec = [];
    blockData.filter(function (d) {
      return d.cluster == cluster;
    }).forEach(function (d) {
      clusterVec.push(d.height);
    });
    heights[cluster] = clusterVec;
  });
  return heights;
} // getting the max value of each bin, to convert back and forth to percentage


function setUpMax(clusterNames, blockData) {
  var lastClusterElements = blockData.filter(function (d) {
    return d.cluster == clusterNames[clusterNames.length - 1];
  });
  var maxDict = {};
  lastClusterElements.forEach(function (d) {
    maxDict[d.x] = d.y1;
  });
  return maxDict;
} // custom function to provide correct animation effect
// bars should fade into the top of the remaining bar


function myHeight(chosen, d, clusterNames, binNames, y, heights) {
  if (chosen.cluster == null) {
    return 0;
  }

  if (clusterNames.indexOf(chosen.cluster) > clusterNames.indexOf(d.cluster)) {
    return y(0);
  } else {
    return y(heights[chosen.cluster][binNames.indexOf(d.x)]);
  }
} // handy function to play the update game with the bars and legend


function choice(variable, target, nullCase, targetCase, notTargetCase) {
  switch (variable) {
    case null:
      return nullCase;

    case target:
      return targetCase;

    default:
      return notTargetCase;
  }
}

function initializeScales(width, height) {
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.5);
  var y = d3.scaleLinear().range([height, 0]).nice();
  return {
    x: x,
    y: y
  };
}

function initializeAxis(svg, x, y, height, width) {
  var yAxis = d3.axisLeft(y);
  aspt.animatedSvg.append('g').attr('class', 'axisY').call(yAxis);
  aspt.animatedSvg.append('g').attr('class', 'axisX').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));
}

function setUpSvgCanvas(input) {
  return {
    svg: aspt.animatedSvg,
    margin: aspt.animatedSvgMargin,
    width: aspt.width,
    height: aspt.height
  };
}

function setUpColors() {
  return d3.scaleOrdinal().range(["#b30000", "#e60000", "#ff3333", "#129812"]);
} // formatting Data to a more d3-friendly format
// extracting binNames and clusterNames


function formatData(data) {
  var clusterNames = ["Critically Endangered", "Endangered", "Vulnerable", "Safe"];
  var binNames = [];
  var blockData = [];

  for (var i = 0; i < data.length; i++) {
    var y = 0;
    binNames.push(data[i].Type);

    for (var j = 0; j < clusterNames.length; j++) {
      var height = parseFloat(data[i][clusterNames[j]]);
      var block = {
        'y0': parseFloat(y),
        'y1': parseFloat(y) + parseFloat(height),
        'height': height,
        'x': data[i].Type,
        'cluster': clusterNames[j]
      };
      y += parseFloat(data[i][clusterNames[j]]);
      blockData.push(block);
    }
  }

  return {
    blockData: blockData,
    binNames: binNames,
    clusterNames: clusterNames
  };
}



/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map