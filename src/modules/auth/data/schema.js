const BaseSchema = require('modules/base/data/schema');
const _ = require('lodash');

const authIdentityProviders = require('modules/auth/constants/identityProviders');

const AuthSchema = BaseSchema.extend({
  user: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  identities: [{
    provider: {
      type: String,
      ref: 'Auth',
      required: true,
      enum: _.values(authIdentityProviders)
    },
    lastSignin: {
      type: Date,
      required: true,
      default: Date.now
    }
  }]
});

module.exports = AuthSchema;
