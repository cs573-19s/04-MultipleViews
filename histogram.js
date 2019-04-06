if(!d3.chart) d3.chart = {};

d3.chart.histogram = function() {
  var g;
  var data;
  var width = 300;
  var height = 300;
  var cx = 50;
  var numberBins = 5;
  var dispatch = d3.dispatch(chart, "hover");


  function chart(container) {
    g = container;

    update();
  }
  chart.update = update;
  function update() {

    var races = {
      "group A": 0,
      "group B": 0,
      "group C": 0,
      "group D": 0,
      "group E": 0,
    }

    for (var i = 0; i < data.length; i++) {
      races[data.race]++
    }

    var races = {
      "group A" : 1,
      "group B" : 2,
      "group C" : 3,
      "group D" : 4,
      "group E" : 5,

    }

    var hist = d3.layout.histogram()
        .value(function(d) { return races[d.race] })
        .range([1, 5])
        .bins(numberBins);
    var layout = hist(data);

    var maxLength = d3.max(layout, function(d) { return d.length });
    var widthScale = d3.scale.linear()
        .domain([0, maxLength])
        .range([0, width])

    var yScale = d3.scale.ordinal()
        .domain(d3.range(numberBins))
        .rangeBands([height, 0], 0.1)


    var colorScale = d3.scale.ordinal()
        .domain([4, 3, 2, 1, 0])
        .range(["#C6867D","#CC9A92","#D8A9A3","#D1CFC3","#C6C4B7"]);


    var rects = g.selectAll("rect")
        .data(layout)

    rects.enter().append("rect")

    rects
        .transition()
        .attr({
          y: function(d,i) {
            return yScale(i)
          },
          x: 50,
          height: yScale.rangeBand(),
          width: function(d,i) {
            return widthScale(d.length)
          },

          fill: function(d,i ){
            return colorScale(i);

          }

        });
    rects.exit().transition().remove();


    rects.on("mouseover", function(d) {
      d3.select(this).style("fill", "orange")
      dispatch.hover(d)
    })
    rects.on("mouseout", function(d) {
      d3.select(this).style("fill", "")
      dispatch.hover([])
    })
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