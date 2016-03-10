
function initgMap() {
 map = new google.maps.Map( document.getElementById('asmapcon'), {
    center: {lat: 38.905477, lng: -77.0492077},
    zoom: 13
  });
  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('pac-input'));

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

var options ={ types:['(regions)']};

  var autocomplete = new google.maps.places.Autocomplete(input);
 // autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
      autocomplete.bindTo('bounds', map);

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
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

if(place.opening_hours!=null){

var pers = place.opening_hours.periods;

if(pers!=null){

var gl = 7;

if( pers.length >7 ) gl =7;

for (var i = 0; i < gl; i++) {
  var per = pers[i];

console.log(per);

if(per){

var op = null;

if(per.open) op = per.open;


var cl = null;
 if(per.close) cl = per.close;

if(op!=null && cl!=null){

if(op.time!=null)get(dayray[i].short+'_o').value = to12hourstring( op.time );

if(cl.time!=null)get(dayray[i].short+'_c').value =to12hourstring( cl.time );

}//ck



}

/*
if(place.opening_hours.weekday_text){

if(place.opening_hours.weekday_text[i]){

//dayray[i].short+'_o').wdstring =  place.opening_hours.weekday_text[i];

}

}
*/


};// per loop ie google day array

}//per ck

}// ophrs !null

//FETCH AND POST place_id;

var gpid = place.place_id;
console.log(place);
//alert(JSON.stringify(place.geometry.location.lng()));

get('adfplace_id').value = gpid;

get('adfgeo').value = JSON.stringify( {"lat":place.geometry.location.lat(),"lng":place.geometry.location.lng()} ) ; //JSON.stringify(place.geometry.location);


    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });

}




