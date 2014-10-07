 // app/routes.js

var auth = require('../config/auth.js');
var rest = require('./rest.js');
var url = require('url');
var queryString = require('querystring');

var client_id = auth.facebookAuth.clientID;
var redirect_uri = auth.facebookAuth.callbackURL;
var client_Secret = auth.facebookAuth.clientSecret;
var scope = 'email,user_friends';
var FBUser = require('./models/user.js');

module.exports = function(app) {
		// route for home page
	var redirectURI = 'https://www.facebook.com/dialog/oauth?client_id='+ client_id + '&redirect_uri='+redirect_uri + '&scope='+scope;
	app.get('/auth/facebook', function(req, res) {
		res.redirect(redirectURI); 
	});

	app.get('/auth/facebook/callback', function(req,res){
		var getURLPath = '/oauth/access_token?client_id='+client_id+'&redirect_uri='+redirectURI+'&client_secret='+client_Secret+'&code='+req.query.code;
		// if the user isnt in our database, create a new user
	          var      newUser         = new FBUser();
	          var first = false, second = false;
		var options = {
          host: 'graph.facebook.com',
          port: 443,
          path: getURLPath,
          method: 'GET'
          
        };
        
        var optionsNew = {
          host: 'graph.facebook.com',
          port: 443,
          path: '',//&fields=id%2Cname
          method: 'GET'
          
        };
        
        //New Code
        rest.getJSON(options,
        function(statusCode, result)
        {
            // GET call for FB token 
            var obj = queryString.parse(url.parse(result).path);
            //console.log("onResult: (" + statusCode + ")" + JSON.stringify(obj));
            
            //Get call to fetch FB user_profile info
            optionsNew.path = '/v2.1/me/friends?access_token='+obj.access_token;
            rest.getJSON(optionsNew, function(statusCode, result)
            {
                // Get call to get friends list
                //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                //res.statusCode = statusCode;
                //res.send(result);
                if(result){
                    /*var jsonResult = JSON.parse(result);
	                // set all of the relevant information
	                for(var frnd in jsonResult.data)
	                    newUser.facebook.friends.data.push(frnd);
	                newUser.facebook.friends.paging.next = jsonResult.paging.next;
	                newUser.facebook.friends.summary.total_count = jsonResult.paging.total_count;*/
	                newUser.facebook.friends = JSON.parse(result);
	                first = true;
	                if(second)
	                    final(newUser, res);
                }
            });
            
            //Get call to fetch Friend's list data.
            optionsNew.path = '/v2.1/me?access_token='+obj.access_token;
            rest.getJSON(optionsNew, function(statusCode, result)
            {
                //console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                //res.statusCode = statusCode;
                  if(newUser){
                    /*var jsonResult = JSON.parse(result);
	                newUser.facebook.me.id = jsonResult.id;
	                newUser.facebook.me.email = jsonResult.email;
	                newUser.facebook.me.first_name = jsonResult.first_name;
	                newUser.facebook.me.gender = jsonResult.gender;
	                newUser.facebook.me.last_name = jsonResult.last_name;
	                newUser.facebook.me.link = jsonResult.link;
	                newUser.facebook.me.locale = jsonResult.locale;
	                newUser.facebook.me.name = jsonResult.name;
	                newUser.facebook.me.timezone = jsonResult.timezone;
	                newUser.facebook.me.updated_time = jsonResult.updated_time;
	                newUser.facebook.me.verified = jsonResult.verified;*/
	                
	                newUser.facebook.me = JSON.parse(result);
	                second = true;
	                if(first)
	                   	   final(newUser,res);
                }
            });
        });
        
	});

	app.get('/', function(req,res){
		res.sendfile('./client/login.html');
	});
}

function final(newUser, res){
    FBUser.findOne({ 'facebook.me.id' : newUser.facebook.me.id }, function(err, user) {
	            if (err)
	                throw err;

	            if (user === null) {
	                // if a user is found, log them in
	                newUser.save(function(err) {
        	            if (err)
        	                throw err;
        	        });
        	        res.json(JSON.parse(JSON.stringify(newUser)));
	                
	            } else {
        	        res.json(JSON.parse(JSON.stringify(user)));
	            }
            });
}

/*Callbacks should never return anything since they are async and do not return immediately. If you expect a return value from a function with 
callback you will always get null cause null is returned immediately. Therefore always send final responses from callbacks and never return values or object*/