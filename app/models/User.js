var mongoose = require('mongoose');  
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password : {type:String, required : true},
  company: { type: String, required: true },
  designation: { type: String, required: true },
},{collection : 'users'});

userSchema.plugin(uniqueValidator, { message: 'Email address must be unique' })
mongoose.model('User', userSchema);

module.exports = mongoose.model('User');
