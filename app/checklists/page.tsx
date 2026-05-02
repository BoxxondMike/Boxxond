'use client';

import { useState, useMemo } from 'react';
import Nav from '../../components/Nav';
import Link from 'next/link';
import { cardSets, getSportsList, getChecklistHref, type CardSet } from '../../lib/sets';

export default function ChecklistsPage() {
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<CardSet['sport'] | 'All'>('All');
  const [showArchive, setShowArchive] = useState(false);

  const sports = getSportsList();

  // Only sets with a checklist (interactive or PDF) appear here
  const setsWithChecklists = useMemo(() => {
    return cardSets.filter(s => s.checklistType !== null);
  }, []);

  const filtered = useMemo(() => {
    return setsWithChecklists.filter(s => {
      const matchesSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportFilter === 'All' || s.sport === sportFilter;
      const matchesArchive = showArchive ? s.status === 'previous' : s.status !== 'previous';
      return matchesSearch && matchesSport && matchesArchive;
    });
  }, [setsWithChecklists, search, sportFilter, showArchive]);

  const currentSets = filtered.filter(s => s.status !== 'previous');
  const archivedSets = filtered.filter(s => s.status === 'previous');

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>

      <Nav activePage="checklists" />

      <div style={{ padding: '3rem 2rem 2rem', maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px', margin: '0 0 1rem', lineHeight: 1.05 }}>
          Card<span style={{ color: '#1F6F3A' }}> Checklists</span>
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.6, maxWidth: '850px', margin: 0 }}>
          Browse complete checklists for every major card set. Some are interactive with searchable players and direct eBay links — others link to the official manufacturer PDF. Looking for set details and parallel info? Visit <Link href="/sets" style={{ color: '#1F6F3A', fontWeight: 600, textDecoration: 'underline' }}>Sets &amp; Releases</Link>.
        </p>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search a set..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '220px', background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          {(search || sportFilter !== 'All') && (
            <button
              onClick={() => { setSearch(''); setSportFilter('All'); }}
              style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '0.75rem' }}>
          <button
            onClick={() => setSportFilter('All')}
            style={{ background: sportFilter === 'All' ? '#1F6F3A' : '#fff', color: sportFilter === 'All' ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            All Sports
          </button>
          {sports.map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              style={{ background: sportFilter === sport ? '#1F6F3A' : '#fff', color: sportFilter === sport ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {sport}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '13px', color: '#888' }}>
          Showing {currentSets.length} checklist{currentSets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Current sets */}
      <div style={{ padding: '1rem 2rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {currentSets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>No checklists match your search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {currentSets.map(set => (
              <ChecklistCard key={set.slug} set={set} />
            ))}
          </div>
        )}
      </div>

      {/* Archive section */}
      {archivedSets.length > 0 && (
        <div style={{ padding: '1rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid #e0d9cc', paddingTop: '2rem' }}>
            <button
              onClick={() => setShowArchive(!showArchive)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0, fontFamily: 'inherit' }}>
              <h2 style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', margin: 0, color: '#666' }}>
                Previous Years &amp; Archive
              </h2>
              <span style={{ fontSize: '13px', color: '#888' }}>({archivedSets.length})</span>
              <span style={{ fontSize: '16px', color: '#888', marginLeft: '4px' }}>{showArchive ? '−' : '+'}</span>
            </button>
            {showArchive && (
              <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {archivedSets.map(set => (
                  <ChecklistCard key={set.slug} set={set} archived />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

// ============================================================
// ChecklistCard — extracted for reuse between current and archive sections
// ============================================================

function ChecklistCard({ set, archived = false }: { set: CardSet; archived?: boolean }) {
  const href = getChecklistHref(set);
  const isInteractive = set.checklistType === 'interactive';

  if (!href) return null;

  const cardContents = (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e0d9cc',
        borderRadius: '12px',
        padding: '1.25rem',
        height: '100%',
        cursor: 'pointer',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        opacity: archived ? 0.7 : 1,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(58,170,53,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d9cc')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{set.sport} · {set.manufacturer}</span>
        {isInteractive ? (
          <span style={{ background: 'rgba(58,170,53,0.15)', color: '#3aaa35', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>INTERACTIVE</span>
        ) : (
          <span style={{ background: 'rgba(150,150,150,0.15)', color: '#888', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>PDF</span>
        )}
      </div>
      <div style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a', marginBottom: '4px', letterSpacing: '-0.2px', lineHeight: 1.3 }}>{set.name}</div>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px', flex: 1 }}>{set.year}</div>
      <div style={{ fontSize: '12px', color: '#3aaa35', fontWeight: 600 }}>
        {isInteractive ? 'View Interactive Checklist →' : 'Open PDF Checklist →'}
      </div>
    </div>
  );

  if (isInteractive) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        {cardContents}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      {cardContents}
    </a>
  );
}