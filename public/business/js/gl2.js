var HTTPS_QUERYSTRING = "&https=1";
var PARSE_BASE_URL = "https://api.parse.com/1/";
var PARSE_APP_ID_KEY = "X-Parse-Application-Id";
var PARSE_APP_ID_VALUE = "l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA";
var PARSE_REST_API_KEY = "X-Parse-REST-API-Key";
var PARSE_REST_API_VALUE = "g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H";
var PARSE_SESSION_TOKEN_KEY = "X-Parse-Session-Token";
var GetBizByNameUrl = "/bizsearch";
var loginUrl = "/getlogin";
var GetFaByNameUrl = "/fasearch";
var savebusinessurl = "/newbiz";
var linkbusinessurl = "/newuserbusiness";
var unlinkbusinessurl = "/unlinkuserbusiness";
var getlinkedbybid = "/getlinkedbybid";

var getbibyIdUrl = '/getbibyId';
var crmsearchurl = "/crmuforemail";
var getlinkedurl = "/getlinked";
var GetfaByNameUrl = "/getfabyname";
var EditFarmUrl = "/editfarm";
var getbizfarmsurl = "/getFarms";
var getPurchaseHistoryRecsUrl = "/purhis2";
var SendFarmUpdateUrl = "/sendfaupdate";
var createPurHistRecUrl = "/newphrecs2";
var ShowFarmsUrl = "/showFarms";
var widgtextUrl = "/getwidgetlink";

var sendreqacemailUrl = "/sendRequestAccessEmail";

var sendforgotemailUrl = "/biForgot";
var deleteSpecialUrl = "/deleteSpecial"
var sendsignupUrl = "/usersignup";
var logoutUrl = "functions/logout";
var buserfarmsugUrl = "functions/sendAdminEmail";
var ckforuserurl = "/ckforUser";
var toggleprivateUrl = "/setfarmvis";
var getbisugurl = "/getbisugs";
var setbisugtoverifiedurl = "/setbisugtoverified";
var sendSpecialUrl = "/specialMachine";
var removebisugtourl = "/removebisug";
var getSpecialsByBid = "/getSpecialsByBid";

var getspActionsUrl = "/spactions"

var getSpecialsUrl = "/specials"

var MOCKGEO = false;

// var placesUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + bio.place_id + '&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo';

var BigCal = null;
buysfromlist = null;

var PARSE_curSESSION_TOKEN = null;

var dayray = [
    { 'name': 'Sunday', 'short': 'Sun' },
    { 'name': 'Monday', 'short': 'Mon' },
    { 'name': 'Tuesday', 'short': 'Tue' },
    { 'name': 'Wednesday', 'short': 'Wed' },
    { 'name': 'Thursday', 'short': 'Thu' },
    { 'name': 'Friday', 'short': 'Fri' },
    { 'name': 'Saturday', 'short': 'Sat' },
];

var gcats = [

    {

        'name': 'Free Range',
        'imgoff': 'freerange@2x.png',
        'imgon': 'freerange_highlighted@2x.png',
        'qstring': { "name": "free_range" }
    },

    {

        'name': 'Gluten Free',
        'imgoff': 'glutenfree@2x.png',
        'imgon': 'glutenfree_highlighted@2x.png',
        'qstring': { "name": "gf" }
    },

    {

        'name': 'Grass Fed',
        'imgoff': 'grassfed@2x.png',
        'imgon': 'grassfed_highlighted@2x.png',
        'qstring': { "name": "grass_fed" }
    },

    {

        'name': 'Local',
        'imgoff': 'local@2x.png',
        'imgon': 'local_highlighted@2x.png',
        'qstring': { "name": "local" }
    },

    {

        'name': 'Drug Free Meats',
        'imgoff': 'hormonefree@2x.png',
        'imgon': 'hormonefree_highlighted@2X.png',
        'qstring': { "name": "drug_free" }
    },

    {

        'name': 'Organic',
        'imgoff': 'organic@2x.png',
        'imgon': 'organic_highlighted@2x.png',
        'qstring': { "name": "organic" }
    },

    {

        'name': 'Sustainable Seafood',
        'imgoff': 'seafood@2x.png',
        'imgon': 'seafood_highlighted@2x.png',
        'qstring': { "name": "sustainable_seafood" }
    },

    {

        'name': 'Veg Friendly',
        'imgoff': 'vegfriendly_@2x.png',
        'imgon': 'vegfriendly_highlighted_@2x.png',
        'qstring': { "name": "veg" }
    },

    {

        'name': 'Vegan Friendly',
        'imgoff': 'vegan_@2x.png',
        'imgon': 'vegan_highlighted_@2x.png',
        'qstring': { "name": "vegan" }
    }

];

function touchout() {

    get('bizultscon').stprop('display', 'none').inn("");
    get('adbizultscon').stprop('display', 'none').inn("");
    get('fazultscon').stprop('display', 'none').inn("");
    get('adfazultscon').stprop('display', 'none').inn("");
    get('uzultscon').stprop('display', 'none').inn("");

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function gl2go() {

    var urlstring = window.location.href;
    var ish = urlish(urlstring);

    var pac = splitslash(ish.search);

    if (pac.length === 2 && pac[0] === "signup" && pac[1].length > 0) {

        var email = pac[1];

        hidelodiv();

        Showsignup(email);

        //cleans the url, less confusing for user 
        window.history.pushState({ "clean": "up" }, "Title", "/");

    } else {

        if (getCookie('user') != null) {

            user = JSON.parse(getCookie('user'));

            if (user) {

                id = user._id;

                var urlstring = "/ckses" + "/" + id;

                console.log(urlstring);

                grabstuff(urlstring, function(stuff) {

                    console.log("this is stuff at ses login" + JSON.stringify(stuff));

                    loginwithuser(stuff);

                });


            } //if user

        } // if cookie

    }

} //gl2go


function setbigcal(cal) {

    BigCal = cal;

}

function readyviews(user) {

    setwidgetpktab();

} //readyviews

function showadminviews(user) {
    var adiv = get('adiv').stprop('display', 'block');
    var adbt = get('adminbutton').stprop('display', 'block');

}


function getuserws(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 

    xmlhttp.open("GET", url, true);

    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');

    xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');

    var data = {};

    xmlhttp.send(data);
} //grabstuff


function getwithkeys(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 

    xmlhttp.open("GET", url, true);

    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.send();
} //grabstuff


function postwithkeys(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 

    xmlhttp.open("POST", url, true);

    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');

    xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');

    xmlhttp.send(extra);
} //grabstuff


function grabwithtest(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 


    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');
    // xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');
    xmlhttp.setRequestHeader('X-Parse-Session-Token', getsestoken());

    console.log('new');

    xmlhttp.send();
} //grabstuff

function postwithtest(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 

    xmlhttp.open("POST", url, true);

    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');

    xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');

    xmlhttp.setRequestHeader('X-Parse-Session-Token', getsestoken());

    xmlhttp.send();
} //postwithtest

function getsestoken() {

    user = JSON.parse(getCookie('user'));

    var ses = user.sessionToken;

    id = user._id;
    return ses;
} //getsestoken 

function grabtext(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {


                var back = xmlhttp.responseText;

                callback(back, extra);

            } // ready state = 4
        } //on ready state 


    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');
    // xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');

    xmlhttp.send();
} //grabstuff

function grabstuff(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 


    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');
    // xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');
    //xmlhttp.setRequestHeader('X-Parse-Session-Token', getsestoken() );

    console.log('new');

    xmlhttp.send();
} //grabstuff


function newuserbiz(url, callback, extra) {

    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 


    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //xmlhttp.setRequestHeader('X-Parse-Application-Id', 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA');
    // xmlhttp.setRequestHeader('X-Parse-REST-API-Key', 'g2sQMnplDFdrtrZbmxiOZndMn09752hFPBvARQ8H');
    xmlhttp.setRequestHeader('X-Parse-Session-Token', getsestoken());

    console.log('new');

    xmlhttp.send();
} //grabstuff


function poststuff(url, obj, callback, extra) {
    //console.log(url);
    var xmlhttp;
    var txt, x, i;

    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var back = xmlhttp.responseText;
                var nson = JSON.parse(back);
                callback(nson, extra);

            } // ready state = 4
        } //on ready state 

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.send(JSON.stringify(obj));
} //poststuff


function Showsignup(email) {

    var bcent = get("bcent");
    //bcent.inn("");

    var signbox = div();
    signbox.prop("align", "center");

    signbox.prop("id", "signbox");

    var signmsgbox = div();
    signmsgbox.prop("id", "signmsgbox");
    signmsgbox.inn("We are thrilled to have you onboard. Set up your password here.");
    signbox.pend(signmsgbox);

    var signformbox = div();
    signformbox.prop("id", "signformbox");


    var formmsg1 = el("p");
    formmsg1.prop("id", "formmsg1");
    formmsg1.inn("ENTER PASSWORD");
    signformbox.pend(formmsg1);

    var formput1 = el("input");
    formput1.prop("id", "formput1");
    formput1.prop("type", "password").prop('onkeyup', cksignuputs);

    signformbox.pend(formput1);

    var formmsg2 = el("p");
    formmsg2.prop("id", "formmsg2");
    formmsg2.inn("RE-ENTER PASSWORD");
    signformbox.pend(formmsg2);


    var formput2 = el("input");
    formput2.prop("id", "formput2");
    formput2.prop("type", "password").prop('onkeyup', cksignuputs);

    signformbox.pend(formput2);


    var ckdiv = div();
    ckdiv.prop("id", "ckdiv");

    var ckmsg = el("p");
    ckmsg.prop("id", "ckmsg");
    ckmsg.inn("show password:");
    ckdiv.pend(ckmsg);


    var seeck = el("input");
    seeck.prop("type", "checkbox");
    seeck.prop("id", "seeck");
    ckdiv.pend(seeck);

    signformbox.pend(ckdiv);


    var signupbutton = div();
    signupbutton.prop("id", "signupbutton");
    signupbutton.inn("Set Password").prop('onmousedown', function() {

        var pass = get('formput1').value;

        if (passck())

            poststuff(sendsignupUrl, { 'email': email, 'password': pass }, function(stuff) {

            var user = stuff.user;

            if (stuff.user) {
                bcent.removeChild(signbox);

                loginwithuser(user);

            } else {

                if (stuff.msg) alert(stuff.msg);

            }

        }); //post stuff for new user password

    });

    signformbox.pend(signupbutton);

    signbox.pend(signformbox);

    bcent.pend(signbox);

    ///


    /*
    ///  SEE PASSWORD TOGGERLER

    if(seeck.getPropertyBoolean("checked")){
                        get("ckmsg").inn("hide password");

                        formput1.setPropertyString("type", "text");
                        formput2.setPropertyString("type", "text");
                        
                    }else{
                        
                        get("ckmsg").inn("show password");
                    
                        formput1.setPropertyString("type", "password");
                        formput2.setPropertyString("type", "password");
                        
                    }
    */


} //showsignup

function signupuser() {


} //signupuser 


function passck() {
    var ck = true;

    return ck;
}


function to12hourstring(ta) {

    var milnum = parseFloat(ta);

    if (milnum < 100) {
        var hours = ta.substring(1, 2);
        var min = ta.substring(2, 4);
        return "12:" + min + "AM";
    }

    var hours = ta.substring(0, 2);
    if (milnum < 1000) hours = ta.substring(1, 2);

    var min = ta.substring(2, 4);

    if (milnum > 1259) {
        var down = milnum - 1200;

        var ds = JSON.stringify(down);
        var hours = ds.substring(0, 2);
        var min = ds.substring(2, 4);

        if (down < 1000) {
            var ds = JSON.stringify(down);
            var hours = ds.substring(0, 1);
            var min = ds.substring(1, 3);
            return hours + ":" + min + "PM";
        }

        return hours + ":" + min + "PM";
    } // if after noon 


    if (hours === "12") return hours + ":" + min + "PM";
    return hours + ":" + min + "AM";
}


function to12test() {
    var tstrs = [];

    for (var i = 0; i < 24; i++) {

        //console.log("i:: "+i);
        var h = i;
        if (i < 10) h = "0" + i;
        var min1 = "00";
        var min2 = "30";
        var min3 = "45";
        var min4 = "50";

        console.log("min1  :: " + h + min1);

        console.log(" !!!!@ 12 HOUR ::::::::::::::::::::::::::::::: " + to12hourstring(h + min1));

        console.log("min.5  :: " + h + "05");

        console.log(" !!!!@ 12 HOUR ::::::::::::::::::::::::::::::: " + to12hourstring(h + "05"));

        console.log("min2  :: " + h + min2);

        console.log(" !!!!@ 12 HOUR ::::::::::::::::::::::::::::::: " + to12hourstring(h + min2));

        console.log("min3  :: " + h + min3);

        console.log(" !!!!@ 12 HOUR ::::::::::::::::::::::::::::::: " + to12hourstring(h + min3));

        console.log("min4  :: " + h + min4);

        console.log(" !!!!@ 12 HOUR ::::::::::::::::::::::::::::::: " + to12hourstring(h + min4));

    };

} //to 12 test

function readurl(sr) {

    var pac = {};

    var sr = search.substring(1);

    var varis = sr.split('/');


    return pac;
} //read

function cksignuputs(e) {

    var kc = e.keyCode;

} //cksignuputs


var getgeo = function(calli) {

        var short = function() {
                //27.771052,-82.63618300000002
                var lat1 = 38.9192931; //38.9091421080001; //38.9141319; //40.7295174;//38.9051486;
                var lng1 = -77.0372175;//-77.0283826239999; // -77.0371799; //-74.0314798;// -76.9995255;

                var mpos = {
                    lat: lat1,
                    lng: lng1
                };
                console.log('fake geo');
                return mpos;

            } //short

        if (MOCKGEO) {



            calli(short());
            return;

        }
        if (navigator) {

            navigator.geolocation.getCurrentPosition(function(pos) {
                    console.log('real geo');


                    var mpos = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };


                    console.log('real geo' + JSON.stringify(pos));
                    calli(mpos);

                },
                function(error) {

                      calli(short());

                }, { enableHighAccuracy: true, timeout: 15000 })

        } else {

            var lat1 = 38.9051486;
            var lng1 = -76.9995255;

            var mpos = {
                lat: lat1,
                lng: lng1
            };
            console.log('fake geo');

            calli(mpos);

        }

    } //getgeo

/*
function urlish(url){
//url = "http://business.greenease.co/wid?thisisseth";
var parser = document.createElement('a');
parser.href = url;

parser.protocol; // => "http:"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.search;   // => "?search=test"
parser.hash;     // => "#hash"
parser.host;     // => "example.com:3000"

return parser;
}//urlish


*/
