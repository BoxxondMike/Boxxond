'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email to confirm your account!');
    }
    setLoading(false);
  };

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #f0ede6" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#1a1a1a", textDecoration: "none" }}>
          boxx<span style={{ color: "#3aaa35" }}>ond</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>Create your account</h1>
            <p style={{ color: "#888)", fontSize: "14px", margin: 0 }}>Track card prices and save your favourites</p>
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
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "12px 14px", color: "#1a1a1a", fontSize: "15px", outline: "none", boxSizing: "border-box" as const }}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#ef4444" }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#22c55e" }}>
                {message}
              </div>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading}
              style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "15px", padding: "13px", border: "none", borderRadius: "8px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Sign Up Free'}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#888)", marginTop: "1.5rem" }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: "#3aaa35", textDecoration: "none" }}>Log in</Link>
          </p>

        </div>
      </div>
    </main>
  );
}