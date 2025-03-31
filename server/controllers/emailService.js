

const nodemailer = require("nodemailer");
const { parseCSV } = require("../utils/csvHandler");
require("dotenv").config();

async function sendEmails(filePath) {
    const students = await parseCSV(filePath);

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    for (let student of students) {
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: student.Email,
            subject: "Exam Hall & Seat Allocation",
            text: `Dear ${student.Name},\n\nYour exam details:\nHall: ${student.Hall}\nSeat: ${student.Seat}\n\nBest of luck!\nAdmin`,
        };

        await transporter.sendMail(mailOptions);
    }

    console.log("Emails sent successfully!");
}

module.exports = { sendEmails };
