const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const extend = require('mongoose-schema-extend'); // eslint-disable-line no-unused-vars

const utils = require('src/utils/utils');

const BaseSchema = new Schema({
  _id: {
    type: String,
    default: utils.generateGuid,
    required: true,
    index: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  modified: {
    type: Date,
    required: true,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

BaseSchema.virtual('id').get(function() {
  return this._id;
});

BaseSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.__t;
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = BaseSchema;
