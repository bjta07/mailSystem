'use client'

import Header from "../components/layout/Header";
import { useAuth } from "@/config/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import styles from '@/styles/Layout.module.css'

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.sidebar}>
        <Navbar/>
      </div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}