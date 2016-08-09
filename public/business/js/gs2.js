function initgMap() {
    map = new google.maps.Map(document.getElementById('asmapcon'), {
        center: { lat: 38.905477, lng: -77.0492077 },
        zoom: 13
    });
    var input = /** @type {!HTMLInputElement} */ (
        document.getElementById('pac-input'));

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var options = { types: ['(regions)'] };

    var autocomplete = new google.maps.places.Autocomplete(input);
    // autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();


    autocomplete.addListener('place_changed', function() {
        infowindow.close();
       
        autocomplete.bindTo('bounds', map);

        var place = autocomplete.getPlace();

        pushPlace(place);

    });


}


var pushPlace = function(place) {



    if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
    }
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
     marker.setVisible(false);

    marker.setIcon( /** @type {google.maps.Icon} */ ({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));


    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
        address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
    }

    //{'name':'business','title':'Business Name'},
    //{'name':'address','title':'Address'},
    //{'name':'phone','title':'Phone Number'},

    //var infocon = get('asformcon');

    console.log(place);

    clearfields();

    get('adfbusiness').value = place.name;
    get('adfaddress').value = address;
    get('adfphone').value = place.formatted_phone_number;
    get('adfwebsite').value = place.website;

    if (place.opening_hours != null) {

        if (place.opening_hours.weekday_text) {

            get('daytextcon').props({ 'ohours': place.opening_hours }).pendray(place.opening_hours.weekday_text, function(weekday_text) {

                return el('p').inn( weekday_text );

            })

            //console.log( get('daytextcon')['ohours']+"  ohusr c")
        }

    } // open hrs !null

    //FETCH AND POST place_id;

    var gpid = place.place_id;
    console.log(place);
    //alert(JSON.stringify(place.geometry.location.lng()));

    get('adfplace_id').value = gpid;

    get('adfgeo').value = JSON.stringify({ "lat": place.geometry.location.lat(), "lng": place.geometry.location.lng() }); //JSON.stringify(place.geometry.location);

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);

}


var pushPlacebyId = function(place_id){
    // Create a map to show the results, and an info window to
    // pop up if the user clicks on the place marker.

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    placeDetailsByPlaceId(service, map, infowindow, place_id);

}

function placeDetailsByPlaceId(service, map, infowindow, place_id) {



    // Create and send the request to obtain details for a specific place,
    // using its Place ID.
    var request = {
        placeId: place_id
    };

    service.getDetails(request, function(place, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // If the request succeeds, draw the place location on the map
            // as a marker, and register an event to handle a click on the marker.
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            /*google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
              infowindow.open(map, this);
            });*/

            pushPlace(place);

            map.panTo(place.geometry.location);
        }
    });
}

// Run the initialize function when the window has finished loading.
//google.maps.event.addDomListener(window, 'load', initialize);
