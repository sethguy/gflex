var usercrmfields =[

{'name':'business','title':'Business Name'},
{'name':'address','title':'Address'},
{'name':'phone','title':'Phone Number'},
{'name':'owner_email','title':'Contact Email'},

{'name':'hours','title':'Hours','view':'hours'},
{'name':'cats','title':'Categories','view':'cats'},
{'name':'place_id','title':'Place Id','rule':'hidden'},
{'name':'geo','title':'Geo Location','rule':'hidden'},
]


var bistats = [

{'name':'decal ','title':'decal','view':'statlet'},
	
	{'name':'sent','title':'sent','view':'statlet'},  

		{'name':'adnt','title':'sent','view':'addnote'},  
];


var bizmod0 = new bizmod();

function usearchbyemail(ele){

var word = ele.value;
var rcon = get('uzultscon').stprop('display','block').inn("");

if(word.length>0){

var urlstring = crmsearchurl+"/"+word;

grabstuff(urlstring,function(stuff){

console.log(word+"  word n term   "+ele.value);

if(word!==ele.value){


console.log('caugth');

}

if(word===ele.value){
console.log('all clear');

get('uzultscon').inn("");

for (var i = 0; i < stuff.length; i++) {
	var user = stuff[i];

if( user.email.toLowerCase().indexOf(ele.value.toLowerCase() )>-1  &&  ele.value.length>0 ){

	rcon.pend(

		uzult(user)

		);

}// q ck

};

}//lack


})//request

}else{

get('uzultscon').stprop('display','none').inn("");

}//length ck

}//usearchbyemail


function showusertomanage(user){

getlinkedbusiness(user,showlinkedforcrm);

console.log(JSON.stringify(user));

}// showuserto manage

function userviewmods(){



}



function bizmod(){

this.d= function(brl){

var supbm = touchtab2([ 

	{'view':'bitouchintro','bi':brl.bi} , 
	
	{'view':'bitouchstatus','bi':brl.bi},  

	] , 0,1, bizmod0 ).cl("rowtouch flextab");

return supbm;
}//default

this.bitouchintro = function(ob){
console.log("bitouch ob"+JSON.stringify(ob));

var bti = div().cl(" crmbistack  bitouchintro");

bti.pend(
	
	el('p').inn(ob.bi.business)

	).pend(
			
			el('p').inn(ob.bi.address)

).prop('onmousedown',function(){

pressideop({'name':'ebu','title':'Edit Business/User'});


get('adBisSuggestBox').value=ob.bi.business;
showbiztoedit(ob.bi);

});// bitouchintro mousedown


return bti;
}  // bitouchintro(bi)  

this.addnote = function(ob){

var anb = div().cl("anb").prop('onmousedown',function(){


alert("add")


}).inn("Add/View notes");

return anb;
}//addnote

this.bitouchstatus = function(ob){
var bts = div().cl(" crmbistack  bitouchstatus");

var stat = touchtab2(bistats,0,1,bizmod0,ob.bi);

bts.pend(stat);

return bts;
}// bitouchstatus(bi) 


this.statlet = function(stat,refob){
var stl = div().cl("statlet");

stl.pend(el('p').inn( stat.name ) ).pend(el('p').inn( refob.business ) );

return stl;
}// statlet


}//bizmod




function usbizsearch(ele){

var word = ele.value;
var rcon = get('crmdiv').stprop('display','block').inn("");
var scrollv = div().cl('usscroll');

if(word.length>0){

var urlstring = GetBizByNameUrl+"/"+word;

grabstuff(urlstring,function(stuff){

console.log(word+"  word n term   "+ele.value);

if(word!==ele.value){


console.log('caugth');

}

if(word===ele.value){
console.log('all clear');

get('crmdiv').inn("");

for (var i = 0; i < stuff.length; i++) {
	var bi = stuff[i];

if( ele.value.length>0 ){

	scrollv.pend(

		bizmod0['d']({'uid':'0','bi':bi})

		);

}// q ck

};

rcon.pend(scrollv);


}// lack
})//request

}else{

get('crmdiv').inn("");

}//length ck


}

function showlinkedforcrm(bis){

var pb = get("crmdiv");

pb.inn("");

pb.pend( div().cl('usscroll').pend( touchtab2( bis , 1 , 0 , bizmod0 ).cl("flextab bigtouch") )  );

}//showlinkedforcrm


function uzult(user){

var bz = div().cl('uzult').pend(

			el('p').inn(user.email)

			).prop('onmousedown',function(){

showusertomanage(user);

get('usSuggestBox').value = user.email;

get('uzultscon').stprop('display','none').inn("");

			});

	return bz;
}//bizult




