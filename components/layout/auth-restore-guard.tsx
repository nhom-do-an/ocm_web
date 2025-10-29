"use client";

import { useAuthRestore } from "@/hooks/useAuthRestore";

export default function AuthRestoreGuard() {
  useAuthRestore();
  return null;
}