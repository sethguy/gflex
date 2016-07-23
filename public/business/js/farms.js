var fpros = [{
        'name': 'Meats',
        'qstring': "category_meat",
        'img': 'chicken.png',
        'short': 'meat'
    }, {
        'name': 'Produce',
        'qstring': "category_produce",
        'img': 'apple.png',
        'short': 'produce'
    }, {
        'name': 'Seafood',
        'qstring': "category_seafood",
        'img': 'fish.png',
        'short': 'seafood'
    }, {

        'name': 'Dairy',
        'qstring': "category_dairy",
        'img': 'cheese.png',
        'short': 'dairy'
    },

];


var fcats = [

    {

        'name': 'Free Range',
        'imgoff': 'freerange@2x.png',
        'imgon': 'freerange_highlighted@2x.png',
        'qstring': 'free_range'
    },


    {

        'name': 'Grass Fed',
        'imgoff': 'grassfed@2x.png',
        'imgon': 'grassfed_highlighted@2x.png',
        'qstring': 'grass_fed'
    },


    {

        'name': 'Drug Free Meats',
        'imgoff': 'hormonefree@2x.png',
        'imgon': 'hormonefree_highlighted@2X.png',
        'qstring': 'drug_free'
    },

    {

        'name': 'Organic',
        'imgoff': 'organic@2x.png',
        'imgon': 'organic_highlighted@2x.png',
        'qstring': 'organic'
    },

    {

        'name': 'Sustainable Seafood',
        'imgoff': 'seafood@2x.png',
        'imgon': 'seafood_highlighted@2x.png',
        'qstring': "sustainable_seafood"
    },


];


var bfarmfields = [

    { 'name': 'name', 'title': 'Name' },
    { 'name': 'address', 'title': 'Addresss' },
    { 'name': 'email', 'title': 'Email' },
    { 'name': 'phone', 'title': 'Phone' },
    { 'name': 'farmer_first_name', 'title': 'Farmer Name' },
    { 'name': 'products', 'title': 'Products' },
    { 'name': 'state', 'title': 'State' },
    { 'name': 'state_code', 'title': 'State Code' },
    { 'name': 'website', 'title': 'Website' },

];


var fillmod0 = new fillmod();

function searchfarmsbyname(ele) {
    var wb3 = get('wb3');

    wb3.stprop('visibility', 'hidden').stprop('height', '0%');

    var word = ele.value;
    var rcon = get('fazultscon').stprop('display', 'block'); //.inn("");

    if (word.length > 0) {

        var lowterm = ele.value.toLowerCase();

        var urlstring = GetFaByNameUrl + "/" + word;

        grabstuff(urlstring, function(stuff) {

                wb3.stprop('visibility', 'hidden').stprop('height', '0%');

                if (stuff.length == 0 && ele.value.length > 0) {

                    var text = ele.value + " is not in our database. Click here and we will verify and add it. ";

                    wb3.stprop('visibility', 'visible').stprop('height', '10%').prop('onmousedown', function() {

                        var urlstring = PARSE_BASE_URL + buserfarmsugUrl;

                        var load = {};

                        var user = JSON.parse(getCookie('user'));

                        postwithkeys(urlstring, function(stuff) {

                            if (stuff.result) alert(stuff.result)

                        }, JSON.stringify({ farmName: ele.value, mail: user.username, userId: user.objectId }));


                    });

                    get('wb3p').inn(text);

                } else {

                    wb3.stprop('visibility', 'hidden').stprop('height', '0%');

                }

                console.log(word + "  word n term   " + ele.value);

                if (word !== ele.value) {

                    console.log('caugth');

                }


                if (word === ele.value) {
                    console.log('all clear');
                    get('fazultscon').inn("");

                    for (var i = 0; i < stuff.length; i++) {
                        var fa = stuff[i];
                        //fa.name.toLowerCase().indexOf(ele.value.toLowerCase() )>-1  && 
                        //fa.loname.indexOf(lowterm)>-1 && 
                        if (ele.value.length > 0) {

                            rcon.pend(

                                fazult(fa)

                            );

                        } // q ck

                    } //fazults loop

                }

            }) //request

    } else {

        get('fazultscon').stprop('display', 'none').inn("");
        wb3.stprop('visibility', 'hidden').stprop('height', '0%');


    } //length ck


} //searchfarmsbyname


function displayfazults(fazults) {


} //displayfazults


function fazult(fa) {

    var fz = div().cl('fazult').pend(

        el('p').inn(fa.name + " - " + fa.state_code)

    ).prop('onmousedown', function() {

        if (buysfromlist != null) firefarmselection(fa);

        get('Farmselinput').value = "";

        get('fazultscon').stprop('display', 'none').inn("");

    });

    return fz;
} //bizult


function adfazult(fa) {

    var fz = div().cl('fazult').pend(

        el('p').inn(fa.name)

    ).prop('onmousedown', function() {


        adfirefarmselection(fa);

        get('adFarmselinput').value = "";

        get('adfazultscon').stprop('display', 'none').inn("");

    });

    return fz;
} //bizult


function newfarm(fa) {

    grabstuff("http://business.greenease.co/newfarm/" + JSON.stringify(fa), function(stuff) {

        console.log(stuff);

    });

} //newfarm


function adfirefarmselection(fa) {
    console.log(JSON.stringify(fa));
    showfarmfields();
    adselecedFarm = fa;
    fillfarmfields(fa);
} //adfirefarmselection


function firefarmselection(fa) {

    get("wpcontainer").appendChild(get('FarmInfodiv'));

    console.log(JSON.stringify(fa));

    //selecedFarm=fa;
    get("widgetpreview").stprop('display', 'none');

    showfarminfo(fa);

    fillfarminfo(fa);

    setbuysfrom(fa);


} //firebizselection

function phfirefarmselection(fa) {

    get('farmtable').stprop('zIndex', "-1").stprop('opacity', .3);

    showfarminfo(fa);

    fillfarminfo(fa);

    setbuysfrom(fa);


} //firebizselection

function closefarminfo() {

    get("FarmInfodiv").stprop('display', 'none');
    get('farmtable').stprop('zIndex', "10").stprop('opacity', 1);
    get("widgetpreview").stprop('display', 'block');


} //close farminfo

function showfarminfo(fa) {

    get("FarmInfodiv").stprop('display', 'block').prop('farm', fa);

    get('popwords').inn('Click the checkboxes above to update the agricultural goods you purchase from this farm.');

} //showfarminfo

function fillfarminfo(fa) {
    //place regular farm fileds


    get('notearea').value = "";

    if (BigCal) {
        BigCal.update(new Date());
        BigCal.dateField.innerHTML = BigCal.date.print(BigCal.dateFormat);
    }

    for (var i = 0; i < bfarmfields.length; i++) {

        var fi = bfarmfields[i];

        var fn = fi.name;

        if (fn === "farmer_last_name") {


        } else if (fn === "website") {

            var link = "";

            if (fa[fn]) link = fa[fn];

            if (!get(fn + "fainfo").body) get(fn + "fainfo").inn('Website').prop('href', link);


        } else {

            var show = "";

            if (fa[fn]) show = fa[fn];

            if (!get(fn + "fainfo").body) get(fn + "fainfo").inn(show);

        }


    }; // farm mond loop

    // place certs/ cats

    var cd = get('certlet').inn("");

    for (var i = 0; i < fcats.length; i++) {

        var cat = fcats[i];

        if (fa[cat.qstring]) {

            cd.pend(

                div().cl('certbox').pend(

                    el('img').prop('src', 'business/images/' + cat.imgon).cl('certimg')

                ).pend(

                    div().cl("certname").inn(cat.name)

                )

            );

        } // place a cert if farm has it


    }; // farm mond loop


    //add space to bottom

    cd.pend(div().cl('certspace'));


    //PLACE PRODUCT CK BOXES
    var plct = 0;

    for (var i = 0; i < fpros.length; i++) {

        var fi = fpros[i];

        if (fa[fi.qstring]) {

            var xpos = (25 * plct) + "%";

            get(fi.short + 'chobox').stprop('left', xpos).style.display = "block";


            plct++;

        } else {
            get(fi.short + 'chobox').style.display = "none";
        } // should the box be places and where 


    }; // farm fpro loop for box ck placment loop


} //fillfarminfo

function savefarmupdate() {

    var pros = [];

    var biz = get("FarmInfodiv").biz;

    var farm = get("FarmInfodiv").farm;

    var note = get('notearea').value;

    var date = get('dateput').innerHTML;

    var nd = new Date(date);

    var d = new Date();
    var n = d.getTime();

    nd.setHours(d.getHours());
    nd.setMinutes(d.getMinutes());
    nd.setSeconds(d.getSeconds());
    nd.setMilliseconds(d.getMilliseconds());
    var time = nd.getTime();

    var noteupdate = false;

    if (note) {

        if (note.length > 0) {

            noteupdate = true;

        } else {

            note = "NA";

        }

    } else {

        note = "NA";

    }

    for (var i = 0; i < fpros.length; i++) {

        var fp = fpros[i];

        var fpck = get('cho' + fp.short);

        var vl = fpck.value;

        var proput = { 'name': fp.short, 'value': vl };

        if (farm[fp.qstring]) pros.push(proput);

        console.log("  firts loop " + JSON.stringify(proput));

    }; // fpro loop

    console.log('farnbiz' + JSON.stringify(farm));

    var bid = biz.objectId || biz._id;
    var fid = farm.objectId || farm._id;

    if (window.Prototype) {
        delete Object.prototype.toJSON;
        delete Array.prototype.toJSON;
        delete Hash.prototype.toJSON;
        delete String.prototype.toJSON;
    }

    var sendray = JSON.stringify(pros);
    console.log(sendray);

    var urlstring = SendFarmUpdateUrl + "/" + bid + "/" + fid + "/" + sendray;

    console.log(urlstring);

    //  build list of purchase history recs
    // to make base on whether this update reflecs a change

    var newprolist = [];

    var hadfarm = false;

    for (var i = 0; i < buysfromlist.length; i++) {
        var buy = buysfromlist[i];

        var bfarm = buy.ob;

        if (bfarm.objectId === farm.objectId) {
            hadfarm = true;
            for (var j = 0; j < pros.length; j++) {
                var pro = pros[j];

                if ((buy[pro.name] && pro.value) || (!buy[pro.name] && !pro.value)) {


                } else {

                    newprolist.push(pro);

                }


            }; //loop

        }


    }; // purhis ck  loop


    if (buysfromlist.length === 0 || newprolist.length > 0 || noteupdate || !hadfarm) {

        if (newprolist.length == 0) {

            for (var i = 0; i < fpros.length; i++) {
                var fp = fpros[i];

                if (farm[fp.qstring]) {

                    var fpck = get('cho' + fp.short);

                    var vl = fpck.value;

                    var proput = { 'name': fp.short, 'value': vl };

                    newprolist.push(proput);

                } // if farm provides 

            } // fpros loop


        } // new note / no buysfrom change catcher

        createPurHistRec(bid, fid, newprolist, note, time, function() {

            grabstuff(urlstring, function(stuff) {

                refeshbusiness(biz, farm);

                console.log(stuff);


                if (stuff.msg) alert(stuff.msg);


            }); // send update request 


        }); // create purchase history first 


    } else {


        //refeshbusiness( biz , farm );


    } //ck to see if newprolist was made


} //savefarmupdateinfo


function ckchobox(box) {

    var vl = box.value;
    var not = "";

    if (vl === true) {

        box.innerHTML = "";
        box.value = false;
        not = " not";
    } else {

        box.appendChild(

            el('img').cl('ckimg').prop('src', "business/images/blackck.png")

        );

        box.value = true;

    }

    get('popwords').inn("You've indicated that you are" + not + " purchasing " + box.id.replace('cho', '') + " from " + get("FarmInfodiv").farm.name + "<br><br>" +
        "Greenease helps you track when you start and stop buying from farms to help you track your seasonal purchased. Click SAVE and then CLOSE.");


} //ckchobox

function setbuysfrom(fa) {


    var makebt = get('fimake');
    //makebt.stprop('display','none');

    var makemsg = get('makemsg');
    makemsg.inn("Make farm private");
    makebt.value = false;

    for (var i = 0; i < fpros.length; i++) {
        var fp = fpros[i];

        var box = get("cho" + fp.short).inn("").prop('value', false);

    }; //fpros loop

    console.log("setbuys from");

    if (buysfromlist) {
        for (var i = 0; i < buysfromlist.length; i++) {
            var buys = buysfromlist[i];

            var sfa = buys.farm;

            var theFarm = buys.ob;

            if (theFarm.name === fa.name) {
                console.log("this is buys 7 " + JSON.stringify(buys));

                makebt.buysfrom = buys;
                //makebt.stprop('display','block');

                setckboxes(buys);
                console.log(JSON.stringify(buys));

                console.log(buys.buys.hide + "  thisishide" + fa.name);

                if (buys.buys.hide) {

                    makebt.value = buys.buys.hide;

                    makemsg.inn("Make farm public");

                } else {

                    makebt.value = false;

                    makemsg.inn("Make farm private");

                } // hide ck


            } // if farm in buys from

        }; // buysfrom loop for farm name to set ckboxes

    } //if buyfrom list is there

} //setbuysfrom

function ckfarmprobox(fp) {

    var n = fp.short;

    var box = get("cho" + fp.short);

    console.log("  at  " + box.value);

    if (!box.value) {

        box.pend(

            el('img').prop('src', 'business/images/blackck.png').cl('ckimg')

        ).prop('value', true);

    }


} //ckfarmprobox

function setckboxes(buys) {
    console.log("at set ckboxes   buys" + JSON.stringify(buys));
    for (var i = 0; i < fpros.length; i++) {
        var fp = fpros[i];

        if (buys[fp.short]) {

            ckfarmprobox(fp);

        } // if true reppin a buys from ck off

    }; //fpros loop


} //setckboxes

function getfarmfromfields() {

    var adfafdlist = [

        { 'name': "category_meat" },
        { 'name': "category_produce" },
        { 'name': "category_seafood" },
        { 'name': "category_dairy" },
        { 'name': 'name' },
        { 'name': 'email' },
        { 'name': 'address' },
        { 'name': 'phone' },
        { 'name': 'farmer_first_name' },
        { 'name': 'products' },
        { 'name': 'state' },
        { 'name': 'state_code' },
        { 'name': 'website' },
        { 'name': 'free_range' },
        { 'name': 'grass_fed' },
        { 'name': 'drug_free' },
        { 'name': 'organic' },
        { 'name': 'sustainable_seafood' }

    ];


    var fa = {};

    for (var i = 0; i < adfafdlist.length; i++) {

        var fd = adfafdlist[i];

        var fdob = get('edfa' + fd.name);

        var value = fdob.value;
        console.log(fd.name + "  ::  " + value);
        fa[fd.name] = fdob.value;

    }; //feild loop

    if (adselecedFarm) {
        fa.objectId = adselecedFarm.objectId;
    }

    return fa;
} //getfarmfrom fields

function showfarmfields(bt) {


    if (bt) {
        adselecedFarm = null;
    }
    var fieldstage = get('adnewfarm');

    fieldstage.inn("");

    fieldstage.pend(showfbfields());
    fieldstage.pend(showfpros());
    fieldstage.pend(showfcats());

} //showfarmfileds


function showfpros() {
    var procon = div().cl('faprocon');
    var protab = el('table').cl('faprotab');

    var tr = el('tr');

    for (var i = 0; i < fpros.length; i++) {
        var pro = fpros[i];
        var td = el('td');

        tr.pend(

            td.pend(

                div().cl('faprotdiv').prop('align', 'center').pend(

                    el('img').prop('src', 'business/images/' + pro.img).cl("proimg")

                ).pend(

                    el('p').inn(pro.name)

                ).pend(

                    facatckbox(pro)

                )

            )

        );


    }; //fpro loop


    protab.pend(tr);

    procon.pend(protab);
    return procon;
} //showfpros

function facatckbox(pro) {

    var catck = div().prop('onmousedown', function() {

        var box = get("edfa" + pro.qstring);

        if (!box.value) {

            box.pend(

                el('img').cl('ckimg').prop("src", "business/images/blackck.png")

            );
            box.value = true;
        } else {

            box.inn("");
            box.value = false;

        }

    }).cl('catck').prop("id", "edfa" + pro.qstring).prop('value', false);

    return catck;
} //facatckbo

function showfbfields() {
    var bfc = div().cl('bfarmfieldcon');

    for (var i = 0; i < bfarmfields.length; i++) {

        var bfield = bfarmfields[i];

        bfc.pend(

            el('p').inn(bfield.title + ":").cl("bfafieldt")

        ).pend(

            el('input').cl('adnewfarmput').prop('placeholder', bfield.title).prop('id', "edfa" + bfield.name)

        );

    }; //bfields loop

    return bfc;
} //showfbfields

function showfcats() {

    //console.log(JSON.stringify(fa));

    var cv = div().cl('adcatview').stprop('height', '60%');

    var ct = el('table').cl('adcattab');

    var tr = el('tr');

    for (var i = 0; i < fcats.length; i++) {

        var cat = fcats[i];

        //console.log( cat.qstring.name+"   "+fa[cat.qstring.name]+" cat name");

        var bival = false; //fa[cat.qstring.name];
        var imgpk = 'imgoff';

        //if(bival)imgpk = 'imgon';

        var td = el('td');

        td.pend(

            facatpart(cat, imgpk, bival)

        );
        tr.pend(td);

        if (i % 3 == 2) {

            ct.pend(tr);

            tr = el('tr');
        }

    }; //rayloop

    if ((fcats.length % 3) !== 0) ct.pend(tr);

    cv.pend(ct);
    return cv;


} //showfcats


function facatpart(cat, imgpk, bival) {

    var cp = div().cl('adcattdiv').pend(

        el('p').inn(cat.name)

    ).pend(

        el('img').prop('rayob', cat).prop(
            'src', 'business/images/' + cat[imgpk]).cl('adcatimg').prop(
            "id", "edfa" + cat.qstring).prop(
            'value', bival)

    ).prop('onmousedown', function() {

        var part = get("edfa" + cat.qstring);

        var v = part.value;

        if (v) {

            part.src = 'business/images/' + cat.imgoff;
            part.value = false;

        } else {

            part.src = 'business/images/' + cat.imgon;
            part.value = true;

        }

    });

    return cp;
} //catpart

function savefarm() {

    var name = get('edfaname');


    if (name !== null) {

        nava = name.value;

        if (nava != null) {

            if (nava.length > 0) {
                var fa = getfarmfromfields();

                fa.loname = fa.name.toLowerCase();

                console.log(JSON.stringify(fa));

                var urlstring = EditFarmUrl + "/" + encodeURIComponent(JSON.stringify(fa));
                grabstuff(urlstring, function(stuff) {


                    if (stuff.msg) {


                        alert(stuff.msg)

                    }


                });


                return;
            }


        } else {


        }


    } //is name 

    alert("No Farm To Save!")

} //savefarm

function fillmod() {

    this.catdown = function(fd, value) {
            var name = fd.name;
            var fdob = get('edfa' + fd.name);

            if (value) fdob.src = "business/images/" + fdob.rayob.imgon;

        } //catdown

    this.prodown = function(fd, value) {

            var name = fd.name

            var fdob = get('edfa' + fd.name);

            if (value) {


                fdob.pend(

                    el('img').cl('ckimg').prop("src", "business/images/blackck.png")

                );
            }
        } //prodown

} //fillmod


function fillfarmfields(fa) {

    var adfafdlist = [
        { 'name': "category_meat", 'set': 'prodown' },
        { 'name': "category_produce", 'set': 'prodown' },
        { 'name': "category_seafood", 'set': 'prodown' },
        { 'name': "category_dairy", 'set': 'prodown' },
        { 'name': 'name' },
        { 'name': 'email' },
        { 'name': 'address' },
        { 'name': 'phone' },
        { 'name': 'farmer_first_name' },
        { 'name': 'products' },
        { 'name': 'state' },
        { 'name': 'state_code' },
        { 'name': 'website' },
        { 'name': 'free_range', 'set': 'catdown' },
        { 'name': 'grass_fed', 'set': 'catdown' },
        { 'name': 'drug_free', 'set': 'catdown' },
        { 'name': 'organic', 'set': 'catdown' },
        { 'name': 'sustainable_seafood', 'set': 'catdown' },

    ];


    for (var i = 0; i < adfafdlist.length; i++) {

        var fd = adfafdlist[i];

        var fdob = get('edfa' + fd.name);

        var value = fdob.value;

        console.log(fd.name + "  ::  " + fa[fd.name]);
        fdob.value = fa[fd.name];

        if (fd.set) {

            fillmod0[fd.set](fd, fa[fd.name]);

        } // fillmod0


    }; //feild loop


} //fillfarmfields


function makefarmprivate() {

    var farmInfodiv = get('FarmInfodiv');

    var farm = farmInfodiv.farm;

    var biz = farmInfodiv.biz;

    var makebt = get('fimake');

    var value = makebt.value;

    console.log(value + " value 1");

    if (value === true) {

        value = false;

    } else {

        value = true;

    }
    console.log(value + " value 2");
    var fimakebuyid = get('fimake').buysfrom.buys.objectId
        //var urlstring = toggleprivateUrl+"/"+farm.objectId+"/"+biz.objectId+"/"+value;

    console.log(fimakebuyid + "  fimake ")

    var urlstring = toggleprivateUrl + "/" + fimakebuyid + "/" + value;

    console.log(urlstring + "  stefarmvis");

    grabstuff(urlstring, function(stuff) {

        var msg = stuff.msg;

        if (msg) {

            refeshbusiness(biz, farm);

            alert(msg)

        } else {

            alert('error')

        }

    });

} // makefarmprivate()
