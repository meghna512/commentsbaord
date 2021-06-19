const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    boardname: {
        type: String,
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    access: [{uid: String, accessType: String }] 
});


BoardSchema.pre("findOne", function (next) {
    this.populate("admin");
    next();
});

const boards = mongoose.model('board', BoardSchema);

module.exports = boards;