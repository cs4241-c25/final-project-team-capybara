import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Typography, Card } from "@material-tailwind/react";
import React from "react";
import { useNavigate } from 'react-router-dom';

function App() {
  const [tableData, setTableData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [navigate]);
  
  return (
    <>
      <Header></Header>
      
      <main className="min-h-screen bg-[#AC2B37] flex flex-col">
        <div className="flex flex-col items-center justify-center flex-grow text-black">
          <Typography variant="h2" className="font-bold my-8">
            CS Major Tracker
          </Typography>
          <FileUpload />
        </div>
      </main>
      
      <aside><Sidebar></Sidebar></aside>
    </>
  );
}

export default App;
