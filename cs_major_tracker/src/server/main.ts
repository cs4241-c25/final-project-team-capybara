import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import ExcelJS from "exceljs";
import { MongoClient } from "mongodb";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

const url = "mongodb://localhost:27017";
const dbName = "course_collection"; // Update this!
const client = new MongoClient(url);

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB!");
}
connectDB();

interface CourseData {
    Course: string;
    Grade: string;
    "Grade Points": number;
    Credits: number;
    "Earned Credit Points": number;
}

app.get("/data", async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection("courses");
        const data = await collection.find().toArray(); // Fetch all stored data

        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        console.log("Uploaded file path:", req.file.path);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);

        const worksheet = workbook.worksheets[0]; // Get the first sheet
        const jsonData: any[] = [];

        worksheet.eachRow((row) => {
            const rowValues = Array.isArray(row.values) ? row.values.slice(1) : []; // Remove the first empty index

            // Count non-null values
            const nonNullValues = rowValues.filter(value => value !== null && value !== undefined);

            // Ensure at least 5 non-null values and 2nd column (index 1) is not null
            if (nonNullValues.length >= 5 && rowValues[0] !== null && rowValues[0] !== undefined) {
                let course = rowValues[1];
                let courseName, courseTitle;
                // @ts-ignore
                [courseName, courseTitle] = course.split(" - ").map(item => item.trim());
                let courseType, courseNum;
                // @ts-ignore
                [courseType, courseNum] = courseName.split(" ").map(item => item.trim());
                const formattedData = {
                    column1: courseType ?? null,
                    column2: courseNum ?? null,
                    column3: courseTitle ?? null,
                    column4: rowValues[2] ?? null,
                    column5: rowValues[3] ?? null,
                    column6: rowValues[4] ?? null,
                    column7: rowValues[5] ?? null,
                };

                jsonData.push(formattedData);
            }
        });

        console.log("Filtered & Formatted Data:", JSON.stringify(jsonData, null, 2));

        // Connect to MongoDB and insert data
        const db = client.db(dbName);
        const collection = db.collection("courses"); // Change collection name if needed
        if (jsonData.length > 0) {
            await collection.insertMany(jsonData);
            console.log("Data inserted into MongoDB!");
        }

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ message: "Data processed and inserted into MongoDB", data: jsonData });
    } catch (error) {
        console.error("Error processing file:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: "Error processing file", details: errorMessage });
    }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening on port 3000..."));