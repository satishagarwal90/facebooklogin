// app/models/user.js

var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

	facebook : {
    	"me":	{
              "id": String, 
              "email": String, 
              "first_name": String, 
              "gender": String, 
              "last_name": String, 
              "link": String, 
              "locale": String, 
              "name": String, 
              "timezone": Number, 
              "updated_time": String, 
              "verified": Boolean
            },
        "friends":{
                    "data": [
                        {
                          "name": String, 
                          "id": String
                        }
                    ], 
                  "paging": {
                    "next": String
                  }, 
                  "summary": {
                    "total_count": Number
                  }
            }
    	}
});

/*userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password){
	return bcrypt.comapreSync(password, this.local.password);
};*/

//Create a model for users and expose it 
module.exports = mongoose.model('FBUser', userSchema);