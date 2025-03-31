

const fs = require("fs");
const path = require("path");
const { parseCSV, writeCSV } = require("../utils/csvHandler");

const HALL_CAPACITY = 30;

async function allocateSeats(inputFilePath) {
    const students = await parseCSV(inputFilePath);
    let hallNumber = 1, seatNumber = 1;
    let allocatedData = [];

    students.forEach((student) => {
        allocatedData.push({
            RollNumber: student.RollNumber,
            Name: student.Name,
            Email: student.Email,
            Hall: `Hall-${hallNumber}`,
            Seat: seatNumber,
        });

        seatNumber++;
        if (seatNumber > HALL_CAPACITY) {
            hallNumber++;
            seatNumber = 1;
        }
    });

    const outputFilePath = path.join(__dirname, "../output/allocated_students.csv");
    await writeCSV(outputFilePath, allocatedData);
    return outputFilePath;
}

module.exports = { allocateSeats };
