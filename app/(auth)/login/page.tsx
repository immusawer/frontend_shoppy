// app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "./login";
import { useState } from "react";
import { Toaster, toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setNetworkError(null);
    console.log('Form submitted with data:', data);
    
    try {
      const result = await loginUser(data);
      console.log('Login result:', result);
      
      if (result.success && result.access_token) {
        toast.success('Login successful!', {
          description: 'Welcome back! Redirecting to home...',
          duration: 2000,
        });
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setError("root", {
          type: "manual",
          message: result.message || "Invalid credentials",
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Failed to connect to server",
      });
    }
  };

  return (
    <>
      <Card className="w-[350px] mx-auto mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>
            
            {errors.root && (
              <p className="text-destructive text-sm">{errors.root.message}</p>
            )}
            
            {networkError && (
              <p className="text-destructive text-sm">{networkError}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center mb-0">
              <p className="text-sm text-muted-foreground">Don't have an account?</p>
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/80"
                onClick={() => router.push("/signup")}
              >
                Sign up here
              </Button>
            </div>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/50"
                onClick={() => router.push("/resetPassword")}
              >
                Forget Password?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster richColors position="top-center" />
    </>
  );
}