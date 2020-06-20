const express = require('express');
const router = express.Router();
const { getCube, getAllAccessories, attachAccessoryToCube } = require('../controllers/database');
const Accessory = require('../models/accessory');
const { checkAuth, getUserStatus } = require('../controllers/user');


router.get('/create/accessory', checkAuth, getUserStatus, (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory | Cube Workshop',
        isLoggedIn: req.isLoggedIn
    });
});

router.post('/create/accessory', checkAuth, async (req, res) => {
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

router.get('/attach/accessory/:id', checkAuth, getUserStatus, async (req, res) => {
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
        isFullyAttached: canAttach,
        isLoggedIn: req.isLoggedIn
    });
});

router.post('/attach/accessory/:id', checkAuth, async (req, res) => {
    const {
        accessory
    } = req.body

    await attachAccessoryToCube(req.params.id, accessory);

    res.redirect(`/details/${req.params.id}`)
});

module.exports = router;