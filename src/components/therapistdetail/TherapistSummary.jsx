import React from 'react';
import experienceIcon from '../../assets/icons/experience.svg';
import qualificationIcon from '../../assets/icons/qualification.svg';
import '../../components/therapistdetail/TherapistDetail.css';

function TherapistSummary({ summary }) {
  if (!summary || summary.length === 0) return null;

  return (
    <div className="therapist-summary">
      {summary.map((item, idx) => (
        <div key={idx} className="summary-item">
          {/* 아이콘 매칭 (예: category가 experience면 experienceIcon) */}
          {item.category === 'experience' && (
            <img src={experienceIcon} alt="Experience" className="summary-icon" />
          )}
          {item.category === 'qualification' && (
            <img src={qualificationIcon} alt="Qualification" className="summary-icon" />
          )}
          <div>
            <div className="summary-title">{item.title}</div>
            <div className="section-description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TherapistSummary;