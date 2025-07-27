import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { getNickname } from "../../utils/firebaseUtils";
import { useAuth } from "../../contexts/AuthContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import Header from "../../components/common/Header";
import WriteForm from "../../components/WriteForm";
import FloatingButton from "../../components/FloatingButton";
import "./StoryWritePage.css";

function StoryWritePage() {
  const { emotionName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);  

  useEffect(() => {
    if (!user) {
     navigate(`/emotions/${emotionName}`, { replace: true });
    }
  }, [user, navigate, emotionName]);

  const handleSubmit = async () => {
    console.log("🔥 handleSubmit triggered", loading, loadingRef.current, title, content);

    if (loadingRef.current) {
      console.log("🚫 Already submitting, block duplicate");
      return;
    }

    if (!title || !content) {
      alert("Please enter both title and content.");
      return;
    }

    loadingRef.current = true;  
    setLoading(true);

    try {
      const nickname = await getNickname(user.uid);

      await addDoc(collection(db, "communities"), {
        emotion: emotionName,
        userNickname: nickname,
        userId: user.uid,
        title,
        content,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
        emoji: `/assets/emotions/${emotionName.toLowerCase()}.png`
      });

      logEvent(analytics, "post_story", {
        emotion: emotionName,
        user: user.uid,
        word_count: content.length
      });

      navigate(`/emotions/${emotionName}`, {
        state: { showToast: true },
        replace: true
      });
    } catch (err) {
      console.error("Failed to save story:", err);
      alert("Failed to save your story.");
    } finally {
      loadingRef.current = false; 
      setLoading(false);
    }
  };

  return (
    <div className="container story-write-page">
      <Header title="Tell Your Story" type="close" />

      <div className="container-inner">
        <WriteForm
          inputValue={title}
          setInputValue={setTitle}
          textareaValue={content}
          setTextareaValue={setContent}
          inputPlaceholder="Title"
          textareaPlaceholder="Start writing — inappropriate posts may be removed without notice."
        />
      </div>

      <FloatingButton 
        text="Post"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}  
      />
    </div>
  );
}

export default StoryWritePage;
