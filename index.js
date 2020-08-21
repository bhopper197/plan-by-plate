'use strict';

const apiKey = "a573f79888c882ab54b3f22d1b68c8cd";
const url = "https://developers.zomato.com/api/v2.1/search";

const searchInput = "search-term";

$(function getAutocomplete() {
  $(".wrapper").hide(0).fadeIn(1500);

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


function handleAddButton(){
  $( "#add" ).click(function() {
    savePlate();
  });
};

function savePlate(){
  localStorage.setItem("1.", responseJson.restaurants.name);
};

function loadPlates(){};

function makePlatesHtml(restaurantProps){
  const plateHtml = 
  `<div id="plates"></div>`
};

function displayPlates(){};

// This function clears out user prior search input
function clearInputFields(elementId){
  document.getElementById("search-term").value = "";
  document.getElementById("cuisine").value = "";
};

function handleBackButton(event){
  $( "#back" ).click(function() {
    clearInputFields();
    $(".header").slideUp(1500);
    $("#results-list").fadeOut(1500);
    $( ".wrapper" ).fadeIn(3000);
  });
};

function onSearchSubmit(event){
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
      count: 5, // Limit results to 5 at a time.
    };

    return getRestaurants(params);
};

function makeTileHtml(restaurantProps){
  const tileHtml =
  `<li>
      <div class ="wrapper-tile">
            <div class="tile-form">
                <div class="tile-fields">
                    <h2 id="name" class = "results">${restaurantProps.name}</h2>
                    <h3 class = "rating">${restaurantProps.user_rating} / 5 Stars</h2>
                    <a href="${restaurantProps.menu}" target="_blank">
                    <img id = "menu" src="images/menu.png" alt="Menu-link"></a>
                    <h3 class = "input results"> 
                    Average cost for two: 
                    ${restaurantProps.currency}
                    ${restaurantProps.cost}
                    </h3>
                    <h3 class = "input results">${restaurantProps.type}</h3>
                    <h3 class = "input results">${restaurantProps.address}<br>${restaurantProps.city}</h3>
                    <button id="add" type="button">Add to Plates</button>
                </div>
            </div>
        </div>
  </li>`

return tileHtml;
};



function displayRestaurants(responseJson){
    console.log(responseJson);
    // Empty out any prior results.
    $("#results-list").empty();
    // Iterate over the array of restaurants to gather the data to display to the user.
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
        responseJson.restaurants[i].restaurant.currency,

        type:
        responseJson.restaurants[i].restaurant.establishment,
        
        address:
        responseJson.restaurants[i].restaurant.location.address,

        city:
        responseJson.restaurants[i].restaurant.location.city

      };

      $("#results-list").hide().fadeIn(1500).append(makeTileHtml(restaurantProps));
      $(".header").hide().slideDown(1500);
    };
    //display the results section  
    $(".header").removeClass("hidden");
    $("#results").removeClass("hidden");
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getRestaurantProps(responseJson){
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
      responseJson.restaurants[i].restaurant.currency,

      type:
      responseJson.restaurants[i].restaurant.establishment
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
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    onSearchSubmit(event);
    handleBackButton(event);
    handleAddButton();
  });
};

$(watchForm);