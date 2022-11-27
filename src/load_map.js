let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: { lat: 53.2718658, lng: -9.0821836 },
        zoom: 13,
    });

    //---------------------------//
    //  Get position for Marker  //
    //---------------------------//

    //These will need to be changed to get the user's location
    addMarker({ lat: 53.2743, lng: -9.0492 }),
    addMarker({ lat: 53.2881, lng: -9.0665 });
    addMarker({ lat: 53.2839798, lng: -9.0792594 });



    //Add Marker Function
    function addMarker(coords){
        var marker = new google.maps.Marker({
        position:coords,
        map:map,
        });
    }

    
    //---------------------------//
    //  Get User's Geolocation   //
    //---------------------------//

    // Can the Get Marker Method L9-L26 be used to simplify this??

    let infoWindow;
    infoWindow = new google.maps.InfoWindow();

    //When the page is Loaded
    window.addEventListener("load", (event) => {
        console.log('loaded');  //Check to see that it works
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
      
                infoWindow.setPosition(pos);
                infoWindow.setContent("Location");
                infoWindow.open(map);
                map.setCenter(pos);
              },
              () => {
                handleLocationError(true, infoWindow, map.getCenter());
              }
            );
          } else {
            // Browser doesn't support Geolocation
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