// REQUIREMENTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// CONFIG
app.set('views','./views');
app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: true})); // Enables req.body parse from POST request

// WORKOUT OBJECTS
let exercises = [{
    name: 'Deadlift',
    reps: 8,
    sets: 5,
    weight: 80,
    muscle: 'Lower body'
}];

// ROUTES
// - INDEX
app.get('/',(req, res) => {
    res.render('index',{exercises:exercises});
});
// - NEW
app.get('/new',(req, res) => {
    res.render('new');
});

// - CREATE
app.post('/new',(req, res) => {
    console.log(req.body);
    exercises.push(req.body);
    res.redirect('/');
})



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