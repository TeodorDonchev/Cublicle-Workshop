const express = require('express');
const router = express.Router();
const { getCubeWithAccessories } = require('../controllers/database');
const Cube = require('../models/cube');

router.get('/edit', (req, res) => {
    res.render('editCubePage');
})

router.get('/delete', (req, res) => {
    res.render('deleteCubePage');
})


router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop'
    });
});

router.get('/details/:id', async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id);

    res.render('details', {
        title: 'Cube Details | Cube Workshop',
        ...cube
    });

});

router.post('/create', (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body;

    const cube = new Cube({ name, description, imageUrl, difficulty: difficultyLevel });

    cube.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/create');
        } else {
            res.redirect('/');
        }
    });
});


module.exports = router;