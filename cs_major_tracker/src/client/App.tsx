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

    fetch("http://localhost:3000/data")
      .then((response) => response.json())
      .then((data) => setTableData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  return (
    <>
      <Header></Header>
      
      <main className="min-h-screen bg-[#AC2B37] flex flex-col">
        <div className="flex flex-col items-center justify-center flex-grow text-black">
          <Typography variant="h2" className="font-bold my-8">
            CS Major Tracker
          </Typography>

          <FileUpload />
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
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr key={index} className="bg-white border border-gray-300">
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column1 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column2 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column3 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column4 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column5 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column6 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.column7 ?? "—"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.owner ?? "—"}
                      </td>
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
      </main>
      
      <aside><Sidebar></Sidebar></aside>
    </>
  );
}

export default App;
