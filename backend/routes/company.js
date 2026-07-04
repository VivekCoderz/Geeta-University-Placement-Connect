const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company");
const { jwtVerify, authorizeRoles, getAssociatedDetails } = require("../middleware/jwtVerify");

router.post("/jobs", jwtVerify, authorizeRoles("recruiter", "company"), getAssociatedDetails, companyController.postJob);
router.get("/applications/:jobId", jwtVerify, authorizeRoles("recruiter", "company"), getAssociatedDetails, companyController.getApplications);

module.exports = router;
