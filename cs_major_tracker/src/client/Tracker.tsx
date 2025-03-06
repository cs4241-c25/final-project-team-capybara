import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionHeader, AccordionBody, Card, Button, Typography, Tooltip } from "@material-tailwind/react";
import Papa from "papaparse";
import { PDFDocument } from "pdf-lib";
import Sidebar from "./Sidebar";
import Header from "./Header";

import {CheckCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import {XCircleIcon} from "@heroicons/react/16/solid";

const address = "http://localhost:3000/";
// const address = 'https://final-project-team-capybara.onrender.com/';

function Tracker() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const [humanitiesData, setHumanities] = useState<any[]>([]);
  const [wellnessData, setWellness] = useState<any[]>([]);
  const [socialData, setSocial] = useState<any[]>([]);
  const [iqpData, setIqp] = useState<any[]>([]);
  const [csData, setCs] = useState<any[]>([]);
  const [mathData, setMath] = useState<any[]>([]);
  const [scienceData, setScience] = useState<any[]>([]);
  const [freeData, setFree] = useState<any[]>([]);
  const [booleanData, setBooleanData] = useState<any[]>([]);

  const fetchData = async (
    type: string,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const response = await fetch(address + `data?type=${type}`, { credentials: "include" });
      const data = await response.json();

      if (!data.success && data.message === "Not authorized") {
        navigate("/login");
        localStorage.setItem("authenticated", "false");
        return;
      }

      setData(data);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    }
  };

  // Fetch categories
  useEffect(() => {
    fetchData("humanities", setHumanities);
    fetchData("wellness", setWellness);
    fetchData("social", setSocial);
    fetchData("iqp", setIqp);
    fetchData("cs", setCs);
    fetchData("math", setMath);
    fetchData("sciences", setScience);
    fetchData("free", setFree);
    fetchData("boolean", setBooleanData);
  }, [navigate]);

  // Calculate and display “% of graduation requirement”
  useEffect(() => {
    const getPercent = async () => {
      const percent = document.getElementById("percentage");
      let total_courses = 0;

      if (humanitiesData.length > 6) total_courses += 6;
      else total_courses += humanitiesData.length;

      if (wellnessData.length > 4) total_courses += 4;
      else total_courses += wellnessData.length;

      if (socialData.length > 2) total_courses += 2;
      else total_courses += socialData.length;

      if (iqpData.length == 1) total_courses += 3;
      else total_courses += iqpData.length;

      if (csData.length > 18) total_courses += 18;
      else total_courses += csData.length;

      if (mathData.length > 7) total_courses += 7;
      else total_courses += mathData.length;

      if (scienceData.length > 5) total_courses += 5;
      else total_courses += scienceData.length;

      if (freeData.length > 3) total_courses += 3;
      else total_courses += freeData.length;

      const percentage = (total_courses / 48) * 100;
      if (percent) {
        if (percentage > 50) {
          percent.innerText = `Congrats! You have completed ${percentage.toFixed(2)}% of your graduation requirement.`;
        } else {
          percent.innerText = `Sadly, you have only completed ${percentage.toFixed(2)}% of your graduation requirement.`;
        }
      }
    };
    getPercent();
  }, [humanitiesData, wellnessData, socialData, iqpData, csData, mathData, scienceData, freeData]);

  // Re-fetch all categories at once
  const refreshAllData = () => {
    fetchData("humanities", setHumanities);
    fetchData("wellness", setWellness);
    fetchData("social", setSocial);
    fetchData("iqp", setIqp);
    fetchData("cs", setCs);
    fetchData("math", setMath);
    fetchData("sciences", setScience);
    fetchData("free", setFree);
  };

  // This ensures the data is always fresh if needed
  useEffect(() => {
    refreshAllData();
  }, []);

  const [checks, setChecks] = useState({
    hua_2000: false,
    hua: false,
    iqp: false,
    systems: false,
    theory: false,
    design: false,
    social: false,
    cs_4000: false,
    mqp: false,
    prob: false,
    stat: false,
    science: false,
  });

  useEffect(() => {
    if (booleanData.length > 0) {
      // @ts-ignore
      setChecks({
        hua_2000: booleanData[0].hua_2000,
        hua: booleanData[0].hua,
        iqp: booleanData[0].iqp,
        systems: booleanData[0].systems,
        theory: booleanData[0].theory,
        design: booleanData[0].design,
        social: booleanData[0].social,
        cs_4000: booleanData[0].cs_4000,
        mqp: booleanData[0].mqp,
        prob: booleanData[0].prob,
        stat: booleanData[0].stat,
        science: booleanData[0].science,
      });
    }
  }, [booleanData]);

  // Handle delete (for courses marked added===true)
  const handleDelete = async (id: string, category: string) => {
    try {
      const url = address + `delete?id=${id}&type=${category}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Error deleting");
        return;
      }

      // Server returns updated data for that category
      const updatedData = await response.json();
      if (Array.isArray(updatedData)) {
        switch (category) {
          case "humanities":
            setHumanities(updatedData);
            break;
          case "wellness":
            setWellness(updatedData);
            break;
          case "social":
            setSocial(updatedData);
            break;
          case "iqp":
            setIqp(updatedData);
            break;
          case "cs":
            setCs(updatedData);
            break;
          case "math":
            setMath(updatedData);
            break;
          case "sciences":
            setScience(updatedData);
            break;
          case "free":
            setFree(updatedData);
            break;
        }
      }
    } catch (err) {
      console.error("Error deleting data:", err);
    }
  };

  // Accordion controls
  const [openAcc1, setOpenAcc1] = useState(false);
  const [openAcc2, setOpenAcc2] = useState(false);
  const [openAcc3, setOpenAcc3] = useState(false);
  const [openAcc4, setOpenAcc4] = useState(false);
  const [openAcc5, setOpenAcc5] = useState(false);
  const [openAcc6, setOpenAcc6] = useState(false);
  const [openAcc7, setOpenAcc7] = useState(false);
  const [openAcc8, setOpenAcc8] = useState(false);

  const handleOpenAcc1 = () => setOpenAcc1((cur) => !cur);
  const handleOpenAcc2 = () => setOpenAcc2((cur) => !cur);
  const handleOpenAcc3 = () => setOpenAcc3((cur) => !cur);
  const handleOpenAcc4 = () => setOpenAcc4((cur) => !cur);
  const handleOpenAcc5 = () => setOpenAcc5((cur) => !cur);
  const handleOpenAcc6 = () => setOpenAcc6((cur) => !cur);
  const handleOpenAcc7 = () => setOpenAcc7((cur) => !cur);
  const handleOpenAcc8 = () => setOpenAcc8((cur) => !cur);

  // Download PDF logic
  const onButtonClick = async () => {
    const pdfUrl = "CS-tracker.pdf";
    const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    let num = 1;
    for (let i = 0; i < humanitiesData.length; i++) {
      if (humanitiesData[i].column1 == "HU" && (humanitiesData[i].column2 == "3900" || humanitiesData[i].column3 == "3910")) {
        continue;
      }
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(humanitiesData[i].column1 + humanitiesData[i].column2 + " - " + humanitiesData[i].column3);
      num++;
    }

    num = 6;
    for (let i = 0; i < wellnessData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(wellnessData[i].column1 + wellnessData[i].column2 + " - " + wellnessData[i].column3);
      num++;
    }

    num = 10;
    for (let i = 0; i < socialData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(socialData[i].column1 + socialData[i].column2 + " - " + socialData[i].column3);
      num++;
    }

    num = 12;
    if (checks.iqp) {
      for (let i = 0; i < 3; i++) {
        const field = form.getTextField(`Course${num}`);
        field.setFontSize(7);
        field.setText("IQP");
        num++;
      }
    }

    num = 15;
    for (let i = 0; i < freeData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(freeData[i].column1 + freeData[i].column2 + " - " + freeData[i].column3);
      num++;
    }

    num = 18;
    for (let i = 0; i < csData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(csData[i].column1 + csData[i].column2 + " - " + csData[i].column3);
      num++;
    }

    num = 36;
    for (let i = 0; i < mathData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(mathData[i].column1 + mathData[i].column2 + " - " + mathData[i].column3);
      num++;
    }

    num = 43;
    for (let i = 0; i < scienceData.length; i++) {
      const field = form.getTextField(`Course${num}`);
      field.setFontSize(7);
      field.setText(scienceData[i].column1 + scienceData[i].column2 + " - " + scienceData[i].column3);
      num++;
      if (num === 48) {
        break;
      }
    }

    form.flatten();
    const pdfBytes = await pdfDoc.save();

    // Download
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cs-tracker.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const humanities_description = () => {
    return (
        <p className="ml-1">
          <Tooltip placement="right-start" content={
            <div className="p-2 max-w-xs text-left">
              <p className="text-sm font-semibold mb-2">Humanities Checklist</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-sm">At least one class is 2000-level or above</span>
                  {checks.hua_2000 ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">HUA project is completed</span>
                  {checks.hua ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
              </ul>
            </div>
          }>
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-300" />
          </Tooltip>
        </p>
    )
  }

  const cs_description = () => {
    return (
        <p className="ml-1">
          <Tooltip placement="right-start" content={
            <div className="p-2 max-w-xs text-left">
              <p className="text-sm font-semibold mb-2">Computer Science Checklist</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-sm">Systems Requirement</span>
                  {checks.systems ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">Theory Requirement</span>
                  {checks.theory ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">Design Requirement</span>
                  {checks.design ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">Social Requirement</span>
                  {checks.social ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">5/3 units 4000-level</span>
                  {checks.cs_4000 ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">MQP Requirement</span>
                  {checks.mqp ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
              </ul>
            </div>
          }>
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-300" />
          </Tooltip>
        </p>
    )
  }

  const math_description = () => {
    return (
        <p className="ml-1">
          <Tooltip placement="right-start" content={
            <div className="p-2 max-w-xs text-left">
              <p className="text-sm font-semibold mb-2">Humanities Checklist</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-sm">Stats Requirement</span>
                  {checks.stat ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm">Probability Requirement</span>
                  {checks.prob ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
              </ul>
            </div>
          }>
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-300" />
          </Tooltip>
        </p>
    )
  }

  const science_description = () => {
    return (
        <p className="ml-1">
          <Tooltip placement="right-start" content={
            <div className="p-2 max-w-xs text-left">
              <p className="text-sm font-semibold mb-2">Humanities Checklist</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-sm">3 courses from BB, CH, GE, PH</span>
                  {checks.science ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                </li>
              </ul>
            </div>
          }>
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-300" />
          </Tooltip>
        </p>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-1 flex flex-col">
        <div className="flex flex-col items-center flex-grow text-black">
          <div className="bg-gray-3 flex flex-col items-center justify-center flex-grow w-full p-9">
            <h1 className="text-4xl font-body font-bold mt-6 mb-2">CS Major Tracker</h1>
            <h2 id="percentage"></h2>
          </div>
          <div className="my-10">
            <CourseDropdowns title="Humanities Requirement" data={humanitiesData} open={openAcc1} handleOpen={handleOpenAcc1} num={6} description={humanities_description()}/>
            <CourseDropdowns title="Wellness Requirement" data={wellnessData} open={openAcc2} handleOpen={handleOpenAcc2} num={4} description={undefined}/>
            <CourseDropdowns title="Social Science Requirement" data={socialData} open={openAcc3} handleOpen={handleOpenAcc3} num={2} description={undefined}/>
            <CourseDropdowns title="IQP Requirement" data={iqpData} open={openAcc4} handleOpen={handleOpenAcc4} num={1} description={undefined}/>
            <CourseDropdowns title="Computer Science Requirement" data={csData} open={openAcc5} handleOpen={handleOpenAcc5} num={18} description={cs_description()}/>
            <CourseDropdowns title="Math Requirement" data={mathData} open={openAcc6} handleOpen={handleOpenAcc6} num={7} description={math_description()}/>
            <CourseDropdowns title="Science Requirement" data={scienceData} open={openAcc7} handleOpen={handleOpenAcc7} num={5} description={science_description()}/>
            <CourseDropdowns title="Free Elective Requirement" data={freeData} open={openAcc8} handleOpen={handleOpenAcc8} num={3} description={undefined}/>
          </div>
          <Button className="mb-10 font-body" variant="gradient" onClick={onButtonClick}>
            Download Tracker PDF
          </Button>
        </div>
      </main>
      <aside>
        <Sidebar />
      </aside>

      {/* The “Add Course” panel on the right, with CSV reading */}
      <AddCoursePanel onCourseAdded={refreshAllData} />
    </>
  );
}

// Simple accordion icon
// @ts-ignore
function Icon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// @ts-ignore
const CourseDropdowns = ({ title, data, open, handleOpen, num, description }) => {
  const headings = [
    "Column 1",
    "Column 2",
    "Column 3",
    "Column 4",
    "Column 5",
    "Column 6",
    "Column 7",
    "Owner",
    "Action",
  ];


  return (
    <Accordion open={open} icon={<Icon open={open} />}>
      <AccordionHeader onClick={handleOpen} className={`flex ${data.length >= num ? 'text-green-500' : ''}`}>
        <p className={'flex justify-start'}>
          {title} ({data.length}/{num})
          {description}
        </p>
      </AccordionHeader>
      <AccordionBody>
        <div className="mt-8 w-full max-w-4xl">
          <Card className="mt-8 mb-5 w-full max-w-4xl overflow-auto  border-gray-3 border">
            <table className="font-body w-full w-min-max text-left">
              <thead>
                <tr className="bg-gray-200">
                  {headings.map((h) => (
                    <th key={h} className="border-b border-gray-300 p-4 min-w-[100px]">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {h}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row: any, index: number) => (
                    <tr key={index} className="even:bg-gray-1">
                      <td className="p-4 text-black">{row.column1 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column2 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column3 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column4 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column5 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column6 ?? "—"}</td>
                      <td className="p-4 text-black">{row.column7 ?? "—"}</td>
                      <td className="p-4 text-black">{row.owner ?? "—"}</td>
                      <td className="p-4">
                        {row.added ? (
                          <button
                            onClick={() => onDelete(row._id, category)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center border border-gray-400 px-4 py-2">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </AccordionBody>
    </Accordion>
  );
};

/* ------------------------------------------------------------
   AddCoursePanel
------------------------------------------------------------- */
interface CSVRow {
  courseType: string;
  courseNumber: string;
  courseTitle: string;
}

function AddCoursePanel({
  onCourseAdded,
}: {
  onCourseAdded: () => void;
}) {
    // The data from CSV in dictionary form
    const [typeMap, setTypeMap] = useState<{
      [type: string]: { courseNumber: string; courseTitle: string }[];
    }>({});
  
    // The user’s selected values
    const [selectedType, setSelectedType] = useState("");
    const [selectedNumber, setSelectedNumber] = useState("");
  
    // The final fields we’re sending to the server
    const [courseType, setCourseType] = useState("");
    const [courseNum, setCourseNum] = useState("");
    const [courseTitle, setCourseTitle] = useState("");
  
    const [status, setStatus] = useState("");
  
    // NEW: track whether the panel is minimized
    const [isMinimized, setIsMinimized] = useState(false);
  
    // 1) On mount, fetch and parse CSV into a dictionary { [courseType]: [{courseNumber, courseTitle}, ...] }
    useEffect(() => {
      fetch("/wpi_courses.csv")
        .then((res) => res.text())
        .then((csvText) => {
          Papa.parse<CSVRow>(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              // results.data is an array of CSVRows
              const dict: {
                [key: string]: { courseNumber: string; courseTitle: string }[];
              } = {};
  
              for (const row of results.data) {
                const t = row.courseType.trim();
                if (!dict[t]) dict[t] = [];
                dict[t].push({
                  courseNumber: row.courseNumber.trim(),
                  courseTitle: row.courseTitle.trim(),
                });
              }
  
              setTypeMap(dict);
            },
            error: (err) => {
              console.error("Error parsing CSV:", err);
            },
          });
        })
        .catch((err) => console.error("Error fetching CSV:", err));
    }, []);
  
    // 2) When user selects a Type
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      setSelectedType(newType);
      setCourseType(newType); // also set the final field
  
      // Clear old selection
      setSelectedNumber("");
      setCourseNum("");
      setCourseTitle("");
    };
  
    // 3) When user selects a Number
    const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newNumber = e.target.value;
      setSelectedNumber(newNumber);
      setCourseNum(newNumber); // final field
  
      // Auto-populate title from dictionary
      const possible = typeMap[selectedType];
      if (possible) {
        const found = possible.find((c) => c.courseNumber === newNumber);
        if (found) {
          setCourseTitle(found.courseTitle);
        }
      }
    };
  
    // 4) Handle form submission
    const handleAddCourse = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("Adding course...");
  
      try {
        const response = await fetch("http://localhost:3000/addCourse", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseType, courseNum, courseTitle }),
        });
        const data = await response.json();
  
        if (response.ok && data.success) {
          setStatus("Successfully added!");
          // Refresh parent data
          onCourseAdded();
        } else {
          const message = data.message || "Error adding course";
          setStatus(message);
        }
      } catch (error: any) {
        console.error("Error adding course:", error);
        setStatus(error?.message || "Error adding course");
      }
    };
  
    // 5) Prepare data for UI
    const types = Object.keys(typeMap).sort();
    const numbers = selectedType ? typeMap[selectedType] : [];
  
    return (
      <div
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          // If minimized, narrow panel; else standard width
          width: isMinimized ? "48px" : "260px",
          maxHeight: "80%",
          background: "#f8f8f8",
          borderLeft: "1px solid #ccc",
          padding: "8px",
          overflowY: "auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          transition: "width 0.3s",
        }}
      >
        {/* Toggle Minimize Button */}
        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: isMinimized ? 0 : "8px",
            padding: "8px",
            backgroundColor: "#AC1C1C", // WPI red
            color: "#fff",
            borderRadius: "4px",
            textAlign: "center",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#911818")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#AC1C1C")}
        >
          {isMinimized ? "»" : "«"}
        </button>
  
        {/* When minimized, hide content. Only show if not minimized. */}
        {!isMinimized && (
          <>
            <h2 className="font-bold mb-2">Add a Course</h2>
            <form onSubmit={handleAddCourse} className="flex flex-col gap-3">
              {/* 1) Course Type dropdown */}
              <label>
                Course Type
                <select
                  className="border border-gray-300 p-1 w-full"
                  value={selectedType}
                  onChange={handleTypeChange}
                  required
                >
                  <option value="">-- Select Type --</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
  
              {/* 2) Course Number dropdown */}
              <label>
                Course Number
                <select
                  className="border border-gray-300 p-1 w-full"
                  value={selectedNumber}
                  onChange={handleNumberChange}
                  required
                  disabled={!selectedType}
                >
                  <option value="">-- Select Number --</option>
                  {numbers.map(({ courseNumber }) => (
                    <option key={courseNumber} value={courseNumber}>
                      {courseNumber}
                    </option>
                  ))}
                </select>
              </label>
  
              {/* 3) Title (auto-populated, but user can override) */}
              <label>
                Course Title
                <input
                  className="border border-gray-300 p-1 w-full"
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Short title"
                  required
                />
              </label>
  
              {/* Submit Button, now WPI Red */}
              <button
                type="submit"
                className="p-2 text-white rounded"
                style={{
                  backgroundColor: "#AC1C1C",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#911818")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#AC1C1C")
                }
              >
                Add Course
              </button>
            </form>
  
            {status && <p className="mt-3">{status}</p>}
          </>
        )}
      </div>
    );
  }

export default Tracker;