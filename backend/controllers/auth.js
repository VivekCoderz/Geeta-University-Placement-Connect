const studentModel = require("../models/student");
const ErrorWrapper = require("../utils/ErrorWrapper");
const ErrorHandler = require("../utils/ErrorHandle");

module.exports.postRegister = ErrorWrapper(async (req, res, next) => {
  const { name, email, password, branch, year, rollNumber } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!branch) missingFields.push("branch");
  if (!year) missingFields.push("year");
  if (!rollNumber) missingFields.push("rollNumber");

  if (missingFields.length > 0) {
    throw new ErrorHandler(
      400,
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  const existingStudent = await studentModel.findOne({ email });
  if (existingStudent) {
    throw new ErrorHandler(400, "User already exists");
  }

  const newStudent = new studentModel({
    name,
    email,
    password,
    branch,
    year,
    rollNumber,
  });

  await newStudent.save();

  res.status(201).json({ message: "User registered successfully" });
});

module.exports.postLogin = ErrorWrapper(async (req, res, next) => {
  const { email, password, rollNumber } = req.body;

  const missingFields = [];
  if (!email && !rollNumber) {
    missingFields.push("email or rollNumber");
  }
  if (!password) {
    missingFields.push("password");
  }

  if (missingFields.length > 0) {
    throw new ErrorHandler(
      400,
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  const student = await studentModel.findOne({
    $or: [{ email }, { rollNumber: rollNumber }],
  });
  if (!student) {
    throw new ErrorHandler(404, "User not found");
  }

  if (!(await student.comparePassword(password))) {
    throw new ErrorHandler(401, "Invalid password");
  }

  const token = student.generateToken();
  res.cookie("token", token, {
    httpOnly: true,
  });

  res.status(200).json({ message: "User logged in successfully"});
});

module.exports.getLogout = ErrorWrapper(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});

module.exports.getProfile = ErrorWrapper(async (req, res, next) => {    

    const studentId = req.student.id;
    

