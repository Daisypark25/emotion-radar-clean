import React from 'react';
import heartImage from '../../assets/images/heart.png';
import certifiedIcon from '../../assets/icons/certified.svg';
import starIcon from '../../assets/icons/star.svg';
import '../../components/therapistdetail/TherapistDetail.css';

function TherapistBasicInfo({
  name,
  image,
  certification,
  years,
  rating,
  reviews,
  certified
}) {
  const imageSrc = image && image.trim() !== '' ? image : heartImage;

  return (
    <div className="therapist-basic-info">
      <img
        className="therapist-image"
        src={imageSrc}
        alt={name || "Therapist"}
      />

      <div className="therapist-info">
        <div className="name-row">
          <h2>{name || "Unknown"}</h2>
          {certified && (
            <img
              src={certifiedIcon}
              alt="Certified Badge"
              className="certified-badge"
            />
          )}
        </div>

        <div className="detail-row">
          <span>{years || "0"}+ years</span>
          <span className="dot">•</span>
          <span>{certification || "No Certification"}</span>
        </div>

        <div className="rating-row">
          <img src={starIcon} alt="Star" className="star-icon" />
          <span>{rating || "0.0"}</span>
          <span>({reviews || 0}+)</span>
        </div>
      </div>
    </div>
  );
}

export default TherapistBasicInfo;