$(document).ready(function() {
    var listings = []
    var airlineCode = "";
    var offers = {};
    var flightPrice = 0;

    function buildQueryURL(){
        var origin = $('#origin-input')
        var destination =$('#destination-input')
        var departureDate = $('#start-date')
        var returnDate = $('#end-date')
    }

    $.ajax({
        url: "https://test.api.amadeus.com/v1/security/oauth2/token",
        dataType: "json",
        type: 'POST',
        headers: {
            "Access-Control-Allow-Origin" : "*",
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        data:{
            'grant_type': 'client_credentials',
            'client_id': 'NjkWdoTw9KJ1ISnVefwtvzolN91Lfn0m',
            'client_secret': 'TI5XaP4vYOLM93yG'
        },
        contentType: "application/json",
        
      }).then(function(authResponse){
          
        $.ajax({
            url: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2021-02-01&adults=1&max=5",
            type: 'GET',
            // Fetch the stored token from localStorage and set in the header
            headers: {"Authorization": 'Bearer ' + authResponse['access_token']}
          }).then(function(response){
              console.log(response)
              //collect price and airlineCode
              for(var i = 0; i < 5; i++){
                //create an object
                flightPrice = response.data[i].price.base;
                airlineCode = response.data[i].validatingAirlineCodes[0];
                offers = {price: flightPrice, code: airlineCode}
                listings.push(offers)
              }

              console.log(listings)
              console.log(listings[1])

              
          }).then(function() {

            //combine airline codes to lookup in one AJAX call
            var codes = "";
            var airlineURL = "https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=";

            listings.forEach(function(item, i) {

                codes += item.code;
                //add comma if not last entry
                if (i != listings.length - 1) {
                    codes += ",";
                }
            })

            $.ajax({
                url: airlineURL + codes,
                type: 'GET',
                // Fetch the stored token from localStorage and set in the header
                headers: {"Authorization": 'Bearer ' + authResponse['access_token']}
              }).then(function(airline){
                
                listings.forEach(function(listing, i) {
                    airline.data.forEach(function(data, j) {

                        if (listing.code === data.iataCode) {
                            listing.airlineName = data.businessName;
                        } else {
                            listing.airlineName = "Unknown";
                        }

                    })
                })
              })
      console.log(listings);

          })
      })
})
