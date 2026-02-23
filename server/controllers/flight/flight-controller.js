const Flight = require('../../models/flight');
const Aircraft = require('../../models/aircraft');

const jwt = require('jsonwebtoken');
const config = require('../../config');

const notAuthorized = { message: 'You are not authorized to access this feature.' };

exports.assignUserFlightToAircraft = (req, res) => {
  if (!req.auth) {
    return res.status(403).json(notAuthorized);
  }

  const aircraftId = req.body.aircraftData?.aircraftId;
  if (!aircraftId) {
    return res.status(400).json({ error: 'aircraftData.aircraftId is required' });
  }

  Aircraft.findById(aircraftId, (err, aircraft) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!aircraft) {
      return res.status(404).json({ error: 'This aircraft does not exist' });
    }

    const md = req.body.missionData || {};
    const newFlight = {
      userData: {
        pilot: req.userId,
        pilotExemptionNumber: req.body.userData?.pilotExemptionNumber ?? '',
        spotterName: req.body.userData?.spotterName,
      },
      aircraftData: {
        aircraftId: aircraftId,
      },
      missionData: {
        dateOfFlight: md.dateOfFlight,
        location: md.location,
        flightLat: md.flightLat,
        flightLong: md.flightLong,
        totalFlightTime: md.totalFlightTime,
        totalNightTime: md.totalNightTime,
        totalPicTime: md.totalPicTime,
        totalTakeoffs: md.totalTakeoffs,
        totalLands: md.totalLands,
        maxAltitude: md.maxAltitude,
        airspaceClass: md.airspaceClass,
        authorization: md.authorization,
        preflightChecklistComplete: md.preflightChecklistComplete ?? false,
        batterySerials: md.batterySerials,
        preFlightVoltage: md.preFlightVoltage,
        postFlightVoltage: md.postFlightVoltage,
        missionNotes: md.missionNotes,
        missionExperience: md.missionExperience ?? '',
        otherNotes: md.otherNotes,
      },
      flightData: {
        flightLegs: req.body.flightData?.flightLegs ?? [],
      },
      weatherData: {
        weatherNotes: req.body.weatherData?.weatherNotes,
      },
    };

    Flight.create(newFlight, (err, created) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json(created);
    });
  });
}

exports.getUserFlights = (req, res) => {
  if (!req.auth) {
    return res.status(403).json(notAuthorized);
  }

  Flight.find({ 'userData.pilot': req.userId })
    .populate('aircraftData.aircraftId')
    .populate('userData.pilot', 'firstName lastName')
    .sort({ 'missionData.dateOfFlight': -1 })
    .exec((err, flights) => {
      if (err) {
        return res.status(500).json({
          error: err,
          message: 'There was an error retrieving flights assigned to user.',
        });
      }
      return res.json(flights);
    });
}

exports.getUserIndividualFlightById = (req, res) => {
  if(!req.auth) {
    res.status(401).json(notAuthorized);
  }

  Flight.findById(req.params.id)
  .populate('aircraftData.aircraftId')
  .populate('userData.pilot', {_id: 0, firstName: 1, lastName: 1})
    .exec((err, flight) => {
      console.log(flight)
      if (err) {
        return res.status(500).json(err);
      } else if(flight === null || flight.length === 0) {
        res.status(200).json({message: "This flight was deleted or does not exist."});
      }
      else {
        res.status(200).json(flight);
      }
    })
}

exports.getUserFlightsByAircraftId = (req, res) => {
  // Check if user is logged in & authorized
  if(!req.auth) {
    return res.status(403).json(notAuthorized);
  }

  Flight.find({ 'aircraftData.aircraftId': req.params.aircraftId })
    .populate('aircraftData.aircraftId')
    .populate('userData.pilot', {_id: 0, firstName: 1, lastName: 1})
    .populate('aircraftData.aircraftId')
    .populate('userData.pilot', 'firstName lastName')
    .sort({ 'missionData.dateOfFlight': -1 })
    .exec((err, flights) => {
      if (err) {
        return res.status(500).json({
          error: 500,
          message: 'There was an error retrieving flights assigned to aircraft.',
        });
      }
      if (!flights || flights.length === 0) {
        return res.status(200).json({ message: 'This aircraft does not have any flights logged yet.' });
      }
      return res.status(200).json(flights);
    });
}

exports.deleteUserIndividualFlightById = (req, res) => {
  console.log(req.auth)
  if(req.auth) {
    Flight.findByIdAndDelete(req.params.id)
      .exec((err, flight) => {
        if (err) {
          return res.status(500).json(err);
        } else if(flight === null) {
          return res.status(404).json({error: '404', message: 'This flight was already deleted or does not exist'});
        } else {
          res.status(200).json({message: 'Flight deleted successfully', flightDeleted: flight});
        }
      })
  } else {
    res.status(401).json(notAuthorized)
  }
}
