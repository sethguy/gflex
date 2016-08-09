var specialImgs = [

{'name':'glass'},
{'name':'straw'},
{'name':'knife'}

];


var showspecialmodal = function(){

get('specialModal').style.display = "block"

get('sp-image-select').inn('').pend( el('tr')
			
			.pendray( specialImgs ,

					function(spec){

						var imgsrc ='business/images/specials/'+spec.name+'Small'+'.png'

					     var speImglet = el('td').cl('sptd').pend(

					     	div().cl('speImglet').pend( el('img').cl('speImg').prop('src', imgsrc ) )
															
											)

						return speImglet  } ,
					
					'imgs')

);

}


var special = function(){







}


function spec_searchbibyname(ev,ele){
console.log("key code :"+ev.keyCode);
var kc = ev.keyCode;
/*
if( kc===38 || kc ===40 ){


return;
}
*/
var word = ele.value;
var rcon = get('spec_bizultscon').stprop('display','block');//.inn("");

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
get('spec_bizultscon').inn("");

for (var i = 0; i < stuff.length; i++) {
	var bi = stuff[i];


if( ele.value.length>0 ){

	rcon.pend(

		spec_bizult(bi).prop("id",'bzult'+i)

		);

}// q ck



};


}//if word ===term


})//request

}else{

var list = get('adiv').bizlist;

get('spec_bizultscon').inn("");
for (var i = 0; i < list.length; i++) {
	var bi = list[i].bi;

if(  bi.loname.indexOf( lowterm ) > -1 && ele.value.length > 0 ){

	rcon.pend(

		spec_bizult(bi)

		);

}// q ck

};



}// check for a bizlist to pull from

}else{

get('spec_bizultscon').stprop('display','none').inn("");

}//length ck


}//searchbibyname

var closeSpecialsModals = function(){

get('specialModal').style.display = "none"

}//closeSpecialsModals


var sendSpecial = function(){


var specialToSend

var url = sendSpecialUrl+'/'+encodeURIComponent( JSON.stringify( specialToSend ) );

grabstuff( url, function(res){




})// grabstuff


}//sendSpecial


function spec_bizult(bi){

var bz = div().cl('bizult').pend(

			el('p').inn(bi.business)

			).prop('onmousedown',function(){

spec_firebizselection(bi);

get('sp-bi-put').value = bi.business;

get('spec_bizultscon').stprop('display','none').inn("");

			});

	return bz;
}//bizult
function spec_firebizselection(bi){

console.log(JSON.stringify(bi)+"  fire biz spec");

get('specialModal').bi = bi;

get('sp-bi-name').inn(bi.business);
get('sp-bi-address').inn(bi.address);



}//firebizselection
