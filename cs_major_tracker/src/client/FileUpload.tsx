import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  // 1. Create a function to handle file upload
  const handleUpload = async (file: File) => {
    try {
      // Retrieve the username from local storage (assuming it's stored there after login)
      const username = localStorage.getItem("username") ?? "";

      // Build the FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username); // Include the username

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // optional, if you need cookies/sessions
      });

      const data = await response.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // 2. Use the `onDrop` callback from `useDropzone` and pass the file(s) to `handleUpload`
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  // 3. Configure dropzone
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