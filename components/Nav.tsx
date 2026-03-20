'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Nav({ activePage }: { activePage?: string }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
        boxx<span style={{ color: "#f0b429" }}>ond</span>
      </Link>

      <div style={{ display: "flex", gap: "2rem", fontSize: "14px" }}>
        <Link href="/" style={{ color: activePage === 'prices' ? "#f0b429" : "rgba(255,255,255,0.5)", textDecoration: "none" }}>Prices</Link>
        <Link href="/sets" style={{ color: activePage === 'sets' ? "#f0b429" : "rgba(255,255,255,0.5)", textDecoration: "none" }}>Sets</Link>
        <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</a>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {user ? (
          <>
            <Link href="/dashboard" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Dashboard</Link>
            <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: "13px", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer" }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Log in</Link>
            <Link href="/signup" style={{ background: "#f0b429", color: "#080c10", fontWeight: 700, fontSize: "13px", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}