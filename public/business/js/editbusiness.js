
var ebtabmod = new ebfieldvmod();
function ebfieldvmod(){


this.linkedusers = function( bi){

var scrollcon = div().cl('linksrlcon').prop('id','ebfscroll');

var lu = div().cl("eblinkurcon").pend(

div().cl('linkconhead').pend(

	div().cl('linkedinfo').pend(

el('input').cl('linkput').prop('id','ebfemailtoadd').prop('placeholder','Type in email to link user')
		
		)

	).pend(
	
	div().cl('linkbt').pend(

		el('p').inn("+")

		).prop('onmousedown',function(){

var emailval  = get('ebfemailtoadd').value;


trytolink( { 'email' : emailval,'bi':bi } );
				
		})//add link on mouse down

	)

).pend(

scrollcon

);

return lu;
}



this.owner_email = function(bi){

var linkstring = "Link User";
if(bi.islinked) linkstring = 'Unlink User';

var put = el('input').cl('afput').prop('value' , bi.owner_email ).prop('placeholder','Contact Email').prop('id','ebfowner_email');

//var hilput = el('input').cl('afput').prop('value' , bi.owner_email ).prop('id','ebfislinked');

var ul = div().cl("ulinkbox").prop('align','center');

var ulb = div().prop('id','ebflinkbt').cl("ulbt").inn(linkstring).prop('onmousedown',function(){

//linkbusinessurl+"/"+bi['objectId']+"/"+get('ebfowner_email').value

 var urlstring = linkbusinessurl+"/"+bi['objectId']+"/"+get('ebfowner_email').value;
/*
if(bi.islinked){

urlstring = unlinkbusinessurl+"/"+bi['objectId']+"/"+get('ebfowner_email').value;
}
*/
newuserbiz( urlstring ,function(stuff){
if(stuff.msg){

	alert(stuff.msg)
	
	}else{

	alert("!!User Not Linked!!");

	}

});



});

var t = touchtab( [ put , ulb ] );


ul.pend(t);

return ul;
}//place_id

this.place_id = function(){


}//place_id

this.hours = function(bi){


var htry = bi.hours_json;

var per = {
"Sun":{"op":"","cl":""},

"Mon":{"op":"","cl":""},

"Tue":{"op":"","cl":""},

"Wed":{"op":"","cl":""},

"Thu":{"op":"","cl":""},

"Fri":{"op":"","cl":""},

"Sat":{"op":"","cl":""}

};

 if( bi.hours_json  &&  bi.hours_json.length>0){
 

 	per = JSON.parse(bi.hours_json);
}


console.log(bi.hours_json+"hours");

var ht = el('table').cl('abhourstab');

var tr = el('tr');

for (var i = 0; i < dayray.length; i++) {
	var day = dayray[i];

console.log(per[day.short].op +"  ++ "+per[day.short].cl )

tr.pend( 

	el('td').pend(

div().cl('abhrsdiv').pend(

		el('p').inn(day.short).stprop('text-decoration','underline')

		).pend(el('p').inn('open:')).pend(

el('input').prop('id',"eb"+day.short+'_o').prop('value',per[day.short].op)

		).pend(el('p').inn('close:')).pend(

el('input').prop('id',"eb"+day.short+'_c').prop('value',per[day.short].cl)
		
		)  
)

	)

}//day loop

ht.pend(tr);

return ht;
};//hous




this.cats = function(bi){

console.log(JSON.stringify(bi));

var cv = div().cl('adcatview');

var ct = el('table').cl('adcattab');

var tr = el('tr');
for (var i = 0; i < gcats.length; i++) {

var  cat = gcats[i];

console.log( cat.qstring.name+"   "+bi[cat.qstring.name]+" cat name");

var bival = bi[cat.qstring.name];
var imgpk = 'imgoff';

if(bival)imgpk = 'imgon';


var td = el('td');

td.pend(

catpart(cat,imgpk,bival)


	);
	tr.pend(td);

if(i%3==2){

ct.pend(tr);

tr = el('tr');
}

};//rayloop

cv.pend(ct);
return cv;
};//category view



}//ebfieldmod

function catpart(cat,imgpk,bival){

var cp = div().cl('adcattdiv').pend(

el('p').inn(cat.name)

		).pend(

el('img').prop(
	'src','business/images/'+cat[imgpk]).cl('adcatimg').prop(
	"id","ebcat"+cat.name).prop(
	'value',bival)

		).prop('onmousedown',function(){

	var part = get("ebcat"+cat.name)

	var v = part.value

if(v){

part.src = 'business/images/'+cat.imgoff;
part.value = false;

}else{

part.src = 'business/images/'+cat.imgon;
part.value = true;

}

		});

return cp;
}//catpart

function adsbibyname(ele){

var word = ele.value;
var rcon = get('adbizultscon').stprop('display','block').inn("");

if(word.length>0){

var urlstring = GetBizByNameUrl+"/"+word;

grabstuff(urlstring,function(stuff){
	
console.log(word+"  word n term   "+ele.value);

if(word!==ele.value){

console.log('caugth');

}


if(word===ele.value){

console.log('all clear');

get('adbizultscon').inn("");

for (var i = 0; i < stuff.length; i++) {
	var bi = stuff[i];

if(   ele.value.length>0 ){

	rcon.pend(

		adbizult(bi)

		);

}// q ck

};


}// latency ck 



})//request

}else{

get('adbizultscon').stprop('display','none').inn("");

}//length ck

}//adbiz term  search



function adbizult(bi){

var bz = div().cl('bizult').pend(

			el('p').inn(bi.business)

			).prop('onmousedown',function(){

showbiztoedit(bi);

//firebizselection(bi);

get('adbizultscon').stprop('display','none').inn("");

			});

	return bz;
}//bizult

function showbiztoedit(bi){

console.log(JSON.stringify(bi)+"biztoedit");

get('adBisSuggestBox').value = bi.business;

var sendid = bi.objectId;

console.log(bi.geo+"thi is geo");

if(!bi.geo ){

bi.geo = {"__type":"GeoPoint","latitude":38.9061564,"longitude":-77.04190679999999};
console.log("hit");

}


var bec = get('bedicon').inn("");

for (i = 0; i < abfields.length; i++) {
				
	var af = abfields[i];

if(af.view==null){

if(af.name!=="geo"){
var aftd = ebfield( af,bi[af.name] );

//bec[af.name]=aftd;

bec.pend( aftd );

}else{

var aftd = ebfield( af , "{\"lat\":"+bi.geo.latitude+",\"lng\":"+bi.geo.longitude+"}" );

//bec[af.name]=aftd;

bec.pend( aftd );

}//not geo

}else{

var aftd = ebtabmod[af.view]( bi );

//bec[af.name]=aftd;

bec.pend( el('p').inn( af.title ) );

bec.pend( aftd );


}// feild placement


}// adfield loop


getlinkedusers( bi , filllinkedtab );


bec.pend(

div().cl('bsavebt').prop('id','editbsave').prop('onmousedown',function(){

//var bi =  {"business":"Nando's Peri-Peri","address":"1210 18th St NW Washington","phone":"(202) 621-8603","owner_email":"","hours":{"Sun":{"op":"1100","cl":"2200"},"Mon":{"op":"1100","cl":"2200"},"Tue":{"op":"1100","cl":"2200"},"Wed":{"op":"1100","cl":"2200"},"Thu":{"op":"1100","cl":"2200"},"Fri":{"op":"1100","cl":"2300"},"Sat":{"op":"1100","cl":"2300"}}};

var bi = getbifromeditfields(sendid);

bi.loname = bi.business.toLowerCase();

console.log('bi is :  '+JSON.stringify(bi) );

var urlstring = savebusinessurl+"/"+encodeURIComponent(JSON.stringify( bi ));

grabstuff(urlstring , function( stuff ){

console.log( stuff );

alert("Business Edited !")

//cleareditfields();

});//save request


}).inn("Save Business")

	);

bec.pend(

div().cl('bsavebt').prop('id','editbremv').prop('onmousedown',function(){

//var bi =  {"business":"Nando's Peri-Peri","address":"1210 18th St NW Washington","phone":"(202) 621-8603","owner_email":"","hours":{"Sun":{"op":"1100","cl":"2200"},"Mon":{"op":"1100","cl":"2200"},"Tue":{"op":"1100","cl":"2200"},"Wed":{"op":"1100","cl":"2200"},"Thu":{"op":"1100","cl":"2200"},"Fri":{"op":"1100","cl":"2300"},"Sat":{"op":"1100","cl":"2300"}}};


var bi = getbifromeditfields(sendid);

console.log('bi is :  '+JSON.stringify(bi) );
bi.removed = true;

var urlstring = savebusinessurl+"/"+JSON.stringify( bi );

grabstuff( urlstring , function( stuff ){

console.log( stuff );
get('adBisSuggestBox').value = "";
get('bedicon').inn("");
alert("Business Removed !")

//cleareditfields();

});//save request


}).inn("Remove Business")

	);

}//showbiztoedit

function getbifromeditfields(id){

var bi={};
bi.objectId=id;
for (var i = 0; i < abfields.length; i++) {

	var af = abfields[i];

if(af.view==null){

var put = get('ebf'+af.name);

 bi[af.name]=put.value;

}// special file ck

};// f loops

var newbhours = {};

for (var i = 0; i < dayray.length; i++) {
	var day = dayray[i];

var odput = get("eb"+day.short+'_o');
var cdput = get("eb"+day.short+'_c');

newbhours[day.short] = { 'op':odput.value,'cl':cdput.value };

};// day loop



bi.hours_json = newbhours ;


bi.geo = JSON.parse( get('ebfgeo').value);


for (var i = 0; i < gcats.length; i++) {
	var cat = gcats[i];

var part = get("ebcat"+cat.name);

var v = part.value;
bi[cat.qstring.name] = v;

};//gcatloop


console.log( JSON.stringify(bi) );

return bi;
}//getbifromfields

/*

function to12hourstring(ta){
var str;
var milnum = parseInt(ta);
if(milnum===0)str = 12:00+"AM";
else{


}

return str;
}

*/

function ebfield(af,value){

if(af.rule==null){

var abf = div().cl('abfield');

var put = el('input').cl('afput').prop('placeholder',af.title).prop('id','ebf'+af.name);

abf.put = put;

abf.pend(

	el('p').inn(af.title)

	).pend(

	put.prop('value', value)

	);

}else{

var abf = div().stprop('display','none');

var put = el('input').cl('afput').prop('type','hidden').prop('id','ebf'+af.name);

abf.put = put.prop('value', value);

abf.pend( put );


}// rule ck

return abf;
}//abfield


function linkedrow(urel,bi){

var lr = div().cl('linkedrow').pend(

		div().cl('linkedinfo').pend( 

		 el('p').inn( urel['rel'].email ) 

		  )

).pend(

		div().cl('linkbt').pend(
		el('p').inn("-")
		).prop('onmousedown',function(){

unlink( bi , urel['rel'].email );


		})// remove link bt onmouseodnw

);

return lr;
}//linked row dom element function

function getlinkedusers( bi , calli ){



var urlstring = getlinkedbybid+"/"+bi.objectId;

grabstuff(urlstring,calli);


}//getlinkeduser

function filllinkedtab(urels){

for (var i = 0; i < urels.length; i++) {
	var rel = urels[i];

var lr = linkedrow( rel , rel.bi );

get('ebfscroll').pend( lr );

};//urels link



}//filllinkedtab


function unlink(bi,email){

urlstring = unlinkbusinessurl+"/"+bi['objectId']+"/"+email;

grabstuff( urlstring ,function(stuff){
if(stuff.msg){

	alert(stuff.msg)
	
	showbiztoedit(bi);

	
	}else{

	alert("!!User Not Linked!!");

	}

});// request

}//unlink

function trytolink(smrel){
var bi =smrel.bi;
console.log(JSON.stringify(smrel)+"  smrel ");

 var urlstring = linkbusinessurl+"/"+bi['objectId']+"/"+get('ebfemailtoadd').value;


newuserbiz( urlstring ,function(stuff){
if(stuff.msg){

	alert(stuff.msg)
	
var url2 = ckforuserurl+"/"+get('ebfemailtoadd').value;

grabstuff(url2 , function( stuff ){

console.log("ckfor user to send email on link "+ JSON.stringify(stuff) );

});

showbiztoedit(bi);

	}else{

	alert("!!User Not Linked!!");

	}

});

}// try to link function

function cleareditfields(){

get('ebfbusiness').value = "";
get('ebfaddress').value = "";
get('ebfphone').value = "";
get('ebfplace_id').value = "";
get('ebfemail').value = "";
get('ebfgeo').value = "";

for (var i = 0; i < 7; i++) {

get("eb"+dayray[i].short+'_o').value ="";

get("eb"+dayray[i].short+'_c').value = "";

};// day loop

}//clear fields