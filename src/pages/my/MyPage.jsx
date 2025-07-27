import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import LoginForm from "../../components/LoginForm"; 
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import "./MyPage.css";
import JournalIcon from "../../assets/images/loveletter.png";
import CareIcon from "../../assets/images/blueheart.png";
import emotionsIcon from "../../assets/emotions/joy.png";
import ContentItem from "../../components/ContentItem";

function MyPage({ setSelectedEmotion }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(true);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [firstRenderSkipped, setFirstRenderSkipped] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFirstRenderSkipped(true);
    }
  }, [loading]);

  const handleLoginStart = () => {
    setLoginInProgress(true);
  };

  const handleLoginSuccess = () => {
    setLoginInProgress(false);
  };

  useEffect(() => {
    setSelectedEmotion(null);
  }, [setSelectedEmotion]);

  useEffect(() => {
    const fetchNickname = async () => {
      setNicknameLoading(true);
      if (!user) {
        setNicknameLoading(false);
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setNickname(userSnap.data().userNickname);
        }
      } catch (err) {
        console.error("닉네임 불러오기 실패:", err);
      } finally {
        setNicknameLoading(false);
      }
    };
    fetchNickname();
  }, [user, location.key]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoading = loading || nicknameLoading || loginInProgress || !firstRenderSkipped;

  if (isLoading) {
    return (
      <div className="container my-loading">
        <div className="container-inner">
          <div className="my-user">
            <div className="skeleton-card" style={{ width: "40%", height: "2.2rem", borderRadius: "8px" }} />
            <div className="skeleton-card" style={{ width: "60%", height: "1.5rem", borderRadius: "8px", marginTop: "0.5rem" }} />
          </div>
          <div className="skeleton-card" style={{ width: "100%", height: "3.25rem", borderRadius: "8px", marginTop: "2rem" }} />
          <div className="service-card-skeletons" style={{ marginTop: "2.5rem" }}>
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="skeleton-card"
                style={{
                  width: "100%",
                  height: "4.5rem",
                  borderRadius: "12px",
                  marginBottom: "1rem"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-page">
      <div className="scroll-content">
        <div className="container-inner">
          <div className="my-user fade-in-up">
            {user ? (
              <>
                <h2 className="page-title">{nickname || "No nickname"}</h2>
                <p className="page-description">{user.email}</p>
                <Button type="secondary" size="md" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <LoginForm 
                onStartLogin={handleLoginStart} 
                onSuccess={handleLoginSuccess}
              />
            )}
          </div>

          {!user && <div className="divider fade-in-up"></div>}

          <div className="service-info fade-in-up">
            <Badge 
              text="Beta" 
              backgroundColor="#f1eaff" 
              textColor="#7b4df3" 
            />
            <div className="service-title">
              <svg viewBox="0 0 400 60" width="100%" height="1.75rem" preserveAspectRatio="xMinYMid meet">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff7597" />
                    <stop offset="40%" stopColor="#c174f2" />
                    <stop offset="80%" stopColor="#7f8ce3" />
                    <stop offset="100%" stopColor="#3a9dfd" />
                  </linearGradient>
                </defs>
                <text x="0" y="45" fontSize="32" fill="url(#grad)" fontWeight="700">
                  Emotion Radar
                </text>
              </svg>
            </div>

            <p className="service-description">
              Explore your feelings, connect, and care.
            </p>

            <div className="service-card">
              <ContentItem
                icon={<img src={JournalIcon} alt="Journal" />}
                title="Journal"
                description="Capture today’s emotions and receive warm advice from AI."
              />
              <ContentItem
                icon={<img src={emotionsIcon} alt="Emotions" />}
                title="Emotions"
                description="Discover stories from people who feel just like you, and share empathy and comfort."
              />
              <ContentItem
                icon={<img src={CareIcon} alt="Care" />}
                title="Care"
                description="When your heart needs more delicate, deeper care, reach out to a professional."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
