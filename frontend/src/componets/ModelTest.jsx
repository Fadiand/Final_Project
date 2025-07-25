"use client"

import { useEffect, useState, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";

function ModelTest() {
  const location = useLocation()
  const navigate = useNavigate();

  // ✅ קבלת sessionId מתוך localStorage (תואם ל־Google, Facebook, Local)
  const sessionId = useMemo(() => {
    const userStr = localStorage.getItem("user")
    try {
      const user = userStr ? JSON.parse(userStr) : null
      return user?.session_id || null
    } catch {
      return null
    }
  }, [])

  const [classifiedImages, setClassifiedImages] = useState({
    tourist: JSON.parse(localStorage.getItem(`touristImages_${sessionId}`)) || [],
    nonTourist: JSON.parse(localStorage.getItem(`nonTouristImages_${sessionId}`)) || [],
  })
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const imageUrls = useMemo(() => {
    return location.state?.imageUrls || location.state?.imagesToClassify?.map(img => img.imageUrl) || []
  }, [location.state])

  const clearAllImages = () => {
    setClassifiedImages({ tourist: [], nonTourist: [] })
    localStorage.removeItem(`touristImages_${sessionId}`)
    localStorage.removeItem(`nonTouristImages_${sessionId}`)
    setResults([])
  }

  useEffect(() => {
    if (imageUrls.length === 0) return

    const classifyImages = async () => {
      try {
        setIsLoading(true)
        const newResults = []

        for (const imageUrl of imageUrls) {
          const formData = new FormData()
          formData.append("image", await fetch(imageUrl).then((res) => res.blob()))

          const response = await fetch("http://localhost:8000/gallery/classify-image/", {
            method: "POST",
            body: formData,
            credentials: "include",
          })

          if (response.ok) {
            const data = await response.json()
            newResults.push({
              imageUrl,
              classification: data.classification,
              confidence: (data.confidence * 100).toFixed(2),
            })

            setClassifiedImages((prev) => {
              const newImages = {
                tourist:
                  data.classification === "תיירות" && !prev.tourist.includes(imageUrl)
                    ? [...prev.tourist, imageUrl]
                    : prev.tourist,
                nonTourist:
                  data.classification === "לא תיירות" && !prev.nonTourist.includes(imageUrl)
                    ? [...prev.nonTourist, imageUrl]
                    : prev.nonTourist,
              }

              localStorage.setItem(`touristImages_${sessionId}`, JSON.stringify(newImages.tourist))
              localStorage.setItem(`nonTouristImages_${sessionId}`, JSON.stringify(newImages.nonTourist))

              return newImages
            })
          } else {
            newResults.push({ imageUrl, classification: "שגיאה", confidence: "N/A" })
          }
        }

        setResults(newResults)
      } catch (error) {
        console.error("שגיאה בסיווג התמונות:", error)
      } finally {
        setIsLoading(false)
      }
    }

    classifyImages()
  }, [imageUrls, sessionId])

  const sendFeedback = async (imageUrl, feedback) => {
    try {
      const response = await fetch("http://localhost:8000/gallery/submit-feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ image_url: imageUrl, feedback }),
      })

      if (response.ok) {
      } else {
        const data = await response.json()
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  if (!sessionId) {
    return (
      <div className="model-test">
        <div className="page-container">
          <header className="page-header">
            <h1 className="classification-title">Image Classification</h1>
          </header>
          <p className="empty-message" style={{ textAlign: "center", marginTop: "40px" }}>
             Please log in to see your classified images.
          </p>
          <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            fontSize: "16px",
            backgroundColor: "#0095f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Go to Login
        </button>
        </div>
      </div>
    )
  }

  return (
    <div className="model-test">
      <div className="page-container">
        <header className="page-header">
          <h1 className="classification-title">Image Classification</h1>
          <button className="clear-all-button" onClick={clearAllImages}>
            <span className="button-icon">🗑️</span>
            <span className="button-text">Clear My Images</span>
          </button>
        </header>

        {isLoading && (
          <div className="loading-container">
            <p className="loading-text">Classifying images...</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="classification-gallery">
          <div className="classification-column tourist-column">
            <h2 className="column-title"><span className="column-icon">🏝</span> Tourist</h2>
            <div className="image-grid">
              {classifiedImages.tourist.length > 0 ? (
                classifiedImages.tourist.map((img, index) => (
                  <div className="image-container" key={index}>
                    <img src={img} alt="Tourist" className="classified-image" />
                  </div>
                ))
              ) : (
                <p className="empty-message">No tourist images yet</p>
              )}
            </div>
          </div>

          <div className="classification-column non-tourist-column">
            <h2 className="column-title"><span className="column-icon">🏠</span> Non-Tourist</h2>
            <div className="image-grid">
              {classifiedImages.nonTourist.length > 0 ? (
                classifiedImages.nonTourist.map((img, index) => (
                  <div className="image-container" key={index}>
                    <img src={img} alt="Non-Tourist" className="classified-image" />
                  </div>
                ))
              ) : (
                <p className="empty-message">No non-tourist images yet</p>
              )}
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="recent-results">
            <h2 className="section-title">Recent Classifications</h2>
            <div className="results-container">
              {results.map((res, index) => (
                <div key={index} className="result-item">
                  <div className="result-image-container">
                    <img src={res.imageUrl} alt={`Result ${index}`} className="classified-image" />
                  </div>
                  <div className="result-details">
                    {res.classification === "תיירות" ? (
                      <span className="classification-icon success">✔ Tourist</span>
                    ) : (
                      <span className="classification-icon error">❌ Non-Tourist</span>
                    )}
                    <p className="confidence-text">Confidence: <strong>{res.confidence}%</strong></p>
                    <p className="feedback-label">Was this prediction accurate?</p>
                    <div className="feedback-buttons">
                      <button className="feedback-btn like" onClick={() => sendFeedback(res.imageUrl, "like")}>👍</button>
                      <button className="feedback-btn dislike" onClick={() => sendFeedback(res.imageUrl, "dislike")}>👎</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelTest