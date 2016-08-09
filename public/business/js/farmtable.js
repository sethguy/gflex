var farmtabcols = [{
    'title': 'DATE'
}, {
    'title': 'FARM NAME'
}, {
    'title': 'CATEGORY'
}, {
    'title': 'NOTES'
}, {
    'title': 'PLACE NEW ORDER'
} ];

var sortbys = {
'DATE':{'name':'actionEffectiveDate','state':null},
'FARM NAME':{'name':'farmname','state':null},
'CATEGORY':{'name':'category','state':null},
};


function farmtable() {



} //farmtable


function writefarmtable(bi) {
get('farmtablediv').biz=bi;
    console.log(JSON.stringify(bi) + " at write farm tab ");

fillfarmtable
(bi);

} //writefarmtable



function showfarmtable(bi){

    get('farmtablediv').stprop('display','block');


get('wpcontainer').stprop('display','none');

writefarmtable(bi);

}//show farm table

function fillfarmtable(bi,sort) {
if(!sort)sort = JSON.stringify({'by':'actionEffectiveDate','di':1} );
   
    get("farmtable").stprop('opacity', 1);
    get("farmtable").stprop('zIndex', 10);

    var farmtabbody = get("farmtable");

    var row1 = get("ftc0");
    var row2 = get("ftc1");
    var row3 = get("ftc2");
    var row4 = get("ftc3");
    var row5 = get("ftc4");
    
row1.clear0();
row2.clear0();
row3.clear0();
row4.clear0();
row5.clear0();
    
    var urlstring = getPurchaseHistoryRecsUrl + "/" + bi._id+"/"+sort;

    console.log(urlstring + "  go purchaseHistoryRecords ");

    grabstuff(urlstring, function(stuff) {

        for (var i = 0; i < stuff.length; i++) {

             var thefarm = stuff[i].farm;

            /* PurchaseHistoryRecord*/
            var rec = new PurchaseHistoryRecord(stuff[i].rec);

//console.log("got rec "+JSON.stringify(rec));

            //  purchaseHistoryRecords.add( rec );

var place = thefarm.reorder;

var placetd = gettd( 5 , "  ");

var url = "";

var ment = el('a').inn('Go to Website').stprop('margin','0px');

if(place){

    url = place;

ment = el('img').prop('src','business/images/farmersweb_logo.jpg').cl('farmersimg');

}else if(thefarm.website){

     url = thefarm.website;

}
placetd = farmweb(5,url,ment);

            var td = [
                datecol( rec.actionEffectiveDate, rec.actionCode),
                gettd(2, thefarm.name),
                gettd(3, rec.category),
                gettd(4, rec.note),
                placetd ,
            ];

            rowtime(td, stuff[i].farm);

            row1.appendChild(td[0]);
            row2.appendChild(td[1]);
            row3.appendChild(td[2]);
            row4.appendChild(td[3]);
            row5.appendChild(td[4]);

        }

        row1.appendChild(gettd(0, ""));
        row2.appendChild(gettd(0, ""));
        row3.appendChild(gettd(0, ""));
        row4.appendChild(gettd(0, ""));
        row5.appendChild(gettd(0, ""));


    }); // grab stuff

} //fill farm table


function farmweb(tn,url,ment){
var l =0;

if(url)l=url.length;

var td = div().cl("fts").pend( ment.prop('href',url).prop('onmousedown',function(){

window.open(url);

}) 

);

return td;
}//farmweb


function PurchaseHistoryRecord(rec) {

    return rec;
} //PurchaseHistoryRecord




function rowtime(group, farm) {

    for (var i = 0; i < group.length; i++) {

        var ele = group[i];

if(i<group.length-1){
        ele.onmousedown = function() {

                //  NEED THIS !!!!!! FarmInfodiv.removeFromParent();

                get('FarmInfodiv').stprop('backgroundImage', "url(\"business/images/mainBackground.png\")");
                get('farmtablediv').appendChild( get('FarmInfodiv') );
            
                phfirefarmselection(farm);
            
            } // ele onmousedown
}// don listen on last row


        ele.onmouseout = function() {

                normalrow(group);
            } //on out

        ele.onmouseover = function() {

                overrow(group);

            } //if on over


    } // group loop

} //rowtime




function overrow(group) {

    for (var i = 0; i < group.length; i++) {
        var ele = group[i];
        selected(ele);

    }

}


function normalrow(group) {

    for (var i = 0; i < group.length; i++) {
        var ele = group[i];
        off(ele);
    }


}

function selected(ele) {

    ele.cl("fto");

}

function off(ele) {
    ele.cl("fts");

}


//PurchaseHistoryActionEnum acode
function datecol(date, acode) {
    var td = div();
    td.cl("fts");


    var ds = div();
    ds.cl("datespace");

  //  var d = Date.parse("2015-05-24T04:00:00.000Z");

var da = new Date(  );
da.setTime(Date.parse(date.iso));

    ds.innerHTML = da.toDateString();

    var ss = div();
    ss.cl("statspace");

    var sp = div();

    //  	console.log(" get value code   "+acode.getCodeValue() );

    if (acode == 1) {

        sp.cl("startpic");
    } else {

        sp.cl("stoppic");
    }

    ss.appendChild(sp);

    td.appendChild(ss);
    td.appendChild(ds);

    return td;
}


function gettd(tn, stuff) {
    var td = div();

    // if (stuff.length()==0) stuff ="N/A";
   // console.log(stuff + "  intd  ");

    td.innerHTML = stuff;
    td.cl("fts");


    return td;
}


function sortby(ele){

var inn = ele.innerHTML;

var state = sortbys[inn].state;

if(state===null){

    sortbys[inn].state = 1;
    fillfarmtable( get('farmtablediv').biz, JSON.stringify({'by':sortbys[inn].name,'di':sortbys[inn].state}) );
return;
}

if(state===1){

    sortbys[inn].state = 0;
fillfarmtable( get('farmtablediv').biz, JSON.stringify({'by':sortbys[inn].name,'di':sortbys[inn].state}) );
return;
}
if(state===0){

    sortbys[inn].state = 1;
    fillfarmtable( get('farmtablediv').biz, JSON.stringify({'by':sortbys[inn].name,'di':sortbys[inn].state}) );
return;
}


}

function createPurHistRec(bid,fid,newphlist,note,milli,calli){

var urlstring = createPurHistRecUrl+"/"+bid+"/"+fid+"/"+JSON.stringify(newphlist)+"/"+encodeURIComponent(note)+"/"+milli;

console.log(urlstring+"   new purchaseHistoryRecords ");

grabstuff(urlstring,function(stuff){

calli( stuff );

});

}//createPurHistRec




