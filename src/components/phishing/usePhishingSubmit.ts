"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function usePhishingSubmit(token: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // SECURITY: Only send the token. Credential values are discarded.
      const res = await fetch("/api/track/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      router.push(data.redirectUrl || "/education");
    } catch {
      router.push("/education");
    }
  }

  function handleClose() {
    router.push(`/education?token=${encodeURIComponent(token)}`);
  }

  return { loading, handleSubmit, handleClose };
}
