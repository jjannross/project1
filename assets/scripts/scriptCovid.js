var stateCodes = [{
  name: "Alabama",
  code: "AL"
},
{
  name: "Alaska",
  code: "AK"
},
{
  name: "Arizona",
  code: "AZ"
},
{
  name: "Arkansas",
  code: "AR"
},
{
  name: "California",
  code: "CA"
},
{
  name: "Colorado",
  code: "CO"
},
{
  name: "Connecticut",
  code: "CT"
},
{
  name: "Delaware",
  code: "DE"
},
{
  name: "DC",
  code: "District of Columbia"
},
{
  name: "Florida",
  code: "FL"
},
{
  name: "Georgia",
  code: "GA"
},
{
  name: "Hawaii",
  code: "HI"
},
{
  name: "Idaho",
  code: "ID"
},
{
  name: "Illinois",
  code: "IL"
},
{
  name: "Indiana",
  code: "IN"
},
{
  name: "Iowa",
  code: "IA"
},
{
  name: "Kansas",
  code: "KS"
},
{
  name: "Kentucky",
  code: "KY"
},
{
  name: "Louisiana",
  code: "LA"
},
{
  name: "Maine",
  code: "ME"
},
{
  name: "Maryland",
  code: "MD"
},
{
  name: "Massachusetts",
  code: "MA"
},
{
  name: "Michigan",
  code: "MI"
},
{
  name: "Minnesota",
  code: "MN"
},
{
  name: "Mississippi",
  code: "MS"
},
{
  name: "Missouri",
  code: "MO"
},
{
  name: "Montana",
  code: "MT"
},
{
  name: "Nebraska",
  code: "NE"
},
{
  name: "Nevada",
  code: "NV"
},
{
  name: "New Hampshire",
  code: "NH"
},
{
  name: "New Jersey",
  code: "NJ"
},
{
  name: "New Mexico",
  code: "NM"
},
{
  name: "New York",
  code: "NY"
},
{
  name: "North Carolina",
  code: "NC"
},
{
  name: "North Dakota",
  code: "ND"
},
{
  name: "Ohio",
  code: "OH"
},
{
  name: "Oklahoma",
  code: "OK"
},
{
  name: "Oregon",
  code: "OR"
},
{
  name: "Pennsylvania",
  code: "PA"
},
{
  name: "Rhode Island",
  code: "RI"
},
{
  name: "South Carolina",
  code: "SC"
},
{
  name: "South Dakota",
  code: "SD"
},
{
  name: "Tennessee",
  code: "TN"
},
{
  name: "Texas",
  code: "TX"
},
{
  name: "Utah",
  code: "UT"
},
{
  name: "Vermont",
  code: "VT"
},
{
  name: "Virginia",
  code: "VA"
},
{
  name: "Washington",
  code: "WA"
},
{
  name: "West Virginia",
  code: "WV"
},
{
  name: "Wisconsin",
  code: "WI"
},
{
  name: "Wyoming",
  code: "WY"
}
]

var populationURL = "https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest";
var covidURL = "https://api.covidtracking.com/v1/states/current.json";


//get population of each state
$.ajax({
  url: populationURL,
  method: "GET"
}).then(function(response) {
  response.data.forEach(function(item) {
    stateCodes.forEach(function(state) {
      if (item.State === state.name) {
        //set population of each state
        state.population = item.Population;
      }
    })
  })

  //get covid data
  $.ajax({
  url: covidURL,
  method: "GET"
  }).then(function(response2) {
    response2.forEach(function(item) {
      stateCodes.forEach(function(state) {

        //set covid statistics
        if (item.state === state.code) {
          state.positiveIncrease = item.positiveIncrease;
          state.positive = item.positive;
          state.death = item.death;
          state.hospitalizedCurrently = item.hospitalizedCurrently;
          state.increasePer = state.positiveIncrease / (state.population / 100000)
        }
      })
    })


    stateCodes.sort(function(a, b) {
      return a.increasePer - b.increasePer;
    })

    stateCodes.forEach(function(item, i) {
      item.rank = i + 1;
    })
    
    console.log(stateCodes);

  })
});