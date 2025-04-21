import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InstagramHashtagClassifier() {
  const [hashtag, setHashtag] = useState("");
  const [fetchedImages, setFetchedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = async () => {
    if (!hashtag.trim()) {
      alert("Please enter a hashtag");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/instagram/fetch_instagram_images/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hashtag }),
      });

      const data = await response.json();
      console.log("✅ Received images:", data);
      setFetchedImages(
        (data.image_urls || []).map((url) => ({
          original: url,
          proxy: `http://localhost:8000/instagram/proxy/?url=${encodeURIComponent(url)}`,
        }))
      );
    } catch (error) {
      console.error("❌ Failed to fetch images:", error);
      alert("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const handleClassifyAll = () => {
    if (fetchedImages.length === 0) {
      alert("No images to classify.");
      return;
    }

    navigate("/model_test", {
      state: { imageUrls: fetchedImages.map((img) => img.proxy) },
    });
  };

  return (
    <div className="ig" style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div className="ig-box" style={{
        textAlign: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: "#1a1a1a"
        }}>Instagram Hashtag Classifier</h2>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px"
        }}>
          <input
            type="text"
            placeholder="Enter hashtag (e.g. brazil)"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              width: "300px"
            }}
          />

          <button 
            onClick={handleSearchClick}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0095f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              width: "300px"
            }}
          >
            Search
          </button>
        </div>

        {loading && (
          <p style={{ 
            color: "#666",
            fontSize: "14px",
            margin: "15px 0"
          }}>
            Loading...(it may take a while)
          </p>
        )}

        {fetchedImages.length > 0 && (
          <button 
            onClick={handleClassifyAll}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0095f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              width: "300px",
              marginTop: "15px"
            }}
          >
            Classify All
          </button>
        )}
      </div>

      {fetchedImages.length > 0 && (
        <div className="image-gallery" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
          gap: "15px", 
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          {fetchedImages.map((img, idx) => (
            <div 
              key={idx} 
              className="image-container" 
              style={{ 
                aspectRatio: "1",
                overflow: "hidden", 
                borderRadius: "8px", 
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                backgroundColor: "#f8f9fa"
              }}
            >
              <img
                src={img.proxy}
                alt={`Instagram image ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
                onError={(e) => {
                  console.warn("Image failed to load:", img.original);
                  e.target.src = "/placeholder.svg";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstagramHashtagClassifier;
