class ForestCover {
    constructor() {
        this.forestMargin = {top: 50, right: 150, bottom: 50, left: 70}
        this.forestWidth = 1100 - this.forestMargin.left - this.forestMargin.right;
        this.forestHeight = 700 - this.forestMargin.top - this.forestMargin.bottom;
        this.forestSvg = d3.select("#forestcoverplot")
            .append("svg")
            .attr("width", this.forestWidth + this.forestMargin.left + this.forestMargin.right)
            .attr("height", this.forestHeight + this.forestMargin.top + this.forestMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.forestMargin.left + "," + this.forestMargin.top + ")");
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

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function (d) {
        return "<h4 align='center'>" + d['Country'] + "</h4><h3  align='center'>"
            + parseFloat(d['Area']) + "k sq km</h3></b>"
        // return "<h4 align='center'>" + d['Country'] + "</h4><h2  align='center'>"
        //     + parseFloat(d[forest.selectedYear]).toFixed(2) + "%</h2></b>"
    });
forest.forestSvg.call(toolTip);


// d3.csv('forestcover1990-2016.csv').then((dataset) => {
d3.csv('./data-csv/forestcover1990-2016-2.csv').then((dataset) => {

    forest.setDataset(dataset);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 202])
        .range([0, forest.forestWidth]);

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([forest.forestHeight, 0]);


    var rscale = d3.scaleSqrt()
        .range([1, 30]);

    rscale.domain(d3.extent(forest.dataset, function (d) {
        return d["Area"];
    }));

    forest.setScale(x, y, rscale);

    forest.forestSvg.append("g")
        .attr("transform", "translate(0," + (forest.forestHeight) + ")")
        .call(d3.axisBottom(forest.xScale).tickSize(0).tickValues([]));

    forest.forestSvg.append("g")
        .attr("transform", "translate(00, 0)")
        .style("font-size", 15)
        .call(d3.axisLeft(forest.yScale).ticks(5));

    // buildGraph();

});

function buildGraph() {

    if (forest.selectedYear > 2016) {
        return;
    }

    var year = forest.forestSvg
        .selectAll(".year")
        .data([1]);

    year.exit().remove();

    var newYear = year.enter()
        .append("text")
        .attr("class", "year");

    year.merge(newYear)
        .transition()
        .duration(200)

        .attr("x", (forest.forestWidth / 2))
        .attr("y", (30))
        .attr("z-index", "-1")
        .attr("text-anchor", "middle")
        .style("font-size", "80px")
        .style("opacity", "0.5")
        .text(function (d) {
            return forest.selectedYear;
        });

    var circles = forest.forestDots
        .selectAll("circle")
        .data(forest.dataset);

    circles.exit()
        .remove();

    var newCircles = circles.enter()
        .append('circle');

    circles.merge(newCircles)
        .transition()
        .duration(400)
        .attr("cx", function (d, i) {
            return forest.xScale(i);
        })
        .attr("cy", function (d) {
            return forest.yScale(d[forest.selectedYear]);
        })
        .attr("r", function (d) {
            return forest.rScale(d.Area)
        })
        .style("fill", function (d) {
            if (d[forest.selectedYear] < 33) {
                return "#c00400";
            }
            return "#129812";
        })
        .style("opacity", 0.6);

    newCircles
        .on("mouseover", function (d) {
            mousehoverEvent(d)
        })
        .on("mouseout", function (d) {
            mousehoverEvent()
        });

    forest.forestSvg.call(toolTip);

    if (forest.selectedYear <= 2015) {
        setTimeout(function () {
            var year = forest.selectedYear + 1;
            forest.setSelectedYear(year);
            buildGraph()
        }, 500);
    }


};



function mousehoverEvent(d) {
    var info = "";

    if (d) {
        info = d['Country'] + " : " + parseFloat(d['Area']) + "k sq km";
    }

    var hover_text = forest.forestSvg
        .selectAll(".year1")
        .data([1]);

    hover_text.exit().remove();

    var hover_text_new = hover_text.enter()
        .append("text")
        .attr("class", "year1");

    hover_text.merge(hover_text_new)
        .transition()
        .duration(200)

        .attr("x", (200))
        .attr("y", (10))
        .attr("z-index", "-1")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("opacity", "0.5")
        .text(function (d) {
            return info;
        });
}

export {buildGraph}