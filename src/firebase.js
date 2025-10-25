// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ إعدادات مشروعك الجديد
const firebaseConfig = {
  apiKey: "AIzaSyB_Kzy8Gjmf8qBQcQFONL5cCgsA2nQjgAc",
  authDomain: "sac-kfupm-final.firebaseapp.com",
  projectId: "sac-kfupm-final",
  storageBucket: "sac-kfupm-final.appspot.com",
  messagingSenderId: "753307964349",
  appId: "1:753307964349:web:ae00cb9d23b2b2f35578d4",
  measurementId: "G-14PXCX85P8"
};

// ✅ منع التهيئة المكرّرة للتطبيق
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ✅ تهيئة Firestore
export const db = getFirestore(app);

// 🚫 تعطيل App Check مؤقتًا أثناء التطوير
// لا تفعليه في النسخة النهائية على الإنترنت
console.warn("⚠️ Firebase App Check is temporarily disabled in development mode.");

// ✅ للتأكد من المشروع المتصل به فعلاً
console.log("🔥 Firebase Project ID:", firebaseConfig.projectId);
