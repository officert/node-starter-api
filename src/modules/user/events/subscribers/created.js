const eventBus = require('modules/eventBus');
const logger = require('modules/logger');
const userNotificationService = require('modules/user/notifications');

const USER_EVENTS = require('modules/user/constants/events');

eventBus.subscribe(USER_EVENTS.USER_CREATED, userId => {
  userNotificationService.sendRegisteredNotifications(userId)
    .then(() => {
      logger.info(`${USER_EVENTS.USER_CREATED} success`);
    })
    .catch(err => {
      logger.error(`${USER_EVENTS.USER_CREATED} error`);
      logger.error(err);
    });
});
