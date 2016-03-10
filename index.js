// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var fs      = require('fs');
var Mongo = require('mongodb') , assert = require('assert');
var MongoClient = Mongo.MongoClient;
var ObjectId = require('mongodb').ObjectID;
var path = require('path');
var grid = require('gridfs-stream');
   var  ip = process.env.OPENSHIFT_NODEJS_IP ||
                         'localhost';
        var port      = process.env.OPENSHIFT_NODEJS_PORT   ||
                         process.env.OPENSHIFT_INTERNAL_PORT || 8080;


var mountPath = '/parse';

var url = 'http://'+ip+':'+port+''+mountPath; 

//var databaseUri  = 'mongodb://localhost:27017/ngreen';

var databaseUri = 'mongodb://admin:SLIQk4Kja2Tn@127.4.226.2:27017/gflex';
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}




var api = new ParseServer({
  databaseURI: databaseUri ,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'l7WfvYKSprD4DnGFMFqbE1VOgfQ6096PB372J3gA',
  masterKey: process.env.MASTER_KEY || 'TZCDDLCIFnLySuwOidkAgsaHF5VoXC6g0yrnQTtu', //Add your master key here. Keep it secret!
  serverURL: url  // Don't forget to change to https if needed
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix

app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});


   app.get('/readngo', function(req, res) {




         fs.readdir('./gdata', function(err, files) {

             res.setHeader('Content-Type', 'text/html');

             MongoClient.connect(databaseUri, function(err, db) {

                 for (var i = 0; i < files.length; i++) {

                    var data = JSON.parse(fs.readFileSync('./gdata/' + files[i], "utf8"));
                                    
                    console.log(JSON.stringify(data.results[0]));
                    var name = files[i].replace('.json', '');
                    console.log('');
                    console.log( name );
                    console.log('');
                    var sertray = data.results;     
                    var col = db.collection( name );

                    inmany( col , sertray );

                 }; // files loop

                              res.send(files);

             if (err) res.send(err);          

             });

             var inmany = function(col, ray) {

                     col.insertMany(ray, function(err, r) {

                        if(err)console.log(err );
                        console.log( r );

                     });// collection insert

                 } //in   many

         }); // FS FILE READ

  });//readngoo


app.get('/business', function ( req, res) {
    


var myclass = Parse.Object.extend("Business");
var query = new Parse.Query(myclass);
  //Parse.Cloud.useMasterKey();
query.limit(1000);
query.find({
    success:function(results) {
      
console.log(results);

       res.json(results);

        },error:function(error) {
      
console.log(error);


      //  alert("Error when getting objects!");
       

        }
    });

console.log(query.toJSON() );

});//"/getbusiness"





app.listen(port ,ip, 'localhost', function() {
    console.log('parse-server-example running on port ' + port + '.');
});
