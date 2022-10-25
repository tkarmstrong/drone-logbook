const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  userAssigned: { type: Schema.Types.ObjectId, ref: "User" },
  dateActivated: { type: Date, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  flightControllerSerialNumber: { type: String, required: true },
  aircraftSerialNumber: { type: String, required: true },
  propNumber: { type: Number, required: true },
  dateCreated: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
  notes: { type: String }
},
{
  collection: 'aircraft',
});

// Export the model so its publicly available.
module.exports = mongoose.model('Aircraft', userSchema);
