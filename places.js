// API Explorer Web Application
// This is a web application that serves as a creative search
// interface between the end-user and the data to fetch data
// from the FourSquare API using the user's current location.
// NOTE: User must allow browser to know their location

const mockapiUrl = "https://65427417ad8044116ed3666c.mockapi.io/FourSquare-DataSimulator"
const apiUrl = "https://api.foursquare.com/v3/places/search";
const headers = {
  Accept: "application/json",
  Authorization: `fsq3wUH26jgql4JkZj+2W28P9p8nMMhiQogRArJYT/Zcl34=`,
};

/***************** For Posting  ************************/
// const axios = require('axios');
const mockheaders = {
  'Content-Type': "application/json",
};

/*** Default Latitude and Longitude set to World Trade Centre, NY *****/
var latitude = "41.496650"; //"43.5884655";
var longitude = "-74.109590"; //"-79.7857482";

const v = "20231112"; // version YYYYMMDD
let query = ""; // query of the type of location searched nearby
const radius = 5000; // radius of the area to search in
const limit = 3; // number of results to get


const mainContainer = document.getElementsByClassName('main-container')[0];

/******* FUNCTION TO GET CURRENT LOCATION OF THE USER ******/

function getLocation() {
  const status = document.getElementById("statusID");

  const mapLink = document.getElementById("mapID");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    status.textContent = "";

    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

/***************** FETCH API DATA ************* */

async function fetchAPIData(latitude, longitude, query) {
  try {
    const searchParams = new URLSearchParams({
      ll: `${latitude},${longitude}`,
      query: query,
      radius: radius,
      limit: limit,
      sort: "DISTANCE",
    });

    const results = await fetch(`${apiUrl}?${searchParams}`, {
      method: "GET",
      headers: headers,
    });

    const data = await results.json();

    console.log("Results", data);
    const divElem = document.getElementsByClassName('fetch-data')[0]
    data.results.forEach((result) => {

      const divElem= document.createElement('div');// create div
      const h1Elem = document.createElement('h1'); // create h1
      const p1Elem = document.createElement('p'); // create p1
      const p2Elem = document.createElement('p'); // create p2
      const p3Elem = document.createElement('p'); // create p2

      // Set our content
      h1Elem.textContent = result.name;
      p1Elem.textContent = result.distance;
      p2Elem.textContent = result.location.formatted_address;
      p3Elem.textContent = result.categories[0].name;

      // Appending
      divElem.appendChild(h1Elem);
      divElem.appendChild(p1Elem);
      divElem.appendChild(p2Elem);
      divElem.appendChild(p3Elem);
      divElem.className = 'fetch-data';
      mainContainer.appendChild(divElem);

      console.log("Result",result.fsq_id);

      try {
        postData(result.fsq_id, result.name, result.distance, result.location.formatted_address,result.categories[0].name);
      } catch (error) {
        console.error(error);
      }
      

    });

    return data;
  } catch (error) {
    console.error("Fetch error ", error);
  }
}

/**************POST API DATA ****************** */
async function postData(fsq_id,name,distance,address,category) {
  const searchParams = new URLSearchParams({
    request_id: fsq_id,
    name:name,
    distance:distance,
    address:address,
    category:category
    // fsq_id: fsq_id,
    // select_context: "search",
    // delayed: "false",
  });

  // axios.post(mockapiUrl,searchParams)
  //   .then(response => {
  //     console.log('Data',response.data);
  //   })
  //   .catch(error => {
  //     console.log('Error',error);
  //   })
  try {
    const response = await post(`${mockapiUrl}?${searchParams}`, {
      method: "POST",
      headers: mockheaders,
    });

    const data = await response.json();
    console.log("POST DATA", data);
  } catch (error) {
    console.error("Error posting data:", error);
  }
}


/******************** SUBMIT BUTTON EVENTLISTENER *************/

document.getElementById("submitID").addEventListener("click", getLocation);
const clickButton = document.getElementById("submitID");

clickButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Get the container element
const resultContainer = document.getElementById('resultID');

// Loop through and remove all children
while (resultContainer.firstChild) {
  resultContainer.removeChild(resultContainer.firstChild);
}

const queryElem = document.getElementById("queryID");
const queryValue = queryElem.value;


try {
      await getLocation();
      await fetchAPIData(latitude, longitude,queryValue);
      

} catch (error) {
    console.error("Error fetching data:", error);
}
});
