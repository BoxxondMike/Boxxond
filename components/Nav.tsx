'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Nav({ activePage }: { activePage?: string }) {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <style>{`
  .nav-desktop-links { display: flex; gap: 2rem; }
  .nav-hamburger { display: none; }
  @media (max-width: 640px) {
    .nav-desktop-links { display: none; }
    .nav-hamburger { display: flex; }
    .nav-logo { margin: 0 auto; }
  }
`}</style>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.50rem 1.25rem", borderBottom: "1px solid #e0d9cc", background: "#faf7f0" }}>

        {/* Logo */}
        <Link href="/" className="nav-logo" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <Image src="/boxxhq-logo.png" alt="BoxxHQ" height={120} width={480} style={{ objectFit: "contain", maxWidth: "150px", height: "auto" }} />
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{ fontSize: "15px", fontWeight: 600, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Link href="/" style={{ color: activePage === 'prices' ? "#3aaa35" : "#888", textDecoration: "none" }}>Prices</Link>
          <Link href="/sets" style={{ color: activePage === 'sets' ? "#3aaa35" : "#888", textDecoration: "none" }}>Sets</Link>
          <Link href="/breaks" style={{ color: activePage === 'breaks' ? "#3aaa35" : "#888", textDecoration: "none" }}>Breaks</Link>
          <Link href="/quiz">Quiz</Link>
        </div>

        {/* Desktop Auth */}
        <div className="nav-desktop-links" style={{ gap: "10px", alignItems: "center", flexShrink: 0 }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{ fontSize: "15px", fontWeight: 600, color: "#888", textDecoration: "none" }}>Dashboard</Link>
              <button onClick={handleSignOut} style={{ background: "#fff", color: "#888", fontSize: "13px", padding: "8px 16px", border: "1px solid #e0d9cc", borderRadius: "6px", cursor: "pointer" }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: "13px", color: "#888", textDecoration: "none" }}>Log in</Link>
              <Link href="/signup" style={{ background: "#3aaa35", color: "#1a1a1a", fontWeight: 700, fontSize: "13px", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px" }}>
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "#3aaa35" : "#1a1a1a", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "transparent" : "#1a1a1a", borderRadius: "2px", transition: "all 0.2s" }} />
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "#3aaa35" : "#1a1a1a", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>

      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "#faf7f0", borderBottom: "1px solid #e0d9cc", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0" }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'prices' ? "#3aaa35" : "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Prices</Link>
          <Link href="/sets" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'sets' ? "#3aaa35" : "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Sets</Link>
          <Link href="/breaks" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'breaks' ? "#3aaa35" : "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Breaks</Link>
          <Link href="/quiz" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'quiz' ? "#3aaa35" : "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Quiz</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Dashboard</Link>
              <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "#e84040", fontSize: "15px", padding: "12px 0", textAlign: "left", cursor: "pointer" }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "#555", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #e0d9cc", fontSize: "15px" }}>Log in</Link>
              <div style={{ paddingTop: "12px" }}>
                <Link href="/signup" onClick={() => setMenuOpen(false)} style={{ background: "#3aaa35", color: "#1a1a1a", fontWeight: 700, fontSize: "14px", padding: "10px 20px", borderRadius: "6px", textDecoration: "none" }}>
                  Sign Up Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}