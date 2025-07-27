import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function VerifyCheckPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true); // 로딩 중인지
  const [verified, setVerified] = useState(false); // 인증 여부

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // 유저 정보 새로고침
          await user.reload();

          if (user.emailVerified) {
            setVerified(true);
            navigate("/therapist/register");
          } else {
            setVerified(false);
            setChecking(false);
          }
        } else {
          // 로그인 안 된 경우 로그인 페이지로
          navigate("/therapist/login");
        }
      } catch (err) {
        console.error("이메일 인증 확인 중 오류:", err);
        setChecking(false);
      }
    };

    checkVerification();
  }, [navigate]);

  return (
    <div className="container verify-check-page">
      <div className="container-inner">
        {checking ? (
          <p>인증 확인 중입니다... ⏳</p>
        ) : verified ? (
          <p>이메일 인증이 완료되었습니다! ✅</p>
        ) : (
          <p>
            아직 이메일 인증이 되지 않았어요.<br />
            이메일에서 인증 버튼을 눌러주세요.
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyCheckPage;