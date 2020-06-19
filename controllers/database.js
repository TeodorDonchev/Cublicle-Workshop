const Cube = require('../models/cube')
const Accessory = require('../models/accessory')

const getCube = async function (id) {
    const cube = await Cube.findById(id).lean();
    return cube;
}

const getAllCubes = async function () {
    const cubes = await Cube.find().lean();
    return cubes;
}

const getAllAccessories = async function () {
    const accessories = await Accessory.find().lean();
    return accessories;
}

const getCubeWithAccessories = async function (id) {
    const cube = await Cube.findById(id).populate('accessories').lean();

    return cube;
}

const attachAccessoryToCube = async function (cubeId, accessoryId) {
    const cube = await Cube.findById(cubeId);
    const accessory = await Accessory.findById(accessoryId);

    await cube.updateOne({
        $addToSet: {
            accessories: [accessory]
        }
    });

    await accessory.updateOne({
        $addToSet: {
            cubes: [cubeId]
        }
    });

}

module.exports = {
    getCube,
    getAllCubes,
    getAllAccessories,
    attachAccessoryToCube,
    getCubeWithAccessories
}