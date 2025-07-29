import fs from "fs";
import csv from "csv-parser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  arrayUnion
} from "firebase/firestore";

// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "radar-40056.firebaseapp.com",
  projectId: "radar-40056"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CHUNK_SIZE = 50; // 문서당 최대 조언 수

// ✅ 중복 없이 조언 추가
const addAdviceToDoc = async (docRef, newAdvice) => {
  const snap = await getDoc(docRef);
  const existing = snap.exists() ? snap.data().advices || [] : [];

  const isDuplicate = existing.some(item =>
    item.title_en === newAdvice.title_en &&
    item.description_en === newAdvice.description_en &&
    JSON.stringify(item.keywords_en.sort()) === JSON.stringify(newAdvice.keywords_en.sort())
  );

  if (!isDuplicate) {
    await updateDoc(docRef, {
      advices: arrayUnion(newAdvice)
    });
    console.log(`✅ 추가됨: ${newAdvice.title_en}`);
    return true;
  } else {
    console.log(`🚫 중복으로 건너뜀: ${newAdvice.title_en}`);
    return false;
  }
};

// ✅ 업로드 실행
const uploadData = async () => {
  const grouped = {};

  fs.createReadStream("advices_upload.csv", { encoding: "utf-8" })
    .pipe(csv())
    .on("data", (row) => {
      const {
        emotion,
        title_en, title_ko,
        description_en, description_ko,
        keyword_en, keyword_ko
      } = row;

      const adviceItem = {
        title_en: title_en.trim(),
        description_en: description_en.trim(),
        keywords_en: keyword_en ? keyword_en.split(",").map(k => k.trim()).filter(k => k) : [],
        title_ko: title_ko.trim(),
        description_ko: description_ko.trim(),
        keywords_ko: keyword_ko ? keyword_ko.split(",").map(k => k.trim()).filter(k => k) : []
      };

      const upperEmotion = emotion.trim().charAt(0).toUpperCase() + emotion.trim().slice(1).toLowerCase();
      if (!grouped[upperEmotion]) grouped[upperEmotion] = [];
      grouped[upperEmotion].push(adviceItem);
    })
    .on("end", async () => {
      console.log("📦 CSV 파싱 완료. 업로드 시작!");

      for (const emotion in grouped) {
        const allAdvices = grouped[emotion];

        const snapshot = await getDocs(collection(db, "advices"));
        const docs = snapshot.docs
          .filter(d => d.id.startsWith(`${emotion}_`))
          .sort((a, b) => {
            const n1 = parseInt(a.id.split("_")[1]);
            const n2 = parseInt(b.id.split("_")[1]);
            return n1 - n2;
          });

        // 문서 없으면 첫 문서 생성
        if (docs.length === 0) {
          const firstDoc = doc(db, "advices", `${emotion}_1`);
          await setDoc(firstDoc, {
            emotion: emotion.toLowerCase(),
            advices: []
          });
        }

        let docIndex = 0;

        for (const item of allAdvices) {
          let uploaded = false;

          while (!uploaded) {
            const docId = `${emotion}_${docIndex + 1}`;
            const docRef = doc(db, "advices", docId);
            const snap = await getDoc(docRef);

            if (!snap.exists()) {
              await setDoc(docRef, {
                emotion: emotion.toLowerCase(),
                advices: []
              });
            }

            const currentLength = (snap.data()?.advices || []).length;
            if (currentLength < CHUNK_SIZE) {
              uploaded = await addAdviceToDoc(docRef, item);
            } else {
              docIndex++;
            }
          }
        }
      }

      console.log("🎉 모든 조언 업로드 완료!");
    });
};

uploadData();