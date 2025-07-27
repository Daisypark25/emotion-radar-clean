import { useEffect, useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import JournalPage from "./pages/journal/JournalPage";
import AdvicePage from "./pages/journal/AdvicePage";
import EmotionsPage from "./pages/emotions/EmotionsPage";
import EmotionStoriesPage from "./pages/emotions/EmotionStoriesPage";
import CarePage from "./pages/care/CarePage";
import MyPage from "./pages/my/MyPage";
import StoryWritePage from "./pages/emotions/StoryWritePage";
import StoryDetailPage from "./pages/emotions/StoryDetailPage";
import ReplyWritePage from "./pages/emotions/ReplyWritePage";
import StoryEditPage from "./pages/emotions/StoryEditPage";
import ReplyEditPage from "./pages/emotions/ReplyEditPage";
import ReportWritePage from "./pages/emotions/ReportWritePage";
import TherapistDetailPage from "./pages/care/TherapistDetailPage";
import BookingPage from "./pages/care/BookingPage";
import ComingSoonPage from "./pages/ComingSoonPage";

import BottomNav from "./components/BottomNav";
import Modal from "./components/modal/Modal";
import LoginModal from "./components/modal/LoginModal";
import Toast from "./components/common/Toast";
import Button from "./components/common/Button";
import Splash from "./pages/Splash"; 

function MainApp() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showSplash, setShowSplash] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

    useEffect(() => {
    window.showUpdateToast = () => setShowUpdateToast(true);  
    return () => {
      window.showUpdateToast = null; 
    };
  }, []);

    useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);  // ✅ 최소 3초 스플래시
    return () => clearTimeout(timer);
  }, []);



  const hideBottomNav = [
    "/write", "/reply", "/edit", "/advice", "/login", "/signup", "/report"
  ].some(path => location.pathname.includes(path)) ||
    location.pathname.startsWith(`/care/${location.pathname.split('/')[2]}`) ||
    (location.pathname.includes("/emotions/") && location.pathname.split('/').length >= 4);

  const openLoginModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <>
      {/* 🌈 감정 배경 */}
      <div
        className="emotion-background"
        style={{
          background: selectedEmotion
            ? selectedEmotion.color
            : "linear-gradient(135deg, #FFF3B0, #DDEBFA, #F8C8C8, #E4D8F5, #F8C1D9)",
          transition: "background 0.5s ease"
        }}
      >
        {selectedEmotion && (
          <div className="emotion-pattern-grid">
            {Array.from({ length: 100 }).map((_, i) => (
              <div className="grid-cell" key={i}>
                <img
                  src={selectedEmotion.image}
                  alt=""
                  className="floating-emoji"
                  style={{
                    animationDelay: `${Math.random() * 4}s`,
                    transform: `translate(${Math.random() * 8 - 4}px, ${Math.random() * 8 - 4}px)`
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

   
      <div className="container">
        <Routes>
          {/* content가 필요한 페이지 */}
          <Route element={<div className="content"><Outlet /></div>}>
            <Route path="/" element={<JournalPage setSelectedEmotion={setSelectedEmotion} hideBottomNav={hideBottomNav} />} />
            <Route path="/emotions" element={<EmotionsPage setSelectedEmotion={setSelectedEmotion} />} />
            <Route path="/emotions/:emotionName" element={<EmotionStoriesPage hideBottomNav={hideBottomNav} />} />
            <Route path="/comingsoon" element={<ComingSoonPage />} />
            <Route path="/care" element={<CarePage setSelectedEmotion={setSelectedEmotion} />} />
            <Route path="/my" element={<MyPage setSelectedEmotion={setSelectedEmotion} />} />
          </Route>

          {/* content가 필요 없는 페이지 */}
          <Route path="/advice" element={<AdvicePage setSelectedEmotion={setSelectedEmotion} hideBottomNav={hideBottomNav} />} />
          <Route path="/emotions/:emotionName/write" element={<StoryWritePage />} />
          <Route path="/emotions/:emotionName/:storyId" element={<StoryDetailPage hideBottomNav={hideBottomNav} />} />
          <Route path="/emotions/:emotionName/:storyId/edit" element={<StoryEditPage />} />
          <Route path="/emotions/:emotionName/:storyId/reply" element={<ReplyWritePage hideBottomNav={hideBottomNav} />} />
          <Route path="/emotions/:emotionName/:storyId/comments/:commentId/edit" element={<ReplyEditPage hideBottomNav={hideBottomNav} />} />
          <Route path="/report/story/:storyId/:storyUserId" element={<ReportWritePage hideBottomNav={hideBottomNav} />} />
          <Route path="/report/comment/:storyId/:commentId/:commentUserId" element={<ReportWritePage hideBottomNav={hideBottomNav} />} />
          <Route path="/care/:therapistId" element={<TherapistDetailPage />} />
          <Route path="/care/:therapistId/book" element={<BookingPage />} />
        </Routes>

       
        {!hideBottomNav && <BottomNav />}

      </div>

      {/* 🔑 로그인 모달 */}
      {showModal && (
        <Modal onClose={closeModal}>
          <LoginModal />
        </Modal>
      )}

    </>
  );
}

export default MainApp;