import define1 from "./7a9e12f9fb3d8e06@517.js";

function _1(md){return(
md`# Beeswarm

<p style="background: #fffced; box-sizing: border-box; padding: 10px 20px; font-style: italic;">**Update June 2023:** This notebook has been deprecated and is no longer maintained; please see the newer [D3 beeswarm](/@d3/beeswarm/2) and the [Plot beeswarm](https://observablehq.com/@observablehq/plot-dodge-cars) examples.</p>

A beeswarm plot functions similarly to a [histogram](/@d3/histogram?collection=@d3/charts), except it allows individual data points to be seen. Dots are offset vertically, without affecting horizontal position. This chart shows the weights of cars from 1974. Data: *Motor Trend*`
)}

function _chart(BeeswarmChart,cars,d3,width){return(
BeeswarmChart(cars, {
  x: d => d.Weight_in_lbs,
  label: "Weight (lbs.) →",
  type: d3.scaleLinear, // try d3.scaleLog
  title: d => `${d.Origin}: ${d.Name}\n${d.Weight_in_lbs.toLocaleString("en")} lbs.`,
  width
})
)}

function _cars(FileAttachment){return(
FileAttachment("cars-2.csv").csv({typed: true})
)}

function _4(howto){return(
howto("BeeswarmChart")
)}

function _5(altplot){return(
altplot(`Plot.plot({
  height: 160,
  marks: [Plot.dotX(cars, Plot.dodgeY({x: "Weight_in_lbs"}))]
})`)
)}

function _BeeswarmChart(d3){return(
function BeeswarmChart(data, {
  value = d => d, // convenience alias for x
  label, // convenience alias for xLabel
  type = d3.scaleLinear, // convenience alias for xType
  domain, // convenience alias for xDomain
  x = value, // given d in data, returns the quantitative x value
  title = null, // given d in data, returns the title
  group, // given d in data, returns an (ordinal) value for color
  groups, // an array of ordinal values representing the data groups
  colors = d3.schemeTableau10, // an array of color strings, for the dots
  radius = 3, // (fixed) radius of the circles
  padding = 1.5, // (fixed) padding between the circles
  marginTop = 10, // top margin, in pixels
  marginRight = 20, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 20, // left margin, in pixels
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  xType = type, // type of x-scale, e.g. d3.scaleLinear
  xLabel = label, // a label for the x-axis
  xDomain = domain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight] // [left, right]
} = {}) {
  // Compute values.
  const X = d3.map(data, x).map(x => x == null ? NaN : +x);
  const T = title == null ? null : d3.map(data, title);
  const G = group == null ? null : d3.map(data, group);

  // Compute which data points are considered defined.
  const I = d3.range(X.length).filter(i => !isNaN(X[i]));

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (G && groups === undefined) groups = d3.sort(G);

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const color = group == null ? null : d3.scaleOrdinal(groups, colors);

  // Compute the y-positions.
  const Y = dodge(I.map(i => xScale(X[i])), radius * 2 + padding);

  // Compute the default height;
  if (height === undefined) height = d3.max(Y) + (radius + padding) * 2 + marginTop + marginBottom;

  // Given an array of x-values and a separation radius, returns an array of y-values.
  function dodge(X, radius) {
    const Y = new Float64Array(X.length);
    const radius2 = radius ** 2;
    const epsilon = 1e-3;
    let head = null, tail = null;

    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y) {
      let a = head;
      while (a) {
        const ai = a.index;
        if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
        a = a.next;
      }
      return false;
    }

    // Place each circle sequentially.
    for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {

      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && X[head.index] < X[bi] - radius2) head = head.next;

      // Choose the minimum non-intersecting tangent.
      if (intersects(X[bi], Y[bi] = 0)) {
        let a = head;
        Y[bi] = Infinity;
        do {
          const ai = a.index;
          let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
          if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
          a = a.next;
        } while (a);
      }
  
      // Add b to the queue.
      const b = {index: bi, next: null};
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }
  
    return Y;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  const dot = svg.append("g")
    .selectAll("circle")
    .data(I)
    .join("circle")
      .attr("cx", i => xScale(X[i]))
      .attr("cy", i => height - marginBottom - radius - padding - Y[i])
      .attr("r", radius);

  if (G) dot.attr("fill", i => color(G[i]));

  if (T) dot.append("title")
      .text(i => T[i]);

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["cars-2.csv", {url: new URL("./files/53c407ee531bab128477148c9e28c49dd06bf83a93ae317e58dbb9fc819db0d4f6c4fb9646fa2fe20faad76addee20cfc360eab2362eeaec3340a5e4655b9996.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["BeeswarmChart","cars","d3","width"], _chart);
  main.variable(observer("cars")).define("cars", ["FileAttachment"], _cars);
  main.variable(observer()).define(["howto"], _4);
  main.variable(observer()).define(["altplot"], _5);
  main.variable(observer("BeeswarmChart")).define("BeeswarmChart", ["d3"], _BeeswarmChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("altplot", child1);
  return main;
}
