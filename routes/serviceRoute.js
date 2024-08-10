const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  addService,
  deleteService,
} = require("../controllers/serviceController");

router.get("/allservices", getAllServices);
router.post("/servicebyid", getServiceById);
router.post("/addservice", addService);
router.delete("/:id", deleteService);

router.get("/getservicebyid", getServiceById);
module.exports = router;
