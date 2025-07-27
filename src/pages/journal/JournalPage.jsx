import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../../components/FloatingButton";
import IconButton from "../../components/common/IconButton";  
import AddHomeIcon from "../../assets/icons/addhome.svg?react";
import "./JournalPage.css";
import joyImg from "../../assets/emotions/joy.png";
import joyGif from "../../assets/emotions/joy.gif";
import sadImg from "../../assets/emotions/sad.png";
import sadGif from "../../assets/emotions/sad.gif";
import angerImg from "../../assets/emotions/anger.png";
import angerGif from "../../assets/emotions/anger.gif";
import fearImg from "../../assets/emotions/fear.png";
import fearGif from "../../assets/emotions/fear.gif";
import loveImg from "../../assets/emotions/love.png";
import loveGif from "../../assets/emotions/love.gif";
import lonelyImg from "../../assets/emotions/lonely.png";
import lonelyGif from "../../assets/emotions/lonely.gif";
import worriedImg from "../../assets/emotions/worried.png";
import worriedGif from "../../assets/emotions/worried.gif";
import calmImg from "../../assets/emotions/calm.png";
import calmGif from "../../assets/emotions/calm.gif";
import anxiousImg from "../../assets/emotions/anxious.png";
import anxiousGif from "../../assets/emotions/anxious.gif";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDvQRxUBoGelZWtl82sCEChOhl32is2mp8",
  authDomain: "radar-40056.firebaseapp.com",
  projectId: "radar-40056",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const emotions = [
  { label: "Joy", image: joyImg, gif: joyGif, color: "#FFD93D", background: "#FFF3B0" },
  { label: "Sad", image: sadImg, gif: sadGif, color: "#90CAF9", background: "#DDEBFA" },
  { label: "Anger", image: angerImg, gif: angerGif, color: "#EF5350", background: "#F8C8C8" },
  { label: "Fear", image: fearImg, gif: fearGif, color: "#9575CD", background: "#E4D8F5" },
  { label: "Love", image: loveImg, gif: loveGif, color: "#F06292", background: "#F8C1D9" },
  { label: "Lonely", image: lonelyImg, gif: lonelyGif, color: "#B0BEC5", background: "#E2E6E9" },
  { label: "Worried", image: worriedImg, gif: worriedGif, color: "#FF8A65", background: "#FFD8C2" },
  { label: "Calm", image: calmImg, gif: calmGif, color: "#4DB6AC", background: "#D0F4F7" },
  { label: "Anxious", image: anxiousImg, gif: anxiousGif, color: "#EF9A9A", background: "#FAD4D4" },
];

function JournalPage({ setSelectedEmotion, hideBottomNav }) {
  const [localEmotion, setLocalEmotion] = useState(null);
  const [journal, setJournal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstEmotionClickedTime, setFirstEmotionClickedTime] = useState(null);

  const [deferredPrompt, setDeferredPrompt] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedEmotion(null);
  }, [setSelectedEmotion]);


  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    logEvent(analytics, "install_prompt_shown", {
      page: "journal"
    });

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);  

    useEffect(() => {
    emotions.forEach(em => {
      const img = new Image();
      img.src = em.gif;
    });
  }, []);


  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });


  const handleInstall = async () => {                          
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

    logEvent(analytics, "install_accepted", {
      accepted: outcome === "accepted",
      page: "journal"
    });
    
      console.log(outcome === "accepted" ? "✅ 설치됨" : "❌ 거절됨");
      setDeferredPrompt(null);
    }
  }; 


  const handleSubmit = async () => {
    if (!localEmotion) {
      setError("Please select an emotion.");
      return;
    }

    setError("");
    setLoading(true);

    await Promise.resolve();

    logEvent(analytics, 'get_advice_clicked', { 
    emotion: localEmotion.label.toLowerCase()
    });

    if (firstEmotionClickedTime) {
      const diff = new Date() - firstEmotionClickedTime;
      logEvent(analytics, 'first_advice_time', { ms_since_first_emotion: diff });
    }

    const trimmedJournal = journal.trim();

    try {
      if (trimmedJournal) {
        logEvent(analytics, 'journal_written', {
        emotion: localEmotion.label.toLowerCase()
        });


        const response = await fetch("https://emotion-radar-backend.onrender.com/generate-gemini-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emotion: localEmotion.label,
            journal: trimmedJournal,
          }),
        });

        const data = await response.json();

        if (data.title && data.description) {
          navigate("/advice", {
            state: {
              emotion: localEmotion.label,
              journal: trimmedJournal,
              advice: {
                title: data.title,
                description: data.description,
              },
            },
          });
        } else {
          setError("Failed to generate advice.");
        }
      } else {
        const emotionKey = localEmotion.label.charAt(0).toUpperCase() + localEmotion.label.slice(1);
        const snapshot = await getDocs(collection(db, "advices"));
        const matchedDocs = snapshot.docs.filter(doc => doc.id.startsWith(`${emotionKey}_`));
        const allAdvices = matchedDocs.flatMap(doc => doc.data().advices || []);
        const randomAdvice = allAdvices[Math.floor(Math.random() * allAdvices.length)];
        const adviceData = randomAdvice && randomAdvice.title_en && randomAdvice.description_en
          ? {
              title: randomAdvice.title_en,
              description: randomAdvice.description_en
            }
          : null;

        navigate("/advice", {
          state: {
            emotion: localEmotion.label.toLowerCase(),
            journal: null,
            advice: adviceData,
          },
        });
      }
    } catch (err) {
      console.error("Error generating advice:", err);
      setError("An error occurred while generating advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container journal">
      <div className="scroll-content">
        <div className="container-inner">
          <div className="journal-date-text-row">
            <h3 className="journal-date-text">{today}</h3>
            {deferredPrompt && (
              <IconButton onClick={handleInstall} ariaLabel="Add to Home" color="#b3b3b3" size="lg">
                <AddHomeIcon />
              </IconButton>
            )}
          </div> 
          <p className={`journal-main-emotion-label ${!localEmotion && error ? "error" : ""}`}>
            How are you feeling today?
          </p>

          <div className="journal-emotion-scroll-wrapper">
            <div className="journal-emotion-list">
              {emotions.map((em) => {
                const isSelected = localEmotion?.label === em.label;
                return (
                  <div
                    key={em.label}
                    className={`journal-emotion-card ${isSelected ? "selected" : ""} ${
                      isSelected && ["Love", "Fear", "Anger", "Calm"].includes(em.label) ? "light-text" : ""
                    }`}
                    onClick={() => {
                      setLocalEmotion(em);
                      setSelectedEmotion({
                        name: em.label.toLowerCase(),
                        color: em.background,
                        image: em.image,
                      });
                      logEvent(analytics, 'emotion_selected', { emotion: em.label.toLowerCase() });

                      if (!firstEmotionClickedTime) {
                        logEvent(analytics, 'first_emotion_selected', { emotion: em.label.toLowerCase() });
                        setFirstEmotionClickedTime(new Date());
                      }
                    }}
                    style={isSelected ? { backgroundColor: em.color } : {}}
                  >
                    <img
                      src={isSelected ? em.gif : em.image}
                      alt={em.label}
                      className="journal-emotion-image"
                    />
                    <p className="journal-emotion-label">{em.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {!localEmotion && error && (
            <p className="journal-error-text">
              {error}
            </p>
          )}

          <textarea
            placeholder="Write your journal (optional)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="journal-input"
          />
        </div>
      </div>

      <FloatingButton
        text="Get advice"
        onClick={handleSubmit}
        loading={loading}
        hasBottomNav={!hideBottomNav}
      />
    </div>
  );
}

export default JournalPage;
