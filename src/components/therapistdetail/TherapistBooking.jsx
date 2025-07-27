import React from 'react';

function TherapistBooking({ price, onBookClick }) {
  return (
    <div className="therapist-booking">
      <p>
        <span className="price-value">{price}</span> / hour
      </p>
      <button onClick={onBookClick}>Book Now</button>
    </div>
  );
}

export default TherapistBooking;