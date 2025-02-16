import {
  HandleLoginInputObject,
  HandleMobileLoginInputObject,
  HandleVerifyInputOTPObject,
  MobileLoginResponse,
  MobileOtpResponse,
} from "@/app/types/auth/login";
import {
  HandleRegisterInputObject,
  RegisterResponse,
} from "@/app/types/auth/register";
import { useToast } from "@/hooks/use-toast";
import authClient from "@/lib/supabaseAuth/client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";

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

  const handleSendOTP = async (obj: {
    phone: string;
    setOTPError: Dispatch<SetStateAction<string>>;
    setIsSendingOTP: Dispatch<SetStateAction<boolean>>;
    // Temporary PLEASE REMOVE LATER TO USE CACHING
    setOTPTemporaryClient: Dispatch<SetStateAction<string>>;
  }) => {
    const { phone, setOTPError, setIsSendingOTP, setOTPTemporaryClient } = obj;
    setOTPError("");
    setIsSendingOTP(true);
    try {
      // This endpoint should trigger sending the OTP to the phone.
      const otpResponse: AxiosResponse<MobileOtpResponse> = await axios.post(
        "/api/auth/twilio-otp",
        { phonenumber: phone }
      );

      console.log({ otpResponse });
      // EXPOSING OTP HERE JUT FOR PURPOSES OF DEMO
      const {
        data: { otp, condition, expiryTime, message },
      } = otpResponse;

      if (condition === "failed")
        throw new AxiosError("OTP failed to send, try again");

      setIsSendingOTP(false);
      console.log({ message: "here", otp });
      setOTPTemporaryClient(otp);

      // Optionally, you might not want to expose the OTP to the client
      // Instead, just confirm that the OTP was sent successfully.
    } catch (error) {
      setOTPError(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error
          : "Error sending OTP"
      );
      setIsSendingOTP(false);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (obj: {
    phone: string;
    empname: string;
    empstore: string;
    otp: string;
    // TEMPORARY FOR DEMO PURPOSES REMOVE LATER FOR CACHE
    OTPTemporaryClient: string;
    setOTPError: (msg: string) => void;
    setIsVerifyingOtp: (loading: boolean) => void;
    setOpenOTPDialog: (open: boolean) => void;
    onSuccess: () => void;
  }) => {
    const {
      phone,
      empname,
      empstore,
      otp,
      setOTPError,
      setIsVerifyingOtp,
      setOpenOTPDialog,
      OTPTemporaryClient,
      onSuccess,
    } = obj;
    setOTPError("");
    setIsVerifyingOtp(true);
    // USE BELOW LATER WHEN MOVING TO CACHE
    // try {
    //   // Call your OTP verification endpoint.
    //   // Ideally, your backend verifies the OTP before logging in.
    //   const verifyResponse: AxiosResponse<MobileOtpResponse> = await axios.post(
    //     "/api/auth/verify-otp",
    //     {
    //       phonenumber: phone,
    //       otp, // the OTP entered by the user
    //     }
    //   );
    //   // If OTP is verified, now call the login endpoint.
    //   const loginResponse: AxiosResponse<MobileLoginResponse> =
    //     await axios.post("/api/auth/moblogin", {
    //       empname,
    //       empphone: phone,
    //       storename: empstore,
    //     });
    //   onSuccess(loginResponse.data);
    //   setOpenOTPDialog(false);
    // } catch (error) {
    //   setOTPError(
    //     axios.isAxiosError(error) && error.response
    //       ? error.response.data.error
    //       : "Error verifying OTP"
    //   );
    // } finally {
    //   setIsVerifyingOtp(false);
    // }

    try {
      console.log({ otp, OTPTemporaryClient });
      // TEMPORARY: Directly validating OTP before moving to Redis
      if (otp !== OTPTemporaryClient) {
        setOTPError("Invalid OTP. Please try again.");
        return;
      }

      console.log("OTP verified successfully.");

      // Proceed with employee login
      onSuccess();

      setOpenOTPDialog(false);
    } catch (error) {
      setOTPError("Error verifying OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleEmployeeLogin = async (obj: HandleMobileLoginInputObject) => {
    const { empname, empstore, phone, setError, setIsLoading } = obj;
    setError("");
    setIsLoading(true);

    // we first make an attempt to send the OPT, if things look good we process and create the token
    // NOT IDEAL AT ALL FOR PRODUCTION WILL MOVE TO REDIS
    try {
      const response: AxiosResponse<MobileLoginResponse> = await axios.post(
        "/api/auth/moblogin",
        {
          empname,
          empphone: phone,
          storename: empstore,
        }
      );
      if (response.data.verifiedRedirect) {
        window.location.href = "/pos";
      }
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
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleVerifyOTP,
    handleSendOTP,
    handleEmployeeLogin,
  };
};

export default useAuthServerHook;
