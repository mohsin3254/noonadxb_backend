/*const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "booked",
      enum: ["booked", "completed", "canceled"], // Example status options
    },
    transactionid: { type: String, required: true },
    serviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    totalamount: {
      type: Number,
      required: true,
      min: 0, // Ensure amount is not negative
    },
    name: { type: String, required: true }, // Add name field
    address: { type: String, required: true }, // Add address field
    time: { type: String, required: true }, // Add time field if needed
    phone: { type: String, required: true }, // Add phone field
  },
  { timestamps: true }
);

bookingSchema.index({ serviceid: 1, userid: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;




const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "booked",
      enum: ["booked", "completed", "canceled"],
    },
    transactionid: { type: String, required: true },
    serviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    totalamount: { type: Number, required: true, min: 0 },
    name: { type: String, required: true },
    address: { type: String, required: true },
    time: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

bookingSchema.index({ serviceid: 1, userid: 1 });

const Booking = mongoose.model("Booking", bookingSchema);


const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "booked",
      enum: ["booked", "completed", "canceled"],
    },
    stripeChargeId: { type: String, required: true }, // Changed from transactionid
    date: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 }, // Ensure field name matches
    name: { type: String, required: true },
    address: { type: String, required: true },
    time: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

bookingSchema.index({ service: 1, user: 1 }); // Adjust index fields

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;


const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

This model is working for bookservice.
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  service: String,
  serviceid: mongoose.Schema.Types.ObjectId,
  name: String,
  phone: String,
  date: String,
  time: String,
  address: String,
  totalamount: Number,
  transactionid: String,
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
*/
/*
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    serviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    totalamount: { type: Number, required: true },
    transactionid: { type: String, required: true },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Add user reference
    status: { type: String, default: "booked" }, // Add status field if needed
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
*/

/*
Working aith userid 
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
    }, // Ensure this line is present
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
      required: true,
      ref: "User",
    },
    status: { type: String, default: "booked" }, // Add this line
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
