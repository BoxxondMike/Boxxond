'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('u');
  const token = searchParams.get('t');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId || !token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link.');
      return;
    }

    fetch(`/api/unsubscribe?u=${userId}&t=${token}`, { method: 'POST' })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || "You've been unsubscribed from the weekly digest.");
        } else {
          setStatus('error');
          setMessage(data.error || 'Something went wrong.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [userId, token]);

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', fontFamily: 'var(--font-dm-sans)' }}>
      <div style={{ background: '#ffffff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '40px 32px', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <img src="/boxxhq-logo.png" alt="BoxxHQ" style={{ height: '60px', width: 'auto', marginBottom: '24px' }} />

        {status === 'loading' && (
          <div style={{ color: '#888', fontSize: '14px' }}>Processing…</div>
        )}

        {status === 'success' && (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
              Unsubscribed
            </h1>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              {message} You'll still receive any specific card alerts you've set up.
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', background: '#1F6F3A', color: '#faf7f0', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              Manage Preferences
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>
              Couldn't unsubscribe
            </h1>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              {message}
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', background: '#1F6F3A', color: '#faf7f0', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  );
}