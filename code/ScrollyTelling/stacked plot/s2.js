class StackedPlot {
    constructor() {
        this.stackedSvg = d3.select("#s2").select('svg');
        // this.stackedSvgWidth = +this.stackedSvg.attr('width');
        // this.stackedSvgHeight = +this.stackedSvg.attr('height');
        this.stackedSvgMargin = {top: 50, right: 20, bottom: 70, left: 100};
        this.stackedGraphWidth = 900 - this.stackedSvgMargin.left
            - this.stackedSvgMargin.right;
        this.stackedGraphHeight = 500 - this.stackedSvgMargin.top
            - this.stackedSvgMargin.bottom;
        this.stackedG = this.stackedSvg.append("g").attr("transform",
            "translate(" + this.stackedSvgMargin.left + "," + this.stackedSvgMargin.top + ")");
        this.stackedKeys = ["Critically Endangered", "Endangered", "Vulnerable", "Safe"];
    }

    setDataset(dataset) {
        this.dataset = dataset;
    }

    setScale(xScale, yScale, zScale) {
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }
}

var spt = new StackedPlot(); // init once and then keep reusing

d3.csv('./data-csv/stackedplot.csv').then((dataset) => {

    spt.setDataset(dataset);

    var y = d3.scaleBand()
        .rangeRound([0, spt.stackedGraphHeight])
        .paddingInner(0.05)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, spt.stackedGraphWidth]);
    var z = d3.scaleOrdinal()
        .range(["#b30000", "#e60000", "#ff3333", "#129812"]);

    y.domain(dataset.map(function (d) {
        return d["Type"];
    }));

    x.domain([0, 18449]).nice();

    z.domain(spt.stackedKeys);


    spt.setScale(x, y, z);

    drawStackedPlot();

});

function drawStackedPlot() {

    spt.stackedG.append("g")
        .selectAll("g")
        .data(d3.stack().keys(spt.stackedKeys)(spt.dataset))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return spt.zScale(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return spt.yScale(d.data.Type);
        })
        .attr("x", function (d) {
            return spt.xScale(d[0]);
        })
        .attr("width", function (d) {
            return spt.xScale(d[1]) - spt.xScale(d[0]);
        })
        .attr("height", spt.yScale.bandwidth());

    spt.stackedG.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .style("font-size", 15)
        .call(d3.axisLeft(spt.yScale))
        .append("text")
        .attr("y", 2)
        .attr("x", spt.xScale(spt.xScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "20px")
        .attr("text-anchor", "start")
        .text("Species Type")
        .attr("z-index", "-1")
        .attr("transform", "translate(" + (-spt.stackedGraphWidth + 700) + ",1000) rotate(-90)");


    spt.stackedG.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + spt.stackedGraphHeight + ")")
        .style("font-size", 15)
        .call(d3.axisBottom(spt.xScale).ticks(null, "s"))
        .append("text")
        .attr("y", 2)
        .attr("x", spt.xScale(spt.xScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", "20px")
        .attr("text-anchor", "start")
        .text("Number of Species")
        .attr("transform", "translate(" + (-spt.stackedGraphWidth + 100)   + ",30)");

    var legend = spt.stackedG.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(spt.stackedKeys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * 20) + ")";
        });

    legend.append("rect")
        .attr("x", 482)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", spt.zScale);

    legend.append("text")
        .attr("x", spt.stackedGraphWidth - 300)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        })
        .style("font-size", 15);
    return true;
}


export {drawStackedPlot}
