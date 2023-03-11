import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "./config.js";

const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app);

export default db;
