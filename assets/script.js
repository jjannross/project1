$(document).ready(function() {

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
        crossDomai: true,
        
      }).then(function(authResponse){
          console.log(authResponse);
        $.ajax({
            url: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2021-02-01&adults=1",
            type: 'GET',
            // Fetch the stored token from localStorage and set in the header
            headers: {"Authorization": 'Bearer ' + authResponse['access_token']}
          }).then(function(response){
              console.log(response);
              //code
          })
      })
})
