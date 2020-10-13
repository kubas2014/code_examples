"use strict";

//dependencies
const express = require("express"); //express node.js server
const router = express.Router(); //express router
const passport = require("passport"); //passport.js authentication
const jwt = require("jsonwebtoken"); //jwt to sign the password
const middlewares = require("../middlewares");
const config = require("../config"); //to access our Jwt Secret
const User = require("../models/user"); //to access the user database
const Dancer = require("../models/dancer"); //to create new dancers
const Organizer = require("../models/organizer"); //to create new organizers
const Request = require("../models/partnerrequest"); //returning requests to profile
const Event = require("../models/event"); //returning events to profile
const ObjectId = require("mongoose").Types.ObjectId; //object id for validation
const mail = require("../services/mail"); //mail service
const bcrypt = require("bcrypt"); //bcrypt hashing
//Unsecured routes for anyone to access

//REGISTER Dancer
router.post("/register/dancer", async (req, res) => {
  //Validate the request body
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  try {
    //create a new dancer
    let dancer = await Dancer.create(req.body);
    //populate the user body request for the JWT token issuing with the newly created dancer
    const user = {
      _id: dancer._id,
      email: dancer.email,
    };
    //return the token to the user (redirect to homepage will happen on the client);
    let response = {
      name: dancer.name,
      email: dancer.email,
      picture: dancer.picture,
      userType: dancer.userType,
    };
    const token = await jwt.sign({ user: user }, config.JwtSecret, {
      expiresIn: "12h",
    });
    //if token then return to the user
    if (token) {
      response.token = token;
    }
    //Send Welcome Mail
    await mail.sendCreateMail(
      dancer.name,
      dancer.email,
      //Mail is not crucial for user does only log it internally
      (err, data) => {
        if (err) {
          console.log("Mail client error at dancer creation" + err);
        }
      }
    );
    //return response to client
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//UPDATE Dancer
router.post(
  "/update/dancer",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //Validate the request body
    //console.log(req.body);
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({
        error: "Bad Request",
        message: "The request body is empty",
      });

    try {
      //create a new dancer
      let dancer = await Dancer.findOneAndUpdate(
        { _id: req.user._id },
        req.body
      );
      //populate the body request for the JWT token issuing with the newly created dancer
      const user = {
        _id: dancer._id,
        email: dancer.email,
      };
      //return the token to the user (redirect to homepage will happen on the client);
      let response = {
        name: dancer.name,
        email: dancer.email,
        picture: dancer.picture,
        userType: dancer.userType,
      };
      //sign the JWT token and populate the payload with the user email and id
      const token = await jwt.sign({ user: user }, config.JwtSecret, {
        expiresIn: "12h",
      });
      //if token then return to the user
      if (token) {
        response.token = token;
      }
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//GET the /profile of the user
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    //console.log(req.user);
    try {
      let user = await User.findOne({ _id: req.user._id });
      //setting the response object
      let response = {};
      //if dancer, add 5 events and requests to the response
      if (user.userType === "Dancer") {
        let events = await Event.find()
          .where("_id")
          .in(user.interestedInEvents)
          .select("-organizer")
          .sort({ startDate: 1 })
          .limit(5);
        let requests = await Request.find({ dancer: new ObjectId(user._id) })
          .populate("dancer", "-_id ")
          .populate("event", null, { startDate: { $gte: new Date() } })
          .sort({ timestamp: 1 });
        //console.log(requests);
        let requestsEvent = requests.filter((request) => request.event != null);
        response.requests = requestsEvent;
        response.events = events;
      }
      //if organizer, add events to the response
      else if (user.userType === "Organizer") {
        let events = await Event.find({ organizer: new ObjectId(user._id) })
          .select("-organizer")
          .sort({ startDate: 1 })
          .limit(5);
        response.events = events;
      }
      //Removing sensitive properties from user object
      user.password = null;
      user._id = null;
      user.__v = null;
      //adding the user object to the response
      response.user = user;
      //return response to client
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);


module.exports = router;
