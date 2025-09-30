'use client'

import Header from "../components/layout/Header";
import { useAuth } from "@/config/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import styles from '@/styles/Layout.module.css'
import Icon from "../components/UI/Icons";


export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div 
      className={styles.main} 
      style={{ gridTemplateColumns: collapsed ? "70px 1fr" : "250px 1fr" }}
    >
      <div className={styles.header}>
        <button 
          className={styles.toggleBtn} 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Icon name="expand" fill /> : <Icon name="collapse" fill/>}
        </button>
        <Header />
      </div>
      <div className={styles.sidebar}>
        <Navbar collapsed={collapsed} />
      </div>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
