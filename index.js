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

const restaurantProps = {
  name: "Gino's",
  cuisines: "Italian",
  user_rating: "4.5",
  highlights: "Tuscan plates, Small Plates, Bread."
};

function testHandleGoButton(){
  $( "#search" ).click(function() {
    let latitude = $("#latitude-input").val();
    let longitude = $("#longitude-input").val();
    let cuisine = $("#cuisine").val();

    console.log(latitude);
    console.log(longitude);
    console.log(cuisine);
  });
};

function testMakeTileHtml(){
  let html = makeTileHtml(restaurantProps);
  return html;
};

function makeTileHtml(restaurantProps){
  const tileHtml = `<div class ="wrapper-tile">
  <div class="restaurant-form">
      <div class="input-fields">
          <h1>${restaurantProps.name}</h1>
          <h2>${restaurantProps.user_rating}/5</h2>
          <h3>${restaurantProps.cuisines}</h3>
          <p>${restaurantProps.highlights}</p>
          <button id="add-plate">+</button>
      </div>
  </div>
</div>`

return tileHtml;
};

function renderElements(){}; 

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
    count: 5, // Limit results to 5 at a time.
  };

  let output = getRestaurants(params);

  console.log(output);
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
    .then(responseJson => console.log(responseJson, params.count))
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