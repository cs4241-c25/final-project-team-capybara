import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {useNavigate} from "react-router-dom";

const FileUpload = () => {
  const navigate = useNavigate();
  const handleUpload = async (file: File) => {
    try {
      const username = localStorage.getItem("username") ?? "";

      // Build the FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "File upload failed");
      }

      alert("File uploaded successfully!");
      navigate("/tracker");
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
  });

  return (
    <div
      {...getRootProps()}
      className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-gray-400 
                 rounded-lg text-center cursor-pointer text-gray-200 w-96 h-48 
                 flex items-center justify-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-red-500">Drop the Excel file here...</p>
      ) : (
        <p className="text-gray-300">
          Drag & drop an Excel file here, or click to select one.
        </p>
      )}
    </div>
  );
};

export default FileUpload;