

const fs = require("fs");
const csv = require("fast-csv");

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        let students = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("data", (row) => students.push(row))
            .on("end", () => resolve(students))
            .on("error", reject);
    });
}

async function writeCSV(filePath, data) {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(filePath);
        csv.write(data, { headers: true }).pipe(ws).on("finish", resolve).on("error", reject);
    });
}

module.exports = { parseCSV, writeCSV };
