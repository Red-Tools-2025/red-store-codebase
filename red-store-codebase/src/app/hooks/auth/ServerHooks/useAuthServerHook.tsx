import { HandleLoginInputObject } from "@/app/types/auth/login";
import {
  HandleRegisterInputObject,
  RegisterResponse,
} from "@/app/types/auth/register";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosResponse } from "axios";
import { signIn } from "next-auth/react";

const useAuthServerHook = () => {
  const { toast } = useToast();

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
        // router.push("/dashboard");
        toast({
          title: "Welcome to Red Store !!",
          description:
            "Your Account has been created, please head over to your email to confirm your sign-up",
          variant: "default",
        });
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

  const handleLogin = async (obj: HandleLoginInputObject) => {
    const { email, password, router, setError, setIsLoading } = obj;
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Login successful
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred during login.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, handleLogin };
};

export default useAuthServerHook;
