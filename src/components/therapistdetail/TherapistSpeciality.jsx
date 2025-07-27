import React from "react";
import "../../styles/Tag.css";

function TherapistSpeciality({ speciality }) {
  if (!Array.isArray(speciality) || speciality.length === 0) {
    return null;
  }

  return (
    <div className="therapist-speciality">
      <div className="section-title">Speciality</div> {/* 타이틀 */}
      <div className="tag"> {/* 태그 묶음 */}
        {speciality.map((spec, idx) => (
          <span key={idx} className={`tag tag-${spec.toLowerCase()}`}>
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TherapistSpeciality;