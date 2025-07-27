import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../../firebase";
import "./TherapistSignupPage.css";

function TherapistSignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // 이메일 형식 체크
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 비밀번호 복잡도 체크: 대문자, 소문자, 숫자 포함 8자 이상
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // 이메일+비밀번호 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (!isEmailValid) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (!isPasswordValid) {
      setError("비밀번호는 8자 이상, 대문자/소문자/숫자를 포함해야 합니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 이메일 인증 보내기
      await sendEmailVerification(user, {
        url: "http://localhost:5173/therapist/register",
      });

      navigate("/email-sent");
    } catch (err) {
      console.error("회원가입 오류:", err.message);
      setError("이미 존재하는 이메일이거나 입력이 올바르지 않습니다.");
    }
  };

  // Google 로그인 (redirect 방식)
  const handleGoogleSignup = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="container therapist-signup-page">
      <div className="container-inner">
        <h2>상담사 회원가입</h2>

        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "input-error" : ""}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "input-error" : ""}
            required
          />

          <button type="submit" className="primary-button">
            이메일 인증하기
          </button>
        </form>

        <div className="or-divider">또는</div>

        <button onClick={handleGoogleSignup} className="google-button">
          Google로 계속하기
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default TherapistSignupPage;