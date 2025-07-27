import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";    
import "./LoginPage.css";
import Button from "../components/common/Button";
import Input from "../components/common/Input/Input";
import PasswordInput from "../components/common/Input/PasswordInput";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setError("");
    setEmailError("");
    setPasswordConfirmError("");
  }, [mode]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  useEffect(() => {
    if (mode === "signup" && passwordConfirm) {
      if (password !== passwordConfirm) {
        setPasswordConfirmError("Passwords do not match.");
      } else {
        setPasswordConfirmError("");
      }
    } else {
      setPasswordConfirmError("");
    }
  }, [password, passwordConfirm, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup" && password !== passwordConfirm) {
      setPasswordConfirmError("Passwords do not match.");
      return;
    }

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/my");
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/my");
    } catch (err) {
      console.error(err);
      setError(err.message || "Google login failed.");
    }
  };

  return (
    <div className="container login-page">
      <div className="container-inner">
        <h2>{mode === "login" ? "Welcome back" : "Join Emotion-radar"}</h2>

        {false && (
          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              error={emailError}
              resetTrigger={mode}
              required
            />

            <PasswordInput
              value={password}
              onChange={setPassword}
              resetTrigger={mode}
            />

            {mode === "signup" && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                error={passwordConfirmError}
                resetTrigger={mode}
                required
              />
            )}

            <Button type="primary" size="md" as="submit">
              {mode === "login" ? "Sign in" : "Sign up"}
            </Button>
          </form>
        )}

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

        {false && (
          <div className="therapist-banner">
            <p>Are you a therapist?</p>
            <a href="/therapist" className="link">Register here</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
