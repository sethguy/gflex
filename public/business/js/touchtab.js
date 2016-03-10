
var flexray = [
{'name':'seth'},
{'name':'pat'},
{'name':'ivana'},
{'name':'gma'},
0,
{'name':'mury'},
{'name':'charmon'},
{'name':'bryce'},
0,
{'name':'carol'},
{'name':'anna3'},

];

function flextest(){

flex0 = new flexmod();
flex2 = new flexmod2();
document.body.appendChild(
 div().cl('demoflexcon').pend(
 	touchtab2(flexray,5,3,flex2)
 	)
 );

}//flextab



function flexmod2(){


this.d = function(wh){
var ld = div().cl('flexcell2');

ld.pend(
	el('p').inn(wh.name)
	).prop('onmousedown',function(){

alert(wh.name)

	});

	return ld;
};//fcall


}//flexmod


function flexmod(){

this.fcal = function(wh){
var ld = div().cl('flexcell');

ld.pend(
	el('p').inn(wh.name)
	).prop('onmousedown',function(){

alert(wh.name)

	});

	return ld;
};//fcall

}//flexmod



function touchtab(ray){
var tt = el("table").cl("touchtab");
var tr = el("tr");

for (var i = 0; i < ray.length; i++) {
	var ob = ray[i];
var td = el("td");

	if(ob!==0){

tr.pend( td.pend(  ob  ) );
td.onmousedown = ob.on;

	}else{

tr.pend(td);

	}

};
tt.pend(tr)

return tt;
}// touchtab

function touchtab2(ray,a,b,mod,refob){

var tt = el("table").cl("flextab");
var tr = el("tr");

for (var i = 0; i < ray.length; i++) {
	var ob = ray[i];
var td = el("td");

	if(ob!==0 ){

if( !ob.view ) vdrop = mod["d"](ob,refob);

		if( ob.view ) vdrop = mod[ob.view](ob,refob);

td.pend( vdrop  );

	} // if ob in array is not 0 meaning no placements

tr.pend(td);
if(i%a==b){

tt.pend(tr);

tr = el('tr');
}//position modulus logic


};//ray loop

//get left over table row the logic excluded
if( (ray.length%a ) !== 0)tt.pend(tr);

return tt;
}// touchtab2




