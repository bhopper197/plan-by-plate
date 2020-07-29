'use strict';

const apiKey = "a573f79888c882ab54b3f22d1b68c8cd";
const url = "https://developers.zomato.com/api/v2.1/search"

function renderElements(){};

function formatQueryString(){};

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