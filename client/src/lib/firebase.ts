import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, serverTimestamp, query, where, limit, deleteDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, signOut, getRedirectResult, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "your-messaging-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase - אבל רק אם אין כבר אפליקציה קיימת
// זה יפתור את בעיית האתחול הכפול
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Check if collections exist, if not create them
export const initializeCollections = async () => {
  console.log("מתחיל ליצור קולקשנים בפיירבייס...");
  
  // ודא שקולקשן משתמשים קיים
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    console.log(`קולקשן users קיים וכולל ${usersSnapshot.size} משתמשים`);
  } catch (error) {
    console.error("שגיאה בבדיקת קולקשן users:", error);
    // אם הקולקשן לא קיים, הוא ייווצר אוטומטית בפעם הראשונה שננסה להוסיף משתמש
  }
  
  // ודא שקולקשן עסקים קיים
  try {
    const businessesRef = collection(db, "businesses");
    const businessesSnapshot = await getDocs(businessesRef);
    
    if (businessesSnapshot.size === 0) {
      // הוסף נתוני דוגמה אם אין עסקים
      await Promise.all([
        setDoc(doc(businessesRef, "coffee"), {
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
        }),
        setDoc(doc(businessesRef, "restaurant"), {
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
        }),
        setDoc(doc(businessesRef, "bakery"), {
          id: "bakery",
          name: "מאפיית השכונה",
          category: "מאפיות",
          description: "מאפייה ותיקה עם מסורת של למעלה מ-30 שנה. מגוון רחב של לחמים, מאפים מתוקים ומלוחים, עוגות ועוגיות, הכל בייצור עצמי וטרי מדי יום.",
          address: "רחוב בוגרשוב 78, תל אביב",
          phone: "03-9876543",
          website: "https://example.com/bakery",
          images: [
            "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562376552-0d160a2f35b6?q=80&w=1000&auto=format&fit=crop"
          ],
          discount: "קנה 5 לחמניות קבל 1 חינם",
          hours: "א'-ו' 06:00-19:00, שבת 07:00-14:00",
          ratings: 4.8,
          reviews: [
            {
              id: "review3",
              userId: "user789",
              userName: "רחל לוי",
              rating: 5,
              text: "הלחם הטוב ביותר בעיר! לא מפספסת אף ביקור כשאני באזור.",
              date: "2023-11-05",
              recommended: true
            }
          ],
          createdAt: serverTimestamp()
        })
      ]);
      console.log("נוספו 3 עסקים לדוגמה");
    }
    
    // בדוק שוב לאחר ההוספה
    const updatedSnapshot = await getDocs(businessesRef);
    console.log(`קולקשן businesses קיים וכולל ${updatedSnapshot.size} עסקים`);
  } catch (error) {
    console.error("שגיאה בבדיקת קולקשן businesses:", error);
  }
  
  // טען לוגו מהאחסון
  try {
    const logoURL = await getLogoURL();
    console.log("Logo URL loaded:", logoURL);
  } catch (error) {
    console.error("שגיאה בטעינת הלוגו:", error);
  }
  
  // ודא שקולקשן המלצות קיים
  try {
    const recommendationsRef = collection(db, "recommendations");
    const recommendationsSnapshot = await getDocs(recommendationsRef);
    console.log(`קולקשן recommendations קיים וכולל ${recommendationsSnapshot.size} המלצות`);
  } catch (error) {
    console.error("שגיאה בבדיקת קולקשן recommendations:", error);
  }
  
  // בדוק שוב משתמשים
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    console.log(`קולקשן users קיים וכולל ${usersSnapshot.size} משתמשים`);
  } catch (error) {
    console.error("שגיאה בבדיקת קולקשן users:", error);
  }
  
  // ודא שקולקשן חיבורים קיים
  try {
    const connectionsRef = collection(db, "connections");
    const connectionsSnapshot = await getDocs(connectionsRef);
    console.log(`קולקשן connections קיים וכולל ${connectionsSnapshot.size} חיבורים`);
  } catch (error) {
    console.error("שגיאה בבדיקת קולקשן connections:", error);
  }
  
  console.log("סיום יצירת קולקשנים!");
};

export const signInWithGoogle = async () => {
  try {
    // נוסיף scopes לגוגל כדי לקבל את המידע הנדרש
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    // הפנה למסך ההתחברות של גוגל
    await signInWithRedirect(auth, googleProvider);
    
    // הטיפול בתוצאה יתבצע בפונקציה handleAuthRedirect
    return null;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    // נוסיף scope לפייסבוק כדי לקבל את המידע הנדרש
    facebookProvider.addScope('email');
    facebookProvider.addScope('public_profile');
    
    // שמור מידע על הניסיון החדש לחיבור פייסבוק
    localStorage.setItem('fbAuthInProgress', 'true');
    localStorage.setItem('fbAuthRedirectUrl', window.location.pathname);
    
    // הפנה למסך ההתחברות של פייסבוק
    await signInWithRedirect(auth, facebookProvider);
    
    // הטיפול בתוצאה יתבצע בפונקציה handleAuthRedirect
    return null;
  } catch (error) {
    console.error("Error signing in with Facebook: ", error);
    // נקה מצב במקרה של שגיאה
    localStorage.removeItem('fbAuthInProgress');
    localStorage.removeItem('fbAuthRedirectUrl');
    throw error;
  }
};

// Handle redirect result when user comes back from authentication provider
export const handleAuthRedirect = async () => {
  try {
    console.log("בודק תוצאות הפניה מספק אימות חיצוני...");
    const result = await getRedirectResult(auth);
    
    if (result) {
      const user = result.user;
      console.log("קיבלתי תוצאת הפניה", user);
      
      // בדוק אם המשתמש קיים ב-Firestore, אם לא צור פרופיל
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log("יוצר פרופיל משתמש חדש...");
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "user",
          coins: 0,
          referrals: 0,
          savedOffers: 0,
          createdAt: serverTimestamp()
        });
        console.log("פרופיל משתמש נוצר בהצלחה!");
      } else {
        console.log("משתמש קיים במערכת, ממשיך לעמוד הבית...");
      }
      
      return user;
    } else {
      console.log("לא התקבלה תוצאת הפניה");
    }
    return null;
  } catch (error) {
    console.error("שגיאה בטיפול בתוצאת ההפניה: ", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    // מנסים ליצור את המשתמש במערכת האימות
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // מעדכנים את שם המשתמש בפרופיל
    await updateProfile(user, { displayName });
    
    // יוצרים מסמך משתמש ב-Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: null,
      role: "user",  // שדה ברירת מחדל - משתמש רגיל
      coins: 0,
      referrals: 0,
      savedOffers: 0,
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Error registering with email: ", error);
    
    // בדיקה לשגיאות ספציפיות
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('כתובת האימייל כבר קיימת במערכת. אנא נסה להתחבר במקום להירשם.');
    }
    
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
    console.log("המשתמש התנתק בהצלחה");
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error("משתמש לא קיים:", userId);
      return null;
    }
  } catch (error) {
    console.error("שגיאה בקבלת נתוני משתמש:", error);
    throw error;
  }
};

export const updateUserCoins = async (userId: string, coinAmount: number) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      coins: increment(coinAmount)
    });
    return true;
  } catch (error) {
    console.error("שגיאה בעדכון מטבעות משתמש:", error);
    throw error;
  }
};

export const getBusinesses = async () => {
  try {
    const businessesSnapshot = await getDocs(collection(db, "businesses"));
    return businessesSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("שגיאה בקבלת רשימת עסקים:", error);
    throw error;
  }
};

export const getBusinessById = async (businessId: string) => {
  try {
    const businessDoc = await getDoc(doc(db, "businesses", businessId));
    if (businessDoc.exists()) {
      return businessDoc.data();
    } else {
      console.error("עסק לא קיים:", businessId);
      return null;
    }
  } catch (error) {
    console.error("שגיאה בקבלת נתוני עסק:", error);
    throw error;
  }
};

export const createRecommendation = async (recommendation: any) => {
  try {
    const recommendationsRef = collection(db, "recommendations");
    const newRecommendationRef = await addDoc(recommendationsRef, {
      ...recommendation,
      createdAt: serverTimestamp()
    });
    
    // עדכן את מסמך העסק עם ההמלצה החדשה
    if (recommendation.businessId) {
      await updateDoc(doc(db, "businesses", recommendation.businessId), {
        recommendations: arrayUnion(newRecommendationRef.id)
      });
    }
    
    return newRecommendationRef.id;
  } catch (error) {
    console.error("שגיאה ביצירת המלצה:", error);
    throw error;
  }
};

export const getRecommendations = async (limitCount = 10) => {
  try {
    const q = query(collection(db, "recommendations"), limit(limitCount));
    const recommendationsSnapshot = await getDocs(q);
    return recommendationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("שגיאה בקבלת רשימת המלצות:", error);
    throw error;
  }
};

export const getUserRecommendations = async (userId: string) => {
  try {
    const q = query(collection(db, "recommendations"), where("creatorId", "==", userId));
    const recommendationsSnapshot = await getDocs(q);
    return recommendationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("שגיאה בקבלת רשימת המלצות של המשתמש:", error);
    throw error;
  }
};

export const saveOffer = async (userId: string, recommendationId: string) => {
  try {
    // שמור את ההצעה אצל המשתמש
    await updateDoc(doc(db, "users", userId), {
      savedOffers: arrayUnion(recommendationId),
      savedOffersCount: increment(1)
    });
    
    // עדכן את מונה השמירות בהמלצה
    await updateDoc(doc(db, "recommendations", recommendationId), {
      savedCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error("שגיאה בשמירת הצעה:", error);
    throw error;
  }
};

export const getSavedOffers = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      console.error("משתמש לא קיים:", userId);
      return [];
    }
    
    const userData = userDoc.data();
    const savedOfferIds = userData.savedOffers || [];
    
    if (savedOfferIds.length === 0) {
      return [];
    }
    
    // קבל את כל ההמלצות ששמרתי
    const savedOffers = await Promise.all(
      savedOfferIds.map(async (id: string) => {
        try {
          const offerDoc = await getDoc(doc(db, "recommendations", id));
          if (offerDoc.exists()) {
            return {
              id: offerDoc.id,
              ...offerDoc.data()
            };
          } else {
            console.warn(`הצעה עם מזהה ${id} לא נמצאה`);
            return null;
          }
        } catch (error) {
          console.error(`שגיאה בקבלת הצעה ${id}:`, error);
          return null;
        }
      })
    );
    
    // החזר רק הצעות תקינות
    return savedOffers.filter(offer => offer !== null);
  } catch (error) {
    console.error("שגיאה בקבלת הצעות שמורות:", error);
    throw error;
  }
};

export const claimOffer = async (offerId: string, referrerId: string) => {
  try {
    // עדכן את המשתמש המפנה - הוסף מטבעות
    await updateUserCoins(referrerId, 10); // נוסיף 10 מטבעות כדוגמה
    
    // עדכן מונה הפניות
    await updateDoc(doc(db, "users", referrerId), {
      referrals: increment(1)
    });
    
    // סמן את ההצעה כנדרשת
    await updateDoc(doc(db, "recommendations", offerId), {
      claimedCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error("שגיאה במימוש הצעה:", error);
    throw error;
  }
};

export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(result.ref);
    return downloadURL;
  } catch (error) {
    console.error("שגיאה בהעלאת תמונה:", error);
    throw error;
  }
};

export const getSiteConfig = async () => {
  try {
    const configDoc = await getDoc(doc(db, "config", "site"));
    if (configDoc.exists()) {
      return configDoc.data();
    } else {
      // צור תצורה ברירת מחדל אם לא קיימת
      const defaultConfig = {
        siteName: "ShareIt",
        logoUrl: "",
        primaryColor: "#1f2937",
        secondaryColor: "#4f46e5",
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, "config", "site"), defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.error("שגיאה בקבלת הגדרות האתר:", error);
    throw error;
  }
};

export const getLogoURL = async () => {
  try {
    const configDoc = await getDoc(doc(db, "config", "site"));
    if (configDoc.exists() && configDoc.data().logoUrl) {
      return configDoc.data().logoUrl;
    } else {
      return "https://firebasestorage.googleapis.com/v0/b/shareit-454f0.firebasestorage.app/o/images%2FLogo3.png?alt=media&token=63561733-5bb8-4dcb-bb88-ecdb29485d59";
    }
  } catch (error) {
    console.error("שגיאה בקבלת לוגו:", error);
    return "https://firebasestorage.googleapis.com/v0/b/shareit-454f0.firebasestorage.app/o/images%2FLogo3.png?alt=media&token=63561733-5bb8-4dcb-bb88-ecdb29485d59";
  }
};