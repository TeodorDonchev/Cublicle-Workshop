// TODO: Require Controllers...
const { Router } = require('express');
const router = Router();
const { getAllCubes, getCube } = require('../controllers/database');
const Cube = require('../models/cube');

router.get('/', (req, res) => {
    getAllCubes((cubes) => {
        res.render('index', {
            title: 'Cube Workshop',
            cubes
        });
    })
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop'
    });
});


router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop'
    });
});

router.post('/create', (req, res) => {
   const {
       name,
       description,
       imageUrl,
       difficultyLevel
   } = req.body;

   const cube = new Cube (name, description, imageUrl, difficultyLevel);

   cube.save(() => {
       res.redirect('/');
   });
});


router.get('/details/:id', (req, res) => {
    getCube(req.params.id, (cube) => {
        res.render('details', {
            title: 'Cube Details | Cube Workshop',
            ...cube
        });
    });
 });

router.get('*', (req, res) => {
    res.render('404', {
        title: 'Not Found | Cube Workshop'
    });
});

module.exports = router;
