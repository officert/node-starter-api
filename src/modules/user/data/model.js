const mongoose = require('mongoose');

const UserSchema = require('./schema');

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
