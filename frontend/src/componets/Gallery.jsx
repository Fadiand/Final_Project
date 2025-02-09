import React, { useRef, useState, useEffect } from "react";

const UploadOptions = () => {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // פתיחת סייר הקבצים
  const handleAttachFiles = () => {
    fileInputRef.current.click();
  };

  // טיפול בקבצים שנבחרו
  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    // בדיקת סוגי קבצים
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    const filteredFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (filteredFiles.length === 0) {
      alert("Please upload only images (PNG, JPEG, JPG, GIF).");
      return;
    }

    const formData = new FormData();
    filteredFiles.forEach((file) => formData.append("images", file));

    try {
      setIsLoading(true); // התחלת טעינה
      const response = await fetch("http://127.0.0.1:8000/gallery/upload-images/", {
        method: "POST",
        body: formData,
        credentials: "include",  // <-- חשוב! שולח עוגייה sessionid
      });

      if (response.ok) {
        alert("העלאת הקבצים הצליחה!");
        fetchUploadedImages(); // שליפת העדכון האחרון של התמונות
      } else {
        const errorData = await response.json();
        alert(`העלאת הקבצים נכשלה: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("שגיאה בהעלאת הקבצים:", error);
      alert("שגיאה בהעלאת הקבצים. אנא נסה שוב.");
    } finally {
      setIsLoading(false); // סיום טעינה
    }
  };

  // שליפת תמונות מהשרת
  const fetchUploadedImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/gallery/get-images/", {
        credentials: "include", // <-- חשוב גם כאן
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImages(data.images);
      } else {
        const errorData = await response.json();
        alert(`שליפת התמונות נכשלה: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("שגיאה בשליפת התמונות:", error);
      alert("שגיאה בשליפת התמונות. אנא נסה שוב.");
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
        {isLoading && <p>Loading...</p>} {/* הודעת טעינה */}
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
