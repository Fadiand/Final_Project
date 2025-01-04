
import { useState } from "react";
import galaxy from "../images/galaxy.png";

function Login() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${galaxy})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ul className="login_Signup">
        <li>LOGIN</li>
        <li>SIGNUP</li>
      </ul>
      <div
        className={`toggle-container ${isOn ? "on" : ""}`}
        onClick={handleToggle}
      >
        <div className={`toggle-knob ${isOn ? "on" : ""}`}></div>
      </div>

      <form className="login-form">
        <h2>Login</h2>
        <div className="input-container">
          <input type="text" placeholder="Your Email" />
          <input type="text" placeholder="Your Password" />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
