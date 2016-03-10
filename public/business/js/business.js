function business(bi){


}//business



function searchbibyname(ev,ele){
console.log("key code :"+ev.keyCode);
var kc = ev.keyCode;
/*
if( kc===38 || kc ===40 ){


return;
}
*/
var word = ele.value;
var rcon = get('bizultscon').stprop('display','block');//.inn("");

if(word.length>0){
var lowterm = ele.value.toLowerCase();
if(!get('adiv').bizlist){

var urlstring = GetBizByNameUrl+"/"+word;

grabstuff(urlstring,function(stuff){

//console.log(JSON.stringify(stuff));

//var matches = stuff.matches;
//var term = 

console.log(word+"  word n term   "+ele.value);

if(word!==ele.value){


console.log('caugth');

}

if(word===ele.value){
console.log('all clear');
get('bizultscon').inn("");

for (var i = 0; i < stuff.length; i++) {
	var bi = stuff[i];


if( ele.value.length>0 ){

	rcon.pend(

		bizult(bi).prop("id",'bzult'+i)

		);

}// q ck



};


}//if word ===term


})//request

}else{

var list = get('adiv').bizlist;

get('bizultscon').inn("");
for (var i = 0; i < list.length; i++) {
	var bi = list[i].bi;

if(  bi.loname.indexOf( lowterm ) > -1 && ele.value.length > 0 ){

	rcon.pend(

		bizult(bi)

		);

}// q ck

};



}// check for a bizlist to pull from

}else{

get('bizultscon').stprop('display','none').inn("");

}//length ck


}//searchbibyname


function bizult(bi){

var bz = div().cl('bizult').pend(

			el('p').inn(bi.business)

			).prop('onmousedown',function(){

firebizselection(bi);

get('BisSuggestBox').value = bi.business;

get('bizultscon').stprop('display','none').inn("");

			});

	return bz;
}//bizult


function newbiz(bi){

grabstuff("http://business.greenease.co/newbiz/"+JSON.stringify(bi),function(stuff){

console.log(stuff);

});

}//newbiz

function getfarms(bi,calli){

var urlstring = getbizfarmsurl+"?bid="+bi.objectId;

grabstuff(urlstring,function(stuff){

displaywidgpreview(stuff);

if(calli)calli(stuff);

});//request


}// getfarms


function refeshbusiness(bi,fa){

writefarmtable(bi);

fillfarminfo(fa);

getfarms(bi,function(stuff){

setbuysfrom(fa);

});

console.log("refeshbusiness");
}//refresh

function getwidglink(){
	var biz = get('linkbox').biz;
var user = get('linkbox').user;
var pic = get('linkbox').pic;
//alert(JSON.stringify(user))

if(!pic)pic ='cafe';

var urlstring =  widgtextUrl+"/"+user.email+"/"+biz.objectId+"/"+pic;

grabtext(urlstring,function(stuff){
//alert(stuff)
var lt = get('linktext').value = stuff;

});


}//getwidglink

function firebizselection(bi){

console.log(JSON.stringify(bi)+"  fire biz");

var lb = get('linkbox').prop('biz' , bi );
getwidglink();

buysfromlist=null;
  
get('farmtablediv').stprop('display','none');

get("FarmInfodiv").biz = null;

get("FarmInfodiv").stprop('display','none');

get("topcut").stprop('position','relative').stprop('height','10%');

get('navhead').stprop('display','block');

get("widgetpreview").stprop('display','block');

get("wpcontainer").stprop('display','block').prop('biz',bi);

getfarms(bi);

get("FarmInfodiv").biz = bi;

writefarmtable(bi);

setpreback( {'name':'cf','title':'Cafe','img':'business/images/cafe.png','short':'cafe'} );

}//firebizselection


