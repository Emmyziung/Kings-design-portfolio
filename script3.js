// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import { getFirestore, collection, getDoc, getDocs, addDoc, doc, setDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfc3fxf9XmFqviE-FjFpwCFA_TOs1hvA8",
  authDomain: "campus-nav-e8f24.firebaseapp.com",
  projectId: "campus-nav-e8f24",
  storageBucket: "campus-nav-e8f24.firebasestorage.app",
  messagingSenderId: "92851320898",
  appId: "1:92851320898:web:4ad704a751c00d428bd5db",
  measurementId: "G-STFWBVTPH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const locationsRef = collection(db, "locations")
const settingsRef = doc(db, "config", "setup");
const colRef = collection(db, 'busStops')


getDocs(colRef)
 .then((snapshot) => {
    console.log(snapshot.docs)
 })


 //global variables
 let pageSelector = 0









// Wait for the page to load before running the script
// Wait for the page to load before running the script
const initMapPage= () =>{
    
    const routeMarkers = [];
const routeLines = [];

       // Initialize the map and set its view to the campus location
       var map = L.map('map')
      
       // Define the bounds of your school using southwest and northeast coordinates
   var bounds = L.latLngBounds(
       [6.914043772332755, 3.8836093248055414],  // Bottom-left (SW corner)
       [6.938667812767362, 3.8570018113795497]   // Top-right (NE corner)
   );
  
   // Fit the map to this boundary
   map.fitBounds(bounds);
   
   // Add a tile layer (this is the map design)
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; OpenStreetMap contributors'
   }).addTo(map);
   
/*    var schoolBoundary = L.polygon([
       [6.937602785767634, 3.8703055680921341],  // Point 1
       [6.938028796812205, 3.8818927110368207],  // Point 2
       [6.923885022262517, 3.883523494116522],  // Point 3
       [6.91391596252223, 3.8727088273705297],  // Point 4
       [6.924737068964163, 3.860349208229413],
       [6.937602785767634, 3.8703055680921341]   // Closing the shape (same as first point)
   ], {
       color: 'blue',
       fillColor: '#3388ff',
       fillOpacity: 0
   }).addTo(map); */
   console.log(bounds)

/* if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
      (position) =>{
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude
            console.log(userLat, userLng)
            map.setView([userLat, userLng],17)
          } ,
          (error) => {
            console.error("Error getting location: ", error)
            alert("Could not get locatio. Please enable GPS")
          }
        )
    }else{
        alert("geolocation is not supported by this browser")
        map.setView([6.922448350709053, 3.871926653227083],20)
    }
     */
    
    map.setView([6.922448350709053, 3.871926653227083],18)
/*    schoolBoundary.bindPopup("Your School Campus"); */

   // Function to get URL parameters
   function getQueryParam(param) {
    console.log("shit")
    return new URLSearchParams(window.location.search).get(param);
 
  }

  // Get coordinates from URL
  const lat = parseFloat(getQueryParam("lat"));
  const lng = parseFloat(getQueryParam("lng"));

  console.log("Latiude", lat)
  // If valid coordinates exist, update the existing map
  if (!isNaN(lat) && !isNaN(lng)) {
    map.setView([lat, lng], 18); // Move the map to the new location

    // Place a marker at the selected location
    L.marker([lat, lng]).addTo(map)
      .bindPopup("Selected Location")
      .openPopup();
  } else {
    console.error("Invalid coordinates");
  }

  const viewType = new URLSearchParams(window.location.search).get("view");

if (viewType === "route") {
  const routeData = JSON.parse(localStorage.getItem("verificationRoute"));
  if (!routeData || !Array.isArray(routeData)) {
    console.error("No valid route data found in localStorage.");
    return;
  }

      if (routeData.length > 0) {
    
  const startCoords = routeData[0].from.coords;
        
  // First, center the map on the start point (e.g., School Park)
  map.setView(startCoords, 18);


}

  // Add markers and draw lines for each segment
  routeData.forEach((segment, index) => {
    const fromCoords = segment.from.coords;
    const toCoords = segment.to.coords;

    if (!fromCoords || !toCoords) {
      console.warn(`Skipping segment ${index} due to missing coords`);
      return;
    }

    // Add marker at 'from' location (only if it's the first point or different from previous)
    if (index === 0) {
     const marker= L.marker(fromCoords)
        .addTo(map)
        .bindPopup(segment.from.name)
        .openPopup();
        routeMarkers.push(marker)
    }

    // Always add 'to' marker
   const toMarker= L.marker(toCoords)
      .addTo(map)
      .bindPopup(segment.to.name);
      routeMarkers.push(toMarker)

    // Draw line between from and to
    const line = L.polyline([fromCoords, toCoords], {
      color: 'blue',
      weight: 4,
      opacity: 0.7
    }).addTo(map);

    routeLines.push(line);



  /*   // Optionally fit bounds to the full route
    map.fitBounds(line.getBounds()); */
  }

);


   const clearBtn = document.getElementById("clear-route")
   clearBtn.classList.remove("hidden");
console.log("clearBtn", clearBtn)
clearBtn.addEventListener("click", () => {
  routeMarkers.forEach(marker => map.removeLayer(marker));
  routeLines.forEach(line => map.removeLayer(line));

  routeMarkers.length = 0;
  routeLines.length = 0;

clearBtn.classList.add("hidden");
});


}
 function startUserTracking(map) {
  let userDot = null;
  let watchId = null;

  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      const latlng = [lat, lng];

      if (!userDot) {
        userDot = L.circleMarker(latlng, {
          radius: 7,
          fillColor: '#4285F4',
          fillOpacity: 1,
          color: '#fff',
          weight: 2
        }).addTo(map);
      } else {
        userDot.setLatLng(latlng);
      }
    },
    (error) => {
      console.error("Error getting location:", error.message);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000
    }
  );
}

// Then call this inside your initMapPage function:
startUserTracking(map);
}





//Fetch geoJSON file for campus locations
fetch("export.geojson")
  .then(response => response.json())
  .then(data => processGeoJSON(data))
  .catch(error => console.error("Error loading GeoJSON:", error));

/*   function processGeoJSON(geojsonData) {
    const locations = geojsonData.features.map(feature => ({
        name: feature.properties.name || "Unknown",
        type: feature.properties.amenity || "General",
        coordinates: feature.geometry.coordinates // [lng, lat]
    }));

    console.log(locations); // Check the extracted data
    return locations;
}
 */
async function processGeoJSON(geojsonData) {
    const locations = geojsonData.features.map(feature => ({
        name: feature.properties.name || "Unknown",
    
        lat: feature.geometry.coordinates[1],  // Latitude
        lng: feature.geometry.coordinates[0]   // Longitude
    }));''
    await uploadLocations(locations)
    return locations;
}

async function uploadLocations(locations) {
   
    // Check if locations have already been uploaded
    const setupSnapshot = await getDoc(settingsRef);
    if (setupSnapshot.exists()) {
        console.log("Locations already uploaded. Skipping...");
        return;
    }

    // Upload locations
    for (const loc of locations) {
        if (!loc.name || loc.name.toLowerCase() === "unknown"){
            continue
        }
        await addDoc(locationsRef, loc);
        console.log(`Uploaded: ${loc.name}`);
    }

        // Mark setup as complete
        await setDoc(settingsRef, { uploaded: true });
        console.log("Upload complete, setup marked.");
}
/* //Function to fetch all Locations from firstore
async function fetchLocations() {

    const querySnapshot = await getDocs(locationsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
 */
//Function to get user location
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
      (position) =>{
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude
            console.log(userLat, userLng)
            
          } ,
          (error) => {
            console.error("Error getting location: ", error.message)
            
          }
        )
    }else{
        console.error("geolocation is not supported by this browser")
    }

    // 🌍 Global user coordinates
let userCoordinates = { lat: null, lon: null };

// ✅ Shared function to get user's current location
function getUserLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoordinates.lat = position.coords.latitude;
        userCoordinates.lon = position.coords.longitude;
        console.log("User Location Updated:", userCoordinates);
        if (callback) callback(userCoordinates);
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// 📍 Haversine formula to calculate distance between two coordinates (in meters)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


const initBusStopPage = () => {
  
 // Function to fetch bus stops from Firestore
async function fetchBusStops() {
    const querySnapshot = await getDocs(collection(db, "busStops"));
    let busStops = [];
    querySnapshot.forEach(doc => {
        busStops.push({ id: doc.id, ...doc.data() });
    });

    if (userCoordinates.lat && userCoordinates.lon) {
      busStops.sort((a, b) => {
        const aDist = getDistance(userCoordinates.lat, userCoordinates.lon, a.Location.latitude, a.Location.longitude);
        const bDist = getDistance(userCoordinates.lat, userCoordinates.lon, b.Location.latitude, b.Location.longitude);
        return aDist - bDist;
      });
    }

    displayBusStops(busStops);
}



function displayBusStops(busStops) {
    
    const list = document.getElementById("busStopList");
    const skeletonList = document.getElementById("skeleton-busStopList")

    list.innerHTML = "";
    
    busStops.forEach((busStop )=> {
        console.log(busStop)
        let badgeClass = "bg-gray-500 text-white"
        if(busStop.Type && busStop.Type.trim().toLowerCase()=== 'major'){
            badgeClass="bg-gradient-to-r from-blue-700 to-blue-500 text-white"
        }
   
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${busStop.Location.latitude},${busStop.Location.longitude}&travelmode=driving`

        // Calculate distance if user location is known
      let fromYouDistance = "";
      if (userCoordinates.lat && userCoordinates.lon) {
        const meters = getDistance(userCoordinates.lat, userCoordinates.lon, busStop.Location.latitude, busStop.Location.longitude);
        fromYouDistance = `${(meters / 1000).toFixed(2)} km`;
        busStop.distance = meters;
      }
      const schoolMeters= getDistance(6.922494987305333, 3.8732850100159872, busStop.Location.latitude, busStop.Location.longitude )
      let toSchoolDistance = `${(schoolMeters / 1000).toFixed(2)} km`

        const card = document.createElement("div");
        card.className= "bg-white rounded-2xl shadow-md p-4 grid grid-cols-2 space-y-1 border"

        card.innerHTML = `
            
                <div class= "flex flex-col justify-between">
                <h2 class='text-xl font-semibold'>${busStop.Name}
                </h2>
                <p class= 'text-lg  font-semibold'>${busStop.Price}</p>
                <span class=" text-base font-medium">${busStop.Type}</span>
               
                <p class= 'text-sm text-gray-800'>From You:${fromYouDistance}</p>
                <p class= 'text-sm text-gray-800'>To School: ${toSchoolDistance}</p>
                </div>
                <div class="flex flex-col justify-center items-end">
                <a href="${mapsUrl}" target="_blank" class="mt-2 bg-gradient-to-tr from-sky-800 to-sky-600 text-white font-medium text-lg py-2 px-3 rounded-md text-center max-w-max whitespace-nowrap">
                Get Directions
            </a>
            </div>
        `
     
        list.appendChild(card);
    });

    if (list.innerHTML !=""){
        skeletonList.style.display="none"
    }
    
}
 
// Refresh every 10s to update distances
  function refreshBusStops() {
    getDocs(collection(db, "busStops")).then(snapshot => {
      const stops = [];
      snapshot.forEach(doc => stops.push({ id: doc.id, ...doc.data() }));

      // Sort by proximity before displaying
      if (userCoordinates.lat && userCoordinates.lon) {
        stops.sort((a, b) => {
          const aDist = getDistance(userCoordinates.lat, userCoordinates.lon, a.Location.latitude, a.Location.longitude);
          const bDist = getDistance(userCoordinates.lat, userCoordinates.lon, b.Location.latitude, b.Location.longitude);
          return aDist - bDist;
        });
      }

      displayBusStops(stops);
    });
  }

  getUserLocation(() => fetchBusStops());
  setInterval(() => getUserLocation(() => refreshBusStops()), 10000);
// Call function to fetch and display data
fetchBusStops();
}




const initHomePage=() =>{
try{
    

console.log("homepage")
// Dummy database for testing
const locations = [
    { name: "LLT3", description: "Large Lecture Theatre 3, opposite motion ground" },
    { name: "LLT2", description: "Large Lecture Theatre 2, close to faculty of law" },
    { name: "LLT1", description: "Large Lecture Theatre 1, along Library road" },
    { name: "Library", description: "Main Library, near Science Faculty" }
];

    const searchInput = document.getElementById("search-input");
    const searchScreen = document.getElementById("search-screen");
    const searchBox = document.getElementById("search-box");
    const searchResults = document.getElementById("search-results");
    const queryText = document.getElementById("query-text");
    const resultsTitle = document.getElementById("results-title");
    const closeSearch = document.getElementById("close-search");
    const theQueryText =document.getElementById('the-query-text')
    const fresherHomepageBtn = document.getElementById('fresher-homepage')
    console.log(fresherHomepageBtn)
    console.log(resultsTitle)
    fresherHomepageBtn.addEventListener("click", () =>{
        
        pageSelector=1
        console.log(pageSelector)
         window.location.href = `explore.html?pageSelector=${pageSelector}`
    })
    
    // Show search screen when tapping the search bar
    searchInput.addEventListener("focus", () => {
        console.log("tapmtap tap")
        console.log(queryText.value)
        searchScreen.style.display= "flex";
        queryText.value = "";
       /*  resultsTitle.style.display = "hidden" */// Hide title
        queryText.focus();
    });
    
    // Close search screen when pressing back button
    closeSearch.addEventListener("click", () => {
        searchScreen.style.display="none";
        searchBox.value = "";
        searchResults.innerHTML = "";  // Clear results
        /* resultsTitle.classList.add("hidden"); */ // Hide title
    
    });
   function capitalize(str){
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
   }

    // Live search function
    searchBox.addEventListener("input", async () => {
  const queri = capitalize(queryText.value.trim());
  theQueryText.textContent = queri;
  resultsTitle.classList.toggle("hidden", queri === "");

  if (queri === "") {
    searchResults.innerHTML = ""; // Clear when empty
    resultsTitle.classList.add("hidden");
    return;
  }

  const filteredLocations = [];

  try {
    // 🔍 First: Query by building name
   const allSnapsshot = await getDocs(locationsRef);
allSnapsshot.forEach((doc) => {
  const data = doc.data();
  if (data.name.toLowerCase().includes(queri.toLowerCase())) {
    data.matchType = "building";
    filteredLocations.push(data);
  }
});

    

    // 🔍 Second: Load ALL buildings and search manually in their floors
    const allSnapshot = await getDocs(locationsRef);
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      const buildingName = data.name;
      const floors = data.floors || {};

      for (const [floor, places] of Object.entries(floors)) {
        places.forEach((place) => {
          if (place.toLowerCase().includes(queri.toLowerCase())) {
            filteredLocations.push({
              name: place,
              description: `${floor} floor in ${buildingName}`,
              lat: data.lat,
              lng: data.lng,
              matchType: "place"
            });
          }
        });
      }
    });

    // Remove duplicates if building name and place both matched
    const uniqueResults = filteredLocations.filter(
      (value, index, self) =>
        index === self.findIndex((v) => v.name === value.name && v.description === value.description)
    );

    // Display
    if (uniqueResults.length === 0) {
      resultsTitle.classList.remove("hidden");
      searchResults.innerHTML = `<p class="text-gray-500 text-center mt-4">No results found</p>`;
    } else {
      resultsTitle.classList.remove("hidden");
      searchResults.innerHTML = uniqueResults
        .map((location, index) => {
          const highlight = location.matchType === "place" ? "text-blue-600" : "text-gray-800";
          return `
              <div class="result-item bg-white border border-gray-300 rounded-lg p-3 shadow-md hover:bg-gray-100 transition" data-lat="${location.lat}" data-lng="${location.lng}" id="location-${index}">
                  <h3 class="text-lg font-semibold ${highlight}">${location.name}</h3>
                  <p class="text-sm text-gray-600">${location.description}</p>
              </div>
          `;
        })
        .join("");

      // Click handler
      document.querySelectorAll(".result-item").forEach((item) => {
        item.addEventListener("click", (event) => {
          const lat = event.currentTarget.getAttribute("data-lat");
          const lng = event.currentTarget.getAttribute("data-lng");
          if (lat && lng) {
            window.location.href = `location.html?lat=${lat}&lng=${lng}`;
          }
        });
      });
    }
  } catch (err) {
    console.error("Search error:", err);
  }
});

    
}catch(error){
    console.error(error)
}


let coordinatesArray= []
async function fetchLocations(){
    const placesRef = collection(db, "locations")
    const q = query(placesRef, where("name", "in", ["School Park",
    "1500-Seater Lecture Theatre III", "Faculty of Science Phase I", "Bvers"]))

    const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            coordinatesArray.push({lat: data.lat, lng: data.lng})
        })
        console.log("Extracted Coordinates:", coordinatesArray)
}
fetchLocations()
const buttons = document.querySelectorAll(".location-button")
buttons.forEach((button,index) =>{
    button.addEventListener("click", ()=>{
        const {lat, lng}= coordinatesArray[index]
        window.location.href= `location.html?lat=${lat}&lng=${lng}`
    })
})

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (value) => (value * Math.PI) / 180;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to get nearby locations from Firestore (Using lat and long fields)
async function getNearbyLocations(userLat, userLon, radius = 500) {
  
    const locationsRef = collection(db, "locations");

    // Get all locations
    const querySnapshot = await getDocs(locationsRef);
    const nearbyPlaces = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Ensure lat and long exist
        if (data.lat !== undefined && data.lng !== undefined) {
            const distance = getDistance(userLat, userLon, data.lat, data.lng);
            
            if (distance <= radius) {
                nearbyPlaces.push({ ...data, distance });
            }
        }
    });

    // Sort locations by distance (closest first)
    nearbyPlaces.sort((a, b) => a.distance - b.distance);

    console.log("Nearby Places:", nearbyPlaces);
    return nearbyPlaces.splice(0,3); // Limit to 4 closest places
}

function trackUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            async (position) => {
                const userLat = /* position.coords.latitude */ 6.9259252731540215
                const userLon =/*  position.coords.longitude; */ 3.8693996518949443

                console.log("User Location:", userLat, userLon);

                // Fetch updated nearby places from Firestore
                const nearbyPlaces = await getNearbyLocations(userLat, userLon);

                // Update UI dynamically
                updateUI(nearbyPlaces, userLat, userLon);
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
const skeletonNearby = document.querySelectorAll(".skeleton-nearby-places")
// Function to update the UI with new nearby places
function updateUI(places, lat, lng) {
    console.log(places)
    const nearbyList = document.getElementById("nearby-places");
    nearbyList.innerHTML = "" // Clear previous results
    
    const userCoordsDiv = document.createElement("div")
    console.log("userCoordsDiv")
    userCoordsDiv.classList.add("mb-4", "font-semibold", "text-sm", "text-gray-700")
    userCoordsDiv.innerText= `Your Location: Latitude ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    console.log(userCoordsDiv)
    /* nearbyList.appendChild(userCoordsDiv) */
    places.forEach((place) => {
        const nearbyCards = document.createElement("div");
        nearbyCards.className = "min-w-[200px] lg:w-full flex-shrink-0";
        nearbyCards.innerHTML = `<div class="min-h-[85px] lg:min-h-[100px] xl:min-h-[120px]  w-full bg-white shadow-sm rounded-xl border-[1px]">
              <img src="${place.imageUrl }" alt="${place.name}" class="w-full h-[120px] object-cover rounded-t-xl">
    <div class="p-2 text-sm font-medium">
      <p class="text-gray-800">${place.name}</p>
      <p class="text-gray-500">${Math.round(place.distance)}m away</p>
    </div>
        </div>`
       /*  listItem.textContent = `${place.name} - ${Math.round(place.distance)}m away`; */
        nearbyList.appendChild(nearbyCards);
    });
    // Show skeleton loader if no places found
       if (nearbyList.innerHTML != "") {
        skeletonNearby.forEach(el => {
            el.style.display = "none";
        })  
    }
 
}

// Start tracking user location

trackUserLocation();
}

const initExplorePage=() => {
    const mainSection = document.getElementById("main-section");
    const freshersButton = document.getElementById("freshers-button");
    const transportButton = document.getElementById("transport-button");
    const reviewButton = document.getElementById("review-button");
    const freshersPage = document.getElementById("freshers-page")
    const transportPage = document.getElementById("transport-page")
    const freshersBackButton = document.getElementById("freshers-go-back")
 
    const transportBackButton = document.getElementById("transport-go-back")

    //parsing the url paramerters if any
    const queriString = window.location.search
    const urlParams =new URLSearchParams(queriString)
    transportButton.style.backgroundColor = '#f3f4f6 '
        transportButton.addEventListener("mouseover", () => {
          transportButton.style.backgroundColor = '#e5e7eb '
        })
        transportButton.addEventListener("mouseout", () => {
          transportButton.style.backgroundColor = '#f3f4f6'
        })
        freshersButton.addEventListener("mouseover", () => {
          freshersButton.style.backgroundColor = '#f3f4f6'
        })
        freshersButton.addEventListener("mouseout", () => {
          freshersButton.style.backgroundColor = 'white'
        })
       reviewButton.addEventListener("mouseover", () => {
         reviewButton.style.backgroundColor = '#f3f4f6 '
        })
       reviewButton.addEventListener("mouseout", () => {
         reviewButton.style.backgroundColor = 'white'
        })
        freshersButton.style.backgroundColor = 'white'

    if(urlParams){
        pageSelector=urlParams.get('pageSelector')
    }
    console.log(pageSelector)
     const loadFreshersPage= () => {
        freshersPage.style.display ='flex'
        transportPage.style.display ='none'
        mainSection.style.display = 'grid'
        console.log("shs")
        
    }
    if(pageSelector==1){
       loadFreshersPage()
       pageSelector=0
    } 
   
    freshersBackButton.addEventListener("click", () => {
        freshersPage.style.display='none'
    })
    transportBackButton.addEventListener('click',()=> {
        transportPage.style.display='none'
        console.log(pageSelector)
    })
 
    /*  backButton.addEventListener("click", () => {
        pageSelector=0
        console.log("thh", pageSeletor)
        freshersPage.style.display='none'
        checker()
     })
     const checker=()=>{
        console.log(pageSelector)
     } */
    freshersButton.addEventListener("click", () => {
        freshersPage.style.display ='flex'
        transportPage.style.display ='none'
        mainSection.style.display = 'grid'
        console.log("shs")
        freshersButton.style.backgroundColor = '#f3f4f6 '
        freshersButton.addEventListener("mouseover", () => {
          freshersButton.style.backgroundColor = '#e5e7eb '
        })
        freshersButton.addEventListener("mouseout", () => {
          freshersButton.style.backgroundColor = '#f3f4f6'
        })
         transportButton.addEventListener("mouseover", () => {
          transportButton.style.backgroundColor = '#f3f4f6 '
        })
        transportButton.addEventListener("mouseout", () => {
          transportButton.style.backgroundColor = 'white'
        })
        transportButton.style.backgroundColor = 'white'
        
    })

    transportButton.addEventListener("click", () => {
        transportPage.style.display ='flex'
        freshersPage.style.display = 'none'
        mainSection.style.display = 'grid'
        console.log("shs")
        transportButton.style.backgroundColor = '#f3f4f6 '
        transportButton.addEventListener("mouseover", () => {
          transportButton.style.backgroundColor = '#e5e7eb '
        })
        transportButton.addEventListener("mouseout", () => {
          transportButton.style.backgroundColor = '#f3f4f6'
        })
        freshersButton.addEventListener("mouseover", () => {
          freshersButton.style.backgroundColor = '#f3f4f6'
        })
        freshersButton.addEventListener("mouseout", () => {
          freshersButton.style.backgroundColor = 'white'
        })
        freshersButton.style.backgroundColor = 'white'
    })

    const verificationUnits = [
  {
    name: "School Park",
    image: "img/school_park.jpg",
    coords: [6.922547439042365, 3.873277556211672]
  },
    {
    name: "Library",
         lat: 6.921086550848251,
      lng: 3.8692844890411555,
    image: "img/library.jpg",
    coords: [6.921086550848251, 3.8692844890411555]
  },
 
  {
    name: "Guidance & Counselling",
      lat: 6.920463906380327,
      lng: 3.872979831012196,
    image: "img/guidance_counselling.jpg",
    coords: [6.920463906380327, 3.872979831012196]
  },
   {
    name: "Security Unit",
      lat: 6.922334426544132,
      lng: 3.872907411363453,
    image: "img/security_unit.jpg",
    coords: [6.922334426544132, 3.872907411363453]
  },
   {
    name: "Sports Complex",
         lat: 6.927794172884336,
      lng: 3.87134368352198,
    image: "img/sports.jpg",
    coords: [6.927794172884336, 3.87134368352198]
  },
  {
    name: "Student Affairs",
    lat: 6.92006184343453,
      lng: 3.873277556216198,
    image: "img/student_affairs.jpg",
    coords: [6.92006184343453, 3.873277556216198]
  },
   {
    name: "ID Card",
     lat: 6.92594447477919,
      lng: 3.866966982241196,
    image: "img/id_card.jpg",
    coords: [6.92594447477919, 3.866966982241196]
  },
  {
    name: "Medical",
    lat: 6.9173987469154365,
      lng: 3.874109783058465,
    image: "img/medical.jpg",
    coords: [6.9173987469154365, 3.874109783058465]
  }

 
 
];

const routeSegments = [
  { from: "School Park", to: "Security Unit", time: 0.6 },
  { from: "Security Unit", to: "Guidance & Counselling", time: 2.5 },
  { from: "Guidance & Counselling", to: "Student Affairs", time: 0.7 },
  { from: "Student Affairs", to: "Medical", time: 3.7 },
  { from: "Medical", to: "Library", time: 8.0 },
  { from: "Library", to: "ID Card", time: 7.1 },
  { from: "ID Card", to: "Sports Complex", time: 6.3 }
];

const cardsContainer = document.getElementById("verification-cards");
const roadmap = document.getElementById("roadmap");
const timeline = document.getElementById("timeline");
const showRouteBtn = document.getElementById("show-route");
const viewMapBtn = document.getElementById("view-on-map");

verificationUnits.slice(1).forEach(unit => {
  const card = document.createElement("a");
  card.href = `location.html?lat=${unit.lat}&lng=${unit.lng}&title=${encodeURIComponent(unit.title)}`;
  card.className = "bg-white rounded-xl shadow-md flex flex-col items-center text-center";
  card.innerHTML = `
 <img src="${unit.image}" alt="${unit.name}" class="w-full h-24 sm:h-26 object-cover rounded-t-md mb-1 sm:mb-2" />
    <h3 class="font-medium text-gray-800 leading-tight">${unit.name}</h3>
  `;
  cardsContainer.appendChild(card);
});

showRouteBtn.addEventListener("click", () => {
 // First, make it visible if hidden
  const wasHidden = roadmap.classList.contains("hidden");

  if (wasHidden) {
    roadmap.classList.remove("hidden");

    // Wait for the DOM to repaint before scrolling
    requestAnimationFrame(() => {
      roadmap.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  } else {
    roadmap.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  timeline.innerHTML = "";

  let currentStep = 1;
  routeSegments.forEach(segment => {
    const unit = verificationUnits.find(u => u.name === segment.from);
    const nextUnit = verificationUnits.find(u => u.name === segment.to);

    const step = document.createElement("div");
    step.className = "mb-6 relative";
    step.innerHTML = `
      <div class="absolute -left-8 w-6 h-6 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center">${currentStep}</div>
      <p class="font-semibold">${segment.from}</p>
      <p class="text-sm text-gray-600">⟶ ${segment.to}</p>
      <p class="text-sm text-gray-500 italic">~${segment.time} min walk</p>
    `;
    timeline.appendChild(step);
    currentStep++;
  });

  const lastStep = document.createElement("div");
  lastStep.className = "mb-6 relative";
  lastStep.innerHTML = `
    <div class="absolute -left-8 w-6 h-6 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center">${currentStep}</div>
    <p class="font-semibold">${routeSegments[routeSegments.length - 1].to}</p>
  `;
  timeline.appendChild(lastStep);
});

viewMapBtn.addEventListener("click", () => {
  const routeData = routeSegments.map(segment => {
    const from = verificationUnits.find(u => u.name === segment.from);
    const to = verificationUnits.find(u => u.name === segment.to);
    return {
      from: { name: segment.from, coords: from.coords },
      to: { name: segment.to, coords: to.coords },
      time: segment.time
    };
  });

  // 👇 Debug: Check data before saving
  console.log("Saving routeData to localStorage", routeData);
  localStorage.setItem("verificationRoute", JSON.stringify(routeData));
  window.location.href = "location.html?view=route";
});

}

document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.includes("index.html")|| window.location.pathname=== "/"){
        initHomePage()
    }else if (window.location.pathname.includes("location.html")){
        initMapPage()
    }else if (window.location.pathname.includes("busStop.html")){
        initBusStopPage()
    }else if (window.location.pathname.includes("explore.html")){
        initExplorePage()
    }
})
