import React from "react";
import pic1 from "../images/pic1.png"; 
import pic3 from "../images/pic3.png";
import { useNavigate } from "react-router-dom";

function VISTA() {
  const nav = useNavigate();
  
  const handleinfo = () => {
    nav("/about");
  };
  return (
    <div className="vista-container">
      {/* חלקיקים ברקע */}
      <div className="particles-background"></div>
      <div className="gradient-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      {/* אזור התוכן המרכזי */}
      <div className="hero-section">
        <div className="logo-badge">V</div>
        <h1 className="hero-title">
          Welcome to <span>VISTA</span>
        </h1>
        <p className="hero-description">
          Automated photo filtering for tourism using <span>deep</span> and <span>active learning</span>.
        </p>
        <button className="instagram-login-button" onClick={handleinfo}>
          <span className="icon"></span> For more information   {/* אזור התוכן המרכזי */}
        </button>
        
        <div className="preview-images">
          
          <div className="preview-image img2">
            <img src={pic3} alt="Landscape preview" /> 
          </div>
          <div className="preview-image img3">
            <img src={pic1} alt="City preview" /> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default VISTA;
