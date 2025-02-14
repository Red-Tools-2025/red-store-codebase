import {
  HandleLoginInputObject,
  HandleMobileLoginInputObject,
} from "@/app/types/auth/login";
import {
  HandleRegisterInputObject,
  RegisterResponse,
} from "@/app/types/auth/register";
import { useToast } from "@/hooks/use-toast";
import authClient from "@/lib/supabaseAuth/client";

import axios, { AxiosResponse } from "axios";

const useAuthServerHook = () => {
  const { toast } = useToast();

  const handleRegister = async (obj: HandleRegisterInputObject) => {
    const { email, name, password, phone, setError, setIsLoading } = obj;
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

  // const handleLogin = async (obj: HandleLoginInputObject) => {
  //   const { email, password, router, setError, setIsLoading } = obj;
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const response: AxiosResponse<LoginResponse> = await axios.post(
  //       "/api/auth/login",
  //       {
  //         email,
  //         password,
  //       }
  //     );

  //     if (response.status === 200) {
  //       router.push("/dashboard");
  //     }
  //   } catch (error) {
  //     // Improved error handling logic
  //     if (axios.isAxiosError(error)) {
  //       const errorData = await error.response;
  //       setError((errorData?.data as LoginResponseFailure).error);
  //     } else {
  //       console.log("Something went wrong login again");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async (obj: HandleLoginInputObject) => {
    const { email, password, router, setError, setIsLoading } = obj;
    setError("");
    setIsLoading(true);

    try {
      const { data: AuthResponse, error: AuthError } =
        await authClient.auth.signInWithPassword({
          email,
          password,
        });

      if (AuthError) {
        console.error("Supabase sign-in error:", AuthError);

        if (AuthError.code === "email_not_confirmed") {
          setError("Please confirm your email address to log in.");
        } else if (AuthError.message.includes("Invalid email or password")) {
          setError("Invalid email or password");
        } else {
          setError(AuthError.message || "An error occurred during login.");
        }
        return;
      }

      // Login successful
      console.log("Supabase sign-in success:", AuthResponse);

      router.push("/dashboard");
    } catch (error) {
      console.error("General error during login:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeLogin = async (
    obj: HandleMobileLoginInputObject,
    isLoading: boolean
  ) => {
    const { empname, empstore, phone, setError, setIsLoading } = obj;
    setError("");
    setIsLoading(true);
    console.log({ isLoading });
    try {
      const response: AxiosResponse<{}> = await axios.post(
        "/api/auth/moblogin",
        {
          empname,
          empphone: phone,
          storename: empstore,
        }
      );
      console.log({ mobLoginResponse: response });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.error || "An error occured while logging you in"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      console.log({ isLoading });
    }
  };

  return { handleRegister, handleLogin, handleEmployeeLogin };
};

export default useAuthServerHook;
