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

module.exports = {
    saveUser,
    verifyUser
}
