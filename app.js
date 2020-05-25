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
//const seedDB = require('./seeds');
//seedDB();

// ROUTES
// - LANDING
app.get('/', (req, res) => {
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
app.get('/workouts/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    Workout.findById(id, (err, workout) => {
        if(err){
            console.log(err);
        }else{
            console.log('Found Workout:');
            console.log(workout);
            res.render('workouts/show',{workout:workout});
        }
    });
});

// EXERCISES
//TODO ADD EXERCISES CREATION
    
// - NEW
app.post('/workouts/:id/exercises/new',(req, res) => {
    // res.render('exercises/new');

    let workout = req.body;

    console.log(workout);
    // res.render('workouts/',{workout:workout})
    res.render('exercises/new',{workout:workout});

    // // - CREATE EXERCISES AND ADD TO EXERCISE ARRAY
    // daysOfWeek.forEach((day) => {
    //     for (i=0;i<exercisesPerDay;i++){
    //         if (exercises[day][i].name){
    //             Exercise.create({
    //                     day: day,
    //                     order: exercises[day][i].order,
    //                     name: exercises[day][i].name,
    //                     reps: exercises[day][i].reps,
    //                     sets: exercises[day][i].sets,
    //                     weight: exercises[day][i].weight
    //             },(err, exercise) => {
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     console.log('Exercise Created');
    //                     console.log(exercise);
    //                 }
    //             })
    //         }
    //     }
    // })

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