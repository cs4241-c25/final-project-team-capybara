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
      
      <main className="min-h-full py-[3rem] bg-gray-1 flex flex-col items-center justify-center bg-[url(/geometric.png)] bg-repeat">
        <Card className="flex flex-col items-center justify-center bg-[#f9f9f9] text-dark-gray w-[45em] h-[75vh] shadow-xl shadow-gray-200">
          <Typography variant="h2" className="font-bold my-8">
            CS Major Tracker
          </Typography>
          <FileUpload />
        </Card>
      </main>
      
      <aside><Sidebar></Sidebar></aside>
    </>
  );
}

export default App;
