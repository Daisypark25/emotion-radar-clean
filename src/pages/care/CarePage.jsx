import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./CarePage.css";
import TherapistCard from "../../components/TherapistCard";

function CarePage({ setSelectedEmotion }) {
  const [therapists, setTherapists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleBookClick = (therapist) => {
    navigate(`/care/${therapist.id}/book`); 
  };

    useEffect(() => {
      setSelectedEmotion(null);
    }, [setSelectedEmotion]);

  useEffect(() => {
    fetch("https://emotion-radar-backend.onrender.com/api/therapists")
      .then((res) => res.json())
      .then((data) => setTherapists(data))
      .catch((error) => console.error("데이터 불러오기 실패:", error));
  }, []);

  useEffect(() => {
    if (therapists.length === 0) return;

    let loadedCount = 0;

    therapists.forEach((therapist) => {
      const imageUrl =
        therapist.image && therapist.image.trim() !== "" ? therapist.image : null;

      if (!imageUrl) {
        loadedCount += 1;
        if (loadedCount === therapists.length) {
          setIsLoading(false);
        }
        return;
      }

      const img = new Image();
      img.src = imageUrl;

      img.onload = img.onerror = () => {
        loadedCount += 1;
        if (loadedCount === therapists.length) {
          setIsLoading(false);
        }
      };
    });
  }, [therapists]);

  return (
    <div className="container care">
      <div className="container-inner">
        <h2 className="page-title">Care</h2>
        <p className="page-description">
          Connect with a professional therapist anytime, anywhere when you need support.
        </p>

        <div className="care-therapist-list">
          {isLoading ? (
            <div className="skeleton-list">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="skeleton-card" />
              ))}
            </div>
          ) : (
            therapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onBookClick={() => handleBookClick(therapist)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CarePage;
