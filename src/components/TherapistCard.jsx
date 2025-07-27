import React from "react";
import { useNavigate } from "react-router-dom";
import heartImage from "../assets/images/heart.png";
import certifiedIcon from "../assets/icons/certified.svg";
import "../styles/TherapistCard.css";
import "../styles/Tag.css";

function TherapistCard({ therapist, onImageLoad, onBookClick }) {
  const navigate = useNavigate();

  const imageSrc =
    therapist.image && typeof therapist.image === "string" && therapist.image.trim() !== ""
      ? therapist.image
      : heartImage;

  return (
    <div
      className="therapist-card fade-in-up"
      onClick={() => navigate(`/care/${therapist.id}`)} // 카드 클릭 → 상세페이지 이동
    >
      <div className="card-header">
        <img
          src={imageSrc}
          alt={therapist.name}
          className="therapist-image"
          onLoad={onImageLoad}
          onError={onImageLoad}
        />
        <div className="therapist-info">
          <div className="therapist-name-row">
            <h2 className="therapist-name">
              {therapist.name}
              {therapist.certified && (
                <img
                  src={certifiedIcon}
                  alt="Certified Badge"
                  className="certified-badge"
                />
              )}
            </h2>
          </div>
          <div className="info-detail-group">
            <p className="therapist-detail">
              {therapist.years}+ years | {therapist.certification}
            </p>
            <div className="therapist-rating">
              <span className="star-icon">⭐</span>
              <span>{therapist.rating}</span>
              <span>({therapist.reviews}+)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tag">
        {therapist.speciality.map((tag, idx) => (
          <span key={idx} className={`tag tag-${tag.toLowerCase()}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <span className="price">
          <strong>${therapist.price}</strong> / hour
        </span>
        <button
          className="book-button"
          onClick={(e) => {
            e.stopPropagation(); // 부모 div 클릭 막기
            onBookClick(therapist); 
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
}

export default TherapistCard;