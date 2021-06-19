const jwt = require('jsonwebtoken');
const Users = require('../models/user');

const validateInput = (req, res, next) => {
    if (req.body.email && req.body.password) {
        return next();
    }
    return res.status(400).json({message: 'Please enter a valid username or password'});
}

const setUser = async (req, res, next) =>{
    if(req.headers.authorization){   //check if user is loggedin and also return user in req.user for further controllers to set owner
        const decoded = jwt.verify(req.headers.authorization, process.env.SECRET);
        try{
           req.user =  await Users.findOne({ uid : decoded.uid});
        } catch(err){
            return res.status(500).json({message: err.message});
        }
       
    }else{
        return res.status(400).json({message: "token missing"});
    }
    return next();
}


module.exports = {
    validateInput,
    setUser
};


