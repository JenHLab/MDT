function loadedRail(error, dadeM, metrorail) {
  if (error) throw error;

  var width = 310,
    height = 400;

var projection = d3.geo.conicEqualArea()
      .parallels([31,85])
      .rotate([81, 0])
      .center([0, 28])
      .translate([-700,-2540])
      .scale(71500);

var path = d3.geo.path()
    .projection(projection);

  //Declare metrorailsvg and append it to metrorailInfo div
  var metrorailsvg = d3.select("#metrorailInfo").append("svg")
                        .attr("width", width)
                        .attr("height", height);

  // Append Div for mytooltip to metrorailsvg
  var div = d3.select("#metrorailInfo")
              .append("div")
              .attr("class", "mytooltip")
              .style("display", "none");


  //Append map to metrorailsvg to plot the lat and lon of metrorail stations
  metrorailsvg.selectAll("path.state")
              .data(topojson.feature(dadeM, dadeM.objects.dade).features)
              .enter().append("path")
              .attr("d", path);

  //Append circles to show metrorail stations and append mytooltip    
  metrorailsvg.selectAll("circle")
        .data(metrorail)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 3)
        .on("mouseover", function(d) {
            div.transition()
               .duration(200)
               .style("display", null);
            div.html("<p><b>Stop Name:</b> " + d.name+ "<br> <b>Address:</b> " + d.address+ "<br> <b> Parking spaces:</b> " + d.parking)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        // fade out mytooltip on mouse out
        .on("mouseout", function(d) {
            div.transition()
               .duration(500)
               .style("display", "none");
        });

        return railStation;
      
};