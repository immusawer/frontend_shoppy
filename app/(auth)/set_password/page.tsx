"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { resetPasswordSchema, resetPassword, getTokenFromUrl } from "./set_password";
import type { ResetPasswordFormValues } from "./set_password";

export default function ResetPassword() {
  const router = useRouter();
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL when component mounts
  useEffect(() => {
    const urlToken = getTokenFromUrl();
    console.log("Token from URL:", urlToken);
    setToken(urlToken);
    
    if (!urlToken) {
      setNetworkError("Invalid or missing reset token");
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
      confirmPassword: "",
    }
  });

  // Set token value when it becomes available
  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setNetworkError(null);
    
    // Add token from URL to form data
    data.token = token || "";
    console.log("Submitting with token:", data.token);
    
    if (!data.token) {
      setNetworkError("Missing reset token");
      return;
    }

    try {
      const result = await resetPassword(data);
      
      if (result.success) {
        toast.success(result.message);
        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setNetworkError(result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setNetworkError(error.message || "An unexpected error occurred");
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg border rounded-2xl">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                {...register("password")}
                disabled={isSubmitting}
                className="text-base h-11"
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your new password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
                className="text-base h-11"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {networkError && (
              <p className="text-destructive text-sm">{networkError}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster richColors position="top-center" />
    </div>
  );
}
