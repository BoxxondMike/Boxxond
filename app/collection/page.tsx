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
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [playerSuggestions, setPlayerSuggestions] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isManual, setIsManual] = useState(false);
  const [manualPlayerName, setManualPlayerName] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardSet, setCardSet] = useState('');
  const [variant, setVariant] = useState('');
  const [numbered, setNumbered] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sortBy, setSortBy] = useState('added_at');
const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
const [uploadingImage, setUploadingImage] = useState(false);
const [cardImageUrl, setCardImageUrl] = useState('');
const [editingCardId, setEditingCardId] = useState<string | null>(null);
const [editImageUrl, setEditImageUrl] = useState('');
const [uploadingEditImage, setUploadingEditImage] = useState(false);


useEffect(() => {
  const saved = localStorage.getItem('collectionViewMode') as 'list' | 'grid';
  if (saved) setViewMode(saved);
}, []);

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
    is_manual,
    player_name_manual,
    card_type,
    card_set,
    year,
    grade,
    numbered,
    image_url,
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
      const cardsWithValue = await Promise.all(data.map(async (card: any) => {
        if (!card.players) return { ...card, currentValue: null };
        
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

  const searchPlayers = async (value: string) => {
    if (value.length < 2) { setPlayerSuggestions([]); return; }
    const { data } = await supabase
      .from('players')
      .select('id, name, team, sport')
      .ilike('name', `%${value}%`)
      .eq('sport', 'Football')
      .limit(6);
    setPlayerSuggestions(data || []);
  };

  const sortedCards = [...cards].sort((a: any, b: any) => {
  if (sortBy === 'paid_asc') return parseFloat(a.purchase_price) - parseFloat(b.purchase_price);
  if (sortBy === 'paid_desc') return parseFloat(b.purchase_price) - parseFloat(a.purchase_price);
  if (sortBy === 'alpha') return (a.players?.name || a.player_name_manual || '').localeCompare(b.players?.name || b.player_name_manual || '');
  if (sortBy === 'value_desc') return (b.currentValue || 0) - (a.currentValue || 0);
  if (sortBy === 'pnl_desc') return ((b.currentValue || 0) - parseFloat(b.purchase_price)) - ((a.currentValue || 0) - parseFloat(a.purchase_price));
  return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
});

  const resetForm = () => {
    setSearchPlayer('');
    setSelectedPlayer(null);
    setIsManual(false);
    setManualPlayerName('');
    setCardType('');
    setCardSet('');
    setVariant('');
    setNumbered('');
    setYear('');
    setGrade('');
    setPurchasePrice('');
    setPlayerSuggestions([]);
    setCardImageUrl('');
  };
  const uploadEditImage = async (file: File, cardId: string) => {
  if (!user) return;
  setUploadingEditImage(true);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${cardId}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('card-images')
    .upload(fileName, file, { upsert: true });
    
  if (!error) {
    const { data } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);
    
    await supabase.from('user_cards')
      .update({ image_url: data.publicUrl })
      .eq('id', cardId);
      
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, image_url: data.publicUrl } : c));
    setEditingCardId(null);
  }
  setUploadingEditImage(false);
};

  const uploadCardImage = async (file: File) => {
  if (!user) return;
  setUploadingImage(true);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('card-images')
    .upload(fileName, file);
    
  if (!error) {
    const { data } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);
    setCardImageUrl(data.publicUrl);
  }
  
  setUploadingImage(false);
};

  const addCard = async () => {
    if (!user || !purchasePrice) return;
    setAddingCard(true);

    const insertData: any = {
  user_id: user.id,
  purchase_price: parseFloat(purchasePrice),
  variant_label: variant || 'Base',
  card_type: cardType,
  card_set: cardSet,
  year: year ? parseInt(year) : null,
  grade: grade || 'Raw',
  numbered: numbered || null,
  is_manual: isManual,
  image_url: cardImageUrl || null,
};

    if (selectedPlayer && !isManual) {
      insertData.player_id = selectedPlayer.id;
      insertData.player_name_manual = selectedPlayer.name;
    } else {
      insertData.player_name_manual = manualPlayerName;
    }

    await supabase.from('user_cards').insert(insertData);

    setAddingCard(false);
    setCardAdded(true);
    setShowAddForm(false);
    resetForm();
    if (user) fetchCollection(user.id);
    setTimeout(() => setCardAdded(false), 3000);
  };

  const totalPaid = cards.reduce((sum, c) => sum + (parseFloat(c.purchase_price) * (c.quantity || 1)), 0);
  const totalValue = cards.reduce((sum, c) => sum + (c.currentValue ? c.currentValue * (c.quantity || 1) : 0), 0);
  const totalPnl = totalValue - totalPaid;

  const formatPrice = (price: number) => price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!user && !loading) {
    return (
      <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
        <Nav />
        <div style={{ padding: '4rem 1.25rem 3rem', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.25)', color: '#1F6F3A', fontSize: '11px', fontWeight: 600, padding: '5px 14px', borderRadius: '20px', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
            Own Your Collection With BoxxHQ
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-1.5px', lineHeight: 1.05 }}>
            Track your collection.<br /><span style={{ color: '#1F6F3A' }}>Know what it's worth.</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2rem' }}>
            Add your cards and we'll track their value daily using real UK market data. See your P&L, spot trends, and know when is right to sell. More sports coming soon.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/signup" style={{ background: '#1F6F3A', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none' }}>
              Create Free Account
            </Link>
            <Link href="/login" style={{ background: '#fff', color: '#1a1a1a', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', border: '1px solid #e0d9cc' }}>
              Log In
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.25rem 3rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '16px', padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>My Collection</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { label: 'Paid', value: '£1,240' },
                  { label: 'Est. Value', value: '£1,890', green: true },
                  { label: 'P&L', value: '+£650', green: true },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '2px' }}>{stat.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: stat.green ? '#1F6F3A' : '#1a1a1a' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede6', marginBottom: '4px' }}>
              <div style={{ width: '200px', minWidth: '160px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Player</div>
              <div style={{ textAlign: 'center', minWidth: '60px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Paid</div>
              <div style={{ textAlign: 'center', minWidth: '60px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Value</div>
              <div style={{ textAlign: 'center', minWidth: '80px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>P&L</div>
              <div style={{ textAlign: 'center', minWidth: '40px', fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Trend</div>
            </div>
            {[
              { player: 'Jude Bellingham', variant: 'Auto', paid: '£650', value: '£790', pnl: '+£140', pct: '+21.5%', trend: '↑' },
              { player: 'Lamine Yamal', variant: 'PSA 10', paid: '£280', value: '£304', pnl: '+£24', pct: '+8.6%', trend: '↑' },
              { player: 'Bukayo Saka', variant: 'Prizm', paid: '£95', value: '£119', pnl: '+£24', pct: '+25.3%', trend: '↑' },
              { player: 'Kylian Mbappé', variant: 'Numbered Parallel', paid: '£215', value: '£677', pnl: '+£462', pct: '+214.9%', trend: '↑' },
            ].map((card, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: i < 3 ? '1px solid #f0ede6' : 'none', justifyContent: 'space-between' }}>
                <div style={{ width: '200px', minWidth: '160px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{card.player}</div>
                  <span style={{ background: 'rgba(58,170,53,0.1)', color: '#1F6F3A', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{card.variant}</span>
                </div>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{card.paid}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1F6F3A' }}>{card.value}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F6F3A' }}>{card.pnl}</div>
                  <div style={{ fontSize: '11px', color: '#1F6F3A' }}>{card.pct}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '40px' }}>
                  <div style={{ fontSize: '20px', color: '#1F6F3A' }}>{card.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.25rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Daily Value Updates', desc: 'Prices update every night using live data via Boxx IQ. Built specifically for card collectors' },
              { title: 'P&L Tracking', desc: 'Add what you paid and see what your cards are worth today' },
              { title: 'Variants Tracked', desc: 'Auto, PSA 10, Prizm, Numbered Parallels, Short Prints and more across all ranges' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/signup" style={{ background: '#1F6F3A', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none' }}>
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
      <div style={{ padding: '2.5rem 1.25rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '12px', maxWidth: '960px', margin: '0 auto 2rem' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-1px' }}>My Collection</h1>
            <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Tracked against Boxx IQ 7-day rolling averages</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' as const }}>
            {[
              { label: 'Paid', value: `£${formatPrice(totalPaid)}` },
              { label: 'Est. Value', value: `£${formatPrice(totalValue)}`, green: true },
              { label: 'P&L', value: `${totalPnl >= 0 ? '+' : ''}£${formatPrice(totalPnl)}`, green: totalPnl >= 0, red: totalPnl < 0 },
            ].map((stat: any) => (
              <div key={stat.label} style={{ background: stat.green ? 'rgba(58,170,53,0.1)' : stat.red ? 'rgba(220,53,69,0.1)' : '#fff', border: `1px solid ${stat.green ? 'rgba(58,170,53,0.3)' : stat.red ? 'rgba(220,53,69,0.3)' : '#e0d9cc'}`, borderRadius: '10px', padding: '12px 20px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: stat.green ? '#3aaa35' : stat.red ? '#dc3545' : '#1a1a1a' }}>{stat.value}</div>
              </div>
            ))}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: '#1F6F3A', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              + Add Card
            </button>
          </div>
        </div>

        {/* Success message */}
        {cardAdded && (
          <div style={{ background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.3)', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '14px', color: '#1F6F3A', fontWeight: 500 }}>
            ✓ Card added to your collection
          </div>
        )}

        {/* Add Card Form */}
        {showAddForm && (
          <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '24px', marginBottom: '24px', maxWidth: '960px', margin: '0 auto 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Add Card</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsManual(false)}
                  style={{ background: !isManual ? '#1F6F3A' : '#faf7f0', color: !isManual ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Tracked Player
                </button>
                <button onClick={() => setIsManual(true)}
                  style={{ background: isManual ? '#1F6F3A' : '#faf7f0', color: isManual ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Manual Entry
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>

              {/* Player */}
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Player Name</label>
                {!isManual ? (
                  <>
                    <input type="text" placeholder="Search player..." value={searchPlayer}
                      onChange={e => { setSearchPlayer(e.target.value); searchPlayers(e.target.value); setSelectedPlayer(null); }}
                      onBlur={() => setTimeout(() => setPlayerSuggestions([]), 200)}
                      style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
                    {playerSuggestions.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginTop: '4px' }}>
                        {playerSuggestions.map((p, i) => (
                          <div key={i} onClick={() => { setSelectedPlayer(p); setSearchPlayer(p.name); setPlayerSuggestions([]); }}
                            style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < playerSuggestions.length - 1 ? '1px solid #f0ede6' : 'none', fontSize: '14px' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#faf7f0'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: '#aaa' }}>{p.team}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedPlayer && <div style={{ fontSize: '12px', color: '#1F6F3A', marginTop: '4px' }}>✓ {selectedPlayer.team}</div>}
                  </>
                ) : (
                  <input type="text" placeholder="e.g. Jamie Vardy" value={manualPlayerName}
                    onChange={e => setManualPlayerName(e.target.value)}
                    style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
                )}
              </div>

              {/* Card Type */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Card Type</label>
                <select value={cardType} onChange={e => setCardType(e.target.value)}
  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
  <option value="">Select type...</option>
  <option>Topps Chrome</option>
  <option>Topps Finest</option>
  <option>Topps Museum</option>
  <option>Topps Dynasty</option>
  <option>Topps UCC</option>
  <option>Topps Now</option>
  <option>Topps Stadium Club</option>
  <option>Topps Inception</option>
  <option>Topps Sapphire</option>
  <option>Topps EFL</option>
  <option>Panini Prizm</option>
  <option>Panini Select</option>
  <option>Panini Mosaic</option>
  <option>Panini Contenders</option>
  <option>Panini Obsidian</option>
  <option>Panini Immaculate</option>
  <option>Upper Deck</option>
  <option>Other</option>
</select>
              </div>

              {/* Set */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Set / Range</label>
                <input type="text" placeholder="e.g. Topps EFL Eternity" value={cardSet}
                  onChange={e => setCardSet(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
              </div>

              {/* Variant */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Variant</label>
  <div style={{ position: 'relative', display: 'inline-block' }}
    onMouseEnter={e => (e.currentTarget.querySelector('.variant-tip') as HTMLElement).style.display = 'block'}
    onMouseLeave={e => (e.currentTarget.querySelector('.variant-tip') as HTMLElement).style.display = 'none'}>
    <span style={{ fontSize: '11px', color: '#aaa', cursor: 'help', border: '1px solid #ddd', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>i</span>
    <div className="variant-tip" style={{ display: 'none', position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap', zIndex: 100, lineHeight: 1.5 }}>
  <div>Numbered Auto? Choose <strong>Auto</strong></div>
  <div>PSA graded? Choose <strong>PSA 10</strong></div>
  <div>Coloured parallel? Choose <strong>Numbered Parallel</strong></div>
  <div>Standard card? Choose <strong>Base</strong></div>
</div>
  </div>
</div>
                <select value={variant} onChange={e => setVariant(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">Select variant...</option>
                  <option>Base</option>
                  <option>Auto</option>
                  <option>PSA 10</option>
                  <option>Numbered Parallel</option>
                  <option>Short Print</option>
                  <option>Refractor</option>
                  <option>Gold</option>
                  <option>Orange</option>
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Green</option>
                  <option>Black</option>
                  <option>Superfractor</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Numbered */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Numbered</label>
                <select value={numbered} onChange={e => setNumbered(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">Not numbered</option>
<option value="/1">/1 (1 of 1)</option>
<option value="/5">/5</option>
<option value="/10">/10</option>
<option value="/20">/20</option>
<option value="/25">/25</option>
<option value="/40">/40</option>
<option value="/49">/49</option>
<option value="/50">/50</option>
<option value="/75">/75</option>
<option value="/99">/99</option>
<option value="/125">/125</option>
<option value="/149">/149</option>
<option value="/150">/150</option>
<option value="/199">/199</option>
<option value="/299">/299</option>
<option value="/399">/399</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Year</label>
                <select value={year} onChange={e => setYear(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">Select year...</option>
                  {Array.from({length: 12}, (_, i) => 2026 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Grade</label>
                <select value={grade} onChange={e => setGrade(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
                  <option value="Raw">Raw / Ungraded</option>
                  <option value="PSA 10">PSA 10</option>
                  <option value="PSA 9">PSA 9</option>
                  <option value="PSA 8">PSA 8</option>
                  <option value="BGS 9.5">BGS 9.5</option>
                  <option value="BGS 9">BGS 9</option>
                  <option value="SGC 10">SGC 10</option>
                  <option value="SGC 9.5">SGC 9.5</option>
                  <option value="ACE 10">ACE 10</option>
                </select>
              </div>

              {/* Purchase Price */}
              <div>
                <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Purchase Price (£)</label>
                <input type="number" placeholder="0.00" value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  style={{ width: '100%', background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
              </div>

            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddForm(false); resetForm(); }}
                style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={addCard}
                disabled={addingCard || !purchasePrice || (!selectedPlayer && !manualPlayerName)}
                style={{ background: purchasePrice && (selectedPlayer || manualPlayerName) ? '#1F6F3A' : '#e0d9cc', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {addingCard ? 'Adding...' : 'Add to Collection'}
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
{cards.length > 0 && (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => { setViewMode('list'); localStorage.setItem('collectionViewMode', 'list'); }}
        style={{ background: viewMode === 'list' ? '#1F6F3A' : '#fff', color: viewMode === 'list' ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        List
      </button>
      <button
        onClick={() => { setViewMode('grid'); localStorage.setItem('collectionViewMode', 'grid'); }}
        style={{ background: viewMode === 'grid' ? '#1F6F3A' : '#fff', color: viewMode === 'grid' ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        Grid
      </button>
    </div>
    <select
      value={sortBy}
      onChange={e => setSortBy(e.target.value)}
      style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
      <option value="added_at">Recently Added</option>
      <option value="alpha">Alphabetical</option>
      <option value="paid_desc">Paid: High to Low</option>
      <option value="paid_asc">Paid: Low to High</option>
      <option value="value_desc">Est. Value: High to Low</option>
      <option value="pnl_desc">P&L: High to Low</option>
    </select>
  </div>
)}

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#bbb', padding: '3rem 0' }}>Loading your collection...</div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No cards yet</div>
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Add your first card using the button above</div>
            <a href='/' style={{ background: '#3aaa35', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>Browse Players</a>
          </div>
        ) : (
          <div style={{ display: viewMode === 'grid' ? 'grid' : 'flex', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : undefined, flexDirection: viewMode === 'list' ? 'column' : undefined, gap: '12px' }}>
  {sortedCards.map((card: any) => {
              const playerName = card.players?.name || card.player_name_manual || 'Unknown';
              const pnl = card.currentValue ? (card.currentValue - parseFloat(card.purchase_price)) * (card.quantity || 1) : null;
              const pnlPct = card.currentValue ? ((card.currentValue - parseFloat(card.purchase_price)) / parseFloat(card.purchase_price)) * 100 : null;
              return (
                <div key={card.id} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '1.25rem' }}>
  {/* Image + Stats row */}
  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
    {card.image_url && (
  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', flexShrink: 0 }}>
    <img src={card.image_url} alt={playerName}
      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e0d9cc', cursor: 'zoom-in', transition: 'transform 0.2s ease', zIndex: 1, position: 'relative' as const }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(4)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    />
    <div style={{ fontSize: '9px', color: '#bbb' }}>hover to zoom</div>
  </div>
)}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1 }}>
    <div style={{ background: '#faf7f0', borderRadius: '8px', padding: '8px 10px' }}>
      <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>Paid</div>
      <div style={{ fontSize: '13px', fontWeight: 600 }}>£{formatPrice(parseFloat(card.purchase_price))}</div>
    </div>
    <div style={{ background: '#faf7f0', borderRadius: '8px', padding: '8px 10px' }}>
      <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px', whiteSpace: 'nowrap' as const }}>Est. Value</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#3aaa35' }}>
        {card.is_manual ? '—' : card.currentValue ? `£${formatPrice(card.currentValue)}` : '—'}
      </div>
    </div>
    <div style={{ background: pnl === null ? '#faf7f0' : pnl >= 0 ? 'rgba(58,170,53,0.08)' : 'rgba(220,53,69,0.08)', borderRadius: '8px', padding: '8px 10px' }}>
      <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>P&L</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: pnl === null ? '#aaa' : pnl >= 0 ? '#3aaa35' : '#dc3545', whiteSpace: 'nowrap' as const }}>
        {pnl === null ? '—' : `${pnl >= 0 ? '+£' : '-£'}${formatPrice(Math.abs(pnl))}`}
      </div>
      {pnlPct !== null && (
        <div style={{ fontSize: '11px', color: pnlPct >= 0 ? '#3aaa35' : '#dc3545' }}>
          {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
        </div>
      )}
    </div>
  </div>
</div>

  {/* Player info */}
  <div style={{ marginBottom: '12px' }}>
    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{playerName}</div>
    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
      {[card.players?.team, card.card_set, card.variant_label, card.numbered, card.grade !== 'Raw' ? card.grade : null].filter(Boolean).join(' · ')}
    </div>
  </div>

  {/* Actions */}
  <div style={{ display: 'flex', gap: '8px' }}>
    
      <a href={`https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent([card.players?.name || card.player_name_manual, card.card_type, card.card_set, card.variant_label, card.numbered].filter(Boolean).join(' ')).trim()}&_sacat=261328`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#888', textDecoration: 'none' }}>
      eBay →
    </a>
    <button onClick={() => removeCard(card.id)}
      style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#aaa', cursor: 'pointer' }}>
      Remove
    </button>
    <button onClick={() => setEditingCardId(editingCardId === card.id ? null : card.id)}
      style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', color: '#888', cursor: 'pointer' }}>
      {editingCardId === card.id ? 'Cancel' : '📷 Add Card Image'}
    </button>
  </div>

  {editingCardId === card.id && (
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0ede6' }}>
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        id={`edit-image-${card.id}`}
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && uploadEditImage(e.target.files[0], card.id)} 
      />
      <button 
        onClick={() => document.getElementById(`edit-image-${card.id}`)?.click()}
        style={{ background: '#faf7f0', border: '1px dashed #e0d9cc', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: '13px', color: '#888', fontFamily: 'inherit' }}>
        {uploadingEditImage ? 'Uploading...' : '📷 Upload card photo'}
      </button>
    </div>
  )}
</div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}