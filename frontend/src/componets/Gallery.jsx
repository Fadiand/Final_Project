import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadOptions = () => {
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAttachFiles = () => {
    fileInputRef.current.click();
  };

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
        credentials: "include",
      });

      if (response.ok) {
        alert("File upload successful!");
        fetchUploadedImages();
      } else {
        const errorData = await response.json();
        alert(`File upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUploadedImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/gallery/get-images/", {
        credentials: "include",
      });

      if (response.ok) {
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

  const toggleImageSelection = (imageUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((img) => img !== imageUrl) : [...prev, imageUrl]
    );
  };

  const handleClassifyImages = () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image to classify.");
      return;
    }
    navigate("/model_test", { state: { imageUrls: selectedImages } });
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []); //This line was missing the dependency array

  return (
    <div className="upload-container">
      <h2 className="upload-title">Image Gallery</h2>
      <div className="upload-section">
        <div className="upload-box" onClick={handleAttachFiles}>
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="upload-text">Click to upload images</span>
          <p className="upload-info">PNG, JPG, JPEG, GIF up to 10MB</p>
        </div>
        <input
          type="file"
          multiple
          className="file-input"
          ref={fileInputRef}
          onChange={handleFilesChange}
          accept="image/png,image/jpeg,image/jpg,image/gif"
        />
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && uploadedImages.length > 0 && (
        <div className="image-gallery-container">
          <div className="gallery-header">
            <h3 className="section-title">Your Images</h3>
            <p className="selected-count">{selectedImages.length} selected</p>
          </div>
          <div className="image-gallery">
            {uploadedImages.map((img, index) => {
              const imageUrl = `http://127.0.0.1:8000${img.image}`;
              const isSelected = selectedImages.includes(imageUrl);
              return (
                <div
                  key={index}
                  className={`image-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleImageSelection(imageUrl)}
                >
                  <img src={imageUrl || "/placeholder.svg"} alt={`Image ${index + 1}`} className="gallery-image" />
                  {isSelected && (
                    <div className="selection-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isLoading && uploadedImages.length === 0 && (
        <div className="no-images">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p>No images uploaded yet</p>
          <p>Upload some images to get started</p>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <button
          className={`classify-button ${selectedImages.length === 0 ? "disabled" : ""}`}
          onClick={handleClassifyImages}
          disabled={selectedImages.length === 0}
        >
          {selectedImages.length > 0
            ? `Classify ${selectedImages.length} Selected ${selectedImages.length === 1 ? "Image" : "Images"}`
            : "Select images to classify"}
        </button>
      )}
    </div>
  );
};

export default UploadOptions;
