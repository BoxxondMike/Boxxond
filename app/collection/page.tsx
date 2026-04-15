'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';

export default function CollectionPage() {
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
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

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
      <Nav />

      <div style={{ padding: '2.5rem 1.25rem', maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>My Vault</h1>
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