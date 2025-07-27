import fs from "fs";
import csv from "csv-parser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  arrayUnion
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvQRxUBoGelZWtl82sCEChOhl32is2mp8",
    authDomain: "radar-40056.firebaseapp.com",
    projectId: "radar-40056",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 중복 확인 후 문서에 안전하게 추가
const addToDoc = async (docRef, field, newValue) => {
  const snap = await getDoc(docRef);
  const existing = snap.exists() ? snap.data()[field] || [] : [];

  const isDuplicate = field === "quotes"
    ? existing.some(item => item.text === newValue.text && item.author === newValue.author)
    : existing.includes(newValue);

  if (!isDuplicate) {
    await updateDoc(docRef, {
      [field]: arrayUnion(newValue),
    });
    console.log(`✅ 추가됨: ${field} →`, newValue);
    return true;
  } else {
    console.log(`🚫 중복으로 건너뜀`);
    return false;
  }
};

const uploadData = async () => {
  const chunkSize = 50;

  const grouped = {};

  // CSV 읽기
  fs.createReadStream("advice_contents.csv")
    .pipe(csv())
    .on("data", (row) => {
      const { emotion, type, content, author } = row;
      if (!grouped[emotion]) grouped[emotion] = { quote: [], video: [] };

      if (type === "quote" && content && author) {
        grouped[emotion].quote.push({ text: content.trim(), author: author.trim() });
      } else if (type === "video" && content) {
        grouped[emotion].video.push(content.trim());
      }
    })
    .on("end", async () => {
      console.log("📦 CSV 데이터 정리 완료");

      for (const emotion in grouped) {
        const allQuotes = grouped[emotion].quote;
        const allVideos = grouped[emotion].video;

        // Firestore에서 emotion_1, _2, ... 문서 불러오기
        const snapshot = await getDocs(collection(db, "advice_contents"));
        const docs = snapshot.docs
          .filter(d => d.id.startsWith(`${emotion}_`))
          .sort((a, b) => {
            const n1 = parseInt(a.id.split("_")[1]);
            const n2 = parseInt(b.id.split("_")[1]);
            return n1 - n2;
          });

        // 문서가 없으면 첫 문서 생성
        if (docs.length === 0) {
          const firstDoc = doc(db, "advice_contents", `${emotion}_1`);
          await setDoc(firstDoc, {
            emotion,
            quotes: [],
            youtubeVideos: []
          });
          docs.push(await getDoc(firstDoc));
        }

        // quotes와 video 따로 업로드
        for (const [type, items, field] of [
          ["quote", allQuotes, "quotes"],
          ["video", allVideos, "youtubeVideos"]
        ]) {
          let docIndex = 0;
          for (const item of items) {
            let uploaded = false;

            while (!uploaded) {
              const docId = `${emotion}_${docIndex + 1}`;
              const docRef = doc(db, "advice_contents", docId);
              const snap = await getDoc(docRef);
              const data = snap.exists() ? snap.data() : { quotes: [], youtubeVideos: [] };

              const currentLength = (data[field] || []).length;
              if (currentLength < chunkSize) {
                // 문서 공간 있음 → 추가
                await addToDoc(docRef, field, item);
                uploaded = true;
              } else {
                docIndex++;
                // 다음 문서가 없으면 생성
                const nextDocRef = doc(db, "advice_contents", `${emotion}_${docIndex + 1}`);
                const nextSnap = await getDoc(nextDocRef);
                if (!nextSnap.exists()) {
                  await setDoc(nextDocRef, {
                    emotion,
                    quotes: [],
                    youtubeVideos: []
                  });
                }
              }
            }
          }
        }
      }

      console.log("🎉 모든 데이터 업로드 완료!");
    });
};

uploadData();