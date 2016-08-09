var placechoices = function( ray , pdiv , con, pt ){

con.inn('');

for ( var i = 0; i < ray.length; i++ ) {

	var let = ray[i];

con.pend( pdiv( let , pt ) );

};

}//placechoices



var sugdiv = function( ob ){

var dv = div().cl('suglet');
console.log("ob in divs"+ JSON.stringify( ob ) );
console.log("ob name"+ ob.name );
console.log("ob biz"+ ob.business );

var na = "no name";

if( ob.name )na = ob.name;

dv.pend(

	el('table').pend(

	 el('tr').pend(

	  el('td').pend(

	  	div().cl('sgtdiv').pend( 

	  		el('p').inn( na+"<br>"+ob.address+"<br>"+ob.one  ) 

	  		) 

	  	)

	  ).pend(

	  	 el('td').pend(

	  	 	div().cl('sgtdiv').pend( 

	  		el('p').inn( 'click here to note that business is verified' ) 

	  		) 
	  	).prop('onmousedown' , function(){

var bisugob = ob;

ob.verified = true;

var urlstring = setbisugtoverifiedurl+"/"+encodeURIComponent( JSON.stringify( bisugob ));

grabstuff( urlstring , function(stuff){

if(stuff.msg){


alert(stuff.msg)

}

loadbisugs();

});// set request


	  	}) //on mouse down
	) 

	  	)//table

	);//pend on sugdiv

return dv;
}




