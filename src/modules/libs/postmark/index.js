const postmark = require('postmark');
const Promise = require('bluebird');

const config = require('config');
const PostmarkApiError = require('./errors/apiError');
const InvalidArgumentError = require('errors/invalidArgumentError');

const postmarkClient = new postmark.Client(config.messaging.postmark.key);

module.exports = {
  _client: postmarkClient, //exposed so we can't mock it during testing

  /**
   * @param {Object} options
   * @param {String} options.from
   * @param {String} options.to
   * @param {String} options.templateId
   * @param {Object} options.data
   */
  sendEmail(options) {
    if (!options) return Promise.reject(new InvalidArgumentError('options'));
    if (!options.from) return Promise.reject(new InvalidArgumentError('options.from'));
    if (!options.to) return Promise.reject(new InvalidArgumentError('options.to'));
    if (!options.templateId) return Promise.reject(new InvalidArgumentError('options.templateId'));
    if (!options.data) return Promise.reject(new InvalidArgumentError('options.data'));

    return Promise.fromCallback(callback => {
      postmarkClient.sendEmailWithTemplate({
        From: options.from,
        To: options.to,
        TemplateId: options.templateId,
        TemplateModel: options.data
      }, (err, response) => {
        if (err) {
          return callback(new PostmarkApiError(err.message));
        }
        return callback(null, response);
      });
    });
  }
};
