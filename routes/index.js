// TODO: Require Controllers...
const { Router } = require('express');
const router = Router();
const { getAllCubes } = require('../controllers/database');


router.get('/', async (req, res) => {
    const cubes = await getAllCubes();

    res.render('index', {
        title: 'Cube Workshop',
        cubes
    })
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop'
    });
});


module.exports = router;
