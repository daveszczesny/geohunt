let map, infoWindow, popup, Popup;

import { get, getDatabase, ref, update, child } from "firebase/database";
import { getAuth } from "firebase/auth"



const auth = getAuth();
const database = getDatabase();
const lobbyname = document.getElementById("lobbyname")
let circles = []
let popups = []




function initMap() {
    definePopupClass();
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

    // run everytime we zoom in and out
    google.maps.event.addListener(map, 'zoom_changed', () => {
        var zoom = map.getZoom();

        if (zoom >= 13) {
            drawNameLabels(map);
        } else {
            drawNameLabels(null)
        }
    })

    function clearProxyAreas() {
        circles.forEach(x => {
            x.setMap();
        })
    }

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
                            let temp = document.createElement('div');
                            temp.innerHTML = x.val()["display_name"]
                            document.getElementById('googleMap').appendChild(temp);
                            popup = new Popup(
                                new google.maps.LatLng(x.val()["location"].lat, x.val()["location"].lng),
                                temp);

                            popups.push(popup);

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