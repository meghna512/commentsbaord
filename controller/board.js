const shortid = require('shortid');
const Boards = require('../models/board');

const createBoard = async (req, res) => {
    const newBoard = new Boards();
    newBoard.uid = shortid.generate();
    newBoard.boardname = req.body.boardname,
    newBoard.access = req.body.access;
    newBoard.admin = req.user;
    try {
        await newBoard.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ newBoard });
}

const updateBoard = async (req, res) => {
    let hasAccess = false;
    for (const r of res.locals.board.access) {
        if(req.user.uid == r.uid && r.accessType=="write"){ 
            hasAccess = true;
        }
    }
    if(req.user.uid == res.locals.board.admin.uid){
        hasAccess = true;
    }
    if(!hasAccess){
        return res.status(401).json({message: "Access denied"});
    }
    res.locals.board.boardname = req.body.boardname ? req.body.boardname : res.locals.board.boardname;
    res.locals.board.access = req.body.access ? req.body.access : res.locals.board.access;
    try {
        await res.locals.board.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({ updatedBoard: res.locals.board });
}

const deleteBoard = async (req, res) => {
    if (req.user.uid == res.locals.board.admin.uid) {
        try {
            await Boards.deleteOne({ uid: res.locals.board.uid });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(401).json({ mesage: "Unauthorised Access" });
    }
    return res.status(203).send();
}

const getBoard = async (req, res) => {
    if (res.locals.board) {
        return res.status(200).json(res.locals.board);
    }

    let boardFilter = [];
    let adminFilter = [];
    if (req.query.boardUid) {
        boardFilter = [{ "uid": { $eq: req.query.boardUid } }];
    }
    if (req.query.adminUid) {
        adminFilter = [{ "admin.uid": { $eq: req.query.adminUid } }];
    }
    let getBoard;

    try {
        getBoard = await Boards.aggregate(
            [
                {
                    $lookup: {
                        from: "users",
                        localField: "admin",
                        foreignField: "_id",
                        as: "admin"
                    }
                },
                {
                    $unwind: "$admin"
                },
                {
                    $match: {
                        $or: [
                            {
                                "access": {
                                    $elemMatch: {
                                        $and: [
                                            { accessType: { $in: ["read", "write"] } },
                                            { uid: req.user.uid }

                                        ]
                                    }
                                }
                            },
                            {
                                "admin.uid": { $eq: req.user.uid}
                            }
                        ]

                    }
                },
                {
                    $match: {
                        $and: [
                            { uid: { $ne: null } },
                            ...boardFilter,
                            ...adminFilter
                        ]
                    }
                }
            ]
        )
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(200).json(getBoard);
}


module.exports = {
    createBoard,
    updateBoard,
    deleteBoard,
    getBoard
}