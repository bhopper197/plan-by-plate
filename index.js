'use strict';

const apiKey = "a573f79888c882ab54b3f22d1b68c8cd";
const url = "https://developers.zomato.com/api/v2.1/search";

const searchInput = "search-term";

$(function getAutocomplete() {
  $(".wrapper").hide().fadeIn(3500);

  var autoComplete = new 
  google.maps.places.Autocomplete((document.getElementById("search-term")), {
    types: ['geocode']
  });

    google.maps.event.addListener(autoComplete, "place_changed", function() {
      var near_place = autoComplete.getPlace();

      document.getElementById("latitude-input").value = 
      near_place.geometry.location.lat();

      document.getElementById("longitude-input").value = 
      near_place.geometry.location.lng();
    });
  });

  // COMMENT OUT LATER.
const restaurantProps = {
  name: "Gino's",
  cuisines: "Italian",
  user_rating: "4.5",
  highlights: "Tuscan plates, Small Plates, Bread."
};

function testHandleGoButton(){
  $( "#search" ).click(function() {
    $( ".wrapper" ).fadeOut(1500);
    const latitude = $("#latitude-input").val();
    const longitude = $("#longitude-input").val();
    const cuisine = $("#cuisine").val();
  
    var params = {
      userKey: apiKey,
      url: url,
      q: cuisine, // Pass in the user query string.
      lat: latitude, // Pass in the lat from the autocomplete.
      lon: longitude, // Pass in the lng from the autocomplete.
      count: 5, // Limit results to 10 at a time.
    };

    let output = getRestaurants(params);
    console.log(output);
  });
};

function testMakeTileHtml(){
  let html = makeTileHtml(restaurantProps);
  return html;
};

function makeTileHtml(restaurantProps){
  const tileHtml = `
  <section id="results" class="hidden">
    <h1>Plates to Discover</h1>
    <ul id="results-list">
      <li>
        <div class ="wrapper">
              <div class="restaurant-form">
                  <div class="input-fields">
                      <h2>${restaurantProps.name}</h1>
                      <h3>${restaurantProps.user_rating}/5</h2>
                      <h3>${restaurantProps.cuisines}</h3>
                      <p>${restaurantProps.highlights}</p>
                  </div>
              </div>
          </div>
      </li>
    </ul>
  </section>`;

return tileHtml;
};

function displayRestaurants(responseJson){
    console.log(responseJson);
    // Empty out any prior results.
    $("#results-list").empty();

    for (let i = 0; i < responseJson.restaurants.length; i++){
      var restaurantProps = {
        name: 
        responseJson.restaurants[i].restaurant.name,
        
        timings: 
        responseJson.restaurants[i].restaurant.timings,
  
        user_rating: 
        responseJson.restaurants[i].restaurant.user_rating.aggregate_rating,

        menu:
        responseJson.restaurants[i].restaurant.menu_url,

        image:
        responseJson.restaurants[i].restaurant.featured_image,

        cost:
        responseJson.restaurants[i].restaurant.average_cost_for_two,

        currency:
        responseJson.restaurants[i].restaurant.currency
      };

      $("#results-list").hide().fadeIn(1000).append(
          `<li>
            <div class ="wrapper-tile">
                  <div class="tile-form">
                      <div class="tile-fields">
                          <h2>${restaurantProps.name}</h1>
                          <img src="${restaurantProps.image}" alt="featured-image">
                          <h3 class = "results">${restaurantProps.user_rating} Stars</h2>
                          <h3 class = "input results"> 
                          Average cost for two: 
                          ${restaurantProps.currency}
                          ${restaurantProps.cost}
                          </h3>
                          <h3 class = "input">${restaurantProps.timings}</h3>
                          <a href="${restaurantProps.menu}" target="_blank">
                      </div>
                  </div>
                  <img id = "menu" src="images/menu.png" alt="Menu-link"></a>
              </div>
          </li>`
      );
    };
    //display the results section  
    $("#results").removeClass("hidden");
};

function updateDOM(){};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function testGetRestaurants(){
  const latitude = $("#latitude-input").val();
  const longitude = $("#longitude-input").val();
  const cuisine = $("#cuisine").val();

  var params = {
    userKey: apiKey,
    url: url,
    q: cuisine, // Pass in the user query string.
    lat: latitude, // Pass in the lat from the autocomplete.
    lon: longitude, // Pass in the lng from the autocomplete.
    count: 5, // Limit results to 10 at a time.
  };

  let output = getRestaurants(params);

  console.log(output);
};

function getRestaurantProps(responseJson){
  for (let i = 0; i < responseJson.restaurants.length; i++){
    var restaurantProps = {
      name: 
      responseJson.restaurants[i].restaurant.name,
      
      cuisines: 
      responseJson.restaurants[i].restaurant.establishment,

      user_rating: 
      responseJson.restaurants[i].restaurant.user_rating.aggregate_rating,

      highlights: 
      responseJson.restaurants[i].restaurant.highlights
    };
  };
  return restaurantProps;
};

function getRestaurants(params) {
  const options = {
    headers: new Headers({
      "user-key": params.userKey
    })
  };

  const userKey = params.apiKey;
  delete params.apiKey;
  const searchURL = params.url;
  delete params.url;

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);


  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayRestaurants(responseJson))
    .then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    testHandleGoButton();
  });
}

$(watchForm);