import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";
import html2canvas from "html2canvas";
import { fetchAdviceContent } from "../../utils/fetchAdviceContent";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { motion } from "framer-motion";
import "./AdvicePage.css";
import Button from "../../components/common/Button";

import giftGif from "../../assets/images/gift.gif";
import greenheartGif from "../../assets/images/greenheart.gif";
import handheartGif from "../../assets/images/handheart.gif";
import loveletterGif from "../../assets/images/loveletter.gif";
import orangeheartGif from "../../assets/images/orangeheart.gif";
import turnheartGif from "../../assets/images/turnheart.gif";
import twoheartGif from "../../assets/images/twoheart.gif";
import yellowheartGif from "../../assets/images/yellowheart.gif";
import oceanheartGif from "../../assets/images/oceanheart.gif";
import purpleheartGif from "../../assets/images/purpleheart.gif";
import pinkheartGif from "../../assets/images/pinkheart.gif";
import starheartGif from "../../assets/images/starheart.gif";

const adviceIcons = [
  giftGif,
  greenheartGif,
  handheartGif,
  loveletterGif,
  orangeheartGif,
  turnheartGif,
  twoheartGif,
  yellowheartGif,
  oceanheartGif,
  purpleheartGif,
  pinkheartGif,
  starheartGif
];

const firebaseConfig = {
  apiKey: "AIzaSyDvQRxUBoGelZWtl82sCEChOhl32is2mp8",
  authDomain: "radar-40056.firebaseapp.com",
  projectId: "radar-40056",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);


const pastelEmotionGradients = {
  Joy: "linear-gradient(135deg, #FFF8C6 0%, #FFD8A8 50%, #E8F8D5 100%)",
  Sad: "linear-gradient(135deg, #DCEEFF 0%, #B8D8F8 50%, #E0F0FF 100%)",
  Anger: "linear-gradient(135deg, #FFE2E2 0%, #FFDACF 50%, #FFD1E3 100%)",
  Fear: "linear-gradient(135deg, #EDE7FA 0%, #C2E5F7 50%, #D9E5FA 100%)",
  Love: "linear-gradient(135deg, #FCE4EC 0%, #FDDCDC 50%, #F8E0F4 100%)",
  Lonely: "linear-gradient(135deg, #E9F0F6 0%, #D7EAF5 50%, #CFE4EE 100%)",
  Anxious: "linear-gradient(135deg, #FFF0F0 0%, #FFE9DC 50%, #F7E6F9 100%)",
  Worried: "linear-gradient(135deg, #FFE9DD 0%, #FFF2D9 50%, #E1F1DC 100%)",
  Calm: "linear-gradient(135deg, #DFF9F2 0%, #D6ECFA 50%, #E6F6D9 100%)",
};


function AdvicePage({ hideBottomNav, setSelectedEmotion }) {
  const location = useLocation();
  const navigate = useNavigate();
   const { emotion, advice: passedAdvice } = location.state || {};

  const [advice, setAdvice] = useState(null);
  const [quote, setQuote] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [icon, setIcon] = useState(null);
  const [isSplitAnimationDone, setIsSplitAnimationDone] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

    useEffect(() => {
    logEvent(analytics, "advice_viewed");
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    if (setSelectedEmotion) setSelectedEmotion(null);
  }, [setSelectedEmotion]);

  useEffect(() => {
  adviceIcons.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}, []);

  useEffect(() => {
    const randomGif = adviceIcons[Math.floor(Math.random() * adviceIcons.length)];
    setIcon(<img src={randomGif} alt="advice icon" className="advice-gif-icon" />);

    const fetchAdviceAndContent = async () => {
      try {
        if (passedAdvice && passedAdvice.title && passedAdvice.description) {
          setAdvice({
            title: passedAdvice.title,
            description: passedAdvice.description,
          });
        } else {
          const emotionKey = emotion.charAt(0).toUpperCase() + emotion.slice(1);
          const snapshot = await getDocs(collection(db, "advices"));
          const matchedDocs = snapshot.docs.filter(doc => doc.id.startsWith(`${emotionKey}_`));
          const allAdvices = matchedDocs.flatMap(doc => doc.data().advices || []);
          const randomAdvice = allAdvices[Math.floor(Math.random() * allAdvices.length)];
          if (randomAdvice && randomAdvice.title_en && randomAdvice.description_en) {
            setAdvice({
              title: randomAdvice.title_en,
              description: randomAdvice.description_en,
            });
          } else {
            setError("No advice found.");
          }
        }

        const content = await fetchAdviceContent(emotion);
        if (content) {
          setQuote(content.quote);
          setVideoUrl(content.videoUrl);
        }
      } catch (e) {
        setError("There was a problem connecting to the server.");
      }
    };

    fetchAdviceAndContent();
  }, [emotion, passedAdvice]);


  const titleWordCount = advice?.title?.split(" ").length || 0;
  const descDelay = 0.2 + titleWordCount * 0.03;
  const safeDescDelay = Math.min(descDelay, 0.5);
  const nextDelay = safeDescDelay;

  return (
    <div className="container advice" ref={containerRef}>
      <div className="scroll-content">
        <div className="container-inner">
          {icon && (
            <motion.div
              className="advice-icon-wrapper"
              animate={{ y: [-3, 2, -3] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            >
              {icon}
            </motion.div>
          )}

          {advice && advice.title && (
            <h2 className={`advice-title ${isSplitAnimationDone ? "shimmer" : ""}`}>
              {advice.title.split(" ").map((word, idx, arr) => (
                <motion.span
                  key={idx}
                  style={{ display: "inline-block", marginRight: "0.25rem" }}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.4 + idx * 0.08,
                    duration: 0.7,
                    ease: "easeInOut",
                  }}
                  onAnimationComplete={() => {
                    if (idx === arr.length - 1) {
                      setIsSplitAnimationDone(true);
                    }
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          )}

          {advice && advice.description && (
            <motion.div
              className="advice-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: descDelay, duration: 0.6, ease: "easeOut" }}
            >
              {advice.description.split("\n").map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))}
            </motion.div>
          )}

          {(videoUrl || quote) && (
            <>
              <motion.hr
                className="advice-divider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: nextDelay, duration: 0.4, ease: "easeOut" }}
              />
              <motion.h3
                className="advice-subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: nextDelay, duration: 0.4 }}
              >
                To help you
              </motion.h3>

              {videoUrl && (
                <motion.div
                  className="video-wrapper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: nextDelay, duration: 0.5 }}
                >
                  <div className="video-container">
                    <iframe
                      src={videoUrl}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="Recommended Video"
                    />
                  </div>
                </motion.div>
              )}

              {quote && (
                <motion.blockquote
                  className="quote-card"
                  style={{ background: pastelEmotionGradients[emotion.charAt(0).toUpperCase() + emotion.slice(1)] }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: nextDelay, duration: 0.5 }}
                >
                  “{quote.text}”
                  <footer>– {quote.author}</footer>
                </motion.blockquote>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`floating-footer-wrapper 
        ${!hideBottomNav ? "has-bottom-nav" : ""} 
        ${isStandalone ? "standalone" : ""}`
      }>
        <div className="fade-overlay"></div>
        <Button
          type="secondary"
          size="lg"
          onClick={() => navigate("/")}
          disabled={error}
        >
          Get more advice
        </Button>
      </div>

      {error && <p className="advice-error-text">{error}</p>}
    </div>
  );
}

export default AdvicePage;