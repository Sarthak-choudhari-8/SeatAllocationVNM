const express = require("express");
const multer = require("multer");
const path = require("path");
const { allocateSeats } = require("../controllers/allocation");
const { sendEmails } = require("../controllers/emailService");

const router = express.Router();

// Multer setup for CSV upload
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => cb(null, "students.csv"),
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const outputFilePath = await allocateSeats("./uploads/students.csv");
        await sendEmails("./output/allocated_students.csv");

        res.json({ message: "Allocation successful! Emails sent.", file: `/output/allocated_students.csv` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
