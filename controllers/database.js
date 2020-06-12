const fs = require('fs');
const path = require('path');

const database = path.join(__dirname, '..', 'config/database.json');

const saveCube = (cube, callback) => {

    getAllCubes((cubes) => {
        cubes.push(cube);

        fs.writeFile(database, JSON.stringify(cubes), error => {
            if (error) {
                throw error;
            }
            console.log('Cube is succesfully stored.');
        });

        callback();
    })
}

const getCube = (id, callback) => {
    getAllCubes((cubes) => {
        const cube = cubes.filter(c => c.id === id)[0];

        callback(cube);
    });
}

const getAllCubes = (callback) => {
    fs.readFile(database, (err, data) => {
        if (err) {
            throw err;
        }

        const cubes = JSON.parse(data);
        callback(cubes);
    });
}


module.exports = {
    saveCube,
    getCube,
    getAllCubes,
}