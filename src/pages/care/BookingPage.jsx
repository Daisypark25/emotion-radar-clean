import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header"; 

function BookingPage() {
  const { therapistId } = useParams();
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  
  useEffect(() => {
    fetch(`https://emotion-radar-backend.onrender.com/api/therapists/${therapistId}`)
      .then((res) => res.json())
      .then((data) => setTherapist(data))
      .catch((err) => console.error("상담사 정보 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, [therapistId]);

  const handleBooking = () => {
    if (!date || !time) {
      alert("날짜와 시간을 모두 선택해주세요!");
      return;
    }

    console.log("예약 정보:", {
      therapistId,
      date,
      time,
    });

    navigate("/my"); 
  };

  return (
    <div className="container">
      <div className="container-inner">
        <Header title="예약하기" type="close" />
  
        {loading ? (
          <div className="skeleton-card" style={{ height: "120px" }} />
        ) : therapist ? (
          <>
            <p>{therapist.name} 상담사와의 예약</p>
  
            <div>
              <label>날짜 선택:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
  
            <div>
              <label>시간 선택:</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">시간 선택</option>
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
                <option value="16:00">16:00</option>
                <option value="19:00">19:00</option>
              </select>
            </div>
  
            <button onClick={handleBooking}>예약하기</button>
          </>
        ) : (
          <p>Therapist not found</p>
        )}
      </div>
    </div>
  );
}

export default BookingPage;