"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronRight, ChevronLeft, Calendar as CalendarIcon, 
  Clock, ShieldCheck, MessageSquare, 
  CheckCircle2, Smartphone, Store, AlertCircle, Sparkles
} from "lucide-react";
import { Service } from "@/types/services";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { CalendarStep } from "./booking/CalendarStep";
import { TimeSlotStep } from "./booking/TimeSlotStep";

interface BookingFlowProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
}

type Step = "preferences" | "auth" | "scheduling" | "payment" | "summary";

// Premium Animation Variants
const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.05
    }
  },
  exit: { 
    x: "100%",
    transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as [number, number, number, number] }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 15 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  },
  exit: { 
    opacity: 0, 
    x: -15,
    transition: { duration: 0.2 }
  }
};

export function BookingFlow({ services, isOpen, onClose }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("preferences");
  const [sensitivity, setSensitivity] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"yape" | "local" | null>(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [hpValue, setHpValue] = useState("");
  const [startTime, setStartTime] = useState(0);
  const { clearCart } = useCart();
  const { user, signInWithGoogle, setAuthModalOpen, loading: isAuthLoading } = useAuth();

  // Scroll to top when step changes
  useEffect(() => {
    const container = document.getElementById("booking-scroll-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [step]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep("preferences");
      setSensitivity(null);
      setComment("");
      setSelectedDate(null);
      setSelectedTime(null);
      setPaymentMethod(null);
      setShowQr(false);
      setBookingError(null);
      setPhone("");
      setOccupiedSlots([]);
      setStartTime(Date.now());
      setHpValue("");
      
      // Intentar auto-llenar el teléfono si existe localmente
      const savedPhone = localStorage.getItem("blades_user_phone");
      if (savedPhone) setPhone(savedPhone);
    }
  }, [isOpen]);

  useEffect(() => {
    async function checkAvailability() {
      if (!selectedDate) {
        setOccupiedSlots([]);
        return;
      }
      
      // Reset selected time when date changes
      setSelectedTime(null);
      
      try {
        setIsCheckingAvailability(true);
        // Formatear la fecha para la API (YYYY-MM-DD local)
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const response = await fetch(`/api/availability?date=${encodeURIComponent(dateStr)}&t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setOccupiedSlots(data.occupied || []);
        } else {
          setOccupiedSlots([]);
        }
      } catch (error) {
        console.error("Failed to check availability:", error);
        setOccupiedSlots([]);
      } finally {
        setIsCheckingAvailability(false);
      }
    }

    checkAvailability();
  }, [selectedDate]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setBookingError(null);

      // --- ESCUDO BLADES PRO MAX ---
      // 1. Honeypot check
      if (hpValue) {
        console.warn("Honeypot trigger detected. Bot blocked.");
        await new Promise(r => setTimeout(r, 2000)); // Simular carga para no dar pistas al bot
        onClose();
        return;
      }

      // 2. Human speed check (min 3 seconds from open to confirm)
      const timeElapsed = (Date.now() - startTime) / 1000;
      if (timeElapsed < 3) {
        console.warn("Interaction too fast. Potential bot.");
        setBookingError("Tu velocidad es asombrosa, pero por favor tómate un segundo para revisar los detalles.");
        setIsSubmitting(false);
        return;
      }
      // -----------------------------
      
      // 3. Persist phone number for future bookings
      if (phone) {
        localStorage.setItem("blades_user_phone", phone);
      }

      // Enviar datos al backend (n8n proxy)
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            name: user?.displayName,
            email: user?.email,
            uid: user?.uid,
            phone: phone // Nuevo: Incluimos el teléfono
          },
          services: services.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration })),
          total: totalPrice,
          duration: totalDuration, // Nuevo: Incluimos duración total
          date: selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null,
          time: selectedTime,
          sensitivity: sensitivity,
          comment: comment,
          paymentMethod: paymentMethod,
          whatsappUrl: generateWhatsAppMessage()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar la reserva");
      }

      // Abrir WhatsApp ocurre via el href del link en el botón, 
      // pero aquí limpiamos el estado del sitio
      setTimeout(() => {
        clearCart();
        onClose();
        setIsSubmitting(false);
      }, 1500);
    } catch (error: any) {
      console.error("Confirm error:", error);
      setBookingError(error.message || "Ocurrió un error inesperado");
      setIsSubmitting(false);
    }
  };

  if (services.length === 0) return null;

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = services.reduce((sum, s) => {
    const minutes = parseInt(s.duration.split(' ')[0]) || 0;
    return sum + minutes;
  }, 0);

  const handleNext = () => {
    if (step === "preferences") {
      setStep("auth");
    }
    else if (step === "auth") setStep("scheduling");
    else if (step === "scheduling") setStep("payment");
    else if (step === "payment") setStep("summary");
  };

  const handleBack = () => {
    if (step === "auth") setStep("preferences");
    else if (step === "scheduling") {
      if (!user) setStep("auth");
      else setStep("preferences");
    }
    else if (step === "payment") setStep("scheduling");
    else if (step === "summary") setStep("payment");
  };

  const generateWhatsAppMessage = () => {
    const dateStr = selectedDate?.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    const sensitivityStr = sensitivity ? "Sí (ver comentarios)" : "No";
    const paymentStr = paymentMethod === "yape" ? "Yape (QR)" : "Pago en el local";
    
    const servicesList = services.map(s => `- ${s.name} (S/ ${s.price})`).join('\n');
    
    const text = `*NUEVA RESERVA - BLADES STUDIO*\n\n` +
      `*Cliente:* ${user?.displayName || "Invitado"}\n` +
      `*Email:* ${user?.email || "N/A"}\n` +
      `*Teléfono:* ${phone || "N/A"}\n\n` +
      `*Servicios:*\n${servicesList}\n\n` +
      `*Total:* S/ ${totalPrice}\n` +
      `*Duración Estimada:* ${totalDuration} min\n` +
      `*Fecha:* ${dateStr}\n` +
      `*Hora:* ${selectedTime}\n\n` +
      `*SENSIBILIDAD:* ${sensitivityStr}\n` +
      `*Comentarios:* ${comment || "Ninguno"}\n\n` +
      `*Método de Pago:* ${paymentStr}\n\n` +
      `*Dirección:* Jr. El Morro A1-4, SJL.\n\n` +
      `_Por favor confirmar disponibilidad._`;

    return `https://wa.me/51998260189?text=${encodeURIComponent(text)}`;
  };

  const steps = ["preferences", "auth", "scheduling", "payment", "summary"] as const;
  const currentStepIdx = steps.indexOf(step);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop with enhanced blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <motion.div 
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg h-full bg-[#080808] border-l border-white/5 flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.5)] will-change-transform"
          >
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/[0.03] bg-white/[0.01]">
              <div className="flex items-center gap-5">
                {step !== "preferences" && (
                  <button 
                    onClick={handleBack} 
                    className="group p-2.5 bg-white/5 hover:bg-primary hover:text-black rounded-full transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h3 className="text-white font-serif text-2xl tracking-tight italic">Reserva tu Cita</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    <p className="text-[9px] text-primary font-black tracking-[0.2em] uppercase">
                      {services.length === 1 ? services[0].name : `${services.length} Servicios Seleccionados`}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Premium Progress Indicator */}
            <div className="relative z-10 px-8 py-4 bg-white/[0.01] flex justify-between items-center border-b border-white/[0.03]">
              {steps.map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-500",
                      currentStepIdx >= idx ? "bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)]" : "bg-white/10"
                    )} 
                  />
                  {idx < steps.length - 1 && (
                    <div className="w-12 h-[1px] mx-2 bg-white/[0.05]">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: currentStepIdx > idx ? "100%" : "0%" }}
                        className="h-full bg-primary/30"
                      />
                    </div>
                  )}
                </div>
              ))}
              <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase ml-4">
                Paso {currentStepIdx + 1} de 5
              </span>
            </div>

            {/* Content */}
            <div id="booking-scroll-container" className="relative z-10 p-8 flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {step === "auth" && (
                  <motion.div 
                    key="step-auth"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-serif text-white italic">Identificación</h4>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Seguridad & Personalización</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-white/60 leading-relaxed italic">
                        "Para brindarte una experiencia premium y asegurar tu cita, por favor inicia sesión y déjanos tu WhatsApp."
                      </p>

                      {user ? (
                        <div className="space-y-4">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-2xl bg-white/[0.02] border border-primary/20 flex items-center gap-4"
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 bg-white/5 flex items-center justify-center">
                               {user.photoURL ? (
                                 <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover" />
                               ) : (
                                 <span className="text-white/50 text-xs font-black">{user.displayName?.charAt(0) || "U"}</span>
                               )}
                            </div>
                            <div>
                              <p className="text-xs font-black text-white uppercase tracking-wider">{user.displayName}</p>
                              <p className="text-[10px] text-white/40">{user.email}</p>
                            </div>
                            <div className="ml-auto">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                          </motion.div>

                          {/* Nuevo: Input de Teléfono */}
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-3"
                          >
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">WhatsApp de Contacto</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Smartphone className="w-4 h-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                              </div>
                              <input 
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+51 999 000 000"
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all placeholder:text-white/10"
                              />
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <button
                            onClick={() => signInWithGoogle()}
                            disabled={isAuthLoading}
                            className="w-full group relative flex items-center justify-center gap-4 py-6 bg-white rounded-2xl transition-all duration-500 overflow-hidden"
                          >
                            {isAuthLoading ? (
                              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                              <>
                                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                                <span className="text-black font-black text-xs uppercase tracking-[0.2em]">Continuar con Google</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setAuthModalOpen(true)}
                            disabled={isAuthLoading}
                            className="w-full py-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white/60 hover:text-white hover:bg-white/[0.05] hover:border-white/20 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                          >
                            Entrar con Email / Registro
                          </button>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] text-primary/60 text-center italic">
                          "Tus datos están protegidos bajo el estándar de Blades Studio."
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === "preferences" && (
                  <motion.div 
                    key="step-1"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-serif text-white italic">Cuidado Especial</h4>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Salud & Bienestar</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-white/60 leading-relaxed italic">
                        "Cada piel es única. Cuéntanos si tienes alguna sensibilidad para usar los productos adecuados."
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: true, label: "Sí, tengo cuidado" },
                          { value: false, label: "No, todo bien" }
                        ].map((opt) => (
                          <button 
                            key={String(opt.value)}
                            onClick={() => setSensitivity(opt.value)}
                            className={cn(
                              "group relative p-5 rounded-2xl border transition-all duration-500 overflow-hidden",
                              sensitivity === opt.value 
                                ? "bg-primary border-primary text-black shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                                : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                            )}
                          >
                            <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em]">
                              {opt.label}
                            </span>
                            {sensitivity === opt.value && (
                              <motion.div 
                                layoutId="glow"
                                className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-white/20" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Comentarios libres</h4>
                      </div>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribe aquí cualquier detalle que debamos saber..."
                        className="w-full h-32 bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.02] transition-all resize-none placeholder:text-white/10"
                      />
                    </div>

                    {/* Honeypot Field - Escudo Blades */}
                    <div className="opacity-0 absolute -z-50 pointer-events-none" aria-hidden="true">
                      <input 
                        type="text" 
                        name="b_studio_verification" 
                        value={hpValue} 
                        onChange={(e) => setHpValue(e.target.value)} 
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                  </motion.div>
                )}

                {step === "scheduling" && (
                  <motion.div 
                    key="step-2"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-12"
                  >
                    <CalendarStep 
                      selectedDate={selectedDate} 
                      onSelectDate={setSelectedDate} 
                      isCheckingAvailability={isCheckingAvailability}
                    />
                    
                    <TimeSlotStep 
                      selectedDate={selectedDate}
                      selectedTime={selectedTime} 
                      onSelectTime={setSelectedTime} 
                      occupiedSlots={occupiedSlots}
                      isCheckingAvailability={isCheckingAvailability}
                    />
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div 
                    key="step-3"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          <Smartphone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-serif text-white italic">Método de Pago</h4>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Transacción Segura</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        {[
                          { id: "yape", icon: Smartphone, title: "Yape / Plin", desc: "Pago rápido vía QR" },
                          { id: "local", icon: Store, title: "Pago en Local", desc: "Efectivo o Tarjeta" }
                        ].map((method) => {
                          const Icon = method.icon;
                          const isSelected = paymentMethod === method.id;
                          return (
                            <button 
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as any)}
                              className={cn(
                                "group relative flex items-center gap-5 p-6 rounded-2xl border transition-all duration-500 text-left overflow-hidden",
                                isSelected 
                                  ? "bg-white/[0.03] border-primary shadow-[0_0_20px_rgba(212,175,55,0.05)]" 
                                  : "bg-white/[0.01] border-white/5 hover:border-white/20"
                              )}
                            >
                              <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                                isSelected ? "bg-primary text-black" : "bg-white/5 text-white/20"
                              )}>
                                <Icon className={cn("w-7 h-7", isSelected && "animate-pulse")} />
                              </div>
                              <div className="flex-1">
                                <h5 className={cn(
                                  "font-black tracking-tight uppercase text-xs mb-1",
                                  isSelected ? "text-primary" : "text-white/60"
                                )}>
                                  {method.title}
                                </h5>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">{method.desc}</p>
                              </div>
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-black" />
                                </motion.div>
                              )}
                              {/* Selection Glow */}
                              {isSelected && (
                                <motion.div 
                                  layoutId="paymentGlow"
                                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {paymentMethod === "yape" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6"
                      >
                        <div className="relative group shrink-0">
                          <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-2xl relative overflow-hidden">
                            {/* QR Placeholder / Iconic representation */}
                            <div className="w-full h-full bg-black/5 rounded-lg flex items-center justify-center border-2 border-dashed border-black/10">
                              <Smartphone className="w-8 h-8 opacity-20 text-black" />
                            </div>
                            
                            {/* Laser Scanner Animation */}
                            <motion.div 
                              animate={{ top: ["0%", "100%", "0%"] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_#D4AF37] z-20"
                            />
                          </div>
                          {/* Floating Badge */}
                          <div className="absolute -top-2 -right-2 bg-primary text-black text-[8px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
                            ESCANEA
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Yape a Eliot Cervantes</p>
                          <p className="text-xl font-serif text-white italic">998 260 189</p>
                          <p className="text-[9px] text-primary/60 font-bold italic leading-tight">
                            "Escanea y asegura tu lugar en la grilla."
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === "summary" && (
                  <motion.div 
                    key="step-4"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-full max-w-[340px] bg-[#0c0c0c] border border-white/5 shadow-2xl overflow-hidden rounded-t-2xl">
                      {/* Ticket Header Decor */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                      
                      {/* Paper Texture Overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                      {/* Content Container */}
                      <div className="relative z-10 p-8 pt-10 space-y-8">
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-serif text-white italic tracking-tighter">Tu Reservación</h4>
                          <p className="text-[9px] font-black text-primary tracking-[0.4em] uppercase">Blades Barber Studio</p>
                        </div>

                        <div className="space-y-5 border-y border-dashed border-white/10 py-8">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Servicios Seleccionados</span>
                            <div className="space-y-2 mt-2">
                              {services.map((s) => (
                                <div key={s.id} className="flex justify-between items-center">
                                  <span className="text-white font-medium text-xs">{s.name}</span>
                                  <span className="text-white/40 text-[10px]">S/ {s.price}</span>
                                </div>
                              ))}
                              <div className="h-px bg-white/5 my-2" />
                              <div className="flex justify-between items-end">
                                <span className="text-white font-serif text-lg italic">Total</span>
                                <span className="text-primary font-black text-sm">S/ {totalPrice}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Fecha</span>
                              <p className="text-white font-bold text-xs">
                                {selectedDate?.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Horario</span>
                              <p className="text-white font-bold text-xs">{selectedTime}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Dirección de Estudio</span>
                            <p className="text-white/60 font-medium text-[10px] leading-relaxed">
                              Jr. El Morro A1-4, San Juan de Lurigancho, Lima.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center pt-2 gap-4">
                          {/* Stamp Effect */}
                          <motion.div 
                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -12 }}
                            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                            className="w-20 h-20 border-2 border-primary/40 rounded-full flex items-center justify-center rotate-[-12deg] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20"
                          >
                            <span className="text-primary font-black text-[10px] uppercase tracking-tighter text-center">
                              MAESTRÍA<br/>BLADES<br/>VERIFICADA
                            </span>
                          </motion.div>

                          {/* Order ID / Unique Code */}
                          <div className="text-center">
                            <p className="text-[7px] text-white/10 uppercase tracking-[0.5em] mb-1">Hash de Confirmación</p>
                            <p className="text-[9px] font-mono text-white/20">#BLD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Jagged Bottom Edge (CSS/SVG Pattern) */}
                      <div className="absolute bottom-0 left-0 w-full h-4 fill-[#080808] rotate-180">
                        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0 0 L5 10 L10 0 L15 10 L20 0 L25 10 L30 0 L35 10 L40 0 L45 10 L50 0 L55 10 L60 0 L65 10 L70 0 L75 10 L80 0 L85 10 L90 0 L95 10 L100 0 V10 H0 Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8 text-center px-4 space-y-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <p className="text-[10px] text-white/40 italic">"Casi listos. Un último paso para el cambio."</p>
                      </div>

                      {bookingError && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                        >
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <p className="text-[10px] text-red-500 font-bold text-left">{bookingError}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="relative z-10 p-8 border-t border-white/[0.03] bg-white/[0.01]">
              {step === "summary" ? (
                <motion.a 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleConfirm}
                  className={cn(
                    "group relative w-full flex items-center justify-center gap-3 py-5 bg-primary text-black font-black text-xs rounded-sm transition-all uppercase tracking-[0.2em] overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]",
                    isSubmitting && "opacity-50 pointer-events-none"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span className="relative z-10">Confirmar Cita</span>
                    </>
                  )}
                </motion.a>
              ) : (
                <button 
                  disabled={
                    (step === "preferences" && sensitivity === null) ||
                    (step === "auth" && (!user || !phone)) ||
                    (step === "scheduling" && (!selectedDate || !selectedTime)) ||
                    (step === "payment" && !paymentMethod)
                  }
                  onClick={handleNext}
                  className="group w-full flex items-center justify-center gap-2 py-5 bg-white text-black font-black text-xs rounded-sm hover:bg-primary disabled:opacity-20 disabled:grayscale transition-all duration-500 uppercase tracking-[0.2em]"
                >
                  <span className="relative z-10">Siguiente Paso</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
              
              <p className="text-[8px] text-white/10 text-center mt-6 uppercase tracking-[0.3em] font-bold">
                Elite Grooming Experience • SJL
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
