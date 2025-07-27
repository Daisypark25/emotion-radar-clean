import "./Splash.css";
import joyImg from "../assets/emotions/joy.png";
import sadImg from "../assets/emotions/sad.png";
import angerImg from "../assets/emotions/anger.png";
import fearImg from "../assets/emotions/fear.png";
import loveImg from "../assets/emotions/love.png";
import lonelyImg from "../assets/emotions/lonely.png";
import anxiousImg from "../assets/emotions/anxious.png";
import calmImg from "../assets/emotions/calm.png";

const emotions = [joyImg, sadImg, angerImg, fearImg, loveImg, lonelyImg, anxiousImg, calmImg];


export default function Splash() {
  return (
    <>
      <div
        className="emotion-background"
        style={{
          background: "linear-gradient(135deg, #FFF3B0, #DDEBFA, #F8C8C8, #E4D8F5, #F8C1D9)",
          transition: "background 0.5s ease"
        }}
      />
      
      <div className="container splash">
        <div className="splash-wrapper">
            <div className="emotion-strip">
                {emotions.concat(emotions).map((img, i) => (
                <img 
                    src={img} 
                    key={i} 
                    alt="emotion" 
                    className="emotion-icon"
                    style={{ animationDelay: `${Math.random() * 2}s` }}
                />
                ))}
            </div>
        </div>
      </div>
    </>
  );
}