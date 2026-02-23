const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maintenanceRecord = Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: ['calibration', 'repair', 'battery', 'firmware', 'inspection', 'other'] },
  description: { type: String },
  partNumbers: { type: String },
  batteryCycles: { type: Number },
  firmwareVersion: { type: String },
  performedBy: { type: String },
  notes: { type: String },
}, { _id: true });

const aircraftSchema = Schema({
  userAssigned: { type: Schema.Types.ObjectId, ref: "User" },
  dateActivated: { type: Date, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  registrationNumber: { type: String },
  registrationExpiration: { type: Date },
  flightControllerSerialNumber: { type: String, required: true },
  aircraftSerialNumber: { type: String, required: true },
  propNumber: { type: Number, required: true },
  maintenance: [maintenanceRecord],
  dateCreated: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
  notes: { type: String }
},
{
  collection: 'aircraft',
});

module.exports = mongoose.model('Aircraft', aircraftSchema);
