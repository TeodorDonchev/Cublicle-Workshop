const express = require('express');
const router = express.Router();
const { getCube, getAllAccessories, attachAccessoryToCube } = require('../controllers/database');
const Accessory = require('../models/accessory');


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

module.exports = router;