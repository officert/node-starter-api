const mongoose = require('mongoose');

const AuthSchema = require('./schema');

const AuthModel = mongoose.model('Auth', AuthSchema);

module.exports = AuthModel;
