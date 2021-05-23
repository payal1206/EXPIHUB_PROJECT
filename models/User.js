const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  
  lastName: {
    type: String,
    required: true,
  },
  collegeId: {
    type:String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  password: {
    type:String,
    required: true,
  },
  RepeatPassword: {
    type:String,
    required: true,
  },
  confirmed:{
    type:Boolean,
    default:false
  },
  uniqueString:{
    type:String,
    required:true
  },
  role: 
  { type: String, default: 'user' }

});

module.exports =  mongoose.model("User", UserSchema);