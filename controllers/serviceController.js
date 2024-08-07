const Service = require("../models/service");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { serviceid } = req.body;
    const service = await Service.findOne({ _id: serviceid });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addService = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body; // Add imageUrl here
    const newService = { name, description, price, imageUrl }; // Include imageUrl
    const service = new Service(newService);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
