const mongoose = require("mongoose");

const academicqueries = new mongoose.Schema(
	{
		author: {
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "User"
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
			  ref: "Comment"
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("academicforum",academicqueries);
