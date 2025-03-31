// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// const csvParser = require("csv-parser");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static("public")); // Serve static files

// // ✅ Ensure Upload & Output Directories Exist
// const uploadDir = path.join(__dirname, "upload");
// const outputDir = path.join(__dirname, "output");

// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// // ✅ Configure File Upload
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: (req, file, cb) => {
//         cb(null, "students.csv");
//     }
// });

// const upload = multer({ storage });

// let hallCapacity = 5;

// // ✅ Configure Nodemailer (Gmail SMTP)
// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com", // Brevo's SMTP server
//     port: 587, // Use 587 for TLS or 465 for SSL
//     secure: false, // Set to `true` if using port 465
//     auth: {
//         user: "881ecd001@smtp-brevo.com",  // Replace with your Brevo SMTP username
//         pass: "csGP0LFvphtgSQbr"   // Replace with your Brevo SMTP password
//     }
// });

// // ✅ Upload & Process CSV File
// app.post("/upload", upload.single("file"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     let students = [];

//     fs.createReadStream(path.join(uploadDir, "students.csv"))
//         .pipe(csvParser())
//         .on("data", (row) => {
//             students.push(row);
//         })
//         .on("end", async () => {
//             let allocatedStudents = allocateSeats(students);
//             saveToCSV(allocatedStudents);
//             res.json({ message: "File processed successfully! You can now download the file and send emails." });
//         });
// });

// // ✅ Function to Allocate Seats
// function allocateSeats(students) {
//     let hallNumber = 1;
//     let seatNumber = 1;
//     let allocatedStudents = [];

//     students.forEach((student) => {
//         if (seatNumber > hallCapacity) {
//             hallNumber++;
//             seatNumber = 1;
//         }

//         allocatedStudents.push({
//             RollNumber: student.RollNumber,
//             Name: student.Name,
//             Email: student.Email,
//             Hall: `Hall-${hallNumber}`,
//             Seat: `Seat-${seatNumber}`
//         });

//         seatNumber++;
//     });

//     return allocatedStudents;
// }

// // ✅ Save Allocated Students to CSV
// function saveToCSV(data) {
//     const outputFilePath = path.join(outputDir, "allocated_students.csv");
//     const header = "RollNumber,Name,Email,Hall,Seat\n";
//     const rows = data.map(student => `${student.RollNumber},${student.Name},${student.Email},${student.Hall},${student.Seat}`).join("\n");

//     fs.writeFileSync(outputFilePath, header + rows);
// }

// // ✅ Send Email Notifications
// app.post("/sendEmails", async (req, res) => {
//     const filePath = path.join(outputDir, "allocated_students.csv");

//     if (!fs.existsSync(filePath)) {
//         return res.status(400).json({ message: "No allocated students found. Please upload a file first!" });
//     }

//     let students = [];

//     fs.createReadStream(filePath)
//         .pipe(csvParser())
//         .on("data", (row) => {
//             students.push(row);
//         })
//         .on("end", async () => {
//             await sendEmails(students);
//             res.json({ message: "Emails sent successfully!" });
//         });
// });

// async function sendEmails(students) {
//     for (const student of students) {
//         if (!student.Email) continue;

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: student.Email,
//             subject: "Exam Hall & Seat Allocation",
//             text: `Dear ${student.Name},\n\nYour exam hall and seat have been allocated:\nHall: ${student.Hall}\nSeat: ${student.Seat}\n\nBest of luck!\n`
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             console.log(`✅ Email sent to: ${student.Email}`);
//         } catch (error) {
//             console.error(`❌ Failed to send email to ${student.Email}:`, error);
//         }
//     }
// }

// // ✅ API to Download Output CSV
// app.get("/download", (req, res) => {
//     const filePath = path.join(outputDir, "allocated_students.csv");
//     if (!fs.existsSync(filePath)) {
//         return res.status(404).json({ message: "No allocated CSV file found. Please allocate students first!" });
//     }
//     res.download(filePath, "allocated_students.csv");
// });

// // ✅ Start Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uploadDir = path.join(__dirname, "upload");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, "students.csv");
    }
});

const upload = multer({ storage });

let HallCapacity = 5;
let totalHalls = 1;

// ✅ Configure Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Brevo's SMTP server
    port: 587, // Use 587 for TLS or 465 for SSL
    secure: false, // Set to `true` if using port 465
    auth: {
        user: "881ecd001@smtp-brevo.com",  // Replace with your Brevo SMTP username
        pass: "csGP0LFvphtgSQbr"   // Replace with your Brevo SMTP password
    }
});



///////////////
app.post("/setHallCapacity", (req, res) => {
    // console.log(req.body);
    const { hallNumber, hallCapacity } = req.body;
    if (!hallNumber || !hallCapacity) {
        return res.status(400).json({ message: "Halls and capacity are required." });
    }
    totalHalls = parseInt(hallNumber, 10);
    HallCapacity = parseInt(hallCapacity, 10);
    res.json({ message: "Hall capacity set successfully." });
});

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    
    let students = [];
    fs.createReadStream(path.join(uploadDir, "students.csv"))
        .pipe(csvParser())
        .on("data", (row) => {
            students.push(row);
        })
        .on("end", async () => {
            let allocatedStudents = allocateSeats(students);
            saveToCSV(allocatedStudents);
            res.json({ message: "File processed successfully! You can now download the file and send emails." });
        });
});

function allocateSeats(students) {
    let hallNumber = 1;
    let seatNumber = 1;
    let allocatedStudents = [];

    students.forEach((student) => {
        if (seatNumber > HallCapacity) {
            hallNumber++;
            seatNumber = 1;
        }
        if (hallNumber > totalHalls) hallNumber = totalHalls;

        allocatedStudents.push({
            RollNumber: student.RollNumber,
            Name: student.Name,
            Email: student.Email,
            Hall: `Hall-${hallNumber}`,
            Seat: `Seat-${seatNumber}`
        });

        seatNumber++;
    });

    return allocatedStudents;
}

function saveToCSV(data) {
    const outputFilePath = path.join(outputDir, "allocated_students.csv");
    const header = "RollNumber,Name,Email,Hall,Seat\n";
    const rows = data.map(student => `${student.RollNumber},${student.Name},${student.Email},${student.Hall},${student.Seat}`).join("\n");
    fs.writeFileSync(outputFilePath, header + rows);
}

app.post("/sendEmails", async (req, res) => {
    const filePath = path.join(outputDir, "allocated_students.csv");
    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: "No allocated students found. Please upload a file first!" });
    }
    let students = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
            students.push(row);
        })
        .on("end", async () => {
            await sendEmails(students);
            res.json({ message: "Emails sent successfully!" });
        });
});
 
async function sendEmails(students) {
    for (const student of students) {
        if (!student.Email) continue;
        const mailOptions = {
                      from: process.env.EMAIL_USER,
                  to: student.Email,
                  subject: "Exam Hall & Seat Allocation",
                     text: `Dear ${student.Name},\n\nYour exam hall and seat have been allocated:\nHall: ${student.Hall}\nSeat: ${student.Seat}\n\nBest of luck!\n`
                  };
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to: ${student.Email}`);
        } catch (error) {
            console.error(`❌ Failed to send email to ${student.Email}:`, error);
        }
    }
}

app.get("/download", (req, res) => {
    const filePath = path.join(outputDir, "allocated_students.csv");
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "No allocated CSV file found. Please allocate students first!" });
    }
    res.download(filePath, "allocated_students.csv");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
