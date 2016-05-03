function loadAnnualBus(error, annualR) {
  if (error) throw error;

  var fullwidth = 700;
  var fullheight = 300;
  var margin = { top: 20, right: 10, bottom: 50, left: 100};

  var width = fullwidth - margin.left - margin.right;
  var height = fullheight - margin.top - margin.bottom;


//Set up date formatting and years
var dateFormat = d3.time.format("%Y");

var xScale = d3.time.scale()
                .range([ 0, width ]);

var yScale = d3.scale.linear()
                .range([ 0, height ]);

var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(8)
              .tickFormat(function(d) {
                return dateFormat(d);
              });

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

var line = d3.svg.line()
        .x(function(d) {
          return xScale(dateFormat.parse(d.year));
        })
        .y(function(d) {
          return yScale(d.Metrobus);
        });

var mytooltip = d3.select("body")
        .append("div")
        .attr("class", "mytooltip");

var svg = d3.select("#secondLineChart")
            .append("svg")
            .attr("width", fullwidth)
            .attr("height", fullheight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // get the min and max of the years in the data, after parsing as dates!
xScale.domain(d3.extent(annualR, function(d){
            return dateFormat.parse(d.year);
            })
        );

        // the domain is from the max of the ridership to 0 - remember it's reversed.
yScale.domain([ d3.max(annualR, function(d) {
            return +d.Metrobus;
          }),
         70000000
        ]);

        //Line
        //

        // Lines take a single array of data as their input.  So we don't give it data(data).

        // you could do this:
        // .data([data])
        // or use the d3 "datum" which is for single data elements.

        svg.datum(annualR)
          .append("path")
          .attr("class", "line us")
          .attr("d", line)  // line is a function that will operate on the data array, with x and y.
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1);
          //.attr("transform", "translate(0," - height + ")");

        // dots go on top of the line!

       var circles = svg.selectAll("circle")
                .data(annualR)
                .enter()
                .append("circle");

        circles.attr("cx", function(d) {
            return xScale(dateFormat.parse(d.year));
          })
          .attr("cy", function(d) {
            return yScale(d.Metrobus);
          })
          .attr("r", 3)
          .style("opacity", 0); // this is optional - if you want visible dots or not!


        circles
          .on("mouseover", mouseoverFunc)
          .on("mousemove", mousemoveFunc)
          .on("mouseout", mouseoutFunc);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);


  function mouseoverFunc(d) {
    // Adding a subtle animation to increase the dot size when over it!
      d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)
        .attr("r", 7);
      mytooltip
        .style("display", null) // this removes the display none setting from it
        .html("<p><b>Year:</b> " + d.year +
              "<br><b>Total:</b> " + d.Metrobus + " riders</p>");
      }

  function mousemoveFunc(d) {
      mytooltip
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
    }

  function mouseoutFunc(d) {
    // shrink it back down:
      d3.select(this)
        .transition()
        .style("opacity", 0)
        .attr("r", 3);
      mytooltip.style("display", "none");  // this sets it to invisible!
    }

    return loadAnnualBus;
    
}; //end line chart