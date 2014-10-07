// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');

var port = process.env.PORT || 8080; // set our port



app.use(bodyParser());

// routes ==================================================
require('./app/route_new')(app); // configure our routes

// config files
var db = require('./config/db');
mongoose.connect(db.url);

app.set('views', __dirname + '/client');
app.use(express.static(__dirname + '/client'));
app.set('view engine','jade');

// start app ===============================================
app.listen(port);										// startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app