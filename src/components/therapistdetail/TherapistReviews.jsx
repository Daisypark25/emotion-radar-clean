import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import '../../components/therapistdetail/TherapistDetail.css';

function TherapistReviews({ reviews }) {
  return (
    <div className="therapist-detail-section">
      <div className="section-title">Review</div>
      {(!Array.isArray(reviews) || reviews.length === 0) ? (
        <div className="section-description">No reviews yet.</div>
      ) : (
        <div className="reviews-container">
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-nickname">{review.nickname || 'Anonymous'}</div>
              <div className="review-header">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < (review.rating || 5) ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <span className="dot">·</span>
                <div className="review-date">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="review-comment">{review.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TherapistReviews;