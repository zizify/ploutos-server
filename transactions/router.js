'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = require('./model');

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = router;