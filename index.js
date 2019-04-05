function debug(obj) {
  console.debug(obj);
  return obj;
}
(async () => {
  let data = await d3.csv("AppleStore3.csv");

  data = data.reduce((pre, cur) => {
    if (pre[cur.prime_genre]) {
      pre[cur.prime_genre].push(cur);
    } else {
      pre[cur.prime_genre] = [cur];
    }
    return pre;
  }, {});
  initBarChart();
  renderPieChart(data);
  renderBubbleChart(data);
})();

const randColor = () =>
  "#" +
  Array.from(Array(2))
    .map(() => parseInt(Math.random() * 230).toString(16))
    .join("");

const MARGIN = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40
  },
  WIDTH = (document.body.offsetWidth - MARGIN.left - MARGIN.right - 20)/2,
  HEIGHT = (window.innerHeight - MARGIN.top - MARGIN.bottom)/2 - 50;
// WIDTH = 1280,
// HEIGHT = 960;

const BAR = {
  width: (WIDTH - 50) / 15,
  padding: 1
};

// BarChart - barchart start with Game categtory
function initBarChart() {
  const svg = d3
    .select("#bar")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.left + MARGIN.right)
    .append("g")
    .attr("transform", `translate(${MARGIN.left+80},${MARGIN.top})`);

  const xAxis = d3.axisBottom(
    d3.scaleOrdinal(
      [""]
        .concat(
          Array.from(Array(10)).map((v, i) => `${i * 0.5}~${(i + 1) * 0.5}`)
        )
        .concat(""),
      [0]
        .concat(
          Array.from(Array(10)).map(
            (v, i) => i * BAR.width + 25 + BAR.width / 2
          )
        )
        .concat(WIDTH -180)
    )
  );
  svg.append("g").attr("id", "yAxis");
  svg
    .append("g")
    .attr("transform", `translate(0,${HEIGHT})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(25,0)`)
    .attr("id", "barData");

  svg.append("text").attr("id", "title")

// Add labels
  svg.append("text")
     .attr("transform",
          "translate(" + (WIDTH / 2 - 100) + " ," + (HEIGHT + 40) + ")")
     .style("text-anchor", "middle")
     .text("Rate");

  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", - 60)
     .attr("x",0 - (HEIGHT / 2) )
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("The number of Apps");
}

function renderBarChart(data, title) {
  const svg = d3.select("#bar");

  let series = data.reduce((pre, cur) => {
    if (parseFloat(cur.user_rating) >= 5.0) {
      pre[9] += 1;
    } else {
      pre[parseInt(cur.user_rating / 0.5)] += 1;
    }
    return pre;
  }, Array.from(Array(10)).map(() => 0));

  const yAxis = d3.axisLeft(
    d3.scaleLinear([Math.max(...series), 0], [0, HEIGHT])
  );

  svg.select("#yAxis").remove();
  svg
    .select("g")
    .append("g")
    .attr("id", "yAxis")
    .call(yAxis);

  svg
    .select("#barData")
    .selectAll("rect")
    .remove();

  svg
    .select("#barData")
    .selectAll("bar")
    .data(series)
    .enter()
    .append("rect")
    .attr("y", v => HEIGHT - (v / Math.max(...series)) * HEIGHT)
    .attr("height", v => (v / Math.max(...series)) * HEIGHT)
    .style("fill", "steelblue")
    .attr("x", function(d, i) {
      return i * BAR.width + BAR.padding / 2;
    })
    .attr("width", BAR.width - BAR.padding);

  svg
    .select("#barData")
    .selectAll("text")
    .remove();

  svg
    .select("#barData")
    .selectAll("bar")
    .data(series)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
      return i * BAR.width + BAR.padding / 2 + BAR.width / 2;
    })
    .attr("text-anchor", "middle")
    .attr("y", v => HEIGHT - (v / Math.max(...series)) * HEIGHT)
    .text(d => d);

  svg.select("#title").text(title)
     .style("fill","steelblue");
}

// PieChart
function renderPieChart(data) {
  const radius = Math.min(HEIGHT, WIDTH) / 1.7;
  let series = d3.pie().value(v => v.count)(
    Object.entries(data)
      .map(([k, v]) => ({
        name: k,
        count: v.length
      }))
      .sort((a, b) => a.count - b.count)
  );

  const svg = d3
    .select("#pie")
    .attr("width", 500)
    .attr("height", 300)
    .append("g")
    .attr("transform", `translate(${MARGIN.left-170},${MARGIN.top })`)
    .selectAll(".arc")
    .data(series)
    .enter();

  const arc = d3.arc();
  svg
    .append("path")
    .attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`)
    .attr("d", v =>
      arc(
        Object.assign(v, {
          innerRadius: radius / 2,
          outerRadius: radius
        })
      )
    )
    .style("fill", randColor)
    .on("mouseover", d => {
      renderBarChart(data[d.data.name], d.data.name);
      $("#bubble_" + d.data.name).popover("show");
    })
    .on("mouseout", d => {
      $("#bubble_" + d.data.name).popover("hide");
    });

  svg
    .select("g")
    .data(series)
    .enter()
    .append("text")
    .attr("x", d => WIDTH / 2  + arc.centroid(d)[0] )
    .attr("y", d => HEIGHT / 2 + arc.centroid(d)[1] )
    .text(d => d.data.name)
    .attr("font-size", 10);

  let [name] = Object.keys(data);
  renderBarChart(data[name], name);

  // Add lines
  // svg.append("g")
	// .attr("class", "lines");
  //
  // var polyline = svg.select(".lines").selectAll("polyline")
  // .data(data);
  //
  // polyline.enter()
  //   .append("polyline");
  //
  // polyline.transition().duration(1000)
	// 	.attrTween("points", function(d){
	// 		this._current = this._current || d;
	// 		var interpolate = d3.interpolate(this._current, d);
	// 		this._current = interpolate(0);
	// 		return function(t) {
	// 			var d2 = interpolate(t);
	// 			var pos = arc.centroid(d)[0];
	// 			pos[0] = radius * 0.95 ;
	// 			return [arc.centroid(d)[0], arc.centroid(d)[1], pos];
	// 		};
	// 	});
  //
	// polyline.exit()
	// 	.remove();
}

//BubbleChart
function renderBubbleChart(data) {
  const series = d3
    .hierarchy({
      name: "root",
      children: Object.entries(data).map(([k, v]) => ({
        name: k,
        count: v.length,
        item: v
      }))
    })
    .sum(v => v.count);

  const svg = d3
    .select("#bubble")
    .attr("width", (WIDTH + MARGIN.left + MARGIN.right)*2)
    .attr("height", (HEIGHT + MARGIN.left + MARGIN.right)*2);

  var diameter = Math.min(HEIGHT*1.5, WIDTH*1.5); //max size of the bubbles
  var bubble = d3
    .pack()
    .size([diameter, diameter])
    .padding(1.5);

  nodes = bubble(series);
  //setup the chart
  var bubbles = svg
    .append("g")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr(
      "transform",
      `translate(${WIDTH  - diameter / 2 + 30},${HEIGHT  - diameter / 1.5})`
    );

  bubbles
    .selectAll(".bubble")
    .data(nodes.children)
    .enter()
    .append(d => {
      let dom = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      dom.setAttribute("id", "bubble_" + d.data.name);
      $(dom).popover({
        content: `<p><strong>name:</strong><span>${d.data.name}</span></p>
                <p><strong>total:</strong><span>${d.data.count}</span></p>
                <p><strong>avg:</strong><span>${(
                  d.data.item.reduce(
                    (total, v) => total + parseFloat(v.user_rating),
                    0
                  ) / d.data.count
                ).toFixed(2)}</span></p>`,
        html: true
      });
      dom.onmouseover = () => $(dom).popover("show");
      dom.onmouseout = () => $(dom).popover("hide");
      return dom;
    })
    .attr("r", d => d.r)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .on("mouseover", d => {
      renderBarChart(data[d.data.name], d.data.name);
      $("#bubble_" + d.data.name).popover("show");
    })
    .on("mouseout", d => {
      $("#bubble_" + d.data.name).popover("hide");
    })
    .style("fill", () => randColor());

  bubbles
    .selectAll(".bubble")
    .data(nodes.children)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .text(d => d.data.name)
    .attr("font-size", d => (d.r)/1.9 );

}
