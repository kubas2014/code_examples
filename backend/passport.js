"use strict";

const passport = require("passport"); //passport.js
const localStrategy = require("passport-local").Strategy; //passport strategy
const jwt = require("jsonwebtoken"); //jwt tokens
const config = require("../config"); //to access JWT Secret
const User = require("../models/userSchema"); //to access the User database

//Configure a Passport Strategy Middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email", //specify the name of the Email property in the POST body request.
      passwordField: "password", //specify the name of the Password property in the POST body request.
    },
    async function (email, password, done) {
      try {
        //Find the user associated with the email provided by the user
        const user = await User.findOne({ email: email });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, {
            message: "Invalid Username",
          });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, {
            message: "Wrong Password",
          });
        }
        //Send the user information to the next middleware
        return done(null, user, {
          message: "Logged in Successfully",
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const JWTstrategy = require("passport-jwt").Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require("passport-jwt").ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: config.JwtSecret,
      //we expect the user to send the token as a query paramater with the name 'secret_token'
      //jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
