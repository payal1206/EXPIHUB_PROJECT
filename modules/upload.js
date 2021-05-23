const mongoose = require('mongoose');
var uploadSchema =new mongoose.Schema({
	imagename: String

});

var uploadModel = mongoose.model('uploadimage', uploadSchema);
module.exports=uploadModel;