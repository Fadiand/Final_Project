import React, { useRef, useState } from "react";

const UploadOptions = () => {
  const fileInputRef = useRef(null); // לבחירת קבצים מהמחשב
  const [uploadedImages, setUploadedImages] = useState([]); // שמירת תמונות שהועלו

  // פתיחת סייר הקבצים
  const handleAttachFiles = () => {
    fileInputRef.current.click();
  };

  // טיפול בקבצים שנבחרו
  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file)); // שינוי ל-"images" כדי לתמוך בכמה קבצים

      try {
        const response = await fetch("http://127.0.0.1:8000/gallery/upload-images/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("העלאת הקבצים הצליחה!");
          fetchUploadedImages(); // עדכון התמונות בגלריה
        } else {
          alert("העלאת הקבצים נכשלה.");
        }
      } catch (error) {
        console.error("שגיאה בהעלאת הקבצים:", error);
      }
    }
  };

  // שליפת תמונות מהשרת
  const fetchUploadedImages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/gallery/get-images/");
      if (response.ok) {
        const data = await response.json();
        setUploadedImages(data.images); // עדכון התמונות שהועלו
      } else {
        alert("שליפת התמונות נכשלה.");
      }
    } catch (error) {
      console.error("שגיאה בשליפת התמונות:", error);
    }
  };

  // טעינת תמונות כאשר הקומפוננטה נטענת
  React.useEffect(() => {
    fetchUploadedImages();
  }, []);

  return (
    <>
      <div className="upload-container">
        <h2 className="upload-title">Upload Files and Photos</h2>

        {/* כפתור לבחירת קבצים מהמחשב */}
        <div className="upload-box" onClick={handleAttachFiles}>
          <span>Select a file</span>
        </div>

        {/* כפתור לבחירת קבצים מהגלריה */}
        <button className="gallery-button" onClick={handleAttachFiles}>
          Select from gallery
        </button>

        {/* שדה קבצים מוסתר */}
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFilesChange}
        />
      </div>

      {/* גלריית תמונות */}
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


