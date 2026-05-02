export type ServiceCategory = 
  | 'Barbería'
  | 'Barba & Rostro'
  | 'Cuidado Facial'
  | 'Color & Tratamientos'
  | 'VIP Delivery';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: ServiceCategory;
  featured?: boolean;
}
