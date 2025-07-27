import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase";

function EmailSentPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        setMessage("인증 메일을 다시 보냈어요! 이메일을 확인해 주세요.");
        setError("");
      } catch (err) {
        console.error("재전송 실패:", err);
        setError("이메일 재전송에 실패했어요. 다시 시도해 주세요.");
      }
    } else {
      setError("이미 인증이 완료되었거나 로그인 상태가 아닙니다.");
    }
  };

  return (
    <div className="container">
      <h2>이메일을 확인해 주세요</h2>
      <p>회원가입을 완료하려면 이메일에서 인증 링크를 눌러야 해요.</p>

      <button onClick={handleResend} className="primary-button">
        인증 메일 다시 보내기
      </button>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default EmailSentPage;