// REQUIRE MONGOOSE
const mongoose = require('mongoose');
// CREATE SCHEMA
const exerciseSchema = new mongoose.Schema({
    day: String,
    order: Number,
    name: String,
    reps: Number,
    sets: Number,
    weight: Number
});
// CREATE MODEL BASED ON SCHEMA
const Exercise = mongoose.model("Exercise", exerciseSchema);
// EXPORT MODEL
module.exports = Exercise;


