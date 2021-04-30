# COVIDVisualizer
COVIDVisualizer is a data visualization tool. It allows you to visualize the total number of cases, total number of deaths, and total number of vaccinations in each county (over 3000) within the US. The data is up to date and provided by the NYT API(New York Times). You are further able to slice the data and see the age groups or races displayed undeath the US map as you hover over each county.  

## Technologies Used
* `JavaScript`
* `D3.js`
* `HTML`
* `CSS`

## Features

Upon initial load you get a blank slate and are able to filter the data using the filter buttons on the left; choosing a graph is not required.
![](https://i.ibb.co/bKw2Qh1/main.png)

Hovering over counties will show the county name and the number of people depending on the respective filter chosen above the legend.
![](https://i.ibb.co/z5m10D6/total-cases.png)

## Code Snippet

The mouseover event listener set on the map is one of the more complex parts of the visualizer.  On initial load the it will check for a chosen map and if nothing is chosen it won't display a legend. Then it iterates through the data provided to draw the map and checks the id of each county with the COVID data matching that unique id with the county "fips" code.
Once matched I was able to extract all the data as necessary.  Due to incongruencies with how all states report the data not all states report the information of age groups, or races. Due to this and for demonstration purposes, I made it check to see if no data was available to create a random number for each age group or race and keeping in mind the respective's county actual population, to be able to demonstrate graph data for each county.
```javascript
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
```
