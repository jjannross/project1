$(document).ready(function () {
  var listings = [];
  var airlineCode = "";
  var offers = {};
  var flightPrice = 0;
  var destinations = [];
  var origins = [];

  var destinationEl = $("#destination-input");
  var originEl = $("#origin-input");

  var flightTime = "";
  var flightid = [$("#flight1"), $("#flight2"), $("#flight3")];

  $("#submit").click(function () {
    var departureDateEl = $("#departure-date");
    var returnDateEl = $("#arrival-date");
    var dateArray = [departureDateEl.val(), returnDateEl.val()];

    function formatDates(item, i) {
      var newdateArray = item.split("/");

      console.log(
        (dateArray[i] =
          newdateArray[2] + "-" + newdateArray[0] + "-" + newdateArray[1])
      );
    }
    dateArray.forEach(formatDates);
    console.log(dateArray);

    var returnDateEl = $("#arrival-date");

    $.ajax({
      url: "https://test.api.amadeus.com/v1/security/oauth2/token",
      dataType: "json",
      type: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: {
        grant_type: "client_credentials",
        client_id: "H2NIsz8JitGKczKllmotuAyKOG3UydPO",
        client_secret: "n91FfCFUmnvdGuiK",
      },
      contentType: "application/json",
    }).then(function (authResponse) {
      //makes keyword search
      var fakedestination = destinationEl.val();
      var destination = fakedestination.split(",");
      var fakeorigin = originEl.val();
      var origin = fakeorigin.split(",");
      var originiataCode = [];

      function searchOrigin(origin) {
        if (origin[0] === "") {
          return;
        } else {
          $.ajax({
            url:
              "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" +
              origin +
              "&countryCode=US&page[limit]=5",
            type: "GET",
            headers: {
              Authorization: "Bearer " + authResponse["access_token"],
            },
          }).then(function (key) {
            originiataCode.push(key.data[0].iataCode);
          });
        }
      }

      var destIataCode = [];

      function searchDestination(destination) {
        if (destination[0] === "") {
          return;
        } else {
          $.ajax({
            url:
              "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" +
              destination[0] +
              "&countryCode=US&page[limit]=5",
            type: "GET",
            headers: {
              Authorization: "Bearer " + authResponse["access_token"],
            },
          }).then(function (key) {
            destIataCode.push(key.data[0].iataCode);
          });
        }
      }

      searchOrigin(origin);
      searchDestination(destination);

      setTimeout(function () {
        console.log(destIataCode[0]);
        $.ajax({
          url:
            "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" +
            originiataCode[0] +
            "&destinationLocationCode=" +
            destIataCode[0] +
            "&departureDate=" +
            dateArray[0] +
            "&returnDate=" +
            dateArray[1] +
            "&adults=1&max=5&currencyCode=USD",
          type: "GET",
          // Fetch the stored token from localStorage and set in the header
          headers: { Authorization: "Bearer " + authResponse["access_token"] },
        })
          .then(function (response) {
            console.log(response);
            //collect price and airlineCode
            for (var i = 0; i < 5; i++) {
              //create an object
              flightPrice = response.data[i].price.base;
              airlineCode = response.data[i].validatingAirlineCodes[0];
              flightTime = response.data[i].itineraries[0].duration;

              offers = {
                price: flightPrice,
                code: airlineCode,
                duration: flightTime.slice(2),
              };
              listings.push(offers);
            }
          })
          .then(function () {
            //combine airline codes to lookup in one AJAX call
            var codes = "";
            var airlineURL =
              "https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=";

            listings.forEach(function (item, i) {
              codes += item.code;
              //add comma if not last entry
              if (i != listings.length - 1) {
                codes += ",";
              }

              $.ajax({
                url: airlineURL + codes,
                type: "GET",
                // Fetch the stored token from localStorage and set in the header
                headers: {
                  Authorization: "Bearer " + authResponse["access_token"],
                },
              }).then(function (airline) {
                listings.forEach(function (item, i) {
                  airline.data.forEach(function (data, j) {
                    if (item.code === data.iataCode) {
                      item.airlineName = data.businessName;
                    } else {
                      item.airlineName = "Unknown";
                    }
                  });
                });
                console.log(listings);
              });
            });

            setTimeout(function () {
              flightid.forEach(function (item, i) {
                item.text("Flight" + " " + (1 + i));
                var newDiv = $("<div>").addClass("card-body");
                var newP = $("<p>").addClass("card-text");

                var newP1 = $("<p>").addClass("card-text");

                var newP2 = $("<p>").addClass("card-text");

                item.append(newDiv);
                newP.text("Price:" + " " + "$" + listings[i].price);
                newDiv.append(newP);
                newP1.text("Airline:" + listings[i].airlineName);
                newDiv.append(newP1);
                newP2.text("Duration:" + listings[i].duration + "");
                newDiv.append(newP2);
              });
            }, 500);
          });
      }, 3000);
    });
  });
});
