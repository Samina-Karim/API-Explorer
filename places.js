// API Explorer Web Application
// This is a web application that serves as a creative search
// interface between the end-user and the data to fetch data
// from the FourSquare API using the user's current location.
// NOTE: User must allow browser to know their location

const mockapiUrl =
  "https://65427417ad8044116ed3666c.mockapi.io/FourSquare-DataSimulator";
const apiUrl = "https://api.foursquare.com/v3/places/search";
const headers = {
  Accept: "application/json",
  Authorization: `fsq3wUH26jgql4JkZj+2W28P9p8nMMhiQogRArJYT/Zcl34=`,
};

let locationFound = "False";
/***************** For Posting  ************************/

const mockheaders = {
  "Content-Type": "application/json",
};

const v = "20231112"; // version YYYYMMDD
let query = ""; // query of the type of location searched nearby
const radius = 5000; // radius of the area to search in
const limit = 3; // number of results to get

const mainContainer = document.getElementsByClassName("main-container")[0];

/******* FUNCTION TO GET CURRENT LOCATION OF THE USER ******/

function getLocation () {
  const status = document.getElementById("statusID");
  const mapLink = document.getElementById("mapID");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    status.textContent = "";

    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Your Currect Location is Latitude: ${latitude} °, Longitude: ${longitude} °`;
    locationFound="True";
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    mapLink.textContent = "Please Wait ! Finding Your Current Location ...";
   // status.textContent = "Please Wait ! Finding Your Current Location ...";
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
}

/***************** FETCH API DATA ************* */

async function fetchAPIData(latitude, longitude, query) {
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

  for (i = 0; i < data.results.length; i++) {
    const myData = data.results[i];

    const divElem = document.createElement("div"); // create div
    const h1Elem = document.createElement("h1"); // create h1
    const p1Elem = document.createElement("p"); // create p1
    const p2Elem = document.createElement("p"); // create p2
    const p3Elem = document.createElement("p"); // create p2

    // Set our content
    h1Elem.textContent = myData.name;
    p1Elem.textContent = myData.distance;
    p2Elem.textContent = myData.location.formatted_address;
    p3Elem.textContent = myData.categories[0].name;

    // Appending
    divElem.appendChild(h1Elem);
    divElem.appendChild(p1Elem);
    divElem.appendChild(p2Elem);
    divElem.appendChild(p3Elem);
    divElem.className = "fetch-data";
    mainContainer.appendChild(divElem);

    try {
      await postData(
        myData.fsq_id,
        myData.name,
        myData.distance,
        myData.location.formatted_address,
        myData.categories[0].name
      );
    } catch (error) {
      console.error(error);
    }
  }
  return data;
}

/**************POST API DATA ****************** */
async function postData(fsq_id, name, distance, address, category) {
  const searchParams = new URLSearchParams({
    fsq_id: fsq_id,
    name: name,
    distance: distance,
    address: address,
    category: category,
  });
  console.log(fsq_id, name, distance, address, category);

  try {
    const dataSet = {
      fsq_id: fsq_id,
      name: name,
      distance: distance,
      address: address,
      category: category,
    };
    const response = await fetch(`${mockapiUrl}`, {
      method: "POST",
      headers: mockheaders,
      body: JSON.stringify(dataSet),
    });

    const data = await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

/*************Call getLocation() at the start of the script *****/

getLocation();


/******************** SUBMIT BUTTON EVENTLISTENER *************/


document.getElementById("submitID").addEventListener("click", async (e) => {
  e.preventDefault();
const clickButton = document.getElementById("submitID");

  // Get the container element
  const resultContainer = document.getElementById("resultID");

  // Loop through and remove all children
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  const queryElem = document.getElementById("queryID");
  const queryValue = queryElem.value;

  // if query present and the current location has been found then only fetch the data
  if ((queryValue !="") && (locationFound)){   

    document.getElementById("queryID").value = "";
    try {
       // await getLocation();
      await fetchAPIData(latitude, longitude, queryValue);
    } catch (error) {
    console.error("Error fetching data:", error);
    }
  }
 
});

