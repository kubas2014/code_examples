const mongoose = require("mongoose"); //mongoose middleware for connecting to mongo
const User = require("./user"); //we require the user model to extend it
const options = { discriminatorKey: "eventType", collection: "events" };
// Define the Dancer schema that extends User
const DancerSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["female", "male", "other"],
      required: false,
    },
    height: { type: Number, required: false },
    yearOfBirth: { type: Number, required: true },
    listOfDanceStyles: [
      {
        type: String,
        enum: [
          "latin",
          "cha-cha-cha",
          "samba",
          "jive",
          "paso doble",
          "boldero",
          "rumba",
          "mambo",
          "east coast swing",
          "standard",
          "waltz",
          "viennese waltz",
          "tango",
          "foxtrot",
          "quickstep",
          "hustle",
          "west coast swing",
          "salsa",
          "bachata",
          "various",
        ],
        default: "standard",
        required: false, //not required as dancers can create accounts to only follow events, not everyone is here to find partners
      },
    ],
    proficiencyLevel: {
      type: String,
      //enum: ['beginner', 'bronze', 'silver', 'gold', 'pre-tournament 1', 'pre-tournament 2'],
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      required: false, //not required as dancers can create accounts to only follow events, not everyone is here to find partners
    },
    prefAgeMin: { type: Number, required: false },
    prefAgeMax: { type: Number, required: false },
    prefGender: {
      type: String,
      enum: ["female", "male", "other"],
      required: false, //not required as dancers can create accounts to only follow events, not everyone is here to find partners
    },
  },
  options
);

// Export the Dancer model
module.exports = User.discriminator("Dancer", DancerSchema); //save dancers to the user collection internally
