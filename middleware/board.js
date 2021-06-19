const Boards = require("../models/board");
const Comments = require("../models/comment");

const checkBoard = async (req,res, next) => {
    const boardUid = req.params.boardUid;
    let board;
    try{
        board = await Boards.findOne({uid: boardUid});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
    if(board){
        res.locals.board = board;
    }else{
        return res.status(404).json({ message: "Board not found" });
    }
    return next();
    
}

const checkComment = async (req,res, next) => {
    const commentUid = req.params.commentUid;
    let comment;
    try{
        comment = await Comments.findOne({uid: commentUid});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
    if(comment){
        res.locals.comment = comment;
    }else{
        return res.status(404).json({ message: "Comment not found" });
    }
    return next();
    
}

module.exports = {
    checkBoard,
    checkComment
}