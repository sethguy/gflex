var widgets = [
    { 'name': 'rb', 'title': 'Red Barn', 'img': 'business/images/redbarn.png', 'short': 'barn' },
    { 'name': 'tb', 'title': 'Table', 'img': 'business/images/table.png', 'short': 'table' },
    { 'name': 'wh', 'title': 'wheel', 'img': 'business/images/wheel.png', 'short': 'wheel' },
    { 'name': 'cf', 'title': 'Cafe', 'img': 'business/images/cafe.png', 'short': 'cafe' },
    { 'name': 'ch', 'title': 'Chalk', 'img': 'business/images/chalk.png', 'short': 'chalk' },
    { 'name': 'tr', 'title': 'Transparent', 'img': '', 'short': 'trans' },
];

function widget() {


} //widget

function setpreback(wi) {
    console.log(" big wi" + JSON.stringify(wi));

    if (get('linkbox')) get('linkbox').pic = wi.short;

    get('backdiv').stprop('backgroundImage', 'url("' + wi.img + '")');
    stylebyback(wi.short);


    //getwidglink();
}


function setwidgetpktab() {

    var tab = get('wdpktab');

    if (!tab.set) {


        tab.set = true;

        var count = 0;

        for (var i = 0; i < 2; i++) {

            var tr = el('tr');

            for (var j = 0; j < 3; j++) {

                var wi = widgets[count];

                tr.pend(widgpicktd(wi));

                count++;

            }; //widg tab in loop

            tab.pend(tr);
        }; //widg tab out loop


    }

} //setwidgetpktab

function widgpicktd(wi) {

    var wp = el('td').prop('align', 'center').pend(

        div().cl('wtabdiv').pend(

            el('img').cl('wdpkimg').prop('src', wi.img)

        )

    ).pend(

        el('p').cl('pkimgtl').inn(wi.title)

    ).prop('onmousedown', function() {

        setpreback(wi);

    });

    return wp;
}

function displaywidgpreview(stuff) {

    for (var i = 0; i < fpros.length; i++) {
        var pro = fpros[i];

        get(pro.qstring + 'part').style.display = "none";

        get(pro.qstring + 'list').inn("");

    };

    buysfromlist = stuff.result;

    for (var i = 0; i < stuff.result.length; i++) {
        var fsult = stuff.result[i];
        var sfa = fsult.farm;
        var theFarm = fsult.ob;

        var hide = fsult.buys.hide;

        //console.log("sfa :: "+JSON.stringify( fsult ) );

        for (var j = 0; j < fpros.length; j++) {

            var pro = fpros[j];

            if (fsult[pro.short] && hide !== true) {
                get(pro.qstring + 'part').style.display = "block";

                get(pro.qstring + 'list').pend(

                    farmlet(theFarm)

                );

            } //post it

        }; // fpro loop


    }; // stuff.result. loop


} //displat widget preive


function farmlet(sfa) {

    var fa = el('p').inn(sfa.name + "(" + sfa.state_code + ")").prop('onmousedown', function() {
        console.log("thisisfarm" + JSON.stringify(sfa));
        if (sfa.website) window.open(sfa.website);

    });

    return fa;
} //farmlet

function setcolor(value, font) {
    var wproud = get("wproud");

    var wordsdiv = get("wordsdiv");
    var longdiv = get("longdiv");

    longdiv.stprop("fontFamily", font);

    wordsdiv.stprop("fontFamily", font);


    var mcl = get("mcl");
    var scl = get("scl");
    var pcl = get("pcl");
    var dcl = get("dcl");

    longdiv.stprop('color', value);
    wordsdiv.stprop('color', value);
    wproud.stprop('color', value);
    mcl.stprop('color', value);
    pcl.stprop('color', value);
    scl.stprop('color', value);
    dcl.stprop('color', value);

} //setcolor


function stylebyback(back) {
    var condiv = get("condiv");
    var longdiv = get("longdiv");
    longdiv.stprop('top', 40 + "px");
    longdiv.stprop('left', 0 + "px");
    setcolor("black", "initial");


    get("fader").stprop('opacity', .4);
    condiv.stprop('height', 580 + "px");
    condiv.stprop('top', 40 + "px");


    //var backstring ="url(\"business/images/"+back+".png\")";
    //get("backdiv").stprop('backgroundImage',backstring);

    var mcl = get("mcl");
    var scl = get("scl");
    var pcl = get("pcl");
    var dcl = get("dcl");
    console.log(back + "this is bacl")
    if (back === "wheel" || back === "trans" || back === "cafe" || back === "chalk") {

        get("fader").stprop('opacity', 0);

    }


    if (back === "wheel") {

        setcolor("white", "'Cabin'");
        condiv.stprop('height', 375 + "px");
        condiv.stprop('top', 40 + "px");

        longdiv.stprop('top', 160 + "px");
        longdiv.stprop('left', 125 + "px");

    }


    if (back === "cafe") {

        setcolor("#663333", "'Poiret One', cursive");
        condiv.stprop('height', 375 + "px");
        condiv.stprop('top', 170 + "px");

        longdiv.stprop('top', 170 + "px");


    }


    if (back === "chalk") {

        setcolor("white", "'Shadows Into Light Two', cursive");
        condiv.stprop('height', 435 + "px");
        condiv.stprop('top', 60 + "px");
        longdiv.stprop('top', 60 + "px");

    }

} // style back


function loadwidgpage() {


    var urlstring = window.location.href;

    var ish = urlish(urlstring);

    var pac = grabids(ish.search);

    showfarms(pac);

} //loadwidgpage


function showfarms(pac) {

    var grabstring = ShowFarmsUrl + "/" + pac.uid + "/" + pac.bid;

    grabstuff(grabstring, function(stuff) {

        displaywidgpreview(stuff);

        for (var i = 0; i < widgets.length; i++) {
            var wi = widgets[i];

            if (wi.short === pac.pic) {

                setpreback(wi);

            }

        };


    });

} //showfarms for widget


function grabids(search) {
    var pac = {};

    var sr = search.substring(1);

    var varis = sr.split('/');
    /*
    var ust = search.indexOf('?')+1;

    var uen = search.indexOf('/');

    var bst = uen +1;

    var ben = search.length;
    */
    pac.uid = varis[0];

    pac.bid = varis[1];

    pac.pic = varis[2];


    return pac;
} //grabids

function splitslash(sr) {

    sr = sr.substring(1);

    var varis = sr.split('/');

    return varis;
}

function urlish(url) {
    //url = "http://business.greenease.co/wid?thisisseth";
    var parser = document.createElement('a');
    parser.href = url;

    parser.protocol; // => "http:"
    parser.hostname; // => "example.com"
    parser.port; // => "3000"
    parser.pathname; // => "/pathname/"
    parser.search; // => "?search=test"
    parser.hash; // => "#hash"
    parser.host; // => "example.com:3000"

    return parser;
}
