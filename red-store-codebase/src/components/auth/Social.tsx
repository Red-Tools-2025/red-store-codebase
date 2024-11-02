"use Client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
export const Social = () => {
  return (
    <div className="w-full flex  gap-x-2">
      <Button size="lg" className="w-full" variant="outline" /* Onclick={() => {}} */>
        <FcGoogle className="h-5 w-5"></FcGoogle>
      </Button>
      <Button size="lg" className="w-full" variant="outline" /* Onclick={() => {}} */>
        <FaGithub className="h-5 w-5"></FaGithub>
      </Button>
    </div>
  );
};
