module.exports = {
    development: {
        port: process.env.PORT || 3000,
        privateKey: 'CUBE_WORKSHOP_SOFTUNI',
        databaseUrl: `mongodb+srv://cubicle:${process.env.DB_PASSWORD}@cubicle-6tvqn.mongodb.net/cubicledb?retryWrites=true&w=majority`
    },
    production: {}
};