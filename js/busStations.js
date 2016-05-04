function loadedBus(error, dadeM, metrobus, homes) {
  if (error) throw error;

  //global variables for map svgs for bus, metrorail and metromover stations
var width = 310,
    height = 800;

var projection = d3.geo.conicEqualArea()
      .parallels([31,25])
      .rotate([81, 0])
      .center([0, 28])
      .translate([-300, -1450])
      .scale(42000);
      /*.parallels([31,85])
      .rotate([81, 0])
      .center([0, 28])
      .translate([-600,-2540])
      .scale(66500);*/

var path = d3.geo.path()
    .projection(projection);

  //Declare metrobuslsvg and append it to metrobusInfo div
  var metrobussvg= d3.select("#metrobusInfo").append("svg")
                        .attr("width", width)
                        .attr("height", height);

  // Append Div for mytooltip to metrobuslsvg
  var div = d3.select("#metrobusInfo")
              .append("div")
              .attr("class", "mytooltip")
              .style("display", "none");


  //Append map to metrobuslsvg to plot the lat and lon of metrobus stations
  metrobussvg.selectAll("path.state")
              .data(topojson.feature(dadeM, dadeM.objects.dade).features)
              .enter().append("path")
              .attr("d", path)
              .style("stroke-opacity", 0);
              //.style("fill", 'blue');

  //Append circles to show metrorail stations and append mytooltip 

  metrobussvg.selectAll("circle")
        .data(homes)
        .enter()
        .append("circle")
        .style("fill", 'orange')
        .style("opacity", 0.7)
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 15)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  metrobussvg.selectAll("circle")
        .data(metrobus)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 1);



        


  function mouseover(d) {
  // this will highlight both a dot and its line.

  var number;

  d3.select(this)
    .transition()
    .style("stroke", "black");

  

  mytooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p><b>Mode of Public Transportation:</b> " + d.town);
  }

  function mousemove(d) {
    mytooltip
      .style("top", (d3.event.pageY - 10) + "px" )
      .style("left", (d3.event.pageX + 10) + "px");
    }

  function mouseout(d) {
    d3.select(this)
      .transition()
      .style("stroke", "none");

    mytooltip.style("display", "none");  // this sets it to invisible!
  };

  function drawLegend() {

    var legend = svg.selectAll(".legend")
        .data(cities_reversed) // make sure your labels are in the right order -- if not, use .reverse() here.
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(d)});

    legend.append("text")
        .attr("x", width + 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) { return cities_reversed[i].replace(/_/g, " "); });
  }

        return loadedBus;
      
}; // end loaded for metromover station map;