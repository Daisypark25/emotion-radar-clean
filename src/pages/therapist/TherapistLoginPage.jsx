import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import "./TherapistLoginPage.css";

function TherapistLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login 또는 signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/therapist/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/therapist/register"); // 회원가입 완료 → 추가 정보 입력
      }
    } catch (err) {
      console.error("인증 오류:", err.message);
      setError(
        mode === "login"
          ? "이메일 또는 비밀번호를 확인해주세요."
          : "회원가입에 실패했습니다. 이미 가입된 이메일일 수 있습니다."
      );
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // 로그인 or 회원가입 여부에 따라 분기할 수 있음
      if (mode === "signup") {
        navigate("/therapist/register");
      } else {
        navigate("/therapist/dashboard");
      }
    } catch (err) {
      console.error("Google 로그인 실패:", err.message);
      setError("Google 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="container therapist-login-page">
      <div className="container-inner">
        <h2>{mode === "login" ? "Therapist Login" : "Therapist Sign Up"}</h2>

        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="primary-button">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <button className="google-button" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="switch-text">
          {mode === "login" ? (
            <>
              상담사로 처음이신가요?{" "}
              <span className="link" onClick={() => setMode("signup")}>
                회원가입
              </span>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <span className="link" onClick={() => setMode("login")}>
                로그인
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default TherapistLoginPage;