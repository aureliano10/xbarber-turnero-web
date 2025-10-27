'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Interfaz para los datos del usuario, corregida para usar displayName
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null; // Corregido: de 'name' a 'displayName'
  role: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Si el usuario no tiene documento en Firestore, lo creamos
            const newUser: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Usuario', // Usamos el displayName del proveedor de Auth
              role: 'cliente',
              photoURL: user.photoURL || undefined,
            };
            await setDoc(userRef, newUser);
            setUserData(newUser);
          }
        } catch (error) {
          console.error('Error fetching or creating user data:', error);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
