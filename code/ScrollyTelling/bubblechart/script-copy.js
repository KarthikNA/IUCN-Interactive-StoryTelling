function createBubbleChart(error, countries, continentNames) {
  var CR = countries.map(function(country) { return +country.CR; });
  var VU = countries.map(function(country){return +country.VU;});
  var meanCR = d3.mean(CR),
      CRExtent = d3.extent(CR),
      CRScaleX,
      CRScaleY;
        var meanVU = d3.mean(VU),
      VUExtent = d3.extent(VU),
      VUScaleX,
      VUScaleY;
      // var extentresult = d3.max(CRExtent,VUExtent)

  var continents = d3.set(countries.map(function(country) { return country.ContinentCode; }));
  var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(continents.values());

  var width = 1200,
      height = 800;
  var svg,
      circles,
      circleSize = { min: 10, max: 40 };
      circleRadiusScale = d3.scaleSqrt()
    .domain(CRExtent)
    .range([circleSize.min, circleSize.max]); // default 
  if(isChecked('#population')){
  circleRadiusScale = d3.scaleSqrt()
    .domain(CRExtent)
    .range([circleSize.min, circleSize.max]);
  }
  else if(isChecked('#vulnerable')){
  circleRadiusScale = d3.scaleSqrt()
    .domain(VUExtent)
    .range([circleSize.min, circleSize.max]);
  }

  var forces,
      forceSimulation;

  createSVG();
  toggleContinentKey(!flagFill());
  createCircles();
  createForces();
  createForceSimulation();
  addFlagDefinitions();
  addFillListener();
  addGroupingListeners();

  function createSVG() {
    svg = d3.select("#bubble-chart")
      .append("svg")
        .attr("width", width)
        .attr("height", height);
  }

  function toggleContinentKey(showContinentKey) {
    var keyElementWidth = 150,
        keyElementHeight = 30;
    var onScreenYOffset = keyElementHeight*1.5,
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
      var continentKeyScale = d3.scaleBand()
        .domain(continents.values())
        .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

      svg.append("g")
        .attr("class", "continent-key")
        .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
        .selectAll("g")
        .data(continents.values())
        .enter()
          .append("g")
            .attr("class", "continent-key-element");

      d3.selectAll("g.continent-key-element")
        .append("rect")
          .attr("width", keyElementWidth)
          .attr("height", keyElementHeight)
          .attr("x", function(d) { return continentKeyScale(d); })
          .attr("fill", function(d) { return continentColorScale(d); });

      d3.selectAll("g.continent-key-element")
        .append("text")
          .attr("text-anchor", "middle")
          .attr("x", function(d) { return continentKeyScale(d) + keyElementWidth/2; })
          .text(function(d) { return continentNames[d]; });

      // The text BBox has non-zero values only after rendering
      d3.selectAll("g.continent-key-element text")
          .attr("y", function(d) {
            var textHeight = this.getBBox().height;
            // The BBox.height property includes some extra height we need to remove
            var unneededTextHeight = 4;
            return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
          });
    }

    function translateContinentKey(translation) {
      continentKey
        .transition()
        .duration(500)
        .attr("transform", translation);
    }
  }

  function flagFill() {
    return isChecked("#flags");
  }

  function isChecked(elementID) {
    return d3.select(elementID).property("checked");
  }

  function createCircles() { // circles to be drawn based on what is selected
    var formatPopulation = d3.format(",");
    circles = svg.selectAll("circle")
      .data(countries)
      .enter()
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.CR); })
        .on("mouseover", function(d) {
          updateCountryInfo(d);
        })
        .on("mouseout", function(d) {
          updateCountryInfo();
        });
    updateCircles();

    function updateCountryInfo(country) { // info should depend on which radio box is checked - if VU or CR or others etc
      var info = "";
      // if (country) {
      // info = country.CountryName,  ": "+ country.CR;
      // } // BY default show CR
      if (country) {
        info = [country.CountryName, formatPopulation(country.CR)].join(": ");
       /// info = country.CountryName+ ": CR :"+ country.CR + " VU :" + country.VU;
        if(isChecked("#population"))
          info = country.CountryName+ ": "+ country.CR;
        if(isChecked("#vulnerable"))
          info = country.CountryName+ ": "+ country.VU;
      }
      d3.select("#country-info").html(info);
    }
  }

  function updateCircles() {
    circles
      .attr("fill", function(d) {
        return flagFill() ? "url(#" + d.CountryCode + ")" : continentColorScale(d.ContinentCode);
      });
  }

  function createForces() {
    var forceStrength = 0.05;

    forces = {
      combine:        createCombineForces(),
      countryCenters: createCountryCenterForces(),
      continent:      createContinentForces(),
      population:     createPopulationForces(),
      vulnerable:     createVulnerableForces() 
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
          projection = d3.geoEquirectangular()
            .scale((width / 2 - projectionMargin) / Math.PI)
            .translate([width / 2, height * (1 - projectionStretchY) / 2]);

      return {
        x: d3.forceX(function(d) {
            return projection([d.CenterLongitude, d.CenterLatitude])[0];
          }).strength(forceStrength),
        y: d3.forceY(function(d) {
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

      function left(dimension) { return dimension / 4; }
      function center(dimension) { return dimension / 2; }
      function right(dimension) { return dimension / 4 * 3; }
      function top(dimension) { return dimension / 4; }
      function bottom(dimension) { return dimension / 4 * 3; }
    }

    function createPopulationForces() {
      var continentNamesDomain = continents.values().map(function(continentCode) {
        return continentNames[continentCode];
      });
      var scaledCRMargin = circleSize.max;

      CRScaleX = d3.scaleBand()
        .domain(continentNamesDomain)
        .range([scaledCRMargin, width - scaledCRMargin*2]);
      CRScaleY = d3.scaleLinear()
        .domain(CRExtent)
        .range([height - scaledCRMargin, scaledCRMargin*2]);
      
      var centerCirclesInScaleBandOffset = CRScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function(d) {
            return CRScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
          }).strength(forceStrength),
        y: d3.forceY(function(d) {
          return CRScaleY(d.CR);
        }).strength(forceStrength)
      };
    }

  

  function createVulnerableForces() {
 var continentNamesDomain = continents.values().map(function(continentCode) {
        return continentNames[continentCode];
      });
      var scaledVUMargin = circleSize.max;

      VUScaleX = d3.scaleBand()
        .domain(continentNamesDomain)
        .range([scaledVUMargin, width - scaledVUMargin*2]);
      VUScaleY = d3.scaleLinear()
        .domain(VUExtent)
        .range([height - scaledVUMargin, scaledVUMargin*2]);
      
      var centerCirclesInScaleBandOffset = VUScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function(d) {
            return VUScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
          }).strength(forceStrength),
        y: d3.forceY(function(d) {
          return VUScaleY(d.VU);
        }).strength(forceStrength)
      };
    }
  }

  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
      .force("x", forces.combine.x)
      .force("y", forces.combine.y)
      .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(countries)
      .on("tick", function() {
        circles
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      });
  }

  function forceCollide(d) { // for default I guess? hence D.CR will be fine
    return countryCenterGrouping() || populationGrouping() || vulnerableGrouping()  ? 0 : circleRadiusScale(d.CR) + 1;
  }

  function countryCenterGrouping() {
    return isChecked("#country-centers");
  }

  function populationGrouping() {
    return isChecked("#population");
  }
  function vulnerableGrouping() {
    return isChecked("#vulnerable");
  }

  function addFlagDefinitions() {
    var defs = svg.append("defs");
    defs.selectAll(".flag")
      .data(countries)
      .enter()
        .append("pattern")
        .attr("id", function(d) { return d.CountryCode; })
        .attr("class", "flag")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("width", 1)
          .attr("height", 1)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("xlink:href", function(d) {
            return "flags/" + d.CountryCode + ".svg";
          });
  }

  function addFillListener() {
    d3.selectAll('input[name="fill"]')
      .on("change", function() {
        toggleContinentKey(!flagFill() && !populationGrouping());
        updateCircles();
      });
  }

  function addGroupingListeners() {
    addListener("#combine",         forces.combine);
    addListener("#country-centers", forces.countryCenters);
    addListener("#continents",      forces.continent);
    addListener("#population",      forces.population);
    addListener("#vulnerable",      forces.vulnerable);

    function addListener(selector, forces) {
      d3.select(selector).on("click", function() {
        updateForces(forces);
        toggleContinentKey(!flagFill() && !populationGrouping() &&!vulnerableGrouping());
        //togglePopulationAxes(populationGrouping()); axis depending on what is selected
        if(isChecked('#population')){
          togglePopulationAxes(populationGrouping());
        }
        else if(isChecked('#vulnerable'))
        toggleVulnerableAxis(vulnerableGrouping()); 
      });
    }

    function updateForces(forces) {
      forceSimulation
        .force("x", forces.x)
        .force("y", forces.y)
        .force("collide", d3.forceCollide(forceCollide))
        .alphaTarget(0.5)
        .restart();
    }

    function togglePopulationAxes(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;

      if (d3.select(".x-axis").empty()) {
        createAxesCR();
       }
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

        var xAxis = d3.axisBottom(CRScaleX)
          .ticks(numberOfTicks, tickFormat);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
          .call(xAxis)
          .selectAll(".tick text")
            .attr("font-size", "16px");

        var yAxis = d3.axisLeft(CRScaleY)
          .ticks(numberOfTicks, tickFormat);
        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(" + offScreenXOffset + ",0)")
          .call(yAxis);
      }


      function translateAxis(axis, translation) {
        axis
          .transition()
          .duration(500)
          .attr("transform", translation);
      }
    }


function toggleVulnerableAxis(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 100;

       if (d3.select(".x-axis").empty()) {
        createAxesVU();
      }
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

        var xAxis = d3.axisBottom(VUScaleX)
          .ticks(numberOfTicks, tickFormat);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
          .call(xAxis)
          .selectAll(".tick text")
            .attr("font-size", "16px");

        var yAxis = d3.axisLeft(VUScaleY)
          .ticks(numberOfTicks, tickFormat);
        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(" + offScreenXOffset + ",0)")
          .call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis
          .transition()
          .duration(500)
          .attr("transform", translation);
      }
    }
  }
}

