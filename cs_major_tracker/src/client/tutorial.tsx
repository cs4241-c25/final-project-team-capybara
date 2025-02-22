import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import {
    Typography,
    Card,
    CardBody
} from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="min-h-screen bg-[#AC2B37] flex flex-col items-center">
      <header className="bg-[#A9B0B7] p-4 flex items-center w-[100%]">
        <img src="/wpi.png" alt="WPI Logo" className="h-12 w-auto ml-4" />
      </header>
      
      <Typography variant="h1" className="text-center content-center py-6 text-white">Tutorial</Typography><br />
      <img src="assets/tutorial/tutorial.gif" className="max-w-[80%]" /><br />
    
      <Card className="m-6 w-[80%]">
        <CardBody className="flex flex-col p-8 gap-2">
          <Typography variant="h2" className="text-[#AC2B37]">Step By Step</Typography><br />
          <Typography>1. Open Workday and click on <em>Academics</em> in the sidebar on the right.</Typography>
          <img src="assets/tutorial/t1.png" className="max-w-[60%] self-center"></img><br />

          <Typography>2. Next, click on <em>View My Academic Record</em> in the sidebar on the right.</Typography>
          <img src="assets/tutorial/t2.png" className="max-w-[60%] self-center"></img><br />

          <Typography>3. Click on the <em>Export to Excel</em> button in the top right corner.</Typography>
          <img src="assets/tutorial/t3.png" className="max-w-[70%] self-center"></img><br />

          <Typography>4. A modal will appear prompting you to export the document. Click <em>Download</em>.</Typography>
          <img src="assets/tutorial/t4.png" className="max-w-[50%] self-center"></img><br />

          <Typography>The excel file should download to your computer shortly.</Typography>
        </CardBody>
      </Card>
    </div>
  </React.StrictMode>,
);
