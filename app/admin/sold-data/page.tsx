'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PASSWORD = 'Boxxhq_admin';

export default function SoldDataAdmin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [form, setForm] = useState({
    player_name: '',
    search_term: '',
    avg_price: '',
    min_price: '',
    max_price: '',
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('name').order('name');
      setPlayers(data || []);
    };
    if (authed) fetchPlayers();
  }, [authed]);

  if (!authed) return (
    <div style={{ background: '#faf7f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0d9cc', width: '300px' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '18px' }}>Admin Access</h2>
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d9cc', marginBottom: '1rem', boxSizing: 'border-box' as const }} />
        <button onClick={() => pw === PASSWORD && setAuthed(true)}
          style={{ width: '100%', background: '#3aaa35', color: '#faf7f0', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          Enter
        </button>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    setSaving(true);
    setSuccess(false);
    const { error } = await supabase.from('card_sold_data').insert({
      player_name: form.player_name,
      search_term: form.search_term,
      avg_price: parseFloat(form.avg_price),
min_price: parseFloat(form.min_price),
max_price: parseFloat(form.max_price),
date_from: form.date_from,
date_to: form.date_to,
      source: 'terapeak',
      currency: 'USD',
    });
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setForm({
        player_name: '',
        search_term: '',
        avg_price: '',
        min_price: '',
        max_price: '',
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_to: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div style={{ background: '#faf7f0', minHeight: '100vh', padding: '2rem 1.25rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontWeight: 800, fontSize: '24px', marginBottom: '0.5rem' }}>Add Sold Data</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '2rem' }}>Enter Terapeak data (USD) for a player card search</p>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0d9cc' }}>

          {/* Player dropdown */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1a1a1a' }}>Player Name</label>
            <select
              value={form.player_name}
              onChange={e => setForm({ ...form, player_name: e.target.value, search_term: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d9cc', boxSizing: 'border-box' as const, fontSize: '14px', background: '#fff' }}>
              <option value="">Select a player...</option>
              {players.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Search term */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1a1a1a' }}>Search Term</label>
            <input type="text" placeholder="e.g. Jude Bellingham Auto Refractor"
              value={form.search_term}
              onChange={e => setForm({ ...form, search_term: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d9cc', boxSizing: 'border-box' as const, fontSize: '14px' }} />
          </div>

          {/* Price fields */}
          {[
            { key: 'avg_price', label: 'Avg Price (USD $)' },
{ key: 'min_price', label: 'Min Price (USD $)' },
{ key: 'max_price', label: 'Max Price (USD $)' },
{ key: 'date_from', label: 'Date From' },
{ key: 'date_to', label: 'Date To' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1a1a1a' }}>{f.label}</label>
              <input type="text"
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0d9cc', boxSizing: 'border-box' as const, fontSize: '14px' }} />
            </div>
          ))}

          <button onClick={handleSubmit} disabled={saving}
            style={{ width: '100%', background: '#3aaa35', color: '#faf7f0', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '0.5rem' }}>
            {saving ? 'Saving...' : 'Save to Supabase'}
          </button>

          {success && (
            <div style={{ marginTop: '1rem', background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.3)', borderRadius: '8px', padding: '12px', color: '#3aaa35', fontWeight: 600, textAlign: 'center' }}>
              ✅ Saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}