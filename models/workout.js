// REQUIRE MONGOOSE
const mongoose = require('mongoose');
// CREATE SCHEMA
const workoutSchema = new mongoose.Schema({
    name: String,
    trainer: String,
    sessions: Number,
    exercises: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise"
        }
        ]
});
// CREATE MODEL BASED ON SCHEMA
const Workout = mongoose.model("Workout", workoutSchema);
// EXPORT MODEL
module.exports = Workout;