const InvalidArgumentError = require('errors/invalidArgumentError');
const BaseRepository = require('./data');

class BaseService {
  constructor(respository) {
    if (!respository) throw new InvalidArgumentError('respository');
    if (!(respository instanceof BaseRepository)) throw new InvalidArgumentError('respository must inherit BaseRepository');

    this._repository = respository;
  }

  /**
   *  @param {String} id
   *  @return {Promise}
   */
  findById(id) {
    return this._repository.findById(id);
  }
}

module.exports = BaseService;
