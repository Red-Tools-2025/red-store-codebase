import TestLoginForm from "@/components/testing/TestLogin";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-screen justify-center items-center">
        <TestLoginForm />
      </div>
    </div>
  );
};

export default Home;
