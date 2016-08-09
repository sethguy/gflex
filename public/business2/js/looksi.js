function golooksi(){

// get all the users
var urlstring = "http://business.greenease.co/getusers";

grabstuff(urlstring,function(stuff){

count = 0;
 users = stuff;


lookforbiz( users[ count ].email );






});


//use that array to find accociate business throuh owner email




}// go looksi




function drawusers(stuff){

var utab = el('table').prop("border","2");


for (var i = 0; i < stuff.length; i++) {
	var ur = stuff[i];

var tr = el('tr');

var td = el('td');

td.inn(ur.email);

tr.pend(td);
utab.pend(tr);

};



get('bscroll').pend(el('p').inn(stuff.length)).pend(utab).pend(el("br")).pend(el("br")).pend(el("br"));

}//drawusers


function lookforbiz(email){



var urlstring = "http://business.greenease.co/lookforbiz/"+email;

grabstuff(urlstring,function(stuff){

console.log( "   EMAIL "+  email );


get('bscroll').pend( el('p').inn(email+"    ::    "+count) ).pend( el('br') );



var utab = el('table').prop("border","2");


console.log( "   -------------------------------" );

var full = JSON.stringify( stuff );

console.log( stuff.length );
for (var i = 0; i < stuff.length; i++) {
	var bi = stuff[i];

console.log( ""+bi.business+"  ad ::  "+bi.address );


console.log( "   -------------------------------" );
var tr = el('tr');

var td = el('td');

td.inn(   bi.business    );

tr.pend(td);

var td = el('td');

td.inn(   bi.address    );

tr.pend(td);


utab.pend(tr);

};



get('bscroll').pend( utab ).pend(el('br'));

count++;


if(count<users.length){



setTimeout( function(){

lookforbiz( users[count].email );


}, 700);

}




});//grab






}//lookforbiz