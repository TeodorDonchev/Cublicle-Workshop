const mongoose = require('mongoose');

const AccessorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    imageUrl: {
        type: String,
        required: true,
    },
    cubes: [{
        type: 'ObjectId',
        ref: 'Cube'
    }]
});

module.exports = mongoose.model('Accessory', AccessorySchema);