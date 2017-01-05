const Promise = require('bluebird');

const InvalidArgumentError = require('errors/invalidArgumentError');

class BaseRepository {
  constructor(model) {
    if (!model) throw new InvalidArgumentError('model');

    this._model = model;
  }

  /**
   * @param {String} id
   * @return {Promise}
   */
  findById(id) {
    if (!id) return Promise.reject(new InvalidArgumentError('id'));

    return this._model.findById(id).exec();
  }

  /**
   * @param {Object} [options]
   * @return {Promise}
   */
  findOne(options = {}) {
    return this._model.findOne(options).exec();
  }

  /**
   * @return {Promise}
   */
  list() {
    return this._model.find({}).exec();
  }

  /**
   * @param {Object} data
   * @return {Promise}
   */
  create(data) {
    if (!data) return Promise.reject(new InvalidArgumentError('data'));

    return this._model.create(data);
  }

  /**
   * @param {String} id
   * @param {Object} data
   * @return {Promise}
   */
  updateById(id, data) {
    if (!id) return Promise.reject(new InvalidArgumentError('id'));
    if (!data) return Promise.reject(new InvalidArgumentError('data'));

    return this._model.findOneAndUpdate({
      _id: id
    }, data, {
      new: true
    });
  }

  /**
   * @param {String} id
   * @param {Object} [options]
   * @param {Bool} [options.soft] - whether or not to soft or hard delete, defaults to true
   * @return {Promise}
   */
  deleteById(id, options = {
    soft: true
  }) {
    if (!id) return Promise.reject(new InvalidArgumentError('id'));

    if (options.soft) {
      return this._model.findOneAndUpdate({
        _id: id
      }, {
        deleted: true
      }, {
        new: true
      });
    } else {
      return this._model.remove({
        _id: id
      });
    }
  }
}

module.exports = BaseRepository;
