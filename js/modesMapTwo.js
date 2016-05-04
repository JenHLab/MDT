function loadMapTwo(dadeM, metromover, metrobus) {

  //global variables for map svgs for bus, metrorail and metromover stations
var width = 410,
    height = 600;

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
  var metrobussvg= d3.select("#metromoverInfo").append("svg")
                        .attr("width", width)
                        .attr("height", height);

  // Append Div for mytooltip to metrobuslsvg
  var div = d3.select("#metromoverInfo")
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
        .data(metromover)
        .enter()
        .append("circle")
        .style("fill", '#ff8c00')
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 5);

  metrobussvg.selectAll("circle")
        .data(metrobus)
        .enter()
        .append("circle")
        .style("opacity", 0.2)
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 1);


  

        return loadMapTwo;
      
}; // end loaded for metromover station map;