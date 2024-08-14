/*const express = require("express");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51M2qZEJdqzfSzjlZSYueQsk8wh39ALTsqc3TOmKPoPXHdRSw4p0vCorFbPqaHBo1bU0NsUdBgTxiDBmjORxtoQ6E00spOYJZ4Z"
); //
const { v4: uuidv4 } = require("uuid"); //https://www.npmjs.com/package/uuid

const router = express.Router();

const Booking = require("../models/booking");
const Service = require("../models/service");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/cancelbooking", authMiddleware, async (req, res) => {
  const { bookingid, serviceid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });

    booking.status = "cancelled";
    await booking.save();
    const service = await Service.findOne({ _id: serviceid });
    const bookings = service.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    service.currentbookings = temp;
    await service.save();

    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/getbookingbyuserid", authMiddleware, async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });

    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/bookservice", authMiddleware, async (req, res) => {
  try {
    const { service, userid, date, totalAmount, token } = req.body;

    try {
      // Create customer
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      // Charge payment
      const payment = await stripe.charges.create(
        {
          amount: totalAmount * 100,
          customer: customer.id,
          currency: "AED",
          receipt_email: token.email,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      // Payment Success
      if (payment) {
        try {
          const newBooking = new Booking({
            service: service.name,
            serviceid: service._id,
            userid,
            date: moment(date).format("DD-MM-YYYY"),
            totalamount: totalAmount,
            transactionid: uuidv4(),
          });

          const booking = await newBooking.save();

          const serviceTmp = await Service.findOne({ _id: service._id });
          serviceTmp.currentbookings.push({
            bookingid: booking._id,
            date: moment(date).format("DD-MM-YYYY"),
            userid: userid,
            status: booking.status,
          });

          await serviceTmp.save();
          res.send("Payment Successful, Your service is booked");
        } catch (error) {
          return res.status(400).json({ message: error });
        }
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;




const express = require("express");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51M2qZEJdqzfSzjlZSYueQsk8wh39ALTsqc3TOmKPoPXHdRSw4p0vCorFbPqaHBo1bU0NsUdBgTxiDBmjORxtoQ6E00spOYJZ4Z"
);
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const Booking = require("../models/booking");
const Service = require("../models/service");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings" });
  }
});

router.post("/cancelbooking", authMiddleware, async (req, res) => {
  const { bookingid, serviceid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();
    const service = await Service.findOne({ _id: serviceid });
    const bookings = service.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    service.currentbookings = temp;
    await service.save();
    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error canceling booking" });
  }
});

router.post("/getbookingbyuserid", authMiddleware, async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings by user" });
  }
});

router.post("/bookservice", authMiddleware, async (req, res) => {
  try {
    const { service, userid, date, totalAmount, token } = req.body;

    console.log("Stripe Token: ", token); // Log Stripe token for debugging

    // Create customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge payment
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    console.log("Stripe Payment: ", payment); // Log Stripe payment response

    // Payment Success
    if (payment) {
      try {
        const newBooking = new Booking({
          service: service.name,
          serviceid: service._id,
          userid,
          date: moment(date).format("DD-MM-YYYY"),
          totalamount: totalAmount,
          transactionid: uuidv4(),
        });

        const booking = await newBooking.save();

        const serviceTmp = await Service.findOne({ _id: service._id });
        serviceTmp.currentbookings.push({
          bookingid: booking._id,
          date: moment(date).format("DD-MM-YYYY"),
          userid: userid,
          status: booking.status,
        });

        await serviceTmp.save();
        res.send("Payment Successful, Your service is booked");
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: error.message || "Error saving booking" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message || "Payment failed" });
  }
});

module.exports = router;  







const express = require("express");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const Booking = require("../models/booking");
const Service = require("../models/service");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings" });
  }
});

router.post("/cancelbooking", authMiddleware, async (req, res) => {
  const { bookingid, serviceid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();
    const service = await Service.findOne({ _id: serviceid });
    const bookings = service.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    service.currentbookings = temp;
    await service.save();
    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error canceling booking" });
  }
});

router.post("/getbookingbyuserid", authMiddleware, async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings by user" });
  }
});

router.post("/bookservice", authMiddleware, async (req, res) => {
  try {
    const { service, userid, date, totalAmount, token } = req.body;

    // Log the token object
    console.log("Received token:", token);

    if (
      !service ||
      !service._id ||
      !userid ||
      !date ||
      !totalAmount ||
      !token
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!token.id || !token.email) {
      return res.status(400).json({ message: "Invalid token data" });
    }

    console.log("Stripe Token: ", token);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    console.log("Stripe Payment: ", payment);

    if (payment && payment.status === "succeeded") {
      const newBooking = new Booking({
        service: service.name,
        serviceid: service._id,
        userid,
        date: moment(date).format("DD-MM-YYYY"),
        totalamount: totalAmount,
        transactionid: payment.id,
      });

      const booking = await newBooking.save();

      const serviceTmp = await Service.findOne({ _id: service._id });
      if (!serviceTmp) {
        return res.status(404).json({ message: "Service not found" });
      }

      serviceTmp.currentbookings.push({
        bookingid: booking._id,
        date: moment(date).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await serviceTmp.save();

      res.send("Payment Successful, Your service is booked");
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment or Booking Error:", error);
    return res.status(400).json({
      message: error.message || "Payment failed or unexpected error",
    });
  }
});

module.exports = router;  */

/*
const express = require("express");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const Booking = require("../models/booking");
const Service = require("../models/service");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/getallbookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings" });
  }
});

router.post("/cancelbooking", authMiddleware, async (req, res) => {
  const { bookingid, serviceid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();
    const service = await Service.findOne({ _id: serviceid });
    const bookings = service.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    service.currentbookings = temp;
    await service.save();
    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error canceling booking" });
  }
});

router.post("/getbookingbyuserid", authMiddleware, async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Error fetching bookings by user" });
  }
});

router.post("/bookservice", authMiddleware, async (req, res) => {
  try {
    const {
      service,
      userid,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      token,
    } = req.body;

    console.log("Received booking details:", req.body);

    // Validate required fields
    if (
      !service ||
      !service._id ||
      !userid ||
      !name ||
      !phone || // Validate phone
      !date ||
      !time ||
      !address ||
      !totalAmount ||
      !token
    ) {
      console.error("Missing required fields", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!token.id || !token.email) {
      console.error("Invalid token data", token);
      return res.status(400).json({ message: "Invalid token data" });
    }

    console.log("Stripe Token: ", token);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    console.log("Stripe Payment: ", payment);

    if (payment && payment.status === "succeeded") {
      const newBooking = new Booking({
        service: service.name,
        serviceid: service._id,
        userid,
        name,
        phone, // Include phone
        date: moment(date).format("DD-MM-YYYY"),
        time,
        address,
        totalamount: totalAmount,
        transactionid: payment.id,
      });

      const booking = await newBooking.save();

      const serviceTmp = await Service.findOne({ _id: service._id });
      if (!serviceTmp) {
        return res.status(404).json({ message: "Service not found" });
      }

      serviceTmp.currentbookings.push({
        bookingid: booking._id,
        date: moment(date).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await serviceTmp.save();

      res.send("Payment Successful, Your service is booked");
    } else {
      console.error("Payment failed", payment);
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment or Booking Error:", error);
    return res.status(400).json({
      message: error.message || "Payment failed or unexpected error",
    });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Service = require("../models/service");

const { v4: uuidv4 } = require("uuid");
//const authMiddleware = require("../middleware/authMiddleware"); // Ensure you have your auth middleware
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure you have your Stripe secret key
//const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
//console.log("Stripe Secret Key:", stripeSecretKey); // Ensure this logs correctly
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51M2qZEJdqzfSzjlZSYueQsk8wh39ALTsqc3TOmKPoPXHdRSw4p0vCorFbPqaHBo1bU0NsUdBgTxiDBmjORxtoQ6E00spOYJZ4Z"
);

/*
router.post("/bookservice", authMiddleware, async (req, res) => {
  const { service, name, phone, date, time, address, totalAmount, token } =
    req.body;

  if (!service || !token) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    console.log("Token received in backend:", token);
    console.log("Token ID used for charge:", token.id || token); // Ensure token.id or token itself

    const charge = await stripe.charges.create({
      amount: totalAmount * 100, // Amount in cents
      currency: "usd",
      source: token.id || token, // Use token.id or token directly
      description: `Booking for ${service.name}`,
      metadata: { serviceId: service._id, userId: req.user._id },
    });

    const booking = new Booking({
      service: service._id,
      user: req.user._id,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      stripeChargeId: charge.id,
    });

    await booking.save();

    res.status(200).json({ message: "Service booked successfully", booking });
  } catch (error) {
    console.error("Error booking service:", error);
    res
      .status(500)
      .json({ message: "Failed to book service", error: error.message });
  }
}); */

/*
router.post("/bookservice", authMiddleware, async (req, res) => {
  const { service, name, phone, date, time, address, totalAmount, token } =
    req.body;

  if (!service || !token) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge the customer
    const charge = await stripe.charges.create(
      {
        amount: totalAmount * 100, // Amount in cents
        customer: customer.id,
        currency: "USD",
        description: `Booking for ${service.name}`,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(), // To avoid duplicate charges
      }
    );

    // Create and save the booking
    const booking = new Booking({
      service: service._id,
      user: req.user._id,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      stripeChargeId: charge.id, // Save Stripe charge ID for reference
    });

    await booking.save();

    res.status(200).json({ message: "Service booked successfully", booking });
  } catch (error) {
    console.error("Error booking service:", error);
    res
      .status(500)
      .json({ message: "Failed to book service", error: error.message });
  }
});

// Route to get all bookings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceid")
      .populate("userid");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Route to get bookings by user ID
router.get("/user/:userid", authMiddleware, async (req, res) => {
  try {
    const { userid } = req.params;
    const bookings = await Booking.find({ userid }).populate("serviceid");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

// Route to cancel a booking
router.delete("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});   */

/* Before whatsapp

router.post("/bookservice", authMiddleware, async (req, res) => {
  const { service, name, phone, date, time, address, totalAmount, token } =
    req.body;

  if (!service || !token) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge the customer
    const charge = await stripe.charges.create(
      {
        amount: totalAmount * 100, // Amount in cents
        customer: customer.id,
        currency: "USD",
        description: `Booking for ${service.name}`,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(), // To avoid duplicate charges
      }
    );

    // Create and save the booking
    const booking = new Booking({
      service: service._id,
      user: req.user._id,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      stripeChargeId: charge.id, // Save Stripe charge ID for reference
    });

    await booking.save();

    res.status(200).json({ message: "Service booked successfully", booking });
  } catch (error) {
    console.error("Error booking service:", error);
    res
      .status(500)
      .json({ message: "Failed to book service", error: error.message });
  }
}); 

// Route to get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceid")
      .populate("userid");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Route to get bookings by user ID
router.get("/user/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const bookings = await Booking.find({ userid }).populate("serviceid");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

// Route to cancel a booking
router.delete("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

router.post("/bookservice", async (req, res) => {
  try {
    const { service, name, phone, date, time, address, totalAmount, token } =
      req.body;

    // Find the service by ID
    const Service = await service.findById(service._id);
    if (!Service) {
      return res.status(404).send({ message: "Service not found" });
    }

    // Create a new booking
    const booking = new Booking({
      service: service._id,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      token,
    });

    // Save the booking
    await booking.save();

    res.send({ message: "Service booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error booking service" });
  }
});


router.post("/bookroom", async (req, res) => {
  try {
    const { service, name, phone, date, time, address, totalAmount, token } =
      req.body;

    try {
      //create customer
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      //charge payment
      const payment = await stripe.charges.create(
        {
          amount: totalAmount * 100,
          customer: customer.id,
          currency: "USD",
          receipt_email: token.email,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      //Payment Success
      if (payment) {
        try {
          const newBooking = new Booking({
            service: service._id,
      name,
      phone,
      date,
      time,
      address,
      totalAmount,
      
            transactionid: uuidv4(),
          });

          const booking = await newBooking.save();

          const roomTmp = await Room.findOne({ _id: room._id });
          roomTmp.currentbookings.push({
            bookingid: booking._id,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            userid: userid,
            status: booking.status,
          });

          await roomTmp.save();
          res.send("Payment Successful, Your Room is booked");
        } catch (error) {
          return res.status(400).json({ message: error });
        }
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
*/

const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51M2qZEJdqzfSzjlZSYueQsk8wh39ALTsqc3TOmKPoPXHdRSw4p0vCorFbPqaHBo1bU0NsUdBgTxiDBmjORxtoQ6E00spOYJZ4Z"
);
const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/booking");
const Service = require("../models/service");

const router = express.Router();

router.get("/service/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching service" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    // Populate the serviceid field with service details
    const bookings = await Booking.find({})
      .populate("serviceid", "name") // Populate service details
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
/*workinh without guest
router.post("/getbookingbyuserid", async (req, res) => {
  const { userid } = req.body;

  try {
    // Fetch bookings for user or guest
    const bookings = await Booking.find({ userid });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/
router.post("/getbookingbyuserid", async (req, res) => {
  const { userid } = req.body;

  try {
    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if userid is valid ObjectId, else treat it as null for guest users
    const userIdToQuery = mongoose.Types.ObjectId.isValid(userid)
      ? userid
      : null;

    // Fetch bookings for user or guest
    const bookings = await Booking.find({ userid: userIdToQuery }).populate(
      "serviceid",
      "name"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, userid } = req.body;

  try {
    if (!bookingid || !userid) {
      console.log("Error: Missing booking ID or user ID");
      return res
        .status(400)
        .json({
          success: false,
          message: "Booking ID and User ID are required",
        });
    }

    // Check if userid is a valid ObjectId, else treat it as a guest identifier
    const isValidUserId = mongoose.Types.ObjectId.isValid(userid);
    const userIdToQuery = isValidUserId ? userid : null;
    const isGuest = !isValidUserId;

    console.log("Cancel Booking Request:", { bookingid, userid, isGuest });

    // Find the booking by ID
    const booking = await Booking.findById(bookingid);

    if (!booking) {
      console.log("Error: Booking not found for ID:", bookingid);
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    console.log("Booking Found:", booking);

    // Check if the booking is associated with a user
    if (booking.userid) {
      // If the booking is for a logged-in user
      if (booking.userid.toString() !== userIdToQuery) {
        console.log(
          "Unauthorized access. Expected User ID:",
          booking.userid.toString(),
          "Received:",
          userIdToQuery
        );
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });
      }
    } else if (!booking.userid && isGuest) {
      // If the booking is for a guest
      if (booking.transactionid !== userid) {
        console.log(
          "Unauthorized for guest. Expected Transaction ID:",
          booking.transactionid,
          "Received:",
          userid
        );
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized" });
      }
    } else {
      console.log("Invalid User ID or Transaction ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID or Transaction ID" });
    }

    // Update the booking status to "cancelled"
    booking.status = "cancelled";
    await booking.save();
    console.log("Booking cancelled successfully for ID:", bookingid);
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelling booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Error cancelling booking" });
  }
});

/*2nd upeer one is without guest
router.post("/bookservice", async (req, res) => {
  const {
    service,
    name,
    phone,
    date,
    time,
    address,
    totalAmount,
    token,
    userid, // userid is now optional
  } = req.body;

  try {
    // Create customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Charge payment
    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    // Payment Success
    if (payment) {
      try {
        // Save booking
        const newBooking = new Booking({
          service: service.name,
          serviceid: service._id,
          name,
          phone,
          date: moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"), // Use ISO format
          time,
          address,
          totalamount: totalAmount,
          transactionid: uuidv4(),
          userid: userid || null, // Associate with user if logged in, else null
        });

        await newBooking.save();

        res.send("Payment Successful, Your Service is booked");
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
*/
/*
router.post("/bookservice", async (req, res) => {
  const {
    service,
    name,
    phone,
    date,
    time,
    address,
    totalAmount,
    token,
    userid,
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBookingData = {
        service: service.name,
        serviceid: service._id,
        name,
        phone,
        date: moment(date, "MM-DD-YYYY").format("MM-DD-YYYY"),
        time,
        address,
        totalamount: totalAmount,
        transactionid: uuidv4(),
      };

      // Only add userid if it's provided and valid
      if (userid && mongoose.Types.ObjectId.isValid(userid)) {
        newBookingData.userid = userid;
      }

      const newBooking = new Booking(newBookingData);
      await newBooking.save();

      res.send("Payment Successful, Your Service is booked");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
*/

router.post("/bookservice", async (req, res) => {
  const {
    service,
    name,
    phone,
    date,
    time,
    address,
    totalAmount,
    token,
    userid,
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "AED",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBookingData = {
        service: service.name,
        serviceid: service._id,
        name,
        phone,
        date: moment(date, "MM-DD-YYYY").format("MM-DD-YYYY"),
        time,
        address,
        totalamount: totalAmount,
        transactionid: uuidv4(),
      };

      // Only add userid if it's provided and valid
      if (userid && mongoose.Types.ObjectId.isValid(userid)) {
        newBookingData.userid = userid;
      }

      const newBooking = new Booking(newBookingData);
      await newBooking.save();

      res.send("Payment Successful, Your Service is booked");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
