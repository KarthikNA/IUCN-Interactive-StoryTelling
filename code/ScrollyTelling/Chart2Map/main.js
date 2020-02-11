
class mapChloropeth {
    constructor() {
        this.mapsvg = d3.select('#map').select('svg');
        this.mapsvgWidth = +this.mapsvg.attr('width');
        this.mapsvgHeight = +this.mapsvg.attr('height');
        this.width = this.mapsvgWidth;
        this.height = this.mapsvgHeight;
        this.expressed ='mammals';
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
        this.projection = d3.geoNaturalEarth().scale(this.width/2/Math.PI).translate([this.width/2, this.height/2])//translate([this.width/2, this.height/4])
        this.path = d3.geoPath().projection(this.projection);
        this.dataMammals = d3.map();
        this.dataReptiles = d3.map();
        this.dataBirds = d3.map();
        this.dataAmphibians = d3.map();
    }

    setExpressed(expressed){
        this.expressed = expressed;
    }


    mapColorScale(category){
        var color;
        if(category == 'mammals'){
            color = d3.scaleSequential(d3.interpolateBlues)
                .domain(this.mammalsExtent);
    
        }
        if(category == 'birds') {
            color = d3.scaleSequential(d3.interpolateBlues)
                .domain(this.BirdExtent);
        }
    
        if(category == 'reptiles') {
            color = d3.scaleSequential(d3.interpolateBlues)
                .domain(this.ReptilesExtent);
        }
    
        if(category == 'amphibians') {
            color = d3.scaleSequential(d3.interpolateBlues)
                .domain(this.AmphibiansExtent);
        }
        return color;
    }
}
        
            
var mapOverViewInstance = new mapChloropeth();

function createLegend(color, extentValue){
    var colorNew = color.domain(extentValue);
    var cb = d3.colorbarV(colorNew, 20, 375);
    mapOverViewInstance.mapsvg.append("g").attr("id","legend")
    .attr("transform", "translate(" + 60 + "," + 225 + ")")
    .call(cb);
}

function mouseOverEvent(d, i){
    mapOverViewInstance.mapsvg.call(mapOverViewInstance.toolTip);
    mapOverViewInstance.toolTip.show(d);
    d3.select(this)
}

function mouseOutEvent(d,i){
    mapOverViewInstance.toolTip.hide(d, this);
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 1);
        }



function ready(topo, error) {
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
            if(mapOverViewInstance.expressed == 'mammals')
            {
                return  Name +
                "</br> " + mammals;
            }
            if(mapOverViewInstance.expressed == 'reptiles')
            {
                return Name +
                    "</br>" + reptiles;
            }
            if(mapOverViewInstance.expressed == 'birds')
            {
                return Name +
                    "</br> " + birds;
            }
            if(mapOverViewInstance.expressed == 'amphibians')
            {
                return  Name +
                    "</br>: " + amphibians ;
            }
        });
    if (error) throw error;
    var recolorMap = mapOverViewInstance.mapColorScale( 'mammals');
    createLegend(recolorMap, mapOverViewInstance.mammalsExtent);
    var countries = mapOverViewInstance.mapsvg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d){
            d.mammals = mapOverViewInstance.dataMammals.get(d.id) || 0;
            d.reptiles = mapOverViewInstance.dataReptiles.get(d.id) || 0;
            d.birds = mapOverViewInstance.dataBirds.get(d.id) || 0;
            d.amphibians = mapOverViewInstance.dataAmphibians.get(d.id) || 0;
            return choropleth(d, recolorMap);
        })
        .attr("d",  mapOverViewInstance.path)
        .on('mouseover',function(d){
            // console.log("using this");
            // mapOverViewInstance.mapsvg.call(toolTip);
            // toolTip.show(d);
            d3.select(this)
            mousehoverEvent1(d);
          })
          .on('mouseout', function(d){
            // toolTip.hide(d);
            d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 1);
            mousehoverEvent1();
          });
    d3.select("select")
        .on("change", function(){
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
        var reptiles = d.reptiles;
        // console.log(mapOverViewInstance.expressed);

        if(mapOverViewInstance.expressed == 'mammals')
        {
            info =  Name + " : " + mammals;
        }
        if(mapOverViewInstance.expressed == 'reptiles')
        {
            info =  Name + " : " + reptiles;
        }
        if(mapOverViewInstance.expressed == 'birds')
        {
            info =  Name + " : " + birds;
        }
        if(mapOverViewInstance.expressed == 'amphibians')
        {
            info =   Name + " : " + amphibians ;
        }
    }

    // var hover_text = forest.forestSvg

    var hover_text = mapOverViewInstance.mapsvg
        .selectAll(".m1")
        .data([1]);

    hover_text.exit().remove();

    var hover_text_new = hover_text.enter()
        .append("text")
        .attr("class", "m1");

    hover_text.merge(hover_text_new)
        .transition()
        .duration(300)
        .attr("x", (500))
        .attr("y", (550))
        .attr("z-index", "-1")
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .text(function (d) {
            return info;
        });
}



function choropleth(d, recolorMap){
    //get data value
    var value = d[mapOverViewInstance.expressed];
    //if value exis ts, assign it a color; otherwise assign gray
    if (value!=0) {
        return recolorMap(value);
    } else {
        return "#dddddd";
    };
};

function changeAttribute(attribute, topo){
    mapOverViewInstance.expressed = attribute;
    d3.selectAll(".countries").selectAll("path").data(topo.features) //select every region
        .attr("fill", function(d) {
            var c = mapOverViewInstance.mapColorScale(mapOverViewInstance.expressed);
            if(mapOverViewInstance.expressed == 'mammals'){
        domain = mapOverViewInstance.mammalsExtent;
    }
    if(mapOverViewInstance.expressed == 'birds') {
        domain = mapOverViewInstance.BirdExtent;
    }

    if(mapOverViewInstance.expressed == 'reptiles') {
        domain = mapOverViewInstance.ReptilesExtent;
    }

    if(mapOverViewInstance.expressed == 'amphibians') {
        domain = mapOverViewInstance.AmphibiansExtent;
    }    mapOverViewInstance.mapsvg.selectAll("#legend").remove()
         createLegend(c,domain)//color enumeration units
            return choropleth(d, c); //->

        });
}


mapOverViewInstance.promises = [d3.json("https://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
 d3.csv('./data-csv/data-map.csv')];

Promise.all(mapOverViewInstance.promises).then(function(data) { 
    topo = data[0]
    data = data[1]

    data.forEach(d => {
        mapOverViewInstance.dataMammals.set(d.code, +d.Mammals);
        mapOverViewInstance.dataReptiles.set(d.code, +d.Reptiles);
        mapOverViewInstance.dataAmphibians.set(d.code, +d.Amphibians);
        mapOverViewInstance.dataBirds.set(d.code, +d.Birds);
        mapOverViewInstance.mammalsExtent = d3.extent(d3.values(mapOverViewInstance.dataMammals, function(data){
            return d.Mammals;
        }));
        mapOverViewInstance.BirdExtent = d3.extent(d3.values(mapOverViewInstance.dataBirds, function(data){
            return d.Birds;
        }));
        mapOverViewInstance.ReptilesExtent = d3.extent(d3.values(mapOverViewInstance.dataReptiles, function(data){
            return d.Reptiles;
        }));
        mapOverViewInstance.AmphibiansExtent = d3.extent(d3.values(mapOverViewInstance.dataAmphibians, function(data){
            return d.Amphibians;
        }));
    });
    ready(topo);

})
      