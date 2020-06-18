// TODO: Require Controllers...
const { Router } = require('express');
const router = Router();
const { getAllCubes, getCube, getAllAccessories, attachAccessoryToCube, getCubeWithAccessories } = require('../controllers/database');
const Cube = require('../models/cube');
const Accessory = require('../models/accessory');

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


router.get('/details/:id', async (req, res) => {
    const cube = await getCubeWithAccessories(req.params.id);

    res.render('details', {
        title: 'Cube Details | Cube Workshop',
        ...cube
    });

});

router.get('/create/accessory', (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory | Cube Workshop'
    });
});

router.post('/create/accessory', async (req, res) => {
    const {
        name,
        description,
        imageUrl
    } = req.body;

    const accessory = new Accessory({
        name,
        description,
        imageUrl
    });

    await accessory.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/create/accessory');
        }
    });

    res.redirect('/');
});

router.get('/attach/accessory/:id', async (req, res) => {
    const cube = await getCube(req.params.id);
    let accessories = await getAllAccessories();

    const modifiedAccessories = cube.accessories.map(acc => acc._id.valueOf().toString());

    const notAttachedAccessories = accessories.filter(acc => {
        const accessoryStr = acc._id.valueOf().toString();
        return !modifiedAccessories.includes(accessoryStr);
    });

    const canAttach = accessories.length > 0 && cube.accessories.length >= accessories.length;

    res.render('attachAccessory', {
        title: 'Attach Accessory | Cube Workshop',
        ...cube,
        accessories: notAttachedAccessories,
        isFullyAttached: canAttach
    });
});

router.post('/attach/accessory/:id', async (req, res) => {
    const {
        accessory
    } = req.body

    await attachAccessoryToCube(req.params.id, accessory);

    res.redirect(`/details/${req.params.id}`)
});

router.get('*', (req, res) => {
    res.render('404', {
        title: 'Not Found | Cube Workshop'
    });
});

module.exports = router;
