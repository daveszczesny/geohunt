
let map, infoWindow, popup, Popup;

import { get, getDatabase, ref, update, child, remove } from "firebase/database";
import { getAuth } from "firebase/auth"

const rtdb = require("./rtdb_functions")


const auth = getAuth();
const database = getDatabase();
var lobbyname = document.getElementById("lobbyname")
let circles = []
let popups = []

let in_game_names_setting = false;
let checks_settings = false;

lobbyname.addEventListener('change', () => {
    lobbyname = document.getElementById('lobbyname')
})


function initMap() {
    definePopupClass();
    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: { lat: 53.2366571, lng: -8.8162412 },
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

    // run everytime we zoom in and out
    google.maps.event.addListener(map, 'zoom_changed', () => {
        var zoom = map.getZoom();

        // dont draw labels if we are far out from the map
        if (zoom >= 13) {
            drawNameLabels(map);
        } else {
            drawNameLabels(null)
        }
    })

    // these are the red circles
    function clearProxyAreas() {
        circles.forEach(x => {
            x.setMap();
        })
    }

    function removeLabel() {
        popups.forEach(x => {
            x.setMap();
        })

        popups = [];
    }

    // these are the display name labels
    function drawNameLabels(foo) {
        popups.forEach(x => {
            x.setMap(foo);
        })
    }


    function drawCircle(coords) {
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

    //https://cdn-icons-png.flaticon.com/512/843/843324.png


    locationBtn.addEventListener("click", async () => {


        if (!checks_settings) {
            in_game_names_setting = await rtdb.getSettingValue('in_game_names', lobbyname);
            checks_settings = true
        }


        clearProxyAreas();
        removeLabel();
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

                    /*
                        We only want to draw the circles of every player, bar the hunter onto the hunter's screen.
                    */

                    // checks if the user is a hunter

                    get(child(ref(database), lobbyname.value + "/users/" + auth.currentUser.uid + "/")).then(snapshot => {
                        if (snapshot.val()["team"] == "hunter") {
                            get(child(ref(database), lobbyname.value + "/users/")).then((snap) => {
                                snap.forEach(x => {
                                    if (x.val()["team"] == "hunter") {
                                        
                                        const hunterMarker = new google.maps.
                                        
                                        return;
                                    } // prevents hunters from being displayed at all
                                    drawCircle(x.val()["location"])
                                    // labels require a div to be drawn onto, here we create a temp div for that
                                    let temp = document.createElement('div');
                                    temp.innerHTML = x.val()["display_name"]
                                    document.getElementById('googleMap').appendChild(temp);
                                    // reads if we have in game names allowed
                                    if (in_game_names_setting) {
                                        popup = new Popup(
                                            new google.maps.LatLng(x.val()["location"].lat, x.val()["location"].lng),
                                            temp);

                                        popups.push(popup);
                                    }

                                })
                            })
                        }
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

/*
    Label popup function
*/

function definePopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    Popup = function (position, content) {
        this.position = position;

        content.classList.add('popup-bubble-content');

        var pixelOffset = document.createElement('div');
        pixelOffset.classList.add('popup-bubble-anchor');
        pixelOffset.appendChild(content);

        this.anchor = document.createElement('div');
        this.anchor.classList.add('popup-tip-anchor');
        this.anchor.appendChild(pixelOffset);

        // Optionally stop clicks, etc., from bubbling up to the map.
        this.stopEventPropagation();
    };
    // NOTE: google.maps.OverlayView is only defined once the Maps API has
    // loaded. That is why Popup is defined inside initMap().
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);

    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function () {
        this.getPanes().floatPane.appendChild(this.anchor);
    };

    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function () {
        if (this.anchor.parentElement) {
            this.anchor.parentElement.removeChild(this.anchor);
        }
    };

    /** Called when the popup needs to draw itself. */
    Popup.prototype.draw = function () {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
        // Hide the popup when it is far out of view.
        var display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
                'block' :
                'none';

        if (display === 'block') {
            this.anchor.style.left = divPosition.x + 'px';
            this.anchor.style.top = divPosition.y + 'px';
        }
        if (this.anchor.style.display !== display) {
            this.anchor.style.display = display;
        }
    };

    /** Stops clicks/drags from bubbling up to the map. */
    Popup.prototype.stopEventPropagation = function () {
        var anchor = this.anchor;
        anchor.style.cursor = 'auto';

        ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
            'pointerdown']
            .forEach(function (event) {
                anchor.addEventListener(event, function (e) {
                    e.stopPropagation();
                });
            });
    };
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