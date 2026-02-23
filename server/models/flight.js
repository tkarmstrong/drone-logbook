const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightLeg = Schema({
  takeoffTime: { type: Date, required: true },
  landTime: { type: Date, required: true },
  flightTime: { type: Number, required: true },
  nightTime: { type: Number },
  picTime: { type: Number },
  flightMalfunction: { type: Boolean, default: false, required: true },
  nightFlight: { type: Boolean, default: false, required: true },
  legNotes: { type: String }
});

const flightSchema = Schema({
  userData: {
    pilot: { type: Schema.Types.ObjectId, ref: "User" },
    pilotExemptionNumber: { type: String, required: true },
    spotterName: { type: String },
  },
  aircraftData: {
    aircraftId: { type: Schema.Types.ObjectId, ref: "Aircraft" },
  },
  missionData: {
    dateOfFlight: { type: Date, required: true },
    location: { type: String, required: true },
    flightLat: { type: Number, required: true },
    flightLong: { type: Number, required: true },
    totalFlightTime: { type: Number, required: true },
    totalNightTime: { type: Number },
    totalPicTime: { type: Number },
    totalTakeoffs: { type: Number },
    totalLands: { type: Number },
    maxAltitude: { type: Number },
    airspaceClass: { type: String },
    authorization: { type: String },
    preflightChecklistComplete: { type: Boolean, default: false },
    batterySerials: [{ type: String }],
    preFlightVoltage: { type: Number },
    postFlightVoltage: { type: Number },
    missionNotes: { type: String },
    missionExperience: { type: String, required: true },
    otherNotes: { type: String },
  },
  flightData: {
    flightLegs: [flightLeg],
  },
  weatherData: {
    weatherNotes: { type: String },
  },
  dateCreated: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() }
},
{
  collection: 'flights',
});

module.exports = mongoose.model('Flight', flightSchema);
