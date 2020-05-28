//const Exercise = require('./models/exercise');
const Workout = require('./models/workout');

const workoutSeeds = [{
    name: 'Primary',
    trainer: 'Fabricio',
    days: ['Monday','Wednesday'],
    exercises: [
            '5ecdc2dbb68af60338dd2c8c',
            '5ecdc2e8b68af60338dd2c8d'       
    ]
}];


async function seedDB() {
    await Workout.deleteMany({});
    //await Comment.deleteMany({});
    for (const seed of workoutSeeds){
        // CREATE WORKOUTS FROM workoutSeeds
        let workout = await Workout.create(seed);
        //TODO CREATE EXERCISES FROM exerciseSeeds
    };
}

module.exports = seedDB;