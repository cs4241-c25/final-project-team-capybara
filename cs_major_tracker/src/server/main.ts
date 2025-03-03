import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";
import ExcelJS from "exceljs";
import {MongoClient, WithId} from "mongodb";
import fs from "fs";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();
const upload = multer({ dest: "uploads/" });

const url = "mongodb://localhost:27017";
const dbName = "course_collection";
const client = new MongoClient(url);
const saltRounds = 10; // For bcrypt

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB!");
}
connectDB();

// Middleware to parse JSON bodies and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (adjust secret and options for production)
app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret or use an env variable
    resave: false,
    saveUninitialized: false,
  })
);

/* ========================
   Excel Data Upload Route
======================== */
app.get("/data", async (req, res) => {
  try {
    // 1) Make sure the user is logged in
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 2) Grab the username from session
    const username = req.session.user.username;

    // 3) Fetch data from MongoDB for THIS username only
    const db = client.db(dbName);

    // 4) Get data based on type
    const type = req.query.type as string;
    const collections: Record<string, string> = {
      humanities: "humanities",
      wellness: "wellness",
      social: "social",
      iqp: "iqp",
      cs: "cs",
      math: "math",
      sciences: "sciences",
      free: "free"
    };

    console.log(type);
    const data = await db.collection(collections[type]).find({owner: username}).toArray();

    // 5) Send only that user’s data
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

function isFull(arr: any[], limit: number): boolean {
  return arr.length >= limit;
}

app.get("/delete", async (req, res) => {
  try {
    // 1) Make sure the user is logged in
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 2) Grab the username from session
    const username = req.session.user.username;

    // 3) Delete the requested row if owned by this user
    const db = client.db(dbName);

    const id = req.query.id as string;
    const type = req.query.type as string;
    const collections: Record<string, string> = {
      humanities: "humanities",
      wellness: "wellness",
      social: "social",
      iqp: "iqp",
      cs: "cs",
      math: "math",
      sciences: "sciences",
      free: "free"
    };

    const data = await db.collection(collections[type]).find({owner: username}).toArray();

    // 5) Send that user’s updated data
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  // 1. Retrieve the username from the form data
  const username = req.body.username;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    console.log("Uploaded file path:", req.file.path);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0]; // Get the first sheet
    const humanities: any[] = [];
    const wellness: any[] = [];
    const social: any[] = [];
    const iqp: any[] = [];
    const cs: any[] = [];
    const math: any[] = [];
    const sciences: any[] = [];
    const free: any[] = [];

    const firstRow = worksheet.getRow(1);
    const firstCellValue = firstRow.getCell(1).text.trim();

    if (firstCellValue != "View My Academic Record") {
      return res.status(400).json({ error: "That is not the Academic Record Excel file. Please re-watch the tutorial." });
    }

    worksheet.eachRow((row) => {
      const rowValues = Array.isArray(row.values) ? row.values.slice(1) : []; // Remove the first empty index

      // Count non-null values
      const nonNullValues = rowValues.filter((value) => value !== null && value !== undefined);

      // Ensure at least 5 non-null values and 2nd column (index 1) is not null
      if (nonNullValues.length >= 5 && rowValues[0] !== null && rowValues[0] !== undefined) {
        let course = rowValues[1];
        let courseName, courseTitle;
        // @ts-ignore
        [courseName, courseTitle] = course.split(" - ").map((item) => item.trim());

        let courseType, courseNum;
        // @ts-ignore
        [courseType, courseNum] = courseName.split(" ").map((item) => item.trim());

        const formattedData = {
          column1: courseType ?? null,
          column2: courseNum ?? null,
          column3: courseTitle ?? null,
          column4: rowValues[2] ?? null,
          column5: rowValues[3] ?? null,
          column6: rowValues[4] ?? null,
          column7: rowValues[5] ?? null,

          owner: username,
        };
        if (!isFull(humanities, 5) && (courseType == 'AR' || courseType == 'EN' || courseType == 'TH' || courseType == 'MU' || courseType == 'AB' || courseType == 'CN' || courseType == 'GN' || courseType == 'SP' || courseType == 'WR' || courseType == 'RH' || courseType == 'HI' || courseType == 'HU' || courseType == 'INTL' || courseType == 'PY' || courseType == 'RE')) {
          humanities.push(formattedData);
        }
        else if (!isFull(wellness, 4) && (courseType == 'WPE')) {
          wellness.push(formattedData);
        }
        else if (!isFull(social, 2) && ((courseType == 'ID' && courseNum == '2050') || courseType == 'ECON' || courseType == 'ENV' || courseType == 'GOV' || courseType == 'PSY' || courseType == 'SD' || courseType == 'SOC' || courseType == 'SS' || courseType == 'STS' || courseType == 'DEV')) {
          social.push(formattedData);
        }
        else if (!isFull(iqp, 3) && (courseType == 'CDR' || (courseType == 'ID' && courseNum == 'IQP'))) {
          iqp.push(formattedData);
        }
        else if (!isFull(cs, 18) && (courseType == 'CS')) {
          cs.push(formattedData);
        }
        else if (!isFull(math, 7) && (courseType == 'MA')) {
          math.push(formattedData);
        }
        else if (!isFull(sciences, 5) && (courseType == 'AE' || courseType == 'BB' || courseType == 'BME' || courseType == 'CE' || courseType == 'CHE' || courseType == 'ECE' || courseType == 'ES' || courseType == 'GE' || courseType == 'ME' || courseType == 'PH' || courseType == 'RBE')) {
          sciences.push(formattedData);
        }
        else {
          free.push(formattedData)
        }
      }
    });

    console.log("Filtered & Formatted CS Data:", JSON.stringify(cs, null, 2));

    const db = client.db(dbName);
    const collection = db.collection("courses");
    const collection_humanities = db.collection("humanities");
    const collection_wellness = db.collection("wellness");
    const collection_social = db.collection("social");
    const collection_iqp = db.collection("iqp");
    const collection_cs = db.collection("cs");
    const collection_math = db.collection("math");
    const collection_sciences = db.collection("sciences");
    const collection_free = db.collection("free");

    if (humanities.length > 0) { await collection_humanities.insertMany(humanities); }
    if (wellness.length > 0) { await collection_wellness.insertMany(wellness); }
    if (social.length > 0) { await collection_social.insertMany(social); }
    if (iqp.length > 0) { await collection_iqp.insertMany(iqp); }
    if (cs.length > 0) { await collection_cs.insertMany(cs); }
    if (math.length > 0) { await collection_math.insertMany(math); }
    if (sciences.length > 0) { await collection_sciences.insertMany(sciences); }
    if (free.length > 0) { await collection_free.insertMany(free); }

    console.log("Data inserted into MongoDB!");

    // Cleanup uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Data processed and inserted into MongoDB",
      data: humanities, wellness, social, iqp, cs, math, sciences, free,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Error processing file", details: errorMessage });
  }
});


/* ========================
   Authentication Routes
======================== */

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password and store the new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    return res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Error registering:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare the password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Set the session for the user
    req.session.user = {
      username: user.username,
      id: user._id,
    };

    return res.json({
      success: true,
      message: "Login successful",
      username: user.username,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
});


// Logout endpoint to clear session
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logout successful" });
  });
});


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
