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
import { signup } from "./signup";
import { useState } from "react";
import { Toaster, toast } from "sonner";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
  name: z.string().optional(),
  profileImage: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setNetworkError(null);
    
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('name', data.name || '');
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const result = await signup(formData);
      
      if (result.success) {
        toast.success('Account created!', {
          description: 'Your account has been created successfully.',
          duration: 3000,
        });
        
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("root", {
          type: "manual",
          message: result.message || "Registration failed",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Card className="w-[350px] mx-auto mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="text-destructive text-sm">{errors.username.message}</p>
              )}
            </div>

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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                disabled={isSubmitting}
              />
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
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
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">Already have an account?</p>
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/80"
                onClick={() => router.push("/login")}
              >
                Login here
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster richColors position="top-center" />
    </>
  );
}