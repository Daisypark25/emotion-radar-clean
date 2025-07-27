import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/common/Header";
import WriteForm from "../../components/WriteForm";
import FloatingButton from "../../components/FloatingButton";

function StoryEditPage() {
  const { storyId, emotionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from; // ← 바뀐 부분

  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "communities", storyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.userId !== user.uid) {
          alert("You can only edit your own posts.");
          navigate(`/emotions/${emotionName}/${storyId}`);
          return;
        }
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert("Post not found.");
        navigate(-1);
      }
    };
    if (user) fetchStory();
  }, [user, storyId, emotionName, navigate]);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please enter both title and content.");
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "communities", storyId), {
        title,
        content,
        updatedAt: serverTimestamp(),
        isEdited: true
      });

      navigate(from || `/emotions/${emotionName}`, { replace: true }); // ← 핵심
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to update your post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header title="Edit Post" type="close" />
      <div className="container-inner">
        <WriteForm
          inputValue={title}
          setInputValue={setTitle}
          textareaValue={content}
          setTextareaValue={setContent}
          inputPlaceholder="Enter post title"
          textareaPlaceholder="Enter post content"
        />
      </div>
      <FloatingButton
        text="Update Post"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default StoryEditPage;