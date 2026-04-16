'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function CollectionPage() {
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
  setLoading(false);
  return;
}
      setUser(session.user);
      fetchCollection(session.user.id);
    };
    getUser();
  }, []);

  const fetchCollection = async (userId: string) => {
    const { data } = await supabase
      .from('user_cards')
      .select(`
        id,
        variant_label,
        purchase_price,
        quantity,
        added_at,
        players (
          id,
          name,
          team,
          nationality
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (data) {
      // Fetch current Boxx IQ value for each card
      const cardsWithValue = await Promise.all(data.map(async (card: any) => {
        const { data: priceData } = await supabase
          .from('price_history')
          .select('avg_price')
          .ilike('search_term', `${card.players.name.toLowerCase()}%`)
          .eq('variant_label', card.variant_label)
          .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('recorded_at', { ascending: false });

        const currentValue = priceData && priceData.length > 0
          ? priceData.reduce((sum: number, p: any) => sum + parseFloat(p.avg_price), 0) / priceData.length
          : null;

        return { ...card, currentValue };
      }));

      setCards(cardsWithValue);
    }
    setLoading(false);
  };

  const removeCard = async (cardId: string) => {
    await supabase.from('user_cards').delete().eq('id', cardId);
    setCards(prev => prev.filter(c => c.id !== cardId));
  };

  const totalPaid = cards.reduce((sum, c) => sum + (parseFloat(c.purchase_price) * c.quantity), 0);
  const totalValue = cards.reduce((sum, c) => sum + (c.currentValue ? c.currentValue * c.quantity : 0), 0);
  const totalPnl = totalValue - totalPaid;

  const formatPrice = (price: number) => price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

if (!user && !loading) {
  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
      <Nav />

      {/* Hero */}
      <div style={{ padding: '4rem 1.25rem 3rem', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.25)', color: '#3aaa35', fontSize: '11px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
          Own Your Collection With BoxxHQ
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-1.5px', lineHeight: 1.05 }}>
          Track your collection.<br /><span style={{ color: '#3aaa35' }}>Know what it's worth.</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2rem' }}>
          Add your football cards and we'll track their value daily using real UK market data. See your P&L, spot trends, and know when is right to sell.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/signup" style={{ background: '#3aaa35', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none' }}>
            Create Free Account
          </Link>
          <Link href="/login" style={{ background: '#fff', color: '#1a1a1a', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', border: '1px solid #e0d9cc' }}>
            Log In
          </Link>
        </div>
      </div>

      {/* Mock Collection Preview */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.25rem 3rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '16px', padding: '1rem', marginBottom: '2rem' }}>
          {/* Mock Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>My Collection</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Paid', value: '£1,240' },
                { label: 'Est. Value', value: '£1,890', green: true },
                { label: 'P&L', value: '+£650', green: true },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{stat.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: stat.green ? '#3aaa35' : '#1a1a1a' }}>{stat.value}</div>
                </div>
              ))}
            </div>
</div>

          {/* Column Headers */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede6', marginBottom: '4px' }}>
            <div style={{ width: '200px', minWidth: '160px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Player</div>
            <div style={{ textAlign: 'center', minWidth: '60px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Paid</div>
            <div style={{ textAlign: 'center', minWidth: '60px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Value</div>
            <div style={{ textAlign: 'center', minWidth: '80px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>P&L</div>
            <div style={{ textAlign: 'center', minWidth: '40px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Trend</div>
          </div>

          {/* Mock Cards */}
          {[
            { player: 'Jude Bellingham', variant: 'Auto', paid: '£650', value: '£790', pnl: '+£140', pct: '+21.5%', trend: '↑' },
{ player: 'Lamine Yamal', variant: 'PSA 10', paid: '£280', value: '£304', pnl: '+£24', pct: '+8.6%', trend: '↑' },
{ player: 'Bukayo Saka', variant: 'Prizm', paid: '£95', value: '£119', pnl: '+£24', pct: '+25.3%', trend: '↑' },
{ player: 'Kylian Mbappé', variant: 'Numbered Parallel', paid: '£215', value: '£677', pnl: '+£462', pct: '+214.9%', trend: '↑' },
          ].map((card, i) => (
           <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: i < 3 ? '1px solid #f0ede6' : 'none', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ width: '200px', minWidth: '160px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{card.player}</div>
                <span style={{ background: 'rgba(58,170,53,0.1)', color: '#3aaa35', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{card.variant}</span>
              </div>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{card.paid}</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3aaa35' }}>{card.value}</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#3aaa35' }}>{card.pnl}</div>
                <div style={{ fontSize: '11px', color: '#3aaa35' }}>{card.pct}</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '40px' }}>
  <div style={{ fontSize: '20px', color: card.trend === '↑' ? '#3aaa35' : '#dc3545' }}>{card.trend}</div>
</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📈', title: 'Daily Value Updates', desc: 'Prices update every night using live data via Boxx IQ.  Built specifically for card collectors' },
            { icon: '💰', title: 'P&L Tracking', desc: 'Add what you paid and see what your cards are worth today' },
            { icon: '🏆', title: 'Variants Tracked', desc: 'Auto, PSA 10, Prizm, Numbered Parallels, Short Prints and more across all ranges' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/signup" style={{ background: '#3aaa35', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none' }}>
            Start Tracking For Free →
          </Link>
        </div>
      </div>

    </main>
  );
}

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
      <Nav />

      <div style={{ padding: '2.5rem 1.25rem', maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>My Vault
                
            </h1>
            <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Tracked against Boxx IQ 7-day rolling averages</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Paid</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>£{formatPrice(totalPaid)}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Est. Value</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#3aaa35' }}>£{formatPrice(totalValue)}</div>
            </div>
            <div style={{ background: totalPnl >= 0 ? 'rgba(58,170,53,0.1)' : 'rgba(220,53,69,0.1)', border: `1px solid ${totalPnl >= 0 ? 'rgba(58,170,53,0.3)' : 'rgba(220,53,69,0.3)'}`, borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>P&L</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: totalPnl >= 0 ? '#3aaa35' : '#dc3545' }}>{totalPnl >= 0 ? '+' : ''}£{formatPrice(totalPnl)}</div>
            </div>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#bbb', padding: '3rem 0' }}>Loading your collection...</div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No cards yet</div>
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Visit a player page and add cards to start tracking your collection</div>
            <a href='/' style={{ background: '#3aaa35', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>Browse Players</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cards.map((card: any) => {
              const pnl = card.currentValue ? (card.currentValue - parseFloat(card.purchase_price)) * card.quantity : null;
              const pnlPct = card.currentValue ? ((card.currentValue - parseFloat(card.purchase_price)) / parseFloat(card.purchase_price)) * 100 : null;
              return (
                <div key={card.id} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{card.players.name}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(58,170,53,0.1)', color: '#3aaa35', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{card.variant_label}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>{card.players.team}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>Paid</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>£{formatPrice(parseFloat(card.purchase_price))}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>Est. Value</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#3aaa35' }}>
                      {card.currentValue ? `£${formatPrice(card.currentValue)}` : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>P&L</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: pnl === null ? '#aaa' : pnl >= 0 ? '#3aaa35' : '#dc3545' }}>
                      {pnl === null ? '—' : `${pnl >= 0 ? '+' : ''}£${formatPrice(pnl)}`}
                    </div>
                    {pnlPct !== null && (
                      <div style={{ fontSize: '11px', color: pnlPct >= 0 ? '#3aaa35' : '#dc3545' }}>
                        {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeCard(card.id)}
                    style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#aaa', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}