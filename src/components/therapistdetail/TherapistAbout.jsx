import React from 'react';

function TherapistAbout({ about }) {
    return (
      <div className="therapist-about">
        <h3 className="section-title">About</h3>
        <p className="section-description">{about}</p>
      </div>
    );
  }

export default TherapistAbout;