'use strict';

const apiKey = "a573f79888c882ab54b3f22d1b68c8cd";
const url = "https://developers.zomato.com/api/v2.1/search";

const searchInput = "search-term";

$(document).ready(function inputAutoComplete() {
  var autoComplete = new 
  google.maps.places.Autocomplete((document.getElementById("search-term")), {
    types: ['geocode']
  });

    google.maps.event.addListener(autoComplete, "place_changed", function() {
        let near_place = autoComplete.getPlace();
        document.getElementById("latitude-input").value = 
        near_place.geometry.location.lat();

        document.getElementById("longitude-input").value = 
        near_place.geometry.location.lng();

        // document.getElementById("latitude-view").innerHTML = 
        // near_place.geometry.location.lat();

        // document.getElementById("longitude-view").innerHTML = 
        // near_place.geometry.location.lng();
        console.log(near_place.geometry.location.lat());
        console.log(near_place.geometry.location.lng());
    });

  });

  $(document).on("change", "#"+searchInput, function() {
    document.getElementById("latitude-input").value = "";
    document.getElementById("longitude-input").value = "";
  });

  const restaurant = [
    {
      name: "responseJson.restaurant.name",
      cuisines: "responseJson.restaurant.cuisines",
      user_rating: 
      "responseJson.restaurant.user_rating.aggregate_rating",
      highlights: "restaurant.highlights"
    },
  ];

function makeTileHtml(){
  const restaurant = `<div class="wrapper-tile">
  <div class="restaurant-form">
      <div class="input-fields">
          <h1>${restaurant.name}</h1>
          <h3>${restaurant.user_rating}</h3>
          <p>${restaurant.highlights}</p>
          <button id="add-plate">+</button>
      </div>
  </div>
</div>`
};

function renderElements(){}; 

function updateDOM(){};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function testGetRestaurants(){
  // Input = {lat, long}
  // Output = Json Object
  const params = {
    userKey: apiKey,
    url: url,
    q: "Italian",
    lat: 40.732013,
    lon: -73.996155,
    count: 1,
  };

  let output = getRestaurants(params);

  console.log(output);
};

function getRestaurants(params) {
  const options = {
    headers: new Headers({
      "user-key": params.userKey})
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
    getRestaurants();
  });
}

$(watchForm);