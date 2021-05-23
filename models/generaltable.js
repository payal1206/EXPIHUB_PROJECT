const mongoose = require("mongoose");

const generalqueries = new mongoose.Schema(
	{
		author: {
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "User",
			  required:true
		  },
		question: {
			type: String,
			required: true,
		},
		created:{
			type:Date,
			default:Date.now
		},
		comments: [
			{
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "CommentGeneral"
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("generalforum",generalqueries);
