import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  videoUrl?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setTimeout(() => {
          fetchUserProfile(user.uid);
        }, 0);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await updateProfile(user, { displayName });

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), profile);
    setUserProfile(profile);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { ...userProfile, ...data }, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));

    if (data.displayName) {
      await updateProfile(user, { displayName: data.displayName });
    }
    if (data.photoUrl) {
      await updateProfile(user, { photoURL: data.photoUrl });
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        logout,
        updateUserProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
