let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");
let chosenMap;
let path = d3.geoPath();

let usMap
let usData;

document.querySelectorAll('input[name="map-filter"]').forEach((elem) => {
  elem.addEventListener("change", function (e) {
    chosenMap = e.target.value;
    console.log(chosenMap);
    d3.selectAll("path").remove();
    drawMap(usMap, usData)
  });
});

const drawMap = (us, data) => {
  canvas
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
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
      } else {
        let amount = county.actuals.vaccinationsCompleted;
        if (amount <= 10) {
          return "#f7fcb9";
        } else if (amount <= 25) {
          return "#d9f0a3";
        } else if (amount <= 50) {
          return "#addd8e";
        } else if (amount <= 100) {
          return "#78c679";
        } else if (amount <= 250) {
          return "#41ab5d";
        } else if (amount <= 500) {
          return "#238443";
        } else if (amount <= 1000) {
          return "#006837";
        } else {
          return "#004529";
        }
      }
    })

    .attr("data-fips", (countyDataItem) => {
      return countyDataItem.id;
    })
    .attr("data-deaths", (countyDataItem) => {
      let id = countyDataItem.id;
      let county = data.find((item) => {
        return item.fips === id;
      });
      let amount = county.actuals.deaths;
      return amount;
    })
    .on("mouseover", (countyDataItem) => {
      tooltip.transition().style("visibility", "visible");
      let id = countyDataItem.id;
      let county = data.find((item) => {
        return item.fips === id;
      });
      console.log(county);
      tooltip.text(
        `${county.county}, ${county.state}: ${county.actuals.deaths}`
      );
      tooltip.attr("data-deaths", county.actuals.deaths);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};


  d3.json("https://d3js.org/us-10m.v1.json", function (error, us) {
    if (error) throw error;
     usMap = us
    d3.json(
      "https://api.covidactnow.org/v2/counties.json?apiKey=15cb6385f77540ff9ba053a1b569b7a1",
      function (error, data) {
        if (error) throw error;
      usData = data
      chosenMap = "deaths"
        // console.log(data);
        drawMap(us, null);
      }
    );
  });

