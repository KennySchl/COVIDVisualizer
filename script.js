let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");
let path = d3.geoPath();

const drawMap = (us, data) => {
  console.log(data);

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
        `${county.fips} - ${county.county}, ${county.state}: ${county.actuals.deaths}`
      );
      tooltip.attr("data-deaths", county.actuals.deaths);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json("https://d3js.org/us-10m.v1.json", function (error, us) {
  if (error) throw error;

  d3.json(
    "https://api.covidactnow.org/v2/counties.json?apiKey=15cb6385f77540ff9ba053a1b569b7a1",
    function (error, data) {
      if (error) throw error;
      console.log(data);
      drawMap(us, data);
    }
  );
});
