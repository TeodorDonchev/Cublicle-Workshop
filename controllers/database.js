const Cube = require('../models/cube')

const getCube = async function (id) {
    const cube = await Cube.findById(id).lean();
    return cube;
}

const getAllCubes =  async function() {
    const cubes = await Cube.find().lean();
    return cubes;
}


module.exports = {
    getCube,
    getAllCubes,
}