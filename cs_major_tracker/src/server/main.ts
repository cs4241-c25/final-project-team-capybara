import express from "express";
import * as dotenv from 'dotenv';
import ViteExpress from "vite-express";
import multer from "multer";
import ExcelJS from "exceljs";
import { MongoClient, WithId, ObjectId } from "mongodb";
import fs from "fs";
import session from "express-session";
import bcrypt from "bcrypt";

dotenv.config()

const app = express();
const upload = multer({ dest: "uploads/" });

console.log("ENV: ", process.env.DATABASE_URL);
const url = process.env.DATABASE_URL;
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

function determineCategory(courseType: string, courseNum: string) {
  const categoryInfo = [
    {
      name: "humanities",
      limit: 5,
      matches: [
        "AR", "EN", "TH", "MU", "AB", "CN", "GN", "SP",
        "WR", "RH", "HI", "HU", "INTL", "PY", "RE",
      ],
    },
    {
      name: "wellness",
      limit: 4,
      matches: ["WPE", "PE"],
    },
    {
      name: "social",
      limit: 2,
      matches: [
        "ECON", "ENV", "GOV", "PSY", "SD", "SOC", "SS", "STS", "DEV",
      ],
      specialCaseID2050: true,
    },
    {
      name: "iqp",
      limit: 3,
      matches: ["CDR"],
      specialCaseIDIQP: true,
    },
    {
      name: "cs",
      limit: 18,
      matches: ["CS"],
    },
    {
      name: "math",
      limit: 7,
      matches: ["MA"],
    },
    {
      name: "sciences",
      limit: 5,
      matches: [
        "AE", "BB", "BME", "CE", "CHE", "ECE",
        "ES", "GE", "ME", "PH", "RBE", "CH",
      ],
    },
    {
      name: "free",
      limit: 999999,
      matches: [],    // fallback if none match or categories are full
    },
  ];

  // Iterate over categories to find a match
  for (const info of categoryInfo) {
    if (info.specialCaseID2050 && courseType === "ID" && courseNum === "2050") {
      return { category: info.name, limit: info.limit };
    }
    if (info.specialCaseIDIQP && courseType === "ID" && courseNum === "IQP") {
      return { category: info.name, limit: info.limit };
    }

    // Otherwise, see if courseType is in matches array
    if (info.matches.includes(courseType)) {
      return { category: info.name, limit: info.limit };
    }
  }

  return { category: "free", limit: 999999 };
}

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
      free: "free",
      boolean: "boolean"
    };

    console.log(type);
    const data = await db.collection(collections[type]).find({ owner: username }).toArray();

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

app.post("/upload", upload.single("file"), async (req, res) => {

  /**
  * If an item with the same (courseType, courseNum) already exists, replace it.
  * Otherwise, push if the list isn't full.
  */
  function insertOrReplace(
    list: any[],
    newData: any,
    limit: number
  ): void {
    const existingIndex = list.findIndex(
      (item) =>
        item.column1 === newData.column1 &&
        item.column2 === newData.column2
    );
    if (newData.column4 == "NR") {
      return;
    }
    if (existingIndex !== -1 && newData.column2 != "MQP") {
      // Replace the old entry with the new one
      list[existingIndex] = newData;
    } else {
      // Only push if we're not at the limit
      if (list.length < limit) {
        list.push(newData);
      }
    }
  }

  const username = req.body.username;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    console.log("Uploaded file path:", req.file.path);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];
    const humanities: any[] = [];
    const wellness: any[] = [];
    const social: any[] = [];
    const iqp: any[] = [];
    const cs: any[] = [];
    const math: any[] = [];
    const sciences: any[] = [];
    const free: any[] = [];
    const boolean: any[] = [];

    let hua_2000_requirement = false;
    let hua_requirement = false;
    let iqp_requirement = false;
    let systems_requirement = false;
    let theory_requirement = false;
    let design_requirement = false;
    let social_requirement = false;
    let cs_4000_requirement = false;
    let mqp_requirement = false;
    let prob_requirement = false;
    let stat_requirement = false;
    let science_requirement = false;

    let cs_completion = 0;
    let math_completion = 0;
    let science_completion = 0;
    let cs_4000_num = 0;
    let mqp_num = 0;
    let hua_num = 0;

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
          added: false,
        };

        // first bin check
        if (courseType === 'CS' && !systems_requirement && (courseNum === '3013' || courseNum === '4513' || courseNum === '4515' || courseNum === '4516' || courseNum === '502' || courseNum === '533' || courseNum === '535')) {
          systems_requirement = true;
          cs_completion++;
        }
        // second bin check
        if (courseType === 'CS' && !theory_requirement && (courseNum === '3133' || courseNum === '4120' || courseNum === '4123' || courseNum === '4533' || courseNum === '4536' || courseNum === '5003' || courseNum === '5084' || courseNum === '503' || courseNum === '536' || courseNum === '544' || courseNum === '584')) {
          theory_requirement = true;
          cs_completion++;
        }
        // third bin check
        if (courseType === 'CS' && !design_requirement && (courseNum === '3041' || courseNum === '3431' || courseNum === '3733' || courseNum === '4233' || courseNum === '509' || courseNum === '542' || courseNum === '546' || courseNum === '561' || courseNum === '562')) {
          design_requirement = true;
          cs_completion++;
        }
        // fourth bin check
        if (!social_requirement && ((courseType === 'CS' && courseNum === '3043') || ((courseType === 'GOV' || courseType === 'ID') && (courseNum === '2314' || courseNum === '2315')) || (courseType === 'IMGD' && (courseNum === '2000' || courseNum === '2001')) || (courseType === 'RBE' && courseNum === '3100'))) {
          social_requirement = true;
          cs_completion++;
        }
        // 4000 or grad level check
        if (cs_4000_num < 5 && (courseType === 'CS' && Number(courseNum.charAt(0)) >= 4)) {
          cs_4000_num++;
          if (cs_4000_num == 5) {
            cs_4000_requirement = true;
          }
        }
        // stats requirement
        if (!stat_requirement && (courseType === 'MA' && (courseNum === '2611' || courseNum === '2612'))) {
          stat_requirement = true;
          math_completion++;
        }
        // prob requirement
        if (!prob_requirement && (courseType === 'MA' && (courseNum === '2621' || courseNum === '2631'))) {
          prob_requirement = true;
          math_completion++;
        }
        // science requirement
        if (science_completion < 3 && (courseType === 'BB' || courseType === 'CH' || courseType === 'GE' || courseType === 'PH')) {
          science_completion++;
          if (science_completion == 3) { science_requirement = true; }
        }
        // mqp
        if (courseType === 'CDR' && courseNum === 'MQP') {
          mqp_requirement = true;
        }
        else if (mqp_num < 3 && courseType === 'CS' && courseNum === 'MQP') {
          cs_completion++;
          insertOrReplace(cs, formattedData, 11 + cs_completion);
          mqp_num++;
        }
        // iqp
        else if (!isFull(iqp, 1) && ((courseType == 'CDR' && courseNum == 'IQP'))) {
          insertOrReplace(iqp, formattedData, 1);
          iqp_requirement = true;
        }
        // hua
        else if (!hua_requirement && courseType == 'CDR' && courseNum == 'HUA') {
          hua_requirement = true;
          hua_num++;
        }
        else if (courseType == 'AR' || courseType == 'EN' || courseType == 'TH' || courseType == 'MU' || courseType == 'AB' || courseType == 'CN' || courseType == 'GN' || courseType == 'SP' || courseType == 'WR' || courseType == 'RH' || courseType == 'HI' || courseType == 'HU' || courseType == 'INTL' || courseType == 'PY' || courseType == 'RE') {
          insertOrReplace(humanities, formattedData, 5 + hua_num);
          if (Number(courseNum.charAt(0)) > 1) { hua_2000_requirement = true; }
        }
        else if (courseType == 'HU' && (courseNum == '3900' || courseNum === '3910')) {
          insertOrReplace(humanities, formattedData, 5 + hua_num);
        } else if (!isFull(wellness, 4) && (courseType === 'WPE' || courseType === 'PE')) {
          wellness.push(formattedData);
        } else if (!isFull(social, 2) && (
          (courseType === 'ID' && courseNum === '2050') ||
          courseType === 'ECON' || courseType === 'ENV' || courseType === 'GOV' ||
          courseType === 'PSY' || courseType === 'SD' || courseType === 'SOC' ||
          courseType === 'SS' || courseType === 'STS' || courseType === 'DEV'
        )) {
          insertOrReplace(social, formattedData, 2);

        } else if (courseType === 'ID' && courseNum === 'IQP') {
          iqp_requirement = true;

        } else if (courseType == 'CS' && courseNum != 'MQP') {
          insertOrReplace(cs, formattedData, 11 + cs_completion);

        } else if (courseType == 'MA') {
          insertOrReplace(math, formattedData, 5 + math_completion);

        } else if (courseType == 'AE' || courseType == 'BB' || courseType == 'BME' || courseType == 'CE' || courseType == 'CHE' || courseType == 'ECE' || courseType == 'ES' || courseType == 'GE' || courseType == 'ME' || courseType == 'PH' || courseType == 'RBE' || courseType == 'CH') {
          insertOrReplace(sciences, formattedData, 2 + science_completion);

        } else {
          // If none of the above match or categories are full, push to free
          free.push(formattedData);
        }
      }
    });

    const boolean_data = {
      hua_2000: hua_2000_requirement,
      hua: hua_requirement,
      iqp: iqp_requirement,
      systems: systems_requirement,
      theory: theory_requirement,
      design: design_requirement,
      social: social_requirement,
      cs_4000: cs_4000_requirement,
      mqp: mqp_requirement,
      prob: prob_requirement,
      stat: stat_requirement,
      science: science_requirement,
      owner: username,
    }
    boolean.push(boolean_data);

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
    const collection_boolean = db.collection("boolean");
    await Promise.all([
      collection.deleteMany({ owner: username }),
      collection_humanities.deleteMany({ owner: username }),
      collection_wellness.deleteMany({ owner: username }),
      collection_social.deleteMany({ owner: username }),
      collection_iqp.deleteMany({ owner: username }),
      collection_cs.deleteMany({ owner: username }),
      collection_math.deleteMany({ owner: username }),
      collection_sciences.deleteMany({ owner: username }),
      collection_free.deleteMany({ owner: username }),
      collection_boolean.deleteMany({ owner: username }),
    ]);


    if (humanities.length > 0) { await collection_humanities.insertMany(humanities); }
    if (wellness.length > 0) { await collection_wellness.insertMany(wellness); }
    if (social.length > 0) { await collection_social.insertMany(social); }
    if (iqp.length > 0) { await collection_iqp.insertMany(iqp); }
    if (cs.length > 0) { await collection_cs.insertMany(cs); }
    if (math.length > 0) { await collection_math.insertMany(math); }
    if (sciences.length > 0) { await collection_sciences.insertMany(sciences); }
    if (free.length > 0) { await collection_free.insertMany(free); }
    await collection_boolean.insertMany(boolean);

    console.log("Data inserted into MongoDB!");

    // Cleanup uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Data processed and inserted into MongoDB",
      data: humanities, wellness, social, iqp, cs, math, sciences, free, boolean,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Error processing file", details: errorMessage });
  }
});

/* --------------------------
   /delete endpoint
--------------------------- */
app.get("/delete", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const username = req.session.user.username;

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
      free: "free",
    };

    const doc = await db.collection(collections[type]).findOne({
      _id: new ObjectId(id),
      owner: username,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found or you do not own it",
      });
    }

    if (!doc.added) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a course that was not marked as added",
      });
    }

    await db.collection(collections[type]).deleteOne({ _id: doc._id });

    const data = await db
      .collection(collections[type])
      .find({ owner: username })
      .toArray();

    res.json(data);
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});

/* --------------------------
   /addCourse endpoint
--------------------------- */
app.post("/addCourse", async (req, res) => {
  try {
    // 1) Verify user is logged in
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const username = req.session.user.username;
    const { courseType, courseNum, courseTitle } = req.body;

    // Basic validation
    if (!courseType || !courseNum || !courseTitle) {
      return res.status(400).json({
        success: false,
        message: "courseType, courseNum, and courseTitle are required.",
      });
    }

    // 2) Determine the correct category based on your logic
    const { category, limit } = determineCategory(courseType, courseNum);
    const db = client.db(dbName);
    const collection = db.collection(category);

    // 3) Check how many items the user already has in that category
    const currentCount = await collection.countDocuments({ owner: username });

    // 4) See if the user already has the same (courseType, courseNum)
    const existingDoc = await collection.findOne({
      owner: username,
      column1: courseType, // where your /upload uses column1 for courseType
      column2: courseNum,  // column2 for courseNum
    });

    // 5) If doc doesn’t exist, but category is full => return error
    if (!existingDoc && currentCount >= limit) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more courses to the '${category}' category. It is already full.`,
      });
    }

    // 6) If it exists => update. If not => insert
    if (existingDoc) {
      // Replace the doc's fields, set added = true
      await collection.updateOne(
        { _id: existingDoc._id },
        {
          $set: {
            column3: courseTitle, // updating the title
            added: true,          // user specifically added it
          },
        }
      );
    } else {
      // Insert
      const newData = {
        column1: courseType, // e.g. "CS"
        column2: courseNum,  // e.g. "2303"
        column3: courseTitle,
        owner: username,
        added: true,
      };
      await collection.insertOne(newData);
    }

    // 7) Return the updated list from that category
    const data = await collection.find({ owner: username }).toArray();
    res.json({ success: true, category, data });
  } catch (error) {
    console.error("Error adding course:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message: errorMessage });
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
