"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

export const Social = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="flex items-center w-full">
        <hr className="border-gray-300 w-full" />
        <span className="px-4 text-gray-500  font-inter text-sm">or</span>
        <hr className="border-gray-300 w-full" />
      </div>
      <Button
        size="lg"
        className="w-full"
        variant="outline" /* onClick={() => {}} */
      >
        <span className=" font-inter "> Sign in with Google</span>{" "}
        <FcGoogle className="h-5 w-5 ml-2  " />
      </Button>
    </div>
  );
};
