const { v4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const database = path.join(__dirname, '..', 'config/database.json');

class Cube {
    constructor(name, description, imageUrl, difficulty) {
        this.id = v4();
        this.name = name || 'No Name';
        this.description = description;
        this.imageUrl = imageUrl;
        this.difficulty = difficulty;
    }

    save() {
        const newCube = {
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,
            difficulty: this.difficulty
        };

        fs.readFile(database, (err, data) => {
            if (err) {
                throw err;
            }

            const db = JSON.parse(data);

            db.push(newCube);

            fs.writeFile(database, JSON.stringify(db), error => {
                if (error) {
                    throw error;
                }
                console.log('Cube is succesfully stored.');
            });
         })
    }
}

module.exports = Cube;