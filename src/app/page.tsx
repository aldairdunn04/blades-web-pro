"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { AuthorityStats } from "@/components/sections/AuthorityStats";
import { DeliveryAdvantage } from "@/components/sections/DeliveryAdvantage";
import { ReputationWall } from "@/components/sections/ReputationWall";
import { MasteryGallery } from "@/components/sections/MasteryGallery";
import { ArtistBio } from "@/components/sections/ArtistBio";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { ContactMap } from "@/components/sections/ContactMap";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { BentoServices } from "@/components/sections/BentoServices";
import { ServicesCatalogOverlay } from "@/components/sections/ServicesCatalogOverlay";
import { Service } from "@/types/services";

export default function Home() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [initialService, setInitialService] = useState<Service | null>(null);

  const handleOpenCatalog = (service?: Service) => {
    setInitialService(service || null);
    setIsCatalogOpen(true);
  };

  const handleCloseCatalog = () => {
    setIsCatalogOpen(false);
    setInitialService(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <FloatingNavbar onOpenBooking={() => handleOpenCatalog()} isHidden={isCatalogOpen} />
      <Hero onOpenBooking={() => handleOpenCatalog()} />
      <AuthorityStats />
      <DeliveryAdvantage />
      <BentoServices onOpenCatalog={handleOpenCatalog} />
      <MasteryGallery />
      <ReputationWall />
      <ArtistBio />
      <ContactMap onOpenBooking={() => handleOpenCatalog()} />
      <ContactFooter />

      <ServicesCatalogOverlay 
        isOpen={isCatalogOpen} 
        onClose={handleCloseCatalog} 
        initialService={initialService}
      />
    </main>
  );
}
