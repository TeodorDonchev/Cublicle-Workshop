const env = process.env.NODE_ENV || 'development';

const express = require('express');
const router = express.Router();
const { getCubeWithAccessories, getCube } = require('../controllers/database');
const Cube = require('../models/cube');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];
const { checkAuth, getUserStatus } = require('../controllers/user');

function setOptions(cube) {
    const options = [
        { name: "1 - Very Easy", isSelected: 1 === cube.difficulty },
        { name: "2 - Easy", isSelected: 2 === cube.difficulty },
        { name: "3 - Medium (Standard 3x3)", isSelected: 3 === cube.difficulty },
        { name: "4 - Intermediate", isSelected: 4 === cube.difficulty },
        { name: "5 - Expert", isSelected: 5 === cube.difficulty },
        { name: "6 - Hardcore", isSelected: 6 === cube.difficulty },
    ];

    return options;
}

router.get('/edit', checkAuth, getUserStatus, (req, res) => {
    res.render('editCubePage', {
        isLoggedIn: req.isLoggedIn
    });
})

router.get('/delete', checkAuth, getUserStatus, (req, res) => {
    res.render('deleteCubePage', {
        isLoggedIn: req.isLoggedIn
    });
})


router.get('/create', checkAuth, getUserStatus, (req, res) => {
    res.render('create', {
        title: 'Create Cube | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    });
});

router.get('/details/:id', getUserStatus, async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id);
    let isCreator = false;

    if (req.isLoggedIn) {
        const token = req.cookies['aid'];
        const userData = jwt.verify(token, config.privateKey);

        if (userData.userID == cube.creatorId) {
            isCreator = true;
        }
    }

    res.render('details', {
        title: 'Cube Details | Cube Workshop',
        ...cube,
        isLoggedIn: req.isLoggedIn,
        isCreator
    });

});

router.post('/create', checkAuth, (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body;

    const token = req.cookies['aid'];
    const user = jwt.verify(token, config.privateKey);

    const cube = new Cube({ name, description, imageUrl, difficulty: difficultyLevel, creatorId: user.userID });

    cube.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/create');
        } else {
            res.redirect('/');
        }
    });
});

router.get('/edit/:id', getUserStatus, async (req, res) => {
    const cube = await getCube(req.params.id);

    const options = setOptions(cube);

    res.render('editCubePage', {
        ...cube,
        isLoggedIn: req.isLoggedIn,
        options
    });
});

router.post('/edit/:id', getUserStatus, async (req, res) => {
    let {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body;

    difficultyLevel = Number(difficultyLevel) + 1;

    const newCube = {
        name,
        description,
        imageUrl,
        difficulty: difficultyLevel
    };

    await Cube.findByIdAndUpdate(req.params.id, newCube, {useFindAndModify: false});
    
    res.redirect(`/details/${req.params.id}`)
});

router.get('/delete/:id', getUserStatus, async (req, res) => {
    const cube = await getCube(req.params.id);

    const options = setOptions(cube);

    res.render('deleteCubePage', {
        ...cube,
        isLoggedIn: req.isLoggedIn,
        options
    });
});

router.post('/delete/:id', getUserStatus, async (req, res) => {
    await Cube.deleteOne({_id: req.params.id});

    res.redirect('/');
});

module.exports = router;