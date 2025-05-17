import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Use the same Firebase configuration as in firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-messaging-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// פונקציות לעבודה עם משתמשים וחיבורים
export const getUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    const users = [];
    for (const doc of querySnapshot.docs) {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    }
    
    console.log(`נטענו ${users.length} משתמשים מהמערכת`);
    return users;
  } catch (error) {
    console.error("שגיאה בהבאת המשתמשים:", error);
    throw error;
  }
};

export const createConnection = async (userId: string, targetUserId: string) => {
  try {
    // תעד את החיבור בקולקשן connections
    await addDoc(collection(db, "connections"), {
      userId: userId,
      targetUserId: targetUserId,
      createdAt: serverTimestamp()
    });

    // עדכן את שדה connections במשתמש
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const connections = userData.connections || [];
      
      if (!connections.includes(targetUserId)) {
        await updateDoc(userDoc, {
          connections: [...connections, targetUserId]
        });
      }
    }

    return true;
  } catch (error) {
    console.error("שגיאה ביצירת חיבור:", error);
    throw error;
  }
};

export const getUserRating = async (userId: string) => {
  try {
    // הבא את כל ההמלצות של המשתמש
    const recommendationsRef = collection(db, "recommendations");
    const q = query(recommendationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return 0; // אין המלצות, אין דירוג
    }
    
    // חשב את ממוצע הדירוגים
    let totalRating = 0;
    let ratedRecommendations = 0;
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.rating) {
        totalRating += data.rating;
        ratedRecommendations++;
      }
    });
    
    return ratedRecommendations > 0 ? totalRating / ratedRecommendations : 0;
  } catch (error) {
    console.error("שגיאה בקבלת דירוג משתמש:", error);
    return 0;
  }
};

// פונקציה להבאת נתוני משתמש ספציפי
export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      return null;
    }
    
    // בדוק אם המשתמש הנוכחי מחובר למשתמש זה
    const userData = userSnapshot.data();
    
    return {
      id: userSnapshot.id,
      ...userData
    };
  } catch (error) {
    console.error("שגיאה בהבאת נתוני משתמש:", error);
    return null;
  }
};

// פונקציה להבאת ההמלצות של משתמש ספציפי
export const getUserRecommendations = async (userId: string) => {
  try {
    const recommendationsRef = collection(db, "recommendations");
    const q = query(
      recommendationsRef, 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    
    const recommendations = [];
    for (const doc of querySnapshot.docs) {
      recommendations.push({
        id: doc.id,
        ...doc.data()
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("שגיאה בהבאת המלצות משתמש:", error);
    return [];
  }
};