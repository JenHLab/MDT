function loaded(error, dadeM, metromover) {
  if (error) throw error;

  //global variables for map svgs for bus, metrorail and metromover stations
var width = 310,
    height = 400;

var projection = d3.geo.conicEqualArea()
      .parallels([31,85])
      .rotate([81, 0])
      .center([0, 28])
      .translate([-6250,-18400])
      .scale(490000);

var path = d3.geo.path()
    .projection(projection);

  //Declare metrorailsvg and append it to metrorailInfo div
  var metromoversvg = d3.select("#metromoverInfo").append("svg")
                        .attr("width", width)
                        .attr("height", height);

  // Append Div for mytooltip to metrorailsvg
  var div = d3.select("#metromoverInfo")
              .append("div")
              .attr("class", "mytooltip")
              .style("display", "none");


  //Append map to metrorailsvg to plot the lat and lon of metrorail stations
  metromoversvg.selectAll("path.state")
              .data(topojson.feature(dadeM, dadeM.objects.dade).features)
              .enter().append("path")
              .attr("d", path);

  //Append circles to show metrorail stations and append mytooltip    
  metromoversvg.selectAll("circle")
        .data(metromover)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", 3)
                       .style("fill", function(d) {
                         var returnColor;
                         if (d === 1) { returnColor = "green";
                         } else if (d === 2) { returnColor = "purple";
                         } else if (d === 3) { returnColor = "red"; }
                         return returnColor;
                      })
        .on("mouseover", function(d) {
            div.transition()
               .duration(200)
               .style("display", null);
            div.html("<p><b>Stop Name:</b> " + d.name+ "<br> <b>Address:</b> " + d.address+ "<br> <b> Loop:</b> " + d.loop)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        // fade out mytooltip on mouse out
        .on("mouseout", function(d) {
            div.transition()
               .duration(500)
               .style("display", "none");
        });

        return Mover;
      
}; // end loaded for metromover station map;