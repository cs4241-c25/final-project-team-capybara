import { useState, useEffect } from "react";
import React from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Tracker() {
    const [tableData, setTableData] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/data") // Add an endpoint in Express for fetching data
            .then((response) => response.json())
            .then((data) => setTableData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="min-h-screen bg-[#AC2B37] flex flex-col">
            <Header></Header>

            <div className="flex flex-col items-center justify-center flex-grow text-black">
                <h1 className="text-4xl font-bold mt-30 mb-8">CS Major Tracker</h1>

                <div className="mt-8 w-full max-w-4xl">
                    <table className="w-full border-collapse border border-gray-400">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">Column 1</th>
                            <th className="border border-gray-400 px-4 py-2">Column 2</th>
                            <th className="border border-gray-400 px-4 py-2">Column 3</th>
                            <th className="border border-gray-400 px-4 py-2">Column 4</th>
                            <th className="border border-gray-400 px-4 py-2">Column 5</th>
                            <th className="border border-gray-400 px-4 py-2">Column 6</th>
                            <th className="border border-gray-400 px-4 py-2">Column 7</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((row, index) => (
                                <tr key={index} className="bg-white border border-gray-400">
                                    <td className="border border-gray-400 px-4 py-2">{row.column1 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column2 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column3 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column4 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column5 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column6 ?? "—"}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.column7 ?? "—"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center border border-gray-400 px-4 py-2">
                                    No data available
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Sidebar></Sidebar>
        </div>
    )
}

export default Tracker;