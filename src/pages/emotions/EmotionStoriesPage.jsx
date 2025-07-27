import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import Modal from "../../components/modal/Modal";
import LoginModal from "../../components/modal/LoginModal";
import Header from "../../components/common/Header";
import FloatingButton from "../../components/FloatingButton";
import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import DropdownMenu from "../../components/DropdownMenu";
import leafIcon from "../../assets/images/leaf.png";
import "./EmotionStoriesPage.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import joyImg from "../../assets/emotions/joy.png";
import joyGif from "../../assets/emotions/joy.gif";
import sadImg from "../../assets/emotions/sad.png";
import sadGif from "../../assets/emotions/sad.gif";
import angerImg from "../../assets/emotions/anger.png";
import angerGif from "../../assets/emotions/anger.gif";
import fearImg from "../../assets/emotions/fear.png";
import fearGif from "../../assets/emotions/fear.gif";
import loveImg from "../../assets/emotions/love.png";
import loveGif from "../../assets/emotions/love.gif";
import lonelyImg from "../../assets/emotions/lonely.png";
import lonelyGif from "../../assets/emotions/lonely.gif";
import worriedImg from "../../assets/emotions/worried.png";
import worriedGif from "../../assets/emotions/worried.gif";
import calmImg from "../../assets/emotions/calm.png";
import calmGif from "../../assets/emotions/calm.gif";
import anxiousImg from "../../assets/emotions/anxious.png";
import anxiousGif from "../../assets/emotions/anxious.gif";

import StoryCard from "../../components/StoryCard";
import EditIcon from "../../assets/icons/edit.svg?react";
import DeleteIcon from "../../assets/icons/delete.svg?react";
import ReportIcon from "../../assets/icons/report.svg?react";

function EmotionStoriesPage({ hideBottomNav }) {
  const { emotionName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const [stories, setStories] = useState([]);
  const [likedStories, setLikedStories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [afterLoginAction, setAfterLoginAction] = useState(null);
  const [dropdownStoryId, setDropdownStoryId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pastelEmotionColors = {
    joy: "#FFF8C6",
    sad: "#DCEEFF",
    anger: "#FFE2E2",
    fear: "#EDE7FA",
    love: "#FCE4EC",
    lonely: "#E9F0F6",
    anxious: "#FFF0F0",
    worried: "#FFE9DD", 
    calm: "#DFF9F2",
  };

  const pastelEmotionGradients = {
  joy: "linear-gradient(135deg, #FFF8C6 0%, #FFD8A8 50%, #E8F8D5 100%)",
  sad: "linear-gradient(135deg, #DCEEFF 0%, #B8D8F8 50%, #E0F0FF 100%)",
  anger: "linear-gradient(135deg, #FFE2E2 0%, #FFDACF 50%, #FFD1E3 100%)",
  fear: "linear-gradient(135deg, #EDE7FA 0%, #C2E5F7 50%, #D9E5FA 100%)",
  love: "linear-gradient(135deg, #FCE4EC 0%, #FDDCDC 50%, #F8E0F4 100%)",
  lonely: "linear-gradient(135deg, #E9F0F6 0%, #D7EAF5 50%, #CFE4EE 100%)",
  anxious: "linear-gradient(135deg, #FFF0F0 0%, #FFE9DC 50%, #F7E6F9 100%)",
  worried: "linear-gradient(135deg, #FFE9DD 0%, #FFF2D9 50%, #E1F1DC 100%)",
  calm: "linear-gradient(135deg, #DFF9F2 0%, #D6ECFA 50%, #E6F6D9 100%)",
};

  const emotionMessages = {
    joy: "Your joy can light up someone’s day. Share what made you smile.",
    sad: "It’s okay to be sad. Let your feelings out here with us.",
    anger: "Frustrated or angry? Write it down and feel a little lighter.",
    fear: "You don’t have to face your worries alone. Tell us what’s on your mind.",
    love: "Love makes life warmer. Share your moments of affection.",
    lonely: "Feeling lonely? Open up here. You might find someone who understands.",
    anxious: "Put your anxious thoughts into words. It can help to share.",
    worried: "Worried thoughts can feel heavy. Share them here and lighten your heart.",
    calm: "Share the calm moments that brought you peace today.",
  };

  const emojiMap = {
    joy: { static: joyImg, gif: joyGif },
    sad: { static: sadImg, gif: sadGif },
    anger: { static: angerImg, gif: angerGif },
    fear: { static: fearImg, gif: fearGif },
    love: { static: loveImg, gif: loveGif },
    lonely: { static: lonelyImg, gif: lonelyGif },
    anxious: { static: anxiousImg, gif: anxiousGif },
    worried: { static: worriedImg, gif: worriedGif },
    calm: { static: calmImg, gif: calmGif },
  };

  
  useEffect(() => {
    logEvent(analytics, "page_view", {
      page: "stories",
      emotion: emotionName,
      user: user ? "logged_in" : "guest"
    });
  }, [emotionName, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownStoryId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(
          collection(db, "communities"),
          where("emotion", "==", emotionName),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedStories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(fetchedStories);

      logEvent(analytics, "story_list_loaded", {
        emotion: emotionName,
        storyCount: fetchedStories.length,
      });

        if (user) {
          const likedIds = fetchedStories
            .filter(story => story.likedUsers?.includes(user.uid))
            .map(story => story.id);
          setLikedStories(likedIds);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [emotionName, location.key, user]);


  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      logEvent(analytics, "session_duration", {
        page: "stories",
        emotion: emotionName,
        ms: duration
      });
    };
  }, [emotionName]);


  useEffect(() => {
    if (location.state?.postSuccess) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [location.state]);

  useEffect(() => {
    if (user && typeof afterLoginAction === "function") {
      afterLoginAction();
      setAfterLoginAction(null);
      setShowLoginModal(false);
    }
  }, [user, afterLoginAction]);

  const handleLike = async (storyId) => {
    if (!user) {
      logEvent(analytics, "login_prompt_shown", { fromAction: "like_story" });
      setShowLoginModal(true);
      return;
    }

    logEvent(analytics, "like_story_clicked", {
      emotion: emotionName,
      story_id: storyId,
      user: user.uid
    });

    const isLiked = likedStories.includes(storyId);
    const storyRef = doc(db, "communities", storyId);
    const targetStory = stories.find((story) => story.id === storyId);
    const currentLikes = targetStory?.likes || 0;
    const currentLikedUsers = targetStory?.likedUsers || [];

    try {
      await updateDoc(storyRef, {
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        likedUsers: isLiked
          ? currentLikedUsers.filter(uid => uid !== user.uid)
          : [...currentLikedUsers, user.uid]
      });

      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === storyId
            ? {
                ...story,
                likes: isLiked ? currentLikes - 1 : currentLikes + 1,
                likedUsers: isLiked
                  ? currentLikedUsers.filter(uid => uid !== user.uid)
                  : [...currentLikedUsers, user.uid]
              }
            : story
        )
      );

      setLikedStories((prev) =>
        isLiked ? prev.filter((id) => id !== storyId) : [...prev, storyId]
      );
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleDeleteStory = async () => {
    console.log("Deleting story and its comments...");
    setIsDeleting(true);
    try {
      const storyId = storyToDelete.id;

    logEvent(analytics, "story_deleted", {
      storyId,
      emotion: emotionName
    });

      // 🔥 먼저 해당 글의 댓글 전부 가져와서 삭제
      const q = query(
        collection(db, "comments"),
        where("storyId", "==", storyId)
      );
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, "comments", docSnap.id));
        console.log("Deleted comment:", docSnap.id);
      }

      // 🔥 글 삭제
      await deleteDoc(doc(db, "communities", storyId));
      console.log("Deleted story:", storyId);

      // 🔥 상태에서 제거
      setStories(prev => prev.filter(s => s.id !== storyId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWrite = () => {
    if (!user) {
      logEvent(analytics, "login_prompt_shown", { fromAction: "write_story" });
      setShowLoginModal(true);
      setAfterLoginAction(() => () => navigate(`/emotions/${emotionName}/write`));
      return;
    }

    logEvent(analytics, "write_story_clicked", {
      emotion: emotionName,
      user: user.uid
    });

    navigate(`/emotions/${emotionName}/write`, { replace: true });
  };

  const handleMoreOptions = (story) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setDropdownStoryId(dropdownStoryId === story.id ? null : story.id);
  };

  return (
    <div className="container stories">
      <Header title={emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} type="back" />

      <div className="scroll-content">
        <div className="container-inner">
          <Banner
            background={pastelEmotionGradients[emotionName]}
            icon={<img src={emojiMap[emotionName].gif} alt={emotionName} className="banner-emoji" />}
            text={emotionMessages[emotionName]}
          />

          {showToast && (
            <div className="emotion-stories-toast">
              ✅ Your story has been posted!
            </div>
          )}

          {isLoading ? (
            <div className="skeleton-list">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="skeleton-card" />
              ))}
            </div>
          ) : stories.length === 0 ? (
   
          <EmptyState 
          img={<img src={leafIcon} alt="Stories" className="empty-state-icon" />}
          message="No emotional story yet."
          />
          ) : (
            <div className="emotion-stories-list">
              {stories.map((story) => (
                <div key={story.id} style={{ position: "relative" }}>
                  <StoryCard
                    story={story}
                    emojiMap={emojiMap}
                    isLiked={likedStories.includes(story.id)}
                    onLike={() => handleLike(story.id)}
                    onClick={() => navigate(`/emotions/${emotionName}/${story.id}`)}
                    onMore={() => handleMoreOptions(story)}
                    isEdited={story.isEdited} 
                    isClamped={true}
                  />
                  {dropdownStoryId === story.id && (
                    <DropdownMenu
                      ref={dropdownRef}
                      options={
                        story.userId === user?.uid
                          ? [
                              {
                                icon: <EditIcon className="dropdown-icon" />,
                                label: "Edit",
                                onClick: () =>
                                  navigate(`/emotions/${emotionName}/${story.id}/edit`, {
                                    state: { from: `/emotions/${emotionName}` }
                                  })
                              },
                              {
                                icon: <DeleteIcon className="dropdown-icon" />,
                                label: "Delete",
                                onClick: () => {
                                  setDropdownStoryId(null);
                                  setStoryToDelete(story);
                                  setShowDeleteModal(true);
                                }
                              }
                            ]
                          : [
                              {
                                icon: <ReportIcon className="dropdown-icon" />,
                                label: "Report",
                                onClick: () =>
                                  navigate(`/report/story/${story.id}/${story.userId}`, {
                                    state: { from: location.pathname }
                                  })
                              }
                            ]
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingButton 
        text="＋ Write" 
        onClick={handleWrite}
        small
        hasBottomNav={!hideBottomNav}
      />

      {showDeleteModal && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          title="Are you sure you want to delete?"
          description="Once deleted, this cannot be recovered."
          primaryButton={{ label: "Delete", onClick: handleDeleteStory, loading: isDeleting }}
          secondaryButton={{ label: "Cancel", onClick: () => setShowDeleteModal(false) }}
        />
      )}

      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => {
              if (typeof afterLoginAction === "function") {
                afterLoginAction();
                setAfterLoginAction(null);
              }
              setShowLoginModal(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default EmotionStoriesPage;

