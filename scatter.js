if(!d3.chart) d3.chart = {};

d3.chart.scatter = function() {
  var g;
  var data;
  var width = 400;
  var height = 400;
  var cx = 50;
  var dispatch = d3.dispatch(chart, "hover");



  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    g.append("g")
    .classed("yaxis", true)

    update();
  }
  chart.update = update;
  function update() {


    var mathScale = d3.scale.linear()
        .domain([0, 100])
        .range([cx, width])

    var writingScale = d3.scale.linear()
        .domain([0,100])
        .range([3, 12])

    var readingScale = d3.scale.linear()
        .domain([0, 100])
        .range([height, cx])

  
    var xAxis = d3.svg.axis()
    .scale(mathScale)

    var yAxis = d3.svg.axis()
    .scale(readingScale)
    .orient("left")

    var xg = g.select(".xaxis")
      .classed("axis", true)
      .attr("transform", "translate(" + [0,height] + ")")
      .transition()
      .call(xAxis)

    var yg = g.select(".yaxis")
      .classed("axis", true)
      .classed("yaxis", true)
      .attr("transform", "translate(" + [cx - 5,0] + ")")
      .transition()
      .call(yAxis)

    var circles = g.selectAll("circle")
    .data(data, function(d) { return d.mathScore })

    circles.enter()
    .append("circle")

    circles
        .transition()
        .attr({
          cx: function(d,i) { return mathScale(d.mathScore) },
          cy: function(d,i) { return readingScale(d.readingScore) },
          r: function(d) { return writingScale(d.writingScore)}
        })
        .style ("fill", function(d) {
          if (d.gender == "female") {
            return "#ff6e60"
          } else {
            return "#3b70b1"
          }
        })
	    .style("opacity", "0.8")

    circles.exit().remove()

    circles.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      dispatch.hover([d])
    })
    circles.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.hover([])
    })

    g.selectAll("circle")
      .style("fill", function(d) {
        if (d.gender == "female") {
          return "#ff6e60"
        } else {
          return "#3b70b1"
        }
      })
        .style("opacity", "0.8")

  }

  chart.highlight = function(data) {
    var circles = g.selectAll("circle")
    .style("stroke", "")

    circles.data(data, function(d) { return d.mathScore })
    .style("stroke", "orange")
    .style("stroke-width", 3)
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");


}