import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header";
import WriteForm from "../../components/WriteForm";
import FloatingButton from "../../components/FloatingButton";

function ReportWritePage() {
  const { storyId, storyUserId, commentId, commentUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from;

  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return; // 이미 로딩중이면 중복 방지

    if (!details) {
      alert("Please enter details of your report.");
      return;
    }

    let reportData = {
      storyId,
      reporterId: user?.uid || "anonymous",
      details,
      createdAt: serverTimestamp(),
    };

    if (commentId && commentUserId) {
      reportData = {
        ...reportData,
        commentId,
        reportedUserId: commentUserId,
        type: "comment",
      };
    } else if (storyUserId) {
      reportData = {
        ...reportData,
        reportedUserId: storyUserId,
        type: "story",
      };
    } else {
      alert("Invalid report data.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "reports"), reportData);
      alert("Your report has been submitted.");
      navigate(from || "/", { replace: true });
    } catch (err) {
      console.error("Failed to save report:", err);
      alert("Failed to submit your report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header title="Report" type="close" />
      <div className="container-inner">
        <WriteForm
          showInput={false}
          showTextarea={true}
          textareaPlaceholder="Enter details of your report"
          textareaValue={details}
          setTextareaValue={setDetails}
        />
      </div>
      <FloatingButton 
        text="Send"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default ReportWritePage;