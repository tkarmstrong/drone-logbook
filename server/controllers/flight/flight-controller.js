const Flight = require('../../models/flight');
const Aircraft = require('../../models/aircraft');

const jwt = require('jsonwebtoken');
const config = require('../../config');

const notAuthorized = { message: 'You are not authorized to access this feature.' };

exports.assignUserFlightToAircraft = (req, res) => {
  // 1. Check if user is authorized
  if(!req.auth) {
    return res.status(403).json(notAuthorized);
  }

  Aircraft.findOne( {aircraftId: req.body.aircraftData.aircraftId}, (err, aircraft) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      if(aircraft) {
        const newFlight = {
          userData: {
            pilot: req.body.userData.pilot,
            pilotExemptionNumber: req.body.userData.pilotExemptionNumber,
            spotterName: req.body.userData.spotterName,
          },
          aircraftData: {
            aircraftId: req.body.aircraftData.aircraftId,
          },
          missionData: {
            dateOfFlight: req.body.missionData.dateOfFlight,
            location: req.body.missionData.location,
            flightLat: req.body.missionData.flightLat,
            flightLong: req.body.missionData.flightLong,
            totalFlightTime: req.body.missionData.totalFlightTime,
            totalNightTime: req.body.missionData.totalNightTime,
            totalPicTime: req.body.missionData.totalPicTime,
            totalTakeoffs: req.body.missionData.totalLands,
            totalLands: req.body.missionData.totalLands,
            missionNotes: req.body.missionData.missionNotes,
            missionExperience: req.body.missionData.missionExperience,
            otherNotes: req.body.missionData.otherNotes
          },
          flightData: {
            flightLegs:
              req.body.flightData.flightLegs
          },
          weatherData: {
            weatherNotes: req.body.weatherData.weatherNotes,
          }
        }

        // Save aircraft to db
        Flight.create(newFlight, (err) => {
          if(err) {
            return res.status(500).json(err)
          }
          return res.json(newFlight)
        })
      } else {
        // Aircraft does not exist
        return res.status(204).json({error: 'This aircraft does not exist'})
      }
    }
  })
}

exports.getUserFlights = (req, res) => {
  if(!req.auth) {
    return res.status(403).json(notAuthorized);
  }

  Flight.findOne({pilot: req.userId})
    .populate('aircraftData.aircraftId')
    .populate('userData.pilot', {_id: 0, firstName: 1, lastName: 1})
    .exec((err, flights) => {
      if(err) {
        return res.status(500).json({
          error: err,
          message: 'There was an error retrieving flights assigned to user.'
        })
      } else {
        return res.json(flights)
      }
    })
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

  // Query all flights assigned to aircraft serial number
  Flight.findOne({ aircraftId: req.params.aircraftId })
    .populate('aircraftData.aircraftId')
    .populate('userData.pilot', {_id: 0, firstName: 1, lastName: 1})
    .exec((err, flights) => {
      console.log(flights)
      if(err) {
        return res.status(500).json({
          error: 500,
          message: 'There was an error retrieving flights assigned to aircraft serial number.'
        })
      } else if(flights === null || flights.length === 0) {
        return res.status(200).json({message: "This aircraft does not have any flights logged yet. Log a flight and come back."})
      } else {
        return res.status(200).json(flights)
      }
    })
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
