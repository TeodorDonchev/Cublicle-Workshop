const express = require('express');
const router = express.Router();
const { saveUser, verifyUser } = require('../controllers/user')


router.get('/login', (req, res) => {
    res.render('loginPage');
})

router.get('/register', (req, res) => {
    res.render('registerPage');
})

router.post('/register', async (req, res) => {
   
    const status = await saveUser(req, res);

    if (status) {
        res.redirect('/');
    } else {
        res.redirect('/');
    }

})

router.post('/login', async (req, res) => {
   
    const status = await verifyUser(req, res);

    if (status) {
        res.redirect('/');
    } else {
        res.redirect('/');
    }

})

module.exports = router;