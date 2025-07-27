import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("사용자 회원가입 시도:", email, password);
    // Firebase 회원가입 처리 로직 추가 가능
  };

  return (
    <div className="container login-page">
      <div className="container-inner">
        <h2>Join Us</h2>

        <form className="login-form" onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">Sign Up</button>
        </form>

        <button className="google-login-button">
          Continue with Google
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">Sign in</span>
        </p>
      </div>

      <div className="therapist-banner">
        <p>Are you a therapist?</p>
        <a href="/therapist" className="link">Register here</a>
      </div>
    </div>
  );
}

export default SignupPage;