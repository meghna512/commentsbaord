const shortid = require('shortid');
const Comments = require('../models/comment');

const createComment = async (req, res) => {
    let hasAccess = false;
    for (const r of res.locals.board.access) {
        if (req.user.uid == r.uid && (r.accessType == "write" || r.accessType == "read")) {
            hasAccess = true;
        }
    }
    if (req.user.uid == res.locals.board.admin.uid) {
        hasAccess = true;
    }
    if (!hasAccess) {
        return res.status(401).json({ message: "Access denied" });
    }
    const newComment = new Comments();
    newComment.uid = shortid.generate();
    newComment.user = req.user;
    newComment.board = res.locals.board;
    newComment.text = req.body.text;
    try {
        await newComment.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ newComment });

}

const updateComment = async (req, res) => {
    if (res.locals.comment.user.uid == req.user.uid) {
        res.locals.comment.text = req.body.text ? req.body.text : res.locals.comment.text;
    }else{
        return res.status(401).json({ message: "Access denied"})
    }

    try {
        await res.locals.comment.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ updatedComment: res.locals.comment });
}

const deleteComment = async (req, res) => {
    if (req.user.uid == res.locals.comment.user.uid) {
        try {
            await Comments.deleteOne({ uid: res.locals.comment.user.uid });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(401).json({ mesage: "Unauthorised Access" });
    }
    return res.status(203).send();

}

const getComment = async (req, res) => {
    let boardFilter = [];
    let commentFilter = [];
    let userFilter = [];
    if (req.params.boardUid) {
        boardFilter = [{ "board.uid": { $eq: req.params.boardUid } }]
    }
    if (req.params.commentUid) {
        commentFilter = [{ "uid": { $eq: req.params.commentUid } }]
    }
   
    let getComment = await Comments.aggregate([

        {
            $lookup: {
                from: "boards",
                localField: "board",
                foreignField: "_id",
                as: "board"
            }
        },

        {
            $unwind: "$board"
        },
        {
            $lookup: {
                from: "users",
                localField: "board.admin",
                foreignField: "_id",
                as: "board.admin"
            }
        },
        {
            $unwind: "$board.admin"
        },
        {
            $match: {
                $or: [
                    {
                        "board.access": {
                            $elemMatch: {
                                $and: [
                                    { accessType: { $in: ["read", "write"] } },
                                    { uid: req.user.uid }

                                ]
                            }
                        }
                    },
                    {
                        "board.admin.uid": { $eq: req.user.uid }
                    }
                ]

            }
        },
        {
            $match: {
                $and: [
                    { uid: { $ne: null } },
                    ...boardFilter,
                    ...commentFilter
                ]
            }
        }

    ]);
    return res.status(200).json(getComment);
}


module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getComment
}