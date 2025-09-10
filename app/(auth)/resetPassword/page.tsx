"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { requestPasswordReset } from "./resetPassword";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof loginSchema>;

export default function ResetPage() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setNetworkError(null);
    console.log('Form submitted with data:', data);
    try {
      const result = await requestPasswordReset(data.email.toLowerCase());
      console.log('Reset password result:', result);
      
      if (result.success) {
        toast.success(result.message, {
          description: 'Please check your email for reset instructions',
          duration: 3000,
        });
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setNetworkError(result.message || "Failed to request password reset");
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setNetworkError(error.message || "Failed to connect to server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg border rounded-2xl">
        <CardHeader className="text-center space-y-2 mb-0">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2 text-center mb-6">
              <Label htmlFor="email" className="text-base block mb-6">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isSubmitting}
                className="text-base h-11"
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
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
              className="w-full h-11 text-base font-medium"

            >
              {isSubmitting ? "Resetting..." : "Send Reset Link"}
            </Button>
            <div className="text-center mb-0">
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
    </div>
  );
}
