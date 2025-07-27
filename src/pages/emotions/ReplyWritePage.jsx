import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "../../firebase";
import { getNickname } from "../../utils/firebaseUtils";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header";
import WriteForm from "../../components/WriteForm";
import FloatingButton from "../../components/FloatingButton";

function ReplyWritePage() {
  const { storyId, emotionName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/emotions/${emotionName}/${storyId}`);
    }
  }, [user, navigate, emotionName, storyId]);

  const handleSubmit = async () => {
    if (loading) return; 
    if (!content.trim()) {
      alert("Please enter your comment.");
      return;
    }

    setLoading(true);
    try {
      const nickname = await getNickname(user.uid);

      const duplicateQuery = query(
        collection(db, "comments"),
        where("storyId", "==", storyId),
        where("userId", "==", user.uid),
        where("content", "==", content.trim())
      );
      const snapshot = await getDocs(duplicateQuery);
      if (!snapshot.empty) {
        alert("You've already posted this same comment.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "comments"), {
        storyId,
        userId: user.uid,
        userNickname: nickname,
        content,
        likes: 0,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "communities", storyId), {
        comments: increment(1)
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      navigate(`/emotions/${emotionName}/${storyId}`, {
        replace: true
      });
    } catch (err) {
      console.error("Failed to save comment:", err);
      alert("Failed to save your comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header title="Write Comment" type="close" />
      <div className="container-inner">
        <WriteForm
          showInput={false}
          showTextarea={true}
          textareaPlaceholder="Start writing — inappropriate comments may be removed without notice."
          textareaValue={content}
          setTextareaValue={setContent}
        />
      </div>
      <FloatingButton 
        text="Post"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default ReplyWritePage;