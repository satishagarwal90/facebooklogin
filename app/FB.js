var auth = require('../config/auth.js');
var rest = require('./rest.js');
var url = require('url');
var queryString = require('querystring');

var client_id = auth.facebookAuth.clientID;
var redirect_uri = auth.facebookAuth.callbackURL;
var client_Secret = auth.facebookAuth.clientSecret;

var FBUser = require('./models/user.js');

var newUser = new FBUser();

var getProfile = false, getFriends = false;

module.exports = {
    redirectURI : 'https://www.facebook.com/dialog/oauth?client_id='+ client_id + '&redirect_uri='+redirect_uri + '&scope=',
    
    firstDone : false,
    
    secondDone : false,
    
    GetToken : function(code, res){
            	var options = {
                      host: 'graph.facebook.com',
                      port: 443,
                      path: '/oauth/access_token?client_id='+client_id+'&redirect_uri='+this.redirectURI+'&client_secret='+client_Secret+'&code='+code,
                      method: 'GET'          
                };
            	rest.getJSON(options, function(statusCode, result){
                        // GET call for FB token 
                        var obj = queryString.parse(url.parse(result).path);
                        GetFriends(obj.access_token, res);
                        GetProfileData(obj.access_token, res);
            	});
    }
}

function GetFriends(token, res){
                	var options = {
                          host: 'graph.facebook.com',
                          port: 443,
                          path: '/v2.1/me/friends?access_token='+token,
                          method: 'GET'          
                        };
                	rest.getJSON(options, function(statusCode, result) {
                        var parsedResult = JSON.parse(result);
                        if(!parsedResult.error){
                	        newUser.facebook.friends = parsedResult;
                	        getFriends = true;
                	        if(getProfile)
                                Final(res);
                        }
                        else
                        {
                            //This is the error scenario so best solution is to make the person login again.
                            res.json(parsedResult.error);
                        }
                });
}

function GetProfileData(token, res){
                    	var options = {
                              host: 'graph.facebook.com',
                              port: 443,
                              path: '/v2.1/me?access_token='+token,
                              method: 'GET'          
                        };
                    	rest.getJSON(options, function(statusCode, result) {
                            var parsedResult = JSON.parse(result);
                            if(!parsedResult.error){
                    	        newUser.facebook.me = parsedResult;
                    	        getProfile = true;
                    	        if(getFriends)
                                    Final(res);
                            }
                            else
                            {
                                //This is the error scenario so best solution is to make the person login again.
                                res.json(parsedResult.error);
                            }
                    });
}

function Final(res){
                FBUser.findOne({ 'facebook.me.id' : newUser.facebook.me.id }, function(err, user) {
        	       if (err)
	                throw err;
	               var userobj;

    	            if (user === null) {
    	                // if a user is found, log them in
    	                newUser.save(function(err) {
            	            if (err)
            	                throw err;
            	        });
            	        userobj = JSON.parse(JSON.stringify(newUser));
            	        //res.json(userobj);
            	        res.render('index',{title : 'FBAuth is working', myuser : userobj});
            	        //res.sendfile('client/friendList.html');
    	                
    	            } else {
            	        userobj = JSON.parse(JSON.stringify(user));
            	        //res.json(userobj);
            	        res.render('index',{title : 'FBAuth is working', myuser : userobj});
            	        //res.sendfile('client/friendList.html');
    	            }
            });
}