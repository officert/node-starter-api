const should = require('should');
const sinon = require('sinon');
const Promise = require('bluebird');

let userNotificationService;
let userService;
let postmark;
let InvalidArgumentError;
let config;
let TEMPLATES;

let sandbox;

before(() => {
  userNotificationService = require('modules/user/notifications');
  userService = require('modules/user');
  postmark = require('modules/libs/postmark');

  InvalidArgumentError = require('errors/invalidArgumentError');

  TEMPLATES = require('modules/libs/postmark/constants/templates');

  config = require('config');

  sandbox = sinon.sandbox.create();
});

describe('tests', () => {
  describe('unit', () => {
    describe('modules', () => {
      describe('user', () => {
        describe('notifications', () => {
          describe('sendRegisteredNotifications', () => {
            afterEach(() => {
              sandbox.restore();
            });

            describe('when userId is not passed', () => {
              let userId = null;

              it('should reject with an error', () => {
                return userNotificationService.sendRegisteredNotifications(userId)
                  .then(should.not.exist)
                  .catch(err => {
                    should.exist(err);
                    err.should.be.an.instanceOf(InvalidArgumentError);
                    err.message.should.equal('userId');
                  });
              });
            });

            describe('when userId is passed', () => {
              let userId = '123';

              let user = {
                id: userId,
                email: 'fooo@bar.com',
                name: 'Foo Bar'
              };
              let sendEmailResult = {};

              let findByIdStub;
              let sendEmailStub;

              before('stub userService.findById()', () => {
                findByIdStub = sandbox.stub(userService, 'findById')
                  .returns(Promise.resolve(user));
              });

              before('stub postmark.sendEmail()', () => {
                sendEmailStub = sandbox.stub(postmark, 'sendEmail')
                  .returns(Promise.resolve(sendEmailResult));
              });

              it('should userService.findById() and postmark.sendEmail()', () => {
                return userNotificationService.sendRegisteredNotifications(userId)
                  .then(result => {
                    should.exist(result);

                    findByIdStub.callCount.should.equal(1);
                    findByIdStub.calledWith(userId).should.equal(true);

                    sendEmailStub.callCount.should.equal(1);
                    sendEmailStub.calledWith({
                      templateId: TEMPLATES.USER_REGISTERED,
                      from: config.messaging.postmark.fromEmailAddress,
                      to: user.email,
                      data: {
                        name: user.name
                      }
                    }).should.equal(true);
                  });
              });
            });
          });
        });
      });
    });
  });
});
