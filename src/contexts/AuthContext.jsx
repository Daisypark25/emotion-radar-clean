import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, query, where, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

const adjectives = [
  "happy","tiny","fluffy","sleepy","brave","kind","shiny","sunny","lucky","cozy",
  "bright","soft","gentle","zippy","sparkly","sweet","cheery","peppy","breezy","fancy",
  "whimsical","snappy","dandy","jolly","snug","rosy","quirky","merry","perky","witty",
  "glossy","spunky","jazzy","fuzzy","classy","frosty","spry","sassy","zesty","silky",
  "dusky","flashy","silvery","velvet","misty","wavy","snazzy","lush","graceful","swift",
  "nifty","zany","snickering","cuddly","plucky","feisty","gleaming","sparkling","dazzling","chirpy"
];

const animals = [
  "bunny","panda","fox","kitten","puppy","bear","deer","otter","duck","mouse",
  "lion","tiger","whale","seal","swan","fawn","cub","finch","lamb","pup",
  "hedgehog","mole","gopher","beaver","ferret","weasel","lemur","shark","dolphin","turtle",
  "starling","parrot","crow","sparrow","hawk","owl","crane","robin","wren","lark",
  "bee","ant","butterfly","moth","dragonfly","ladybug","snail","slug","clam","jelly",
  "squid","octopus","urchin","flamingo","penguin","camel","koala","raccoon","skunk","badger",
  "mongoose","capybara","meerkat","wallaby","platypus","ibis","heron","stoat","manatee","walrus"
];

// 랜덤 닉네임 생성
function generateRandomNickname() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 10000);
  return `${adj}${animal}${number}`;
}

// Firestore에서 닉네임 중복 검사
async function generateUniqueNickname() {
  let nickname;
  let exists = true;

  while (exists) {
    nickname = generateRandomNickname();
    const q = query(
      collection(db, "users"),
      where("userNickname", "==", nickname)
    );
    const querySnapshot = await getDocs(q);
    exists = !querySnapshot.empty;
  }

  return nickname;
}

// Firestore에 사용자 없으면 닉네임 생성
async function createUserIfNotExists(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const nickname = await generateUniqueNickname();
    await setDoc(userRef, {
      userNickname: nickname,
      createdAt: new Date()
    });
    console.log("신규 사용자 닉네임 생성:", nickname);
  } else {
    console.log("기존 사용자:", userSnap.data().userNickname);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await createUserIfNotExists(currentUser);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}