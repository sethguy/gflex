function isadmin(user){
return user.isadmin;
}//isamdin


 function loginbsuser(user){


getlinkedbusiness(user,function(stuff){


var bizlist = stuff;


if(bizlist.length>1){


var adiv = get('adiv').prop('bizlist' , bizlist ).stprop('display','block');


}else if(bizlist.length===1){

firebizselection( bizlist[ 0 ].bi );

}else{

alert('no business links')

}


});
// get user business
// decide wether they should see biz selection input

}//loginbsuser


function getlinkedbusiness(user,calli){

var urlstring = getlinkedurl+"/"+user.email;

grabstuff(urlstring,function(stuff){

console.log("get linked return:"+stuff);

calli(stuff);


});// 


}//getlinked business



/*

{"Sun":{"op":"1100","cl":"2300"},

"Mon":{"op":"1100","cl":"2300"},"Tue":{"op":"1100","cl":"2300"},"Wed":{"op":"1000","cl":"2300"},"Thu":{"op":"1100","cl":"2300"},"Fri":{"op":"1100","cl":"2300"},"Sat":{"op":"1100","cl":"2300"}}


"geo":{"lat":38.9097057,"lng":-77.06535650000001},


"hours_json":{
"Sun":{"op":"","cl":""},

"Mon":{"op":"","cl":""},

"Tue":{"op":"","cl":""},

"Wed":{"op":"","cl":""},

"Thu":{"op":"","cl":""},

"Fri":{"op":"","cl":""},

"Sat":{"op":"","cl":""}

}
*/


