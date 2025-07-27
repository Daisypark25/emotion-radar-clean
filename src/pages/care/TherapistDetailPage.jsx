import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TherapistBasicInfo from '../../components/therapistdetail/TherapistBasicInfo';
import TherapistSummary from '../../components/therapistdetail/TherapistSummary';
import TherapistAbout from '../../components/therapistdetail/TherapistAbout';
import TherapistSpeciality from '../../components/therapistdetail/TherapistSpeciality';
import TherapistConsultingInfo from '../../components/therapistdetail/TherapistConsultingInfo';
import TherapistReviews from '../../components/therapistdetail/TherapistReviews';
import TherapistBooking from '../../components/therapistdetail/TherapistBooking';
import TherapistDetailSkeleton from '../../components/therapistdetail/TherapistDetailSkeleton';
import BackIcon from "../../assets/icons/arrow-left.svg?react";
import heartImage from '../../assets/images/heart.png';
import '../../components/therapistdetail/TherapistDetail.css';

function TherapistDetailPage() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const handleBookClick = (therapist) => {
    navigate(`/care/${therapist.id}/book`);
  };

  useEffect(() => {
    fetch(`https://emotion-radar-backend.onrender.com/api/therapists/${therapistId}`)
      .then((res) => res.json())
      .then((data) => {
        setTherapist(data);
        const img = new Image();
        const imageSrc = data.image && data.image.trim() !== "" ? data.image : heartImage;
        img.src = imageSrc;
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageLoaded(true);
      })
      .catch((err) => console.error('상세 데이터 불러오기 실패:', err))
      .finally(() => setLoading(false));
  }, [therapistId]);

  useEffect(() => {
    fetch(`https://emotion-radar-backend.onrender.com/api/therapists/${therapistId}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('리뷰 불러오기 실패:', err))
      .finally(() => setReviewsLoading(false));
  }, [therapistId]);

  if (loading || !imageLoaded) return <TherapistDetailSkeleton />;
  if (!therapist) return <div>Therapist not found</div>;

  return (
    <div className="container detail">
      <div className="container-inner">
        <div className="page-header">
          <button className="page-header-back" onClick={() => navigate(-1)}>
            <BackIcon style={{ width: "24px", height: "24px" }} />
          </button>
          <h2 className="page-header-title"></h2>
        </div>

        <TherapistBasicInfo {...therapist} />
        <hr />
        <TherapistSummary summary={therapist.summary} />
        <hr />
        <TherapistAbout about={therapist.about} />
        <hr />
        <TherapistSpeciality speciality={therapist.speciality} />
        <hr />
        <TherapistConsultingInfo {...therapist} />
        <hr />
        <TherapistReviews reviews={reviews} loading={reviewsLoading} />
      </div>

      <div className="fixed-booking-bar">
        <TherapistBooking 
            price={therapist.price}
            onBookClick={() => handleBookClick(therapist)} />
      </div>
    </div>
  );
}

export default TherapistDetailPage;