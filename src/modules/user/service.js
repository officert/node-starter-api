const BaseService = require('modules/base');
const userRepository = require('./data');
const validator = require('./validator');
const eventBus = require('modules/eventBus');
const InvalidArgumentError = require('errors/invalidArgumentError');
const ObjectNotFoundError = require('errors/objectNotFoundError');

const ERROR_MESSAGES = require('./constants/errorMessages');
const USER_EVENTS = require('./constants/events');

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  /**
   *  @param {Object} options
   *  @param {String} options.email
   *  @param {String} [options.firstName]
   *  @param {String} [options.lastName]
   *  @param {String} [options.profilePicture]
   *  @return {Promise}
   */
  create(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));

    return validator.validateCreate(options)
      .then(validatorData => mergeValidatorCreateData(validatorData, options))
      .then(createData => this._repository.create(createData))
      .tap(user => publishCreatedEvent(user.id));
  }

  /**
   *  @param {String} email
   *  @return {Promise}
   */
  findByEmail(email) {
    if (!email) return Promise.reject(new InvalidArgumentError('email'));

    return this._repository.findOne({
      email
    });
  }

  /**
   *  @param {String} id
   *  @param {Object} options
   *  @param {String} [options.firstName]
   *  @param {String} [options.lastName]
   *  @param {String} [options.profilePicture]
   *  @return {Promise}
   */
  updateById(id, options) {
    if (!id) return Promise.reject(new InvalidArgumentError('id'));
    if (!options) return Promise.reject(new InvalidArgumentError('options'));

    return findById(id)
      .then(validator.validateUpdate(options))
      .then(validatorData => mergeValidatorUpdateData(validatorData, options))
      .then(updateData => this._repository.updateById(id, updateData));
  }
}

function publishCreatedEvent(userId) {
  eventBus.publish(USER_EVENTS.USER_CREATED, userId);
}

function findById(id) {
  if (!id) return Promise.reject(new InvalidArgumentError('id'));

  return userRepository.findById(id)
    .tap(user => {
      if (!user) throw new ObjectNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    });
}

function mergeValidatorCreateData(validatorData, options) {
  if (!validatorData) return Promise.reject(new InvalidArgumentError('validatorData'));
  if (!options) return Promise.reject(new InvalidArgumentError('options'));

  let data = {};
  if ('email' in options) data.email = options.email;
  if ('firstName' in options) data.firstName = options.firstName;
  if ('lastName' in options) data.lastName = options.lastName;
  if ('profilePicture' in options) data.profilePicture = options.profilePicture;

  return Promise.resolve(data);
}

function mergeValidatorUpdateData(validatorData, options) {
  if (!validatorData) return Promise.reject(new InvalidArgumentError('validatorData'));
  if (!options) return Promise.reject(new InvalidArgumentError('options'));

  let data = {};

  if ('firstName' in options) data.firstName = options.firstName;
  if ('lastName' in options) data.lastName = options.lastName;
  if ('profilePicture' in options) data.profilePicture = options.profilePicture;

  return Promise.resolve(data);
}

module.exports = new UserService();
