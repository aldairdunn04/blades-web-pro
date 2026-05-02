import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant" 
});

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Blades Barber Studio | Maestría en Precisión | SJL",
  description: "El nivel más alto de barbería en San Juan de Lurigancho. Servicios VIP, diseños artísticos y barbería a domicilio por Eliott Blades.",
  keywords: ["Barbería San Juan de Lurigancho", "Barbero a domicilio Lima", "Eliott Blades Barber", "Mejor corte de cabello SJL", "Barbería VIP"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Blades Barber Studio | Maestría en Precisión",
    description: "Experiencia premium de grooming en SJL por Eliott Blades.",
    url: "https://bladesbarber.pro",
    siteName: "Blades Barber Studio",
    images: [
      {
        url: "/assets/hero.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_PE",
    type: "website",
  },
};

import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";

import ModalRegistry from "@/components/ModalRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": "Blades Barber Studio",
    "image": "https://bladesbarber.pro/assets/hero.png",
    "@id": "https://bladesbarber.pro",
    "url": "https://bladesbarber.pro",
    "telephone": "+51998260189",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jr. El Morro A1-4",
      "addressLocality": "San Juan de Lurigancho",
      "addressRegion": "Lima",
      "postalCode": "15446",
      "addressCountry": "PE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -11.9484875,
      "longitude": -76.9765156
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "21:00"
    }
  };

  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased bg-black text-white selection:bg-primary selection:text-black`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <ModalRegistry />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

