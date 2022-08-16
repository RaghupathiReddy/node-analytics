var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../../config'); // get config file
var verifyToken = require('./VerifyToken')
const validateUserDetail = require('./validators/userValidators/validateUserDetail')
const validateResetPasswordDetail = require('./validators/userValidators/validateResetPasswordDetail')
const validateUpdatePassword = require('./validators/userValidators/validateUpdatePassword')

var User = require('../models/User');
var Token = require('../models/Token');
var sendEmail = require('../utils/sendEmail');

// REGISTER A NEW USER
router.post('/',validateUserDetail ,function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      company: req.body.company,
      designation: req.body.designation,
    },
      function (err, user) {
        if (err) {
          return res.status(400).send({message: 'Email address must be unique'});
        }
  
        // if user is registered without errors
        // create a token
        var token = jwt.sign({ user: user._id }, config.secret, { expiresIn: config.tokenExpiry });
  
        res.status(200).send({ auth: true, token: token, user: user });
      });
  });
  

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', verifyToken, function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', verifyToken, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id',verifyToken,function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        const userID=user._id
        if (err) return res.status(500).send("There was a problem deleting the user.");
        if(!user) return res.status(400).send(`No user with userId ${userID} exists in the database.`)
        res.status(200).send(`No user with userId ${userID} exists in the database.`);
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', verifyToken, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

// Sends reset password link
router.post("/forgot_password",validateResetPasswordDetail ,async (req, res) => {
    try {
        const email = req.body.email;
        if(email){
            const user = await User.findOne({ email: email });
            if (!user){
                return res.status(400).send("User with given email doesn't exist");
            }
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
            }

            const link = `${config.siteURL}/${req.body.resetPasswordEndPoint}/${user._id}/${token.token}`;
            sendEmail(email, "Password reset", link).then((response) => {
                if(response === true)
                    res.status(200).send({message: "Password reset link has been sent to your email account"});
                else
                    res.status(500).send({message: 'An error occured with the system, Please try after sometime'});
            })
        }
        else{
            res.status(401).send({message: 'Please provide the email address'})
        }
    } catch (error) {
        res.status(500).send({error: 'An error occured with the system, Please try after sometime'});
    }
});

// updates the new password
router.post("/update_password/:userId/:token",validateUpdatePassword ,async (req, res) => {
    try {
        const new_password = req.body.password
        if(!new_password)
          return res.status(400).send({message: 'Please enter valid password'});

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send({message: "Invalid link or expired"});

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({message: "Invalid link or expired"});

        const hashedPassword = bcrypt.hashSync(new_password, 8);
        User.updateOne({email: user.email}, {Password: hashedPassword}, function(err, res){
            if(err)
                res.status(500).send({message: "An error occured with the system, Please try after sometime"});
        })
        await token.delete();

        res.status(200).send({message: "password reset sucessfully."});
    } catch (error) {
        res.status(500).send({message: "An error occured with the system, Please try after sometime"});
        console.log(error);
    }
});

// Get user by JWT token

router.post("/verify_token", verifyToken, (req, res) => {
    User.findById(req.userId, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
})

module.exports = router;