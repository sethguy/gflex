var sbos = [

    { 'name': 'adb', 'title': 'Add Business' },
    { 'name': 'ebu', 'title': 'Edit Business/User' },
    //{'name':'adu','title':'Greenease CRM'},
    { 'name': 'adf', 'title': 'Add/Edit Farm' },
    //{'name':'avf','title':'Verify Farm'},
    { 'name': 'avb', 'title': 'Verify Business' },
    { 'name': 'spa', 'title': 'Special Actions' }

];

addck = [];

//{'name':'ulink','title':'Link User','view':'ulink'},
var abfields = [

    { 'name': 'business', 'title': 'Business Name' },
    { 'name': 'address', 'title': 'Address' },
    { 'name': 'geoPoint', 'title': 'geoMap', 'view': 'mapForm', 'onlyedit': true },
    { 'name': 'cuisine', 'title': 'Cuisine' },
    { 'name': 'phone', 'title': 'Phone Number' },
    { 'name': 'website', 'title': 'Website' },
    { 'name': 'linked', 'title': 'Linked User', 'view': 'linkedusers', 'onlyedit': true },
    { 'name': 'owner_email', 'title': 'Contact Email' },
    { 'name': 'hours', 'title': 'Hours', 'view': 'hours' },
    { 'name': 'cats', 'title': 'Categories', 'view': 'cats', 'onlyedit': true },
    { 'name': 'place_id', 'title': 'Place Id', 'rule': 'hidden' },
    { 'name': 'geo', 'title': 'Geo Location', 'rule': 'hidden' },

];

var tabmod = new abfieldvmod();

function helpadviews() {


    if (addck.length == 0) {

        addck.push(1);
        // TITLE PLACEMENT
        for (var i = 0; i < sbos.length; i++) {

            var sbo = sbos[i];

            get(sbo.name + 'view').pend(

                div().cl('sabtcon').inn(

                    sbo.title

                )

            );

        } // Tiltle loop

        //abform build

        var adform = get('asformcon');

        for (i = 0; i < abfields.length; i++) {

            var af = abfields[i];

            if (af.view == null) {

                var aftd = abfield(af);

                adform[af.name] = aftd;

                adform.pend(aftd);

            } else {

                if (!af.onlyedit) {

                    var aftd = tabmod[af.view]();

                    adform[af.name] = aftd;

                    adform.pend(el('p').inn(af.title));

                    adform.pend(aftd);

                }

            } // feild placement

        } // adfield loop

        //ADD THE CONTROLS
        adform.pend(

            el('table').pend(

                el('tr').pend(

                    el('td').pend(

                        div().cl('bsavebt').prop('id', 'bsavebt').prop('onmousedown', function() {

                            //var bi =  {"business":"Nando's Peri-Peri","address":"1210 18th St NW Washington","phone":"(202) 621-8603","owner_email":"","hours":{"Sun":{"op":"1100","cl":"2200"},"Mon":{"op":"1100","cl":"2200"},"Tue":{"op":"1100","cl":"2200"},"Wed":{"op":"1100","cl":"2200"},"Thu":{"op":"1100","cl":"2200"},"Fri":{"op":"1100","cl":"2300"},"Sat":{"op":"1100","cl":"2300"}}};

                            var bi = getbifromfields();

                            bi.loname = bi.business.toLowerCase();

                            console.log('bi is :  ' + JSON.stringify(bi));

                            var urlstring = savebusinessurl; //+ "/" + encodeURIComponent(JSON.stringify(bi));

                            poststuff(urlstring, bi, function(stuff) {

                                console.log(stuff);

                                clearfields();

                            }); //save request

                        }).inn("Save Business")

                    )

                ).pend(

                    el('td').pend(

                        div().cl('bsavebt').prop('id', 'bsavethenbt').prop('onmousedown', function() {

                            //var bi =  {"business":"Nando's Peri-Peri","address":"1210 18th St NW Washington","phone":"(202) 621-8603","owner_email":"","hours":{"Sun":{"op":"1100","cl":"2200"},"Mon":{"op":"1100","cl":"2200"},"Tue":{"op":"1100","cl":"2200"},"Wed":{"op":"1100","cl":"2200"},"Thu":{"op":"1100","cl":"2200"},"Fri":{"op":"1100","cl":"2300"},"Sat":{"op":"1100","cl":"2300"}}};

                            var bi = getbifromfields();

                            bi.loname = bi.business.toLowerCase();

                            console.log('bi is :  ' + JSON.stringify(bi));

                            var urlstring = savebusinessurl; //+ "/" + encodeURIComponent(JSON.stringify(bi));

                            poststuff(urlstring, bi, function(stuff) {

                                console.log(stuff);

                                clearfields();
                                showbiztoedit(stuff);
                                pressideop({ 'name': 'ebu', 'title': 'Edit Business/User' });

                            }); //save request

                        }).inn("Save Then edit")

                    )
                )
            )
        );

    }

} //helpadviews


function getbifromfields() {
    var bi = {};
    for (var i = 0; i < abfields.length; i++) {

        var af = abfields[i];

        if (af.view == null) {

            var put = get('adf' + af.name);

            bi[af.name] = put.value;

        } // special file ck

    }; // f loops

    var newbhours = {};

    /*
    for (var i = 0; i < dayray.length; i++) {
        var day = dayray[i];

    var odput = get(day.short+'_o');
    var cdput = get(day.short+'_c');

    newbhours[day.short] = { 'op':odput.value,'cl':cdput.value };

    };// day loop

    bi.hours_json = newbhours;
    */

    console.log("here" + get('daytextcon').ohours)



    if (get('daytextcon').ohours) {

        bi.hourList = get('daytextcon').ohours;

        //bi.ohours.periods = JSON.parse(bi.ohours.periods)

        console.log(bi.ohours.weekday_text)
            //bi.ohours.weekday_text = JSONbi.ohours.weekday_text)

    }
    bi.geo = JSON.parse(get('adfgeo').value);
    bi.place_id = get('adfplace_id').value;

    console.log(JSON.stringify(bi));

    return bi;
} //getbifromfields

function abfield(af) {

    if (af.rule == null) {

        var abf = div().cl('abfield');

        var put = el('input').cl('afput').prop('placeholder', af.title).prop('id', 'adf' + af.name);

        abf.put = put;

        abf.pend(

            el('p').inn(af.title)

        ).pend(

            put

        );

    } else {

        var abf = div().stprop('display', 'none');

        var put = el('input').cl('afput').prop('type', 'hidden').prop('id', 'adf' + af.name);

        abf.put = put;

        abf.pend(put);

    } // rule ck

    return abf;
} //abfield

function makesidebar() {

    var badbox = get('getbackadbox');

    var sb = div().cl('sidebar').prop('id', 'sidebar');

    for (var i = 0; i < sbos.length; i++) {

        var sbo = sbos[i];

        sb.pend(sideop(sbo));

    } //loop

    document.body.appendChild(sb);
} //makesidebar


function sideop(sb) {
    var sbr = div().cl('sbo');
    sbr.pend(

        el('p').inn(sb.title)

    ).prop('onmousedown', function() {

        pressideop(sb);

    });

    return sbr;
} //sbo

function pressideop(sb) {

    if (sb.name === 'avb') {

        loadbisugs();

    }
    if (sb.name === 'spa') {

        loadspActions();

    }

    for (var i = 0; i < sbos.length; i++) {

        var sbi = sbos[i];

        get(sbi.name + 'view').stprop('display', 'none');

    }; //sb loop

    get(sb.name + 'view').stprop('display', 'block');

    google.maps.event.trigger(map, "resize");

} // side op selection


var loadspActions = function() {

        if (get('spaPlace')) {

            get('spaPlace').inn('');

        } else {

            get('spaview').pend(

                div().cl('sugplace').prop('id', 'spaPlace').prop('align', 'left')

            );

        }

        var urlstring = getSpecialsUrl;

        grabstuff(urlstring, function(stuff) {

            get('spaPlace').pendray(stuff, function(special) {

                    return spActionLine(special);

                }) //
                //placechoices(stuff, sugdiv, get('bsugplace'));

        }); //sug requst

    } //loadspActions

var spActionLine = function(special) {

        var spLine = div().cl('spLine');

        spLine.pend(

            el('span').inn(special.name)

        ).async({
            id: 'getActions',
            url: getspActionsUrl.concat('/' + special._id),
            drop: function(res, dio) {

                dio.pend(

                    el('span').inn('users redeemed : ' + res.length)

                )

            }
        })

        return spLine;

    } //spActionLine


function loadbisugs() {

    if (get('sugplace')) {

        get('sbugplace').inn('');

    } else {

        get('avbview').pend(

            div().cl('sugplace').prop('id', 'bsugplace').prop('align', 'left')

        );

    }

    var urlstring = getbisugurl;

    grabstuff(urlstring, function(stuff) {

        placechoices(stuff, sugdiv, get('bsugplace'));

    }); //sug requst


} //loadbisugs


function clearfields() {

    get('adfbusiness').value = "";
    get('adfaddress').value = "";
    get('adfphone').value = "";
    get('adfplace_id').value = "";
    get('adfgeo').value = "";
    get('adfwebsite').value = "";

    get("adfcuisine").value = "";
    get("daytextcon").inn('');

    get('adfowner_email').value = "";
    /*
        for (var i = 0; i < 7; i++) {

            get(dayray[i].short + '_o').value = "";

            get(dayray[i].short + '_c').value = "";

        }; // day loop
        */

} //clear fields


/*
 <div class="gfade"></div>
  <input onkeyup="adsearchfarmsbyname(this)" id="adFarmselinput" type="text" autocomplete="off">
  <div class="farmsearchcon2">
       <div id="adfazultscon" class="fazultcon">
*/

function adsearchfarmsbyname(ele) {

    var word = ele.value;
    var rcon = get('adfazultscon').stprop('display', 'block').inn("");

    if (word.length > 0) {

        var urlstring = GetfaByNameUrl + "/" + word;

        grabstuff(urlstring, function(stuff) {

                //console.log(JSON.stringify(stuff));
                console.log(word + "  word n term   " + ele.value);

                if (word !== ele.value) {

                    console.log('caugth');

                }


                if (word === ele.value) {

                    console.log('all clear');
                    get('adfazultscon').inn("");

                    for (var i = 0; i < stuff.length; i++) {

                        var fa = stuff[i];

                        //fa.name.toLowerCase().indexOf(ele.value.toLowerCase() )>-1  &&  

                        if (ele.value.length > 0) {

                            rcon.pend(

                                adfazult(fa)

                            );

                        } // q ck

                    }; // farm loop


                } //latency ck

            }) //request

    } else {

        get('adbizultscon').stprop('display', 'none').inn("");

    } //length ck

} //dsearchfarmsbyname


function abfieldvmod() {

    this.ulink = function() {
            var ul = div().cl("ulinkbox");

            var ulb = div().cl("ulbt").inn("Send User Email");
            ul.pend(ulb);
            return ul;
        } //place_id


    this.linkedusers = function() {


        return div();
    }

    this.owner_email = function() {


            return div();
        } //owner email

    this.place_id = function() {


        } //place_id


    this.cats = function() {

        return div();
    }; //categories

    this.hours = function() {
            /*
            var ht = el('table').cl('abhourstab');

            var tr = el('tr');

            for (var i = 0; i < dayray.length; i++){

                var day = dayray[i];

            tr.pend( 

                el('td').pend(

            div().cl('abhrsdiv').pend(

                    el('p').inn( day.short ).stprop('text-decoration','underline')

                    ).pend( el('p').inn('open:') ).pend(

            el('input').prop('id',day.short+'_o')

                    ).pend( el('p').inn('close:') ).pend(

            el('input').prop('id',day.short+'_c')
                    
                    )  
                            )

                )

            }//day loop

            ht.pend(tr);
            */
            return div().cl('daytextcon').props({ 'id': 'daytextcon' })
        } //hous

} //fieldmod

var greenMapForm = function(bi) {

        var gmf = mapForm();

        if (bi && bi.geoPoint) {

            var geoPoint = bi.geoPoint;

            var center = new google.maps.LatLng(geoPoint.coordinates[1], geoPoint.coordinates[0]);

        }

        gmf.onGeo('initGeo', function(geo, mF) {

            mF.setMap({
                center: center || new google.maps.LatLng(geo.lat, geo.lng),
                zoom: 13,
                mapTypeControl: false,
            }).resize()

            if (bi && bi.geoPoint) {

                var geoPoint = bi.geoPoint;

                var gCoords = center;

                mF.addMarker(gCoords);

            }

            mF.pend(

                div().cl('mapMsg'), 'msg'

            );

            mF.map.addListener('mousedown', function(event) {

                google.maps.event.trigger(mF.map, 'resize');

                set = setTimeout(function() {

                    mF.msg.stProps({
                        opacity: '1',
                        height: '50%'
                    }).inn('').inn('point selected').wait({
                        wait: 1000,
                        boom: function(msg) {

                            msg.dio.stProps({
                                opacity: '0',
                                height: '0%'
                            })

                        }
                    });

                    get('ebfgeo').value = JSON.stringify({
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    });


                    mF.clearMarkers();

                     mF.addMarker( new google.maps.LatLng( event.latLng.lat(), event.latLng.lng() )   );

                }, 900)

            });

            mF.map.addListener('mouseup', function(event) {

                clearTimeout(set)

            });

            mF.map.addListener('click', function(event) {

                clearTimeout(set)

            });

        }).getGeo('initGeo')

        return gmf;

    } //greenMapForm
