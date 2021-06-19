const app = require('express')();
const bodyParser = require('body-parser');
const queryString = require('query-string');
require('dotenv').config();
const db = require('./db');
const {router} = require('./routes/index');

db.connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    req.query = queryString.parse(req._parsedUrl.query, { parseNumbers: true, parseBooleans: true });
    return next();
});

app.use('/',router);

app.listen(process.env.PORT, () => {
    console.log("server is up at port", process.env.PORT);
});