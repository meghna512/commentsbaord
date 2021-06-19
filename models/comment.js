const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "board"
    },
    text : {
        type: String,
        required: true
    }
});


CommentSchema.pre("findOne", function (next) {
    this.populate("user");
    next();
});


const comments = mongoose.model('comment', CommentSchema);

module.exports = comments;