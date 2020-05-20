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
    // res.send('Workout');
    Exercise.find({},(err, exercise) => {
        if(err){
            console.log(err);
        }else{
            res.render('workouts/index',{exercises:exercise});            
        }
    });
});
// - NEW
app.get('/workouts/new',(req, res) => {
    res.render('workouts/new');
});
// - CREATE
app.post('/workouts/new',(req, res) => {
    Exercise.create(req.body,(err, exercise) => {
        if(err){
            console.log(err);
        }else{
            console.log('Created exercise');
            console.log(exercise);
        }
    });
    res.redirect('/workouts');
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