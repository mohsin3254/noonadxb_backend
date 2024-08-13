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
      required: false, // Make userid optional
    },
    status: { type: String, default: "booked" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
