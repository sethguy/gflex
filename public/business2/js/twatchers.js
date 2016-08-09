var twatches = new Array();

function itwatch(t,func){

var tw = {step:t};

tw.last =0;

tw.watch = function(){
var st = new Date().getTime();
var diff = st-tw.last;

if(diff>tw.step){
	func();
	tw.last = st;
}


}//watch function

return tw;
}//itwatch

function gears(){
for(var i =0;i<twatches.length;i++){
var twatch = twatches[i];
twatch.watch();

}//twatches loop

timer = setTimeout(function(){ gears(); },10);

}//gears