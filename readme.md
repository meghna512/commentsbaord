# Discussion Board

A [Node JS](https://nodejs.org/en/) based app that provides a discussion board to its customers where he/she can add comments to the feed(similar to facebook, but much simpler). This app is built keeping in mind Role Based Access Control(RBAC) which restricts access to resources based on a user’s role i.e. only authorised users are allowed access to certain resources like create a comment on the board, edit and delete comment etc.


## Setup Locally

1. Clone discussionboard project ```https://github.com/meghna512/discussionboard.git```
2. ```npm install```
3. Create ```.env``` similar to .env.example
4. Go to terminal inside discussionboard project and run ```node index.js``` command.


## About Project

There are two entities in this project- board and comment, and there are two kinds of users- user having read access to a board and user having write access to a board.

1. Both read and write user can view all the boards and also both can create a board and the one who creates a board will be called its admin.

2. Write user can update a board and also admin can update a board(means even if admin has read access to a board still he/she can update the board).

3. Read user can not update a board and only admin of respective board can delete that board.

4. Read user can view all the comments of a board but he/she cant comment inside a board.

5. Write user is allowed to comment inside a board and also admin of that particular board can comment inside a board.
6. Only the creator of the comment can update/delete the comment.


Here is a Postman link to test different api [Postman Dashboard](https://www.getpostman.com/collections/eb8c310ada593c3bb8bf)

If you have any doubt feel free to mail me at ```knjmeghna512@gmail.com```

