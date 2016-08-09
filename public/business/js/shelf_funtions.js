count =0;
function sendf(){

var urlstring = "http://business.greenease.co/editfarm"+"/"+JSON.stringify( newfs[count]) ;

grabstuff(urlstring,function(stuff){

console.log( JSON.stringify(stuff) );

});

count++;

if(count<newfs.length){
setTimeout(function(){

sendf();


},100);
}else{


alert("done")

}

}//send f

function beep(){


var urlstring = "http://business.greenease.co/getone";

request(urlstring, function(error, response, body) {
var hood = JSON.parse(response.body);

var word = hood.name+" "+hood.state;
console.log("  word   ::  "+word);


var geo = bi.geo;
var blat = geo.latitude;
var blng = geo.longitude;

var url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+blat+","+blng+"&radius=500&keyword="+word+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";

request(url2, function(error, response, body) {
 
console.log(   body  );
  
var results = JSON.parse(body).results;

if(results){

if(results[0]){

var gplace = results[0];
console.log("s g name"+gplace.name );

var gson = {};


var ohours = null;

if( gplace["opening_hours"] ){


var op = gplace["opening_hours"];

ohours = op;




} // opening hours

/*
if( gplace["formatted_address"] ) gson["formatted_address"] = gplace["formatted_address"];
if( gplace["geometry"]  ) gson["geometry"]  = gplace["geometry"] ;
if( gplace["name"]  ) gson["name"]  = gplace["name"] ;
if( gplace["place_id"]  ) gson["place_id"]  = gplace["place_id"] ;
if( gplace["types"] ) gson["types"] = gplace["types"];

*/



var stripe = encodeURIComponent( JSON.stringify( ohours ) );
console.log("stripe"+stripe );

var url3 = "http://business.greenease.co/setone/"+stripe;
console.log(url3 );
request( url3 , function(error, response3, body3) {
 
console.log(   body3  );
  


console.log("beep"+count);
  setTimeout(function(){


if(on)beep();
count++;

  },1500);


 // console.log(body);
});// last bi  req



}//results[0]



}//results



});// google request


  
 // console.log(body);
});// first bi req



}// beep


function beep2(){


var urlstring = "http://business.greenease.co/getone";

request(urlstring, function(error, response, body) {
var hood = JSON.parse(response.body);

var word = hood.name+" "+hood.state;
console.log("  word   ::  "+word);
var url2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+word+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";

request(url2, function(error, response, body) {
 
console.log(   body  );
  
var results = JSON.parse(body).results;

if(results){

if(results[0]){

var gplace = results[0];
console.log("s g name"+gplace.name );

var gson = {};


if( gplace["formatted_address"] ) gson["formatted_address"] = gplace["formatted_address"];
if( gplace["geometry"]  ) gson["geometry"]  = gplace["geometry"] ;
if( gplace["name"]  ) gson["name"]  = gplace["name"] ;
if( gplace["place_id"]  ) gson["place_id"]  = gplace["place_id"] ;
if( gplace["types"] ) gson["types"] = gplace["types"];



hood.gob = gson;
hood.city = hood.state;

var stripe = encodeURIComponent( JSON.stringify(hood));
console.log("stripe"+stripe );


var url3 = "http://business.greenease.co/setone/"+stripe;
console.log(url3 );
request( url3 , function(error, response3, body3) {
 
console.log(   body3  );
  


console.log("beep"+count);
  setTimeout(function(){


if(on)beep();
count++;

  },1500);


 // console.log(body);
});



}//results[0]



}



});// google request


  
 // console.log(body);
});



}



function getinfofromgoogle(){


var bi = sithere[count];

var name = bi.business;

var ad = bi.adderess;

var word = ( name +" "+ ad ).replace('undefined','');


if(bi.adderess==null  || ad == "undefined" )ad = "";
var sq = get('sq');

var tb0 = el('table').prop('border','2');
//sq.pend(tb0);

tb0.pend( 

	el('tr').pend( 
	
	el('td').inn( name )
	
	)

	).pend( 

el('tr').pend( 
	
	el('td').inn( ad  )
	
	)  

);

var urlstring = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+word+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";

var request = {'query': word };
var service = new google.maps.places.PlacesService(map);
service.textSearch(request, function(stuff){

var bi = sithere[count];

var name = bi.business;

var ad = bi.address;
console.log(ad);
var word = (name+" "+ad).replace('undefined','');

var sq = get('sq');

var tb0 = el('table').prop('border','2');
sq.pend( tb0 );

tb0.pend( 

	el('tr').pend( 
	
	el('td').inn( name )
	
	).pend( 
	
	el('td').inn( ad+"h" )
	
	)  

);


if(stuff){

var res = stuff;//.results;

var l = res.length;
if(l<2){

//var tb = el('table');

for (var i = 0; i < res; i++) {
	
var bi = res[i];

var ad2 =bi.formatted_address;
var geo =bi.geometry;
var placeid =  bi.place_id; 

var tr1 =  el('tr').pend( 
	el('td').inn(ad2)
	
	).pend( 
	el('td').inn(placeid)
	);

tb0.pend(tr1);

};


}else{


for (var i = 0; i < 2; i++) {
	
var bi = res[i];

var ad2 =bi.formatted_address;
var geo =bi.geometry;
var placeid =  bi.place_id; 

var tr1 =  el('tr').pend( 
	el('td').inn(ad2)
	
	).pend( 
	el('td').inn(placeid)
	);

tb0.pend(tr1);

};



}// lchck




}// if there is somthing there


console.log("what "+count+"  "+sithere.length);
if( count < sithere.length ){
	setTimeout(function(){

count=count+1;
console.log("this is count af "+count);

getinfofromgoogle();


},300);


}else{


console.log("done");


}

});

/*
grabstuff(urlstring,function(stuff){

console.log(JSON.stringify(stuff));

if(stuff.results){

var res = stuff.results;

var l = results.length;
if(l<2){

//var tb = el('table');

for (var i = 0; i < res; i++) {
	
var bi = res[i];

var ad2 =bi.formatted_address;
var geo =bi.geometry;
var placeid =  bi.place_id; 

var tr1 =  el('tr').pend( 
	el('td').inn(ad2)
	
	).pend( 
	el('td').inn(placeid)
	);

tb0.pend(tr1);

};


}// lchck





}// if there is somthing there

});
*/



if(bi.adderess==null  || bi.adderess.length==0 ){

misses.push( [ bi , "no adderess" ] );

//console.log("miss"+JSON.stringify(  bi.name+"    ::   "+bi._id ) );

}




}//


function typeck(){

var urlstring = "http://business.greenease.co/exam";

request(urlstring, function(error, response, body) {
 
//console.log(   body  );
  var b = JSON.parse(body);
console.log('_______--------------------__________ ');

console.log('name:  '+b.name+"   "+b.state);
console.log('  typck '+b.typeck );
console.log('  gob name :: '+b.gob.name );
console.log('  gob add :  '+b.gob.formatted_address );
console.log('_______--------------------__________ ');

setTimeout(function(){

typeck();



},100);


 // console.log(body);
});



}



function beep5(){


var urlstring = "http://business.greenease.co/getone";

request(urlstring, function(error, response, body) {
var bi = JSON.parse(response.body);

var word = bi.business;
console.log("  word   ::  "+word);

var geo = bi.geo;
var blat = geo.latitude;
var blng = geo.longitude;

var url2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?location="+blat+","+blng+"&radius=500&query="+encodeURIComponent(word)+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";

request(url2, function(error, response, body) {
 
console.log(   body  );
  
var results = JSON.parse(body).results;

if(results){

if(results[0]){

var gplace = results[0];

bi.place_id = gplace["place_id"]; 


url5 = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+gplace["place_id"]+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";


request( url5 , function(error, response3, body5) {

console.log(   body5  );
  
var results2 = JSON.parse(body5).result;

if(results2){

gplace2 = results2;

console.log("s g name"+gplace2.name );

var gson = {};

var ohours = null;

if( gplace2["opening_hours"] ){


var op = gplace2["opening_hours"];

ohours = op;


console.log( "lll"+  op.weekday_text.length  );


} // opening hours

/*
if( gplace["formatted_address"] ) gson["formatted_address"] = gplace["formatted_address"];
if( gplace["geometry"]  ) gson["geometry"]  = gplace["geometry"] ;
if( gplace["name"]  ) gson["name"]  = gplace["name"] ;
if( gplace["place_id"]  ) gson["place_id"]  = gplace["place_id"] ;
if( gplace["types"] ) gson["types"] = gplace["types"];

*/

bi.ohours = ohours

var stripe = encodeURIComponent( JSON.stringify( bi ) );
console.log("stripe"+stripe );

var url3 = "http://business.greenease.co/setone/"+stripe;
console.log(url3 );
request( url3 , function(error, response3, body3) {
 
console.log( "b3"+  body3  );
  
  setTimeout(function(){


beep();


  },1500);


 // console.log(body);
});// last bi  req



 }//mid reesults



});//mid req


}//results[0]



}//results



});// google request


  
 // console.log(body);
});// first bi req



}// beep






/******************************GOOD BLOCK *********************/
var sethoursobject = function(){

pluckbizend( function( fndbiz ){

var bi = JSON.parse( fndbiz );
//console.log("bi"+bi);

//console.log(" place_id   ::  "+bi['place_id'] );

getplacebyid(bi.place_id , function( glplace ){

//var glp = JSON.parse(glplace);



var gohours = glplace["opening_hours"];

//console.log('otime:'+glp.name);

bi.ohours = gohours;

if(gohours==null) bi.ohours = {};

setbizend( bi , function( body ){

console.log( body );

setTimeout( function( ){

sethoursobject();

} , 1500 );


} );//setbizend


});//Housr

});// pluck

}//sethoursobject


var getplacebyid = function( gplaceid , calli ){

 var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+gplaceid+"&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo";
console.log('url at get place id '+url);

request( url , function(error, response, body) {
 
console.log( "gbod"+  body  );
  
calli( JSON.parse(body).result );

 // console.log(body);
});

}// Hourdataforplaceid



var pluckbizend = function(  calli ){

 var url = "http://business.greenease.co/getone";

request( url , function(error, response, body) {
 
console.log(   body  );
  
calli( body );
 
});

}// Hourdataforplaceid


var setbizend = function( bi , calli ){


console.log('biz at save '+JSON.stringify( bi ) );

 var url = "http://business.greenease.co/setone/"+encodeURIComponent( JSON.stringify( bi ) );

request( url , function(error, response, body) {
 
console.log(   body  );
  
calli( body );
 
});

}// Hourdataforplaceid
/******************************GOOD BLOCK *********************/

var bizsitemigetone = function(  ){

 var url = "http://business.greenease.co/bizsitemigetone";

console.log('url at get place id '+url);

request( url , function(error, response, body) {
 
console.log( "gbod"+  body  );
  

setTimeout(function(){


getplacebyid();

}, 700)

 // console.log(body);
});


}// Hourdataforplaceid

