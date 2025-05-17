import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL
} from "firebase/storage";

// Firebase configuration - to be added as environment variables in production
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// יצירת קולקשנים מיד עם טעינת האפליקציה
(async function initializeCollections() {
  try {
    console.log("מתחיל ליצור קולקשנים בפיירבייס...");
    
    // יצירת קולקשן businesses אם לא קיים
    const businessesRef = collection(db, "businesses");
    const businessesSnapshot = await getDocs(businessesRef);
    
    if (businessesSnapshot.empty) {
      console.log("קולקשן businesses ריק - יוצר עסקי דוגמה");
      
      // עסקי דוגמה
      const sampleBusinesses = [
        {
          id: "coffee",
          name: "קפה טוב",
          category: "בתי קפה",
          description: "בית קפה איכותי עם מבחר עשיר של קפה, מאפים וארוחות בוקר. האווירה נעימה ומתאימה ללימודים, פגישות עבודה או סתם לבלות עם חברים.",
          address: "רחוב הרצל 123, תל אביב",
          phone: "03-1234567",
          website: "https://example.com/coffeegood",
          images: [
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
          ],
          discount: "10% הנחה על כל התפריט",
          hours: "א'-ה' 07:00-22:00, ו' 08:00-16:00, שבת סגור",
          ratings: 4.5,
          reviews: [
            {
              id: "review1",
              userId: "user123",
              userName: "ישראל ישראלי",
              rating: 5,
              text: "קפה מעולה ושירות אדיב. ממליץ בחום!",
              date: "2023-11-15",
              recommended: true
            }
          ],
          createdAt: serverTimestamp()
        },
        {
          id: "restaurant",
          name: "מסעדה טעימה",
          category: "מסעדות",
          description: "מסעדה משפחתית עם מטבח ים תיכוני עשיר וטעים. התפריט כולל מבחר מנות דגים, בשרים וצמחוניות עם חומרי גלם טריים.",
          address: "רחוב אלנבי 45, תל אביב",
          phone: "03-7654321",
          website: "https://example.com/tastyrestaurant",
          images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop"
          ],
          discount: "ארוחת ילדים חינם בימי ראשון",
          hours: "א'-ש' 12:00-23:00",
          ratings: 4.2,
          reviews: [
            {
              id: "review2",
              userId: "user456",
              userName: "חנה כהן",
              rating: 4,
              text: "אוכל מצוין ואווירה נעימה. קצת יקר אבל שווה.",
              date: "2023-10-20",
              recommended: true
            }
          ],
          createdAt: serverTimestamp()
        },
        {
          id: "attire",
          name: "חנות בגדים",
          category: "אופנה",
          description: "חנות אופנה המציעה מגוון רחב של פריטי לבוש לנשים, גברים וילדים. מותגים מקומיים ובינלאומיים במחירים נוחים.",
          address: "קניון עזריאלי, קומה 2, תל אביב",
          phone: "03-9876543",
          website: "https://example.com/fashionstore",
          images: [
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop"
          ],
          discount: "20% הנחה על הפריט השני",
          hours: "א'-ה' 09:30-22:00, ו' 09:00-15:00, שבת: שעה לאחר צאת השבת עד 23:00",
          ratings: 4.0,
          reviews: [
            {
              id: "review3",
              userId: "user789",
              userName: "דני לוי",
              rating: 4,
              text: "שירות אדיב ומבחר גדול. המחירים הוגנים.",
              date: "2023-09-05",
              recommended: true
            }
          ],
          createdAt: serverTimestamp()
        }
      ];
      
      // הוסף את העסקים לדאטהבייס
      for (const business of sampleBusinesses) {
        try {
          console.log(`מנסה ליצור עסק: ${business.name} עם מזהה: ${business.id}`);
          
          // יצירת עסק עם מזהה מוגדר מראש
          await setDoc(doc(db, "businesses", business.id), business);
          
          console.log(`נוצר בהצלחה עסק לדוגמה: ${business.name}`);
        } catch (error) {
          console.error(`שגיאה ביצירת עסק ${business.name}:`, error);
        }
      }
    } else {
      console.log(`קולקשן businesses קיים וכולל ${businessesSnapshot.docs.length} עסקים`);
    }
    
    // יצירת קולקשן recommendations אם לא קיים
    const recommendationsRef = collection(db, "recommendations");
    const recommendationsSnapshot = await getDocs(recommendationsRef);
    
    if (recommendationsSnapshot.empty) {
      console.log("קולקשן recommendations ריק - יוצר המלצות דוגמה");
      
      // המלצות דוגמה
      const sampleRecommendations = [
        {
          id: "rec1",
          businessId: "coffee",
          userId: "demo_user1",
          userName: "ישראל ישראלי",
          userPhotoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
          businessName: "קפה טוב",
          businessImage: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
          text: "המקום הכי טוב לקפה בעיר! השירות אדיב והאווירה נעימה. ממליץ בחום על הקרואסון שוקולד!",
          rating: 5,
          discount: "10% הנחה",
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          savedCount: 12,
          createdAt: serverTimestamp()
        }
      ];
      
      // הוסף את ההמלצות לדאטהבייס
      for (const rec of sampleRecommendations) {
        try {
          console.log(`מנסה ליצור המלצה: ${rec.id}`);
          await setDoc(doc(db, "recommendations", rec.id), rec);
          console.log(`נוצרה בהצלחה המלצה לדוגמה: ${rec.id}`);
        } catch (error) {
          console.error(`שגיאה ביצירת המלצה ${rec.id}:`, error);
        }
      }
    } else {
      console.log(`קולקשן recommendations קיים וכולל ${recommendationsSnapshot.docs.length} המלצות`);
    }
    
    // יצירת קולקשן users אם לא קיים
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    
    if (usersSnapshot.empty) {
      console.log("קולקשן users ריק - יוצר משתמשי דוגמה");
      
      // משתמשי דוגמה
      const sampleUsers = [
        {
          uid: "demo_user1",
          email: "demo@example.com",
          displayName: "ישראל ישראלי",
          photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40",
          coins: 50,
          referrals: 3,
          savedOffers: 5,
          createdAt: serverTimestamp()
        }
      ];
      
      // הוסף את המשתמשים לדאטהבייס
      for (const user of sampleUsers) {
        try {
          console.log(`מנסה ליצור משתמש: ${user.displayName}`);
          await setDoc(doc(db, "users", user.uid), user);
          console.log(`נוצר בהצלחה משתמש לדוגמה: ${user.displayName}`);
        } catch (error) {
          console.error(`שגיאה ביצירת משתמש ${user.displayName}:`, error);
        }
      }
    } else {
      console.log(`קולקשן users קיים וכולל ${usersSnapshot.docs.length} משתמשים`);
    }
    
    console.log("סיום יצירת קולקשנים!");
  } catch (error) {
    console.error("שגיאה ביצירת קולקשנים:", error);
  }
})();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    // שינוי משימוש ב-redirect לשימוש ב-popup לחוויה טובה יותר
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // בדוק אם המשתמש קיים ב-Firestore, אם לא צור פרופיל
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        coins: 0,
        referrals: 0,
        savedOffers: 0,
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create a profile
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        coins: 0,
        referrals: 0,
        savedOffers: 0,
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Facebook: ", error);
    throw error;
  }
};

// Handle redirect result when user comes back from authentication provider
export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      
      // Check if user exists in Firestore, if not create a profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          coins: 0,
          referrals: 0,
          savedOffers: 0,
          createdAt: serverTimestamp()
        });
      }
      
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect result: ", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      coins: 0,
      referrals: 0,
      savedOffers: 0,
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email: ", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Database functions
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data: ", error);
    throw error;
  }
};

export const updateUserCoins = async (userId: string, coinAmount: number) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      coins: coinAmount
    });
  } catch (error) {
    console.error("Error updating user coins: ", error);
    throw error;
  }
};

export const getBusinesses = async () => {
  try {
    const businessesCollection = collection(db, "businesses");
    const businessesSnapshot = await getDocs(businessesCollection);
    return businessesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting businesses: ", error);
    throw error;
  }
};

export const getBusinessById = async (businessId: string) => {
  try {
    // תחילה, נסה לקבל את העסק מה-collection של businesses
    const businessDoc = await getDoc(doc(db, "businesses", businessId));
    
    if (businessDoc.exists()) {
      return { id: businessDoc.id, ...businessDoc.data() };
    }
    
    // אם העסק לא נמצא, נבדוק אם יש לנו עסקים כלשהם ב-collection
    const businessesCollection = collection(db, "businesses");
    const businessesSnapshot = await getDocs(businessesCollection);
    
    if (businessesSnapshot.empty) {
      // אם אין בכלל עסקים, ננסה ליצור כמה עסקי דוגמה לצורכי פיתוח
      await createSampleBusinesses();
      
      // ננסה שוב לקבל את העסק
      const refreshedDoc = await getDoc(doc(db, "businesses", businessId));
      if (refreshedDoc.exists()) {
        return { id: refreshedDoc.id, ...refreshedDoc.data() };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting business by ID: ", error);
    throw error;
  }
};

// פונקציה ליצירת עסקי דוגמה
const createSampleBusinesses = async () => {
  try {
    console.log("מנסה ליצור Collection של עסקי דוגמה בפיירבייס");
    
    // בדוק אם יש כבר עסקים ב-collection
    const businessesCollection = collection(db, "businesses");
    console.log("מנסה לגשת לקולקשן businesses במסד הנתונים", db);
    
    const businessesSnapshot = await getDocs(businessesCollection);
    console.log("תוצאת בדיקת קולקשן businesses:", 
                businessesSnapshot.empty ? "ריק - צריך ליצור עסקי דוגמה" : "כבר קיים - מכיל נתונים");
    
    if (!businessesSnapshot.empty) {
      console.log("Businesses collection already has data, skipping sample creation");
      return;
    }
    
    // עסקי דוגמה
    const sampleBusinesses = [
      {
        id: "coffee",
        name: "קפה טוב",
        category: "בתי קפה",
        description: "בית קפה איכותי עם מבחר עשיר של קפה, מאפים וארוחות בוקר. האווירה נעימה ומתאימה ללימודים, פגישות עבודה או סתם לבלות עם חברים.",
        address: "רחוב הרצל 123, תל אביב",
        phone: "03-1234567",
        website: "https://example.com/coffeegood",
        images: [
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
        ],
        discount: "10% הנחה על כל התפריט",
        hours: "א'-ה' 07:00-22:00, ו' 08:00-16:00, שבת סגור",
        ratings: 4.5,
        reviews: [
          {
            id: "review1",
            userId: "user123",
            userName: "ישראל ישראלי",
            rating: 5,
            text: "קפה מעולה ושירות אדיב. ממליץ בחום!",
            date: "2023-11-15",
            recommended: true
          }
        ],
        createdAt: serverTimestamp()
      },
      {
        id: "restaurant",
        name: "מסעדה טעימה",
        category: "מסעדות",
        description: "מסעדה משפחתית עם מטבח ים תיכוני עשיר וטעים. התפריט כולל מבחר מנות דגים, בשרים וצמחוניות עם חומרי גלם טריים.",
        address: "רחוב אלנבי 45, תל אביב",
        phone: "03-7654321",
        website: "https://example.com/tastyrestaurant",
        images: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop"
        ],
        discount: "ארוחת ילדים חינם בימי ראשון",
        hours: "א'-ש' 12:00-23:00",
        ratings: 4.2,
        reviews: [
          {
            id: "review2",
            userId: "user456",
            userName: "חנה כהן",
            rating: 4,
            text: "אוכל מצוין ואווירה נעימה. קצת יקר אבל שווה.",
            date: "2023-10-20",
            recommended: true
          }
        ],
        createdAt: serverTimestamp()
      },
      {
        id: "attire",
        name: "חנות בגדים",
        category: "אופנה",
        description: "חנות אופנה המציעה מגוון רחב של פריטי לבוש לנשים, גברים וילדים. מותגים מקומיים ובינלאומיים במחירים נוחים.",
        address: "קניון עזריאלי, קומה 2, תל אביב",
        phone: "03-9876543",
        website: "https://example.com/fashionstore",
        images: [
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop"
        ],
        discount: "20% הנחה על הפריט השני",
        hours: "א'-ה' 09:30-22:00, ו' 09:00-15:00, שבת: שעה לאחר צאת השבת עד 23:00",
        ratings: 4.0,
        reviews: [
          {
            id: "review3",
            userId: "user789",
            userName: "דני לוי",
            rating: 4,
            text: "שירות אדיב ומבחר גדול. המחירים הוגנים.",
            date: "2023-09-05",
            recommended: true
          }
        ],
        createdAt: serverTimestamp()
      }
    ];
    
    // הוסף את העסקים לדאטהבייס
    console.log("מתחיל להוסיף עסקי דוגמה לפיירבייס...");
    
    for (const business of sampleBusinesses) {
      try {
        console.log(`מנסה ליצור עסק: ${business.name} עם מזהה: ${business.id}`);
        
        // יצירת עסק עם מזהה מוגדר מראש
        await setDoc(doc(db, "businesses", business.id), {
          ...business
        });
        
        console.log(`נוצר בהצלחה עסק לדוגמה: ${business.name}`);
      } catch (error) {
        console.error(`שגיאה ביצירת עסק ${business.name}:`, error);
      }
    }
    
    console.log("תהליך יצירת עסקי דוגמה הושלם");
  } catch (error) {
    console.error("Error creating sample businesses: ", error);
  }
};

export const createRecommendation = async (recommendation: any) => {
  try {
    const recommendationsCollection = collection(db, "recommendations");
    const docRef = await addDoc(recommendationsCollection, {
      ...recommendation,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating recommendation: ", error);
    throw error;
  }
};

export const getRecommendations = async (limitCount = 10) => {
  try {
    const recommendationsCollection = collection(db, "recommendations");
    const q = query(
      recommendationsCollection, 
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    const recommendationsSnapshot = await getDocs(q);
    
    // עיבוד נתונים להמרת תאריכים מפיירבייס למחרוזות
    return recommendationsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // המרת שדה validUntil מאובייקט Timestamp למחרוזת אם הוא קיים
      if (data.validUntil && typeof data.validUntil === 'object' && 'seconds' in data.validUntil) {
        // המרה לאובייקט Date ואז למחרוזת בפורמט הרצוי
        const date = new Date(data.validUntil.seconds * 1000);
        data.validUntil = date.toLocaleDateString('he-IL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      
      return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error("Error getting recommendations: ", error);
    throw error;
  }
};

export const getUserRecommendations = async (userId: string) => {
  try {
    const recommendationsCollection = collection(db, "recommendations");
    const q = query(
      recommendationsCollection, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const recommendationsSnapshot = await getDocs(q);
    
    // עיבוד נתונים להמרת תאריכים מפיירבייס למחרוזות
    return recommendationsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // המרת שדה validUntil מאובייקט Timestamp למחרוזת אם הוא קיים
      if (data.validUntil && typeof data.validUntil === 'object' && 'seconds' in data.validUntil) {
        // המרה לאובייקט Date ואז למחרוזת בפורמט הרצוי
        const date = new Date(data.validUntil.seconds * 1000);
        data.validUntil = date.toLocaleDateString('he-IL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      
      return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error("Error getting user recommendations: ", error);
    throw error;
  }
};

export const saveOffer = async (userId: string, recommendationId: string) => {
  try {
    const savedOffersCollection = collection(db, "savedOffers");
    await addDoc(savedOffersCollection, {
      userId,
      recommendationId,
      saved: true,
      claimed: false,
      savedAt: serverTimestamp()
    });
    
    // Update user's saved offers count
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        savedOffers: (userData.savedOffers || 0) + 1
      });
    }
  } catch (error) {
    console.error("Error saving offer: ", error);
    throw error;
  }
};

export const getSavedOffers = async (userId: string) => {
  try {
    const savedOffersCollection = collection(db, "savedOffers");
    const q = query(
      savedOffersCollection, 
      where("userId", "==", userId),
      where("saved", "==", true)
    );
    const savedOffersSnapshot = await getDocs(q);
    
    // Get the actual recommendation details for each saved offer
    const savedOffers = savedOffersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
    
    const recommendationsWithDetails = await Promise.all(
      savedOffers.map(async (offer: any) => {
        const recommendationDoc = await getDoc(doc(db, "recommendations", offer.recommendationId));
        if (recommendationDoc.exists()) {
          return {
            ...offer,
            recommendation: { id: recommendationDoc.id, ...recommendationDoc.data() }
          };
        }
        return offer;
      })
    );
    
    return recommendationsWithDetails;
  } catch (error) {
    console.error("Error getting saved offers: ", error);
    throw error;
  }
};

export const claimOffer = async (offerId: string, referrerId: string) => {
  try {
    // Mark offer as claimed
    const offerRef = doc(db, "savedOffers", offerId);
    await updateDoc(offerRef, {
      claimed: true,
      claimedAt: serverTimestamp()
    });
    
    // Add coins to referrer
    const userRef = doc(db, "users", referrerId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        coins: (userData.coins || 0) + 5,
        referrals: (userData.referrals || 0) + 1
      });
    }
  } catch (error) {
    console.error("Error claiming offer: ", error);
    throw error;
  }
};

export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

// Get site configuration
export const getSiteConfig = async () => {
  try {
    const configDoc = await getDoc(doc(db, "siteconfig", "general"));
    if (configDoc.exists()) {
      return configDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting site config: ", error);
    throw error;
  }
};

// Get logo from site configuration
export const getLogoURL = async () => {
  try {
    // נסה מספר נתיבים אפשריים כדי למצוא את הלוגו
    
    // נתיב 1: בתיקיית images של Storage
    try {
      const logo3Ref = ref(storage, "images/Logo3");
      return await getDownloadURL(logo3Ref);
    } catch (storageError) {
      console.log("Logo not found in images/Logo3, trying next path...");
    }
    
    // נתיב 2: בתיקיית siteconfig/images של Storage
    try {
      const logo3Ref = ref(storage, "siteconfig/images/Logo3");
      return await getDownloadURL(logo3Ref);
    } catch (storageError) {
      console.log("Logo not found in siteconfig/images/Logo3, trying next path...");
    }
    
    // נתיב 3: שדה logoUrl בדוקומנט siteconfig/general
    try {
      const configDoc = await getDoc(doc(db, "siteconfig", "general"));
      if (configDoc.exists() && configDoc.data().logoUrl) {
        console.log("Found logo URL in siteconfig/general document");
        return configDoc.data().logoUrl;
      }
    } catch (firestoreError) {
      console.log("Could not access siteconfig/general, trying with capital S...");
    }
    
    // נתיב 4: נסה עם אות גדולה (siteConfig במקום siteconfig)
    try {
      const configDoc = await getDoc(doc(db, "siteConfig", "general"));
      if (configDoc.exists() && configDoc.data().logoUrl) {
        console.log("Found logo URL in siteConfig/general document");
        return configDoc.data().logoUrl;
      }
    } catch (firestoreError) {
      console.log("Could not access siteConfig/general either");
    }
    
    console.log("Could not find logo URL in any location");
    return null;
  } catch (error) {
    console.error("Error getting logo: ", error);
    return null;
  }
};

export { auth, db, storage };
