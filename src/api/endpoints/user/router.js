const express = require('express');
const router = express.Router();
const async = require('async');

const auth = require('api/middleware/authorization');
const validator = require('./validator');
const controller = require('./controller');

router.get('/users/me', (req, res, next) => {
  async.series([
    done => auth.authenticate(req, res, done),
    done => controller.validate(validator.me)(req, res, done),
    done => controller.me(req, res, done)
  ], next);
});

router.put('/users/:id', (req, res, next) => {
  async.series([
    done => auth.authenticateCurrentUser(req.params.id)(req, res, done),
    done => controller.validate(validator.updateById)(req, res, done),
    done => controller.updateById(req, res, done)
  ], next);
});

module.exports = router;
