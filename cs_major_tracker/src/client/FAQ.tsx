import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const faqItems = [
  {
    question: "How do I upload my academic record?",
    answer:(
        <>
            You can upload your academic record by navigating to the File Upload section,
            then dragging & dropping your academic record Excel file or clicking to select one.
            <br/><br/>
            For information on how to get the academic record Excel file, please refer to
            the <Link to="/main#tutorial" className="text-blue-500 hover:underline">Tutorial</Link> page.
        </>
    ),
  },
  {
    question: "How do I add a new course manually?",
    answer: (
        <>
            You can add a new course manually by using the Add Course panel on the right side of
            the <Link to="/tracker" className="text-blue-500 hover:underline">Tracker</Link> page.
        </>
    ),
  },
  {
    question: "How do I delete a course?",
    answer: "To delete a course, click the Delete button next to the course in the respective category section.",
  },
  {
    question: "How do I download my tracker as a PDF?",
    answer: (
        <>
            you can download your tracker as a PDF by clicking the Download Tracker PDF button at the bottom of
            the <Link to="/tracker" className="text-blue-500 hover:underline">Tracker</Link> page.
        </>
    ),
  },
  {
    question: "How do I log out?",
    answer: "You can log out by clicking the Logout button in the right corner of the top bar.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };

    return <>
        <Header /> <Sidebar />
        <main>
            <div className="min-h-screen bg-gray-1 flex flex-col items-center text-black font-body">
                <div className="bg-gray-3 flex flex-col items-center justify-center w-full p-9">
                    <h1 className="text-4xl font-body font-bold mt-6 mb-2">Frequently Asked Questions (FAQ)</h1>
                </div>
                <div className="my-10 w-full max-w-xl p-5">
                    {faqItems.map((item, index) =>
                        <Accordion key={index} open={open === index} icon={<Icon open={open === index} />}>
                            <AccordionHeader onClick={() => handleOpen(index)}>
                                <Typography variant="h6" className="font-bold" children={item.question} />
                            </AccordionHeader>
                            <AccordionBody>
                                <Typography className="font-body" children={item.answer} />
                            </AccordionBody>
                        </Accordion>
                    )}
                </div>
            </div>
        </main>
    </>;
}

function Icon({ open }: { open: boolean }) {
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