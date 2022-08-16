const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');
const config = require('../../config'); // get config file

router.post('/login', function (req, res) {
  if(req.body.username == undefined || req.body.password == undefined){
    res.status(400).send({message: 'Please enter valid username and password123'});
    return;
  }
  User.findOne({ email: req.body.username }, function (err, user) {
    if (err) return res.status(500).send({message: 'Error on the server.'});
    if (!user) return res.status(404).send({message: 'No user found.'});

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(400).send({ message: 'Please enter valid username and password', token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ user: user._id }, config.secret, { expiresIn: config.tokenExpiry });

    // const refreshToken = jwt.sign({ user: user._id }, config.Secret, { expiresIn: config.tokenExpiry });

    const response = {
      'token': token,
      // 'refreshToken': refreshToken,
      'ExpiresIn': config.tokenExpiry,
      'user': user
    }

    // return the information including token as JSON
    res.status(200).send(response);
  });
});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
