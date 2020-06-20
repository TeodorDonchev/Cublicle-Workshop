// TODO: Require Controllers...
const { Router } = require('express');
const router = Router();
const { getAllCubes } = require('../controllers/database');
const { getUserStatus } = require('../controllers/user');


router.get('/', getUserStatus, async (req, res) => {
    const cubes = await getAllCubes();

    res.render('index', {
        title: 'Cube Workshop',
        cubes,
        isLoggedIn: req.isLoggedIn
    })
});

router.get('/about', getUserStatus, (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    });
});


module.exports = router;
