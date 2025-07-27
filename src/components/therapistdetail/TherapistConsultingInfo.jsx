import React from 'react';

function TherapistConsultingInfo({ method, language, price }) {
  return (
    <div className="therapist-detail-section">
      <div className="section-title">Detail</div>
      <div className="detail-item">
        <div className="detail-label">Method</div>
        <div className="detail-value">{method || 'N/A'}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Language</div>
        <div className="detail-value">{language || 'N/A'}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Price</div>
        <div className="detail-value">${price || 'N/A'} / hour</div>
      </div>
    </div>
  );
}

export default TherapistConsultingInfo;