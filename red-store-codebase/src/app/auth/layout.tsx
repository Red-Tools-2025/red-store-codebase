import { Toaster } from "@/components/ui/toaster";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex items-center">
      <Toaster />
      {/* Main wrapper for both the form and the grey area */}
      <div className="flex w-full h-full rounded-lg overflow-hidden">
        {/* Form Area - Takes full width on mobile and 1/4 on larger screens */}
        <div className="w-full md:w-1/4 p-4 flex flex-col justify-center">
          {children}
        </div>

        {/* Grey Area - Removed on mobile, takes up space only on larger screens */}
        {/* Comment out or remove this div if you want to completely remove the grey area */}
        <div className="hidden md:block w-3/4 bg-gray-200 p-4 m-2 items-center justify-center rounded-2xl">
          {/* You can add any content or leave this space empty */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
