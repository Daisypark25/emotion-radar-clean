import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import "../pages/LoginPage.css"; 
import "../styles/LoginForm.css"; 
import Button from "../components/common/Button";

function LoginForm({ onStartLogin, onSuccess }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [mode]);

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    onStartLogin?.();
    await signInWithPopup(auth, provider);
    onSuccess?.();  
  } catch (err) {
    console.error(err);
    setError(err.message || "Google login failed.");
    onSuccess?.();
  }
};

  return (
    <>
      <h2>{mode === "login" ? "Welcome back" : "Join Emotion Radar"}</h2>

      <Button 
        type="secondary" 
        size="md" 
        onClick={handleGoogleLogin}
        icon={<FcGoogle />}
      >
        {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
      </Button>

      {error && <p className="login-error-text">{error}</p>}

      <p className="switch-text">
        {mode === "login" ? (
          <>
            No account?{" "}
            <span onClick={() => setMode("signup")} className="link">
              Create one
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setMode("login")} className="link">
              Sign in
            </span>
          </>
        )}
      </p>

      <p className="terms-text">
        Click “{mode === "login" ? "Sign in" : "Sign up"}” to agree to Emotion Radar’s{" "}
        <a href="" target="_blank" rel="noopener noreferrer">Terms of Service</a> 
        {" "}and acknowledge that our{" "}
        <a href="" target="_blank" rel="noopener noreferrer">Privacy Policy</a> applies to you.
      </p>
    </>
  );
}

export default LoginForm;