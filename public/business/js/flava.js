function flava(dio) {
    if (dio == null) return null;

    dio.cl = function(clas) {
        dio.className = clas;
        return dio;
    };

    dio.inn = function(word) {
        dio.innerHTML = word;
        return dio;
    };


    dio.pend = function(elt, key) {

        dio.appendChild(elt);

        dio[key] = elt;

        return dio;
    };


    dio.sh = function(h) {
        dio.style.height = h;
        return dio;
    };


    dio.sw = function(w) {
        dio.style.width = w;
        return dio;
    };


    dio.bc = function(word) {
        dio.style.backgroundColor = word;
        return dio;
    };


    dio.prop = function(name, obj) {
        dio[name] = obj;
        return dio;
    };

    dio.stprop = function(name, obj) {
        dio.style[name] = obj;
        return dio;
    };

    dio.pendprop = function(key, el) {
            dio.appendChild(el);
            dio[key] = el;
            return dio;
        } ////

    dio.pendif = function(con, el) {
        if (con) dio.appendChild(el);
        return dio;
    }

    dio.stProps = function(propsObj) {

        var keys = Object.keys(propsObj);

        for (var i = 0; i < keys.length; i++) {

            dio.style[keys[i]] = propsObj[keys[i]];

        }

        return dio;
    }

    dio.props = function(propsObj) {

        var keys = Object.keys(propsObj);

        for (var i = 0; i < keys.length; i++) {

            dio[keys[i]] = propsObj[keys[i]];

        }

        return dio;
    }

    dio.pendray = function(ray, el, key) {

        for (var i = 0; i < ray.length; i++) {

            dio.appendChild(el(ray[i], i, ray));

        }; // ray lopp

        dio[key] = ray;

        return dio;
    };

    dio.clear0 = function() {

        while (dio.hasChildNodes()) {

            dio.removeChild(dio.lastChild);

        }
        return dio;
    };


    dio.wait = function(msg) {

        setTimeout(function() {

            msg.boom({ dio: dio })

            // body...
        }, msg.wait)


        return dio;
    };


    dio.Adrop = function(name, func) {
        // var rep = func.toString()
        //var depNameRay = rep.subString( rep.indexOf('(') , rep.indexOf(')') ).split(',')
        dio.regDrop({
            id: name,
            drop: function(res) {
                var deps = [res, dio]
                func.apply(dio, deps);
            }
        })
        return dio;
    }


    dio.regDrop = function(dropObj) {
        dio.drops[dropObj.id] = dropObj.drop;
        return dio;
    }

    dio.async = function(config) {

            var method = config.post ? 'POST' : 'GET';

            var url = config.post || config.get || config.url;

            // console.log(method+" :  at async :  "+url)

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

                        if (config.drop) config.drop(nson, dio);

                    } // ready state = 4
                } //on ready state 

            xmlhttp.open(method, url, true);

            if (config.headers) {

                var keys = Object.keys(headers);

                for (var i = 0; i < keys.length; i++) {

                    xmlhttp.setRequestHeader(keys[i], headers[keys[i]]);
                }

            }

            xmlhttp.send(config.body);

            return dio;
        } //async


    return dio.props({
        drops: {}
    });


} ////flava

function div() {
    return flava(document.createElement('div'));
} ////div

function get(id) {

    // if (document.getElementById(id)) 
    //console.log('id :: ' + id + 'not found refernce dumb div');

    return flava(document.getElementById(id)); //;document.getElementById(id)

} ////get


function el(tag) {
    return flava(document.createElement(tag));
} ///el
