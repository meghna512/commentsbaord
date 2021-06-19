const router = require('express').Router();
const {setUser} = require('../middleware/user');
const {checkBoard, checkComment} = require('../middleware/board');
const {getBoard, createBoard, updateBoard, deleteBoard} = require('../controller/board');
const { createComment,updateComment, deleteComment, getComment } = require('../controller/comment');


router.use(setUser);

// //create board
 router.post('/', createBoard);

 //fetch by admin uid
router.get('/:adminUid', getBoard);

//fetch by board uid
router.get('/:boardUid', checkBoard, getBoard);

//fetch all boards
router.get('/', getBoard);

// //update board
 router.patch('/:boardUid', checkBoard, updateBoard);

// //delete board
 router.delete('/:boardUid', checkBoard, deleteBoard);

// create a comment inside a board
router.post('/:boardUid/comment', checkBoard,  createComment);

// update comment
router.patch('/:boardUid/comment/:commentUid', checkBoard, checkComment, updateComment);

// delete comment
router.delete('/:boardUid/comment/:commentUid', checkBoard, checkComment, deleteComment);

 // fetch comments
router.get('/:boardUid/comment', checkBoard, getComment);

// fect comments by commentuid
router.get('/:boardUid/comment/:commentUid', checkBoard, getComment);


module.exports = router;

