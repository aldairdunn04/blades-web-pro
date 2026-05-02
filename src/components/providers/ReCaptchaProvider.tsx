"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const ReCaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY not found. ReCaptcha is disabled.");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider 
      reCaptchaKey={siteKey}
      language="es"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
