function barChart(data, target, options) {

	dispatch.on("load.bar", function(stateById) {
		var svg = d3.select(target).append("svg")
			.attr("width",  options.w )
			.attr("height", options.h )
			.attr("class", "bar");
		
		var height = options.h;
		var width = options.w;

		var fill = d3.scaleOrdinal(d3.schemeCategory10);
		
		var x = d3.scaleBand()
			.domain(data.map(d => d.Name))
			.range([30, width - 30]);

		
		var y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.Value)]).nice()
			.range([height - 30, 30]);
		
		var xAxis = g => g
			.attr("transform", `translate(0,${height - 30})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));
		
		var yAxis = g => g
			.attr("transform", `translate(${30},0)`)
			.call(d3.axisLeft(y));



		svg.append("g")
			.call(xAxis);

		var temp = svg.append("g")
					.call(yAxis);


		//console.log(data);

		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", d => x(d.Name))
			.attr("y", d => y(d.Value))
			.attr("height", d => y(0) - y(d.Value))
			.attr("width", x.bandwidth())
			.attr("fill", "None")
			.attr("fill", function(d, i) { return fill(i); });
		
		dispatch.on("statechange.bar", function(d) {
	    // rect.transition()
	    //     .attr("y", y(d.total))
	    //     .attr("height", y(0) - y(d.total));
		}

	});

}