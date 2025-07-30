"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Prevent hydration mismatch by always rendering fallback on server
  if (typeof window === 'undefined' || !hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}