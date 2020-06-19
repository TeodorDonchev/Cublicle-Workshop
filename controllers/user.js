const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const privateKey = 'CUBE_WORKSHOP_SOFTUNI';

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

    const token = jwt.sign({
        userID: userData._id,
        username: userData.username
    }, privateKey);

    res.cookie('aid', token);

    return true

}

module.exports = {
    saveUser
}
