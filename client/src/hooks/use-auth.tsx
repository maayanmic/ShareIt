import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  auth, 
  signInWithGoogle, 
  signInWithFacebook, 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser,
  getUserData
} from "@/lib/firebase";
import { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthUser extends User {
  coins?: number;
  referrals?: number;
  savedOffers?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithFacebook: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore to append coins, referrals, etc.
        try {
          const userData = await getUserData(firebaseUser.uid);
          const enhancedUser = {
            ...firebaseUser,
            coins: userData?.coins || 0,
            referrals: userData?.referrals || 0,
            savedOffers: userData?.savedOffers || 0,
          };
          setUser(enhancedUser);
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUser(firebaseUser as AuthUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    } catch (error: any) {
      console.error("Login error: ", error);
      let errorMessage = "Failed to log in. Please check your credentials.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      }
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      await registerWithEmail(email, password, displayName);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });
      setLocation("/");
    } catch (error: any) {
      console.error("Registration error: ", error);
      let errorMessage = "Failed to create an account.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      }
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google.",
      });
      setLocation("/");
    } catch (error) {
      console.error("Google login error: ", error);
      toast({
        title: "Login Error",
        description: "Failed to log in with Google.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Facebook.",
      });
      setLocation("/");
    } catch (error) {
      console.error("Facebook login error: ", error);
      toast({
        title: "Login Error",
        description: "Failed to log in with Facebook.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation("/");
    } catch (error) {
      console.error("Logout error: ", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle: handleGoogleLogin,
    loginWithFacebook: handleFacebookLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
