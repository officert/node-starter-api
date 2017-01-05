const should = require('should');
const sinon = require('sinon');

let postmark;
let InvalidArgumentError;
let sandbox;

before(() => {
  postmark = require('modules/libs/postmark');
  InvalidArgumentError = require('errors/invalidArgumentError');

  sandbox = sinon.sandbox.create();
});

describe('unit', () => {
  describe('modules', () => {
    describe('libs', () => {
      describe('postmark', () => {
        describe('sendEmail', () => {
          afterEach(() => {
            sandbox.restore();
          });

          describe('when called without options', () => {
            let options = null;

            it('should reject with an error', () => {
              return postmark.sendEmail(options)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('options');
                });
            });
          });

          describe('when called without options.from', () => {
            let options = {
              from: null
            };

            it('should reject with an error', () => {
              return postmark.sendEmail(options)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('options.from');
                });
            });
          });

          describe('when called without options.to', () => {
            let options = {
              from: 'foobar',
              to: null
            };

            it('should reject with an error', () => {
              return postmark.sendEmail(options)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('options.to');
                });
            });
          });

          describe('when called without options.templateId', () => {
            let options = {
              from: 'foobar',
              to: 'barrr',
              templateId: null
            };

            it('should reject with an error', () => {
              return postmark.sendEmail(options)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('options.templateId');
                });
            });
          });

          describe('when called without options.data', () => {
            let options = {
              from: 'foobar',
              to: 'barrr',
              templateId: 'xxxxxxx',
              data: null
            };

            it('should reject with an error', () => {
              return postmark.sendEmail(options)
                .then(should.not.exist)
                .catch(err => {
                  should.exist(err);
                  err.should.be.an.instanceOf(InvalidArgumentError);
                  err.message.should.equal('options.data');
                });
            });
          });

          describe('when called with an accessToken', () => {
            let options = {
              from: 'foobar',
              to: 'barrr',
              templateId: 'xxxxxxx',
              data: {}
            };

            let postmarkResponse = {};

            let sendEmailWithTemplateStub;

            before('stub _client.sendEmailWithTemplate()', () => {
              sendEmailWithTemplateStub = sandbox.stub(postmark._client, 'sendEmailWithTemplate');
              sendEmailWithTemplateStub.callsArgWith(1, null, postmarkResponse);
            });

            it('should call _client.sendEmailWithTemplate()', () => {
              return postmark.sendEmail(options)
                .then(result => {
                  should.exist(result);

                  sendEmailWithTemplateStub.callCount.should.equal(1);
                });
            });
          });
        });
      });
    });
  });
});
