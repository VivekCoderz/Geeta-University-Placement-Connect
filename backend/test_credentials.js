const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const run = async () => {
  const uri = process.env.mongoURI;
  await mongoose.connect(uri);
  console.log("Connected to DB...");

  const admin = await User.findOne({ email: "admin@placementconnect.com" });
  if (admin) {
    const isMatch = await admin.comparePassword("admin123");
    console.log("Admin admin123 matches:", isMatch);
  } else {
    console.log("Admin account not found!");
  }

  const cell = await User.findOne({ email: "placementcell@placementconnect.com" });
  if (cell) {
    const isMatch = await cell.comparePassword("cell123");
    console.log("Placement Cell cell123 matches:", isMatch);
  } else {
    console.log("Placement Cell account not found!");
  }

  await mongoose.disconnect();
};

run().catch(console.error);
