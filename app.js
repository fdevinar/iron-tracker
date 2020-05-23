// REQUIREMENTS
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const methodOverride    = require('method-override');

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
    Exercise.find({},(err, exercises) => {
        if(err){
            console.log(err);
        }else{
            res.render('workouts/index',{exercises:exercises});            
        }
    });
});
// - NEW
app.get('/workouts/new',(req, res) => {
    res.render('workouts/new');
});
// - CREATE
app.post('/workouts/new',(req, res) => {
    
    let exercises = req.body.exercise;
    let workoutName = req.body.workoutName;

    //TODO: ADD DAYS-WEEK AND EXERCISES-DAY VARIABLES BEFORE WORKOUT CREATION
    let daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    let exercisesPerDay = 8;

    //TODO: ADD WORKOUT CREATION

    daysOfWeek.forEach((day) => {
            for (i=0;i<exercisesPerDay;i++){
                if (exercises[day][i].name){
                    console.log(exercises[day][i].name);
                    Exercise.create({
                            day: day,
                            order: exercises[day][i].order,
                            name: exercises[day][i].name,
                            reps: exercises[day][i].reps,
                            sets: exercises[day][i].sets,
                            weight: exercises[day][i].weight
                    },(err, exercise) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('Created Exercise');
                            console.log(exercise);
                        }
                    })
                }
            }
    })
    
    res.send(req.body);
});

// SERVER START
app.listen(3000,() => {
    console.log('*** Iron Tracker server running ***');
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