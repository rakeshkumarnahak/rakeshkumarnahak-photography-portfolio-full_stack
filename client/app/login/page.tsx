"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/upload");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
        <div className="bg-card p-8 rounded-lg shadow-md">
          <LoginForm />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
