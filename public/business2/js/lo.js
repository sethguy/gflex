function trytologin(){

var ueput = get('uemail');
var paput = get('upass');

var email = ueput.value;
var pass = paput.value;


if( email!=null && email.length>0  && pass!=null && pass.length>0  ){

var json = {username:email,password:pass};

var urlstring ="/getlogin/"+encodeURIComponent(  JSON.stringify( json )  );//username="+email+"&password="+pass;

getwithkeys(urlstring,function(stuff){

var user = stuff.user;

loginwithuser(user);

});


}//field ck


}//trylogin


function hidelodiv(){

get('lotab').stprop('display','none');

get('adiv').bizlist = null;

}//hidelodiv




function logout(){

get('adminbutton').prop('onmousedown',null);

var urlstring = PARSE_BASE_URL+"/"+logoutUrl;
get('adiv').bizlist = null;
console.log(urlstring);

setCookie('user',null,1);

postwithkeys( urlstring , function( stuff ){

alert(JSON.stringify(stuff))

//window.location.reload();

});

}//logout

function loginwithuser(user){
//starts the show

var unot = JSON.stringify(user);


console.log('at login with set coook ie'+ unot);
setCookie('user', unot ,1);

get('linkbox').user = user;

get('iname').value = "Greenease_Widget_"+user.objectId;

var lotab = get('lotab').stprop('display','none');

console.log(JSON.stringify(user));

if(isadmin( user )){

if(user.lv===0){
helpadviews();
showadminviews(user);

get('adminbutton').prop('onmousedown',function(){

if(get('adminbutton').ad){

if(get('wpcontainer').biz){

	get('wpcontainer').stprop('display','block');
	get('navhead').stprop('display','block');
}


get('backadbox').stprop('display','none');
get('adiv').stprop('display','block');


document.body.removeChild(get('sidebar'));
get('adminbutton').ad=false;

}else{
makesidebar();
get('backadbox').stprop('display','block');
get('navhead').stprop('display','none');
get('wpcontainer').stprop('display','none');
get('farmtablediv').stprop('display','none');
get('adiv').stprop('display','none');
get('adminbutton').ad=true;
}

});// sets admin button

}else{

var adiv = get('adiv').stprop('display','block');


}// if super admin



}else{

loginbsuser(user);


}
readyviews(user);


}//loginwithuser

function testput(e){
var code = event.keyCode;

if(code===13){


trytologin();

}//enter push


}//testput


function sw(el1,el2) {
	
el1.stprop('display','block');

el2.stprop('display','none');


}

var raputs =[
{ "name" : "name" , "put":"raname"},
{ "name" : "resname" , "put":"rabname"},
{ "name" : "city" , "put":"racity"},
{ "name" : "email" , "put":"raemail"},
{ "name" : "onefarm" , "put":"rafarm"}
];

function showra(){
var ra = get('RequestForm').stprop('display','block');
var lo = get('lotab').stprop('display','none');
}

function showfo(){
var fo = get("ForgotForm").stprop('display','block');
var lo = get('lotab').stprop('display','none');
}

function raback(){
var ra = get('RequestForm').stprop('display','none');
var lo = get('lotab').stprop('display','table');
}

function foback(){
var fo = get("ForgotForm").stprop('display','none');
var lo = get('lotab').stprop('display','table');
}

function fosend() {



var urlstring = PARSE_BASE_URL + sendforgotemailUrl;
alert(get('foemail').value)

postwithkeys(urlstring,function(stuff){

alert(JSON.stringify(stuff))

},JSON.stringify( {'email': get('foemail').value } ) );//post with stuff

}



function rasend(){

var raq = {};


for (var i = 0; i < raputs.length; i++) {
	var ra = raputs[i];

raq[ra.name] = get(ra.put).value;

};

var urlstring = PARSE_BASE_URL+sendreqacemailUrl;
postwithkeys(urlstring,function(stuff){

alert(JSON.stringify(stuff))

},JSON.stringify(raq));//post with stuff


}






