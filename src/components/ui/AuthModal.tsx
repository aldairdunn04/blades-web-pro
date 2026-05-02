"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, LogIn, ChevronRight, AlertCircle, CheckCircle2, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "login" | "register" | "forgot";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { 
    user,
    signInWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    resetPassword 
  } = useAuth();

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setView("login");
      setError(null);
      setSuccessMsg(null);
      setIsLoading(false);
      setGoogleLoading(false);
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
      });
    }
  }, [isOpen]);

  // Auto-close if user is detected
  useEffect(() => {
    if (user && isOpen && !successMsg) {
      onClose();
    }
  }, [user, isOpen, onClose, successMsg]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleViewChange = (newView: AuthView) => {
    setError(null);
    setSuccessMsg(null);
    setView(newView);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (view === "login") {
        await loginWithEmail(formData.email, formData.password);
        setSuccessMsg("¡Bienvenido de nuevo! Accediendo...");
        setTimeout(onClose, 1500);
      } else if (view === "register") {
        if (!formData.phone || formData.phone.length < 9) {
          throw { code: "custom/invalid-phone", message: "El teléfono es vital para coordinar tu cita." };
        }
        await registerWithEmail(formData.email, formData.password, formData.name, formData.phone);
        setSuccessMsg("¡Bienvenido al Studio! Redirigiendo...");
        setTimeout(onClose, 2000);
      } else if (view === "forgot") {
        await resetPassword(formData.email);
        setSuccessMsg("Instrucciones enviadas. Revisa tu correo.");
        setTimeout(() => setView("login"), 3000);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let friendlyError = err.message || "Error inesperado. Inténtalo de nuevo.";
      
      switch (err.code) {
        case "auth/user-not-found":
          friendlyError = "Este caballero no está registrado.";
          break;
        case "auth/wrong-password":
          friendlyError = "Contraseña incorrecta. Inténtalo de nuevo.";
          break;
        case "auth/email-already-in-use":
          friendlyError = "Este correo ya tiene una cuenta activa.";
          break;
        case "auth/invalid-credential":
          friendlyError = "Credenciales inválidas. Verifica tus datos.";
          break;
        case "custom/invalid-phone":
          friendlyError = err.message;
          break;
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl"
          >
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            
            {/* Header / Tabs */}
            <div className="relative border-b border-white/5 bg-white/[0.02] p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="mt-4 flex flex-col items-center">
                <div className="mb-6 flex gap-1 rounded-full bg-white/5 p-1">
                  <button
                    onClick={() => handleViewChange("login")}
                    className={`relative rounded-full px-6 py-2 text-sm font-medium transition-all ${
                      view === "login" ? "text-black" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {view === "login" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-[#D4AF37]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">Entrar</span>
                  </button>
                  <button
                    onClick={() => handleViewChange("register")}
                    className={`relative rounded-full px-6 py-2 text-sm font-medium transition-all ${
                      view === "register" ? "text-black" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {view === "register" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-[#D4AF37]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">Crear Cuenta</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <h2 className="font-cormorant text-3xl font-bold text-white">
                      {view === "login" && "Bienvenido de Nuevo"}
                      {view === "register" && "Crea tu Cuenta VIP"}
                      {view === "forgot" && "Recuperar Acceso"}
                    </h2>
                    <p className="mt-1 text-sm text-white/40">
                      {view === "login" && "Accede a tu perfil VIP de Blades"}
                      {view === "register" && "Crea tu cuenta en segundos"}
                      {view === "forgot" && "Ingresa tu correo para continuar"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {view === "register" && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="Teléfono móvil"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                      />
                    </div>
                  </>
                )}

                {(view === "login" || view === "register" || view === "forgot") && (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                    />
                  </div>
                )}

                {(view === "login" || view === "register") && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                    />
                  </div>
                )}

                {view === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleViewChange("forgot")}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400"
                  >
                    <AlertCircle size={16} />
                    <p>{error}</p>
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-sm text-green-400"
                  >
                    <CheckCircle2 size={16} />
                    <p>{successMsg}</p>
                  </motion.div>
                )}

                <button
                  disabled={isLoading}
                  className="w-full group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#D4AF37] py-4 font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  ) : (
                    <>
                      <span>
                        {view === "login" ? "Acceder al Studio" : view === "register" ? "Crear mi Cuenta" : "Enviar Enlace"}
                      </span>
                      <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {view !== "forgot" && (
                <>
                  <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5" />
                    </div>
                    <span className="relative bg-[#0A0A0A] px-4 text-xs font-medium uppercase tracking-widest text-white/20">
                      O continuar con
                    </span>
                  </div>

                  <button
                    onClick={async () => {
                      setGoogleLoading(true);
                      setError(null);
                      try {
                        await signInWithGoogle();
                        setSuccessMsg("¡Bienvenido, Caballero! Conectando con tu perfil VIP...");
                        setTimeout(onClose, 2000);
                      } catch (err: any) {
                        setError("No se pudo conectar con Google.");
                      } finally {
                        setGoogleLoading(false);
                      }
                    }}
                    disabled={googleLoading || isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
                  >
                    {googleLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="h-5 w-5"
                      />
                    )}
                    <span>Google</span>
                  </button>
                </>
              )}

              {view === "forgot" && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => handleViewChange("login")}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-[#D4AF37] transition-all mx-auto"
                  >
                    <ArrowLeft size={16} />
                    Volver al inicio de sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
