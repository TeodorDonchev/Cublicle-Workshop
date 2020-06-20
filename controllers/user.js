const env = process.env.NODE_ENV || 'development';

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config')[env];

function generateToken(data) {
    const token = jwt.sign(data, config.privateKey);

    return token
}



const saveUser = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: hashedPassword
    });

    const userData = await user.save();

    const token = generateToken({
        userID: userData._id,
        username: userData.username
    });

    res.cookie('aid', token);

    return true

}

const verifyUser = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({ username });

    const status = bcrypt.compare(password, user.password);

    if (status) {
        const token = generateToken({
            userID: user._id,
            username: user.username
        })

        res.cookie('aid', token);
    }

    return status
}

const checkAuth = (req, res, next) => {
    const token = req.cookies['aid'];

    if (!token) {
        return res.redirect('/');
    }

    try {
        const userData = jwt.verify(token, config.privateKey);
        if (userData) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (e) {
        return res.redirect('/');
    }
  
}

const guestAccess = (req, res, next) => {
    const token = req.cookies['aid'];

    if (token) {
        return res.redirect('/');
    }

    next();
}

const getUserStatus = (req, res, next) => {
    const token = req.cookies['aid'];

    if (!token) {
        req.isLoggedIn = false;
    }

    try {
        const userData = jwt.verify(token, config.privateKey);
        if (userData) {
            req.isLoggedIn = true;
        } else {
            req.isLoggedIn = false;
        }
    } catch (e) {
       req.isLoggedIn = false;
    }

    next();
}

const authAccessJSON = (req, res, next) => {
    const token = req.cookies['aid'];

    if (!token) {
        res.json({
            error: "Not Authenticated"
        });
    }

    try {
        const userData = jwt.verify(token, config.privateKey);
        if (userData) {
            next();
        } else {
            res.json({
                error: "Not Authenticated"
            });
        }
    } catch (e) {
        res.json({
            error: "Not Authenticated"
        });
    }
}

module.exports = {
    saveUser,
    verifyUser,
    checkAuth, 
    guestAccess,
    getUserStatus,
    authAccessJSON
}
