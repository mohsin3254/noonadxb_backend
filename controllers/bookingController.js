const Booking = require("../models/booking");
const Service = require("../models/service");
const moment = require("moment");
const stripe = require("stripe")("your_stripe_secret");
const { v4: uuidv4 } = require("uuid");

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingid, serviceid } = req.body;
    const booking = await Booking.findById(bookingid);
    booking.status = "cancelled";
    await booking.save();

    const service = await Service.findById(serviceid);
    service.currentbookings = service.currentbookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    await service.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsByUserId = async (req, res) => {
  try {
    const { userid } = req.body;
    const bookings = await Booking.find({ userid });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookService = async (req, res) => {
  try {
    const { service, userid, fromdate, todate, totalAmount, totaldays, token } =
      req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "USD",
        receipt_email: token.email,
      },
      { idempotencyKey: uuidv4() }
    );

    if (payment) {
      const newBooking = new Booking({
        service: service.name,
        serviceid: service._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount: totalAmount,
        totaldays,
        transactionid: uuidv4(),
      });

      const booking = await newBooking.save();

      const serviceTmp = await Service.findById(service._id);
      serviceTmp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid,
        status: booking.status,
      });

      await serviceTmp.save();
      res.json({ message: "Payment successful, your service is booked" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
