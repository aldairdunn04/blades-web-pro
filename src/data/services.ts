import { Service } from '../types/services';

export const services: Service[] = [
  // BARBERÍA
  {
    id: 'servicio-basico',
    name: 'Servicio Básico',
    description: 'Corte + Cejas + Bebidas y snacks.',
    price: 25,
    duration: '50 min',
    category: 'Barbería',
    featured: true,
  },
  {
    id: 'corte-maestro',
    name: 'Corte de Autor',
    description: 'Asesoría de imagen profunda y corte con técnicas avanzadas de tijera y navaja.',
    price: 28,
    duration: '45 min',
    category: 'Barbería',
  },
  {
    id: 'corte-rapado',
    name: 'Corte Rapado (Buzz Cut)',
    description: 'Acabado uniforme y limpio con máquina. Ideal para un look práctico y definido.',
    price: 20,
    duration: '25 min',
    category: 'Barbería',
  },
  {
    id: 'lavado-capilar',
    name: 'Lavado Capilar Relajante',
    description: 'Masaje capilar con shampoo profesional para revitalizar tu cuero cabelludo.',
    price: 6,
    duration: '10 min',
    category: 'Barbería',
  },

  // BARBA & ROSTRO
  {
    id: 'servicio-premium',
    name: 'Servicio Premium',
    description: 'Corte + lavado + Cejas + Styling y Peinado con productos + Black Mask + Parches para ojeras + Bebidas y snacks.',
    price: 35,
    duration: '90 min',
    category: 'Barba & Rostro',
    featured: true,
  },
  {
    id: 'perfilado-barba',
    name: 'Perfilado de Barba',
    description: 'Definición de líneas con navaja y rebaje de volumen para una barba impecable.',
    price: 13,
    duration: '25 min',
    category: 'Barba & Rostro',
  },
  {
    id: 'afeitado-tradicional',
    name: 'Afeitado Express',
    description: 'Afeitado nítido con navaja y espuma hidratante para un rostro suave.',
    price: 12,
    duration: '15 min',
    category: 'Barba & Rostro',
  },

  // CUIDADO FACIAL
  {
    id: 'servicio-vip',
    name: 'Servicio V.I.P',
    description: 'Todo lo del Premium + Limpieza facial profunda + vaporizador de ozono + Perfilado de barba o afeitado + Cerveza.',
    price: 50,
    duration: '120 min',
    category: 'Cuidado Facial',
    featured: true,
  },
  {
    id: 'limpieza-facial',
    name: 'Limpieza Facial Profunda',
    description: 'Eliminación exhaustiva de impurezas con exfoliación y nutrición dérmica.',
    price: 23,
    duration: '40 min',
    category: 'Cuidado Facial',
  },
  {
    id: 'mascarilla-black',
    name: 'Mascarilla Carbón Activado',
    description: 'Elimina impurezas y puntos negros, dejando tu piel renovada.',
    price: 6,
    duration: '15 min',
    category: 'Cuidado Facial',
  },
  {
    id: 'parches-colageno',
    name: 'Parches de Colágeno',
    description: 'Tratamiento intensivo para ojeras y revitalización de la mirada.',
    price: 5,
    duration: '10 min',
    category: 'Cuidado Facial',
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado de Cejas',
    description: 'Definición natural para enmarcar tu mirada con precisión quirúrgica.',
    price: 5,
    duration: '5 min',
    category: 'Cuidado Facial',
  },

  // COLOR & TRATAMIENTOS
  {
    id: 'colorimetria',
    name: 'Colorimetría Global',
    description: 'Cambio de look total con tintes premium: Platinados, cenizos o colores vibrantes.',
    price: 150,
    duration: '120 min',
    category: 'Color & Tratamientos',
  },
  {
    id: 'camuflaje-canas',
    name: 'Camuflaje de Canas',
    description: 'Tinte de acción rápida para un acabado natural sin efecto teñido.',
    price: 45,
    duration: '45 min',
    category: 'Color & Tratamientos',
  },
  {
    id: 'diseno-freestyle',
    name: 'Diseño Freestyle',
    description: 'Arte en tu corte. Diseños personalizados con navaja desde líneas básicas a complejas.',
    price: 7,
    duration: '15 min',
    category: 'Color & Tratamientos',
  },
  {
    id: 'styling-peinado',
    name: 'Styling & Peinado',
    description: 'Acabado profesional con productos de alta gama para un evento o cita especial.',
    price: 7,
    duration: '15 min',
    category: 'Color & Tratamientos',
  },

  // SERVICIO A DOMICILIO
  {
    id: 'delivery-vip',
    name: 'Servicio Delivery Master',
    description: 'Llevamos la barbería a tu puerta. Experiencia completa en tu ubicación.',
    price: 120,
    duration: '60 min',
    category: 'VIP Delivery',
    featured: true,
  },
];
