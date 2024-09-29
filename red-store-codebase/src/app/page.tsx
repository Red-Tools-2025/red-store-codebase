import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <div className="text-bold">Hi there</div>
        <Button>Hi ther button here</Button>
      </div>
    </div>
  );
};

export default Home;
