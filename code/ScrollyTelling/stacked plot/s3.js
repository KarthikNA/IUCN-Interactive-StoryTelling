class StkPercent {
    constructor() {
        this.stackedSvg = d3.select("#s3").select('svg');
        this.stackedSvgMargin = {top: 50, right: 0, bottom: 70, left: 100};
        this.stackedGraphWidth = 650 - this.stackedSvgMargin.left
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

var sptPer = new StkPercent(); // init once and then keep reusing


var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function (d) {
        console.log(d)
        return "<h4 align='center'>" + d['Country'] + "</h4><h2  align='center'>"
            + parseFloat(d[selected_year]).toFixed(2) + "%</h2></b>"
    });
sptPer.stackedG.call(toolTip);


d3.csv('./data-csv/stackedplot.csv').then((dataset) => {

    sptPer.setDataset(dataset);

    var y = d3.scaleBand()
        .rangeRound([0, sptPer.stackedGraphHeight - 50])
        .paddingInner(0.15)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, sptPer.stackedGraphWidth - 190]);
    var z = d3.scaleOrdinal()
        .range(["#b30000", "#e60000", "#ff3333", "#129812"]);

    y.domain(dataset.map(function (d) {
        return d["Type"];
    }));

    x.domain([0, 100]).nice();

    z.domain(sptPer.stackedKeys);


    sptPer.setScale(x, y, z);

    // drawStackedPlot();

});

function drawStackedPlot() {

    sptPer.stackedG.append("g")
        .selectAll("g")
        .data(d3.stack().keys(sptPer.stackedKeys)(sptPer.dataset))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return sptPer.zScale(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return sptPer.yScale(d.data.Type);
        })
        .attr("x", function (d) {
            return sptPer.xScale(d[0] / d.data["Total"] * 100);
        })
        .attr("width", function (d) {
            return sptPer.xScale(d[1] / d.data["Total"] * 100) - sptPer.xScale(d[0] / d.data["Total"] * 100);
        })
        .attr("height", sptPer.yScale.bandwidth());

    sptPer.stackedG.append("g")
        .selectAll("g")
        .data(d3.stack().keys(sptPer.stackedKeys)(sptPer.dataset))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return sptPer.zScale(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return sptPer.yScale(d.data.Type);
        })
        .attr("x", function (d) {
            return sptPer.xScale(d[0] / d.data["Total"] * 100);
        })
        .attr("width", function (d) {
            return sptPer.xScale(d[1] / d.data["Total"] * 100) - sptPer.xScale(d[0] / d.data["Total"] * 100);
        })
        .attr("height", sptPer.yScale.bandwidth());

    sptPer.stackedG.selectAll("text")
        .data(sptPer.dataset)
        .enter()
        .append("text")
        .attr("y", function (d) {
            return sptPer.yScale(d.Type) + 40;
        })
        .attr("x", function (d) {
            return 150;
        })
        .attr("font-size", "20px")
        .text(function (d) {
            return d.Total;
        })
        .style("fill", "white")
        .style("font-size", "35px");

    sptPer.stackedG.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .style("font-size", "15px")
        .call(d3.axisLeft(sptPer.yScale))
        .append("text")
        .attr("y", 2)
        .attr("x", sptPer.xScale(sptPer.xScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-size", "20px")
        .text("Species Type")
        .attr("z-index", "-1")
        .attr("transform", "translate(" + (-80) + ",450) rotate(-90)");

    sptPer.stackedG.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (sptPer.stackedGraphHeight / 2 + 145) + ")")
        .style("font-size", "15px")
        .call(d3.axisBottom(sptPer.xScale).ticks(null, "s"))
        .append("text")
        .attr("y", 2)
        .attr("x", sptPer.xScale(sptPer.xScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-size", "20px")
        .text("Percentage of Each Category")
        .attr("transform", "translate(" + (-sptPer.stackedGraphWidth + 400) + ",35)");

    var legend = sptPer.stackedG.append("g")
        .attr("font-size", 13)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(sptPer.stackedKeys.slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * 25) + ")";
        });

    legend.append("rect")
        .attr("x", 482)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", sptPer.zScale);

    legend.append("text")
        .attr("x", 480)
        .attr("y", 15)
        .attr("dy", "0.1em")
        .text(function (d) {
            return d;
        });

    sptPer.stackedG.append("text")
        .attr("x", ( -20))
        .attr("y", 0 - (sptPer.stackedSvgMargin.top - 450))
        .style("font-size", "15px")
        .text("*The number in white indicates the total number of animals of each species")
    return true;
}

export {drawStackedPlot}