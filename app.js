// REQUIREMENTS
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const methodOverride    = require('method-override');
const colors            = require('colors');

// CONFIGURATION
app.use(express.static(__dirname + '/public')); // Assets directory
app.set('views','./views');
app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: true})); // Enables req.body parse from POST request
app.use(methodOverride('_method')); // Enables Method Override (from POST to PUT/DELETE)

// *** DATABASE *** //
// CONNECT TO DATABASE
mongoose.connect('mongodb://localhost/iron-tracker',
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
// MODELS
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');
const seedDB = require('./seeds');
seedDB();

// ROUTES
// - LANDING
app.get('/', (req, res) => {
    // REMOVING LANDING TEMPORARILY
    res.render('landing');
});
// WORKOUTS
// - INDEX
app.get('/workouts',(req, res) => {
    Workout.find({},(err,workouts) => {
        if(err){
            console.log(err);
            res.render('landing');
        }else{
            console.log(workouts);
            res.render('workouts/index',{workouts:workouts});
        }
    });
});
// - NEW
app.get('/workouts/new',(req, res) => {
    res.render('workouts/new');
});
// - CREATE
app.post('/workouts/new',(req, res) => {
    Workout.create(req.body,(err,workout) => {
        if(err){
            console.log(err);
            res.redirect('workouts')

        }else{
            console.log('Workout Created');
            res.redirect('/workouts')
        }
    });
});
// - SHOW
//TODO SHOW EXERCISES INSTEAD OF ID
app.get('/workouts/:id', (req, res) => {
    let workoutId = req.params.id;
    let renderObject = {};

    Workout.findById(workoutId, (err, foundWorkout) => {
        if(err){
            console.log(err);
        }else{
            console.log('Found Workout:');
            console.log(foundWorkout);
            renderObject = {
                workout: foundWorkout
            };
            console.log('renderObject');
            console.log(renderObject);
            res.render('workouts/show',{workout:foundWorkout});
        }
    });

    getExercisesFromId(workoutId);

    //TODO MOUNT RENDER OBJECT USING EXERCISES INSTEAD OF ID
    //TODO PUSH RENDER TO BELOW

});

//! UNIFY WORKOUT AND EXERCISE MODELS

function getExercisesFromId(workoutId) {
    console.log(workoutId);
    //TODO QUERY DB TO GET EXERCISES OBJECT
};

// EXERCISES
// - NEW
app.post('/workouts/:id/exercises/new',(req, res) => {
    let workout = req.body;
    res.render('exercises/new',{workout:workout});
});
// - CREATE
app.post('/workouts/:id/exercises/create',(req, res) => {
    let workoutID = req.body.workout.workoutID;

    let daysArray = req.body.workout.days.split(',');
    let daysOfWeek = daysArray.map(day => day.replace(/[^A-Za-z]/g, ""));

    let exercisesPerDay = 8;
    let exercises = req.body.exercises;

    console.log(workoutID);
    console.log(daysOfWeek);

    //! FIX: ONLY ONE EXERCISE PER CREATION

    // - CREATE EXERCISES AND ADD TO EXERCISE ARRAY
    Workout.findById(workoutID, (err, workout) => {
        if(err){
            console.log(err);
        }else{

            console.log('WORKOUT FOUND');
            console.log(workout);

            let exerciseObject = [];

            daysOfWeek.forEach((day) => {
                for (i=0;i<exercisesPerDay;i++){
                    if (exercises[day][i].name){
                        exerciseObject.push({
                            day: day,
                            order: exercises[day][i].order,
                            name: exercises[day][i].name,
                            reps: exercises[day][i].reps,
                            sets: exercises[day][i].sets,
                            weight: exercises[day][i].weight
                        });
                    }
                }
            });

            //! FIX -  ONLY ONE EXERCISE CREATED BASED ON OBJECT CREATED ABOVE

            Exercise.create({exerciseObject},(err, exercise) => {
            if(err){
                console.log(err);
            }else{
                console.log('Exercise Created');
                console.log(exercise);
                workout.exercises.push(exercise.id);
                workout.save();
                console.log('Workout.exercises:');
                console.log(workout.exercises);
                console.log('Exercise Object');
                console.log(exerciseObject);
            }
        })
            res.redirect('/workouts');

        }
    })
});

// SERVER START
app.listen(3000,() => {
    console.clear();
    console.log('*** Iron Tracker server running ***'.white.bgGreen);
});

/*
INDEX - GET /
SHOW - GET :id

NEW - GET Form
CREATE - POST

EDIT - GET Form
UPDATE - PUT

DESTROY - DELETE
*/