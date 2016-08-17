var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var bodyParser = require('body-parser')
var fs = require('fs');
var Mongo = require('mongodb'),
    assert = require('assert');
var MongoClient = Mongo.MongoClient;
var ObjectId = require('mongodb').ObjectID;
var path = require('path');
var grid = require('gridfs-stream');
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.OPENSHIFT_INTERNAL_PORT || 8000;
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');


var querystring = require('querystring');
var _ = require('underscore');
var Buffer = require('buffer').Buffer;


var geolib = require('geolib');

var Codebird = require('./cloud/module-codebird').Codebird;
var cb = new Codebird();
var request = require("request");
var saltRounds = 10;


var nodemailer = require('nodemailer');

var mountPath = '/parse';

var url = 'http://' + ip + ':' + port + '' + mountPath;

//var relLink = "http://localhost:8000/"

var relLink = "https://gflex-greenease.rhcloud.com/"

var widgPageUrl = relLink + "widgPage";


var Signupurl = relLink + "?signup";

var databaseUri = 'mongodb://127.0.0.1:27017/newgreen';
//db.auth('admin','SLIQk4Kja2Tn');


//var databaseUri = 'mongodb://127.0.0.1:27017/gflex';

//var databaseUri = 'mongodb://127.4.226.2:27017/gflex';
if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var mongogetdb = function(calli) {
    // Use connect method to connect to the Server
    MongoClient.connect(databaseUri, function(err, db) {
        if (err) throw err;
        //console.log("Connected correctly to server");

        calli(db); //insert method

    }); //mongo connect

};


var updateDocumentbyid = function(db, table, id, set, callback) {
    // Get the documents collection
    var collection = db.collection(table);
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id: new ObjectId(id) }

        , { $set: set },

        function(err, result) {

            callback(result, err);

        });
}

var mongoMsg = function(calli) {
    // Use connect method to connect to the Server
    MongoClient.connect(databaseUri, function(err, db) {
        if (err) throw err;
        //console.log("Connected correctly to server");

        calli({ db: db, err: err, warns: [] }); //insert method

    }); //mongo connect


};

var sertobj = function(table, obj, callback) {

        return function(msg) {

            // Get the documents collection
            var collection = msg.db.collection(table);

            collection.save(obj, function(err, result) {

                msg.result = result;

                msg.err = err;

                callback(msg);

                //msg.db.close();
            });

        }

    } //sertobj


var api = new ParseServer({
    databaseURI: databaseUri,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA',
    masterKey: process.env.MASTER_KEY || 'TZCDDLCIFnLySuwOidkAgsaHF5VoXC6g0yrnQTtu', //Add your master key here. Keep it secret!
    serverURL: url // Don't forget to change to https if needed
});


// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
//app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes


var getby = function(table, terms, ops, calli) {

        return function(msg) {

            msg.db.collection(table).find(terms).toArray(function(err, docs) {

                msg.docs = docs;

                msg.err = err;

                calli(msg);

            });


        }

    } //getby


var removeby = function(table, terms, ops, calli) {

        return function(msg) {

            msg.db.collection(table).deleteMany(terms, function(err, docs) {

                msg.docs = docs;

                msg.err = err;

                calli(msg);

            });


        }

    } //getby


var getbySort = function(table, terms, ops, sort, calli) {

        return function(msg) {

            msg.db.collection(table).find(terms).sort(sort).toArray(function(err, docs) {

                msg.docs = docs;

                msg.err = err;

                calli(msg);

            });


        }

    } //getby


var findby = function(db, table, terms, ops, calli) {

        db.collection(table).find(terms).toArray(function(err, docs) {

            calli(docs, err);

        });

    } //getby


var updatebyid = function(db, table, id, set, call) {
        // Get the documents collection

        return function(msg) {
                var collection = db.collection(table);
                // Update document where a is 2, set b equal to 1
                collection.updateOne({ _id: new ObjectId(id) }

                    , { $set: set },
                    function(err, result) {

                        msg.result;
                        msg.err = err;

                        calli(msg);

                    });

            } // return funtion

    } // update By id


var sense = function(table, terms, ops, calli) {

        return function(msg) {

            msg.db.collection(table).find(terms).sort({ 'business': 1 }).limit(1).toArray(function(err, docs) {

                msg.docs = docs;

                msg.err = err;

                calli(msg);

            });


        }

    } //getby


app.get('/mailtest/:toemail', function(req, res) {

    var toemail = req.params.toemail
        // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

    // setup e-mail data with unicode symbols

    var mailOptions = {
        from: '" Greenease " <info@greenease.co>', // sender address
        to: toemail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b>' + '<p style = "color:red" >lets get it</p>' + '<a href="http://www.w3schools.com/html/">Visit our HTML tutorial</a>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.send(error);

            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        res.send(info);

    });

});


app.get('/flight', function(req, res) {


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send("");


});


app.get('/side/:terms', function(req, res) {

    console.log(req.param('terms'));

    var rterms = JSON.parse(req.param('terms'));

    var terms = {}

    if (rterms.last) {

        console.log(rterms.last);

        terms = { business: { $gt: rterms.last } }

    }

    mongoMsg(sense("Business", terms, {}, function(msg) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(msg.docs));

    }));

});


app.get('/MigrateFixpurhis', function(req, res) {

    var terms = {};

    mongoMsg(function(msg) {

        var findnfix = function(purhis) {

                // var buys = msg.docs[i];

                var farm = purhis.farm;
                var biz = purhis.business;
                // console.log( "" ); 
                // console.log( biz.objectId+"  and  "+farm.objectId  ); 
                // msg.rpt = {
                var start = {
                        buysid: purhis._id,
                        bizid: biz.objectId,
                        farmid: farm.objectId
                    }
                    //}
                var bizterms = {

                    objectId: biz.objectId

                }

                var farmterms = {

                    objectId: farm.objectId

                }

                findby(msg.db, 'Business', bizterms, {}, function(docs, err) {

                        var bi = docs[0];

                        if (bi) {
                            bi_id = bi._id.valueOf() + '';
                            console.log("at bi farm id" + bi_id)
                            purhis.business._id = bi_id;
                        }

                        findby(msg.db, 'Farm', farmterms, {}, function(docs, err) {
                                var farm = docs[0];
                                if (farm) {
                                    fa_id = farm._id.valueOf() + "";
                                    console.log("at flat farm id" + bi_id)

                                    purhis.farm._id = fa_id;

                                    console.log(JSON.stringify(purhis))

                                }
                                var id = purhis._id
                                delete purhis._id;
                                updateDocumentbyid(msg.db, 'PurchaseHistory', id, purhis, function(result, err) {
                                    /*
                                        console.log("")
                                        console.log( JSON.stringify(start) );
                                        console.log("")
                                       if(farm) fa_id= farm._id.valueOf();
                                        if(bi) console.log(bi.business+"  :: "+bi.objectId+"  ::22 "+bi_id )
                                        console.log("")
                                        if(farm) console.log(farm.name+"  :: "+farm.objectId+"  :22: "+fa_id )
                                        console.log("")
                                         //console.log(result)
                                    */
                                });

                            }) // farm quiery
                    }) //bussiness query

            } //findnfix

        findby(msg.db, 'PurchaseHistory', {}, {}, function(docs, err) {

                console.log(docs.length + "all docs length");
                //console.log(msg.docs +"all docs");

                for (var i = 0; i < docs.length; i++) {

                    //var str = JSON.stringify( msg.docs[ i ] );
                    findnfix(docs[i])

                }; // buys loop

                senddone({

                    l: docs.length

                });

            }) // buysfrom query
    });

    var senddone = function(obj) {

        res.status(200).send(obj);

    }

});


app.get('/MigrateUpdateGeoHoods', function(req, res) {

        mongoMsg(getby('neighborhood', { geo: { $exists: true } }, {}, function(msg) {

            //console.log(msg.docs)

            neighborhood = msg.docs

            console.log(neighborhood.length + " :: find buys length");
            count = 0;
            neighborhood.forEach(function(hood) {

                    hood.geoPoint = { type: "Point", coordinates: [hood.geo.longitude, hood.geo.latitude] }

                    delete hood.geo;

                    var id = hood._id;

                    delete hood._id;

                    //console.log(hood);
                    console.log((id + "").length);

                    if ((id + "").length > 15) {

                        updateDocumentbyid(msg.db, 'neighborhood', id, hood, function(res, err) {

                            count++;

                            if (err) console.log(err)

                            console.log(JSON.stringify(res) + 'should be ', count + '   vs ' + neighborhood.length);

                        })

                    }

                }) //neighborhood foreach

        })); // getby

    }) //


app.get('/MigrateUpdateGeoBusiness', function(req, res) {

        mongoMsg(getby('Business', { geo: { $exists: true } }, {}, function(msg) {

            //console.log(msg.docs)

            Business = msg.docs

            console.log(Business.length + " :: find buys length");
            count = 0;
            Business.forEach(function(bi) {

                    bi.geoPoint = { type: "Point", coordinates: [bi.geo.longitude, bi.geo.latitude] }

                    delete bi.geo;

                    var id = bi._id;

                    delete bi._id;

                    //console.log(bi);
                    console.log((id + "").length);

                    if ((id + "").length > 15) {

                        updateDocumentbyid(msg.db, 'Business', id, bi, function(res, err) {

                            count++;

                            if (err) console.log(err)

                            console.log(JSON.stringify(res) + 'should be ', count + '   vs ' + Business.length);

                        })

                    }

                }) //Business foreach

        })); // getby


    }) //


app.get('/MigrateFixBuysFrom', function(req, res) {

    var terms = {};

    mongoMsg(function(msg) {

        var findnfix = function(buys) {

                // var buys = msg.docs[i];

                var farm = buys.farm;
                var biz = buys.business;
                // console.log( "" ); 
                // console.log( biz.objectId+"  and  "+farm.objectId  ); 
                // msg.rpt = {
                var start = {
                        buysid: buys._id,
                        bizid: biz.objectId,
                        farmid: farm.objectId
                    }
                    //}
                var bizterms = {

                    objectId: biz.objectId

                }

                var farmterms = {

                    objectId: farm.objectId

                }

                findby(msg.db, 'Business', bizterms, {}, function(docs, err) {
                        var bi = docs[0];
                        if (bi) {
                            bi_id = bi._id.valueOf() + '';
                            console.log("at bi farm id" + bi_id)
                            buys.business._id = bi_id;
                        }

                        findby(msg.db, 'Farm', farmterms, {}, function(docs, err) {
                                var farm = docs[0];
                                if (farm) {
                                    fa_id = farm._id.valueOf() + "";
                                    console.log("at flat farm id" + bi_id)

                                    buys.farm._id = fa_id;

                                    console.log(JSON.stringify(buys))

                                }
                                var id = buys._id
                                delete buys._id;
                                updateDocumentbyid(msg.db, 'BuysFrom', id, buys, function(result, err) {
                                    /*
                                                                        console.log("")

                                                                        console.log( JSON.stringify(start) );
                                                                        console.log("")
                                                                       if(farm) fa_id= farm._id.valueOf();




                                                                        if(bi) console.log(bi.business+"  :: "+bi.objectId+"  ::22 "+bi_id )
                                                                        console.log("")

                                                                        if(farm) console.log(farm.name+"  :: "+farm.objectId+"  :22: "+fa_id )
                                                                        console.log("")

                                                                        //console.log(result)
                                    */
                                });

                            }) // farm quiery
                    }) //bussiness query

            } //findnfix

        findby(msg.db, 'BuysFrom', {}, {}, function(docs, err) {

                console.log(docs.length + "all docs length");
                //console.log(msg.docs +"all docs");

                for (var i = 0; i < docs.length; i++) {

                    //var str = JSON.stringify( msg.docs[ i ] );
                    findnfix(docs[i])

                }; // buys loop

                senddone({

                    l: docs.length

                });

            }) // buysfrom query
    });

    var senddone = function(obj) {

        res.status(200).send(obj);

    }


});


app.get('/', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fs.readFileSync('./index.html'));
});


app.get('/gtwit', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fs.readFileSync('./gtwit.html'));

});


app.get('/f2', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fs.readFileSync('./f2.html'));
});

app.get('/appPasswordReset', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fs.readFileSync('./appForgot.html'));
});


app.get('/biPasswordReset', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fs.readFileSync('./biFogot.html'));
});


app.post('/newMobileUser', function(req, res) {

        console.log(req)

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        console.log("next:" + JSON.stringify(req.body));


        query = {
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        }


        mongoMsg(getby('mobileUsers', query, {}, function(msg) {

            console.log(msg.docs.length)

            if (msg.docs.length == 0) {

                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

                    user = {
                        username: req.body.username,
                        createdAt: new Date().getTime(),
                        email: req.body.email,
                        bcryptPassword: hash
                    }
                    console.log(user)
                    sertobj('mobileUsers', user, function(msg) {
                        console.log('sertrespone');

                        console.log(msg);

                        //res.setHeader('Content-Type', 'text/html');
                        // res.redirect('/appPasswordReset');

                        var newuser = msg.result.ops[0];

                        if (newuser.bcryptPassword) {

                            newuser.bcryptPassword = null;
                            delete newuser.bcryptPassword
                        }
                        res.json({ msg: 'user added ', user: newuser })

                    })(msg)

                });

            } else {

                res.json({ msg: 'email or username already in system' })

            }

        }))
    }) ///password_reset

app.post('/appPassword_reset', function(req, res) {

        console.log("next:" + JSON.stringify(req.body));

        query = {
            PasswordResetToken: req.body.token
        }

        mongoMsg(getby('mobileUsers', query, {}, function(msg) {

            if (msg.docs.length > 0) {

                user = msg.docs[0];

                bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {


                    user.PasswordResetToken = null;
                    delete user.PasswordResetToken

                    user.bcryptPassword = hash

                    sertobj('mobileUsers', user, function(msg) {

                        console.log(msg);

                        res.setHeader('Content-Type', 'text/html');
                        res.redirect('/appPasswordReset');
                    })(msg)

                });

            } else {

                res.json({ msg: 'invalid token ' })
            }

        }))
    }) ///password_reset


app.get('/appForgot/:email', function(req, res) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        var email = req.params.email;

        mongoMsg(getby('mobileUsers', { email: email }, {}, function(msg) {

            if (msg.docs.length > 0) {

                user = msg.docs[0];

                user.PasswordResetToken = randtoken.generate(16);

                sertobj('mobileUsers', user, function(msg) {

                    // console.log('sert token  forgot', msg.result)

                    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

                    // setup e-mail data with unicode symbol

                    resetEmailLink = relLink + 'appPasswordReset?token=' + user.PasswordResetToken + '&username=' + user.username

                    var forgotEmailText = 'click here to reset password \n' + resetEmailLink;

                    var mailOptions = {
                        from: '" Greenease " <info@greenease.co>', // sender address
                        to: email, // list of receivers
                        subject: 'Greenease Password Reset', // Subject line
                        text: forgotEmailText, // plaintext body

                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            res.json(error);

                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);

                        if (info.rejected.length == 0) {

                            res.json({ info: info, msg: 'Email sent to ' + email });

                        }

                    });

                })(msg)

            } else {

                res.json({ msg: 'Email Not Found in our system ' });

            }

        }))

    }) //appforgot


var inmany = function(colname, ray, calli) {

        return function(db) {

                var col = db.collection(colname);

                col.insertMany(ray, function(err, r) {

                    if (err) console.log(err);

                    console.log(r);

                    calli(r);

                }); // collection insert

            } // ret

    } //in   many



app.get('/readngoMobileData', function(req, res) {

    fs.readdir('./mobileGdata', function(err, files) {

        res.setHeader('Content-Type', 'text/html');

        MongoClient.connect(databaseUri, function(err, db) {

            console.log(files, 'files')

            if (err) console.log(err);
            for (var i = 0; i < files.length; i++) {

                if(files[i].indexOf('DS') ==-1 ){

                console.log(files[i], 'files')

                var data = JSON.parse(fs.readFileSync('./mobileGdata/' + files[i], "utf8"));

                console.log(JSON.stringify(data.results[0]));
                var name = files[i].replace('.json', '');
                console.log('');
                console.log(name);
                console.log('');
                var sertray = data.results;
                var col = db.collection(name);

                inmany(col, sertray);

}

            }; // files loop

            res.send(files);

            if (err) res.send(err);

        });

        var inmany = function(col, ray) {

                col.insertMany(ray, function(err, r) {

                    if (err) console.log(err);
                    console.log(r);

                }); // collection insert

            } //in   many

    }); // FS FILE READ

}); //readngoo

app.get('/MigrateMobileFavorites', function(req, res) {

    mongoMsg(getby('GEUserFavorites', {}, {}, function(msg) {
        var favsle = msg.docs.length;
        count = 0;
        msg.docs.forEach(function(GEfav) {

            var rid = GEfav.favorite.objectId;

            var uid = GEfav.user.objectId;

            var fid = GEfav._id;

            /* {
                 "_id": ObjectId("578458de830d33b7017ef39a"),
                 "bid": "FpR7tRCkQ3",
                 "biname": "Teaism",
                 "createdAt": "2016-01-12T22:48:45.142Z",
                 "uid": "HecRr5Uc88",
             }*/


            getby('Business', { mobileAppObjectId: rid }, {}, function(msg) {
                if (msg.docs && msg.docs.length > 0) {
                    GEfav.bid = msg.docs[0]._id.valueOf() + "";

                    GEfav.biname = msg.docs[0].business;

                    getby('mobileUsers', { objectId: uid }, {}, function(msg) {

                        GEfav.uid = msg.docs[0]._id.valueOf() + "";
                        console.log(GEfav.U_id)

                        sertobj("userfavs", {
                            uid: GEfav.uid,
                            bid: GEfav.bid,
                            biname: GEfav.biname
                        }, function(msg) {
                            console.log(msg.result)

                            count++;
                            console.log(favsle + '  ' + count)

                        })(msg)

                    })(msg)
                } //{ mobileAppObjectId: rid },
            })(msg)

        }); //loop

    })); // getby

    res.json('go');
});

app.get('/MigrateSpecialsAddGeo', function(req, res) {

    mongoMsg(getby('specials', {}, {}, function(msg) {
        var favsle = msg.docs.length;
        count = 0;
        msg.docs.forEach(function(special) {

            var bid = special.bid;

            getby('Business', { _id: new ObjectId(bid) }, {}, function(msg) {

                if (msg.docs && msg.docs.length > 0) {

                    console.log(msg.docs[0])

                    console.log("----------------------------------------------")

                    special.bid = msg.docs[0]._id.valueOf() + "";
                    special.geoPoint = msg.docs[0].geoPoint;

                    var sid = special._id;

                    delete special._id;

                    updateDocumentbyid(msg.db, 'specials', sid, special, function(result, err) {

                        // console.log(result)

                        count++;
                        console.log(favsle + '  ' + count)

                    })

                } //{ mobileAppObjectId: rid },

            })(msg)

        }); //loop

    })); // getby

    res.json('go');
});


app.get('/readngo', function(req, res) {

    fs.readdir('./gdata', function(err, files) {

        res.setHeader('Content-Type', 'text/html');

        MongoClient.connect(databaseUri, function(err, db) {



            if (err) console.log(err);
            for (var i = 0; i < files.length; i++) {


                if(files[i].indexOf('DS') ==-1 ){

                var data = JSON.parse(fs.readFileSync('./gdata/' + files[i], "utf8"));

                console.log(JSON.stringify(data.results[0]));
                var name = files[i].replace('.json', '');
                console.log('');
                console.log(name);
                console.log('');
                var sertray = data.results;
                var col = db.collection(name);

                inmany(col, sertray);
}
            }; // files loop

            res.send(files);

            if (err) res.send(err);

        });

        var inmany = function(col, ray) {

                col.insertMany(ray, function(err, r) {

                    if (err) console.log(err);
                    console.log(r);

                }); // collection insert

            } //in   many

    }); // FS FILE READ

}); //readngoo


/**********************************************************************************************************/


/**
 * GitHub specific details, including application id and secret
 */
var googleClientId = '658863591249-720v0q7hlj8mqc4i3dts1hano2nj39ng.apps.googleusercontent.com';
var googleClientSecret = '0p5XWtDwdBbdDStyZ6gNC56h';

/**
 * Endpoint values from https://developers.google.com/accounts/docs/OpenIDConnect#confirmxsrftoken
 */

var googleRedirectEndpoint = 'https://accounts.google.com/o/oauth2/auth?';
var googleRedirectURI = 'http://greenease-business.parseapp.com/oauthCallback';
var googleValidateEndpoint = 'https://www.googleapis.com/oauth2/v3/token';
var googleUserEndpoint = 'https://www.googleapis.com/plus/v1/people/me';


/**
 * In the Data Browser, set the Class Permissions for these 2 classes to
 *   disallow public access for Get/Find/Create/Update/Delete operations.
 * Only the master key should be able to query or write to these classes.
 */
var TokenRequest = Parse.Object.extend("TokenRequest");
var TokenStorage = Parse.Object.extend("TokenStorage");

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);


/**
 * Main route.
 *
 * When called, render the login.ejs view
 */


app.get('/editfarm/:fa', function(req, res) {

    console.log(req.param('fa'));

    if (req.param('fa').indexOf('<j>') > -1) {
        var find = '<j>';
        var re = new RegExp(find, 'g');

        str = req.param('fa').replace(re, '/');
        console.log(str);

        faob = JSON.parse(str);

    } else {

        faob = JSON.parse(req.param('fa'));
        console.log(req.param('fa'));
    }


    if (faob._id) {

        var idToPlace = faob._id;
        console.log("id", idToPlace)

        mongogetdb(function(db) {

            delete faob._id;

            console.log("id", idToPlace)

            updateDocumentbyid(db, "Farm", idToPlace, faob, function(result, err) {

                console.log("res", JSON.stringify(err));

                faob._id = idToPlace;

                res.json({ 'msg': 'Farm updated ', 'farm': faob }); //

            })

        })

    } else {

        mongoMsg(sertobj("Farm", faob, function(msg) {
            console.log(msg.result)

            res.json({ 'msg': 'Farm updated ', 'farm': msg.result.ops[0] });

        }));

    }
    /*
        nfarm.save(faob, {
            success: function(farm) {
                // Execute any logic that should take place after the object is saved.

                alert('New object created with objectId: ' + farm.id);
                res.json({ 'msg': 'Farm updated ', 'farm': farm });
            },
            error: function(farm, error) {
                res.json({ 'msg': error.message });

                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
        */

}); //get newbiz


app.get('/appface/:fbId/:acc', function(req, res) {
    //TO :::  'https://api.parse.com/1/functions/facefind'

    //var uid = req.params.uid;

    query = {
        'fbId': req.params.fbId
    };

    mongoMsg(getby('mobileUsers', query, {}, function(msg) {

            var results = msg.docs;

            if (results.length > 0) {

                var user = results[0];

                user['fbacc'] = req.params.acc;

                sertobj('mobileUsers', user, function(msg) {

                    svuser = msg.result;

                    res.json(user);

                })(msg)

                console.log('user')


            } else {

                console.log('new user')

                var user = {};

                user["username"] = req.params.fbId;
                user['fbId'] = req.params.fbId;
                user['fbacc'] = req.params.acc;

                // other fields can be set just like with Parse.Object
                sertobj('mobileUsers', user, function(msg) {

                    svuser = msg.result.ops[0];

                    res.json(svuser);

                })(msg)


            }

        })) // find user by fbId

    ///res.json(httpResponse.text);

}); //get newbiz


app.get('/favup', function(req, res) {
    Parse.Cloud.useMasterKey();

    Parse.Cloud.httpRequest({
        url: 'https://api.parse.com/1/functions/favtime',
        method: "POST",
        headers: {
            'X-Parse-Application-Id': 'NPk6q9X5zlhrc8srJvtM2LoNYS8K36G0fUF1eB8W',
            'X-Parse-Master-Key': 'P1Ehr4dkjtpPYflqKxMxMmlT6Metx3NKoB2PuJuS'
        },
        body: {},


    }).then(function(httpResponse) {
        console.log(httpResponse.text);

        var ray = JSON.parse(httpResponse.text).result;

        console.log(ray.length);

        var newray = [];

        var Favs = Parse.Object.extend("userfavs");


        for (var i = 0; i < ray.length; i++) {

            var fa = ray[i];

            var user = fa.user;

            var uid = user.objectId;

            var favor = fa.favorite;

            var fid = favor.objectId;

            console.log(uid + "    fav ray   " + fid);

            var favo = new Favs();

            favo.set('uid', uid);

            favo.set('mid', fid);

            newray.push(favo);


        };

        Favs.saveAll(newray, {
            success: function(hoodob) {
                // Execute any logic that should take place after the object is saved.

                //  alert('New object created with objectId: ' +  hoodob.id);
                res.json(hoodob);
            },
            error: function(hoodob, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });


    }, function(httpResponse) {


        console.error('Request failed with response code ' + httpResponse.status);
    });

}); //get newbiz


/*

app.get('/clearfavs', function ( req, res) {
     Parse.Cloud.useMasterKey();
 var fav = Parse.Object.extend("userfavs");
var query = new Parse.Query( fav );


query.exists('mid');

query.limit(1000);

query.find({
    success:function(results) {
       


for (var i = 0; i < results.length; i++) {
  var favo = results[i];



favo.set('business',null);
favo.set('bid',null);



};


fav.saveAll( results , {
  success: function( hoodob ) {
    // Execute any logic that should take place after the object is saved.
  
    alert('New object created with objectId: ' +  hoodob.id);
  res.json( hoodob );
  },
  error: function( hoodob , error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  }
});




        },error:function(error) {
        console.log(JSON.stringify(error)+"   ::: "+error);
        }
    });

});//get newbiz


*/

app.get('/getcount', function(req, res) {

    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("Business");

    var query = new Parse.Query(biz);

    var stuff = {};

    query.doesNotExist('website');

    query.notEqualTo('vis', 0);
    query.exists('place_id');
    //query.select([ 'ohours' ,'business' ,'place_id','address' ]);

    //query.limit(1);

    //query.count({
    query.count({
        success: function(fcounts) {
            // The fcounts request succeeded. Show the fcounts

            res.json(fcounts);


            // res.send( fcounts.length+""+ JSON.stringify( fcounts ) );


            /*
            biz.saveAll( fcounts , {
                       success: function (relations) {
                           

                           res.json( relations   );



               },//usr biz savall
                       error: function (relation, error) {
                          res.json(relation);

                       }
                 


                   });
            */


            //res.send( fcounts );

        },
        error: function(error) {
            // The request failed
        }
    });


}); //get newbiz

app.get('/ckUserForSpAction/:ckSet', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var ckSet = JSON.parse(req.params.ckSet);

    query = {
        sid: ckSet.sid,
        action: 'press',
        uid: ckSet.uid
    }

    mongoMsg(getby('specialAction', query, {}, function(msg) {

        res.json(msg.docs);

    })); // getby

}); // specialAction

app.get('/specialAction/:spAction', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var spAction = JSON.parse(req.params.spAction);

    mongoMsg(sertobj('specialAction', spAction, function(msg) {

        res.json(msg.result.ops[0]);

    })); // getby

}); // specialAction


var findSpecialById = function(special, callback) {

        var SPEC = Parse.Object.extend("specials");

        var query = new Parse.Query(SPEC);

        var stuff = {};

        query.get(special.id, {
            success: function(res) {
                // The fcounts request succeeded. Show the fcounts

                callback(res);

            },
            error: function(error) {
                // The request failed

                callback(error);

            }
        });

    } // findSpecialById


var saveSpecial = function(special, callback) {

        var SPEC = Parse.Object.extend("specials");

        var stuff = {};

        var specialParseObj = new SPEC();
        console.log('save time')


        specialParseObj.save(special, {

            success: function(res) {
                console.log('res')
                    // The fcounts request succeeded. Show the fcounts

                callback(res);

            },
            error: function(error) {
                // The request failed

                callback(error);

                console.log('erro')

            }
        }); // save

    } // saveSpecial


app.get('/specialMachine/:spec', function(req, res) {

    var special = req.params.spec

    var SPEC = Parse.Object.extend("specials");

    console.log('in mahcine time')


    var stuff = {};


    //query.count({

    saveSpecial(special, function(saveRes) {


        res.json(saveRes);


    }); // save Special


}); //specialMachine

app.get('/getLatestSpecials', function(req, res) {

    /* var query = {
            geoPoint: {
                $near: {
                    $geometry: { type: "Point", coordinates: [mpos.lng, mpos.lat] },
                    $maxDistance: (1609.34) * 10
                }
            }
        }*/

    query = {


    };

    // query.descending('updatedAt');

    mongoMsg(getbySort('specials', {}, {}, { updatedAt: 1 }, function(msg) {

        res.json(msg.docs);

    }));

});

app.get('/getbibyId/:id', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    console.log('id :: ' + req.params.id)

    mongoMsg(getby('Business', {}, {}, function(msg) {

        res.json(msg.docs[0]);

    })); // getby

}); //"/getbusiness"


app.get('/getone', function(req, res) {

    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("Business");

    var query = new Parse.Query(biz);

    var stuff = {};

    query.doesNotExist('website');

    query.notEqualTo('vis', 0);
    query.exists('place_id');
    //query.select([ 'ohours' ,'business' ,'place_id','address' ]);

    query.limit(1);

    //query.count({
    query.find({
        success: function(fcounts) {
            // The fcounts request succeeded. Show the fcounts

            res.json(fcounts[0]);


            // res.send( fcounts.length+""+ JSON.stringify( fcounts ) );


            /*
            biz.saveAll( fcounts , {
                       success: function (relations) {
                           

                           res.json( relations   );



               },//usr biz savall
                       error: function (relation, error) {
                          res.json(relation);

                       }
                 


                   });
            */


        },
        error: function(error) {
            // The request failed
        }
    });


}); //get newbiz


app.get('/numi', function(req, res) {
    Parse.Cloud.useMasterKey();

    var Biz = Parse.Object.extend("Business");
    var query = new Parse.Query(Biz);

    query.limit(500);
    query.find({
        success: function(results) {


            console.log(results.length);

            res.json(results[0]);


            Parse.Cloud.httpRequest({
                url: 'https://api.parse.com/1/functions/newmigrate',
                method: "POST",
                headers: {
                    'X-Parse-Application-Id': 'NPk6q9X5zlhrc8srJvtM2LoNYS8K36G0fUF1eB8W',
                    'X-Parse-Master-Key': 'P1Ehr4dkjtpPYflqKxMxMmlT6Metx3NKoB2PuJuS'
                },
                body: JSON.stringify(tjson),
            }).then(function(httpResponse) {
                console.log(httpResponse.text);
            }, function(httpResponse) {
                console.error('Request failed with response code ' + httpResponse.status);
            });

        },
        error: function(error) {
            console.log(JSON.stringify(error) + "   ::: " + error);
        }
    });

}); //get newbiz


app.get('/setone/:fstring', function(req, res) {
    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("Business");

    var upbiz = new biz();
    var fstr = req.params.fstring;
    console.log("at setone:: " + fstr);

    var ob = JSON.parse(fstr);
    console.log("  at setoneafter " + ob.business);

    upbiz.save(ob, {
        success: function(hoodob) {
            // Execute any logic that should take place after the object is saved.

            alert('New object created with objectId: ' + hoodob.id);
            res.json(hoodob);
        },
        error: function(hoodob, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });


}); //get newbiz

app.get('/removebisug/:bio', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var bio = JSON.parse(req.params.bio);

    console.log(bio.objectId + '   bisugonjectid');

    mongoMsg(removeby('bisuggestions', { _id: new ObjectId(bio._id) }, {}, function(msg) {

        console.log(msg.docs)

        fndbuys = msg.docs

        console.log(fndbuys.length + " :: removebisug ");

        res.json(fndbuys);

    })); // removeby

}); // new bi sug


app.get('/getbisugs', function(req, res) {
    Parse.Cloud.useMasterKey();

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    mongoMsg(getby('bisuggestions', { verified: { $ne: true } }, {}, function(msg) {

        console.log(msg.docs)

        fndbuys = msg.docs

        console.log(fndbuys.length + " :: find buys length");

        res.json(fndbuys);

    })); // getby

}); // getbisugs

app.get('/setbisugtoverified/:bio', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var bio = JSON.parse(req.params.bio);

    mongoMsg(getby('bisuggestions', { "_id": new ObjectId(bio._id) }, {}, function(msg) {

        console.log(msg.docs)

        fndbuys = msg.docs

        console.log(fndbuys.length + " :: find buys length");

        if (fndbuys.length > 0) {

            console.log(JSON.stringify(fndbuys[0]) + " :: find buys at hide 1");

            lid = fndbuys[0]._id;
            delete fndbuys[0]._id;

            updateDocumentbyid(msg.db, "bisuggestions", lid, fndbuys[0], function(result, err) {
                fndbuys[0]._id = lid;
                res.json({ ob: fndbuys[0], msg: "Business verified" });

            });

        } else {

            res.json({ "msg": "err sugg not found" });

        }

    })); // getby


    /*

    newbi.save(bio, {
        success: function(hoodob) {
            // Execute any logic that should take place after the object is saved.

            alert('New object created with objectId: ' + hoodob.id);

            var rson = {};

            rson.msg = "Business verified";

            rson.ob = hoodob;

            res.json(rson);
        },
        error: function(hoodob, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });

*/
}); // new bi sug


app.get('/newbisug/:bi', function(req, res) {
    Parse.Cloud.useMasterKey();

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var bisug = Parse.Object.extend("bisuggestions");

    var newbi = new bisug();
    var bi = req.params.bi;

    var bio = JSON.parse(bi);

    mongoMsg(sertobj("bisuggestions", biob, function(msg) {
        console.log(msg.result)

        res.json({
            msg: "thanks for your suggestion",
            ob: msg.result.ops[0]
        });

    }));

}); // new bi sug


app.get('/newbiz/:bi', function(req, res) {
    Parse.Cloud.useMasterKey();
    //
    //

    var biob = JSON.parse(req.param('bi'));


    var Biz = Parse.Object.extend("Business");

    var Business = new Biz();

    biob.hours_json = JSON.stringify(biob.hours_json);
    console.log(biob.geo + " this is geo ");
    var prelo = biob.geo;

    biob.geo = new Parse.GeoPoint(

        { latitude: parseFloat(prelo.lat), longitude: parseFloat(prelo.lng) }

    );


    console.log("biob", JSON.stringify(biob))

    if (biob._id) {

        var idToPlace = biob._id;
        console.log("id", idToPlace)

        mongogetdb(function(db) {

            delete biob._id;

            console.log("id", idToPlace)

            updateDocumentbyid(db, "Business", idToPlace, biob, function(result, err) {


                console.log("res", JSON.stringify(err));

                res.json(result);


            })


        })

    } else {

        mongoMsg(sertobj("Business", biob, function(msg) {
            console.log(msg.result)

            res.json(msg.result.ops[0]);

        }));

    }


    /*

        Business.save(biob, {
            success: function(Business) {
                // Execute any logic that should take place after the object is saved.


                alert('New object created with objectId: ' + Business.id);
              
            },
            error: function(Business, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });


    */


}); //get newbiz


app.get('/apeazzy', function(req, res) {

    res.set('Content-Type', 'text/html');

    res.send(fs.readFileSync('./apeazzy.html'));

});


app.get('/getMobileLogin/:user', function(req, res) {

    var user = JSON.parse(req.param('user'));

    console.log(req.param('user') + "  user  ");

    var getby = function(table, terms, ops, calli) {

            return function(db) {

                db.collection(table).find(terms).toArray(function(err, docs) {

                    calli(docs, err);

                });

            }

        } //getappface


    mongogetdb(

        getby('mobileUsers', { username: user.username }, { bcryptPassword: 0 }, function(docs, err) {

            if (docs.length > 0) {

                bcrypt.compare(user.password, docs[0]['bcryptPassword'], function(err, bres) {

                    if (bres) {

                        delete docs[0].bcryptPassword;

                        res.json({

                            user: docs[0],
                            err: err

                        });

                    } else {

                        res.json({

                            msg: 'wrong password',
                            err: err

                        });

                    }

                });

            } else {

                res.json({

                    msg: 'no user with that username',
                    err: err

                });

            }

        })

    );

}); //getMobileLogin


app.get('/getlogin/:user', function(req, res) {

    var user = JSON.parse(req.param('user'));

    console.log(req.param('user') + "  user  ");

    var getby = function(table, terms, ops, calli) {

            return function(db) {

                db.collection(table).find(terms).toArray(function(err, docs) {

                    calli(docs, err);

                });

            }

        } //getby

    mongogetdb(

        getby('User', { email: user.user }, {}, function(docs, err) {

            if (docs.length > 0) {

                bcrypt.compare(user.password, docs[0]['bcryptPassword'], function(err, bres) {

                    if (bres) {

                        delete docs[0].bcryptPassword;

                        res.json(

                            docs[0]


                        );

                    } else {

                        res.json({

                            msg: 'wrong password',
                            err: err

                        });

                    }

                });

            } else {

                res.json({

                    msg: 'no user with that email',
                    err: err

                });

            }

        })

    );

}); //getlogin


app.get('/exam', function(req, res) {

    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("neighborhood");

    var query = new Parse.Query(biz);

    query.exists('gob');

    query.doesNotExist('typeck');

    query.limit(1000);

    query.find({
        success: function(results) {

            var one = results[0];
            var gob = one.get('gob');
            //geometry
            //neighborhood\",\"political locality
            console.log(gob.types);
            var types = gob.types;

            if (types.indexOf('neighborhood') > -1 || types.indexOf('political') > -1 || types.indexOf('neighborhood') > -1) {

                one.set('typeck', 'good');

            } else {

                one.set('typeck', JSON.stringify(types));

            }

            one.save(null, {
                success: function(hoodob) {
                    // Execute any logic that should take place after the object is saved.

                    alert('New object created with objectId: ' + hoodob.id);
                    res.json(hoodob);
                },
                error: function(hoodob, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });


        },
        error: function(error) {
            console.log(JSON.stringify(error) + "   ::: " + error);
        }
    });


}); //lookforbiz


app.get('/biggeoset', function(req, res) {

    Parse.Cloud.useMasterKey();

    var hoods = Parse.Object.extend("neighborhood");
    var query = new Parse.Query(hoods);

    query.doesNotExist('geo');
    //query.exists('gob');

    query.limit(1000);
    query.find({
        success: function(results) {

            res.json(results);


            /*
            for (var i = 0; i < results.length; i++) {
            var hd =   results[i];
            console.log(" hood loop ::  "+ hd.get('name') );
            var gson = hd.get('gob');

            var lgeo = gson.geometry;

            var point = new Parse.GeoPoint({latitude: parseFloat(lgeo.location.lat), longitude: parseFloat( lgeo.location.lng )});

            hd.set('geo',point);

            };



             hoods.saveAll( results , {
                       success: function (relations) {
                           

                           res.json( relations  );

               },//usr biz savall
                       error: function (relation, error) {
                          res.json(relation);

                       }

                   });
            */

        },
        error: function(error) {
            console.log(JSON.stringify(error) + "   ::: " + error);
        }
    });


}); //lookforbiz


app.get('/getzines', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    mongoMsg(getbySort('Cuisines', {}, {}, { name: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); //getzines

app.get('/tofill', function(req, res) {

    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("Business");


    var query = new Parse.Query(biz);

    query.doesNotExist('ohours');
    query.exists('place_id');
    query.select(['ohours', 'business', 'place_id']);

    query.limit(1000);


    //query.count({
    query.find({
        success: function(fcounts) {
            // The fcounts request succeeded. Show the fcounts

            //res.send( fcounts.length+""+ JSON.stringify( fcounts ) );
            res.send(fcounts);

        },
        error: function(error) {
            // The request failed
        }
    });


}); //lookforbiz


app.get('/isfav/:uid/:bid', function(req, res) {

    query = {
        uid: req.params.uid,
        bid: req.params.bid
    }


    mongoMsg(getby('userfavs', query, {}, function(msg) {

        if (msg.docs.length > 0) {

            res.json({ 'msg': true });
        } else {

            res.json({ 'msg': false });

        }

    }))

}); //lookforbiz


app.get('/rmfav/:uid/:bid', function(req, res) {

    query = {
        uid: req.params.uid,
        bid: req.params.bid
    }

    mongoMsg(removeby('userfavs', query, {}, function(msg) {

        console.log(msg)

        res.json({ 'msg': 'Removed from favorites' });

    }))

}); //rmfav


app.get('/adduserfav/:uid/:bid', function(req, res) {

    var add = function() {

            query = {
                _id: new ObjectId(req.params.bid)
            };

            mongoMsg(getby('Business', query, {}, function(msg) {

                if (msg.docs.length > 0) {

                    fndbiz = msg.docs[0];
                    console.log("found biz" + JSON.stringify(fndbiz));

                    var bi = {
                        _id: req.params.bid,
                        'business': fndbiz['business'],

                        'cuisine': fndbiz['cuisine'],

                        'address': fndbiz['address']
                    }

                    mongoMsg(sertobj('userfavs', { 'uid': req.params.uid, 'bid': req.params.bid, 'business': bi, 'biname': fndbiz['business'] }, function(msg) {
                        console.log(msg)

                        res.json({ 'msg': 'added to favorites!' });

                    }));


                } else {

                    res.json({ 'error': ' no bi found' });

                } // no bi found

            }));

        } // add


    query = {
        uid: req.params.uid,
        bid: req.params.bid
    };

    mongoMsg(getby('userfavs', query, {}, function(msg) {

        results = msg.docs;

        if (results.length > 0) {

            res.json({ 'msg': 'already a favorite' });

        } else {

            add();

        }

    }))

}); //adduserfav


app.get('/getuserfav/:uid', function(req, res) {

    query = {
        uid: req.params.uid
    };

    mongoMsg(getbySort('userfavs', query, {}, { biname: 1 },

        function(msg) {
            favs = msg.docs;

            businessQuery = {
                '_id': {
                    $in: favs.map(function(fav) {
                        return new ObjectId(fav.bid)
                    })
                }
            };

            getby('Business', businessQuery, {}, function(msg) {

                business = msg.docs;

                console.log(business.length)

                result = favs.map(function(fav) {

                    bi = business.filter(function(bi) {

                        return bi._id.valueOf() + '' == fav.bid;

                    })[0] || {};

                    return { favob: fav, biz: bi };

                })

                res.json(result);

            })(msg)

        }));

}); //getuserfav


app.get('/bizsitemigetone', function(req, res) {

    Parse.Cloud.useMasterKey();

    var Biz = Parse.Object.extend("Business");

    var query = new Parse.Query(Biz);

    query.doesNotExist('website');

    query.exists('mobileAppObjectId');
    query.limit(1);
    //query.sort('business.business');
    query.find({

        success: function(fndbi) {
            // The count request succeeded. Show the count
            var fson = [];
            var bi = fndbi[0];


            var mid = bi.get('mobileAppObjectId');
            var mc = bi.get('marketCode');

            console.log(bi.get('business') + " bi name");
            Parse.Cloud.httpRequest({
                url: 'https://api.parse.com/1/functions/getsite',
                method: "POST",
                headers: {
                    'X-Parse-Application-Id': 'NPk6q9X5zlhrc8srJvtM2LoNYS8K36G0fUF1eB8W',
                    'X-Parse-Master-Key': 'P1Ehr4dkjtpPYflqKxMxMmlT6Metx3NKoB2PuJuS'
                },
                body: JSON.stringify({ 'mid': mid, 'mc': mc }),


            }).then(function(httpResponse) {
                console.log('from mobdb' + httpResponse.text);

                var ret = JSON.parse(httpResponse.text);

                var mbi = ret.result;

                bi.set('website', mbi.website);

                bi.save(null, {

                    success: function(business) {
                        // Execute any logic that should take place after the object is saved.
                        var msgstring = 'business linked';

                        // alert('New object created with objectId: ' + userbusiness.id);
                        res.json(business);
                    },
                    error: function(userbusiness, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                }); // save urell 


            }, function(httpResponse) {
                console.error('Request failed with response code ' + httpResponse.status);
            });


        },
        error: function(error) {
            // The request failed
        }

    });


}); //getuserfav


var getnonce = function() {

        var bet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var string = "";
        for (i = 0; i < 42; i++) {

            var r = Math.floor((Math.random() * bet.length));
            var ad = bet[r];
            string = string + ad;
            bet.splice(r, 1);

        }

        return string;
    } //getnonce


app.get('/testnon', function(req, res) {

    res.json(getnonce());

}); //lookforbiz


app.get('/posttotwit/:datas', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var consumerSecret = "Ze159ercwZlpjdmM1nFQ7YVJsuf6YBksPk3RmbLDVfUxVb3m2f";

    var datas = JSON.parse(req.params.datas);

    var oauth_consumer_key = "W8UcYW2IcvcCjp7k99w9DS8p8";

    console.log('post to twit', datas);

    cb.setConsumerKey(oauth_consumer_key, consumerSecret);

    //{"oauth_token":"4828122839-EtGzvWp3QRCyPFLtQbFn66fgWMkzmXN5LKk0PxF","oauth_token_secret":"dIpTAGV94HHzihXclfO3MLOCsWkvAmgUL2NR7Phjttkmw","screen_name":"greenseth2016","user_id":"4828122839","x_auth_expires":"0"}

    query = {
        _id: new ObjectId(datas.uid)
    }

    mongoMsg(getby('mobileUsers', query, {}, function(msg) {

        fnduser = msg.docs[0];

        var sres = {};

        sres.uid = fnduser.id;
        var accob = fnduser['twitacc'];

        sres.oauth_token = accob.oauth_token;

        sres.oauth_token_secret = accob.oauth_token_secret;

        sres.t_user_id = accob.user_id;

        var result = sres;

        cb.setToken(result.oauth_token, result.oauth_token_secret);

        cb.__call(

            "statuses_update",

            { 'status': datas.msg, 'lat': datas.lat, 'long': datas.lng },

            function(reply, rate, err) {
                console.log(' call callback ');

                if (err) {
                    console.log("error response or timeout exceeded" + err.error);
                }
                if (reply) {

                    res.json(reply);

                }
            }
        );

    }))

}); //twitpost


app.get('/gettwitplaces/:lat/:lng', function(req, res) {


    var lat = req.params.lat; // 38.9208675; //
    var lng = req.params.lng; // -76.9850326; //

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var consumerSecret = "Ze159ercwZlpjdmM1nFQ7YVJsuf6YBksPk3RmbLDVfUxVb3m2f";

    var oauth_consumer_key = "W8UcYW2IcvcCjp7k99w9DS8p8";


    cb.setConsumerKey(oauth_consumer_key, consumerSecret);

    var oauth_token = '4828122839-EtGzvWp3QRCyPFLtQbFn66fgWMkzmXN5LKk0PxF';

    var oauth_token_secret = 'dIpTAGV94HHzihXclfO3MLOCsWkvAmgUL2NR7Phjttkmw';

    //  cb.setToken( oauth_token ,  oauth_token_secret );


    cb.__call(
        "geo_search", { 'lat': lat, 'long': lng },
        function(reply, rate, err) {
            console.log(' call callback fun');

            if (err) {
                console.log("error response or timeout exceeded" + err.error);
            }
            if (reply) {
                // stores it

                //var tson = {'atk':reply.oauth_token, 'ats':reply.oauth_token_secret}; 

                res.json(reply);

            }
        }
    );


}); //twitsign


app.get('/twitsign/:uid', function(req, res) {

    var oauth_timestamp = Math.round((new Date()).getTime() / 1000.0);

    var oauth_nonce = getnonce();
    //xhr.setRequestHeader('Authorization','OAuth oauth_consumer_key="HdFdA3C3pzTBzbHvPMPw", oauth_nonce="4148fa6e3dca3c3d22a8315dfb4ea5bb", oauth_signature="uDZP2scUz6FUKwFie4FtCtJfdNE%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp= "1359955650", oauth_token, "1127121421-aPHZHQ5BCUoqfHER2UYhQYUEm0zPEMr9xJYizXl", oauth_version="1.0"');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var Consumer_Key = "W8UcYW2IcvcCjp7k99w9DS8p8";
    var Consumer_Secret = "Ze159ercwZlpjdmM1nFQ7YVJsuf6YBksPk3RmbLDVfUxVb3m2f";


    var urlLink = 'https://api.twitter.com/oauth/request_token';

    // var postSummary = request.params.status;
    //var status = oauth.percentEncode(postSummary);
    var consumerSecret = "Ze159ercwZlpjdmM1nFQ7YVJsuf6YBksPk3RmbLDVfUxVb3m2f";


    var oauth_consumer_key = "W8UcYW2IcvcCjp7k99w9DS8p8";


    //var tokenSecret = "<your_secret_token_here>";
    //       var oauth_token = "<your_oauth_token_here>";


    //   var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();
    var sigmsg = "this is seth";

    cb.setConsumerKey(oauth_consumer_key, consumerSecret);

    cb.__call(
        "oauth_requestToken", { oauth_callback: relLink + "twitauthcall" },
        function(reply, rate, err) {
            console.log(' call callback fun');

            if (err) {
                console.log("error response or timeout exceeded" + err.error);
            }
            if (reply) {
                // stores it
                cb.setToken(reply.oauth_token, reply.oauth_token_secret);

                var preram = reply.split('&');

                var params = {};

                for (var i = 0; i < preram.length; i++) {
                    var prm = preram[i];

                    var key = prm.substring(0, prm.indexOf('='));

                    var val = prm.substring(prm.indexOf('=') + 1, prm.length);

                    params[key] = val;

                };
                var query = {
                    _id: new ObjectId(req.params.uid)
                }

                console.log('twitsign query', query)


                mongoMsg(getby('mobileUsers', query, {}, function(msg) {

                    var authob = params;

                    console.log(params);

                    var fnduser = msg.docs[0];


                    console.log('twitsign fnd user ', fnduser)


                    fnduser['twitauth'] = authob;

                    fnduser['twittoken'] = authob.oauth_token;

                    sertobj('mobileUsers', fnduser, function(msg) {

                        res.json({ requestToken: fnduser.twittoken });

                    })(msg)

                })); //user query

            }
        }
    );


}); //twitsign

app.get('/twitauthcall', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var oauth_timestamp = Math.round((new Date()).getTime() / 1000.0);

    var oauth_nonce = getnonce();
    //xhr.setRequestHeader('Authorization','OAuth oauth_consumer_key="HdFdA3C3pzTBzbHvPMPw", oauth_nonce="4148fa6e3dca3c3d22a8315dfb4ea5bb", oauth_signature="uDZP2scUz6FUKwFie4FtCtJfdNE%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp= "1359955650", oauth_token, "1127121421-aPHZHQ5BCUoqfHER2UYhQYUEm0zPEMr9xJYizXl", oauth_version="1.0"');


    var Consumer_Key = "W8UcYW2IcvcCjp7k99w9DS8p8";
    var Consumer_Secret = "Ze159ercwZlpjdmM1nFQ7YVJsuf6YBksPk3RmbLDVfUxVb3m2f";
    // res.json(  req.query );


    if (typeof req.query.oauth_verifier !== "undefined") {
        // assign stored request token parameters to codebird here
        // ...

        console.log(req.query.oauth_verifier + "  req.query.oauth_verifier");

        query = {
            twittoken: req.query.oauth_token
        }

        mongoMsg(getby('mobileUsers', query, {}, function(msg) {

            var fnduser = msg.docs[0];

            console.log('twit auth call fnd user ', fnduser)


            var result = fnduser.twitauth;

            result.uid = fnduser.uid;

            cb.setToken(result.oauth_token, result.oauth_token_secret);


            cb.__call(
                "oauth_accessToken", {
                    oauth_verifier: req.query.oauth_verifier
                },
                function(reply, rate, err) {
                    if (err) {
                        console.log("error response or timeout exceeded" + err.error);
                    }
                    if (reply) {
                        cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                    }

                    //var tson = {};
                    //tson.oauth_accessToken = 

                    var preram = reply.split('&');

                    var params = {};

                    for (var i = 0; i < preram.length; i++) {
                        var prm = preram[i];

                        var key = prm.substring(0, prm.indexOf('='));


                        var val = prm.substring(prm.indexOf('=') + 1, prm.length);

                        params[key] = val;

                    };

                    fnduser['twitacc'] = params;

                                console.log('twit auth call fnd user 222 ', fnduser)


                    sertobj('mobileUsers', fnduser, function(msg) {

                        res.redirect('grva://twitauthcomplete/');

                    })(msg);

                    // if you need to persist the login after page reload,
                    // consider storing the token in a cookie or HTML5 local storage
                }
            );

            var sres = {};

        }))

    } else {

        res.json("no auth");

    }

    //  res.json( "" );

    //res.json(" seth ");

}); //lookforbiz


app.get('/gettwitacc/:uid', function(req, res) {

    Parse.Cloud.useMasterKey();

    var uid = req.params.uid;

    Parse.Cloud.httpRequest({
        url: 'https://api.parse.com/1/functions/gettwitacc',
        method: "POST",
        headers: {
            'X-Parse-Application-Id': 'NPk6q9X5zlhrc8srJvtM2LoNYS8K36G0fUF1eB8W',
            'X-Parse-Master-Key': 'P1Ehr4dkjtpPYflqKxMxMmlT6Metx3NKoB2PuJuS'
        },
        body: JSON.stringify({ 'uid': uid }),


    }).then(function(httpResponse2) {
        console.log(httpResponse2.text);

        //console.log(" is this it:: "+ JSON.stringify( params ) );

        var result = JSON.parse(httpResponse2.text).result;

        //var sres = {};
        //sres.requestToken = result.twittoken;
        //res.redirect('grva://twitauthcomplete/');
        res.json(httpResponse2.text);


    }, function(httpResponse2) {
        console.error('Request failed with response code ' + httpResponse2.status);
    });


}); //lgettwitauth


app.get('/lookforbiz/:email', function(req, res) {

    Parse.Cloud.useMasterKey();

    var biz = Parse.Object.extend("Business");


    var query = new Parse.Query(biz);
    query.equalTo('email', req.param('email'));

    query.limit(1000);
    query.find({
        success: function(results) {

            res.json(results);

        },
        error: function(error) {
            console.log(JSON.stringify(error) + "   ::: " + error);
        }
    });

}); //lookforbiz


app.get('/placehoods/:pack', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Parse.Cloud.useMasterKey();

    var pack = req.params.pack;

    var packray = JSON.parse(JSON.parse(pack));

    console.log(" first hit" + packray.length);

    var back = {};
    var keys = []
    for (var key in packray[0]) {
        if (packray[0].hasOwnProperty(key)) {
            keys.push(key)
            console.log("thisis akey" + key);
        }
    }


    var newfs = [];
    var hoods = Parse.Object.extend("neighborhood");

    for (var i = 0; i < packray.length; i++) {
        //console.log("prx :"+JSON.stringify( packray[i]) );

        var pr = packray[i];

        var f0 = new hoods();

        f0.set('state', pr.o.state);

        f0.set('name', pr.o.hood);

        newfs.push(f0);

    };

    back.l = packray.length;

    back.shoot = packray;

    hoods.saveAll(newfs, {
        success: function(relations) {

            res.json(back);

        }, //usr biz savall
        error: function(relation, error) {
            res.json(relation);

        }

    });
}); //new farms


/*
app.get('/newfarms/:pack', function ( req, res) {
 
     res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

  Parse.Cloud.useMasterKey();


var pack = req.params.pack;

var packray = JSON.parse(pack);

var back = {};
var keys = []
for (var key in packray[0]) {
  if (packray[0].hasOwnProperty(key)) {  
keys.push(key)
   console.log("thisis akey"+key);
  }
}


var newfs = [];
var farms = Parse.Object.extend("Farm");


for (var i = 0; i < packray.length; i++) {
  var pr = packray[i];

var f0 = new farms(); 

for (var j = 0; j < keys.length; j++) {
  var k = keys[j];

f0.set( k , pr[k] );

};

newfs.push( f0 );

};

back.l = packray.length;

back.shoot = packray;

var farms = Parse.Object.extend("testnewfarm");

 farms.saveAll( newfs, {
           success: function (relations) {
               

               res.json( back    );



   },//usr biz savall
           error: function (relation, error) {
              res.json(relation);

           }
     


       });



});//new farms
*/


app.get('/setfarmvis/:buy_id/:value', function(req, res) {
    //HZL12APiR3/2LGuAOwamN/true
    var buys = Parse.Object.extend("BuysFrom");

    var buy_id = req.params.buy_id;

    console.log("buy_id" + buy_id);

    var query = new Parse.Query("BuysFrom");

    var msg = "farm is now public";

    console.log("setfarmvisval" + req.params.value);

    var value = (req.params.value === 'true');

    console.log(req.params.value + "value" + (req.params.value === 'true'));

    if (value === true) {

        msg = "farm is now private";

    }

    mongoMsg(getby('BuysFrom', { "_id": new ObjectId(buy_id) }, {}, function(msg) {

        console.log(msg.docs)

        fndbuys = msg.docs

        console.log(fndbuys.length + " :: find buys length");

        if (fndbuys.length > 0) {

            console.log(JSON.stringify(fndbuys[0]) + " :: find buys at hide 1");

            fndbuys[0]["hide"] = value;
            //fndbuys[0].hide = value;
            console.log(fndbuys[0]['hide'] + " :: find buys at hide 2");

            updateDocumentbyid(msg.db, "BuysFrom", fndbuys[0]._id, fndbuys[0], function(result, err) {

                res.json({ stuff: result, msg: "Farm updated!" });

            });

        } else {

            res.json(setres('update this farm before you make it private', null));

        }

    })); // getby


}); //getusers


function setres(msg, stuff) {

    return { 'msg': msg, 'stuff': stuff };
}


/*
//quick new user if needed
app.get('/newuser', function ( req, res) {
   // get user relations base on uid
var user = new Parse.User();
user.set("username", "grow@greenease.co");
user.set("password", "eatgreen");

// other fields can be set just like with Parse.Object
user.signUp(null, {
  success: function(user) {
res.json(user);

    // Hooray! Let them use the app now.
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});// crm user for email
*/


app.get('/getlinkedbybid/:bid', function(req, res) {
    // get user relations base on uid
    var myclass = Parse.Object.extend("userbusiness");


    var query = {
        bid: req.params.bid,
        linked: true
    }


    mongoMsg(getby('userbusiness', query, {}, function(msg) {

        var results = msg.docs;

        var matches = [];

        for (var i = 0; i < results.length; i++) {
            //urel is user/biz relation table record

            var urel = results[i];

            //if(urel.get("email").toLowerCase().indexOf(term.toLowerCase()) > - 1 ){

            matches.push({ 'rel': urel, 'bi': { _id: req.params.bid } });

            //}//old macthing if 

        }; //f loop

        res.json(matches);

    }));


}); // crm user for email


app.get('/getlinked/:email', function(req, res) {
    // get user relations base on uid
    var myclass = Parse.Object.extend("userbusiness");
    var query = new Parse.Query(myclass);
    Parse.Cloud.useMasterKey();
    query.limit(1000);
    query.include('bi');
    query.equalTo('email', req.param('email'));
    query.equalTo('linked', true);
    query.find({
        success: function(results) {

            //var term = req.param('term');

            var matches = [];

            for (var i = 0; i < results.length; i++) {
                //urel is user/biz relation table record

                var urel = results[i];

                //if(urel.get("email").toLowerCase().indexOf(term.toLowerCase()) > - 1 ){

                matches.push({ 'rel': urel.get('user'), 'bi': urel.get('bi') });

                //}//old macthing if 

            }; //f loop

            res.json(matches);

        },
        error: function(error) {
            alert("Error when getting objects!");
        }
    });


}); // crm user for email


//getfabyname


app.get('/widgPage', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.send(fs.readFileSync('./Widgpage.html'));
});


app.get('/getwidgetlink/:email/:bid/:pic', function(req, res) {
    // ne45W7MzvZ/2LGuAOwamN


    var email = req.param('email');
    var bid = req.param('bid');
    var pic = req.param('pic');

    var User = Parse.Object.extend("User");

    var query = new Parse.Query(User);

    Parse.Cloud.useMasterKey();

    query.equalTo('email', email);

    var term = req.param('term');

    var userTerms = { email: email };

    console.log("@userTerms :: " + JSON.stringify(userTerms))

    mongoMsg(getby('User', userTerms, {}, function(msg) {

        fndUsers = msg.docs
        console.log(JSON.stringify(fndUsers));

        if (fndUsers.length > 0) {

            var paiddate = fndUsers[0]['paiddate'];
            var txn_info = fndUsers[0]['txn_info'];

            console.log("  paiddate  " + paiddate);

            console.log(" txn" + txn_info);

            if (paid(paiddate) || email.toLowerCase() == 'vanessa@greenease.co' || email.toLowerCase() == 'vferragut@msn.com' || email == 'isethguy@gmail.com') {

                cklink(fndUsers[0]);

            } else {

                console.log(req.params + "  no pay ");

                res.send(" ");

            }

        } else {

            console.log("no users");

            res.send("");

        } //if found users 

    })); // getby


    function cklink(user) {

        console.log("at cklink  user id is" + user._id);

        console.log("this is bid in ck link :: " + bid);

        bizTerms = { bid: bid }

        mongoMsg(getby('userbusiness', bizTerms, {}, function(msg) {
            fndlinks = msg.docs;

            if (fndlinks.length > 0 || email.toLowerCase() == 'vanessa@greenease.co' || email.toLowerCase() == 'vferragut@msn.com' || email == 'isethguy@gmail.com') {

                var widstring = "<iframe src=\"" + widgPageUrl + "?" + user._id + "/" + bid + "/" + pic + "\" width=\"600\" height=\"672\" scrolling=\"no\" frameBorder=\"0\"></iframe>";
                console.log("widstring ::    " + widstring);
                res.send(widstring);

            } else {

                res.send("");

                console.log("no links between this user and business ");

            }

        }));

    } //cklink 


    function paid(paiddate) {

        var pn = new Date(paiddate.iso).getTime();

        var nd = new Date();

        var diff = Math.abs(nd.getTime() - pn);

        if (diff < 2629743833) return true;

        return false;
    } //paid


}); // crm user for email


app.get('/getfabyname/:term', function(req, res) {
    var term = req.param('term');

    var farmTerms = { removed: { $ne: true }, 'name': { $regex: ".*" + req.param('term') + ".*", $options: "i" } }; //{ 'name': { $regex: ".*" + req.param('term') + ".*", $options: "i" } }

    console.log("@farmTerms :: " + JSON.stringify(farmTerms))

    mongoMsg(getby('Farm', farmTerms, {}, function(msg) {

        res.json(msg.docs);

    })); // getby

}); // crm user for email


app.get('/crmuforemail/:term', function(req, res) {
    // look up users by email 
    // originally used for user search bar 
    // on the crm view
    var myclass = Parse.Object.extend("User");
    var query = new Parse.Query(myclass);
    Parse.Cloud.useMasterKey();

    query.limit(200);

    query.find({
        success: function(results) {


            var term = req.param('term');

            var matches = [];

            for (var i = 0; i < results.length; i++) {
                var user = results[i];

                if (user.get("email").toLowerCase().indexOf(term.toLowerCase()) > -1) {

                    matches.push(user);

                }

            }; //f loop


            res.json(matches);

        },
        error: function(error) {
            alert("Error when getting objects!");
        }
    });


}); // crm user for email


app.get('/newuserbusiness/:bid/:email', function(req, res) {
    // The current user is now set to user.

    query = {
        bid: req.param('bid'),
        email: req.param('email')
    };

    //query.equalTo("linked",false );
    mongoMsg(getby('userbusiness', query, {}, function(msg) {

        urels = msg.docs;

        if (urels.length == 0) {
            // if no urels present
            makeuserbiz(req.param('bid'), req.param('email'));

        } else {
            // look for unlinked urels should only be one
            for (var i = 0; i < urels.length; i++) {
                var rel = urels[i];

                if (rel['linked']) {

                    var msgstring = 'business linked to this email';

                    res.json({ 'msg': msgstring, 'urel': rel });

                } else {

                    // if a urel exist but it is set to false
                    rel['linked'] = true;

                    sertobj('userbusiness', rel, function(msg) {

                        var msgstring = 'business linked';

                        console.log(msg)

                        res.json({ 'msg': msgstring, 'urel': msg });

                    })(msg);

                } /// lnked = false check

            }; ///urel loop

        } //if urels length 

    })); // getby

    ///////////////////////////////////////////////////////
    function makeuserbiz(bid, email) {

        var userbusiness = {}

        userbusiness["bid"] = bid;

        userbusiness["email"] = email;

        userbusiness["linked"] = true;

        // userbusiness["bi"] = biz;

        mongoMsg(sertobj('userbusiness', userbusiness, function(msg) {

            var msgstring = 'business linked';

            res.json({ 'msg': msgstring, 'urel': msg.result });

        }));

    } //make user biz sub function


}); //"/newuser business"


app.get('/unlinkuserbusiness/:bid/:email', function(req, res) {
    Parse.Cloud.useMasterKey();


    console.log("unlinked stuff   ::   " + req.param('bid') + "    " + req.param('email'))

    var query = new Parse.Query("userbusiness");
    query.equalTo("bid", req.param('bid'));
    query.equalTo("email", req.param('email'));

    query.equalTo("linked", true);

    query.include('bi');
    query.find({
        success: function(urels) {
            // The count request succeeded. Show the count

            for (var i = 0; i < urels.length; i++) {
                var urel = urels[i];

                if (urel.get('email') === req.param('email')) {

                    if (urels.length === 1) {

                        urel.get('bi').set('islinked', false);
                        urel.get('bi').save();

                    } //if to determin if business is unlinked base on if this is the last urel linked


                    urel.set("objectId", urel.get('objectId'));
                    urel.set("linked", false);
                    console.log("here");
                    urel.save(null, {
                        success: function(userbusinessres) {
                            // Execute any logic that should take place after the object is saved.

                            var msgstring = 'business unlinked';
                            console.log("bus");
                            res.json({ 'msg': msgstring, 'urel': userbusinessres });

                            alert('New object created with objectId: ' + userbusinessres.id);

                        },
                        error: function(userbusiness, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });


                }


            }; //urel loop


        },
        error: function(error) {
            // The request failed
        }
    }); // user biz query


}); //"/unlink userbusiness rel  get"


app.get('/catsearch', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var raw = req.param('catray');

    var latlng = req.param('latlng');

    var mpos = JSON.parse(latlng);

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [mpos.lng, mpos.lat] },
                $maxDistance: (1609.34) * 10
            }
        }
    }

    var cats = JSON.parse(raw);

    for (var i = 0; i < cats.length; i++) {
        var tc = cats[i];
        console.log("catname" + tc.name);
        query[tc.name] = true;
    }; // cat loop

    console.log('query :', query);

    mongoMsg(getby('Business', query, {}, function(msg) {

        res.json(msg.docs);

    })); // getby


}); //catsearch


app.get('/getnear/:lat/:lng', function(req, res) {

    var lat = req.param('lat');
    var lng = req.param('lng');

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * 5
            }
        }
    }

    console.log('query :', query);

    mongoMsg(getby('Business', query, {}, function(msg) {

        // if(msg.err) res.json(msg.err);

        var back = {};
        back.top = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };

        back.ray = [];
        if (msg.docs) {
            var po = msg.docs;

            for (var i = 0; i < po.length; i++) {
                var p = po[i];

                var geo = p['geoPoint'];

                var meters = geolib.getDistance({ latitude: parseFloat(lat), longitude: parseFloat(lng) }, { latitude: geo.coordinates[1], longitude: geo.coordinates[0] });

                var num = meters / (1609.34);
                var thing = {};

                thing.num = num;
                thing.bi = p;
                //thing.geo = geo;
                //thing.address = p.get('address');

                back.ray.push(thing)

            };
        }
        res.json(back);

    })); // getby

    // Final list of objects

});


app.get('/getnear0/:lat/:lng', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var lat = req.param('lat');
    var lng = req.param('lng');

    var point = new Parse.GeoPoint({ latitude: parseFloat(lat), longitude: parseFloat(lng) });

    var query = new Parse.Query("Business");

    query.withinMiles('geo', point, 10);

    // Interested in locations near user.
    query.near("geo", point);
    // Limit what could be a lot of points.
    query.limit(100);
    // Final list of objects
    Parse.Cloud.useMasterKey();

    query.find({
        success: function(placesObjects) {

            res.json(placesObjects);

        },
        error: function(user, error) {

            res.json("no log");
            // The login failed. Check error to see why.
        }
    });


});


app.get('/nulog', function(req, res) {


    console.log("-------nulog------");
    console.log(req.param('uname') + "   " + req.param('pass'));

    Parse.User.logIn(req.param('uname'), req.param('pass'), {
        success: function(user) {
            console.log(" AND  ");

            //user["ses"]=user._sessionToken;
            var upay = { "user": user, "ses": user._sessionToken };

            res.json(upay);

            // Do stuff after successful login.
        },
        error: function(user, error) {

            res.json("no log" + JSON.stringify(error));

            // The login failed. Check error to see why.
        }
    });


});


app.get('/findlost', function(req, res) {

    /*   
     var currentUser = Parse.User.current();
    console.log(" sethtest s: "+Parse.User.current()+"+");


    if(currentUser!=null){

    console.log(" here it is");

    }
    */


    var myclass = Parse.Object.extend("Business");
    var query = new Parse.Query(myclass);
    query.doesNotExist('geo');
    query.limit(1000);
    query.find({
        success: function(results) {


            res.json(results);

        },
        error: function(error) {
            alert("Error when getting objects!");
        }
    });


});


app.get('/setgeo', function(req, res) {

    var geo = JSON.parse(req.param('geo'));

    var bid = req.param('bid');

    console.log("this is neo" + bid);

    //res.json("seth");

    Parse.Cloud.useMasterKey();

    var Business = Parse.Object.extend("Business");

    var query = new Parse.Query(Business);

    query.get(bid, {

        success: function(bi) {

            var myResults = { result: "seth2" };

            bi.set("geo", geo);

            bi.save();

            res.json(myResults);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            console.error(error);

            //res.error(error.message);

            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });


});


app.get('/fasearch/:term', function(req, res) {

    var farmTerms = { removed: { $ne: true }, 'name': { $regex: ".*" + req.param('term') + ".*", $options: "i" } }

    console.log("@farmTerms :: " + JSON.stringify(farmTerms))

    mongoMsg(getby('Farm', farmTerms, {}, function(msg) {

        res.json(msg.docs);

    })); // getby

}); //fasearch"


app.get('/bizsearch/:term', function(req, res) {

    var bizTerms = { 'business': { $regex: ".*" + req.param('term') + ".*", $options: "i" } }

    console.log("@bizsearch :: " + JSON.stringify(bizTerms))

    mongoMsg(getby('Business', bizTerms, {}, function(msg) {

        res.json(msg.docs);

    })); // getby

}); //"/bizsearch"


app.get('/business/sort/geo/:lat/:lng', function(req, res) {


    var lat = req.param('lat');
    var lng = req.param('lng');
    Parse.Cloud.useMasterKey();

    var point = new Parse.GeoPoint({ latitude: parseFloat(lat), longitude: parseFloat(lng) });

    var query = new Parse.Query("Business");

    //query.withinMiles( 'geo' , point, 50 ); 

    query.near("geo", point);
    // Limit what could be a lot of points.
    query.limit(200);

    // Final list of objects
    query.find({
        success: function(po) {

            res.json(po);

        },
        error: function(user, error) {
            res.json("no log");

            // The login failed. Check error to see why.
        }
    });


});

app.get('/getclosehoods/:lat/:lng', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var lat = req.param('lat');
    var lng = req.param('lng');

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * 30
            }
        }
    }

    mongoMsg(getbySort('neighborhood', query, {}, { name: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); // get close hoods


app.get('/getbibypoint/:lat/:lng/:dist', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var lat = req.param('lat');
    var lng = req.param('lng');

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * parseFloat(req.params.dist)
            }
        }
    }

    mongoMsg(getbySort('Business', query, {}, { name: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); // get biby point 


app.get('/getbibypoint/:lat/:lng', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var lat = req.param('lat');
    var lng = req.param('lng');

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * 30
            }
        }
    }

    mongoMsg(getbySort('Business', query, {}, { name: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); // get biby point 

app.get('/getbibypointsa/:lat/:lng', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var lat = req.param('lat');
    var lng = req.param('lng');

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * 30
            }
        }
    }

    console.log('query :', query);

    // var getbySort = function(table, terms, ops, sort, calli) {

    mongoMsg(getbySort('Business', query, {}, { business: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); // get close hoods


app.get('/business/sort/:by', function(req, res) {


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var myclass = Parse.Object.extend("Business");
    var query = new Parse.Query(myclass);
    Parse.Cloud.useMasterKey();


    query.limit(100);
    query.ascending(req.params.by);
    query.find({
        success: function(results) {

            res.json(results);

        },
        error: function(error) {
            alert("Error when getting objects!");
        }
    });


}); //"/getbusiness/sort"


/*
 Parse.Cloud.httpRequest({
            url:'https://graph.facebook.com/me?fields=email,name,username&access_token='+user.get('authData').facebook.access_token,
            success:function(httpResponse){
                console.log(httpResponse.data.name);
                console.log(httpResponse.data.email);
                 console.log(httpResponse.data.username);
            },
            error:function(httpResponse){
                console.error(httpResponse);
            }
        });
*/


app.get('/faceauth/:token', function(req, res) {

    var tok = req.params.token;

    var faceGraphUrl = 'https://graph.facebook.com/oauth/access_token?format=json&grant_type=fb_exchange_token&client_id=949243931828808&client_secret=a30d1c940a494f85aa9677b14e36ef65&fb_exchange_token=' + tok;

    request(faceGraphUrl, function(error, response, body) {

        res.json({ text: body });

        console.log(body);
    });

    // url:'https://graph.facebook.com/oauth/access_token?format=json&grant_type=fb_exchange_token&client_id=949243931828808&client_secret=a30d1c940a494f85aa9677b14e36ef65&fb_exchange_token=' + tok,

}); // aceauth

app.get('/facepost/:token/:msg', function(req, res) {

    var tok = req.params.token;
    var msg = req.params.msg;

    request.post({
                url: 'https://graph.facebook.com/v2.5/me/feed',
                form: { 'access_token': tok, 'format': 'json', 'message': msg }
            },
            function(err, httpResponse, body) {

                res.json(httpResponse);

            })
        /*Parse.Cloud.httpRequest({
                method: 'post',
                //  url:'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=949243931828808&client_secret=a30d1c940a494f85aa9677b14e36ef65&fb_exchange_token='+tok,
                url: 'https://graph.facebook.com/v2.5/me/feed',
                body: { 'access_token': tok, 'format': 'json', 'message': msg },
                success: function(httpResponse) {

                    res.json(httpResponse);

                },
                error: function(httpResponse) {

                    res.json(httpResponse);

                    console.error(httpResponse);
                }
            });*/

}); // facepost


app.get('/getbibycuisine/:cterm/:lat/:lng', function(req, res) {

    var cterm = req.params.cterm;
    var lat = req.params.lat;
    var lng = req.params.lng;

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var query = {
        geoPoint: {
            $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: (1609.34) * 5
            }
        }
    }

    query.cuisine = cterm;

    mongoMsg(getbySort('Business', query, {}, { name: 1 }, function(msg) {

        res.json(msg.docs);

    }))


}); //"/getbusiness"


app.get('/business', function(req, res) {


    /*   
     var currentUser = Parse.User.current();
    console.log(" sethtest s: "+Parse.User.current()+"+");


    if(currentUser!=null){

    console.log(" here it is");

    }
    */

    var myclass = Parse.Object.extend("Business");
    var query = new Parse.Query(myclass);
    Parse.Cloud.useMasterKey();
    query.limit(1000);
    query.find({
        success: function(results) {

            res.json(results);

        },
        error: function(error) {
            alert("Error when getting objects!");
        }
    });


}); //"/getbusiness"


app.get('/ckses/:ses/:id', function(req, res) {
    //alert(req.query.bid);

    var ses = req.params.ses;

    var id = req.params.id;


    var mongoget = function(table, terms, ops, calli) {

            return function(db) {

                db.collection(table).find(terms).toArray(function(err, docs) {

                    calli(docs, err);

                });

            }

        } //getby


    mongogetdb(mongoget('User', { sessionToken: ses, "_id": new ObjectId(id) }, { bcryptPassword: 0 }, function(docs, err) {

        var fnduser = docs[0];


        var fuses = fnduser.sessionToken;

        console.log(fuses + "this iss ese");
        console.log(fuses);
        console.log(ses);
        console.log(fuses + "this iss ese");

        //
        if (fuses && fuses === ses) {

            fnduser.sessionToken = fuses;
            res.json(fnduser);

        } else {

            res.json({ 'msg': 'no match' });

        }


    }));


    console.log("next:" + JSON.stringify(req.params));

    Parse.Cloud.useMasterKey();


    /*

                  var fuses = fnduser.getSessionToken();

    console.log(fuses+"this iss ese");
    console.log(fuses);
    console.log(ses);
    console.log(fuses+"this iss ese");

    //
    if(fuses  &&  fuses===ses  ){

    fnduser.sessionToken =fuses;
     res.json( fnduser );
      
      }else{

    res.json({'msg':'no match'});

      }

         

    */


    /*

    query.get(id, {
      success: function(fnduser) {
            

                  var fuses = fnduser.getSessionToken();

    console.log(fuses+"this iss ese");
    console.log(fuses);
    console.log(ses);
    console.log(fuses+"this iss ese");

    //
    if(fuses  &&  fuses===ses  ){

    fnduser.sessionToken =fuses;
     res.json( fnduser );
      
      }else{

    res.json({'msg':'no match'});

      }

              
        // The object was retrieved successfully.
      },
      error: function(object ) {
                  // console.error(error);

                //res.error(error.message);
     res.json({'msg':'no match'});
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
        });

    */

});


app.get('/ulog/:email/:pass', function(req, res) {
    //alert(req.query.bid);

    var email = req.params.email;

    var pass = req.params.pass;

    console.log("next:" + JSON.stringify(req.params));
    Parse.Cloud.useMasterKey();

    Parse.User.logIn(email, pass, {
        success: function(user) {

            var ses = user.getSessionToken();
            console.log(" this is user :: " + user.getSessionToken());
            /*
            Parse.User.become(ses).then(function (user) {
            */
            user.set('authData', { "facebook": { "access_token": "CAAEFVtSNto4BAPx2YIOcpjr1p9MMl9drZC9ktiDPAzAJlShewARvNozN9HjViQU3QHLwjF1ZCFfngUNpdLg4vgY6IRLcXxGZAT03ax2PBoQFYFO6zU7EQKYDJ8DBgcPeoE6hHd0koZBtbI6OkZAoq8IG7VUmLK7aZC1ycjIoNBQZA9Ns3zS6qp6CJ4gfeFLlRDyav6rRJQ0mzo7bhNjqqJ16HnRkuJklkZBjCATda1dHYAZDZD", "expiration_date": "2016-02-27T19:18:08.098Z", "id": "10104136546335020" } });

            user.save(null, {
                success: function(relation) {

                    res.json(user);


                },
                error: function(relation, error) {
                    res.json(error.message);
                }
            });


            /*

              // The current user is now set to user.
            }, function (error) {

            res.json(error);

              // The token could not be validated.
            });
            */
            // Do stuff after successful login.
        },
        error: function(user, error) {

            res.json(error);

            // The login failed. Check error to see why.
        }

    });

});

/*
{
    "txn_type": "subscr_signup",
    "subscr_id": "I-18PR5734NHS2",
    "last_name": "buyer",
    "residence_country": "US",
    "mc_currency": "USD",
    "item_name": "Greenease_Widget_578458de830d33b7017ee56f",
    "business": "vferragut-facilitator@msn.com",
    "amount3": "9.99",
    "recurring": "1",
    "address_street": "1 Main St",
    "verify_sign": "AnNMT7nRteKS2auTkxdsRz9rRvvPAJv2A-xEAf6KSDPWgBuZRetfCxSj",
    "payer_status": "verified",
    "test_ipn": "1",
    "payer_email": "vferragut-buyer@gmail.com",
    "address_status": "confirmed",
    "first_name": "test",
    "receiver_email": "vferragut-facilitator@msn.com",
    "address_country_code": "US",
    "payer_id": "WE748PQ66WC2L",
    "address_city": "San Jose",
    "reattempt": "1",
    "address_state": "CA",
    "subscr_date": "20:05:54 Aug 08, 2016 PDT",
    "address_zip": "95131",
    "charset": "windows-1252",
    "notify_version": "3.8",
    "period3": "1 D",
    "address_country": "United States",
    "mc_amount3": "9.99",
    "address_name": "test buyer",
    "ipn_track_id": "bdac9f38a54b3"
}
*/

app.post('/gipnl2', function(req, res) {
    //alert(req.query.bid);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    console.log("next: :: " + JSON.stringify(req.body));

    var txn_type = req.body.txn_type;

    var business = req.body.business;

    var mc_gross = req.body.mc_gross;
    var payment_status = req.body.payment_status;
    var payer_email = req.body.payer_email;
    var item_name = req.body.item_name;
    var txn_id = req.body.txn_id;
    var txn_type = req.body.txn_type; //"subscr_payment"
    var receiver_email = req.body.receiver_email;
    var subscr_id = req.body.subscr_id;

    //var uid = item_name.replace("Greenease_Widget_","");
    var item_name = req.body.item_name;

    var uid = item_name.replace("Greenease_Widget_", "");


    if (item_name.indexOf("Greenease_Widget_") > -1 && business === "sellseth@gamil.com" && payment_status === "verified") {

    }

    req.body.cmd = "_notify-validate";

    var urlstring = "https://www.sandbox.paypal.com/cgi-bin/webscr";

    request.post({ url: urlstring, form: req.body }, function(err, httpResponse, body) {

        console.log(" post res " + body);

        var word = body;

        if (word === "VERIFIED") {
            console.log(uid)

            mongoMsg(getby('User', { _id: new ObjectId(uid) }, {}, function(msg) {
                console.log(msg.docs)

                fnduser = msg.docs[0];

                fnduser["paiddate"] = new Date();

                fnduser["txn_info"] = { 'date': new Date(), 'txn_id': txn_id, 'payer_email': payer_email };

                idToPlace = fnduser._id;

                delete fnduser._id;

                updateDocumentbyid(msg.db, 'User', idToPlace, fnduser, function() {

                    res.end("");

                    // res.json('VERIFIED');

                });

            })); // getby

        } // VERIFIED

        if (word === "INVALID") {

            console.log("wrong :: " + httpResponse.text);
            res.json("INVALID");

        } //

    })

}); //gipnl 2 


app.post('/gipnl', function(req, res) {
    //alert(req.query.bid);

    console.log("next:" + JSON.stringify(req.body));

    var mc_gross = req.body.mc_gross;
    var payment_status = req.body.payment_status;
    var payer_email = req.body.payer_email;
    var item_name = req.body.item_name;
    var txn_id = req.body.txn_id;
    var bid = item_name.replace("Greenease Widget_", "");

    console.log("howdy bid is " + item_name);

    console.log("howdy bid is +" + bid + "+");

    Parse.Cloud.useMasterKey();
    var Business = Parse.Object.extend("Business");

    var query = new Parse.Query(Business);

    query.get(bid, {
        success: function(bi) {

            var myResults = { result: "seth" };

            bi.set("paiddate", new Date());
            bi.save();

            res.json(myResults);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            console.error(error);

            //res.error(error.message);

            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });

});


app.get('/getFarms2', function(req, res) {
    //alert(req.query.bid);

    var a = req.query.bid;
    var pop = req.query.pop

    var BuysFrom = Parse.Object.extend("BuysFrom");
    var Business = Parse.Object.extend("Business");

    // Create a new instance of that class.
    var business = new Business();
    business.id = a;
    console.log("Farm: ");
    console.log(business);

    var clear = true;


    Parse.Cloud.useMasterKey();
    var Business = Parse.Object.extend("Business");

    var query = new Parse.Query(Business);

    query.get(a, {
        success: function(bi) {


            var g = bi.get("paiddate");

            console.log("g what " + g);

            console.log("nums" + Date.parse(g) + "   and :  " + Date.parse(new Date()));

            var paidmill = parseInt(Date.parse(g));

            var now = parseInt(Date.parse(new Date()));

            var diff = now - paidmill;

            console.log(diff + "   so " + (diff > 2629743833));

            if (diff > 2629743833) clear = false;

            if (g == null) clear = false;

            //if( pop!=null && ( pop.substring(0, 29) === "https://business.greenease.co" ) ){

            //}

            console.log("clear" + clear + "    :" + pop);

            if (clear) {
                var buysFromQuery = new Parse.Query(BuysFrom);
                buysFromQuery.equalTo("business", business);
                buysFromQuery.include("farm");
                buysFromQuery.find({
                    success: function(farms) {
                        console.log("howdy");
                        //console.log(farms);
                        var toReturn = [];
                        for (var i = 0; i < farms.length; i++) {
                            // This does not require a network access.
                            if (farms[i].get("farm") != null) {
                                var theFarm = farms[i].get("farm");
                                console.log("thefarm" + theFarm.name + "thefarm.id" + theFarm.id);
                                var post = {
                                    meat: farms[i].get("meat"),
                                    dairy: farms[i].get("dairy"),
                                    seafood: farms[i].get("seafood"),
                                    produce: farms[i].get("produce"),
                                    farm: { name: theFarm.get("name"), state_code: theFarm.get("state_code") }
                                };
                                toReturn.push(post);

                            } //null check

                            // console.log(post);

                        }
                        var myResults = { result: toReturn };
                        // var longStuff = '{"result":[{"ACL":{"*":{"read":true,"write":true}},"__type":"Object","business":{"__type":"Pointer","className":"Business","objectId":"9e7rzwV6eY"},"className":"BuysFrom","createdAt":"2015-02-24T04:10:34.271Z","farm":{"__type":"Object","category":"Meats","category_meat":true,"className":"Farm","createdAt":"2014-12-29T15:29:28.964Z","name":"Red Row Farm ","objectId":"Hjc93gb8Mw","products":"Chicken Eggs","state":"Virginia","state_code":"VA","updatedAt":"2015-01-14T19:20:25.283Z","website":"http://redrowfarm.com"},"meat":true,"objectId":"YbeB8jRUNm","updatedAt":"2015-02-24T04:10:39.298Z"}';
                        res.json(myResults);
                        //response.success(farms);
                    },
                    error: function(error) {
                        res.error(error.message);
                    }
                });
            } //if clear


        },
        error: function(object, error) {
            console.error(error);

            //res.error(error.message);

            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });

}); // app.'getfarms'2


app.get('/purhis2/:bid/:sort', function(req, res) {
    //alert(req.query.bid);

    var bid = req.params.bid;

    var sorter = JSON.parse(req.params.sort);

    var terms = {};

    terms[sorter.by] = (sorter.di == 0) ? 1 : -1


    var purhisTerms = { 'business._id': bid };

    mongoMsg(getbySort('PurchaseHistory', purhisTerms, {}, terms, function(msg) {

        //console.log("PurchaseHistory docs", msg.docs);

        var purhisrecs = msg.docs;

        var phres = [];

        var farm_id_ray = [];

        for (var i = 0; i < purhisrecs.length; i++) {

            var rec = purhisrecs[i];

            var rayrec = { 'rec': purhisrecs[i], 'farm': purhisrecs[i]['farm'] };

            phres.push(rayrec);

            farm_id_ray.push(new ObjectId(purhisrecs[i]['farm']._id));

            //console.log( purhisrecs[i].get('farm').id  );
        }; //rec loop

        var farmterms = { '_id': { $in: farm_id_ray } };

        mongoMsg(getby('Farm', farmterms, {}, function(msg) {

                //console.log(JSON.stringify(msg.docs)+"at purhis/:bid farms")

                var farms = msg.docs;

                for (var i = 0; i < phres.length; i++) {
                    // This does not require a network access.

                    //var theFarm = farms[i];

                    for (var j = 0; j < farms.length; j++) {


                        if (farms[j]._id == phres[i].farm._id) {

                            phres[i].farm = farms[j];

                        }

                    }

                    // console.log(post);
                }

                res.json(phres);

            })) // getby

    })); //mongomsg


}); // purhis table pull


app.get('/getFarms/:bid', function(req, res) {

    //console.log(req.params.bid+" getfarms/:bid . bid");

    var terms = { 'business._id': req.params.bid };

    mongoMsg(getby('BuysFrom', terms, {}, function(msg) {

        //console.log( JSON.stringify(msg.docs)+"at getfarms/:bid mbuys with bid")

        var buys = msg.docs;
        var farm_id_ray = [];

        for (var i = 0; i < buys.length; i++) {
            var fa = buys[i].farm;

            //farm_id_ray.push( new ObjectId( fa._id )  );

            farm_id_ray.push(new ObjectId(fa._id));

        };

        //        console.log(JSON.stringify(farm_id_ray) + "at getfarms/:bid farmray")

        var farmterms = { '_id': { $in: farm_id_ray } };

        getby('Farm', farmterms, {}, function(msg) {

            //console.log(JSON.stringify(msg.docs)+"at getfarms/:bid farms")

            var farms = msg.docs;

            var toReturn = [];

            for (var i = 0; i < buys.length; i++) {
                // This does not require a network access.

                var theFarm = null;

                for (var j = 0; j < farms.length; j++) {

                    var fa = farms[j];
                    if (fa.objectId == buys[i].farm.objectId) {
                        theFarm = fa;
                    }

                }

                if (theFarm != null) {

                    //console.log("thefarm"+theFarm.name+"thefarm.id"+theFarm.id);
                    var post = {

                        meat: buys[i].meat,
                        dairy: buys[i].dairy,
                        seafood: buys[i].seafood,
                        produce: buys[i].produce,
                        farm: { name: theFarm.name, state_code: theFarm.state_code },
                        ob: theFarm,
                        buys: buys[i]

                    };

                    toReturn.push(post);
                } // null farm check

                // console.log(post);
            }
            var myResults = { result: toReturn };

            res.status(200).send(myResults);

        })(msg);


    }));


}); //getFarms/:bid


app.get('/showFarms/:uid/:bid', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var uid = req.param('uid');
    var bid = req.param('bid');

    console.log(uid + "    " + bid);

    var userbusinessTerms = { uid: uid, bid: bid };

    mongoMsg(getby('userbusiness', userbusinessTerms, {}, function(msg) {

        var links = msg.docs;

        //links.length > 0 || (req.param('uid') == 'Aup1bxd3il') || req.param('uid') == 'ne45W7MzvZ'

        if (true) {


            userTerms = { '_id': new ObjectId(uid) }

            getby('User', userTerms, {}, function(msg) {

                user = msg.docs[0];

                var paid = user['paiddate'];

                var email = user['email'];

                console.log("here at get paid date" + JSON.stringify(paid));

                //console.log(user.get('))

                if ((user && paid) || ADMINEMAIL(email)) {


                    var today = new Date();

                    var millis = 2629743833;

                    var tm = today.getTime();

                    var um = 2629743833 + 1;

                    var diff = Math.abs(tm - um);

                    if (paid) {

                        um = new Date(paid.iso).getTime();

                        diff = Math.abs(tm - um);
                    }
                    console.log(" diff in time between paid date and right now  " + diff);

                    if ((diff < millis) || ADMINEMAIL(email)) {

                        BuysFromTerms = { 'business._id': bid };

                        getby('BuysFrom', BuysFromTerms, {}, function(msg) {

                            //console.log( JSON.stringify(msg.docs)+"at getfarms/:bid mbuys with bid")

                            var buys = msg.docs;
                            var farm_id_ray = [];

                            for (var i = 0; i < buys.length; i++) {
                                var fa = buys[i].farm;

                                //farm_id_ray.push( new ObjectId( fa._id )  );

                                farm_id_ray.push(new ObjectId(fa._id));

                            };

                            //        console.log(JSON.stringify(farm_id_ray) + "at getfarms/:bid farmray")

                            var farmterms = { '_id': { $in: farm_id_ray } };

                            getby('Farm', farmterms, {}, function(msg) {

                                //console.log(JSON.stringify(msg.docs)+"at getfarms/:bid farms")

                                var farms = msg.docs;

                                var toReturn = [];

                                for (var i = 0; i < buys.length; i++) {
                                    // This does not require a network access.

                                    var theFarm = null;

                                    for (var j = 0; j < farms.length; j++) {

                                        var fa = farms[j];
                                        if (fa.objectId == buys[i].farm.objectId) {
                                            theFarm = fa;
                                        }

                                    }

                                    if (theFarm != null) {

                                        //console.log("thefarm"+theFarm.name+"thefarm.id"+theFarm.id);
                                        var post = {

                                            meat: buys[i].meat,
                                            dairy: buys[i].dairy,
                                            seafood: buys[i].seafood,
                                            produce: buys[i].produce,
                                            farm: { name: theFarm.name, state_code: theFarm.state_code },
                                            ob: theFarm,
                                            buys: buys[i]

                                        };

                                        toReturn.push(post);
                                    } // null farm check

                                    // console.log(post);
                                }
                                var myResults = { result: toReturn };

                                res.status(200).send(myResults);

                            })(msg);


                        })(msg);


                    }


                }


            })(msg)


        }


    }));


}); // show farms method for widget view


var ADMINEMAIL = function(email) {

    return email == 'vanessa@greenease.co' || email == 'vanessa@vferragut@msn.com' || email == 'isethguy@gmail.com'

}

app.get('/biz_home', function(req, res) {
    var currentUser = Parse.User.current();
    console.log(currentUser);
    console.log('jack!');
    if (currentUser) {
        res.render('biz_home', { name: currentUser.get("email") });
    } else {
        res.render('biz_home', { name: "no clue" });
    }
});
/**
 * Route for business owner logins
 */
app.get('/biz_login', function(req, res) {
    res.render('biz_login', {});
});

app.post('/biz_login_authorize', function(req, res) {
    //console.log("jack");
    //console.log(req.body.username);
    Parse.User.logIn(req.body.username, req.body.password, {
        success: function(user) {
            // Do stuff after successful login.
            console.log("session is " + user.getSessionToken())
            res.render('user_auth', { sessionToken: user.getSessionToken() });
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
            res.render('error', { errorMessage: req.body.username });
        }
    });
});

/**
 * Login with GitHub route.
 *
 * When called, generate a request token and redirect the browser to GitHub.
 */
app.get('/authorize', function(req, res) {

    var tokenRequest = new TokenRequest();
    // Secure the object against public access.
    tokenRequest.setACL(restrictedAcl);
    /**
     * Save this request in a Parse Object for validation when GitHub responds
     * Use the master key because this class is protected
     */
    tokenRequest.save(null, { useMasterKey: true }).then(function(obj) {
        /**
         * Redirect the browser to GitHub for authorization.
         * This uses the objectId of the new TokenRequest as the 'state'
         *   variable in the GitHub redirect.
         */
        res.redirect(
            googleRedirectEndpoint + querystring.stringify({
                client_id: googleClientId,
                response_type: 'code',
                redirect_uri: googleRedirectURI,
                scope: 'openid profile email',
                state: obj.id
            })
        );
    }, function(error) {
        // If there's an error storing the request, render the error page.
        res.render('error', { errorMessage: 'Failed to save auth request.' });
    });

});

/**
 * OAuth Callback route.
 *
 * This is intended to be accessed via redirect from GitHub.  The request
 *   will be validated against a previously stored TokenRequest and against
 *   another GitHub endpoint, and if valid, a User will be created and/or
 *   updated with details from GitHub.  A page will be rendered which will
 *   'become' the user on the client-side and redirect to the /main page.
 */
app.get('/oauthCallback', function(req, res) {
    var data = req.query;
    var token;
    /**
     * Validate that code and state have been passed in as query parameters.
     * Render an error page if this is invalid.
     */
    if (!(data && data.code && data.state)) {
        res.render('error', { errorMessage: 'Invalid auth response received.' });
        return;
    }
    var query = new Parse.Query(TokenRequest);
    /**
     * Check if the provided state object exists as a TokenRequest
     * Use the master key as operations on TokenRequest are protected
     */
    Parse.Cloud.useMasterKey();
    Parse.Promise.as().then(function() {
        return query.get(data.state);
    }).then(function(obj) {
        // Destroy the TokenRequest before continuing.
        return obj.destroy();
    }).then(function() {
        // Validate & Exchange the code parameter for an access token from GitHub
        return getGoogleAccessToken(data.code);
    }).then(function(access) {
        /**
         * Process the response from GitHub, return either the getGitHubUserDetails
         *   promise, or reject the promise.
         */
        var githubData = access.data;
        if (githubData && githubData.access_token && githubData.token_type) {
            token = githubData.access_token;
            console.log("Token is " + token);
            return getGoogleUserDetails(token);
        } else {
            return Parse.Promise.error("Invalid access request.");
        }
    }).then(function(userDataResponse) {
        /**
         * Process the users GitHub details, return either the upsertGitHubUser
         *   promise, or reject the promise.
         */
        // TODO: make this safe - http://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object
        var userData = eval("(" + userDataResponse.text + ")");
        console.log("Variable is " + userData);
        console.log("Id is " + userData.id);
        console.log("Condition is " + (userData && userData.id));
        if (userData && userData.id) {
            return upsertGoogleUser(token, userData);
        } else {
            return Parse.Promise.error("Unable to parse Google data: " + JSON.stringify(userDataResponse));
        }
    }).then(function(user) {
        /**
         * Render a page which sets the current user on the client-side and then
         *   redirects to /main
         */
        res.render('store_auth', { sessionToken: user.getSessionToken() });
    }, function(error) {
        /**
         * If the error is an object error (e.g. from a Parse function) convert it
         *   to a string for display to the user.
         */
        if (error && error.code && error.error) {
            error = error.code + ' ' + error.error;
        }
        res.render('error', { errorMessage: JSON.stringify(error) });
    });

});

/**
 * Logged in route.
 *
 * JavaScript will validate login and call a Cloud function to get the users
 *   GitHub details using the stored access token.
 */
app.get('/main', function(req, res) {
    res.render('main', {});
});

/**
 * Attach the express app to Cloud Code to process the inbound request.
 */
//app.listen();

/**
 * One-time use function to create admin role and add jack as a member of Admins
 *
 * Will not work a second time by design because the role is already created
 */

Parse.Cloud.define('postwithtest', function(req, res) {
    var currentUser = Parse.User.current();
    //console.log("Current user is " + JSON.stringify(currentUser));

    console.log("postwithtese befroe logout--" + JSON.stringify(currentUser));


    Parse.User.logOut();

    var currentUser = Parse.User.current();
    console.log("postwithtese after logout--" + JSON.stringify(currentUser));


    res.success("seth" + JSON.stringify(currentUser));


});

app.get('/getwithtest', function(req, res) {

    var currentUser = Parse.User.current();
    //console.log("Current user is " + JSON.stringify(currentUser));

    console.log("postwithseth--" + JSON.stringify(currentUser));

    res.json("seth" + JSON.stringify(currentUser));

});


Parse.Cloud.define('makeAdmin', function(req, res) {
    var currentUser = Parse.User.current();
    //console.log("Current user is " + JSON.stringify(currentUser));
    if (currentUser && currentUser.get("email") == "jack@greenease.co") {
        console.log("User is " + currentUser.get("email"));
        /*var roleACL = new Parse.ACL();
         roleACL.setPublicReadAccess(true);
         var role = new Parse.Role("Administrator", roleACL);
         role.getUsers().add(currentUser);
         role.save();*/
        var Role = Parse.Object.extend("_Role");
        var query = new Parse.Query(Role);
        query.equalTo("name", "Administrator");
        query.first({
            success: function(role) {
                console.log("role is " + JSON.stringify(role));
                console.log(role.getUsers());
                role.getUsers().add(currentUser);

                role.save();
                console.log("Save is successful");
                res.success(currentUser);
            },
            error: function(error) {
                res.error(error.message);
            }
        })

    } else {
        res.error("User not logged in or not allowed:" + JSON.stringify(currentUser));
    }
});

Parse.Cloud.define('sendAdminEmail', function(req, response) {
    console.log("Params are: " + req.params);
    var Mandrill = require('mandrill');
    // TODO: don't save API key in source control
    Mandrill.initialize(mandrillApiKey);
    Mandrill.sendEmail({
        message: {
            text: req.params.mail + " (with unique id '" + req.params.userId + "') has requested that '" + req.params.farmName + "' be added to the database.",
            subject: "Request to add farm with name: '" + req.params.farmName + "'",
            from_email: req.params.mail,
            from_name: req.params.mail,
            to: [{
                email: "seth@greenease.co",
                name: "seth terry"
            }, {
                email: "vanessa@greenease.co",
                name: "Vanessa Ferragut"
            }]
        },
        async: true
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
            response.success("Email sent!");
        },
        error: function(httpResponse) {
            console.error(httpResponse);
            response.error("Uh oh, something went wrong");
        }
    });
});

Parse.Cloud.define('sendRequestAccessEmail', function(req, response) {

    //response.header("Access-Control-Allow-Origin", "*");
    // response.header("Access-Control-Allow-Headers", "X-Requested-With");

    var bname = req.params.name;
    var resname = req.params.resname;
    var city = req.params.city;
    var bemail = req.params.email;
    var onefarm = req.params.onefarm;

    console.log("Params are: " + bname + " " + resname + " " + bemail + " " + city + " " + onefarm);

    var Mandrill = require('mandrill');
    // TODO: don't save API key in source control
    Mandrill.initialize(mandrillApiKey);
    Mandrill.sendEmail({
        message: {
            text: bname + " would like to sign up for a greenease business acount\n" +
                " restaurant resname  :" + resname +
                "\n  restaurant email  :" + bemail +
                "\n  restaurant city  :" + city +
                "\n  restaurant onefarm  :" + onefarm,
            subject: "Request Access",
            from_email: "info@greenease.co",
            from_name: "User_Request_Access",
            to: [{
                email: "isethguy@gmail.com",
                name: "Seth Terry"
            }, {
                email: "vanessa@greenease.co",
                name: "Vanessa Ferragut"
            }]
        },
        async: true
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
            // response.success("Email sent!");

            console.log("1st email sent");

            Mandrill.sendEmail({
                message: {
                    text: "Thank you for your interest in the Greenease Business software. Note that this is a free service for those chefs, restaurateurs, and buyers who support local farms. " +
                        "\n\n" + "You will be contacted shortly regarding your access request" + "\n\n" +
                        "Locally yours,\n\n" +

                        "The Greenease Team\n\n" +

                        "~~~~~~~~~~~~"

                    ,
                    subject: "Interest in Greenease Business",
                    from_email: "info@greenease.co",
                    from_name: "The Greenease Team",
                    to: [{
                            email: bemail,
                            name: bname
                        }

                    ]
                },
                async: true
            }, {
                success: function(httpResponse) {
                    console.log(httpResponse);

                    console.log(" 20nd Email sent!");

                    response.success(" 2nd Email sent!");

                },
                error: function(httpResponse) {
                    console.error(httpResponse);
                    response.error("Uh oh, something went wrong");
                }
            });


        },
        error: function(httpResponse) {
            console.error(httpResponse);
            response.error("Uh oh, something went wrong");
        }
    });
});


Parse.Cloud.define('sendForgotPasswordEmail', function(req, response) {

    var ToEamil = req.params.ToEmail;

    console.log("Params are: " + ToEmail);

    var Mandrill = require('mandrill');
    // TODO: don't save API key in source control
    Mandrill.initialize(mandrillApiKey);
    Mandrill.sendEmail({
        message: {
            text: "Woops ! please follow the link below to reset your password \n" +
                " http://greenease-business.parseapp.com/welcome.html ",
            subject: "Forgot Password",
            from_email: "info@greenease.co",
            from_name: "ForgotPassword",
            to: [{
                email: ToEmail,
            }]
        },
        async: true
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
            response.success("Email sent!");
        },
        error: function(httpResponse) {
            console.error(httpResponse);
            response.error("Uh oh, something went wrong");
        }
    });

});


Parse.Cloud.define('sendSetPasswordEmail', function(req, res) {
    console.log("Params are: " + req.params.email);
    Parse.User.requestPasswordReset(req.params.email, {
        success: function() {

            res.success("Sent password reset email to " + req.params.email + "!");
            // Password reset request was sent successfully

        },
        error: function(error) {
            // Show the error message somewhere
            res.error("Error: " + error.code + " " + error.message);
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

/**
 * Allow admins to create user accounts for Business owners
 *
 * TODO: make this generic for all possible business users
 *
 */
Parse.Cloud.define('createBusinessAccounts', function(request, response) {
    Parse.Cloud.useMasterKey();
    var queryRole = new Parse.Query(Parse.Role);
    queryRole.equalTo('name', 'Administrator');
    queryRole.first({
        success: function(result) { // Role Object
            var role = result;
            var adminRelation = new Parse.Relation(role, 'users');
            var queryAdmins = adminRelation.query();
            queryAdmins.equalTo('objectId', Parse.User.current().id);
            queryAdmins.first({
                success: function(result) { // User Object
                    var user = result;
                    if (user) {
                        var Business = Parse.Object.extend("Business");
                        var query = new Parse.Query(Business);
                        query.exists("owner_email");
                        query.equalTo("owner_created", false);
                        query.first({
                            success: function(object) {
                                var password = new Buffer(24);
                                _.times(24, function(i) {
                                    password.set(i, _.random(0, 255));
                                });
                                // Sign up the new user with a random password
                                var user = new Parse.User();
                                console.log("Owner email is " + object.get("owner_email"));
                                user.set("username", object.get("owner_email"));
                                user.set("password", password.toString('base64'));

                                user.set("email", object.get("owner_email"));

                                user.set("created_by_admin", true);
                                user.signUp(null, {
                                    success: function(user) {
                                        var bizACL = new Parse.ACL();
                                        bizACL.setWriteAccess(user, true);
                                        bizACL.setWriteAccess(role, true);
                                        bizACL.setReadAccess(user, true);
                                        bizACL.setReadAccess(role, true);
                                        object.setACL(bizACL);
                                        var relation = object.relation("managedBy");
                                        relation.add(user);
                                        object.set("owner_created", true);
                                        object.save();
                                        response.success("User " + user.get("email") + " created and linked to " + object.get("business"));
                                    },
                                    error: function(user, error) {
                                        // Show the error message somewhere and let the user try again.
                                        alert("Error 001: " + error.code + " " + error.message);
                                        response.error("Error 001: " + error.code + " " + error.message);
                                    }
                                });
                            },
                            error: function(error) {
                                alert("Error 002: " + error.code + " " + error.message);
                                response.error("Error 002: " + error.code + " " + error.message);
                            }
                        });

                    } else {
                        response.error('User not Administrator!');
                    }
                }
            });
        },
        error: function(error) {
            response.error("User not logged in or not administrator");
        }
    });

});


function qset() {


}


Parse.Cloud.define('usersignup', function(req, response) {
    Parse.Cloud.useMasterKey();

    var email = req.params.email;
    var pass = req.params.password;


    var UsrBiz = Parse.Object.extend("userbusiness");

    var usrbizq = new Parse.Query(UsrBiz);

    usrbizq.equalTo('email', email);

    usrbizq.find({
        success: function(ublinks) {
            Parse.Cloud.useMasterKey();

            if (ublinks.length > 0) {

                var User = Parse.Object.extend("User");

                var nu = new User();
                nu.set('username', email);
                nu.set('email', email);
                nu.set('password', pass);

                nu.save(null, {
                    success: function(user) {


                        console.log(' links 1  ' + JSON.stringify(ublinks));

                        for (var i = 0; i < ublinks.length; i++) {
                            var ubl = ublinks[i];

                            ubl.set('uid', user.id);

                            //console.log(JSON.stringify(user)+"    and "+user.objectId+"   and   "+user.get('objectId')   );
                        }; // link loop

                        console.log(' links 2  ' + JSON.stringify(ublinks));


                        UsrBiz.saveAll(ublinks, {
                            success: function(relations) {


                                response.success({ 'rels': relations, 'user': user });


                            }, //usr biz savall
                            error: function(relation, error) {
                                response.success(relation);

                            }


                        });


                    }, // user save
                    error: function(relation, error) {

                        response.error(error.message);


                    }
                });


            } else {
                response.success(["no link found"]);
            } // ck if admin assign this email a business yet  

        }, //userbiz look up
        error: function(object, error) {
            response.error(error.message);
        }
    });


    //   var query = new Parse.Query(Business);

}); //usersignup


Parse.Cloud.define('setsignup', function(req, response) {
    Parse.Cloud.useMasterKey();

    var email = req.params.email;
    var pass = req.params.password;
    var queryRole = new Parse.Query(Parse.Role);
    queryRole.equalTo('name', 'Administrator');
    queryRole.first({
        success: function(result) { // Role Object
            var role = result;

            var Business = Parse.Object.extend("Business");
            var query = new Parse.Query(Business);
            query.equalTo("owner_email", email);
            query.first({
                success: function(object) {

                    // Sign up the new user with a random password
                    var user = new Parse.User();
                    user.set("username", object.get("owner_email"));
                    user.set("password", pass);

                    user.set("email", object.get("owner_email"));

                    user.set("created_by_admin", true);
                    user.signUp(null, {
                        success: function(user) {
                            var bizACL = new Parse.ACL();
                            bizACL.setWriteAccess(user, true);
                            bizACL.setWriteAccess(role, true);
                            bizACL.setReadAccess(user, true);
                            bizACL.setReadAccess(role, true);
                            object.setACL(bizACL);
                            var relation = object.relation("managedBy");
                            relation.add(user);
                            object.set("owner_created", true);
                            object.save();

                            console.log("User " + user.get("email") + " created and linked to " + object.get("business"));

                            response.success("signup");
                        },
                        error: function(user, error) {
                            // Show the error message somewhere and let the user try again.
                            alert("Error 001: " + error.code + " " + error.message);
                            response.error("Error 001: " + error.code + " " + error.message);
                        }
                    });
                },
                error: function(error) {
                    alert("Error 002: " + error.code + " " + error.message);
                    response.error("Error 002: " + error.code + " " + error.message);
                }
            });


        },
        error: function(error) {
            response.error("User not logged in or not administrator");
        }
    });

});


Parse.Cloud.define('logout', function(request, response) {
    //console.log("user is " + request.user.get("email"));
    var currentUser = Parse.User.current();
    if (currentUser) {
        console.log("Logging out user...");
        Parse.User.logOut();
        console.log("Current user is now: " + Parse.User.current());
        response.success("Success");
    } else {
        response.success("No user was logged in");
    }
});

Parse.Cloud.define('getCurrentUser', function(request, response) {
    console.log("user is " + request.user);
    var currentUser = Parse.User.current();
    if (currentUser) {
        response.success(currentUser);
    } else {
        response.error("User not logged in or not allowed:" + JSON.stringify(currentUser));
    }
});


app.get('/ckforUser/:email', function(req, res) {

    var query = {
        email: req.param('email')
    };

    mongoMsg(getby('User', query, {}, function(msg) {

        //var term = req.param('term');

        var results = msg.docs;

        if (results.length == 0) {


            sendintro(req, res);

        } else {

            res.json(results[0]);


        } // if user is or not there 

    }));

}); // ckforUser 


app.get('/ckforUser2/:email', function(req, res) {
    // get user relations base on uid

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    Parse.Cloud.run('sendintro', { 'email': req.params.email }, {

        success: function(sendres) {
            // ratings should be 4.5

            res.json(sendres);

        },
        error: function(error) {
            res.send(JSON.stringify(error));

        }
    });

}); // ckforUser 


app.get('/emailUserUpdate/:update', function(req, res) {
    // get user relations base on uid

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var update = JSON.parse(req.params.update);
    var text = JSON.parse(req.params.update).msg

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

    // setup e-mail data with unicode symbols

    var mailOptions = {
        from: '" Greenease " <info@greenease.co>', // sender address
        to: 'vanessa@greenease.co , isethguy@gmail.com', // list of receivers
        subject: update.bid, // Subject line


        text: text, // plaintext body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.json(error);

            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        res.json(info);

    });

}); // ckforUser 


var sendintro = function(req, res) {

    var toemail = req.params.email

    //  var uemail = currentUser.get("email");

    var text = "Hello and welcome to the Greenease Business software - a free service for our chefs, restaurateurs, and buyers who support local farms." + "\n" + "\n" + "To begin, please click here to set your password: " + Signupurl + "/" + toemail + "\n" + "\n" + "After you have created a password you may access Greenease Business in the future at:" + "\n" + "https://business.greenease.co." + "\n" + "\n" + "Instructions:" + "\n" + "\n" + "Once you are logged in you\'ll be able to access the Greenease database and start adding your farms and purveyors. " + "\n" + "On the left hand side start typing in a farm name. When the farm box up box opens, select that category check box you\'re buying, hit \"save,\" and \"ok.\" " + "\n" + "You may also add notes to your update if you like. " + "\n" + "To delete a farm again type the farm name in. When the box pops up, de-select that category you have stopped buying." + "\n" + "If you cannot find a farm after typing in the full name, you may request to add the farm. Please allow us 24-48 hours to verify the farm information. " + "\n" + "The History page allows chefs to track their historical farm buying habits. Stay tuned for a way to place additional orders in the future. " + "\n" + "The Widgets Page creates a fun and creative way to display your farms. If you are interested in embedding this image on your own website, you may click on the Pay Pal button and for $9.99 a month Greenease Business will help you communicate and advertise your farms to your own consumers." + "\n" + "All farm updates are populated in real time on the Greenease mobile app." + "\n" + "\n" + "If you have any questions or concerns you may contact the tech team at info@greenease.co."

    +"\n" + "\n" + "Thank you for buying local and being part of our community."

    + "\n" + "\n" + "Locally yours,"

    + "\n" + "\n" + "The Greenease Team";


    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

    // setup e-mail data with unicode symbols

    var mailOptions = {
        from: '" Greenease " <info@greenease.co>', // sender address
        to: toemail, // list of receivers
        subject: 'Welcome to Greenease Business', // Subject line

        text: text, // plaintext body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {

        if (error) {

            res.json(error);

            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        res.json(info);

    });

}


app.get('sendintro/:uemail', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    sendintro(req, res);

});


app.get('/getFarmById/:fid', function(req, res) {

    var fid = req.params.fid;

    // console.log("getFarmById  ::   " + fid)


    MongoClient.connect(databaseUri, function(err, db) {
        // Get the collection
        if (err) res.json(err);

        if (db) {

            findby(db, "Farm", { _id: new ObjectId(fid) }, {}, function(docs, err) {

                res.json({
                    err: err,
                    docs: docs
                });

            })
        }
    });


}); // getFarmById

app.get('/newphrecs2/:bid/:fid/:pros/:note/:milli', function(req, res) {
    var newphray = [];

    console.log("Adding purchase histroy record with data:");
    console.log(res.params);

    var newphs = JSON.parse(req.param('pros'));

    var PurHis = "PurchaseHistory";

    for (var i = 0; i < newphs.length; i++) {

        var phr = newphs[i];

        var newrec = {};

        newrec["business"] = {
            _id: req.param('bid')
        };

        newrec["farm"] = {
            _id: req.param('fid')
        };

        console.log("at rec creation   ::  " + phr.name + "   " + phr.value + "  :  ac  :  " + actioncode(phr.value));

        newrec["actionCode"] = actioncode(phr.value);
        newrec["category"] = phr.name;
        newrec["note"] = req.param('note');

        var effectiveDate = new Date(parseFloat(req.param('milli'))).toISOString();

        console.log("effective date is");
        console.log(effectiveDate);
        newrec["actionEffectiveDate"] = { "__type": "Date", "iso": effectiveDate };
        // save all    
        newphray.push(newrec);

    }; // new purhis rec loop

    MongoClient.connect(databaseUri, function(err, db) {
        // Get the collection

        if (err) res.json(err);
        var col = db.collection('PurchaseHistory');

        col.insertMany(newphray, function(err, r) {
            //test.equal(null, err);
            //test.equal(2, r.insertedCount);

            res.json({
                err: err,
                r: r
            });

            // Finish up test
            db.close();
        });
    });

}); // add new purhis rec


app.get('/newphrecs/:bid/:fid/:pros/:note/:milli', function(req, res) {
    var newphray = [];


    console.log("Adding purchase histroy record with data:");
    console.log(res.params);

    var newphs = JSON.parse(req.param('pros'));

    var PurHis = Parse.Object.extend("PurchaseHistory");
    var parseACL = new Parse.ACL();
    parseACL.setPublicReadAccess(true);
    // may need to add something incase
    // some one adds a note or changes date but doesnot chang a product status 

    for (var i = 0; i < newphs.length; i++) {

        var phr = newphs[i];

        var newrec = new PurHis({
            ACL: parseACL
        });

        newrec.set("business", {
            __type: "Pointer",
            className: "Business",
            objectId: req.param('bid'),
            _id: req.param('bid')
        });

        newrec.set("farm", {
            __type: "Pointer",
            className: "Farm",
            objectId: req.param('fid'),
            _id: req.param('bid')

        });

        console.log("at rec creation   ::  " + phr.name + "   " + phr.value + "  :  ac  :  " + actioncode(phr.value));

        newrec.set("actionCode", actioncode(phr.value));
        newrec.set("category", phr.name);
        newrec.set("note", req.param('note'));

        var effectiveDate = new Date();

        effectiveDate.setTime(parseFloat(req.param('milli')));

        console.log("effective date is");
        console.log(effectiveDate);
        newrec.set("actionEffectiveDate", effectiveDate);
        // save all    
        newphray.push(newrec);

    }; // new purhis rec loop

    Parse.Object.saveAll(newphray, {
        success: function(relation) {
            res.json(relation);
        },
        error: function(relation, error) {
            res.send(relation);

        }
    });

}); // add new purhis rec

function actioncode(bo) {

    if (bo) return 1;

    return 0;
} //action code 


app.get('/sendfaupdate/:bid/:fid/:pros', function(req, res) {
    //alert(req.query.bid);

    var prolist = JSON.parse(req.param('pros'));

    //var prolist = JSON.parse( "[{\"name\": \"meat\"}, {\"name\": \"produce\"}, {\"name\": \"seafood\", \"value\": true}, {\"name\": \"dairy\"}]" );

    console.log(req.param('pros') + "   prolist  " + prolist.length);

    console.log(req.param('bid') + "   prolist  " + req.param('fid'));

    var terms = { 'business._id': req.params.bid, 'farm._id': req.params.fid };

    mongoMsg(getby('BuysFrom', terms, {}, function(msg) {

        console.log(JSON.stringify(msg.docs));

        var docs = msg.docs

        if (docs.length > 0) {
            console.log("found existing purchase record - returning it!  " + JSON.stringify(docs));

            var found = docs[0];

            console.log("   big find :: " + JSON.stringify(docs[0]));

            for (var i = 0; i < prolist.length; i++) {
                var pro = prolist[i];
                console.log(" proloop 1 " + pro.name + "  : " + pro.value)
                    //found.set(pro.name,pro.value);
                found[pro.name] = pro.value;

            }; //pro loop

            var fndbuys_id = found._id;

            delete found._id;

            updateDocumentbyid(msg.db, 'BuysFrom', fndbuys_id, found, function(sertresult) {

                res.json({ 'msg': 'Farm updated', 'rel': sertresult });

            }); //updatedocuments


        } //if found at least one
        else {
            console.log("No existing purchase record found - add one");
            // TODO: verify user is adding a purchase record for a farm he/she owns - right now this is handled on the client

            //var parseACL = new Parse.ACL();
            //parseACL.setPublicReadAccess(true);
            // parseACL.setPublicWriteAccess(true);
            var buysFrom = {}; //new BuysFrom({
            //  ACL: parseACL
            //});

            // buysFrom['ACL'] = parseACL
            buysFrom["business"] = {
                _id: req.param('bid')
            };

            buysFrom["farm"] = {
                _id: req.param('fid')
            };


            for (var i = 0; i < prolist.length; i++) {
                var pro = prolist[i];
                console.log("  proloop 2 " + pro.name + "  : " + pro.value)

                buysFrom[pro.name] = pro.value;

            }; //pro loop

            sertobj('BuysFrom', buysFrom, function(msg) {

                res.json({ 'msg': 'Farm updated', 'rel': msg.result });

            })(msg); // sert obj

        } //else

    }));
    ///STOP STOP


}); // sendfarmupdate

/*
app.get('/sendfaupdate/:bid/:fid/:pros', function(req,res) {
    //alert(req.query.bid);
  
var prolist = JSON.parse( req.param('pros') );

//var prolist = JSON.parse( "[{\"name\": \"meat\"}, {\"name\": \"produce\"}, {\"name\": \"seafood\", \"value\": true}, {\"name\": \"dairy\"}]" );

console.log(req.param('pros')+"   prolist  "+prolist.length);

console.log(req.param('bid')+"   prolist  "+req.param('fid'));

        var buysFromQuery = new Parse.Query("BuysFrom");
        buysFromQuery.equalTo("farm", {
            __type: "Pointer",
            className: "Farm",
            objectId: req.param('fid')
        });
        buysFromQuery.equalTo("business", {
            __type: "Pointer",
            className: "Business",
            objectId: req.param('bid')
        });
        buysFromQuery.first({
            success: function (results) {
                if (results) {
                    console.log("found existing purchase record - returning it!  "+ JSON.stringify(  results ) );
      
var found = results;      

               console.log("   big find :: "+ JSON.stringify(found ) );

for (var i = 0; i < prolist.length; i++) {
  var pro = prolist[i];
console.log("  proloop 1 "+pro.name+"  : "+pro.value)
found.set(pro.name,pro.value);

};//pro loop

                          results.save(null, {
                        success: function (relation) {

                            res.json({'msg':'Farm updated','rel':relation});
                        },
                        error: function (relation, error) {
                            res.error(error.message);
                        }
                    });

                }
                else {
                    console.log("No existing purchase record found - add one");
                    // TODO: verify user is adding a purchase record for a farm he/she owns - right now this is handled on the client
                    var BuysFrom = Parse.Object.extend("BuysFrom");
                    var parseACL = new Parse.ACL();
                    parseACL.setPublicReadAccess(true);
                    parseACL.setPublicWriteAccess(true);
                    var buysFrom = new BuysFrom({
                        ACL: parseACL
                    });
                    buysFrom.set("business", {
                        __type: "Pointer",
                        className: "Business",
                        objectId: req.param('bid')
                    });
                    buysFrom.set("farm", {
                        __type: "Pointer",
                        className: "Farm",
                        objectId: req.param('fid')
                    });


for (var i = 0; i < prolist.length; i++) {
  var pro = prolist[i];
console.log("  proloop 2 "+pro.name+"  : "+pro.value)

buysFrom.set(pro.name,pro.value);

};//pro loop


                    buysFrom.save(null, {
                        success: function (relation) {


                            res.json({'msg':'Farm updated','rel':relation});
                        },
                        error: function (relation, error) {
                            res.error(error.message);
                        }
                    });
                }
            },
            error: function (r_error) {
                res.error("Couldn't check for existing purchase from record: " + r_error.message);
            }
        });

///STOP STOP


});// sendfarmupdate
*/

Parse.Cloud.define('addBuysFromRelationship', function(request, response) {
    var currentUser = Parse.User.current();
    console.log("seth addds buys from");

    if (currentUser) {
        // look for a record that already exists
        var buysFromQuery = new Parse.Query("BuysFrom");
        buysFromQuery.equalTo("farm", {
            __type: "Pointer",
            className: "Farm",
            objectId: request.params.farmId
        });
        buysFromQuery.equalTo("business", {
            __type: "Pointer",
            className: "Business",
            objectId: request.params.bizId
        });
        buysFromQuery.first({
            success: function(results) {
                if (results) {
                    console.log("found existing purchase record - returning it!");
                    response.success(results);
                } else {
                    console.log("No existing purchase record found - add one");
                    // TODO: verify user is adding a purchase record for a farm he/she owns - right now this is handled on the client
                    var BuysFrom = Parse.Object.extend("BuysFrom");
                    var parseACL = new Parse.ACL();
                    parseACL.setPublicReadAccess(true);
                    parseACL.setPublicWriteAccess(true);
                    var buysFrom = new BuysFrom({
                        ACL: parseACL
                    });
                    buysFrom.set("business", {
                        __type: "Pointer",
                        className: "Business",
                        objectId: request.params.bizId
                    });
                    buysFrom.set("farm", {
                        __type: "Pointer",
                        className: "Farm",
                        objectId: request.params.farmId
                    });
                    buysFrom.save(null, {
                        success: function(relation) {


                            response.success(relation);
                        },
                        error: function(relation, error) {
                            response.error(error.message);
                        }
                    });
                }
            },
            error: function(r_error) {
                response.error("Couldn't check for existing purchase from record: " + r_error.message);
            }
        });


    } else {
        response.error("You must be logged in!");
    }
});

/**
 * Create a buying relationship
 */
Parse.Cloud.define('updateBuysFromRelationship', function(request, response) {
    var currentUser = Parse.User.current();
    if (currentUser) {
        var buysFromQuery = new Parse.Query("BuysFrom");
        buysFromQuery.equalTo("objectId", request.params.buysFromId);
        buysFromQuery.first({
            success: function(buy_from) {
                //console.log("Found existing purchase record JACK: " + JSON.stringify(buy_from));
                if (request.params.category == "meat") {
                    buy_from.set("meat", request.params.setTo);
                } else if (request.params.category == "produce") {
                    buy_from.set("produce", request.params.setTo);
                } else if (request.params.category == "seafood") {
                    buy_from.set("seafood", request.params.setTo);
                } else if (request.params.category == "dairy") {
                    buy_from.set("dairy", request.params.setTo);
                } else {
                    response.error("Unknown purchase category: " + request.params.category);
                }
                buy_from.save(null, {
                    success: function(relation) {
                        gBiz(buy_from.get("business").id);
                        console.log("bfarms " + bfarms(buy_from.get("business").id));
                        // Execute any logic that should take place after the object is saved.
                        //alert('New object created with objectId: ' + relation.id);
                        response.success(relation);
                    },
                    error: function(relation, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        //alert('Failed to create new object, with error code: ' + error.message);
                        response.error(error.message);
                    }
                });
                //  response.success(request.params.buysFromId + " updated");
            },
            error: function(r_error) {
                response.error("Add relationship with function 'addBuysFromRelationship' before setting purchase " +
                    "categories: " + r_error.message);
            }
        });
    } else {
        response.error("You must be logged in!");
    }
});


var bfarms = function(tbid) {
        console.log("bfarms")

        Parse.Cloud.run('getFarms', { bid: tbid }, {
            success: function(farms) {
                console.log("sethfarms" + farms);
                response.success(farms);

                return farms;
            },
            error: function(error) {}
        });


    } //bfarms


var gBiz = function(tbid) {
        Parse.Cloud.run('getBiz', { bid: tbid }, {
            success: function(biz) {

            },
            error: function(error) {}
        });
    } //gBiz


Parse.Cloud.define('testpay', function(request, response) {

    console.log("testhitseth");
    var currentUser = Parse.User.current();
    // if(request.master){
    response.success("free");


});


Parse.Cloud.define('lookfor', function(request, response) {
    var currentUser = Parse.User.current();
    if (currentUser) {
        // if(request.master){
        Parse.Cloud.useMasterKey();
        var BusinessQuery = new Parse.Query("Business");
        BusinessQuery.matches("business", request.params.qword, "i");
        BusinessQuery.find({
            success: function(businesses) {


                response.success(businesses);
            },
            error: function(object, error) {
                response.error(error.message);
            }
        });
    }
});


Parse.Cloud.define('getBiz', function(request, response) {
    // user does NOT have to be logged in! Because this will be on public web sites with anonymous users
    var currentUser = Parse.User.current();
    if (currentUser) {
        if (!request.params.bid) {
            response.error("You must provide a business id");
        } else {

            var BusinessQuery = new Parse.Query("Business");

            BusinessQuery.get(request.params.bid, {
                success: function(biz) {

                    var buysFromQuery = new Parse.Query("BuysFrom");
                    buysFromQuery.equalTo("business", biz);
                    buysFromQuery.include("farm");
                    buysFromQuery.find({
                        success: function(farms) {

                            var FarmsJson = PreparedFarmsJson(farms, biz.get("mobileAppObjectId"), biz.get("marketCode"), biz);

                            handoff(FarmsJson);

                            response.success(farms);

                        },
                        error: function(error) {
                            response.error(error.message);
                        }
                    });
                },
                error: function(object, error) {
                    response.error(error.message);

                }
            });


        } // has business id 
    } //user auth
});

function PreparedFarmsJson(farms, bid, mark, biz) {
    var flist = new Array();
    var meat = "";
    var pro = "";
    var sea = "";
    var dairy = "";
    console.log(" before  " + biz.get("business") + " :: drug " + biz.get("drug_free") + " :: raneg " + biz.get("free_range") + " :: grass " + biz.get("grass_fed") + "  sus :: " + biz.get("sustainable_seafood") + " :: org  " + biz.get("organic"));

    var farmcerts = { drug: 0, range: 0, org: 0, grass: 0, sea: 0 };

    for (var i = 0; i < farms.length; i++) {
        var buy = farms[i];
        var ifarm = buy.get("farm");
        var im = buy.get("meat");
        var id = buy.get("dairy");
        var is = buy.get("seafood");
        var ip = buy.get("produce");
        var fname = ifarm.get("name");
        var fst = ifarm.get("state_code");

        var drugfree = ifarm.get("drug_free");
        var freerange = ifarm.get("free_range");
        var grassfed = ifarm.get("grass_fed");
        var sussea = ifarm.get("sustainable_seafood");
        var org = ifarm.get("organic");
        var stillbuysfrom = false;

        if (im) {

            meat += fname + "(" + fst + ")" + ", ";
            stillbuysfrom = true;
        }

        if (is) {
            sea += fname + "(" + fst + ")" + ", ";
            stillbuysfrom = true;
        }

        if (ip) {
            pro += fname + "(" + fst + ")" + ", ";
            stillbuysfrom = true;
        }

        if (id) {
            dairy += fname + "(" + fst + ")" + ", ";
            stillbuysfrom = true;
        }

        if (stillbuysfrom) {
            console.log(ifarm.get("name") + "   drugfree: " + drugfree + " freerange::" + freerange + "   grassfed::" + grassfed + "  sussea:" + sussea + " organic:" + org);

            if (drugfree) {
                farmcerts.drug++;
            }

            if (freerange) {
                farmcerts.range++;
            }

            if (grassfed) {
                farmcerts.grass++;
            }

            if (sussea) {
                farmcerts.sea++;
            }

            if (org) {
                farmcerts.org++;
            }

        } //some business/farm relationships are still in the
        // buys from but they don't have any of the farm category attibutes
        //set == true, so that means they don't buy from a certain farm any more
        //there for they don't have the certification anymore. 

    } //farms reduce/cat loop


    biz.set("drug_free", farmcerts.drug > 0);
    biz.set("free_range", farmcerts.range > 0);
    biz.set("grass_fed", farmcerts.grass > 0);
    biz.set("sustainable_seafood", farmcerts.sea > 0);
    biz.set("organic", farmcerts.org > 0);

    console.log(" after  " + biz.get("business") + " :: drug " + biz.get("drug_free") + " :: raneg " + biz.get("free_range") + " :: grass " + biz.get("grass_fed") + "  sus :: " + biz.get("sustainable_seafood") + " :: org  " + biz.get("organic"));

    Parse.Cloud.useMasterKey();
    biz.save();


    var rson = {
        drug_free_meats: biz.get("drug_free"),
        free_range: biz.get("free_range"),
        grass_fed: biz.get("grass_fed"),
        sustainable_seafood: biz.get("sustainable_seafood"),
        organic: biz.get("organic"),
        passid: bid,
        mark_code: mark,
        meat_farms: lstrip(meat),
        pro_farms: lstrip(pro),
        sea_farms: lstrip(sea),
        dairy_farms: lstrip(dairy),

    };

    return rson;
}


function lstrip(word) {
    if (word.indexOf(",") > -1) word = word.substring(0, word.lastIndexOf(","));
    return word;
}


function handoff(tjson) {
    //var set = {"passid":"3q3SC1cq4k","mark_code":"1"};

    var set = JSON.stringify(tjson);

    //'X-Parse-REST-API-Key': 'YzRBFRA2RiZQF2p4lhqnufmXUeirmR9RUqrwDM87',
    Parse.Cloud.httpRequest({
        url: 'https://api.parse.com/1/functions/UpdateBusinessFarms',
        method: "POST",
        headers: {
            'X-Parse-Application-Id': 'NPk6q9X5zlhrc8srJvtM2LoNYS8K36G0fUF1eB8W',
            'X-Parse-Master-Key': 'P1Ehr4dkjtpPYflqKxMxMmlT6Metx3NKoB2PuJuS'
        },
        body: JSON.stringify(tjson),


    }).then(function(httpResponse) {
        console.log(httpResponse.text);
    }, function(httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
    });

}


Parse.Cloud.define('getFarms', function(request, response) {
    // user does NOT have to be logged in! Because this will be on public web sites with anonymous users
    if (!request.params.bid) {
        response.error("You must provide a business id");
    } else {
        var BuysFrom = Parse.Object.extend("BuysFrom");
        var Business = Parse.Object.extend("Business");

        // Create a new instance of that class.
        var business = new Business();
        business.id = request.params.bid;
        console.log("Farm: ");
        console.log(business);

        var buysFromQuery = new Parse.Query(BuysFrom);
        buysFromQuery.equalTo("business", business);
        buysFromQuery.include("farm");
        buysFromQuery.find({
            success: function(farms) {
                response.success(farms);
            },
            error: function(error) {
                response.error(error.message);
            }
        });
    }
});

/**
 * Cloud function which will load a user's accessToken from TokenStorage and
 * request their details from GitHub for display on the client side.
 */
Parse.Cloud.define('getGoogleData', function(request, response) {
    if (!request.user) {
        return response.error('Must be logged in.');
    }
    var query = new Parse.Query(TokenStorage);
    query.equalTo('user', request.user);
    query.ascending('createdAt');
    Parse.Promise.as().then(function() {
        return query.first({ useMasterKey: true });
    }).then(function(tokenData) {
        if (!tokenData) {
            return Parse.Promise.error('No Google User data found.');
        }
        return getGoogleUserDetails(tokenData.get('accessToken'));
    }).then(function(userDataResponse) {
        console.log('jack');
        console.log(userDataResponse);
        var userData = userDataResponse.data;
        response.success(userData);
    }, function(error) {
        response.error(error);
    });
});

/**
 * This function is called when GitHub redirects the user back after
 *   authorization.  It calls back to GitHub to validate and exchange the code
 *   for an access token.
 */
var getGoogleAccessToken = function(code) {
    var body = querystring.stringify({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: googleRedirectURI
    });
    return Parse.Cloud.httpRequest({
        method: 'POST',
        url: googleValidateEndpoint,
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Parse.com Cloud Code'
        },
        body: body
    });
}

/**
 * This function calls the githubUserEndpoint to get the user details for the
 * provided access token, returning the promise from the httpRequest.
 */
var getGoogleUserDetails = function(accessToken) {
    return Parse.Cloud.httpRequest({
        method: 'GET',
        url: googleUserEndpoint,
        params: { access_token: accessToken },
        headers: {
            'User-Agent': 'Parse.com Cloud Code'
        }
    });
}

/**
 * This function checks to see if this GitHub user has logged in before.
 * If the user is found, update the accessToken (if necessary) and return
 *   the users session token.  If not found, return the newGitHubUser promise.
 */
var upsertGoogleUser = function(accessToken, githubData) {
    var query = new Parse.Query(TokenStorage);
    query.equalTo('googleId', githubData.id);
    query.ascending('createdAt');
    // Check if this githubId has previously logged in, using the master key
    return query.first({ useMasterKey: true }).then(function(tokenData) {
        // If not, create a new user.
        if (!tokenData) {
            return newGoogleUser(accessToken, githubData);
        }
        // If found, fetch the user.
        var user = tokenData.get('user');
        return user.fetch({ useMasterKey: true }).then(function(user) {
            // Update the accessToken if it is different.
            if (accessToken !== tokenData.get('accessToken')) {
                tokenData.set('accessToken', accessToken);
            }
            /**
             * This save will not use an API request if the token was not changed.
             * e.g. when a new user is created and upsert is called again.
             */
            return tokenData.save(null, { useMasterKey: true });
        }).then(function(obj) {
            // Return the user object.
            return Parse.Promise.as(user);
        });
    });
}

/**
 * This function creates a Parse User with a random login and password, and
 *   associates it with an object in the TokenStorage class.
 * Once completed, this will return upsertGitHubUser.  This is done to protect
 *   against a race condition:  In the rare event where 2 new users are created
 *   at the same time, only the first one will actually get used.
 */
var newGoogleUser = function(accessToken, githubData) {
    var user = new Parse.User();
    // Generate a random username and password.
    var username = new Buffer(24);
    var password = new Buffer(24);
    var primaryEmail;
    _.times(24, function(i) {
        username.set(i, _.random(0, 255));
        password.set(i, _.random(0, 255));
    });
    user.set("username", username.toString('base64'));
    user.set("password", password.toString('base64'));
    for (var i = 0; i < githubData.emails.length; i++) {
        if (githubData.emails[i].type === 'account') primaryEmail = githubData.emails[i].value;
    }
    user.set("email", primaryEmail);
    // Sign up the new User
    return user.signUp().then(function(user) {
        // create a new TokenStorage object to store the user+GitHub association.
        var ts = new TokenStorage();
        ts.set('googleId', githubData.id);
        ts.set('googleLogin', githubData.login);
        ts.set('accessToken', accessToken);
        ts.set('user', user);
        ts.setACL(restrictedAcl);
        // Use the master key because TokenStorage objects should be protected.
        return ts.save(null, { useMasterKey: true });
    }).then(function(tokenStorage) {
        return upsertGoogleUser(accessToken, githubData);
    });
}


/********************************************************************************************************/


app.listen(port, ip, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
