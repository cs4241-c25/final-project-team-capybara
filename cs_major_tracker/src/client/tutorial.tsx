import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <h1>Tutorial</h1><br />
    <img src="assets/tutorial/tutorial.gif"  style={{maxWidth: '80%'}} /><br />
    
    <h2>Step By Step</h2><br />
    <p>1. Open Workday and click on <em>Academics</em> in the sidebar on the right.</p>
    <img src="assets/tutorial/t1.png"></img><br />
    
    <p>2. Next, click on <em>View My Academic Record</em> in the sidebar on the right.</p>
    <img src="assets/tutorial/t2.png"></img><br />
    
    <p>3. Click on the <em>Export to Excel</em> button in the top right corner.</p>
    <img src="assets/tutorial/t3.png"></img><br />
    
    <p>4. A modal will appear prompting you to export the document. Click <em>Download</em>.</p>
    <img src="assets/tutorial/t4.png"></img><br />
    
    <p>The excel file should download to your computer shortly.</p>
    
  </React.StrictMode>,
);
