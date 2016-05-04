//Load data
			function loadMultiple(error, data) {
			if (error) throw error;

				//Dimensions and padding
			var fullwidth = 500;
			var fullheight = 450;
			var margin = {top: 20, right: 10, bottom: 40, left: 70};

			var width = fullwidth - margin.left - margin.right;
			var height = fullheight - margin.top - margin.bottom;

			//Set up date formatting and years
			var dateFormat = d3.time.format("Year %Y");
			var outputFormat = d3.time.format("%Y");

			// My shortcut for the scale is to list the first and last only - will set the extents.
			// Also, I set the earlier year to 1999 to get a little spacing on the X axis.
			var years = ["Year 1998", "Year 2011"];

			//Set up scales - I already know the start and end years, not using data for it.
			var xScale = d3.time.scale()
								.range([ 0, width ])
								.domain(
									d3.extent(years, function(d) {
									return dateFormat.parse(d);
									}));

			// don't know the yScale domain yet. Will set it with the data.
			var yScale = d3.scale.linear()
								.range([ 0, height ]);

			//Configure axis generators
			var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(9)
							.tickFormat(function(d) {
								return outputFormat(d);
							})
							.innerTickSize([0])
							.outerTickSize([0]);

			var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.innerTickSize([0])
							.outerTickSize([0]);


			//Configure line generator
			// each line dataset must have an x and y for this to work.
			var line = d3.svg.line()
				.x(function(d) {
					return xScale(dateFormat.parse(d.Year));
				})
				.y(function(d) {
					return yScale(+d.Measles);
				});


			// add a tooltip to the page - not to the svg itself!
			var tooltip = d3.select("body")
      	.append("div")
      	.attr("class", "mytooltip");

			//Create the empty SVG image
			var svg = d3.select("#lineTransition")
						.append("svg")
						.attr("width", fullwidth)
						.attr("height", fullheight)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// Notice what happens if you don't sort by year :)
				var dataset =  d3.nest()
						.key(function(d) {
							return d.Country;
						})
						.sortValues(function (a, b) { return dateFormat.parse(a.Year) - dateFormat.parse(b.Year)})
						.entries(data);

				// doing the max on the unnested data - easier to get the full set of Measles that way!
				yScale.domain([
					d3.max(data, function(d) {
							return +d.Measles;
					}),
					4000000
				]);

				function get_values_for_country(country) {
				// Helper function to get the values from the data object that has the country key
				// special case for id's with too many words in them, sadly:
					if (country === "Metrobus") {
						country = "Metrobus";
					}
					return dataset.filter(function (d) {
										return d.key == country;
									})[0].values;
				};

				// Default on first load is Congo- using a helper function:
				var metrobus = get_values_for_country("Metrobus");

				svg.selectAll("path")
					.data( [data] )
					.enter()
					.append("path")
					.attr("class", "line")
					.attr("d", line);

				// set the button to show the default country selected:
				d3.select("button#Metrobus").classed("selected", true);

				//Axes
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height  + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				d3.selectAll("button").on("click", function() {
					// Handle the button click to change the data set.
					var selectedline = d3.select("path.line");
					var thisButton = d3.select(this);

					// current attr "id" is returned if you don't set it to anything!
					var newdata = get_values_for_country(thisButton.attr("id"));  // the id has to match the country name for this to work.

					d3.selectAll("button").classed("selected", false);
					thisButton.classed("selected", true);
					selectedline
						.transition()
						.duration(2000)
						.attr("d", line(newdata));

					
				});
		return loadMultiple;
	


			}; // end of data csv

			// end of data csv