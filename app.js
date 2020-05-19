// REQUIREMENTS
const express = require('express');
const app = express();

// CONFIG
app.set('views','./views');
app.set('view engine','pug');

// WORKOUT OBJECTS
let exercise = {
    name: 'Deadlift',
    reps: 8,
    sets: 5,
    weight: 80,
    muscle: 'Lower body'
};

// ROUTES
app.get('/',(req, res) => {
    res.render('index',{exercise:exercise});
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