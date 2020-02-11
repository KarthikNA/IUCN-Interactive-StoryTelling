
        // The svg
        // var innerSvg = d3.select("div").append("svg").attr("width",600).attr("height",600).attr("transform","translate(-300,0)");
        // var svg = d3.select("div").append("svg").attr("width",600).attr("height",600).attr("transform","translate(-300,-150)");
        var svg = d3.select('svg');
           var width = 1100;
            var height = 800;
        var activeMapType = 'Mammals';
        var expressed ='mammals';
        // Map and projection
        var path = d3.geoPath();
        var projection = d3.geoNaturalEarth()
            .scale(width / 2 / Math.PI)
            .translate([width / 2, height / 2])
        var path = d3.geoPath().projection(projection);
        var toolTip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([0, 0])
                .direction('s')
                .html(function (d) {
                    var Name = d["properties"].name;
                    var mammals = d.mammals;
                    var birds = d.birds;
                    var amphibians = d.amphibians;
                    var reptiles = d.reptiles;
                    if(expressed == 'mammals')
                    {
                        return  Name +
                        "</br> " + mammals
                    }
                    if(expressed == 'reptiles')
                    {
                        return Name +
                            "</br>" + reptiles
                    }
                    if(expressed == 'birds')
                    {
                        return Name +
                            "</br> " + birds
                    }
                    if(expressed == 'amphibians')
                    {
                        return  Name +
                            "</br>: " + amphibians 
                    }
                });
        function colorScale( category){
            var color;
            // depending on category, choose the domain
            if(category == 'mammals'){
                color = d3.scaleSequential(d3.interpolateReds)
                    .domain(mammalsExtent);
            }
            if(category == 'birds') {
                color = d3.scaleSequential(d3.interpolateReds)
                    .domain(BirdExtent);
            }
            if(category == 'reptiles') {
                color = d3.scaleSequential(d3.interpolateReds)
                    .domain(ReptilesExtent);
            }
            if(category == 'amphibians') {
                color = d3.scaleSequential(d3.interpolateReds)
                    .domain(AmphibiansExtent);
            }
            return color;
        }
        function createLegend(color, extentValue){
            var colorNew = color.domain(extentValue);
            var cb = d3.colorbarV(colorNew, 20,450);
            svg.append("g").attr("id","legend")
            .attr("transform", "translate(" + 60 + "," + 50 + ")")
            .call(cb);
        }
//         function createSparkLine(d,i){
//       var datanew = [{ year: 1993,
//         value : +d.y1993
       
//       },
//           { year: 1994,
//         value : +d.y1994
//       },
//        { year: 1995,
//         value : +d.y1995
//         },
//       { year: 1996,
//         value: +d.y1996
//       },
//       { year:1997,
//         value: +d.y1997
//       },
//           { year:1998,
//         value : +d.y1998
//       },
//        { year:1999,
//         value : +d.y1999
        
//       },
//       { year:2000,
//         value : +d.y2000
//       },
//       { year:2001,
//         value : +d.y2001
       
//       },
//       { year:2002,
//         value:+d.y2002
//       },
//             { year: 2003,
//                 value:+d.y2003
       
//       },
//        { year:2004,
//        value:+d.y2004
//       },
//       { year:2005,
//        value:+d.y2005
//       },
//       { year:2006,
//         value:+d.y2006
//       },
//       { year:2007,
//         value : +d.y2007
//       },
//        { year:2008,
//         value : +d.y2008
//       },
//        { year:2009,
//        value:+d.y2009
//       },
//       { year:2010,
//        value:+d.y2010
//       },
//       { year:2011,
//         value:+d.y2011
//       },
//       { year:2012,
//         value : +d.y2012
//       },
//        { year:2013,
//         value : +d.y2013
//       },
//       { year:2014,
//         value:+d.y2014
//       },
//       { year:2015,
//         value : +d.y2015
//       },
//        { year:2016,
//         value : +d.y2016
//       }
//     ];
// var xScale = d3.scaleLinear()
//     .domain(d3.extent(datanew.map(d=> d.year)))
//     .range([0,200]);
//     var yScale = d3.scaleLinear()
//     .domain(d3.extent(datanew.map(d=> d.value)))
//     .range([0,900]);
//     var todayLine = d3.line()
//         .x(function(d) {
//             console.log(xScale(d.year));
//             return xScale(d.year);})
//         .y(function(d) {
//             console.log(yScale(d.value));
//             return yScale(d.value);});
    
//     svg.append("path")
//             .data([datanew])
//             .attr("class","line")
//             .attr("id","line-plot")
//             .attr("d",todayLine)
//              .attr("stroke", "steelblue")
//              .attr("stroke-linejoin", "round")
//       .attr("stroke-linecap", "round")
//       .attr("stroke-width", 1.5)
//         }
        function mouseOverEvent(d, i){
           //createSparkLine(d,i);
            svg.call(toolTip);
            toolTip.show(d, this);
            d3.select(this)
//                         .style("stroke", "black")
//                         .style("stroke-width", 3);
//            var data =  [{
//                 "name": "Critically Endangered",
//                 "value": +d.CR,
//         },
//             {
//                 "name": "Endangered",
//                 "value": +d.EN,
//         },
//             {
//                 "name": "Vulnerable",
//                 "value": +d.VU,
//         },
//             {
//                 "name": "Low Risk",
//                 "value": +d.LR,
//         },
//             {
//                 "name": "Near Threatened",
//                 "value": +d.NT,
//         }];
//         //sort bars based on value
//         data = data.sort(function (a, b) {
//             return d3.ascending(a.value, b.value);
//         })
//        var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
// // set the ranges
// var y = d3.scaleBand()
//           .range([height, 0])
//           .padding(0.1);
// var x = d3.scaleLinear()
//           .range([0, 300]);
//   // Scale the range of the data in the domains
//   x.domain([0, d3.max(data, function(d){ return d.value; })])
//   y.domain(data.map(function(d) { return d.name; }));
//   //y.domain([0, d3.max(data, function(d) { return d.sales; })]);
// //   // append the rectangles for the bar chart
//   bar = svg.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("id","barplot")
//       //.attr("x", function(d) { return x(d.sales); })
//       .attr("width", function(d) {return x(d.value); } )
//       .attr("x", 70)
//       .attr("y", function(d,i) { return (450+(i*30))})
//       .attr("height", 20 );
    
    
 
//   // add the x Axis
//   svg.append("g")
//        .attr("id","axis1")
//       .attr("transform", "translate(70,400)")
//       .attr("x",100)
//       .attr("y",50)
//       .call(d3.axisBottom(x));
//       axisy = svg.append("g")
//        .attr("id","axis2")
//       .attr("transform", "translate(70,400)")
//       .attr("x",100)
//       .attr("y",100)
//       .call(d3.axisLeft(y))
//       axisy.append("text")
//       .data(data)
//             .attr("class", "label")
//             .attr("id","namelabel")
//             .attr("y", function(d,i) { return (400+(i*5))})
//             .attr("dy", ".35em") //vertical align middle
//             .text(function(d){
//                 console.log(d.name);
//                 return d.name;
//             });
       
        
//       //   svg.append("text")
//       //   .data(data)
//       //       .attr("class", "value")
//       //       .attr("id","valuelabel")
//       //       .attr("y", height / 2)
//       //       .attr("dx", 50) //margin right
//       //       .attr("dy", ".35em") //vertical align middle
//       //       .attr("text-anchor", "end")
//       //       .text(function(d){
//       //           return (d.value);
//       //       })
//       //       .attr("x",10);
        }
        function mouseOutEvent(d,i){
                    toolTip.hide(d, this);
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 1);
                         // svg.selectAll("#line-plot").remove()
                         // svg.selectAll("#barplot").remove()
                         //  svg.selectAll("#axis1").remove()
                         //   svg.selectAll("#axis2").remove()
                         //   svg.selectAll("#valuelabel").remove()
                         //   svg.selectAll("#namelabel").remove()
                }
        // Data and color scale
        var dataMammals = d3.map();
        var dataReptiles = d3.map();
        var dataBirds = d3.map();
        var dataAmphibians = d3.map();
        var mammalsExtent;
        var BirdExtent;
        var ReptilesExtent;
        var AmphibiansExtent;
        // var CR = d3.map();
        // var EN = d3.map();
        // var VU = d3.map();
        // var LR = d3.map();
        // var NT = d3.map();
        // var LC = d3.map();
        // var y1990 = d3.map();
        // var y1991 = d3.map();
        // var y1992 = d3.map();
        // var y1993 = d3.map();
        // var y1994 = d3.map();
        // var y1995 = d3.map();
        // var y1996 = d3.map();
        // var y1997 = d3.map();
        // var y1998 = d3.map();
        // var y1999 = d3.map();
        // var y2000 = d3.map();
        // var y2001 = d3.map();
        // var y2002 = d3.map();
        // var y2003 = d3.map();
        // var y2004 = d3.map();
        // var y2005 = d3.map();
        // var y2006 = d3.map();
        // var y2007 = d3.map();
        // var y2008 = d3.map();
        // var y2009 = d3.map();
        // var y2010 = d3.map();
        // var y2011 = d3.map();
        // var y2012 = d3.map();
        // var y2013 = d3.map();
        // var y2014 = d3.map();
        // var y2015 = d3.map();
        // var y2016 = d3.map();
        // var y2017= d3.map();
        d3.queue()
            .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
            .defer(d3.csv, "data.csv", function(d) { dataMammals.set(d.code, +d.Mammals);
                dataReptiles.set(d.code, +d.Reptiles);
                dataBirds.set(d.code, +d.Birds);
                dataAmphibians.set(d.code, +d.Amphibians);
                mammalsExtent = d3.extent(d3.values(dataMammals, function(data){
                    return d.Mammals;
                }));
                BirdExtent = d3.extent(d3.values(dataBirds, function(data){
                    return d.Birds;
                }));
                ReptilesExtent = d3.extent(d3.values(dataReptiles, function(data){
                    return d.Reptiles;
                }));
                AmphibiansExtent = d3.extent(d3.values(dataAmphibians, function(data){
                    return d.Amphibians;
                }));
            })
            // .defer(d3.csv, "2019_2_RL_Table_6a-csv.csv", function (d) {
            //     CR.set(d.code, +d.CR);
            //     EN.set(d.code, +d.EN);
            //     VU.set(d.code, +d.VU);
            //     LR.set(d.code, +d.LR);
            //     NT.set(d.code, +d.NT);
            //     LC.set(d.code, +d.LC);
            // })
        //     .defer(d3.csv,"forestcover1990-2016.csv", function (d){
        //             y1990.set(d.code, +d['1990'])
        // y1991.set(d.code, +d['1991'])
        // y1992.set(d.code, +d['1992'])
        // y1993.set(d.code, +d['1993'])
        // y1994.set(d.code, +d['1994'])
        //      y1995.set(d.code, +d['1995'])
        //       y1996.set(d.code, +d['1996'])
        // y1997.set(d.code, +d['1997'])
        // y1998.set(d.code, +d['1998'])
        // y1999.set(d.code, +d['1999'])
        // y2000.set(d.code, +d['2000'])
        // y2001.set(d.code, +d['2001'])
        // y2002.set(d.code, +d['2002'])
        // y2003.set(d.code, +d['2003'])
        // y2004.set(d.code, +d['2004'])
        // y2005.set(d.code, +d['2005'])
        // y2006.set(d.code, +d['2006'])
        // y2007.set(d.code, +d['2007'])
        // y2008.set(d.code, +d['2008'])
        // y2009.set(d.code, +d['2009'])
        // y2010.set(d.code, +d['2010'])
        // y2011.set(d.code, +d['2011'])
        // y2012.set(d.code, +d['2012'])
        // y2013.set(d.code, +d['2013'])
        // y2014.set(d.code, +d['2014'])
        // y2015.set(d.code, +d['2015'])
        // y2016.set(d.code, +d['2016'])
            //})
            .await(ready);
        function ready(error, topo) {
            if (error) throw error;
           
            var recolorMap = colorScale( 'mammals');
            createLegend(recolorMap, mammalsExtent)
            var countries = svg.append("g")
                .attr("class", "countries")
                .selectAll("path")
                .data(topo.features)
                .enter().append("path")
                .attr("fill", function (d){
                    // Pull data for this country
                    d.mammals = dataMammals.get(d.id) || 0;
                    d.reptiles = dataReptiles.get(d.id) || 0;
                    d.birds = dataBirds.get(d.id) || 0;
                    d.amphibians = dataAmphibians.get(d.id) || 0;
                    // d.CR = CR.get(d.id) || 0;
                    // d.EN = EN.get(d.id) || 0;
                    // d.VU = VU.get(d.id) || 0;
                    // d.LR = LR.get(d.id) || 0;
                    // d.NT = NT.get(d.id) || 0;
                    // d.LC = LC.get(d.id) || 0;
                    // d.y1990 = y1990.get(d.id) || 0;
                    // d.y1991 = y1991.get(d.id) || 0;
                    // d.y1992 = y1992.get(d.id) || 0;
                    // d.y1993 = y1993.get(d.id) || 0;
                    // d.y1994 = y1994.get(d.id) || 0;
                    // d.y1995 = y1995.get(d.id) || 0;
                    // d.y1996 = y1996.get(d.id) || 0;
                    // d.y1997 = y1997.get(d.id) || 0;
                    // d.y1998 = y1998.get(d.id) || 0;
                    // d.y1999 = y1999.get(d.id) || 0;
                    // d.y2000 = y2000.get(d.id) || 0;
                    // d.y2001 = y2001.get(d.id) || 0;
                    // d.y2002 = y2002.get(d.id) || 0;
                    // d.y2003 = y2003.get(d.id) || 0;
                    // d.y2004 = y2004.get(d.id) || 0;
                    // d.y2005 = y2005.get(d.id) || 0;
                    // d.y2006 = y2006.get(d.id) || 0;
                    // d.y2007 = y2007.get(d.id) || 0;
                    // d.y2008 = y2008.get(d.id) || 0;
                    // d.y2009 = y2009.get(d.id) || 0;
                    // d.y2010 = y2010.get(d.id) || 0;
                    // d.y2011 = y2011.get(d.id) || 0;
                    // d.y2012 = y2012.get(d.id) || 0;
                    // d.y2013 = y2013.get(d.id) || 0;
                    // d.y2014 = y2014.get(d.id) || 0;
                    // d.y2015 = y2015.get(d.id) || 0;
                    // d.y2016 = y2016.get(d.id) || 0;
                    return choropleth(d, recolorMap);
                })
                .attr("d", path)
                .on("mousemove", mouseOverEvent)
                .on("mouseout", mouseOutEvent);
            ;
            d3.select("select")
                .on("change", function(){
                    //svg.select('#legend').remove();
                    changeAttribute(this.value, topo);
                });
        }
        function choropleth(d, recolorMap){
            //get data value
            var value = d[expressed];
            //if value exis ts, assign it a color; otherwise assign gray
            if (value!=0) {
                return recolorMap(value);
            } else {
                return "#ffff";
            };
        };
        function changeAttribute(attribute, topo){
            expressed = attribute;
            d3.selectAll(".countries").selectAll("path").data(topo.features) //select every region
                .attr("fill", function(d) {
                    var c = colorScale(expressed)
                    if(expressed == 'mammals'){
                domain = mammalsExtent;
            }
            if(expressed == 'birds') {
                domain = BirdExtent;
            }
            if(expressed == 'reptiles') {
                domain = ReptilesExtent;
            }
            if(expressed == 'amphibians') {
                domain = AmphibiansExtent;
            }    svg.selectAll("#legend").remove()
                 createLegend(c,domain)//color enumeration units
                    return choropleth(d, c); //->
                });
        }
