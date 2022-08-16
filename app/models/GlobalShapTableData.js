const mongoose = require("mongoose");

var GlobalShapTableDataSchema = new mongoose.Schema({
  gender_M: {
    type: Number,
    required: true
  },
  "maritalstatus_1 .0": {
    type: Number,
    required: true
  },
  maritalstatus_Unknown: {
    type: Number,
    required: true
  },
  higheducationind_1: {
    type: Number,
    required: true
  },
  addresschangeind_1: {
    type: Number,
    required: true
  },
  livingstatus_Rent: {
    type: Number,
    required: true
  },
  accidentsite_Local: {
    type: Number,
    required: true
  },
  "accidentsite_Parking Lot": {
    type: Number,
    required: true
  },
  "witnesspresentind_1 .0": {
    type: Number,
    required: true
  },
  witnesspresentind_Unknown: {
    type: Number,
    required: true
  },
  channel_Online: {
    type: Number,
    required: true
  },
  channel_Phone: {
    type: Number,
    required: true
  },
  policyreportfiledind_1: {
    type: Number,
    required: true
  },
  vehiclecategory_Large: {
    type: Number,
    required: true
  },
  vehiclecategory_Medium: {
    type: Number,
    required: true
  },
  vehiclecolor_blue: {
    type: Number,
    required: true
  },
  vehiclecolor_gray: {
    type: Number,
    required: true
  },
  vehiclecolor_other: {
    type: Number,
    required: true
  },
  vehiclecolor_red: {
    type: Number,
    required: true
  },
  vehiclecolor_silver: {
    type: Number,
    required: true
  },
  vehiclecolor_white: {
    type: Number,
    required: true
  },
  pastnumofclaims_1: {
    type: Number,
    required: true
  },
  pastnumofclaims_2: {
    type: Number,
    required: true
  },
  pastnumofclaims_3: {
    type: Number,
    required: true
  },
  pastnumofclaims_4: {
    type: Number,
    required: true
  },
  pastnumofclaims_5: {
    type: Number,
    required: true
  },
  pastnumofclaims_6: {
    type: Number,
    required: true
  },
  saftyrating: {
    type: Number,
    required: true
  },
  liabprct: {
    type: Number,
    required: true
  },
  claimestpayout: {
    type: Number,
    required: true
  },
  ageofvehicle: {
    type: Number,
    required: true
  },
  vehicleprice: {
    type: Number,
    required: true
  },
  vehicleweight: {
    type: Number,
    required: true
  },
  annualincome: {
    type: Number,
    required: true
  },
  ageofdriver: {
    type: Number,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  predicted_fraud: {
    type: Number,
    required: true
  },
  claimno: {
    type: Number,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  actual: {
    type: Number,
    required: true
  },

}, {
  collection: "local_Explainability"
});

mongoose.model("GlobalShapTableData", GlobalShapTableDataSchema);

module.exports = mongoose.model("GlobalShapTableData");