const express = require('express');
const app = express();

app.get('/',(req, res) => {
    res.send('Home');
});

app.listen(3000,() => {
    console.log('Server initiated');
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