"use client";

import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./Social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerHeading: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerHeading,
  backButtonLabel,
  backButtonHref,
  showSocial,
  
}: CardWrapperProps) => {
  return (
    <div className="w-full mx-auto  max-w-[400px]">
      {/* Header Section */}
      <div className="mb-6">
        <Header label={headerLabel} heading={headerHeading} />
      </div>

      {/* Form Content */}
      <div>{children}</div>

      {/* Social Section */}
      {showSocial && (
        <div className="mt-4">
          <Social />
        </div>
      )}

      {/* Back Button Section */}
      <div className="mt-6">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </div>
    </div>
  );
};
