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
        this.industrializationPadding = {top: 20, right: 20, bottom: 60, left: 60};
        this.industrializationwHeight = this.industrializationsvgHeight - this.industrializationPadding.top - this.industrializationPadding.bottom;
        this.industrializationWidth = this.industrializationsvgWidth- 2*this.industrializationPadding.right - 1.5*this.industrializationPadding.left;
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

d3.csv('./data-csv/industrializationdata.csv').then((dataset) => {
    
    let headerNames = d3.keys(dataset[0]);
    let uniqueIndicators = dataset

    industrializationPlotInstance.setDataset(dataset);
    
    let indicatorsId = Array.from(new Set(dataset.map(d=>d['Indicator Id'])));
    let indicators = Array.from(new Set(dataset.map(d=>d['Indicator'])));
    let indicatorsInfo = indicatorsId.map((element, index) => {
        return {
            id: element,
            name: indicators[index]
        }
    });


    // add select options
    createOptionsForSelection(indicatorsInfo);

    let countryId = Array.from(new Set(dataset.map(d=>d['Country ISO3'])));
    let countries = Array.from(new Set(dataset.map(d=>d['Country Name'])));
    let countriesInfo = countryId.map((element, index) => {
        return {
            id: element,
            code: countries[index]
        }
    });

    countriesInfo.push({
        id: 180,
        code: 'World Median',
    });
    createOptionsForCountry(countriesInfo);

    industrializationPlotInstance.setIndicators(indicatorsInfo);
    industrializationPlotInstance.setCountries(countriesInfo);

    // nest by indicator and then year
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

    industrializationPlotInstance.setIndicatorYearWiseInformation(indicatorYearWiseInformation);

  
    // nest by indicator and then country
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

    industrializationPlotInstance.setIndicatorCountryWiseInformation(indicatorCountryWiseInformation);



    // bubble plot
    // line plot
    let statistics = [];
    let paramId = 3786
    industrializationPlotInstance.prevParam = 3786;
    if(industrializationPlotInstance.industrializationChartTyep == 'line') {
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

    let valueAmount = []
    statistics.forEach(d => {
            // add the species population to list
            // valueAmount = valueAmount.concat(d['details'].map(x => +x.value));
            valueAmount = valueAmount.concat(d['values'].map(x => +x.value));
    });

    let valueExtent = d3.extent(valueAmount);

    let xScale =  d3.scaleLinear()
                    .domain(dateExtent)
                    .range([0, industrializationPlotInstance.industrializationWidth]);
    let xCountryScale =  d3.scaleLinear()
                    .domain(countryExtent)
                    .range([0, industrializationPlotInstance.industrializationWidth]);
    let yScale = d3.scaleLinear()
                    .domain(valueExtent)
                    .range([industrializationPlotInstance.industrializationwHeight, 0]);
    
    industrializationPlotInstance.setScale(xScale, yScale, xCountryScale);    

    // industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart')
    // .data(industrializationPlotInstance.indicatorCountryWiseInformation[industrializationPlotInstance.prevParam])
    // .exit()
    // .remove();

    industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart')
        .data(statistics)
        .enter()
        .append('g')
        .attr('class', 'chart')
        .attr('transform', function(d,i) {
            var tx =  industrializationPlotInstance.industrializationPadding.right + industrializationPlotInstance.industrializationPadding.left;
            var ty =  industrializationPlotInstance.industrializationPadding.top;
            return 'translate('+[tx, ty]+')';
        });

    industrializationPlotInstance.slideChart.exit().remove();

    industrializationPlotInstance.prevParam = paramId;
    
    var xAxis = d3.axisBottom(industrializationPlotInstance.xScale).tickFormat(d3.format("d"));
    
    industrializationPlotInstance.slideChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+industrializationPlotInstance.industrializationwHeight+')')
        .call(xAxis);

    var yAxis = d3.axisLeft(industrializationPlotInstance.yScale);
    industrializationPlotInstance.slideChart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);
    

    industrializationPlotInstance.slideChart.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate('+[industrializationPlotInstance.industrializationWidth / 2, industrializationPlotInstance.industrializationwHeight + 34]+')')
        .text('Year');

    industrializationPlotInstance.slideChart.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate('+[-50, industrializationPlotInstance.industrializationwHeight - 50  + industrializationPlotInstance.industrializationPadding.bottom]+') rotate(270)')
        .text(industrializationPlotInstance.indicators.find(d => +d.id === +paramId).name);



    drawLinePlotForOverview(paramId); 
}



function drawBubblePlot(statistics, paramId, yearId) {

    let dataTime = d3.range(0, 25).map(function (d) {
        return new Date(1990 + d, 10, 3);
    });
    
    let sliderTime = d3.sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(500)
        .ticks(5)
        .tickFormat(d3.timeFormat('%y'))
        .tickValues(dataTime)
        .default(new Date(2003, 10, 3))
        .on('onchange', val => {
            d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            let selected_year = d3.timeFormat('%Y')(val);
            console.log("changed year");
            let countryCodes = $('#countryParameter').val();
            buildBubblePlot(statistics, paramId, selected_year, countryCodes);
        });

    

    if($('#slider-time').find('svg').length == 0) {
        let gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', industrializationPlotInstance.industrializationWidth - 100)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(15,30)');
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

    if(countryCodes && countryCodes.length !== 0) {
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
    let xCountryScale =  d3.scaleLinear()
        .domain(countryExtent)
        .range([0, industrializationPlotInstance.industrializationWidth]);

    let valueAmount = [];
    statistics = statistics.filter(s => +s.year === +yearId)[0]['details'];
    statistics.forEach(d => {
            // add the species population to list
            // valueAmount = valueAmount.concat(d['details'].map(x => +x.value));
            valueAmount = valueAmount.concat(+d['value']);
    });

    let valueExtent = d3.extent(valueAmount);

    let xScale = d3.scaleLinear()
                    .domain(countryExtent)
                    .range([0, industrializationPlotInstance.industrializationWidth]);
    let yScale = d3.scaleLinear()
                    .domain(valueExtent)
                    .range([industrializationPlotInstance.industrializationwHeight, 0]);

    let rscale = d3.scaleSqrt().range([1, 6])
    rscale.domain(valueAmount);
    

    industrializationPlotInstance.setScale(xScale, yScale, xCountryScale);
    industrializationPlotInstance.slideChart = industrializationPlotInstance.industrializationsvg.selectAll('.chart')
        .data(statistics)
        .enter()
        .append('g')
        .attr('class', 'chart')
        .attr('transform', function (d, i) {
            var tx = industrializationPlotInstance.industrializationPadding.right + industrializationPlotInstance.industrializationPadding.left;
            var ty = industrializationPlotInstance.industrializationPadding.top;
            return 'translate(' + [tx, ty] + ')';
        });

    industrializationPlotInstance.slideChart.exit().remove();

    industrializationPlotInstance.prevParam = paramId;

    var xAxis = d3.axisBottom(industrializationPlotInstance.xScale);

    industrializationPlotInstance.slideChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + industrializationPlotInstance.industrializationwHeight + ')')
        .call(xAxis);
    var yAxis = d3.axisLeft(industrializationPlotInstance.yScale);
    industrializationPlotInstance.slideChart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(yAxis);
    industrializationPlotInstance.slideChart.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', 'translate(' + [industrializationPlotInstance.industrializationWidth / 2, industrializationPlotInstance.industrializationwHeight + 34] + ')')
        .text('Countries');
    industrializationPlotInstance.slideChart.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'translate(' + [-50, industrializationPlotInstance.industrializationwHeight / 2 + industrializationPlotInstance.industrializationPadding.bottom] + ') rotate(270)')
        .text(industrializationPlotInstance.indicators.find(d => +d.id === +paramId).name);


    // if(chartOverviewInstance.slideOneChart === '') {
    //     return false;
    // }
    industrializationPlotInstance.slideChartEnter = industrializationPlotInstance.slideChart.selectAll('circle')
        .data(d => {
            return [d];});

    
    let circleneter = industrializationPlotInstance.slideChartEnter.enter()
        .append('circle');


    let colorBrewer = d3.scaleSequential().domain([1,200])
    .interpolator(d3.interpolateYlGnBu);
    circleneter.attr('class', 'bubble')
        .attr('id', d =>{ return `${paramId}-${d['code']}`;})
        .transition()
        .duration(600)
        .attr("cx", (d) => {
            return xScale(countryIndex(d.code));
        })
        .attr("cy", function (d) {
            return yScale(d['value']);
        })
        .attr("r", 5)
        .style("fill", (d,i)=>{
            if (d.code === 180) {
                return 'red';
            }
            return colorBrewer(countryIndex(d.code));
        })
        .style('stroke', '#ccc')
        .style("opacity", 0.65);

    industrializationPlotInstance.slideChart.append('text')
        .attr('class', 'gtooltip')
        .style('font-size', '16px')
        .attr('transform', d =>{ 
            return  'translate(' + [xScale(countryIndex(d.code)), yScale(d['value'])-10] + ')'
        })
        .text(function(d){

            let country = industrializationPlotInstance.countries.find(dc => dc.id === d.code);
            if (d.code === 180) {
                country = {};
                country.code = 'World Median';
            }
            return  country.code + " in "+yearId+": "
                            + parseFloat(d['value']).toFixed(2);
        });

    // industrializationPlotInstance.industrializationsvg.selectAll('.d3-tip').remove();
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


    let lineInterpolate = d3.line()
                .x(function(d) { return industrializationPlotInstance.xScale(d.year); })
                .y(function(d) { return industrializationPlotInstance.yScale(+d.value); });

    // if(chartOverviewInstance.slideOneChart === '') {
    //     return false;
    // }
    industrializationPlotInstance.slideChartEnter = industrializationPlotInstance.slideChart.selectAll('.line-plot')
        .data(d => {
            return [d.values];});

    let colorBrewer = d3.scaleSequential().domain([1,200])
        .interpolator(d3.interpolateYlGnBu);
    let path = industrializationPlotInstance.slideChartEnter.enter()
        .append('path')
        .attr('class', 'line-plot')
        .attr('id', d => `${paramId}-${d[0].code}`)
        .attr('d', lineInterpolate)
        .style('stroke', (d,i)=> {
            if (d[0].code === 180) {
                return 'red';
            }
            return colorBrewer(countryIndex(d[0].code));
        })
        .on('mouseover', function(d, i){
            d3.select(this)                        
        	.style("stroke-width",'4px');
            let [x,y] = d3.mouse(this);
            mouseyear = Math.floor(industrializationPlotInstance.xScale.invert(x))

            let obj = d.find(c => +c.year === +mouseyear);
            let country = industrializationPlotInstance.countries.find(dc => dc.id === obj.code);
            if (obj.code === 180) {
                country = {};
                country.code = 'World Median';
            }
            let message = `${country.code} in ${obj.year}: ${parseFloat(obj.value).toFixed(2)}`;
            industrializationPlotInstance.industrializationsvg
                .append("text")
                .attr('class', 'ggtooltip')
                .attr("x", x)
                .attr("y", y-20)     
                .attr('fill', 'black')
                .text(message);  
        })
        .on('mouseout', function() {
            d3.select(this)                        
        	.style("stroke-width",'2px');
            d3.selectAll('.ggtooltip').remove();
        });

        $('#slider-time').find('svg').remove();
    
    // let toolTip = d3.tip()
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
    let arr = []
    for(let i=start; i <= end; i++){
        let value = instance[i];
        let code = instance['Country ISO3'];
        arr.push({year: i,
            value : value,
            code: code});
    }

    return arr;
}




function getMedian(information) {
    const start = 1990;
    const end = 2014;
    let yearwise = []
    for(let i=0; i <= end-start; i++){
        let year = information[i];
        let value = year['details'][142].value;
        let details = {};
        details['year'] = i+start;
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
    for(let i=start; i <= end; i++){
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
    $('#countryParameter').on('change', (event) => {
        console.log($(event.target).val());
        let countryCodes = $(event.target).val();

        let paramId = $('#industrialParameter').val();
        let chartTypeParamter = $('input[name="chartTypeParameter"]:checked').val()

        conditionalCallBack(chartTypeParamter, paramId, countryCodes);
    });

    $('#industrialParameter').on('change', (event) => {
        let paramId = $(event.target).val();
        let chartTypeParamter = $('input[name="chartTypeParameter"]:checked').val()
        let countryCodes = $('#countryParameter').val();
        conditionalCallBack(chartTypeParamter, paramId, countryCodes);
    });

    $('input[name="chartTypeParameter"]').on('change', (event) => {
        let chartTypeParameter = $(event.target).val();
        let paramId = $('#industrialParameter').val();
        let countryCodes = $('#countryParameter').val();
        industrializationPlotInstance.industrializationChartTyep = chartTypeParameter;
        // callback to rerender line graph
        conditionalCallBack(chartTypeParameter, paramId, countryCodes);
    });


});


function conditionalCallBack(chartTypeParameter, paramId, countryCodes) {
    if($('#countryParameter').val().length !== 0 && chartTypeParameter == 'line') {
        let stats = industrializationPlotInstance.indicatorCountryWiseInformation[paramId].filter(c => {
            return countryCodes.findIndex(v => v === c.code || c.code === 180) > -1
        });
        drawLineChart(stats,paramId);
    } else if(chartTypeParameter == 'line') {
        drawLineChart(industrializationPlotInstance.indicatorCountryWiseInformation[paramId],paramId)
    } else if($('#countryParameter').val().length !== 0 && chartTypeParameter == 'bubble') {
        let yearId = 2003;
        statistics = indicatorYearWiseInformation[paramId];  
        let stats = []
        statistics.forEach(s => {
            let obj = {};
            obj.year = s.year;
            obj.details = s['details'].filter(c => countryCodes.findIndex(v => v === c.code || c.code === 180) > -1);
            stats.push(obj);
        });
        drawBubblePlot(stats, paramId, yearId);
    } else if(chartTypeParameter == 'bubble') {
        let yearId = 2003;
        statistics = indicatorYearWiseInformation[paramId];  
        drawBubblePlot(statistics, paramId, yearId);
    }
}
