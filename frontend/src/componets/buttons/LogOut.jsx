// src/components/LogoutButton.jsx
"use client";

import { useRef, useState } from "react";
import "./LogoutButton.css";

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  

const logoutButtonStates = {
  default: {
    "--figure-duration": "100",
    "--transform-figure": "none",
    "--walking-duration": "100",
    "--transform-arm1": "none",
    "--transform-wrist1": "none",
    "--transform-arm2": "none",
    "--transform-wrist2": "none",
    "--transform-leg1": "none",
    "--transform-calf1": "none",
    "--transform-leg2": "none",
    "--transform-calf2": "none",
  },
  hover: {
    "--figure-duration": "100",
    "--transform-figure": "translateX(1.5px)",
    "--walking-duration": "100",
    "--transform-arm1": "rotate(-5deg)",
    "--transform-wrist1": "rotate(-15deg)",
    "--transform-arm2": "rotate(5deg)",
    "--transform-wrist2": "rotate(6deg)",
    "--transform-leg1": "rotate(-10deg)",
    "--transform-calf1": "rotate(5deg)",
    "--transform-leg2": "rotate(20deg)",
    "--transform-calf2": "rotate(-20deg)",
  },
  walking1: {
    "--figure-duration": "800", // במקום 300, שיהיה יותר ארוך ואחיד
    "--transform-figure": "translateX(17px)", // ישר ל-17px
    "--walking-duration": "1200",
    "--transform-arm1": "translateX(-4px) translateY(-2px) rotate(120deg)",
    "--transform-wrist1": "rotate(-5deg)",
    "--transform-arm2": "translateX(2px) rotate(-80deg)",
    "--transform-wrist2": "rotate(-5deg)",
    "--transform-leg1": "translateX(-3px) rotate(80deg)",
    "--transform-calf1": "rotate(-30deg)",
    "--transform-leg2": "translateX(4px) rotate(-60deg)",
    "--transform-calf2": "rotate(20deg)",
  },
  falling1: {
    "--figure-duration": "600",
    "--walking-duration": "400",
    "--transform-arm1": "rotate(-60deg)",
    "--transform-wrist1": "none",
    "--transform-arm2": "rotate(30deg)",
    "--transform-wrist2": "rotate(120deg)",
    "--transform-leg1": "rotate(-30deg)",
    "--transform-calf1": "rotate(-20deg)",
    "--transform-leg2": "rotate(20deg)",
  },
};

export default function LogoutButton({ onAnimationEnd }) {
    const buttonRef = useRef(null);
    const [state, setState] = useState("default");
    const [isAnimating, setIsAnimating] = useState(false);
  
    const updateButtonState = (newState) => {
      if (logoutButtonStates[newState] && buttonRef.current) {
        setState(newState);
        for (let key in logoutButtonStates[newState]) {
          buttonRef.current.style.setProperty(key, logoutButtonStates[newState][key]);
        }
      }
    };
  
    const handleMouseEnter = () => {
      if (state === "default" && !isAnimating) updateButtonState("hover");
    };
  
    const handleMouseLeave = () => {
      if (state === "hover" && !isAnimating) updateButtonState("default");
    };
  
    const handleClick = async () => {
        if (!buttonRef.current || isAnimating) return;
      
        setIsAnimating(true);
      
        buttonRef.current.classList.add("clicked");
        updateButtonState("walking1");
        await sleep(1200);
      
        if (!buttonRef.current) return;
        buttonRef.current.classList.add("door-slammed");
        await sleep(50);
      
        if (!buttonRef.current) return;
        updateButtonState("falling1");
        buttonRef.current.classList.add("falling-transition");
      
        const figureElement = buttonRef.current.querySelector(".figure");
        if (!figureElement) return;
      
        await new Promise((resolve) => {
          const onFallDownAndSpinEnd = (e) => {
            if (e.animationName !== "fallDownAndSpin") return;
            figureElement.removeEventListener("animationend", onFallDownAndSpinEnd);
            resolve();
          };
          figureElement.addEventListener("animationend", onFallDownAndSpinEnd);
        });
      
        // ✅ אחרי סיום הנפילה והסיבוב
        figureElement.style.display = "none";
      
        if (!buttonRef.current) return;
        buttonRef.current.classList.remove("clicked", "door-slammed", "falling-transition");
        updateButtonState("default");
        if (figureElement) figureElement.style.display = "block";
        setIsAnimating(false);
      
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      };
      
  
  

  return (
    <div className="logoutButton-container">
      <button
        ref={buttonRef}
        className="logoutButton logoutButton--dark"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* כל הסבגים */}
        {/* הדמות */}
        <svg className="doorway" viewBox="0 0 100 100">
          <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
          <path className="bang" d="M40.5 43.7L26.6 31.4l-2.5 6.7zM41.9 50.4l-19.5-4-1.4 6.3zM40 57.4l-17.7 3.9 3.9 5.7z" />
        </svg>

        <svg className="figure" viewBox="0 0 100 100">
          <circle cx="52.1" cy="32.4" r="6.4" />
          <path d="M50.7 62.8c-1.2 2.5-3.6 5-7.2 4-3.2-.9-4.9-3.5-4-7.8.7-3.4 3.1-13.8 4.1-15.8 1.7-3.4 1.6-4.6 7-3.7 4.3.7 4.6 2.5 4.3 5.4-.4 3.7-2.8 15.1-4.2 17.9z" />
                  {/* שאר הידיים והרגליים */}
                  <g className="arm1">
  <path d="M55.5 56.5l-6-9.5c-1-1.5-.6-3.5.9-4.4 1.5-1 3.7-1.1 4.6.4l6.1 10c1 1.5.3 3.5-1.1 4.4-1.5.9-3.5.5-4.5-.9z" />
  <path className="wrist1" d="M69.4 59.9L58.1 58c-1.7-.3-2.9-1.9-2.6-3.7.3-1.7 1.9-2.9 3.7-2.6l11.4 1.9c1.7.3 2.9 1.9 2.6 3.7-.4 1.7-2 2.9-3.8 2.6z" />
</g>
<g className="arm2">
  <path d="M34.2 43.6L45 40.3c1.7-.6 3.5.3 4 2 .6 1.7-.3 4-2 4.5l-10.8 2.8c-1.7.6-3.5-.3-4-2-.6-1.6.3-3.4 2-4z" />
  <path className="wrist2" d="M27.1 56.2L32 45.7c.7-1.6 2.6-2.3 4.2-1.6 1.6.7 2.3 2.6 1.6 4.2L33 58.8c-.7 1.6-2.6 2.3-4.2 1.6-1.7-.7-2.4-2.6-1.7-4.2z" />
</g>
<g className="leg1">
  <path d="M52.1 73.2s-7-5.7-7.9-6.5c-.9-.9-1.2-3.5-.1-4.9 1.1-1.4 3.8-1.9 5.2-.9l7.9 7c1.4 1.1 1.7 3.5.7 4.9-1.1 1.4-4.4 1.5-5.8.4z" />
  <path className="calf1" d="M52.6 84.4l-1-12.8c-.1-1.9 1.5-3.6 3.5-3.7 2-.1 3.7 1.4 3.8 3.4l1 12.8c.1 1.9-1.5 3.6-3.5 3.7-2 0-3.7-1.5-3.8-3.4z" />
</g>
<g className="leg2">
  <path d="M37.8 72.7s1.3-10.2 1.6-11.4 2.4-2.8 4.1-2.6c1.7.2 3.6 2.3 3.4 4l-1.8 11.1c-.2 1.7-1.7 3.3-3.4 3.1-1.8-.2-4.1-2.4-3.9-4.2z" />
  <path className="calf2" d="M29.5 82.3l9.6-10.9c1.3-1.4 3.6-1.5 5.1-.1 1.5 1.4.4 4.9-.9 6.3l-8.5 9.6c-1.3 1.4-3.6 1.5-5.1.1-1.4-1.3-1.5-3.5-.2-5z" />
</g>

        </svg>

        <svg className="door" viewBox="0 0 100 100">
          <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
          <circle cx="66" cy="50" r="3.7" />
        </svg>

      </button>
    </div>
  );
}
