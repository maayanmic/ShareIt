import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect,
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

// Auth functions
export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    await signInWithRedirect(auth, facebookProvider);
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
    return recommendationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    return recommendationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

export { auth, db, storage };
