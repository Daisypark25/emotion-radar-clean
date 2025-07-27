import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchAdviceContent = async (emotion) => {
  try {
    const formatEmotion = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const q = query(
      collection(db, "advice_contents"),
      where("emotion", "==", formatEmotion(emotion))
    );
    const querySnapshot = await getDocs(q);

    console.log("📦 querySnapshot.size:", querySnapshot.size);

    const allQuotes = [];
    const allVideos = [];

    querySnapshot.forEach((doc) => {
      console.log("🔍 found doc:", doc.data());
      const data = doc.data();
      if (data.quotes) allQuotes.push(...data.quotes);
      if (data.youtubeVideos) allVideos.push(...data.youtubeVideos);
    });

    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    const randomVideo = allVideos[Math.floor(Math.random() * allVideos.length)];

    return {
      quote: randomQuote, 
      videoUrl: randomVideo,
    };
  } catch (err) {
    console.error("🔥 Error fetching emotion content:", err);
    return null;
  }
};