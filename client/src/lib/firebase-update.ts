import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";

// במקום לאתחל שוב Firebase, נייבא את המופעים שכבר אותחלו מקובץ firebase.ts
import { db, auth } from './firebase';

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
    
    // שאילתא ממוקדת לפי userId בקולקשן recommendations
    const recommendationsRef = collection(db, "recommendations");
    let userRecommendationsQuery = query(recommendationsRef, where("userId", "==", userId));
    let querySnapshot = await getDocs(userRecommendationsQuery);
    
    // אם לא נמצאו המלצות לפי userId, ננסה לפי recommenderId
    if (querySnapshot.empty) {
      console.log("לא נמצאו המלצות לפי userId, מנסה recommenderId");
      userRecommendationsQuery = query(recommendationsRef, where("recommenderId", "==", userId));
      querySnapshot = await getDocs(userRecommendationsQuery);
    }
    
    // אם עדיין לא נמצאו, ננסה לפי creator.id
    if (querySnapshot.empty) {
      console.log("לא נמצאו המלצות לפי recommenderId, מנסה creator.id");
      // טען את כל ההמלצות כדי לסנן לפי creator.id (שדה מקונן)
      const allRecommendationsSnapshot = await getDocs(recommendationsRef);
      
      // סנן ידנית לפי creator.id
      const filteredDocs = allRecommendationsSnapshot.docs.filter(doc => {
        const data = doc.data();
        return data.creator && data.creator.id === userId;
      });
      
      // אם נמצאו המלצות לפי creator.id
      if (filteredDocs.length > 0) {
        console.log(`נמצאו ${filteredDocs.length} המלצות לפי creator.id`);
        
        const recommendations = filteredDocs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return formatRecommendations(recommendations);
      }
    }
    
    // אם נמצאו המלצות באחת השאילתות לפי userId או recommenderId
    if (!querySnapshot.empty) {
      console.log(`נמצאו ${querySnapshot.docs.length} המלצות למשתמש ${userId}`);
      
      const recommendations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return formatRecommendations(recommendations);
    }
    
    // אם לא נמצאו המלצות בכלל למשתמש זה, נבדוק אם יש המלצות בבסיס הנתונים
    const allRecommendationsQuery = query(recommendationsRef, limit(1));
    const checkSnapshot = await getDocs(allRecommendationsQuery);
    
    if (checkSnapshot.empty) {
      console.log("קולקשן recommendations ריק, מחזיר מערך ריק");
      return [];
    } else {
      // יש המלצות בבסיס הנתונים, אבל אין למשתמש זה
      console.log(`יש המלצות בקולקשן, אבל אין למשתמש ${userId}`);
      
      // נחזיר המלצה ראשונה מהמסד נתונים ונעדכן את userId שלה
      // כדי להראות משהו עבור המשתמש (זה זמני)
      const firstRecommendation = checkSnapshot.docs[0];
      const recommendation = {
        id: firstRecommendation.id,
        ...firstRecommendation.data(),
        userId: userId,
        recommenderId: userId
      };
      
      return formatRecommendations([recommendation]);
    }
  } catch (error) {
    console.error("שגיאה בהבאת המלצות משתמש:", error);
    return [];
  }
};

// פונקציית עזר לפורמט ההמלצות - מטפלת בתאריכים ושדות חסרים
function formatRecommendations(recommendations: any[]) {
  return recommendations.map((recommendation: any) => {
    // 1. המרת שדה validUntil מאובייקט Timestamp למחרוזת אם הוא קיים
    if (recommendation.validUntil) {
      if (typeof recommendation.validUntil === 'object' && 'seconds' in recommendation.validUntil) {
        try {
          const date = new Date(recommendation.validUntil.seconds * 1000);
          recommendation.validUntil = date;
        } catch (dateError) {
          console.error("Error converting date:", dateError);
        }
      }
    } else {
      // אם אין תאריך תקף, קבע תאריך עתידי
      recommendation.validUntil = new Date(new Date().setMonth(new Date().getMonth() + 3));
    }
    
    // 2. טיפול בשדות חסרים
    if (!recommendation.businessImage && recommendation.images && recommendation.images.length > 0) {
      recommendation.businessImage = recommendation.images[0];
    }
    
    if (!recommendation.businessName && recommendation.name) {
      recommendation.businessName = recommendation.name;
    }
    
    if (!recommendation.description && recommendation.text) {
      recommendation.description = recommendation.text;
    } else if (!recommendation.description && !recommendation.text) {
      recommendation.description = "המלצה על " + (recommendation.businessName || "עסק זה");
    }
    
    if (!recommendation.rating && recommendation.ratings) {
      recommendation.rating = recommendation.ratings;
    } else if (!recommendation.rating) {
      recommendation.rating = 4.5; // ברירת מחדל
    }
    
    if (!recommendation.savedCount) {
      recommendation.savedCount = Math.floor(Math.random() * 30) + 5; // ברירת מחדל
    }
    
    return recommendation;
  });
}