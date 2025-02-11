"use client";
import { Button } from "@/components/ui/button";
import { SiStarship } from "react-icons/si";
import { IoKeySharp } from "react-icons/io5";

const AccountConfirmedFallBackPage = () => {
  return (
    <div className="h-screen flex items-center justify-center font-inter">
      <div className="flex flex-col items-center">
        <div className="p-5 bg-gradient-to-b from-blue-200 to-white rounded-full">
          <SiStarship className="text-7xl text-blue-700" />
        </div>
        <div className="flex flex-col items-center mt-5">
          <p className="text-3xl font-[600] text-[#101828]">
            {`Wohoo !! Your on board`}
          </p>
          <p className="text-center font-[400] w-[450px] text text-gray-600 mt-2">
            {`Congratulations on creating your account let's go and get you started by signing in`}
          </p>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={() => {
              console.log("hi");
              window.location.href = "/auth/login";
            }}
            variant="secondary"
          >
            <div className="flex items-center gap-1">
              <IoKeySharp />
              <p>Log in</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountConfirmedFallBackPage;
