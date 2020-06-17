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
const { find } = require('./models/workout');
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
            //console.log(workouts);
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

    //TODO USE PROMISES TO CHAIN FUNCTIONS - PROMISES ASYNC/AWAIT
    //TODO USE INIT FUNCTION TO MERGE OBJECTS BEFORE SENDING (WORKOUT + EXERCISES)

    // Workout.findById(req.params.id, (err, workout) => {
    //     if(err){
    //         console.log(err);
    //         return null
    //     }else{
    //         console.log('Found Workout');
    //         console.log(workout);
    //         return workout;
    //     }
    // });

    //! CHAIN FUNCTIONS

    let workoutId = req.params.id;
    
    //let renderObject = {};
    
    
    let workoutObject;
    let exerciseObject;
    let exercises;

    // HARDCODED
    let exerciseId = '5ecdc2dbb68af60338dd2c8c';

    let workoutPromise = getWorkout(workoutId);

    //TODO MERGE OBJECTS

    workoutPromise
        .then(workout => {
            console.log('Workout:');
            console.log(workout);
            return workout
        })
        .then(workout => {
            exercisePromise = getExercises(workout.exercises);
            return exercisePromise
        })
        .then(exercises => {
            console.log('Exercises:');
            console.log(exercises);
        })
        .catch(err => console.log(err))


    // workoutPromise
    //     .then(result => {
    //     return result
    // })
    //     .then(result => {
    //         // .then procura o return anterior na cadeia
    //         console.log('Workout:');
    //         console.log(result);
    //         exercises = getExercises(result.exercises);
    //         exercises
    //             .then(exercises => {
    //                 console.log('Exercises:');
    //                 console.log(exercises);
    //                 return exercises
    //             })
    //     return (exercises + result)
    //     })
    //     .then(result => {

    //         console.log('Result:');
    //         console.log(result);
            
    //         res.send(result);
    //     })
    // .catch(err => console.log(err))

    //res.send(renderObject);
    //res.render('workouts/show',{workout:foundWorkout});
});

async function getWorkout(workoutId){
    const query = await Workout.findById(workoutId);
    return query;
    }

async function getExercises(exerciseIds){
    let query = await Exercise.find().where('_id').in(exerciseIds);
    return query;
}


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