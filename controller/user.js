const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models/user');


const createUser = async (req, res) => {
    const newUser = new Users();
    newUser.email = req.body.email;
    newUser.uid = shortid.generate();
    try {
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        await newUser.save();
    }
    catch (err) {
        return res.status(500).json({ "message": err.message });
    }
    const token = jwt.sign({ email: newUser.email, uid: newUser.uid}, process.env.SECRET);
    return res.status(201).json({ token });

}   


const loginUser = async (req, res) => {
    let user;
    let token;
    try {
         user = await Users.findOne({ email: req.body.email});
    } catch(err){
        return res.status(500).json({'message': err.message});
    }
    if (user) {
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
        if (passwordMatch) {
            token = jwt.sign({ email: user.email , uid: user.uid}, process.env.SECRET);

        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } else {
        return res.status(404).json({ message: 'user not found' });
    }
    return res.status(201).json({ token });
}

module.exports = {
    loginUser,
    createUser
}