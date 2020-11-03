'use strict';

const zomatoUrl = "https://developers.zomato.com/api/v2.1/search";

$(function getAutocomplete() {
  $(".wrapper").hide(0).fadeIn(1500);
  const searchInput = "search-term";
  // The Google Maps API's use Vanilla JavaScript in the example
  // of accessing the autocomplete function.
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

// **MODAL FUNCTIONS** //

function setZomatoApi(){
  localStorage.setItem("apiKey", "a573f79888c882ab54b3f22d1b68c8cd");
};

function getZomatoApi(){
  const zomatoApiKey = localStorage.getItem("apiKey");
  return zomatoApiKey;
};

function addRestaurant(restaurant){
  let plates = localStorage.getItem("plates");
  
  plates = JSON.parse(plates);

  // Max number of restaurants to be added to your plates.
  const MaxNumberOfPlates = 5;

  if (plates.length < MaxNumberOfPlates){
    // Push new restaurant to beginning of array.
    plates.unshift(restaurant);
    localStorage.setItem("plates", JSON.stringify(plates));
  } else if (plates.length === MaxNumberOfPlates){
    // Still push new restaurant into beginning of array.
    plates.unshift(restaurant); 
    // But since the array length is at its max, delete oldest item in plates.
    plates.splice(-1, 1);
    localStorage.setItem("plates", JSON.stringify(plates));
  }
};

// **VIEW FUNCTIONS** //

// This function maps over the plates array located in local storage and transforms the plates
// into the list elements in the variable plateList.
function platesToListElements(plates){
  var plateList = plates.map(plates =>
    `<li class="plate-item">${plates}</li>`
    );

  return plateList;
};

// This function creates the popup message informing the user they have added 
// a restaurant to their plates.
function toggleModalAddedRestaurant(event) {
  var modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");

  modal.classList.toggle("show-modal");
  closeButton.addEventListener("click", toggleModalAddedRestaurant);

  // This allows clicking outside of the modal to close out the modal.
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = modal.classList.toggle("show-modal");
    }
  }
};

// Clear out user prior search input.
function clearInputFields(elementId){
  $("#search-term").val("");
  $("#cuisine").val("");
};

// Plates argument is an array. 
function displayPlates(plates){
  $(".plate-names").html(platesToListElements(plates));
  $("#results-list").fadeOut(1000);
  $( "#your-plates").slideDown(2500);
  $( "#your-plates" ).removeClass("hidden");
};

function makeTileHtml(restaurantProps){
  const tileHtml =
  `<section>
      <li>
          <div class ="wrapper-tile">
                <div class="tile-form">
                    <div class="tile-fields">
                        <h2 class="name">${restaurantProps.name}</h2>
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
                        <button class="add" id="${restaurantProps.name}">Add to Plates</button>
                    </div>
                </div>
            </div>
      </li>
    </section>`

return tileHtml;
};

function makeErrorMessage(msg){
  const errorHtml = 
  `<div id="message" class="wrapper">
      <h3>No results, Please return to search</h3>
   </div>`

  return errorHtml;
};

function displayRestaurants(responseJson){
    // Empty out any prior results.
    $("#results-list").empty();
    // Iterate over the array of restaurants to gather the data to display to the user.
    for (let i = 0; i < responseJson.restaurants.length; i++){
      var restaurantProps = {
        name: 
        responseJson.restaurants[i].restaurant.name,
  
        user_rating: 
        responseJson.restaurants[i].restaurant.user_rating.aggregate_rating,

        menu:
        responseJson.restaurants[i].restaurant.menu_url,

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
      
      $("#results-list").hide().fadeIn(1000).append(makeTileHtml(restaurantProps));
      $(".header").hide().slideDown(1000);
    };
    // Listen for the user to add a restaurant. 
    setAddButton();
    //display the results section  
    $(".header").removeClass("hidden");
    $("#results").removeClass("hidden");
};

// **CONTROLLER FUNCTIONS** //

// Because handleLoadPlates() is only called from the results state.
// We can safely call displayPlates.
function handleLoadPlates(event){
  let plates = [];
  plates = JSON.parse(localStorage.getItem("plates"));
  displayPlates(plates);
};

function handleAddButton(event){
  let restaurant = event.currentTarget.id;
  addRestaurant(restaurant);
  toggleModalAddedRestaurant(event);
};

function handleBackToResults(event){
  $("#results-list").fadeIn(1000);
  $( "#your-plates").slideUp(2500);
};

function setAddButton(){
  $( ".add" ).on("click", handleAddButton);
};

function setPlatesButton(event){
  $( "#plates" ).on("click", handleLoadPlates);
};

function setBackToResultsButton(event){
  $( "#back-to-results" ).click(handleBackToResults)
};

function handleBackButton(event){
  $( "#back" ).click(function() {
    clearInputFields();
    $("#your-plates").fadeOut(1000)
    $(".header").slideUp(1000);
    $("#results-list").fadeOut(1000).hide();
    $( ".wrapper" ).fadeIn(2000);
  });
};

function onSearchSubmit(event){
    $( ".wrapper" ).slideUp(1500);
    // The values of the latitude and longitude are hidden inside the HTML.
    // Thus we can store the values that we get from the getAutoComplete function
    // without disrupting the viewport for the user.
    const latitude = $("#latitude-input").val();
    const longitude = $("#longitude-input").val();

    const cuisine = $("#cuisine").val();

    var params = {
      userKey: getZomatoApi(),
      url: zomatoUrl,
      q: cuisine, // Pass in the user query string.
      lat: latitude, // Pass in the lat from the autocomplete.
      lon: longitude, // Pass in the lng from the autocomplete.
      count: 10, // Limit results to 5 at a time.
    };

    getRestaurants(params);
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getRestaurants(params) {
  const fetchOptions = {
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


  fetch(url, fetchOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => { 
      displayRestaurants(responseJson);
      return responseJson;
    })
    .then(responseJson => {
      if(responseJson.results_found === 0){
        $(".header").hide().slideDown(1000);
        $('#results-list').hide().fadeIn(1000).append(makeErrorMessage());
      }
    })
    .catch(err => {
      $('#error-message').hide().fadeIn(1000).append(makeErrorMessage());
    });
}

function initApp() {
  $('form').submit(event => {
    event.preventDefault();
    setZomatoApi(localStorage);
    localStorage.setItem("plates", JSON.stringify([]));
    onSearchSubmit(event);
    handleBackButton(event);
    setPlatesButton(event);
    setBackToResultsButton(event);
  });
};

$(initApp);