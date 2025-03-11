"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function RootPage() {
  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [uploading, setUploading] = useState<boolean>(false); // State to track upload progress
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const [fileUrl, setFileUrl] = useState<string | null>(null); // State to store the uploaded file URL

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]); // Set the selected file
    }
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    if (!file) {
      setError("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file); // Append the file to the form data

    setUploading(true); // Set uploading state to true
    setError(null); // Clear any previous errors

    try {
      // Send the file to the server
      const response = await fetch("http://localhost:4000/profile", {
        method: "POST",
        body: formData,
      });

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        const text = await response.text(); // Read the response as text if it's an error
        throw new Error(`Error: ${response.status} - ${text}`);
      }

      // Parse the response as JSON
      const result = await response.json();
      setFileUrl(result.fileUrl); // Set the uploaded file URL
      alert("File uploaded successfully: " + result.fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(
        "An error occurred during the upload: " + (error as Error).message
      );
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Upload an Image</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="avatar"
          accept="image/*" // Restrict to image files
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {fileUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image:</h2>
          <img
            src={fileUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}
