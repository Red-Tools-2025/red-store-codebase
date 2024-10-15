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
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import useLoginServerHook from "@/app/hooks/auth/ServerHooks/useLoginServerHook";
import { HandleRegisterInputObject } from "@/app/types/auth/register";

export const description =
  "A registration form for new users with name, email, password, and phone number.";

interface TestRegisterFormProps {}

const TestRegisterForm: React.FC<TestRegisterFormProps> = ({}) => {
  const router = useRouter();
  const { handleRegister } = useLoginServerHook();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onRegister = () => {
    const registerInput: HandleRegisterInputObject = {
      name,
      email,
      password,
      phone,
      router,
      setError,
      setIsLoading,
    };
    handleRegister(registerInput);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create a new account to access our services.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            id="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            type="tel"
            placeholder="+1234567890"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={onRegister} className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestRegisterForm;
