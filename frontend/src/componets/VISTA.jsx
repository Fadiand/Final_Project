import React from "react";

function VISTA() {
  return (
    <div className="vista-container">
      {/* חלקיקים ברקע */}
      <div className="particles-background"></div>

      {/* אזור התוכן המרכזי */}
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to <span>VISTA</span>
        </h1>
        <p className="hero-description">
          Automated photo filtering for tourism using <span>deep</span> and <span>active learning</span>.
        </p>
        <button className="instagram-login-button">
          Login with Instagram
        </button>
      </div>
    </div>
  );
}

export default VISTA;