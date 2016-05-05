function loadMapOne(dadeM, metrorail, metrobus) {

  //global variables for map svgs for bus, metrorail and metromover stations
var width = 410,
    height = 500;

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
  var metrobussvg= d3.select("#metrorailInfo").append("svg")
                        .attr("width", width)
                        .attr("height", height);

  // Append Div for mytooltip to metrobuslsvg
  var mytooltip = d3.select("body")
        .append("div")
        .attr("class", "mytooltip");



  //Append map to metrobuslsvg to plot the lat and lon of metrobus stations
  metrobussvg.selectAll("path.state")
              .data(topojson.feature(dadeM, dadeM.objects.dade).features)
              .enter().append("path")
              .attr("d", path)
              .style("stroke-opacity", 0);
              //.style("fill", 'blue');

metrobussvg.selectAll("circle.metrorail")
        .data(metrorail)
        .enter()
        .append("circle")
        .attr("class", "metrorail")
        .style("fill", "#4646ff")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 5)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

  function mouseover(d) {
  // this will highlight both a dot and its line.
  d3.select(this)
    .transition()
    .style("stroke", "black");
  mytooltip
    .data(metrorail)
    .style("display", null) // this removes the display none setting from it
    .html("<p><b>Station Name:</b> " + d.name+ "<br> <b>Address:</b> " + d.address);
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
  }

        

  metrobussvg.selectAll("circle.stop")
        .data(metrobus)
        .enter()
        .append("circle")
        .attr("class", "stop")
        .style("opacity", 0.2)
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 1)
        .on("mouseover", mouseover1)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

        function mouseover1(d) {
  // this will highlight both a dot and its line.

      d3.select(this)
        .transition()
        .style("stroke", "black");
      mytooltip
        .data(metrobus)
        .style("display", null) // this removes the display none setting from it
        .html("<p><b>Stop ID:</b> " + d.stopid+ "<br> <b>Main Street:</b> " + d.main_street+ "<br> <b> Cross Street:</b> " + d.cross_street);
  }


  

        return loadMapOne;
      
}; // end loaded for metromover station map;