import { useEffect, useState } from "react";
import "./EmotionsPage.css"; 
import { useNavigate } from "react-router-dom";
import joyImg from "../../assets/emotions/joy.png";
import sadImg from "../../assets/emotions/sad.png";
import angerImg from "../../assets/emotions/anger.png";
import fearImg from "../../assets/emotions/fear.png";
import loveImg from "../../assets/emotions/love.png";
import lonelyImg from "../../assets/emotions/lonely.png";
import anxiousImg from "../../assets/emotions/anxious.png";
import calmImg from "../../assets/emotions/calm.png";
import worriedImg from "../../assets/emotions/worried.png";

const emotions = [
  { name: "Joy", label: "stories", image: joyImg },
  { name: "Sad", label: "moments", image: sadImg },
  { name: "Anger", label: "voices", image: angerImg },
  { name: "Fear", label: "fears", image: fearImg },
  { name: "Love", label: "stories", image: loveImg },
  { name: "Lonely", label: "thoughts", image: lonelyImg },
  { name: "Anxious", label: "posts", image: anxiousImg },
  { name: "Worried", label: "notes", image: worriedImg },
  { name: "Calm", label: "moments", image: calmImg },
];

const pastelEmotionColors = {
  Joy: "#FFF8C6",        
  Sad: "#DCEEFF",        
  Anger: "#FFE2E2",     
  Fear: "#EDE7FA",      
  Love: "#FCE4EC",       
  Lonely: "#E9F0F6",    
  Anxious: "#FFF0F0", 
  Worried: "#FFE9DD",   
  Calm: "#DFF9F2",       
};

function EmotionsPage({ setSelectedEmotion }) {
  const [emotionCount, setEmotionCount] = useState({});
  const navigate = useNavigate(); 

  useEffect(() => {
  setSelectedEmotion(null);
}, [setSelectedEmotion]);


  useEffect(() => {
    fetch("https://emotion-radar-backend.onrender.com/api/emotion-counts")
      .then((res) => res.json())
      .then((data) => {
        setEmotionCount(data); 
      })
      .catch((err) => {
        console.error("감정 카운트 불러오기 실패:", err);
      });
  }, []);

  return (
  <div className="container emotions">
    <div className="scroll-content">
      <div className="container-inner">
        <h2 className="page-title">Emotions</h2>
        <p className="page-description">
          Connect with others who feel the same.<br/>
          Your story might bring someone comfort.
        </p>

        <div className="emotions-emotion-list">
          {emotions.map((emotion, index) => (
            <div
              key={emotion.name}
              className="emotions-emotion-item fade-in-up"
              onClick={() => navigate(`/emotions/${emotion.name.toLowerCase()}`)}
              style={{
                backgroundColor: pastelEmotionColors[emotion.name],
                animationDelay: `${index * 0.07}s`
              }}
            >
              <div className="emotions-emotion-left">
                <img
                  src={emotion.image}
                  alt={emotion.name}
                  className="emotions-emotion-icon"
                />
                <span className="emotions-emotion-name">{emotion.name}</span>
              </div>
              <span className="emotions-emotion-count">
                <span className="count-number">
                  {emotionCount[emotion.name.toLowerCase()] || 0}
                </span>{" "}
                {emotion.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default EmotionsPage;