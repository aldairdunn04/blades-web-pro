"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import AuthModal from "@/components/ui/AuthModal";

export default function ModalRegistry() {
  const { isAuthModalOpen, setAuthModalOpen } = useAuth();

  return (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setAuthModalOpen(false)} 
    />
  );
}
