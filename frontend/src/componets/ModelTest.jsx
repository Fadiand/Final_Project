"use client"

import { useEffect, useState, useMemo } from "react"
import { useLocation } from "react-router-dom"

function ModelTest() {
  const location = useLocation()
  
  // Get session ID from cookies
  const sessionId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sessionid="))
    ?.split("=")[1]

  // State management
  const [classifiedImages, setClassifiedImages] = useState({
    tourist: JSON.parse(localStorage.getItem(`touristImages_${sessionId}`)) || [],
    nonTourist: JSON.parse(localStorage.getItem(`nonTouristImages_${sessionId}`)) || [],
  })
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Get image URLs from location state
  const imageUrls = useMemo(() => location.state?.imageUrls || [], [location.state?.imageUrls])

  // Clear all images for current user
  const clearAllImages = () => {
    setClassifiedImages({ tourist: [], nonTourist: [] })
    localStorage.removeItem(`touristImages_${sessionId}`)
    localStorage.removeItem(`nonTouristImages_${sessionId}`)
    setResults([])   
  }

  // Classify images when URLs change
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
            credentials: "include", // Send session ID to server
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

        {/* Classification Results */}
        <div className="classification-gallery">
          <div className="classification-column tourist-column">
            <h2 className="column-title">
              <span className="column-icon">🏝</span> Tourist
            </h2>
            <div className="image-grid">
              {classifiedImages.tourist.length > 0 ? (
                classifiedImages.tourist.map((img, index) => (
                  <div className="image-container" key={index}>
                    <img src={img || "/placeholder.svg"} alt="Tourist" className="classified-image" />
                  </div>
                ))
              ) : (
                <p className="empty-message">No tourist images yet</p>
              )}
            </div>
          </div>

          <div className="classification-column non-tourist-column">
            <h2 className="column-title">
              <span className="column-icon">🏠</span> Non-Tourist
            </h2>
            <div className="image-grid">
              {classifiedImages.nonTourist.length > 0 ? (
                classifiedImages.nonTourist.map((img, index) => (
                  <div className="image-container" key={index}>
                    <img src={img || "/placeholder.svg"} alt="Non-Tourist" className="classified-image" />
                  </div>
                ))
              ) : (
                <p className="empty-message">No non-tourist images yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Classification Results */}
        {results.length > 0 && (
          <div className="recent-results">
            <h2 className="section-title">Recent Classifications</h2>
            <div className="results-container">
              {results.map((res, index) => (
                <div key={index} className="result-item">
                  <div className="result-image-container">
                    <img src={res.imageUrl || "/placeholder.svg"} alt={`Result ${index}`} className="classified-image" />
                  </div>
                  <div className="result-details">
                    {res.classification === "תיירות" ? (
                      <span className="classification-icon success">✔ Tourist</span>
                    ) : (
                      <span className="classification-icon error">❌ Non-Tourist</span>
                    )}
                    <p className="confidence-text">
                      Confidence: <strong>{res.confidence}%</strong>
                    </p>
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

