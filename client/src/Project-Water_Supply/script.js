let map;
let markers = [];
let coordinates=[];
let line;

function initMap() {
  const loc = { lat: 17.39763609879129, lng: 78.49017952657705 };       //17.39763609879129, 78.49017952657705

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: loc,
    mapTypeId: "terrain",
  });
  // This event listener will call addMarker() when the map is clicked.
  map.addListener("click", (event) => {
    coordinates.push(event.latLng);
    addMarker(event.latLng);
  });
  // add event listeners for the buttons
  document
    .getElementById("show-markers")
    .addEventListener("click", showMarkers);
  document
    .getElementById("hide-markers")
    .addEventListener("click", hideMarkers);
  // document
  //   .getElementById("delete-markers")
  //   .addEventListener("click", deleteMarkers);
  // document
  //   .getElementById("delete-latest-marker")
  //   .addEventListener("click", deleteLatestMarker);
  document
    .getElementById("delete-latest-line")
    .addEventListener("click", deleteLatestLine);
  // Adds a marker at the center of the map.
  const origin = new google.maps.Marker({
    position:loc,
    map,
    label:"A",
  });
}

//Draw line between markers
function drawLine(coordinates)
{
  if(line!=null)
  {
    line.setMap(null);
  }
  line=new google.maps.Polyline({
    path:coordinates,
    geodesic:true,
    strokeColor:"Blue",
    strokeOpacity:0.8,
  });
  line.setMap(map);
}

function deleteLatestLine()
{
  deleteLatestMarker();
  line.setMap(null);
  coordinates.pop();
  drawLine(coordinates);

}

// Adds a marker to the map and push to the array.
function addMarker(position) {
  const marker = new google.maps.Marker({
    position,
    map,
  });
  drawLine(coordinates);
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}

function deleteLatestMarker()
{
  hideMarkers();
  markers.pop();
  setMapOnAll(map);
}



window.initMap = initMap;