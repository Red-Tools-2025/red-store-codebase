"use client";
import TestLoginForm from "@/components/testing/TestLogin";
import TestRegisterForm from "@/components/testing/TestRegister";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-screen justify-center items-center">
        {/* <TestLoginForm /> */}
        <TestRegisterForm />
      </div>
    </div>
  );
};

export default Home;
