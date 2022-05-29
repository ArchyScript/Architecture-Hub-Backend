// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema

// var eventSchema = Schema({
//     title: String,
//     location: String,
//     startDate: Date,
//     endDate: Date
// });

// var personSchema = Schema({
//     firstname: String,
//     lastname: String,
//     email: String,
//     gender: { type: String, enum: ["Male", "Female"] }
//     dob: Date,
//     city: String,
//     interests: [interestsSchema],
//     eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
// });

// var Event = mongoose.model('Event', eventSchema);
// var Person = mongoose.model('Person', personSchema);