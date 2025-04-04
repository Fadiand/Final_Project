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
      const response = await fetch(
        `http://127.0.0.1:8000/instagram/public-images/?tag=${hashtag}`
      );
      const data = await response.json();
      setFetchedImages(data.images || []);
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
      state: { imageUrls: fetchedImages },
    });
  };

  return (
    <div className="ig">
  <div className="ig-box">
    <h2>Instagram Hashtag Classifier</h2>

    <input
      type="text"
      placeholder="Enter hashtag"
      value={hashtag}
      onChange={(e) => setHashtag(e.target.value)}
    />

    <button onClick={handleSearchClick}>Search</button>

    {loading && <p style={{ color: "#fff" }}>Loading...</p>}

    {fetchedImages.length > 0 && (
      <button onClick={handleClassifyAll}>Classify All</button>
    )}
  </div>

  {fetchedImages.length > 0 && (
    <div className="image-gallery">
      {fetchedImages.map((img, idx) => (
        <img key={idx} src={img} alt={`Image ${idx}`} />
      ))}
    </div>
  )}
</div>

  );
}

export default InstagramHashtagClassifier;
