const Promise = require('bluebird');

const postmark = require('modules/libs/postmark');
const userService = require('modules/user');
const InvalidArgumentError = require('errors/invalidArgumentError');
const config = require('config');

const TEMPLATES = require('modules/libs/postmark/constants/templates');

class UserNotificationService {
  sendRegisteredNotifications(userId) {
    if (!userId) return Promise.reject(new InvalidArgumentError('userId'));

    return userService.findById(userId)
      .then(user => sendRegisteredEmail(user));
  }
}

function sendRegisteredEmail(user) {
  if (!user) return Promise.reject(new InvalidArgumentError('user'));

  return postmark.sendEmail({
    templateId: TEMPLATES.USER_REGISTERED,
    from: config.messaging.postmark.fromEmailAddress,
    to: user.email,
    data: {
      name: user.name
    }
  });
}

module.exports = new UserNotificationService();
