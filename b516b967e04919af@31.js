import define1 from "./04d11ecf5a00856d@418.js";

function _1(md){return(
md`# Untitled`
)}

function _chart(d3,runtimeData)
{
  const width = 400;
  const height = 800;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("max-width", "100%")
    .style("height", "auto");

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("font", "bold 14px 'Inter', 'Helvetica Neue', sans-serif")
    .style("background", "transparent")
    .style("padding", "6px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const filtered = runtimeData.filter(d => d.runtime >= 10 && d.runtime <= 400);

  if (filtered.length === 0) {
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "red")
      .text("Không có phim nào có runtime từ 10 đến 400 phút.");
    return svg.node();
  }

  // Trục y hiển thị runtime (phút)
  const y = d3.scaleLog()
    .domain([10, 400])
    .range([height - 40, 40]); // thấp → cao

  const yAxis = d3.axisRight(y)
    .ticks(10, "~s")
    .tickFormat(d3.format("~s"));

  svg.append("g")
    .attr("transform", `translate(${width - 40}, 0)`) // trục y bên phải
    .call(yAxis)
    .call(g => g.append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text("Runtime (minutes) →"));

  // Bubble sẽ rải theo chiều ngang (ngẫu nhiên x)
  const nodes = filtered.map(d => ({
    ...d,
    x: Math.random() * (width - 50) + 30, // tránh đụng trục y
    y: y(d.runtime),
    opacity: 1
  }));

  const nodeElements = svg.append("g")
    .attr("stroke", "#333")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", "black")
      .attr("opacity", 1);

  // Force simulation theo chiều dọc
  const simulation = d3.forceSimulation(nodes)
    .velocityDecay(0.2)
    .force("x", d3.forceX(width / 2).strength(0.01)) // giữ ổn ngang
    .force("y", d3.forceY(d => y(d.runtime)).strength(0.1)) // runtime trục Y
    .force("collide", d3.forceCollide().radius(6))
    .on("tick", () => {
      nodeElements
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

  // 💨 Breathing animation
  nodeElements.each(function (_, i) {
    const circle = d3.select(this);
    let direction = -1;
    const delay = Math.random() * 2000;
    setTimeout(() => {
      setInterval(() => {
        const currentOpacity = parseFloat(circle.attr("opacity"));
        const next = direction > 0
          ? Math.min(1, currentOpacity + 0.02)
          : Math.max(0.3, currentOpacity - 0.02);
        circle.attr("opacity", next);
        if (next === 1 || next === 0.3) direction *= -1;
      }, 60);
    }, delay);
  });

  // Hover interaction
  nodeElements
    .on("mouseover", function (event, d) {
      nodeElements
        .attr("fill", "#ccc")
        .attr("r", 5);

      d3.select(this)
        .attr("fill", "black")
        .attr("opacity", 1)
        .attr("r", 7);

      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.title}</strong><br/>Runtime: ${d.runtime} phút`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseout", function () {
      nodeElements
        .attr("fill", "black")
        .attr("r", 5);

      tooltip.style("opacity", 0);
    });

  svg.on("click", () => {
    simulation.alpha(0.5).restart();
  });

  return svg.node();
}


function _d3(require){return(
require("d3@7")
)}

function _runtimeData(data){return(
data
  .filter(d => d.title && +d.runtime >= 10 && +d.runtime < 400)
  .map(d => ({
    title: d.title,
    runtime: +d.runtime
  }))
)}

function _data(FileAttachment){return(
FileAttachment("A24_Movies_With_Poster.csv").csv({typed: true})
)}

function _a24_movies_with_poster(__query,FileAttachment,invalidation){return(
__query(FileAttachment("A24_Movies_With_Poster.csv"),{from:{table:"A24_Movies_With_Poster"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["A24_Movies_With_Poster.csv", {url: new URL("./files/115b5f2577edd926f28c43ce7b940014840a6a6e557399045b0bbb486e0ba96552678c0a82e09ea5d7f9ed8df66bf2abd5911bc5380fa4842ef80a4e34b7b1bc.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","runtimeData"], _chart);
  const child1 = runtime.module(define1);
  main.import("BeeswarmChart", child1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("runtimeData")).define("runtimeData", ["data"], _runtimeData);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("a24_movies_with_poster")).define("a24_movies_with_poster", ["__query","FileAttachment","invalidation"], _a24_movies_with_poster);
  return main;
}
