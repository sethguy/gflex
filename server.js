var express = require('express');
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

var bcrypt = require('bcryptjs');

var randtoken = require('rand-token');
var mandrillApiKey = 'r3VbHExcpNGbq-m2j1TP0Q';

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

//var databaseUri = 'mongodb://127.0.0.1:27017/newgreen';
//db.auth('admin','SLIQk4Kja2Tn');

//var databaseUri = 'mongodb://127.0.0.1:27017/gflex';

var databaseUri = 'mongodb://127.4.226.2:27017/gflex';

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

var updatemany = function(table, filter, set, callback) {

    return function(msg) {

        var collection = msg.db.collection(table);

        collection.updateMany(filter, { $set: set }, function(err, r) {

            msg.result = r;

            msg.err = err;

            callback(msg)

        });

    }

}

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




// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();


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

            msg.db.collection(table).removeMany(terms, function(err, docs) {

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

app.get('/spactions', function(req, res) {

    console.log(req.param('terms'));

    var terms = {}

    mongoMsg(getby("specialAction", terms, {}, function(msg) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(msg.docs));

    }));

});


app.get('/spactions/:id', function(req, res) {

    console.log(req.params.id);

    var terms = { sid: req.params.id };

    mongoMsg(getby("specialAction", terms, {}, function(msg) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(msg.docs));

    }));

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


app.get('/createDayHoursList', function(req, res) {

    mongoMsg(getby('Business', {}, {}, function(msg) {

        var bilist = msg.docs;

        var smalllist = [];

        bilist.forEach(function(bi) {

            bi.hourList = [];

            if (bi.ohours && bi.ohours.weekday_text) {

                if (bi.ohours.weekday_text.length == 7) {

                    bi.hourList = bi.ohours.weekday_text;

                } else if (bi.ohours.weekday_text.length < 7) {


                } else {

                    bi.hourList = JSON.parse(bi.ohours.weekday_text)
                }

            }

            updateDocumentbyid(msg.db, 'Business', bi._id, bi, function(result, err) {

                console.log(result);

            });

        })

    }))

});

app.get('/MigrateUserBusiness', function(req, res) {

    var query = {


    };

    mongoMsg(getby('userbusiness', query, {}, function(msg) {

            console.log()

            ublinks = msg.docs;

            var count = 0;

            ublinks.forEach(function(link) {

                    var biQuery = {
                        objectId: link.bid
                    };

                    getby('Business', biQuery, {}, function(msg) {

                        if (msg.docs && msg.docs.length > 0) {

                            link.bid = msg.docs[0]._id.valueOf();

                            sertobj('userbusiness', link, function(msg) {

                                count++;

                                console.log(link);

                                console.log(ublinks.length, count)

                            })(msg)

                        }

                    })(msg)

                }) // ublink each

        })) // 

}); // MigrateUserBusiness





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
                                    /*console.log("")
                                    console.log( JSON.stringify(start) );
                                    console.log("")
                                    if(farm) fa_id= farm._id.valueOf();
                                    if(bi) console.log(bi.business+"  :: "+bi.objectId+"  ::22 "+bi_id )
                                    console.log("")
                                    if(farm) console.log(farm.name+"  :: "+farm.objectId+"  :22: "+fa_id )
                                    console.log("")
                                    //console.log(result) */
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
    res.status(200).send(fs.readFileSync('./biForgot.html'));
});

app.post('/biForgot', function(req, res) {

    var email = req.body.email;

    mongoMsg(getby('User', { email: email }, {}, function(msg) {

        if (msg.docs.length > 0) {

            user = msg.docs[0];

            user.PasswordResetToken = randtoken.generate(16);

            sertobj('User', user, function(msg) {

                // console.log('sert token  forgot', msg.result)

                var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

                // setup e-mail data with unicode symbol

                resetEmailLink = relLink + 'biPasswordReset?token=' + user.PasswordResetToken + '&email=' + user.email

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


});

app.post('/biPassword_reset', function(req, res) {

        console.log("next:" + JSON.stringify(req.body));

        query = {
            PasswordResetToken: req.body.token
        }

        mongoMsg(getby('User', query, {}, function(msg) {

            if (msg.docs.length > 0) {

                user = msg.docs[0];

                bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {

                    user.PasswordResetToken = null;
                    delete user.PasswordResetToken

                    user.bcryptPassword = hash

                    sertobj('User', user, function(msg) {

                        console.log(msg);

                        res.setHeader('Content-Type', 'text/html');
                        res.redirect('/biPasswordReset?success=true');
                    })(msg)

                });

            } else {

                res.json({ msg: 'invalid token ' })
            }

        }))
    }) ///password_reset


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
    }) ///new mobile user

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

                    var forgotEmailText = 'Sorry to hear you forgot your password. Please click here to reset your password and start eating local today!  \n' + resetEmailLink;

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

                if (files[i].indexOf('DS') == -1) {

                    console.log(files[i], 'files')

                    var data = JSON.parse(fs.readFileSync('./mobileGdata/' + files[i], "utf8"));

                    console.log(JSON.stringify(data.results[0]));
                    var name = files[i].replace('.json', '');
                    console.log('');
                    console.log(name);
                    console.log('');
                    var sertray = data.results;
                    console.log(' sert ray length', sertray.length)
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

            getby('Business', { objectId: bid }, {}, function(msg) {

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


                if (files[i].indexOf('DS') == -1) {

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


app.post('/editfarm', function(req, res) {

    console.log(req.body);

    faob = req.body;

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


}); //get newbiz


app.get('/appface/:fbId/:acc', function(req, res) {

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

                    user.bcryptPassword = null;

                    delete user.bcryptPassword;

                    res.json(user);

                })(msg)

                console.log('user')


            } else {

                console.log('new user')

                var user = {};

                user["username"] = req.params.fbId;
                user['fbId'] = req.params.fbId;
                user['fbacc'] = req.params.acc;

                sertobj('mobileUsers', user, function(msg) {

                    svuser = msg.result.ops[0];

                    svuser.bcryptPassword = null;

                    delete svuser.bcryptPassword;

                    res.json(svuser);

                })(msg)


            }

        })) // find user by fbId

    ///res.json(httpResponse.text);

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


app.get('/deleteSpecial/:id', function(req, res) {

    //res.header("Access-Control-Allow-Origin", "*");
    //  res.header("Access-Control-Allow-Headers", "X-Requested-With");

    console.log(req.params.id)


    mongoMsg(removeby('specials', { _id: new ObjectId(req.params.id) }, null, function(msg) {

        res.json(msg.docs);

    })); // getby

}); // specialAction




var saveSpecial = function(special, callback) {

        var stuff = {};

        mongoMsg(sertobj('specials', special, function(msg) {

            console.log('saved specials ', msg)

            callback({ msg: ' special saved ' });

        })); //

    } // saveSpecial

app.get('/specialMachine/:spec', function(req, res) {

    var special = JSON.parse(req.params.spec);

    console.log('in mahcine time')

    var stuff = {};

    saveSpecial(special, function(saveRes) {

        res.json(saveRes);

    }); // save Special

}); //specialMachine

app.get('/specials', function(req, res) {

    mongoMsg(getbySort('specials', {}, {}, { updatedAt: 1 }, function(msg) {

        res.json(msg.docs);

    }));

})

app.get('/getLatestSpecials/:lat/:lng', function(req, res) {

    /* var query = {
            geoPoint: {
                $near: {
                    $geometry: { type: "Point", coordinates: [mpos.lng, mpos.lat] },
                    $maxDistance: (1609.34) * 10
                }
            }
        }*/


    getNear(req, function(closeBi) {

        var busis = closeBi.ray;


        query = {

            bid: {

                $in: busis.map(function(obj) {

                    return obj.bi._id + "";

                })

            }

        };


        console.log('llok', query)
        mongoMsg(getbySort('specials', query, {}, { updatedAt: 1 }, function(msg) {

            res.json(msg.docs);

        }));


    }); // get near

    // query.descending('updatedAt');

});


app.get('/getbibyId/:id', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    console.log('id :: ' + req.params.id)

    mongoMsg(getby('Business', { _id: new ObjectId(req.params.id) }, {}, function(msg) {

        res.json(msg.docs[0]);

    })); // getby

}); //"/getbusiness"




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


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    mongoMsg(getby('bisuggestions', { verified: { $ne: true } }, {}, function(msg) {

        console.log(msg.docs)

        fndbuys = msg.docs

        console.log(fndbuys.length + " :: find buys length");

        res.json(fndbuys);

    })); // getby

}); // getbisugs
/*



*/

app.get('/placeDetails/:place_id', function(req, res) {

    var place_id = req.params.place_id;
    //'ChIJrTLr-GyuEmsRBfy61i59si0'
    var goUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place_id + '&key=AIzaSyBSmGWirHVLVSTP-ctiUsQI4im4UR5-zqo';

    request(goUrl, function(error, response, body) {

        res.json(body );

        console.log(body);
    });

}); //getSpecialsByBid

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


app.post('/newbisug', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    mongoMsg(getby('Business', { "place_id": req.body.place_id }, {}, function(msg) {


        if (msg.docs.length > 0) {
            res.json({
                msg: "Already an existing business"
            });

        } else {

            sertobj("bisuggestions", req.body, function(msg) {
                console.log(msg.result)

                res.json({
                    msg: "Thank you for that delicious suggestion",
                    ob: msg.result.ops[0]
                });

            })(msg)

        }

    }));

}); // new bi sug

app.post('/newbiz', function(req, res) {

    var biob = req.body;

    biob.hours_json = JSON.stringify(biob.hours_json);

    console.log(biob.geo + " this is geo ");

    var prelo = biob.geo;

    //console.log('bi hours list',)
    if (biob.hourList) biob.hourList = JSON.parse(biob.hourList)
    else biob.hourList = [];

    if (biob.geo && biob.geo.lat && biob.geo.lng) biob.geoPoint = biob.geoPoint || { type: "Point", coordinates: [prelo.lng, prelo.lat] }

    biob.geo = null;

    delete biob.geo;

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

}); //get newbiz

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





app.get('/getzines', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    mongoMsg(getbySort('Cuisines', {}, {}, { name: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); //getzines




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





app.get('/setfarmvis/:buy_id/:value', function(req, res) {
    //HZL12APiR3/2LGuAOwamN/true

    var buy_id = req.params.buy_id;

    console.log("buy_id" + buy_id);


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




app.get('/quickfix', function(req, res) {
    // get user relations base on uid

    var query = {

        uid: { $type: "objectId" }
    }

    mongoMsg(getby('userbusiness', query, {}, function(msg) {

        console.log(msg.docs)

        msg.docs.forEach(function(doc) {

            doc.uid = doc.uid.valueOf() + "";

            sertobj('userbusiness', doc, function(msg) {

                console.log('save at', doc);

            })(msg)

        })

    }))

}); // crm user for email


app.get('/getlinkedbybid/:bid', function(req, res) {
    // get user relations base on uid

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

    var userbusinessQuery = {

        email: req.params.email,
        linked: true

    }

    console.log(userbusinessQuery);

    mongoMsg(getby('userbusiness', userbusinessQuery, {}, function(msg) {

        links = msg.docs;

        console.log(links)

        console.log(links.map(function(link) {
            return link._id;
        }))


        var businessQuery = {

            _id: {
                $in: links.map(function(link) {
                    return new ObjectId(link.bid);
                })

            }

        }


        mongoMsg(getby('Business', businessQuery, {}, function(msg) {
                /* fndBis.

                links.map(function(link){

                    return{rel,}

                })*/


                fndBis = msg.docs;
                res.json(fndBis.map(function(bi) {

                    return { bi: bi }

                }));


            })) //

    }));
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

        if (!paiddate) return false;

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

    console.log("unlinked stuff   ::   " + req.param('bid') + "    " + req.param('email'))

    query.equalTo("bid", req.param('bid'));
    query.equalTo("email", req.param('email'));

    query.equalTo("linked", true);

    query.include('bi');

    var userbusinessQuery = {
        linked: true,
        bid: req.params.bid,
        email: req.params.email
    };

    mongoMsg(getby('userbusiness', userbusinessQuery, {}, function(msg) {
        var urels = msg.docs;

        mongoMsg(updatemany('userbusiness', userbusinessQuery, { linked: false }, function() {

            if (urels.length === 1) {

                mongoMsg(updatemany('Business', { _id: new ObjectId(urels[0].bid) }, { islinked: false }, function() {

                    res.json({ 'msg': 'business unlinked' });

                }))

            } else {

                res.json({ 'msg': 'business unlinked' });

            }

        }))

    }));

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
        },
        'removed': { $ne: true }
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


var getNear = function(req, calli) {

        var lat = req.param('lat');
        var lng = req.param('lng');

        var query = {
            geoPoint: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: (1609.34) * 5
                }
            },
            'removed': { $ne: true }
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

                calli(back);
            }

        })); // getby

        // Final list of objects

    } // get near function;


app.get('/getnear/:lat/:lng', function(req, res) {

    getNear(req, function(closeBi) {

        res.json(closeBi);

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

    var bizTerms = {
        'business': { $regex: ".*" + req.param('term') + ".*", $options: "i" },
        'removed': { $ne: true }
    }

    console.log("@bizsearch :: " + JSON.stringify(bizTerms))

    mongoMsg(getby('Business', bizTerms, {}, function(msg) {

        res.json(msg.docs);

    })); // getby

}); //"/bizsearch"


app.get('/getclosehoods/:lat/:lng', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log('here')
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
        },
        'removed': { $ne: true }
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
        },
        'removed': { $ne: true }
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
        },
        'removed': { $ne: true }
    }

    console.log('query :', query);

    // var getbySort = function(table, terms, ops, sort, calli) {

    mongoMsg(getbySort('Business', query, {}, { business: 1 },

        function(msg) {

            res.json(msg.docs);

        }));

}); // get close hoods


app.get('/faceauth/:token', function(req, res) {

    var tok = req.params.token;

    var faceGraphUrl = 'https://graph.facebook.com/oauth/access_token?format=json&grant_type=fb_exchange_token&client_id=949243931828808&client_secret=a30d1c940a494f85aa9677b14e36ef65&fb_exchange_token=' + tok;

    request(faceGraphUrl, function(error, response, body) {

        res.json({ text: body });

        console.log(body);
    });

    // url:'https://graph.facebook.com/oauth/access_token?format=json&grant_type=fb_exchange_token&client_id=949243931828808&client_secret=a30d1c940a494f85aa9677b14e36ef65&fb_exchange_token=' + tok,

}); // aceauth

app.post('/facepost', function(req, res) {

    var tok = req.body.token;
    var msg = req.body.msg;

    var link = req.body.link;

    var form = { 'access_token': tok, 'format': 'json', 'message': msg };

    if (msg.link) form.link = link;

    request.post({
            url: 'https://graph.facebook.com/v2.5/me/feed',
            form: form
        },
        function(err, httpResponse, body) {

            res.json(httpResponse);

        })

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
        },
        'removed': { $ne: true }
    }

    query.cuisine = cterm;
    //STARTEDHERE
    mongoMsg(getbySort('Business', query, {}, { name: 1 }, function(msg) {

        res.json(msg.docs);

    }))


}); //"/getbusiness"




app.get('/getSpecialsByBid/:bid', function(req, res) {

    var bid = req.params.bid;

    query = {
        bid: bid
    };

    mongoMsg(getby('specials', query, {}, function(msg) {

        var specials = msg.docs;

        res.json(specials);

    })); // 

}); //getSpecialsByBid


app.get('/ckses/:id', function(req, res) {

    var id = req.params.id;

    var mongoget = function(table, terms, ops, calli) {

            return function(db) {

                db.collection(table).find(terms).toArray(function(err, docs) {

                    calli(docs, err);

                });

            }

        } //getby

    mongogetdb(mongoget('User', { "_id": new ObjectId(id) }, { bcryptPassword: 0 }, function(docs, err) {

        var fnduser = docs[0];

        res.json(fnduser);

    }));

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

    var urlstring = "https://www.paypal.com/cgi-bin/webscr";

    request.post({ url: urlstring, form: req.body }, function(err, httpResponse, body) {

        console.log(" post res " + body);

        var word = body;

        if (word === "VERIFIED") {
            console.log(uid)

            mongoMsg(getby('User', { _id: new ObjectId(uid) }, {}, function(msg) {
                console.log(msg.docs)

                fnduser = msg.docs[0];

                fnduser["paiddate"] = { iso: new Date() };

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

        console.log(farm_id_ray.length)

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

                    if (fa._id.valueOf() == buys[i].farm._id) {
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

    var userbusinessTerms = { uid: uid, bid: bid, linked: true };

    if (uid == '57b3aa33fe93ce8a393ade66' || uid == '57b3aa33fe93ce8a393ade76') userbusinessTerms = { uid: uid, bid: bid };

    console.log('userbusinessTerms', userbusinessTerms)

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

                    if (((diff < millis) && links.length > 0) || ADMINEMAIL(email)) {

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

                            //console.log(JSON.stringify(farm_id_ray) + "at getfarms/:bid farmray")

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

/**
 * Route for business owner logins
 */


/**
 * Login with GitHub route.
 *
 * When called, generate a request token and redirect the browser to GitHub.
 */

/**
 * Attach the express app to Cloud Code to process the inbound request.
 */
//app.listen();

/**
 * One-time use function to create admin role and add jack as a member of Admins
 *
 * Will not work a second time by design because the role is already created
 */




app.post('/usersignup', function(req, res) {

    var email = req.body.email;
    var pass = req.body.password;

    userQuery = {
        email: email
    }

    mongoMsg(getby('User', userQuery, {}, function(msg) {

        console.log(msg.docs.length)

        if (msg.docs.length == 0) {

            userbusinessQuery = {
                email: email
            }

            getby('userbusiness', userbusinessQuery, {}, function(msg) {

                links = msg.docs;

                if (links.length > 0) {

                    bcrypt.hash(pass, saltRounds, function(err, hash) {

                        var newUser = {
                            username: email,
                            email: email,
                            bcryptPassword: hash
                        }

                        sertobj('User', newUser, function(msg) {

                            console.log(msg);

                            saveduser = msg.result.ops[0];

                            links.forEach(function(link) {

                                link.uid = saveduser._id.valueOf();

                            }); //

                            var db = msg.db;
                            // Get the collection

                            if (err) res.json(err);

                            var col = db.collection('userbusiness');

                            UpdateFilter = {
                                '_id': {
                                    $in: links.map(function(link) {
                                        return new ObjectId(link._id);
                                    })
                                },

                            }

                            col.updateMany(UpdateFilter, { $set: { "uid": saveduser._id.valueOf() + "" } }, function(err, r) {

                                saveduser.bcryptPassword = null;
                                delete saveduser.bcryptPassword;

                                res.json({ 'rels': links, 'user': saveduser })

                            });

                        })(msg)

                    }); // bcrypt hashing


                } else {

                    res.json({ msg: ' no links found !' })

                }

            })(msg)

        } else {

            res.json({ msg: 'email or username already in system' })

        }

    }))

}); //usersignup



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

            //  results[0].bcryptPassword = null;

            // delelte results[0].bcryptPassword;


            res.json(results);


        } // if user is or not there 

    }));

}); // ckforUser 



app.post('/sendRequestAccessEmail', function(req, res) {

    //response.header("Access-Control-Allow-Origin", "*");
    // response.header("Access-Control-Allow-Headers", "X-Requested-With");

    var bname = req.body.name;
    var resname = req.body.resname;
    var city = req.body.city;
    var bemail = req.body.email;
    var onefarm = req.body.onefarm;

    console.log("body are: " + bname + " " + resname + " " + bemail + " " + city + " " + onefarm);

    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

    // setup e-mail data with unicode symbols
    //var emailMsg = 'user @ username '+user.username+' with id ::'+user._id+' said :: \n\n\n '+ userMsg+'  \n  \n \n   '+'  about '+bi.business+'('+bi._id+') \n \n'+' '+bi.address;


    var emailMsg = bname + " would like to sign up for a greenease business acount\n" +
        " restaurant resname  :" + resname +
        "\n  restaurant email  :" + bemail +
        "\n  restaurant city  :" + city +
        "\n  restaurant onefarm  :" + onefarm


    var mailOptions = {
        from: '" Greenease " <info@greenease.co>', // sender address
        to: ' vanessa@greenease.co ,isethguy@gmail.com', // list of receivers
        subject: " user request access mail", // Subject line

        text: emailMsg // plaintext body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.json(error);

            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        //res.json({msg:'thanks for the update',info:info});
        console.log("1st email sent");


        var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

        // setup e-mail data with unicode symbols
        //var emailMsg = 'user @ username '+user.username+' with id ::'+user._id+' said :: \n\n\n '+ userMsg+'  \n  \n \n   '+'  about '+bi.business+'('+bi._id+') \n \n'+' '+bi.address;


        var emailMsg = "Thank you for your interest in the Greenease Business software. Note that this is a free service for those chefs, restaurateurs, and buyers who support local farms. " +
            "\n\n" + "You will be contacted shortly regarding your access request" + "\n\n" +
            "Locally yours,\n\n" +

            "The Greenease Team\n\n" +

            "~~~~~~~~~~~~"

        var mailOptions = {
            from: '" Greenease " <info@greenease.co>', // sender address
            to: bemail, // list of receivers
            subject: "Hello from Greenease", // Subject line

            text: emailMsg // plaintext body

        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {


                res.json(error);

                return console.log(error);
            }
            console.log('Message sent: ' + info.response);


            console.log(" 20nd Email sent!");

            res.json({ msg: ' Thanks !' });

            //  res.json({ msg: 'thanks for the update', info: info });


        });


    });

});

app.post('/sendUserUpdate', function(req, res) {
    // get user relations base on uid

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var update = req.body
    var userMsg = update.msg;

    var user = update.user;

    var bi = update.bi;

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://info@greenease.co:feedmebitch@smtpout.secureserver.net');

    // setup e-mail data with unicode symbols


    var emailMsg = 'user @ username ' + user.username + ' with id ::' + user._id + ' said :: \n\n\n ' + userMsg + '  \n  \n \n   ' + '  about ' + bi.business + '(' + bi._id + ') \n \n' + ' ' + bi.address;

    var mailOptions = {
        from: '" Greenease " <info@greenease.co>', // sender address
        to: 'vanessa@greenease.co , isethguy@gmail.com', // list of receivers
        subject: update.bi.business, // Subject line

        text: emailMsg // plaintext body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.json(error);

            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        res.json({ msg: 'thanks for the update', info: info });

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

            res.json({ r: r, err: err });

            // Finish up test
            db.close();
        });
    });

}); // add new purhis rec



function actioncode(bo) {

    if (bo) return 1;

    return 0;
} //action code 


app.get('/sendfaupdate/:bid/:fid/:pros', function(req, res) {

    console.log('sendfaupdate')
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
            console.log('foundbuys rel', found)

            var fndbuys_id = found._id;

            delete found._id;


            updateDocumentbyid(msg.db, 'BuysFrom', fndbuys_id, found, function(sertresult) {

                found._id = fndbuys_id;

                res.json({ 'msg': 'Farm updated', 'rel': found });

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


function lstrip(word) {
    if (word.indexOf(",") > -1) word = word.substring(0, word.lastIndexOf(","));
    return word;
}




/********************************************************************************************************/


app.listen(port, ip, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
