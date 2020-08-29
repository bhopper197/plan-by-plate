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

function toggleModal() {
  var modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");

  modal.classList.toggle("show-modal");
  closeButton.addEventListener("click", toggleModal);
};


// Modal Functions.
function setPlate(responseJson){

  // Value of buttons = HTMLCollection(5) 
  // [button.add, button.add, button.add, button.add, button.add].
  let buttons = document.getElementsByClassName("add");
  console.log(buttons);

  buttons[0].addEventListener("click", getPlate, true);
  // Value of list = [h2.name, h2.name, h2.name, h2.name, h2.name]
  let list = document.getElementsByClassName("name");
  console.log(list[0].innerHTML);

  let restaurant = list[0].innerHTML;
  plates.r1 = localStorage.setItem("restaurant", restaurant);
};

function getPlate(localStorage){
  console.log("testing")
};

// Plates argument is an object. 
function displayPlates(plates){
  console.log(localStorage);
  $("#name--1").html(plates.r1);
  $("#results-list").fadeOut(1000)
  $( "#your-plates").slideDown(2500);
  $( "#your-plates" ).removeClass("hidden");
};

// Because handleLoadPlates() is only called from the results state.
// We can safely call displayPlates.
function handleLoadPlates(event){
  let plates = {};
  plates.r1 = localStorage.restaurant;
  displayPlates(plates);
};

function handleAddButton(event){
  setPlate(plates);
  toggleModal();
};

function handleBackToResults(event){
  $("#results-list").fadeIn(1000)
  $( "#your-plates").slideUp(2500);
};

// We need to set an event listener that knows which button is pressed.
// And then attach that button press to the restaurant name that was selected.
function setAddButton(){
  $( ".add" ).on("click", handleAddButton);
};

function setPlatesButton(event){
  $( "#plates" ).on("click", handleLoadPlates);
};

function setBackToResultsButton(event){
  $( "#back-to-results" ).click(handleBackToResults)
};

function loadPlates(){};

function makePlatesHtml(restaurantProps){
  const plateHtml = 
  `<div id="plates"></div>`
};

// This function clears out user prior search input
function clearInputFields(elementId){
  document.getElementById("search-term").value = "";
  document.getElementById("cuisine").value = "";
};

function handleBackButton(event){
  $( "#back" ).click(function() {
    clearInputFields();
    $( "#your-plates").fadeOut(1500)
    $(".header").slideUp(1500);
    $("#results-list").fadeOut(1000)
    $( ".wrapper" ).fadeIn(2000);
  });
};

function onSearchSubmit(event){
    $( ".wrapper" ).slideUp(1500);
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
                        <button class="add">Add to Plates</button>
                    </div>
                </div>
            </div>
      </li>
    </section>`

return tileHtml;
};

function makeErrorMessage(msg){
  const errorHtml = 
  `<div class="wrapper hidden">
      <h3>No results, Please return to search</h3>
   </div>`
  
  return errorHtml;
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
      
      $("#results-list").hide().fadeIn(1000).append(makeTileHtml(restaurantProps));
      $(".header").hide().slideDown(1000);
    };
    // Listen for the user to add a restaurant. 
    setAddButton();
    //display the results section  
    $(".header").removeClass("hidden");
    $("#results").removeClass("hidden");
    popUpBox(ele);
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


  fetch(url, options)
    .then(response => {
      if (response.ok) {
        console.log(response)
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
    setPlatesButton(event);
    setBackToResultsButton(event);
  });
};

$(watchForm);