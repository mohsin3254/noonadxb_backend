/*

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: String,
    serviceid: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    date: String,
    time: String,
    address: String,
    totalamount: Number,
    transactionid: String,
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: { type: String, default: "booked" }, // Add this line
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
*/

/*Working absolutely fine*/

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: String,
    serviceid: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    date: String,
    time: String,
    address: String,
    totalamount: Number,
    transactionid: String,
    userid: {
      type: String,
      ref: "User",
      default: null,
      required: false, // Make userid optional
    },
    guestUserId: {
      type: String,
      default: null,
      required: false,
    },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

// models/Booking.js
/*
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: String,
    serviceid: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    date: String,
    time: String,
    address: String,
    totalamount: Number,
    transactionid: String,
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    guestUserId: {
      type: String,
      default: null,
      required: false,
    },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
*/
