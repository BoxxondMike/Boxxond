'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #f0ede6" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#1a1a1a", textDecoration: "none" }}>
          <img src="/boxxhq-logo.png" alt="BoxxHQ" style={{ height: "60px", width: "auto" }} />
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>Welcome back</h1>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Log in to your BoxxHQ account</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "12px 14px", color: "#1a1a1a", fontSize: "15px", outline: "none", boxSizing: "border-box" as const }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "12px 14px", color: "#1a1a1a", fontSize: "15px", outline: "none", boxSizing: "border-box" as const }}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#ef4444" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "15px", padding: "13px", border: "none", borderRadius: "8px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#888)", marginTop: "1.5rem" }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: "#3aaa35", textDecoration: "none" }}>Sign up free</Link>
          </p>

        </div>
      </div>
    </main>
  );
}