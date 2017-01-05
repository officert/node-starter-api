const BaseSchema = require('modules/base/data/schema');

const UserSchema = BaseSchema.extend({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  profilePicture: {
    type: String,
    required: false,
    trim: true
  }
});

UserSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = UserSchema;
