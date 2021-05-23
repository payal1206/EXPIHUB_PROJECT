const mongoose = require("mongoose");

const paperdata = new mongoose.Schema({
  papercode: {
    type: String,
    required: true
  },
  
  papername: {
    type: String,
    required: true
  },
  semester: {
    type:Number,
    required: true
  },
  yearofexam: {
    type: Number,
    required: true
  },
  subject:{
    type:String,
    required: true
  },
  status:{
    type:Boolean,
    default:false
  },
  papertype:{
    type:String,
    required:true
  },
  Imagename:{
    type:String,
    required:true
  }
}, { timestamps: true })

module.exports =  mongoose.model("paper", paperdata);