let map, infoWindow;

import { get, getDatabase, ref, update, child } from "firebase/database";
import { getAuth } from "firebase/auth"


const auth = getAuth();
const database = getDatabase();
const lobbyname = document.getElementById("lobbyname")
let circles = []




function initMap() {

    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: { lat: 30.541577473240668, lng: -89.84146672885014 },
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false,
        scaleControl: false,
        zoomControl: false,
        keyboardShortcuts: false,
        scrollwheel: true,
        navigationControl: false,
        draggable: true,
        disableDefaultUI: true,
        disableDoubleClickZoom: false,
        gestureHandling: "greedy"
    });

    function clearProxyAreas() {
        circles.forEach(x =>{
            x.setMap();
        })
    }
    


    function drawCircle(coords){
        const circ = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokOpacity: 0.7,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: coords,
            radius: 40 // radius of the vicinity of player
        })

        circles.push(circ);
    }

    infoWindow = new google.maps.InfoWindow();

    //Creates button to get location
    const locationBtn = document.createElement("button");

    //Text in the button
    locationBtn.textContent = "Get Current Location";
    //Class list for button
    locationBtn.classList.add("custom-map-control-button");
    //Where to place the button on the map
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationBtn);
    //if the button is clicked 




    /*
    Location is got
    Temp button for now
    */

    locationBtn.addEventListener("click", () => {

        clearProxyAreas();
        //HTML 5 Geolocation supported
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };


                    // get all the other players in the lobby and add them to map;



                    /*
                        Writes users location to rtdb whenever event happens
                    */
                    update(ref(database, lobbyname.value + "/users/" + auth.currentUser.uid), {
                        location: pos
                    })

                    get(child(ref(database), lobbyname.value + "/users/")).then((snap) => {
                        snap.forEach(x => {
                            //addMarker(x.val()["location"])
                            drawCircle(x.val()["location"])
                        })
                    })


                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {   // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

window.initMap = initMap;