const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment_head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  comment_text: {type:String}
});

module.exports = mongoose.model("Comment", commentSchema);