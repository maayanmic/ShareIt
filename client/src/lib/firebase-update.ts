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
    console.log(`מנסה להביא נתוני משתמש עבור: ${userId}`);
    
    // נסה להשתמש ב-userId כמזהה המסמך
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      console.log(`מצאתי משתמש ישירות לפי ID: ${userId}`);
      const userData = userSnapshot.data();
      return {
        id: userSnapshot.id,
        ...userData
      };
    }
    
    // אם לא מצאנו, ננסה לחפש משתמש לפי שדה uid
    console.log("מנסה למצוא משתמש לפי uid במקום id...");
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log(`מצאתי משתמש לפי uid: ${userId}`);
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    
    // לא מצאנו - עבור משתמש דמו אפשר להחזיר פרטים סטטיים
    if (userId === "demo_user1") {
      console.log("מחזיר פרטי משתמש דמו קבועים עבור:", userId);
      return {
        id: userId,
        uid: userId,
        displayName: "ישראל ישראלי",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
        email: "demo@example.com",
        coins: 50,
        referrals: 3,
        savedOffers: 5
      };
    }
    
    console.log(`לא נמצא משתמש עבור: ${userId}`);
    return null;
  } catch (error) {
    console.error("שגיאה בהבאת נתוני משתמש:", error);
    return null;
  }
};

// פונקציה להבאת ההמלצות של משתמש ספציפי
export const getUserRecommendations = async (userId: string) => {
  try {
    console.log(`מחפש המלצות עבור משתמש ${userId}`);
    const recommendationsRef = collection(db, "recommendations");
    
    // טען את כל ההמלצות כי יכולים להיות כמה שדות שונים
    const querySnapshot = await getDocs(recommendationsRef);
    
    const recommendations = [];
    
    // סנן את ההמלצות לפי כל שדות הזיהוי האפשריים
    for (const docSnapshot of querySnapshot.docs) {
      const doc = docSnapshot.data();
      
      // בדוק כל סוגי השדות בהם יכול להיות מזהה המשתמש
      if (doc.userId === userId || 
          doc.recommenderId === userId || 
          (doc.creator && doc.creator.id === userId)) {
        recommendations.push({
          id: docSnapshot.id,
          ...doc
        });
      }
    }
    
    console.log(`נמצאו ${recommendations.length} המלצות למשתמש ${userId}`);
    return recommendations;
  } catch (error) {
    console.error("שגיאה בהבאת המלצות משתמש:", error);
    return [];
  }
};