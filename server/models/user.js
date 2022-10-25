const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String},
  email: { type: String },
  isAdmin: { type: Boolean, default: false },
  dateCreated: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
  verified: { type: Boolean, default: false}
},
{
  collection: 'users',
});

// Export the model so its publicly available.
module.exports = mongoose.model('User', userSchema);
