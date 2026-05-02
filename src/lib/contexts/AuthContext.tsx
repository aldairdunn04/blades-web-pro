"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, phone: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  triggerOnboarding: (user: User, phone: string, method: string, explicitName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const triggerOnboarding = async (targetUser: User, phone: string, method: string, explicitName?: string) => {
    console.log(`Disparando proceso de onboarding para ${targetUser.email} via ${method}...`);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "onboarding",
          uid: targetUser.uid,
          email: targetUser.email,
          name: explicitName || targetUser.displayName || "Caballero de Blades",
          displayName: explicitName || targetUser.displayName || "Caballero de Blades",
          phone: phone,
          method: method,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del fallo en n8n:", errorData);
        throw new Error(errorData.error || "Error en la respuesta de la API de onboarding");
      }
      console.log("Proceso de onboarding enviado con éxito a n8n.");
    } catch (err) {
      console.error("Fallo crítico en el proceso de onboarding:", err);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Acceso con Google exitoso.");
      
      // Disparar onboarding para Google (puede ser registro o login)
      // Usamos el displayName de Google como name principal
      if (result.user) {
        triggerOnboarding(
          result.user, 
          result.user.phoneNumber || "", 
          "google", 
          result.user.displayName || ""
        ).catch(err => console.error("Onboarding failed (non-blocking):", err));
      }
    } catch (error: any) {
      console.error("Error en el acceso de Google:", error.code, error.message);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string, phone: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Activar onboarding (no bloqueante)
      triggerOnboarding(userCredential.user, phone, "email", name)
        .catch(err => console.error("Onboarding failed (non-blocking):", err));
      
      // Guardar teléfono localmente para el Booking Flow
      localStorage.setItem("blades_user_phone", phone);
      
      console.log("Registro exitoso.");
    } catch (error: any) {
      console.error("Error registering:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const storedPhone = localStorage.getItem("blades_user_phone") || "";
        triggerOnboarding(
          userCredential.user, 
          storedPhone, 
          "email_login", 
          userCredential.user.displayName || ""
        ).catch(err => console.error("Onboarding failed (non-blocking):", err));
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      registerWithEmail,
      loginWithEmail,
      resetPassword,
      logout,
      isAuthModalOpen,
      setAuthModalOpen,
      triggerOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
