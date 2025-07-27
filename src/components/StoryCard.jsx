import { useState } from "react";
import "../styles/StoryCard.css";
import dayjs from "dayjs";
import HeartIcon from "../assets/icons/heart.svg?react";
import CommentIcon from "../assets/icons/comment.svg?react";

function StoryCard({
  story,
  emojiMap,
  onLike,
  isLiked,
  onClick,
  onMore,
  showMenu = true,
  showEmoji = true,
  showTitle = true,
  showComments = true,
  clickable = true, 
  isEdited = false, 
  isClamped = false,
}) {
  const [bounce, setBounce] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) onLike(story.id);

    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  return (
    <div
      className={`story-card fade-in-up ${clickable ? "clickable" : ""}`}  
      onClick={onClick}
    >
      <div className="story-top">
        <div className="story-profile">
          {showEmoji && emojiMap && story.emotion && (
            <img
              src={emojiMap[story.emotion]?.static}
              alt="emoji"
              className="story-emoji"
            />
          )}
          <div>
            <div className="story-nickname">{story.userNickname}</div>
              <div className="nickname-time">
                <span className="time">
                  {story.createdAt ? dayjs(story.createdAt.toDate()).fromNow() : ""}
                  {isEdited && <span className="time"> (edited)</span>}
                </span>
              </div>
          </div>
        </div>

        {showMenu && (
          <div
            className="story-menu"
            onClick={(e) => {
              e.stopPropagation();
              if (onMore) onMore(story);
            }}
          >
            •••
          </div>
        )}
      </div>

      <div className="story-body">
        {showTitle && story.title && (
          <h3 className="story-subject">{story.title}</h3>
        )}
        <p className={`story-text ${isClamped ? "clamp" : ""}`}>
          {story.content}
        </p>
      </div>

      <div className="story-footer">
        <div
          className={`story-icon like-icon ${bounce ? "bounce" : ""}`}
          onClick={handleLikeClick}
        >
          <HeartIcon
            style={{
              width: "20px",
              height: "20px",
              color: isLiked ? "#FF517A" : "#A5A5A5",
              transition: "color 0.2s",
            }}
          />
          {story.likes || 0}
        </div>
        {showComments && (
          <div className="story-icon">
            <CommentIcon
              style={{
                width: "20px",
                height: "20px",
                color: "#A5A5A5",
                verticalAlign: "middle"
              }}
            />
            {story.comments || 0}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryCard;