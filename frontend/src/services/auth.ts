import { 
  FacebookAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types/user';

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('publish_to_groups');
facebookProvider.addScope('publish_video');
facebookProvider.addScope('pages_show_list');
facebookProvider.addScope('pages_read_engagement');

export const signInWithFacebook = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;

    // Create or update user in Firestore
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      facebookId: user.providerData[0]?.uid,
      facebookAccessToken: token,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return userData;
  } catch (error) {
    console.error('Facebook sign in error:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
}; 