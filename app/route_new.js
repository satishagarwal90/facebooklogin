 // app/routes.js


var scope = 'email,user_friends';
var FB = require("./FB.js");

module.exports = function(app) {
		// route for home page
	
	app.get('/', function(req,res){
		res.sendfile('./client/login.html');
	});
	
	app.get('/auth/facebook', function(req, res) {
		var redirectURI = FB.redirectURI + scope;
		res.redirect(redirectURI); 
	});
	
	app.get('/auth/facebook/callback', function(req,res){		
		FB.GetToken(req.query.code, res);
	});
}

	