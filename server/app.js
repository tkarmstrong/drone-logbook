const config = require('./config');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Controllers
const authController = require('./controllers/auth/auth-controller');
const aircraftController = require('./controllers/aircraft/aircraft-controller');
const flightController = require('./controllers/flight/flight-controller');

// Middleware Controllers
const checkToken = require('./controllers/auth/check-token');

const dbUser = config.dbUser;
const dbPassword = config.dbPassword;

let app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../dist/drone-logbook')));
app.use('/', express.static(path.join(__dirname, '../dist/drone-logbook')));
app.use('/api', router);

// Global variables
const serverPort = process.env.PORT || 3000;

/************************* Mongoose connection strings  ***************/
mongoose.set('strictQuery', false);
// Connect to DB
const mongoDB = "mongodb+srv://" + dbUser + ":" + dbPassword + "@cluster0.pozdgnq.mongodb.net/drone-logbook?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connected error: "));
db.once("open", function() {
  console.log("Application connected to Atlas MongoDB instance");
});


/************************* API Routes  ***************/

/* -----------------------------------------------------
!                   USER OPERATIONS                     !
------------------------------------------------------ */
/**
 * Auth Routes
 */

// Register a new user
router.post('/auth/register/:email', authController.registerUser);

// Login user
router.post('/auth/login/', authController.loginUser);

// Get all users
router.get('/auth/users', checkToken, authController.getUsers);

// Get user by id
router.get('/auth/user/:id', checkToken, authController.getUserById);

// Update user role
router.post('/auth/update-role/:id', checkToken, authController.updateUserRole);

// TODO: Delete User

/**
 * User Profile Management Routes
 */

// Change Name
router.post('/user/profile/change-name/:id', checkToken, authController.updateUserName);

// TODO: Change Email

// TODO: Password reset


/* -----------------------------------------------------
|                  AIRCRAFT OPERATIONS                  |
------------------------------------------------------ */

/**
 * TODO: Admin Routes
 */

/**
 * User Routes
 */

// Add new aircraft assignment to user
router.post('/aircraft/add-new', checkToken, aircraftController.assignAircraftToUser);

// Get all aircraft assigned to user
router.get('/aircraft/view/user-assignments', checkToken, aircraftController.getAircraftAssignedToUser);

// Get aircraft by serial number
router.get('/aircraft/view/:aircraftSerialNumber', checkToken, aircraftController.getAircraftBySerialNumber);

// Update user specified aircraft
router.post('/aircraft/update/:aircraftSerialNumber', checkToken, aircraftController.updateAircraftBySerialNumber);

// TODO: Delete aircraft by id or serial number


/* -----------------------------------------------------
|                   FLIGHT OPERATIONS                  |
------------------------------------------------------ */

/**
 * TODO: Admin Routes
 */

/**
 * User Routes
 */

// Add new individual flight record
router.post('/flight/add-new', checkToken, flightController.assignUserFlightToAircraft);

// Get all flight records assigned to user
router.get('/flights/view', checkToken, flightController.getUserFlights);

// Get all user flight records by aircraftId
router.get('/flights/view/:aircraftId', checkToken, flightController.getUserFlightsByAircraftId);

// Get individual flight record
router.get('/flight/view/:id', checkToken, flightController.getUserIndividualFlightById);

// Delete flight by id
router.delete('/flight/delete/:id', checkToken, flightController.deleteUserIndividualFlightById);


/************************* DB Connection / Persistance ***************/
/**
 * Creates an express server and listens on env port || port 3000
 */
 http.createServer(app).listen(serverPort, function() {
  console.log(`Application started and listing on port: ${serverPort}`);
});
