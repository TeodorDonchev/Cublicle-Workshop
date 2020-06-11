const Cube = require('../models/cube');

const expampleCube = new Cube('Default', 'Default Cube Description', 'google.com', 1);

console.log(expampleCube);

expampleCube.save();