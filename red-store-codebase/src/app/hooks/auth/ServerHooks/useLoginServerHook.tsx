import {
  HandleRegisterInputObject,
  RegisterResponse,
} from "@/app/types/auth/register";
import axios, { AxiosResponse } from "axios";

const useLoginServerHook = () => {
  const handleRegister = async (obj: HandleRegisterInputObject) => {
    const { email, name, password, phone, router, setError, setIsLoading } =
      obj;
    setError("");
    setIsLoading(true);

    try {
      const response: AxiosResponse<RegisterResponse> = await axios.post(
        "/api/register",
        {
          name,
          email,
          password,
          phone,
        }
      );

      console.log(response);

      if (response.status === 201) {
        // Registration successful
        console.log(response.data.message);
        // Redirect to login page or dashboard
        router.push("/dashboard");
      }
      if (response.status === 400) {
        setError(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.error || "An error occurred during registration."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister };
};

export default useLoginServerHook;
