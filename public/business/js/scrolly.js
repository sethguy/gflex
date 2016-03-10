var mset = new Array();
var scrollies = new Array();
function getscrollies(){
var sray = new Array();

var imgs =safeclasser('flyimg',"img");
var boxes =safeclasser('flybox',"div");
var words =safeclasser('flyword',"p");

for (var i = 0; i <imgs.length; i++) {
sray.push (imgs[i])
}// imgs loop

for (var i = 0; i <words.length; i++) {
sray.push (words[i])
}// imgs boxes

for (var i = 0; i <boxes.length; i++) {
sray.push (boxes[i])
}// imgs words

return sray;
}

function supscroll(){

scrollies  = getscrollies();

var speeds = [ 1 , 2 , 3 , 4 ];

var dirs = [ 1 , -1 ];

for(var i =0;i<scrollies.length;i++){
	var set = Math.round( Math.random() * 2 ) ;
	mset.push( new Array(set, 
		dirs[  Math.round( Math.random() )  ]  , 
		  speeds[  Math.round(  Math.random()*3 )  ]  , 
		   dirs[  Math.round(  Math.random() )  ]  ) );
}//looks loop


}//sup


function findscrollet(el){
	
	 var scrollet= el.parentNode;
	var pc = scrollet.className;
	
	
	while( pc!="scrollet" ){
			
		scrollet = scrollet.parentNode;
	
		pc = scrollet.className;
	
	}
		
	return scrollet;
}

function scrollEnforcer(el){
	for(var i =0;i<scrollies.length;i++){
		
var scrolly=  flava(scrollies[i]).prop("cset",mset[i]).prop("floatin",function(per){  smove(scrollies[i],per); });
		var lgp = findscrollet(scrolly);
		
		var pf = (  ctop(lgp) -ctop( get('scrolldiv') )  );
		
		var per = (pf/ch(lgp))* 100  ;
		
		scrolly.floatin(per);
		
	}// scrollies loop
	
}//scroll enforcer


function smove(el,per ){
		
var set = el.cset;
	
var a = set[1];
var b = set[2];
var c = set[3];
	switch(set[0]){
	
	case 0:		
		
		el.style.left=(a*b*per)+"%";
		el.style.top="0%";
	break;
		
	case 1:
		b=b*2;
		el.style.left="0%";

		el.style.top=(a*b*per)+"%";
		break;
			
	case 2:
		el.style.top=(a*b*per)+"%";
		el.style.left=(c*b*per)+"%";
		break;
		
	}//cset swtich
	
	
}//smove
