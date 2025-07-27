import { Routes, Route, useLocation } from "react-router-dom";
import TherapistBottomNav from "./components/therapist/TherapistBottomNav";
import TherapistLoginPage from "./pages/therapist/TherapistLoginPage";
import EmailSentPage from "./pages/therapist/EmailSentPage";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistMyPage from "./pages/therapist/TherapistMyPage";
import TherapistRegisterPage from "./pages/therapist/TherapistRegisterPage";

function TherapistApp() {
  const location = useLocation();

  const hideTherapistNav = [
    "/therapist",       
    "/therapist/register"
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="therapist-container">
      <Routes>
        <Route path="/therapist" element={<TherapistLoginPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/therapist/register" element={<TherapistRegisterPage />} />
        <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
        <Route path="/therapist/mypage" element={<TherapistMyPage />} />
        {/* 더 추가 */}
      </Routes>

      {!hideTherapistNav && <TherapistBottomNav />}
    </div>
  );
}

export default TherapistApp;