const express = require('express');
const router = express.Router();
const async = require('async');

const validator = require('./validator');
const controller = require('./controller');

router.post('/auth/login', (req, res, next) => {
  async.series([
    done => controller.validate(validator.login)(req, res, done),
    done => controller.login(req, res, done)
  ], next);
});

module.exports = router;
