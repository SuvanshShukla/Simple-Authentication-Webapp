var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/simple-auth");
var passportLocalMongooe = require("passport-local-mongoose");

// SCHEMA SETUP
var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
});

UserSchema.plugin(passportLocalMongooe);  /* OKK adds methods of passportlocalmongoose */

var user = mongoose.model("user-info",UserSchema);

module.exports = user;