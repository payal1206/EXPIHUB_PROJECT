const mongoose = require("mongoose");

const admindata = new mongoose.Schema({
  BookName: {
    type: String,
    required: true,
  },
  
  AuthorName: {
    type: String,
    required: true,
  },
  Edition: {
    type:String,
    required: true,
  },
  Publications: {
    type: String,
    required: true,
  },
  status:{
    type:Boolean,
    default:false
  },
  Imagename:{
    type:String,
    required:true
  },
 role:{
    type:String,
    default:'user'
  }
}, { timestamps: true })

module.exports =  mongoose.model("data", admindata);