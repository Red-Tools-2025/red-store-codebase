import TestLoginForm from "@/components/testing/TestLogin";
import TestRegisterForm from "@/components/testing/TestRegister";

const ComponentTestingPage = () => {
  return (
    <div className="p-5">
      <p className="text-bold">Run all components for testing here</p>
      <div className="mt-5 flex items-start gap-10">
        {/* <TestLoginForm /> */}
        <TestRegisterForm />
      </div>
    </div>
  );
};

export default ComponentTestingPage;
