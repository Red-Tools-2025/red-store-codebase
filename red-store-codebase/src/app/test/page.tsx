"use client";
import TestLoginForm from "@/components/testing/TestLogin";
import TestRegisterForm from "@/components/testing/TestRegister";
import { useState } from "react";

const ComponentTestingPage = () => {
  const [authCompView, setAuthCompView] = useState<boolean>(false);
  return (
    <div className="p-5">
      <p className="text-bold">Run all components for testing here</p>
      <button
        onClick={() => setAuthCompView(!authCompView)}
        className="p-2 border-solid border-2 bg-indigo-100"
      >
        setView {authCompView ? "login" : "register"}
      </button>
      <div className="mt-5 flex items-start gap-10">
        {authCompView === false ? <TestLoginForm /> : <TestRegisterForm />}
      </div>
    </div>
  );
};

export default ComponentTestingPage;
