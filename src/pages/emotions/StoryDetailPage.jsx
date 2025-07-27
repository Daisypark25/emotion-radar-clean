import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import "./StoryDetailPage.css";
import StoryCard from "../../components/StoryCard";
import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/common/Header";
import Modal from "../../components/modal/Modal";
import LoginModal from "../../components/modal/LoginModal";
import DropdownMenu from "../../components/DropdownMenu";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { increment } from "firebase/firestore";

import joyImg from "../../assets/emotions/joy.png";
import sadImg from "../../assets/emotions/sad.png";
import angerImg from "../../assets/emotions/anger.png";
import fearImg from "../../assets/emotions/fear.png";
import loveImg from "../../assets/emotions/love.png";
import lonelyImg from "../../assets/emotions/lonely.png";
import anxiousImg from "../../assets/emotions/anxious.png";
import calmImg from "../../assets/emotions/calm.png";

import EditIcon from "../../assets/icons/edit.svg?react";
import DeleteIcon from "../../assets/icons/delete.svg?react";
import ReportIcon from "../../assets/icons/report.svg?react";
import leafIcon from "../../assets/images/leaf.png";

const emojiMap = {
  joy: { static: joyImg },
  sad: { static: sadImg },
  anger: { static: angerImg },
  fear: { static: fearImg },
  love: { static: loveImg },
  lonely: { static: lonelyImg },
  anxious: { static: anxiousImg },
  calm: { static: calmImg },
};

function StoryDetailPage({ hideBottomNav }) {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likedComments, setLikedComments] = useState([]);
  const [dropdownCommentId, setDropdownCommentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [afterLoginAction, setAfterLoginAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownCommentId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "communities", storyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setStory(data);
        if (user && data.likedUsers?.includes(user.uid)) {
          setLiked(true);
        }
      }
    };
    fetchStory();
  }, [storyId, user]);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoadingComments(true);
      const q = query(
        collection(db, "comments"),
        where("storyId", "==", storyId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const commentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentList);

      if (user) {
        const likedIds = commentList
          .filter(c => c.likedUsers?.includes(user.uid))
          .map(c => c.id);
        setLikedComments(likedIds);
      }
      setIsLoadingComments(false);
    };
    fetchComments();
  }, [storyId, user]);

  useEffect(() => {
    if (user && typeof afterLoginAction === "function") {
      afterLoginAction();
      setAfterLoginAction(null);
      setShowLoginModal(false);
    }
  }, [user, afterLoginAction]);


  useEffect(() => {
    const handlePopState = () => {
      navigate(`/emotions/${story?.emotion || 'joy'}`, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, story?.emotion]);




  // 🔥 좋아요 (스토리)
  const handleLike = async () => {
    if (!story) return;
    if (!user) {
      setShowLoginModal(true);
      setAfterLoginAction(() => () => handleLike());
      return;
    }

    const storyRef = doc(db, "communities", story.id);
    const currentLikes = story.likes || 0;
    const currentLikedUsers = story.likedUsers || [];
    const isLiked = currentLikedUsers.includes(user.uid);

    try {
      await updateDoc(storyRef, {
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        likedUsers: isLiked
          ? currentLikedUsers.filter(uid => uid !== user.uid)
          : [...currentLikedUsers, user.uid]
      });

      setStory(prev => ({
        ...prev,
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        likedUsers: isLiked
          ? currentLikedUsers.filter(uid => uid !== user.uid)
          : [...currentLikedUsers, user.uid]
      }));
      setLiked(!isLiked);
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  // 🔥 좋아요 (댓글)
  const handleCommentLike = async (commentId) => {
    if (!user) {
      setShowLoginModal(true);
      setAfterLoginAction(() => () => handleCommentLike(commentId));
      return;
    }

    const targetComment = comments.find(c => c.id === commentId);
    const currentLikes = targetComment?.likes || 0;
    const currentLikedUsers = targetComment?.likedUsers || [];
    const isLiked = currentLikedUsers.includes(user.uid);

    const commentRef = doc(db, "comments", commentId);

    try {
      await updateDoc(commentRef, {
        likes: isLiked ? currentLikes - 1 : currentLikes + 1,
        likedUsers: isLiked
          ? currentLikedUsers.filter(uid => uid !== user.uid)
          : [...currentLikedUsers, user.uid]
      });

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likes: isLiked ? currentLikes - 1 : currentLikes + 1,
                likedUsers: isLiked
                  ? currentLikedUsers.filter(uid => uid !== user.uid)
                  : [...currentLikedUsers, user.uid]
              }
            : c
        )
      );

      setLikedComments((prev) =>
        isLiked ? prev.filter(id => id !== commentId) : [...prev, commentId]
      );
    } catch (error) {
      console.error("Failed to update comment like:", error);
    }
  };

  // 🔥 스토리 삭제 (댓글도 함께)
  const handleDeleteStory = async () => {
    if (!story) return;
    setIsDeleting(true);

    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("storyId", "==", story.id)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const deletePromises = commentsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "communities", story.id));

      setShowDeleteModal(false);
      navigate(`/emotions/${story.emotion}`, { replace: true });
    } catch (err) {
      console.error("Failed to delete story & comments:", err);
      alert("Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 🔥 댓글 삭제
  const handleDeleteComment = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, "comments", deleteTarget.id));
      setComments(prev => prev.filter(c => c.id !== deleteTarget.id));
      setShowDeleteModal(false);

      if (comments.length - 1 === 0) {
        // 🔥 comments 필드를 0으로 강제 리셋 (마지막 댓글일 때)
        await updateDoc(doc(db, "communities", storyId), {
          comments: 0
        });
      } else {
        // 🔥 아닐 땐 -1 감소
        await updateDoc(doc(db, "communities", storyId), {
          comments: increment(-1)
        });
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleMoreOptions = (item, type) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setDropdownCommentId(dropdownCommentId === item.id ? null : item.id);
    setDeleteTarget(item);
    setDeleteType(type);
  };

  const handleReplyWrite = () => {
    if (!user) {
      setShowLoginModal(true);
      setAfterLoginAction(() =>
        () => navigate(`/emotions/${story.emotion}/${story.id}/reply`, { replace: true })
      );
      return;
    }
    navigate(`/emotions/${story.emotion}/${story.id}/reply`, { replace: true });
  };

  return (
    <div className="container story-detail">
      <Header title="Story" type="back" />

      <div className="scroll-content">
        <div className="container-inner">
          {!story ? (
            <div className="story-detail-skeleton">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <>
              <div className="story-detail-card" style={{ position: "relative" }}>
                <StoryCard
                  story={story}
                  emojiMap={emojiMap}
                  isLiked={liked}
                  onLike={handleLike}
                  onClick={() => {}}
                  showEmoji={true}
                  showTitle={true}
                  showComments={true}
                  onMore={() => handleMoreOptions(story, 'story')}
                  clickable={false}
                  isEdited={story.isEdited}
                  isClamped={false}
                />
                {dropdownCommentId === story.id && (
                  <DropdownMenu
                    ref={dropdownRef}
                    options={[
                      ...(story.userId === user?.uid
                        ? [
                            { icon: <EditIcon />, label: "Edit", onClick: () => navigate(`/emotions/${story.emotion}/${story.id}/edit`, {
                              state: { from: location.pathname }
                            }) },
                            { icon: <DeleteIcon />, label: "Delete", onClick: () => {
                                setDropdownCommentId(null);
                                setDeleteTarget(story);
                                setDeleteType('story');
                                setShowDeleteModal(true);
                              }}
                          ]
                        : [
                            { icon: <ReportIcon />, label: "Report", onClick: () => navigate(`/report/story/${story.id}/${story.userId}`, {
                              state: { from: location.pathname }
                            }) }
                          ])
                    ]}
                  />
                )}
              </div>

              <div className="replys-list">
                {isLoadingComments ? (
                  <div className="story-detail-skeleton">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="skeleton-card" />
                    ))}
                  </div>
                ) : comments.length === 0 ? (

                  <EmptyState 
                  img={<img src={leafIcon} alt="Story Details" className="empty-state-icon" />}
                  message="No comments yet."
                  />                 
                ) : (
                  Array.from(new Map(comments.map(c => [c.id, c])).values()).map((comment) => (
                    <div key={comment.id} style={{ position: "relative" }}>
                      <StoryCard
                        story={comment}
                        isLiked={likedComments.includes(comment.id)}
                        onLike={() => handleCommentLike(comment.id)}
                        onClick={() => {}}
                        showEmoji={false}
                        showTitle={false}
                        showComments={false}
                        onMore={() => handleMoreOptions(comment, 'comment')}
                        clickable={false}
                        isEdited={comment.isEdited}
                      />
                      {dropdownCommentId === comment.id && (
                        <DropdownMenu
                          ref={dropdownRef}
                          options={[
                            ...(comment.userId === user?.uid
                              ? [
                                  { icon: <EditIcon />, label: "Edit", onClick: () => navigate(`/emotions/${story.emotion}/${story.id}/comments/${comment.id}/edit`, {
                                    state: { from: location.pathname }
                                  }) },
                                  { icon: <DeleteIcon />, label: "Delete", onClick: () => {
                                      setDropdownCommentId(null);
                                      setDeleteTarget(comment);
                                      setDeleteType('comment');
                                      setShowDeleteModal(true);
                                    }}
                                ]
                              : [
                                  { icon: <ReportIcon />, label: "Report", onClick: () => navigate(`/report/comment/${story.id}/${comment.id}/${comment.userId}`, {
                                    state: { from: location.pathname }
                                  }) }
                                ])
                          ]}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <FloatingButton
        text="Write a comment"
        onClick={handleReplyWrite}
        variant="input"
        hasBottomNav={!hideBottomNav}
        textColor="#999"
      />

      {showDeleteModal && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          title="Are you sure you want to delete?"
          description="Once deleted, this cannot be recovered."
          primaryButton={{
            label: "Delete",
            onClick: deleteType === 'story' ? handleDeleteStory : handleDeleteComment,
            loading: isDeleting
          }}
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

export default StoryDetailPage;



