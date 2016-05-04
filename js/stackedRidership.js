function loadIntroGraph(error, data) {
  

 data.sort(function(a, b) {return d3.ascending(a.City,b.City);});

var cities = ["Metrobus","Metrorail","Metromover","STS"];

var currentMode = "bycount";

var fullwidth = 500, fullheight = 300;

var margin = {top: 10, right: 170, bottom: 80, left: 80},
    width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .3);

var yScale = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize([0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".2s")); // for the stacked totals version

var stack = d3.layout
    .stack(); // default view is "zero" for the count display.

var svg = d3.select("#chart").append("svg")
    .attr("width", fullwidth)
    .attr("height", fullheight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var mytooltip = d3.select("body").append("div").attr("class", "mytooltip");

color.domain(cities);

  xScale.domain(data.map(function(d) { return d.City; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .attr("dy", ".5em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("fill", "#FFFFFF")
      .style("text-anchor", "end")
      .text("Ridership");

  transitionCount(); // this will use the by-count stack, and make the data, and draw.

  drawLegend();

  d3.selectAll("input").on("change", handleFormClick);

  function handleFormClick() {
    if (this.value === "bypercent") {
      currentMode = "bypercent";
      transitionPercent();
    } else {
      currentMode = "bycount";
      transitionCount();
    }
  }


  function makeData(cities, data) {
    return cities.map(function(city) {
        return data.map(function(d) {
          return {x: d.City, y: +d[city], city: city};
        })
      });
  }


  function transitionPercent() {

    yAxis.tickFormat(d3.format("%"));
    stack.offset("expand");  // use this to get it to be relative/normalized!
    var stacked = stack(makeData(cities, data));
    // call function to do the bars, which is same across both formats.
    transitionRects(stacked);
  }

  function transitionCount() {

    yAxis.tickFormat(d3.format(".2s")); // for the stacked totals version
    stack.offset("zero");
    var stacked = stack(makeData(cities, data));
    transitionRects(stacked);

    }

  function transitionRects(stacked) {

    // this domain is using the last of the stacked arrays, which is the last city, and getting the max height.
    yScale.domain([0, d3.max(stacked[stacked.length-1], function(d) { return d.y0 + d.y; })]);

    var city = svg.selectAll("g.city")
      .data(stacked);

    city.enter().append("g")
      .attr("class", "city")
      .style("fill", function(d, i) { return color(d[0].city); });

  // then data for each, plus mouseovers - a nested selection/enter here
   city.selectAll("rect")
      .data(function(d) {
        console.log("array for a rectangle", d);
        return d; })  // this just gets the array for bar segment.
    .enter().append("rect")
      .attr("width", xScale.rangeBand())
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    // the thing that needs to transition is the rectangles themselves, not the g parent.
    city.selectAll("rect")
      .transition()
      .duration(250)
      .attr("x", function(d) {
        return xScale(d.x); })
      .attr("y", function(d) {
        return yScale(d.y0 + d.y); }) //
      .attr("height", function(d) {
        return yScale(d.y0) - yScale(d.y0 + d.y); });  // height is base - tallness

    city.exit().remove(); // there's actually nothing removed here - we just transition.

    svg.selectAll(".y.axis").transition().call(yAxis);
  }

  function drawLegend() {

    // reverse to get the same order as the bar color layers
    var cities_reversed = cities.slice().reverse();

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

  function mouseover(d) {
  // this will highlight both a dot and its line.

  var number;

  d3.select(this)
    .transition()
    .style("stroke", "black");

  if (currentMode == "bypercent") {
    number = d3.format(".1%")(d.y);
  } else {
    number = d.y;
  }

  mytooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p><b>Mode of Public Transportation:</b> " + d.city.replace(/_/g, " ") +
          "<br><b>Ridership:</b> " + number +
          "<br><b>Day of the Week:</b> " + d.x + " </p>");
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

  return loadIntroGraph;

}; //end stacked bar;