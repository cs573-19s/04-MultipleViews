var svg = d3.select(".top-chart")
    .append("svg")
    .attr("transform", "translate(0,0)")
    .attr("width", 960)
    .attr("height", 400)
    ;

var dotChartWidth = 480;
var dotChartHeight = 400;

var lineChartWidth = 480;
var lineChartHeight = 400;

var brushChartWidth = 960;
var brushChartHeight = 140;

var dotR = 3.5;

var BrushChart = function () {
    var svg = d3.select(".bottom-chart")
        .append("svg")
        .attr("transform", "translate(0,0)")
        .attr("width", brushChartWidth)
        .attr("height", brushChartHeight)
        ;

    var margin = { top: 30, right: 50, bottom: 40, left: 50 },
        width = + brushChartWidth - margin.left,
        height = +brushChartHeight - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("start brush", brushed);

    svg.append("g")
        .attr("transform", "translate(" + (width / 2 ) + ",20)")
        .append("text")
        .text("Deaths")
        ;

    function brushcentered() {
        var dx = x(1) - x(0), // Use a fixed width when recentering.
            cx = d3.mouse(this)[0],
            x0 = cx - dx / 2,
            x1 = cx + dx / 2;
        d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
    }

    function brushed() {
        var extent = d3.event.selection.map(x.invert, x);
        dot.classed("selected", function (d) {
            return extent[0] <= d[0] && d[0] <= extent[1];
        });
        
        var list = [];
        d3.selectAll(".selected")
            .attr("temp", function (d) {
                list.push(d[2]);
            });
        if (list.length > 0) {
            lineChart.draw(list);
            dotChart.draw(list);
        }
    }
    var dot = g.append("g")
        .attr("fill-opacity", 0.8)
        .selectAll(".brush")
        ;

    BrushChart.prototype.draw = function (data) {
        var bData = [];
        data.forEach(function (d) {
            bData.push([d.id, d.deaths,d]);
        });

        var yMin = d3.min(data, function (d) { return d.deaths * 1; });
        var yMax = d3.max(data, function (d) { return d.deaths * 1; });

        var xMin = d3.min(data, function (d) { return d.id * 1; });
        var xMax = d3.max(data, function (d) { return d.id * 1; });
        y.domain([yMin, yMax]);
        x.domain([xMin, xMax]);

        dot.data(bData)
            .enter()
            .append("rect")
            .attr("class", function (d) {
                return "brush " + "brush-" + d[2].id;
            })
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", height)  // 控制动画由下而上
            .attr("width", 5)
            .attr("height", 0)  // 控制动画由下而上
            .transition()       // 定义动画
            .duration(500)      //动画持续时间
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return height - y(d[1]); });

        g.append("g")
            .call(brush)
            .call(brush.move, [0, 10].map(x))
            .selectAll(".overlay")
            .each(function (d) { d.type = "selection"; }) // Treat overlay interaction as move.
            .on("mousedown touchstart", brushcentered); // Recenter before brushing.

        g.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x));

        dot = d3.selectAll(".brush");
    }
}

var LineChart = function () {
    var left = 40;
    var margin = {
        left: dotChartWidth, top: 30, bottom: 40, right: 10
    };

    var width = lineChartWidth - left - margin.right;
    var height = lineChartHeight - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .rangeRound([0, width])
        ;

    var y = d3.scaleLinear()
        .rangeRound([height, 0])
        ;

    svg.append("g")
        .attr("transform", "translate(" + (width / 2 + dotChartWidth)+ ",20)")
        .append("text")
        .text("XPM-GPM")
        ;

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.0);

    var colors = d3.schemeCategory10;

    function legend() {
        var g = svg
            .selectAll(".legend")
            .data(["xpm", "gpm"])
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("font-size", 10)
            .attr("transform", (d, i) => `translate(${width + margin.right + margin.left },${i * 20 + 10})`);

        g.append("rect")
            .attr("x", 8)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", function (d) {
                if (d === "xpm") {
                    return colors[0];
                }
                return colors[1];
            });

        g.append("text")
            .attr("x", -24)
            .attr("y", 9.5)
            .attr("dy", "0.35em")
            .text(d => d);
    }

    svg.append("g")
        .call(legend);

    var dotContent = svg.append("g")
        .attr("transform", "translate(" + (margin.left + left) + "," + margin.top + ")")
        ;

    svg.append("g")
        .attr("transform", "translate(" + (margin.left + 10)+"," + (margin.top - 10) + ")")
        .append("text")
        .text("xpm/gpm")
        ;

    svg.append("g")
        .attr("transform", "translate(" + (width +  margin.left + 20) + "," + (height + margin.bottom + 30) + ")")
        .append("text")
        .text("id")
        ;

    LineChart.prototype.draw = function (data) {
        var yMin = d3.min(data, function (d) {
            if (d.xpm * 1 > d.gpm * 1) {
                return d.gpm * 1;
            }
            return d.xpm * 1;
        });
        var yMax = d3.max(data, function (d) {
            if (d.xpm * 1 < d.gpm * 1) {
                return d.gpm * 1;
            }
            return d.xpm * 1;
        });
        var xMin = d3.min(data, function (d) { return d.id * 1; });
        var xMax = d3.max(data, function (d) { return d.id * 1; });
        y.domain([yMin, yMax]);
        x.domain([xMin, xMax]);


        var xAxis = g => g
            .attr("class", "x line-axis")
            .attr("transform", "translate(" + (margin.left + left) + "," + (height + margin.top) + ")")
            .call(d3.axisBottom(x).tickFormat(function (d, i) {
                return d;
            }))
            ;

        var yAxis = g => g
            .attr("class", "y line-axis")
            .attr("transform", "translate(" + (margin.left + left) + "," + margin.top + ")")
            .call(d3.axisLeft(y).ticks(null, "s"))
            ;

        svg.append("g")
            .attr("transform", "translate(0," + (margin.top - 10) + ")")
            .append("text")
            .text("xpm,gpm")
            ;

        svg.append("g")
            .attr("transform", "translate(" + (width - margin.left + 10) + "," + (height - margin.bottom + 60) + ")")
            .append("text")
            .text("id")
            ;

        if (d3.selectAll(".line-axis").size() > 0) {
            d3.selectAll(".line-axis").remove();
        }

        svg.append("g")
            .call(xAxis)
            ;

        svg.append("g")
            .call(yAxis)
            ;

        var xpmLine = d3.line()
            .x(function (d) {
                return x(d.id);
            })
            .y(function (d) {
                return y(d.xpm);
            });

        var gpmLine = d3.line()
            .x(function (d) {
                return x(d.id);
            })
            .y(function (d) {
                return y(d.gpm);
            });

        d3.select(".xpm-line").remove();
        d3.select(".death-line").remove();

        if (svg.select(".xpm-line").size() <= 0) {
            svg.append("path")
                .data([data])
                .attr("class", "xpm-line")
                .style("stroke", colors[0])
                .attr("d", xpmLine)
                .attr("transform", "translate(" + (margin.left + left) + "," + margin.top + ")");
        }
        else {
            svg.select(".xpm-line")
                .data([data])
                .transition()
                .duration(500)
                .attr("d", xpmLine);
        }

        if (svg.select(".gpm-line").size() <= 0) {
            svg.append("path")
                .data([data])
                .attr("class", "gpm-line")
                .style("stroke", colors[1])
                .attr("d", gpmLine)
                .attr("transform", "translate(" + (margin.left + left) + "," + margin.top + ")");
        }
        else {
            svg.select(".gpm-line")
                .data([data])
                .transition()
                .duration(500)
                .attr("d", gpmLine);
        }

        
        
        var xpmDots = dotContent.selectAll(".xpm-dot")
            .data(data)
            ;

        xpmDots.exit()
            .transition()
            .duration(500)
            .remove();

        xpmDots.transition()
            .duration(500)
            .attr("class", function (d) {
                return "xpm-dot " + "dot-" + d.id;
            })
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['xpm']);
            })
            ;

        xpmDots.enter()
            .append("circle")
            .attr("class", function (d) {
                return "xpm-dot " + "dot-" + d.id;
            })
            .style("stroke-width", 1)
            .style("stroke", "black")
            .attr("r", dotR)
            .style("fill", colors[0])
            .style("opacity", 1.0)
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['xpm']);
            })
            .on("mouseover", function (d) {
                mouseover(d);
                var str = "";
                str += "<div style='margin:5px 5px'>id:" + d.id + "</div>";
                str += "<div style='margin:5px 5px'>xpm:" + d.xpm + "</div>";

                tooltip.html(str)
                    .style("width", 200 + "px")
                    .style("height", "auto")
                    .style("left", (d3.event.pageX - 60) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                    ;
            })
            .on("mouseout", function (d) {
                mouseout(d);
                tooltip.style("width", 0)
                    .style("height", 0)
                    .style("opacity", 0.0);
            })
            ;

        var gpmDots = dotContent.selectAll(".gpm-dot")
            .data(data)
            ;

        gpmDots.exit()
            .transition()
            .duration(500)
            .remove();

        gpmDots.transition()
            .duration(500)
            .attr("class", function (d) {
                return "gpm-dot " + "dot-" + d.id;
            })
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['gpm']);
            })
            ;

        gpmDots.enter()
            .append("circle")
            .attr("class", function (d) {
                return "gpm-dot " + "dot-" + d.id;
            })
            .style("stroke-width", 1)
            .style("stroke", "black")
            .attr("r", dotR)
            .style("fill", colors[1])
            .style("opacity", 1.0)
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['gpm']);
            })
            .on("mouseover", function (d) {
                mouseover(d);
                var str = "";
                str += "<div style='margin:5px 5px'>id:" + d.id + "</div>";
                str += "<div style='margin:5px 5px'>gpm:" + d.gpm + "</div>";

                tooltip.html(str)
                    .style("width", 200 + "px")
                    .style("height", "auto")
                    .style("left", (d3.event.pageX - 60) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                    ;
            })
            .on("mouseout", function (d) {
                mouseout(d);
                
                tooltip.style("width", 0)
                    .style("height", 0)
                    .style("opacity", 0.0);
            })
            ;
    }
}

var DotChart = function () {
    var margin = {
        left: 50, top: 50, bottom: 40, right: 10
    };

    var width = dotChartWidth;
    var height = dotChartHeight;

    var x = d3.scaleLinear()
        .rangeRound([0, width - margin.left - margin.right])
        ;

    var y = d3.scaleLinear()
        .rangeRound([height - margin.top - margin.bottom, 0])
        ;

    var dotContent = svg.append("g")
        .attr("class","dot-chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

    svg.append("g")
        .attr("transform", "translate(" + (width - 100) / 2 + ",20)")
        .append("text")
        .text("Kills dot chart")
        ;

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.0);

    var colorFunction = d3.interpolate(d3.rgb(255, 100, 240), d3.rgb(30, 30, 30));

    var colorLinear = d3.scaleLinear()
        .domain([0, 119])
        .range([0, 1]);

    svg.append("g")
        .attr("transform", "translate(0," + (margin.top - 10) + ")")
        .append("text")
        .text("kills")
        ;

    svg.append("g")
        .attr("transform", "translate(" + (width - margin.left + 30) + "," + (height - margin.bottom + 40) + ")")
        .append("text")
        .text("id")
        ;

    function drawDotChart(data) {
        var yMin = d3.min(data, function (d) { return d.kills * 1; });
        var yMax = d3.max(data, function (d) { return d.kills * 1; });
        var xMin = d3.min(data, function (d) { return d.id * 1; });
        var xMax = d3.max(data, function (d) { return d.id * 1; });
        y.domain([yMin, yMax]);
        x.domain([xMin, xMax]);

        colorLinear.domain([yMin, yMax]);

        var xAxis = g => g
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
            .call(d3.axisBottom(x).ticks(null, "s"))
            ;

        var yAxis = g => g
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(y).ticks(null, "s"))
            ;

        if (d3.selectAll(".axis").size() > 0) {
            d3.selectAll(".axis").remove();
        }

        svg.append("g")
            .call(xAxis)
            ;

        svg.append("g")
            .call(yAxis)
            ;

        var dots = dotContent.selectAll(".dot")
            .data(data)
            ;

        dots.exit()
            .transition()
            .duration(500)
            .remove();

        dots.transition()
            .duration(500)
            .attr("class", function (d) {
                return "dot " + "dot-" + d.id;
            })
            .style("fill", function (d) {
                var val = colorLinear(d.kills);
                return colorFunction(val);
            })
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['kills']);
            })
            ;

        dots.enter()
            .append("circle")
            .attr("class", function (d) {
                return "dot " + "dot-" + d.id;
            })
            .style("stroke-width", 1)
            .style("stroke", "black")
            .attr("r", dotR)
            .style("fill", function (d) {
                var val = colorLinear(d.kills);
                return colorFunction(val);
            })
            .style("opacity", 1.0)
            .attr("cx", function (d) {
                return x(d['id']);
            })
            .attr("cy", function (d) {
                return y(d['kills']);
            })
            .on("mouseover", function (d) {
                mouseover(d);
                var str = "";
                str += "<div style='margin:5px 5px'>id:" + d.id + "</div>";
                str += "<div style='margin:5px 5px'>kills:" + d.kills + "</div>";
                str += "<div style='margin:5px 5px'>deaths:" + d.deaths + "</div>";
                str += "<div style='margin:5px 5px'>xpm:" + d.xpm + "</div>";
                str += "<div style='margin:5px 5px'>gpm:" + d.gpm + "</div>";

                tooltip.html(str)
                    .style("width", 200 + "px")
                    .style("height", "auto")
                    .style("left", (d3.event.pageX - 60) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                    ;
                var cVal = d3.select(this).style("fill");
            })
            .on("mouseout", function (d) {
                mouseout(d);

                tooltip.style("width", 0)
                    .style("height", 0)
                    .style("opacity", 0.0);
            })
            ;
    }
    DotChart.prototype.draw = drawDotChart;
}

function mouseover(d) {
    d3.selectAll(".dot-" + d.id)
        .transition()
        .duration(500)
        .attr("r", 15)
        ;
    d3.select(".brush-" + d.id)
        .transition()
        .duration(500)
        .attr("fill", function (d) {
            return "red";
        })
        ;
}

function mouseout(d) {
    d3.selectAll(".dot-" + d.id)
        .transition()
        .duration(500)
        .attr("r", dotR)
        ;
    d3.selectAll(".brush")
        .transition()
        .duration(500)
        .attr("fill", function (d) {
            if (d3.select(this).classed("selected")) {
                return "";
            }
            return "black";
        })
        ;
}

var brushChart = new BrushChart();
var lineChart = new LineChart();
var dotChart = new DotChart();

d3.csv("matuinfor.csv", function (error, data) {
    data.forEach(function (d, i) {
        data[i].id = data[i].id * 1;
        data[i].deaths = data[i].deaths * 1;
        data[i].xpm = data[i].xpm * 1;
        data[i].gpm = data[i].gpm * 1;
    });
    lineChart.draw(data);
    dotChart.draw(data);
    brushChart.draw(data);
});