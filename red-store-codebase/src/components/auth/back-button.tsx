"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  const isCreateAccountLabel = label === "Need an account? Create One";

  return (
    <Button variant="link" className="font-normal w-full " size="sm" asChild>
      <Link href={href}>
        {isCreateAccountLabel ? (
          <>
           <span className="text-gray-500 font-inter">Need an account?</span> 
            <span className="font-bold ml-1 font-inter underline"> Create One</span>
          </>
        ) : (
          label
        )}
      </Link>
    </Button>
  );
};
