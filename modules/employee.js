const mongoose = require('mongoose');


var employeeSchema =new mongoose.Schema({
	image:String
});

var employeeModel = mongoose.model('Employee', employeeSchema);
module.exports=employeeModel;