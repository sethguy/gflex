 

function last(){
return lines[lines.length-1];
}


function ladd(el){
lines.push(el);
}


function mx(el){
return ( x2(el) - x1(el) );
}

function my(el){
return ( y2(el) - y1(el) );
}

function spush(el){
	
//lines.push(el);
svbox.appendChild(el);
}

function add(el){
svbox.appendChild(el);
}

function lget(el){
var x1 = el.getAttribute('x1');
var x2 =el.getAttribute('x2');
var y1 = el.getAttribute('y1');
var y2 =el.getAttribute('y2');
var xc = (x2-x1);
var yc = (y2-y1);
var l =  Math.sqrt(Math.pow(xc, 2)+Math.pow(yc, 2));
    return l
}


function rget(el){
var x1 = el.getAttribute('x1');
var x2 =el.getAttribute('x2');
var y1 = el.getAttribute('y1');
var y2 =el.getAttribute('y2');
var xc = (x2-x1);
var yc = (y2-y1);
var r = yc/xc;

    return r
}


function bget(el){
return y1( el ) - ( rget( el ) * x1( el ) ) ;
}


function x1(el){
return parseInt(el.getAttribute("x1"));
}


function x2(el){
return  parseInt(el.getAttribute("x2"));
}


function y1(el){
return  parseInt(el.getAttribute("y1"));
}

function y2(el){
return  parseInt(el.getAttribute("y2"));
}


function dlck(el){
return  gcor(el).indexOf("black")>-1  ;
}


function gcor(el){
 
return el.getAttribute("stroke");
}

function lcor(el,c){
 el.setAttribute('stroke', c);
return el;
}

function ln(sx,sy,x, y,c) {
            var xLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            xLine.setAttribute('x1', sx);
            xLine.setAttribute('y1', sy);
            xLine.setAttribute('stroke', c);
            xLine.setAttribute('stroke-width', 3);
            xLine.setAttribute('x2', x);
            xLine.setAttribute('y2', y);
    return xLine;
        }
        
        
        
function shiftl(el,x,y){

    var x1 = el.getAttribute('x1');
	var x2 = el.getAttribute('x2');
	
	var y1= el.getAttribute('y1');
	var y2 = el.getAttribute('y2');

	var dx=parseInt(x)-parseInt(x1);
	
	var nx1 = parseInt(x1)+dx;
	var nx2= parseInt(x2)+dx;

	el.setAttribute('x1',nx1);
    el.setAttribute('x2',nx2);
		
	var dy=parseInt(y)-parseInt(y1);
	
	var ny1 = parseInt(y1)+dx;
	var ny2= parseInt(y2)+dx;

	el.setAttribute('y1',ny1);
el.setAttribute('y2',ny2);
	
}

function leqy(el,x){
    var y = (rget(el)*x)+bget(el);
    return y;
}

function bln(el,x,y){
    el.setAttribute('x1', x);
    el.setAttribute('y1', y);
}

function dln(el, x, y) {
            el.setAttribute('x2', x);
            el.setAttribute('y2', y);
        }


function linelife(){
   
   for(var l =0;l<lines.length;l++){
   
       var el = lines[l];
     
if( dlck(el)){
           
    if(lget(el)>( 50 ) ){
     
        bln( el
           
          , (  x1( el ) + (  el.mx/20 ) )
           
           ,   (  y1( el ) + (  el.my/20  ) )
            
                        );//bln
        
    }//el is long enough
           else{
           
               terml(el);
           
           }//line too short
      
      }//if line done
   }
}


function terml(el){

    lines.splice(lines.indexOf(el),1);
    svbox.removeChild(el);

}
