"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Не удалось выйти");
      }
    } finally {
      setIsLoading(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-xs text-white/60 hover:text-white"
      onClick={handleLogout}
      disabled={isLoading}
    >
      Выйти
    </Button>
  );
}
