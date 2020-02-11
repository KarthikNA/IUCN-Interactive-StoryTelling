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
        this.chartOverviewPadding = {top: 20, right: 20, bottom: 60, left: 60};
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

d3.csv('./data-csv/Table1b.csv').then((dataset) => {
    console.log(dataset);

    chartOverviewInstance.setDataset(dataset);

    // nest by species
    chartOverviewInstance.chartOverviewspecies = ['Mammals', 'Birds', 'Amphibians', 'Reptiles', 'Fishes'];
    let speciesInformation = {};

    // get data for each species per year
    chartOverviewInstance.chartOverviewspecies.forEach(s => {
        speciesInformation[s] = [];
        dataset.filter(d => d.AssessType === 'Total threatened').forEach(d => {
            let obj = {};
            obj.year = +d['Year'];
            obj.qty = +d[s];
            obj.species = s;
            speciesInformation[s].push(obj);
        });
        // sort the array based on years
        speciesInformation[s].sort((a, b) => a.year - b.year);
    });

    console.log(speciesInformation);
    
    let threatenedAmount = []
    chartOverviewInstance.chartOverviewspecies.forEach(s => {
        speciesInformation[s].forEach(d => {
            // add the species population to list
            threatenedAmount.push(+d.qty);
        });
    });

    let dateExtent = d3.extent(dataset.map(d => +d['Year']));
    let threatenedExtent = d3.extent(threatenedAmount);

    let xScale =  d3.scaleLinear()
                    .domain(dateExtent)
                    .range([0, chartOverviewInstance.chartOverviewWidth])
    let yScale = d3.scaleLinear()
                    .domain(threatenedExtent)
                    .range([chartOverviewInstance.chartOverviewHeight, 0])
    
    chartOverviewInstance.setScale(xScale, yScale);

    let nested = d3.nest()
                .key(function(d) {
                    return d.company; // Nest by company name
                })
                .entries(speciesInformation);

    let statistics = [];
    Object.keys(speciesInformation).forEach((s, index) => {
        statistics.push({key: s, value: speciesInformation[s], species: s});
    });

    console.log(statistics);

    chartOverviewInstance.slideOneChart = chartOverviewInstance.chartOverviewsvg.selectAll('.chart')
        .data(statistics)
        .enter()
        .append('g')
        .attr('class', 'chart')
        .attr('transform', function(d,i) {
            var tx =  chartOverviewInstance.chartOverviewPadding.right + chartOverviewInstance.chartOverviewPadding.left;
            var ty =  chartOverviewInstance.chartOverviewPadding.top;
            return 'translate('+[tx, ty]+')';
        });

    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    chartOverviewInstance.slideOneChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+chartOverviewInstance.chartOverviewHeight+')')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    chartOverviewInstance.slideOneChart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);
    

    chartOverviewInstance.slideOneChart.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate('+[chartOverviewInstance.chartOverviewWidth / 2, chartOverviewInstance.chartOverviewHeight + 34]+')')
        .text('Year');

    chartOverviewInstance.slideOneChart.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate('+[-50, chartOverviewInstance.chartOverviewHeight / 2 + chartOverviewInstance.chartOverviewPadding.bottom]+') rotate(270)')
        .text('No of threatened species');

    // for each species: 
    /*
     * Mammals, Birds, Amphibians, Fishes, Reptiles 
     ['gray', 'yellow', 'green' ,'blue','brown']
     */

    let colorScheme = ['#ddd', '#f3bb09','#129812','#0c0cca','#771e1e']
    chartOverviewInstance.chartOverviewColorScale = d3.scaleOrdinal(colorScheme)
        .domain(chartOverviewInstance.chartOverviewspecies);
    
    // drawLinePlotForOverview(chartOverviewInstance.chartOverviewspecies, chartOverviewColorScale); 
    
});

function drawLinePlotForOverview() {

    let lineInterpolate = d3.line()
                .x(function(d) { return chartOverviewInstance.xScale(d.year); })
                .y(function(d) { return chartOverviewInstance.yScale(d.qty); });

    if(chartOverviewInstance.slideOneChart === '') {
        return false;
    }
    chartOverviewInstance.slideOneChart.selectAll('.line-plot')
        .data(d => [d.value])
        .enter()
        .append('path')
        .attr('class', 'line-plot')
        .attr('id', d=>d[0].species)
        .attr("data-legend",d=>d[0].species)
        .attr('d', lineInterpolate)
        .style('stroke', d => chartOverviewInstance.chartOverviewColorScale(d[0].species));

    d3.selectAll('.line-plot').each((d, i) => {
        if(d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).node() == null) {
            return ;
        }
        let totalLength = d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).node().getTotalLength();
        d3.select('#' + chartOverviewInstance.chartOverviewspecies[i]).attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(5000)
            .delay(1000 * i)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
    });

    let legendRectSize = 12;
    let legendSpacing = 2;
    // let legend = chartOverviewInstance.chartOverviewsvg.selectAll('.legend')
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



export {drawLinePlotForOverview}