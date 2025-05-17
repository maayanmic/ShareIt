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
    const q = query(recommendationsRef, where("recommenderId", "==", userId));
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
