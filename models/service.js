const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    currentbookings: [
      {
        bookingid: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        fromdate: { type: String },
        todate: { type: String },
        userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, default: "booked" },
      },
    ],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
