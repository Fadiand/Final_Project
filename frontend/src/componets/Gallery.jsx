import React, { useRef, useState, useEffect } from "react";

const UploadOptions = () => {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // בודק אם המשתמש פעיל

  // שליפת sessionid מהעוגיות
  const getSessionId = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("sessionid="))
      ?.split("=")[1] || "";
  };

  // פתיחת סייר הקבצים
  const handleAttachFiles = () => {
    if (!isActive) {
      alert("User is not active. Please log in again.");
      return;
    }
    fileInputRef.current.click();
  };

  // טיפול בקבצים שנבחרו
  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    const filteredFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (filteredFiles.length === 0) {
      alert("Please upload only images (PNG, JPEG, JPG, GIF).");
      return;
    }

    const formData = new FormData();
    filteredFiles.forEach((file) => formData.append("images", file));

    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/gallery/upload-images/", {
        method: "POST",
        body: formData,
        credentials: "include", // ✅ שליחת עוגיות כדי לאמת משתמש
        headers: { "X-CSRFToken": getSessionId() }, // ✅ שליחת sessionid ל-Backend
      });

      if (response.status === 401) {
        alert("User is not authenticated. Please log in.");
      } else if (response.status === 403) {
        alert("User is not active. Please log in again.");
        setIsActive(false);
      } else if (response.ok) {
        alert("Upload successful!");
        fetchUploadedImages();
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // שליפת תמונות מהשרת
  const fetchUploadedImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/gallery/get-images/", {
        method: "GET",
        credentials: "include", // ✅ שליחת עוגיות כדי לאמת משתמש
        headers: { "X-CSRFToken": getSessionId() }, // ✅ שליחת sessionid ל-Backend
      });

      if (response.status === 401) {
        alert("User is not authenticated. Please log in.");
      } else if (response.status === 403) {
        alert("User is not active. Please log in again.");
        setIsActive(false);
      } else if (response.ok) {
        const data = await response.json();
        setUploadedImages(data.images);
      } else {
        const errorData = await response.json();
        alert(`Failed to fetch images: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Error fetching images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // טעינת תמונות עם טעינת הקומפוננטה
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <>
      <div className="upload-container">
        <h2 className="upload-title">Upload Files and Photos</h2>
        {isLoading && <p>Loading...</p>}
        {!isActive && <p style={{ color: "red" }}>User is not active. Please log in.</p>}
        <div className="upload-box" onClick={handleAttachFiles}>
          <span>Select a file</span>
        </div>
        <button className="gallery-button" onClick={handleAttachFiles}>
          Select from gallery
        </button>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFilesChange}
        />
      </div>
      <div className="image-gallery">
        {uploadedImages.map((img, index) => (
          <img
            key={index}
            src={`http://127.0.0.1:8000${img.image}`}
            alt={`img ${index}`}
            className="gallery-image"
          />
        ))}
      </div>
    </>
  );
};

export default UploadOptions;