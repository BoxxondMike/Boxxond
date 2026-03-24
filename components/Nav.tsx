'use client';

import Link from 'next/link';
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
        }
      `}</style>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        
        {/* Logo */}
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
        boxx<span style={{ color: "#f0b429" }}>ond</span>
<span style={{ fontSize: "9px", fontWeight: 600, background: "rgba(240,180,41,0.15)", border: "1px solid rgba(240,180,41,0.3)", color: "#f0b429", padding: "2px 6px", borderRadius: "4px", marginLeft: "6px", letterSpacing: "0.5px", verticalAlign: "middle" }}>BETA</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{ fontSize: "14px" }}>
          <Link href="/" style={{ color: activePage === 'prices' ? "#f0b429" : "rgba(255,255,255,0.5)", textDecoration: "none" }}>Prices</Link>
          <Link href="/sets" style={{ color: activePage === 'sets' ? "#f0b429" : "rgba(255,255,255,0.5)", textDecoration: "none" }}>Sets</Link>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</a>
        </div>

        {/* Desktop Auth */}
        <div className="nav-desktop-links" style={{ gap: "10px", alignItems: "center" }}>
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

        {/* Mobile Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", flexDirection: "column", gap: "5px" }}>
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "#f0b429" : "#fff", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "transparent" : "#fff", borderRadius: "2px", transition: "all 0.2s" }} />
          <div style={{ width: "22px", height: "2px", background: menuOpen ? "#f0b429" : "#fff", borderRadius: "2px", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>

      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0" }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'prices' ? "#f0b429" : "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>Prices</Link>
          <Link href="/sets" onClick={() => setMenuOpen(false)} style={{ color: activePage === 'sets' ? "#f0b429" : "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>Sets</Link>
          <a href="#" onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>Breaks</a>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>Dashboard</Link>
              <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.7)", fontSize: "15px", padding: "12px 0", textAlign: "left", cursor: "pointer" }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "15px" }}>Log in</Link>
              <div style={{ paddingTop: "12px" }}>
                <Link href="/signup" onClick={() => setMenuOpen(false)} style={{ background: "#f0b429", color: "#080c10", fontWeight: 700, fontSize: "14px", padding: "10px 20px", borderRadius: "6px", textDecoration: "none" }}>
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