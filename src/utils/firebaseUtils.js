import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getNickname(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().userNickname;
  } else {
    throw new Error("닉네임을 찾을 수 없습니다.");
  }
}