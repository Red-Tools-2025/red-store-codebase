"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HandleLoginInputObject } from "@/app/types/auth/login";
import useAuthServerHook from "@/app/hooks/auth/ServerHooks/useAuthServerHook";

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

const TestLoginForm = () => {
  const router = useRouter();
  const { handleLogin } = useAuthServerHook();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = () => {
    const loginInput: HandleLoginInputObject = {
      email,
      password,
      router,
      setError,
      setIsLoading,
    };
    handleLogin(loginInput);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={onLogin} className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestLoginForm;
