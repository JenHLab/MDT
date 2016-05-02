function loadVoronoi(error, data) {
  if (error) throw error;

//Dimensions and padding
            var fullwidth = 700;
			var fullheight = 600;
			var margin = { top: 20, right: 30, bottom: 40, left: 100};

			var width = fullwidth - margin.left - margin.right;
			var height = fullheight - margin.top - margin.bottom;
           
			//Set up date formatting and years
			var dateFormat = d3.time.format("%Y");

			var xScale = d3.time.scale()
								.range([ 0, width]);

			var yScale = d3.scale.linear()
								.range([ 10, height]);
                                

		//Configure axis generators
			var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(8)
							.tickFormat(function(d) {
								return dateFormat(d);
							})
							.innerTickSize([5]);

			var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.innerTickSize([5]);


			//Configure line generator
			// each line dataset must have a d.year and a d.amount for this to work.
			var line = d3.svg.line()
				            .x(function(d) {
					           return xScale(dateFormat.parse(d.year));
				            })
				            .y(function(d) {
					           return yScale(+d.amount);
				            });


			// add a mytooltip to the page - not to the svg itself!
			var mytooltip = d3.select("body")
      	                     .append("div")
      	                     .attr("class", "mytooltip");

			//Create the empty SVG image
			var svg = d3.select("#voronoiChart")
						.append("svg")
						.attr("width", fullwidth)
						.attr("height", fullheight)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			

				//Data is loaded in, but we need to restructure it.
				var years = d3.keys(data[0]).slice(0); //

				//Create a new, empty array to hold our restructured dataset
				var dataset = [];

				//Loop once for each row in data
				data.forEach(function (d, i) {

					var routeRidership = [];

				//Loop through all the years - and get the emissions for this data element
					years.forEach(function (y) {

				// If value is not empty
						if (d[y]) {
				//Add a new object to the new emissions data array - for year, amount
							routeRidership.push({
								route: d.busRoute,
								year: y,
								amount: d[y]  // this is the value for, for example, d["2004"]
 							});
						}
					});

				//Create new object with this route's name and empty array
                // d is the current data row... from data.forEach above.
					dataset.push( {
						route: d.busRoute,
						ridership: routeRidership  // we just built this!
						} );
				}); // end of the data.forEach loop

				//Uncomment to log the original data to the console
				// console.log(data);

				//Uncomment to log the newly restructured dataset to the console
				console.log(dataset);


				//Set scale domains - max and min of the years
				xScale.domain(
					d3.extent(years, function(d) {
						return dateFormat.parse(d);
					}));

				// max of emissions to 0 (reversed, remember) - [max, 0] for y scale
				yScale.domain([ d3.max(dataset, function(d) {
						return d3.max(d.ridership, function(d) {
				        return +d.amount;
						});
					}),
					1000 // starting point for xaxis scale
				]);


				//Make a group for each country - just for the data binding  
                var groups = svg.selectAll("g.lines")
					            .data(dataset)
					            .enter()
					            .append("g")
					            .attr("class", "lines");


				//Within each group, create a new line/path,
				//binding just the emissions data to each one
				groups.selectAll("path")
					   .data(function(d) { // because there's a group with data per country already...
						return [ d.ridership]; // it has to be an array for the line function
					})
					   .enter()
					   .append("path")
					   .attr("class", "line")
					   .attr("d", line); // calls the line function you defined above, using that array

                svg.append("text")
                    .attr("x", (width - 660))             
                    .attr("y", 7 - (margin.top / 2))
                    .style("font-weight", "bold") 
                    .style("font-size", "19px") 
                    .style("fill", "#0365d4");  
                    /*.text("Theme route Visitors 2007-2014");*/
				//Axes
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height  + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);


				// here we add the mouseover and mouseout effect, and use the id we created to style it.
				// this is on the g elements, because the country name is in the data there.
				// the line itself has data of an array of x,y values.
				d3.selectAll("g.lines")
					.on("mouseover", mouseoverFunc)
					.on("mouseout", mouseoutFunc)
					.on("mousemove", mousemoveFunc);  // this version calls a named function.


	            function mouseoverFunc(d) {
		       // line styling:
		       // this is the g element. select it, then the line inside it!
		       // console.log(d, this);

		          d3.selectAll("path.line").classed("unfocused", true);
		      // now undo the unfocus on the current line and set to focused.
		          d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);
                    
		          mytooltip.style("display", null) // this removes the display none setting from it
			             .html("<p>" + d.route + "</p>");
            
	           }

	            function mouseoutFunc() {
			   // this removes special classes for focusing from all lines. Back to default.
			    d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
			    mytooltip.style("display", "none");  // this sets it to invisible!
	           }

	            function mousemoveFunc(d) {
		        //console.log("events", window.event, d3.event);
		        mytooltip.style("top", (d3.event.pageY - 10) + "px" )
			           .style("left", (d3.event.pageX + 10) + "px");
	           }

	           return data;
    
};