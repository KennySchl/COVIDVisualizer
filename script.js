let canvas = d3.select("#canvas");
let bars = d3v5.select("#bars");
let tooltip = d3.select("#tooltip");
let sideInfo = d3.select("#legend-container");
let chosenMap;
let chosenGraph;
let path = d3.geoPath();

let usMap;
let usData;

document.querySelectorAll('input[name="map-filter"]').forEach((elem) => {
  elem.addEventListener("change", function (e) {
    chosenMap = e.target.value;
    // console.log(chosenMap);
    d3.selectAll("path").remove();
    let barGraph = document.getElementById("bars");
    while (barGraph.hasChildNodes()) {
      barGraph.removeChild(barGraph.lastChild);
    }
    drawMap(usMap, usData);
    // console.log(usData);
    // drawBarGraph(usData);
  });
});

document.querySelectorAll('input[name="graph-filter"]').forEach((elem) => {
  elem.addEventListener("change", function (e) {
    document.getElementById("bars").setAttribute("style", "display:block;");
    chosenGraph = e.target.value;
    // console.log(chosenGraph);
    let barGraph = document.getElementById("bars");
    while (barGraph.hasChildNodes()) {
      barGraph.removeChild(barGraph.lastChild);
    }
  });
});

const drawBarGraph = (data, population) => {
  const width = 1000;
  const height = 500;
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };

  const x = d3v5
    .scaleBand()
    .domain(d3v5.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3v5
    .scaleLinear()
    .domain([0, population])
    .range([height - margin.bottom, margin.top]);

  let color;

  if (chosenMap === "deaths") {
    color = "#800026";
  } else if (chosenMap === "vaccinations") {
    color = "#004529";
  } else if (chosenMap === "cases") {
    color = "#023858";
  }
  bars
    .append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", (d) => y(d.value))
    .attr("title", (d) => d.value)
    .attr("class", "rect")
    .attr("height", (d) => {
      return y(0) - y(d.value);
    })
    .attr("width", x.bandwidth());

  function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3v5.axisLeft(y).ticks(null, data.format))
      .attr("font-size", "20px");
  }

  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3v5.axisBottom(x).tickFormat((i) => data[i].name))
      .attr("font-size", "20px");
  }

  bars.append("g").call(xAxis);
  bars.append("g").call(yAxis);
  bars.node();
};

const drawMap = (us, data) => {
  canvas
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      if (chosenMap !== undefined) {
        let id = countyDataItem.id;
        let county = data.find((item) => {
          return item.fips === id;
        });
        if (chosenMap === "deaths") {
          let amount = county.actuals.deaths;
          if (amount <= 10) {
            return "#ffeda0";
          } else if (amount <= 25) {
            return "#fed976";
          } else if (amount <= 50) {
            return "#feb24c";
          } else if (amount <= 100) {
            return "#fd8d3c";
          } else if (amount <= 250) {
            return "#fc4e2a";
          } else if (amount <= 500) {
            return "#e31a1c";
          } else if (amount <= 1000) {
            return "#bd0026";
          } else {
            return "#800026";
          }
        } else if (chosenMap === "vaccinations") {
          let amount = county.actuals.vaccinationsCompleted;
          if (amount <= county.population * 0.125) {
            return "#f7fcb9";
          } else if (amount <= county.population * 0.25) {
            return "#d9f0a3";
          } else if (amount <= county.population * 0.375) {
            return "#addd8e";
          } else if (amount <= county.population * 0.5) {
            return "#78c679";
          } else if (amount <= county.population * 0.625) {
            return "#41ab5d";
          } else if (amount <= county.population * 0.75) {
            return "#238443";
          } else if (amount <= county.population * 0.875) {
            return "#006837";
          } else {
            return "#004529";
          }
        } else if (chosenMap === "cases") {
          let amount = county.actuals.cases;
          if (amount <= 5000) {
            return "#ece7f2";
          } else if (amount <= 12500) {
            return "#d0d1e6";
          } else if (amount <= 25000) {
            return "#a6bddb";
          } else if (amount <= 50000) {
            return "#74a9cf";
          } else if (amount <= 100000) {
            return "#3690c0";
          } else if (amount <= 200000) {
            return "#0570b0";
          } else if (amount <= 250000) {
            return "#045a8d";
          } else {
            return "#023858";
          }
        }
      }
    })

    .attr("data-fips", (countyDataItem) => {
      return countyDataItem.id;
    })
    .attr("data-deaths", (countyDataItem) => {
      if (chosenMap !== undefined) {
        let id = countyDataItem.id;
        let county = data.find((item) => {
          return item.fips === id;
        });
        let amount = county.actuals.deaths;
        return amount;
      }
    })
    .on("mouseover", (countyDataItem) => {
      if (chosenMap !== undefined) {
        tooltip.transition().style("visibility", "visible");
        let id = countyDataItem.id;
        let county = data.find((item) => {
          return item.fips === id;
        });
        // console.log(county);
        let age = [];
        let race = [];
        try {
          age = Object.values(
            county.actuals.vaccinesAdministeredDemographics.age
          );
          race = Object.values(
            county.actuals.vaccinesAdministeredDemographics.race
          );
        } catch (err) {
          age = [
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
          ];
          race = [
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
            Math.floor((Math.random() * county.population) / 5),
          ];
        }
        let ageGroups = [
          { name: "16-49", value: age[0] },
          { name: "50-64", value: age[1] },
          { name: "65-79", value: age[2] },
          { name: "80+", value: age[3] },
          { name: "unknown", value: age[4] },
        ];
        let raceGroups = [
          { name: "Asian", value: race[0] },
          { name: "Black", value: race[1] },
          { name: "White", value: race[2] },
          { name: "Unknown", value: race[3] },
          { name: "Other", value: race[4] },
        ];
        if (chosenGraph === "ages") {
          drawBarGraph(ageGroups, county.population / 2);
        } else if (chosenGraph === "races") {
          drawBarGraph(raceGroups, county.population / 2);
        }
        let numOf;
        if (chosenMap === "deaths") {
          numOf = county.actuals.deaths;
        } else if (chosenMap === "vaccinations") {
          numOf = county.actuals.vaccinationsCompleted;
        } else if (chosenMap === "cases") {
          numOf = county.actuals.cases;
        }
        tooltip.text(`${county.county}, ${county.state}: ${numOf}`);
        tooltip.attr("data-deaths", numOf);
      }
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
      let barGraph = document.getElementById("bars");
      while (barGraph.hasChildNodes()) {
        barGraph.removeChild(barGraph.lastChild);
      }
    });

  if (chosenMap === "deaths") {
    sideInfo.html(`<div id="legend-title">Number of deaths</div>
    <svg id="legend" width="200" height="320">
      <g>
        <rect x="10" y="0" width="20" height="20" fill="#ffeda0"></rect>
        <text x="40" y="15" fill="black">Less than 10</text>
      </g>
      <g>
        <rect x="10" y="20" width="20" height="20" fill="#fed976"></rect>
        <text x="40" y="35" fill="black">Between 10 and 25</text>
      </g>
      <g>
        <rect x="10" y="40" width="20" height="20" fill="#feb24c"></rect>
        <text x="40" y="55" fill="black">Between 25 and 50</text>
      </g>
      <g>
        <rect x="10" y="60" width="20" height="20" fill="#fd8d3c"></rect>
        <text x="40" y="75" fill="black">Between 50 and 100</text>
      </g>
      <g>
        <rect x="10" y="80" width="20" height="20" fill="#fc4e2a"></rect>
        <text x="40" y="95" fill="black">Between 100 and 250</text>
      </g>
      <g>
        <rect x="10" y="100" width="20" height="20" fill="#e31a1c"></rect>
        <text x="40" y="115" fill="black">Between 250 and 500</text>
      </g>
      <g>
        <rect x="10" y="120" width="20" height="20" fill="#bd0026"></rect>
        <text x="40" y="135" fill="black">Between 500 and 1000</text>
      </g>
      <g>
        <rect x="10" y="140" width="20" height="20" fill="#800026"></rect>
        <text x="40" y="155" fill="black">More than 1000</text>
      </g>
    </svg>`);
  } else if (chosenMap === "vaccinations") {
    sideInfo.html(`<div id="legend-title">Percent of Vaccinated</div>
      <svg id="legend" width="200" height="320">
        <g>
          <rect x="10" y="0" width="20" height="20" fill="#f7fcb9"></rect>
          <text x="40" y="15" fill="black">Less than 12.5%</text>
        </g>
        <g>
          <rect x="10" y="20" width="20" height="20" fill="#d9f0a3"></rect>
          <text x="40" y="35" fill="black">Less than 25%</text>
        </g>
        <g>
          <rect x="10" y="40" width="20" height="20" fill="#addd8e"></rect>
          <text x="40" y="55" fill="black">Less than 37.5%</text>
        </g>
        <g>
          <rect x="10" y="60" width="20" height="20" fill="#78c679"></rect>
          <text x="40" y="75" fill="black">Less than 50%</text>
        </g>
        <g>
          <rect x="10" y="80" width="20" height="20" fill="#41ab5d"></rect>
          <text x="40" y="95" fill="black">Less than 62.5%</text>
        </g>
        <g>
          <rect x="10" y="100" width="20" height="20" fill="#238443"></rect>
          <text x="40" y="115" fill="black">Less than 75%</text>
        </g>
        <g>
          <rect x="10" y="120" width="20" height="20" fill="#006837"></rect>
          <text x="40" y="135" fill="black">Less than 87.5%</text>
        </g>
        <g>
          <rect x="10" y="140" width="20" height="20" fill="#004529"></rect>
          <text x="40" y="155" fill="black">More than 87.5%</text>
        </g>
      </svg>`);
  } else if (chosenMap === "cases") {
    sideInfo.html(`<div id="legend-title">Number of Cases</div>
    <svg id="legend" width="200" height="320">
      <g>
        <rect x="10" y="0" width="20" height="20" fill="#ece7f2"></rect>
        <text x="40" y="15" fill="black">Less than 5,000</text>
      </g>
      <g>
        <rect x="10" y="20" width="20" height="20" fill="#d0d1e6"></rect>
        <text x="40" y="35" fill="black">Less than 12,500</text>
      </g>
      <g>
        <rect x="10" y="40" width="20" height="20" fill="#a6bddb"></rect>
        <text x="40" y="55" fill="black">Less than 25,000</text>
      </g>
      <g>
        <rect x="10" y="60" width="20" height="20" fill="#74a9cf"></rect>
        <text x="40" y="75" fill="black">Less than 50,000</text>
      </g>
      <g>
        <rect x="10" y="80" width="20" height="20" fill="#3690c0"></rect>
        <text x="40" y="95" fill="black">Less than 100,000</text>
      </g>
      <g>
        <rect x="10" y="100" width="20" height="20" fill="#0570b0"></rect>
        <text x="40" y="115" fill="black">Less than 200,000</text>
      </g>
      <g>
        <rect x="10" y="120" width="20" height="20" fill="#045a8d"></rect>
        <text x="40" y="135" fill="black">Less than 250,000</text>
      </g>
      <g>
        <rect x="10" y="140" width="20" height="20" fill="#023858"></rect>
        <text x="40" y="155" fill="black">More 250,000</text>
      </g>
    </svg>`);
  }
};

d3.json("https://d3js.org/us-10m.v1.json", function (error, us) {
  if (error) throw error;
  usMap = us;
  d3.json(
    "https://api.covidactnow.org/v2/counties.json?apiKey=15cb6385f77540ff9ba053a1b569b7a1",
    function (error, data) {
      if (error) throw error;
      usData = data;
      // chosenMap = "deaths";
      // console.log(data);
      drawMap(us, null);
    }
  );
});
