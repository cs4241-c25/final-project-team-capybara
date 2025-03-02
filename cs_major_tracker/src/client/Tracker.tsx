import { useState, useEffect } from "react";
import React from "react";
import {useNavigate} from "react-router-dom";
import {Accordion, AccordionHeader, AccordionBody, AccordionProps, Card, Button} from "@material-tailwind/react";
import { PDFDocument } from "pdf-lib";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Tracker() {
    const [humanitiesData, setHumanities] = useState<any[]>([]);
    const [wellnessData, setWellness] = useState<any[]>([]);
    const [socialData, setSocial] = useState<any[]>([]);
    const [iqpData, setIqp] = useState<any[]>([]);
    const [csData, setCs] = useState<any[]>([]);
    const [mathData, setMath] = useState<any[]>([]);
    const [scienceData, setScience] = useState<any[]>([]);
    const [freeData, setFree] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async (type: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
            try {
                const response = await fetch(`http://localhost:3000/data?type=${type}`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error(`Error fetching ${type} data:`, error);
            }
        };

        fetchData("humanities", setHumanities);
        fetchData("wellness", setWellness);
        fetchData("social", setSocial);
        fetchData("iqp", setIqp);
        fetchData("cs", setCs);
        fetchData("math", setMath);
        fetchData("sciences", setScience);
        fetchData("free", setFree);
    }, []);

    useEffect(() => {
        const getPercent = async () => {
            const percent = document.getElementById("percentage");
            let total_courses = 0;

            if (humanitiesData.length > 5) { total_courses += 5; }
            else { total_courses += humanitiesData.length; }

            if (wellnessData.length > 5) { total_courses += 5; }
            else { total_courses += wellnessData.length; }

            if (socialData.length > 5) { total_courses += 5; }
            else { total_courses += socialData.length; }

            if (iqpData.length > 5) { total_courses += 5; }
            else { total_courses += iqpData.length; }

            if (csData.length > 5) { total_courses += 5; }
            else { total_courses += csData.length; }

            if (mathData.length > 5) { total_courses += 5; }
            else { total_courses += mathData.length; }

            if (scienceData.length > 5) { total_courses += 5; }
            else { total_courses += scienceData.length; }

            if (freeData.length > 5) { total_courses += 5; }
            else { total_courses += freeData.length; }

            total_courses = (total_courses/48) * 100;

            if (total_courses > 50) {
                // @ts-ignore
                percent.innerText = "Congrats! You have completed " + total_courses.toFixed(2) + "% of your graduation requirement";
            }
            else {
                // @ts-ignore
                percent.innerText = "Sadly, you have only completed " + total_courses.toFixed(2) + "% of your graduation requirement";
            }
        };

        getPercent();
    }, [humanitiesData, wellnessData, socialData, iqpData, csData, mathData, scienceData, freeData]);

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                localStorage.removeItem("authenticated");
                localStorage.removeItem("username");

                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    const [openAcc1, setOpenAcc1] = React.useState(false);
    const [openAcc2, setOpenAcc2] = React.useState(false);
    const [openAcc3, setOpenAcc3] = React.useState(false);
    const [openAcc4, setOpenAcc4] = React.useState(false);
    const [openAcc5, setOpenAcc5] = React.useState(false);
    const [openAcc6, setOpenAcc6] = React.useState(false);
    const [openAcc7, setOpenAcc7] = React.useState(false);
    const [openAcc8, setOpenAcc8] = React.useState(false);

    const handleOpenAcc1 = () => setOpenAcc1((cur) => !cur);
    const handleOpenAcc2 = () => setOpenAcc2((cur) => !cur);
    const handleOpenAcc3 = () => setOpenAcc3((cur) => !cur);
    const handleOpenAcc4 = () => setOpenAcc4((cur) => !cur);
    const handleOpenAcc5 = () => setOpenAcc5((cur) => !cur);
    const handleOpenAcc6 = () => setOpenAcc6((cur) => !cur);
    const handleOpenAcc7 = () => setOpenAcc7((cur) => !cur);
    const handleOpenAcc8 = () => setOpenAcc8((cur) => !cur);

    const onButtonClick = async () => {
        const pdfUrl = "CS-tracker.pdf";
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        let num = 1;
        for (let i = 0; i < humanitiesData.length; i++) {
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
        for (let i = 0; i < iqpData.length; i++) {
            const field = form.getTextField(`Course${num}`);
            field.setFontSize(7);
            field.setText(iqpData[i].column1 + iqpData[i].column2 + " - " + iqpData[i].column3);
            num++;
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
        }

        const fields = form.getFields();
        fields.forEach(field => {
            console.log("Field Name:", field.getName());
        });

        form.flatten();

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cs-tracker.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
        <Header></Header>

        <main className="min-h-screen bg-[#AC2B37] flex flex-col">
            <div className="flex flex-col items-center flex-grow text-black">
                <h1 className="text-4xl font-bold mt-6 mb-2">CS Major Tracker</h1>
                <h2 id = "percentage" ></h2>
                <div>
                    <CourseDropdowns title="Humanities Requirement" data={humanitiesData} open={openAcc1} handleOpen={handleOpenAcc1} num={5}/>
                    <CourseDropdowns title="Wellness Requirement" data={wellnessData} open={openAcc2} handleOpen={handleOpenAcc2} num={4}/>
                    <CourseDropdowns title="Social Science Requirement" data={socialData} open={openAcc3} handleOpen={handleOpenAcc3} num={2}/>
                    <CourseDropdowns title="IQP Requirement" data={iqpData} open={openAcc4} handleOpen={handleOpenAcc4} num={3}/>
                    <CourseDropdowns title="Computer Science Requirement" data={csData} open={openAcc5} handleOpen={handleOpenAcc5} num={18}/>
                    <CourseDropdowns title="Math Requirement" data={mathData} open={openAcc6} handleOpen={handleOpenAcc6} num={7}/>
                    <CourseDropdowns title="Science Requirement" data={scienceData} open={openAcc7} handleOpen={handleOpenAcc7} num={5}/>
                    <CourseDropdowns title="Free Elective Requirement" data={freeData} open={openAcc8} handleOpen={handleOpenAcc8} num={3}/>
                </div>
                <Button className="mt-3" variant="gradient" onClick={onButtonClick}> Download Tracker PDF </Button>
            </div>
        </main>
        <aside><Sidebar></Sidebar></aside>
        </>
    )
}

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
const CourseDropdowns = ({ title, data, open, handleOpen, num }) => {
    return (
        <Accordion open={open} icon={<Icon open={open} />}>
            <AccordionHeader onClick={handleOpen} className={`flex justify-between items-center ${data.length >= num ? 'text-green-500' : ''}`}>{title} ({data.length}/{num})</AccordionHeader>
            <AccordionBody>
                <div className="mt-8 w-full max-w-4xl">
                    <Card className="mt-8 mb-5 w-full max-w-4xl overflow-auto rounded-[15px]">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border-b border-gray-300 px-4 py-2">Column 1</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 2</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 3</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 4</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 5</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 6</th>
                                <th className="border-b border-gray-300 px-4 py-2">Column 7</th>
                                <th className="border-b border-gray-300 px-4 py-2">Owner</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.length > 0 ? (
                                data.map((row: { column1: any; column2: any; column3: any; column4: any; column5: any; column6: any; column7: any; owner: any; }, index: React.Key | null | undefined) => (
                                    <tr key={index} className="bg-white border border-gray-300">
                                        <td className="border border-gray-300 px-4 py-2">{row.column1 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column2 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column3 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column4 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column5 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column6 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.column7 ?? "—"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{row.owner ?? "—"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center border border-gray-400 px-4 py-2">
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


export default Tracker;