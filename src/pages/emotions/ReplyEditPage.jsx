import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header";
import WriteForm from "../../components/WriteForm";
import FloatingButton from "../../components/FloatingButton";

function ReplyEditPage() {
  const { storyId, commentId, emotionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  useEffect(() => {
    const fetchComment = async () => {
      const docRef = doc(db, "comments", commentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.userId !== user.uid) {
          alert("You can only edit your own comments.");
          navigate(`/emotions/${emotionName}/${storyId}`);
          return;
        }
        setContent(data.content);
      } else {
        alert("Comment not found.");
        navigate(-1);
      }
    };
    if (user) fetchComment();
  }, [user, commentId, storyId, emotionName, navigate]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please enter your comment.");
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "comments", commentId), {
        content,
        updatedAt: serverTimestamp(),
        isEdited: true
      });

      navigate(from || `/emotions/${emotionName}/${storyId}`, { replace: true });
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update your comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header title="Edit Comment" type="close" />
      <div className="container-inner">
        <WriteForm
          showTitle={false}
          textareaValue={content}
          setTextareaValue={setContent}
          textareaPlaceholder="Enter your comment"
        />
      </div>
      <FloatingButton
        text="Update Comment"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default ReplyEditPage;