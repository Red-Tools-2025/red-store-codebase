import {
  HandleRegisterInputObject,
  RegisterResponse,
} from "@/app/types/auth/register";
import axios, { AxiosResponse } from "axios";

const useAuthServerHook = () => {
  const handleRegister = async (obj: HandleRegisterInputObject) => {
    const { email, name, password, phone, router, setError, setIsLoading } =
      obj;
    setError("");
    setIsLoading(true);

    try {
      // remember to always declare types for any axis calls or server calls, as not doing so leads to production build errors
      const response: AxiosResponse<RegisterResponse> = await axios.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
          phone,
        }
      );

      console.log(response);

      // error handling on UI to always be done with respect to status codes

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

export default useAuthServerHook;
