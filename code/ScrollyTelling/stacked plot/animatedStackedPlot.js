class AnimatedStackedPlot {
    constructor() {
        this.animatedSvgMargin = {top: 20, right: 150, bottom: 40, left: 80};
        this.width = 1000 - this.animatedSvgMargin.left - this.animatedSvgMargin.right;
        this.height = 600 - this.animatedSvgMargin.top - this.animatedSvgMargin.bottom;
        this.animatedSvg = d3.select("#animatedstackedplot").select('svg')
            .attr('width', this.width + this.animatedSvgMargin.left + this.animatedSvgMargin.right)
            .attr('height', this.height + this.animatedSvgMargin.top + this.animatedSvgMargin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.animatedSvgMargin.left + ',' + this.animatedSvgMargin.top + ')');
    }

    setDataset(dataset) {
        this.dataset = dataset;
    }

}


var aspt = new AnimatedStackedPlot();
// var dataFile = "stackedplot.csv";

var dataFile = "./data-csv/stackedplot.csv";

d3.csv(dataFile).then((dataset) => {

    aspt.setDataset(dataset);


    // var input = {'data': aspt.dataset, 'width': aspt.width, 'height': aspt.height},
    //     canvas = setUpSvgCanvas(input);

    drawBars();
});


function drawBars() {

    var input = {'data': aspt.dataset, 'width': aspt.width, 'height': aspt.height},
        canvas = setUpSvgCanvas(input);

    var params = {'input': input, 'canvas': canvas};
    initialize(params);
    update(params);
    return true;
}


function initialize(params) {

    // unpacking params
    var canvas = params.canvas,
        input = params.input;

    // unpacking canvas
    var svg = canvas.svg,
        margin = canvas.margin,
        width = params.width = canvas.width,
        height = params.height = canvas.height;

    // processing Data and extracting binNames and clusterNames
    var formattedData = formatData(input.data),
        blockData = params.blockData = formattedData.blockData,
        binNames = params.binNames = formattedData.binNames,
        clusterNames = params.clusterNames = formattedData.clusterNames;


    // initialize color
    var colorScaleStacked = setUpColors().domain(clusterNames);


    // initialize scales and axis
    var scales = initializeScales(width, height),
        xScaleStacked = scales.x,
        yScaleStacked = params.y = scales.y;

    xScaleStacked.domain(binNames);
    yScaleStacked.domain([0, d3.max(blockData, function (d) {
        return d.y1;
    })]).nice();

    initializeAxis(svg, xScaleStacked, yScaleStacked, height, width);

    // initialize bars
    var barStacked = params.bar = svg.selectAll('.bar')
        .data(blockData)
        .enter().append('g')
        .attr('class', 'bar');

    barStacked.append('rect')
        .attr('x', function (d) {
            return xScaleStacked(d.x);
        })
        .attr('y', function (d) {
            return yScaleStacked(0);
        })
        .attr('width', xScaleStacked.bandwidth())
        .attr('height', 0)
        .attr('fill', function (d) {
            return colorScaleStacked(d.cluster);
        });

    // heights is a dictionary to store bar height by cluster
    // this hierarchy is important for animation purposes
    // each bar above the chosen bar must collapse to the top of the
    // selected bar, this function defines this top
    params.heights = setUpHeights(clusterNames, blockData);

    // defining max of each bin to convert later to percentage
    params.maxPerBin = setUpMax(clusterNames, blockData);


    // variable to store chosen cluster when bar is clicked
    var chosen = params.chosen = {
        cluster: null
    };

    // initialize legend
    var legend = params.legend = svg.selectAll('.legend')
        .data(clusterNames)
        .enter().append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', width - 20)
        .attr('y', function (d, i) {
            return 20 * (clusterNames.length - 1 - i);
        })
        .attr('height', 18)
        .attr('width', 18)
        .attr('fill', function (d) {
            return colorScaleStacked(d);
        })
        .on('click', function (d) {
            chosen.cluster = chosen.cluster === d ? null : d;
            update(params);
        });

    legend.append('text')
        .attr('x', 560)
        .attr('y', function (d, i) {
            return 20 * (clusterNames.length - 1 - i);
        })
        .text(function (d) {
            return d;
        })
        .attr('dy', '.95em')

    // initialize checkbox options
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

    var transDuration = 700;

    // re-scaling data if view is changed to percentage
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
    params.view = newView;


    // update Y axis
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

    svgAnimated.selectAll('.axisY')
        .transition()
        .duration(transDuration)
        .call(axisY);


    // update legend
    legend.selectAll('rect')
        .transition()
        .duration(transDuration)
        .attr('height', function (d) {
            return choice(chosen.cluster, d, 18, 18, 0);
        })
        .attr('y', function (d) {
            var i = clusterNames.indexOf(d);
            if (i > clusterNames.indexOf(chosen.cluster)) {
                return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 0);
            } else {
                return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 18);
            }
        });
    legend.selectAll('text')
        .transition()
        .duration(transDuration)
        .attr('y', function (d) {
            var i = clusterNames.indexOf(d);
            if (i > clusterNames.indexOf(chosen.cluster)) {
                return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 0);
            } else {
                return choice(chosen.cluster, d, 20 * (clusterNames.length - 1 - i), 0, 18);
            }
        })
        .style('font-size', function (d, i) {
            return choice(chosen.cluster, d, '15px', '15px', '0px');
        })
        .attr('x', function (d) {
            return choice(chosen.cluster, d,
                width,
                width,
                width - this.getComputedTextLength() / 2);
        });


    // update bars
    bar.selectAll('rect')
        .on('click', function (d) {
            chosen.cluster = chosen.cluster === d.cluster ? null : d.cluster;
            update(params);
        })
        .transition()
        .duration(transDuration)
        .attr('y', function (d) {
            return choice(chosen.cluster, d.cluster,
                y(d.y1),
                y(d.height),
                myHeight(chosen, d, clusterNames, binNames, y, heights));
        })
        .attr('height', function (d) {
            return choice(chosen.cluster, d.cluster,
                height - y(d.height),
                height - y(d.height),
                0);
        });
    return true;
}

// heights is a dictionary to store bar height by cluster
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
}

// getting the max value of each bin, to convert back and forth to percentage
function setUpMax(clusterNames, blockData) {
    var lastClusterElements = blockData.filter(function (d) {
        return d.cluster == clusterNames[clusterNames.length - 1]
    })
    var maxDict = {};
    lastClusterElements.forEach(function (d) {
        maxDict[d.x] = d.y1;
    });
    return maxDict;
}

// custom function to provide correct animation effect
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
}


// handy function to play the update game with the bars and legend
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
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.5);

    var y = d3.scaleLinear()
        .range([height, 0]).nice();

    return {
        x: x,
        y: y
    };
}


function initializeAxis(svg, x, y, height, width) {
    var yAxis = d3.axisLeft(y)

    aspt.animatedSvg.append('g')
        .attr('class', 'axisY')
        .call(yAxis);

    aspt.animatedSvg.append('g')
        .attr('class', 'axisX')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
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
    return d3.scaleOrdinal().range(["#b30000", "#e60000", "#ff3333", "#129812"])

}


// formatting Data to a more d3-friendly format
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

export {drawBars, update}