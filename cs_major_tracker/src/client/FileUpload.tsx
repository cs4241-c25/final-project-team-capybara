import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => console.log("Success:", data))
            .catch((err) => console.error("Error:", err));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "text/xlsx": [".xlsx"] },
    });

    return (
        <div
            {...getRootProps()}
            className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer text-gray-200 w-96 h-48 flex items-center justify-center"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-red-500">Drop the CSV file here...</p>
            ) : (
                <p className="text-gray-300">
                    Drag & drop a Excel file here, or click to select one.
                </p>
            )}
        </div>
    );
};

export default FileUpload;
