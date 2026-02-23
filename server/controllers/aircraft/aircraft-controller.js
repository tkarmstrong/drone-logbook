let Aircraft = require('../../models/aircraft');

const jwt = require('jsonwebtoken');
const config = require('../../config');

const notAuthorized = {
  error: 401,
  message: 'You are not authorized to access this feature.'
}

exports.assignAircraftToUser = (req, res) => {
  // 1. Check if user is authorized
  if(req.auth) {
    Aircraft.findOne( {aircraftSerialNumber: req.body.aircraftSerialNumber}, (err, aircraft) => {
      // 2. Check if aircraft is unique
      if (err) {
        console.log(err);
        return res.json(err);
      } else {
        if (!aircraft) {
          const newAircraft = {
            userAssigned: req.userId,
            dateActivated: req.body.dateActivated,
            make: req.body.make,
            model: req.body.model,
            registrationNumber: req.body.registrationNumber,
            registrationExpiration: req.body.registrationExpiration ? new Date(req.body.registrationExpiration) : undefined,
            flightControllerSerialNumber: req.body.flightControllerSerialNumber,
            aircraftSerialNumber: req.body.aircraftSerialNumber,
            propNumber: req.body.propNumber,
            maintenance: req.body.maintenance || [],
            notes: req.body.notes,
          };
          Aircraft.create(newAircraft, (err, created) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }
            return res.status(201).json(created);
          });
        } else {
          return res.json({error: 'Oops this aircraft already exists.'})
        }
      }
    })
  } else {
    return res.status(403).json(notAuthorized);
  }
}

exports.getAircraftAssignedToUser = (req, res) => {
  // Check if user is logged in & authorized
  if(req.auth) {
    // Query all aircraft assigned to user
    Aircraft.find({ userAssigned: req.userId }, (err, aircraft) => {
      if(err) {
        return res.status(500).json({
          error: 500,
          message: 'There was an error returning the aircraft assigned to user.'
        })
      } else {
        return res.status(200).json(aircraft)
      }
    })
  } else {
    return res.status(403).json(notAuthorized);
  }
}

exports.getAircraftBySerialNumber = (req, res) => {
  // Check if user is logged in & authorized
  if(req.auth) {
    // Find aircraft using its serial number
    Aircraft.findOne({ aircraftSerialNumber: req.params.aircraftSerialNumber }, (err, aircraft) => {
      if(err) {
        return res.status(500).json({
          message: 'There was error returning the aircraft',
          error: err
        });
      } else {
        return res.status(200).json(aircraft);
      }
    })
  } else {
    return res.status(403).json(notAuthorized);
  }
}

exports.updateAircraftBySerialNumber = (req, res) => {
  // Check if user is logged in & authorized
  if(req.auth) {
    // Find aircraft using its serial number
    Aircraft.findOne({ aircraftSerialNumber: req.params.aircraftSerialNumber }, (err, aircraft) => {
      if(err) {
        return res.status(500).json({
          message: 'There was error returning the aircraft',
          error: err
        });
      } else {
        // Set new values for aircraft
        aircraft.set({
          userAssigned: req.userId,
          dateActivated: req.body.dateActivated,
          make: req.body.make,
          model: req.body.model,
          registrationNumber: req.body.registrationNumber,
          registrationExpiration: req.body.registrationExpiration ? new Date(req.body.registrationExpiration) : undefined,
          flightControllerSerialNumber: req.body.flightControllerSerialNumber,
          aircraftSerialNumber: req.body.aircraftSerialNumber,
          dateModified: new Date(),
          propNumber: req.body.propNumber,
          maintenance: req.body.maintenance !== undefined ? req.body.maintenance : aircraft.maintenance,
          notes: req.body.notes,
        });
        // Save to db
        aircraft.save(aircraft, (err) => {
          if (err) {
            console.log('saveErr: ', err);
            return res.status(500).json({message: 'Unfortunately, our server encountered an error. Please try again or contact us for assistance.'});
          } else {
            return res.status(200).json({
              message: 'Our system has successfully processed aircraft update',
              updatedAircraft: aircraft
            });
          }
        });
      }
    })
  } else {
    return res.status(403).json(notAuthorized);
  }
}
