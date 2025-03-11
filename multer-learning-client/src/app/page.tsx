"use client";

import { useState } from "react";

export default function RootPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Update the URL to point to your local server
      const response = await fetch("http://localhost:4000/profile", {
        method: "POST",
        body: formData,
      });

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        const text = await response.text(); // Read the response as text if it's an error
        throw new Error(`Error: ${response.status} - ${text}`);
      }

      // Try to parse the response as JSON
      const result = await response.json();
      alert("File uploaded successfully: " + result.fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during the upload: " + error.message);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="file" name="avatar" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
    </>
  );
}
