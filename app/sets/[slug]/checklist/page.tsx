'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Nav from '../../../../components/Nav';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChecklistBySlug, type ChecklistCard } from '../../../../lib/checklists';

export default function ChecklistPage() {
  const params = useParams();
  const slug = params.slug as string;
  const checklist = getChecklistBySlug(slug);

  if (!checklist) {
    notFound();
  }

  const filterField = checklist.filterDimension.field;

  const allFilterValues = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(checklist.sections)
          .flat()
          .map(c => (c as any)[filterField])
          .filter(Boolean)
      )
    ).sort();
  }, [checklist, filterField]);

  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(checklist.sections).map(k => [k, true]))
  );

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filtered = useMemo(() => {
    const result: Record<string, ChecklistCard[]> = {};
    for (const [section, cards] of Object.entries(checklist.sections)) {
      const matches = (cards as ChecklistCard[]).filter(c => {
        const matchesSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterValue === '' || (c as any)[filterField] === filterValue;
        return matchesSearch && matchesFilter;
      });
      if (matches.length > 0) result[section] = matches;
    }
    return result;
  }, [checklist, search, filterValue, filterField]);

  const totalCards = Object.values(filtered).reduce((sum, cards) => sum + cards.length, 0);

  return (
    <main style={{ background: '#faf7f0', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'var(--font-dm-sans)' }}>
      <Nav />
      <div style={{ padding: '2.5rem 1.25rem', maxWidth: '960px', margin: '0 auto' }}>

        <Link href={`/sets/${slug}`} style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Set Guide
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          {checklist.setBadge && (
            <div style={{ display: 'inline-block', background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.25)', color: '#1F6F3A', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', marginBottom: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
              {checklist.setBadge}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-1px' }}>
            {checklist.setName}
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>{checklist.setSubtitle}</p>
        </div>

        {/* Section Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
          <button onClick={() => setOpenSections(Object.fromEntries(Object.keys(checklist.sections).map(k => [k, true])))}
            style={{ background: '#1F6F3A', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            All
          </button>
          {Object.keys(checklist.sections).map(section => {
            const isOnlyOpen = openSections[section] && Object.values(openSections).filter(Boolean).length === 1;
            return (
              <button key={section} onClick={() => setOpenSections(Object.fromEntries(Object.keys(checklist.sections).map(k => [k, k === section])))}
                style={{ background: isOnlyOpen ? '#1F6F3A' : '#fff', color: isOnlyOpen ? '#fff' : '#888', border: '1px solid #e0d9cc', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {section}
              </button>
            );
          })}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px', background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <select
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="">{checklist.filterDimension.placeholder}</option>
            {allFilterValues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          {(search || filterValue) && (
            <button
              onClick={() => { setSearch(''); setFilterValue(''); }}
              style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', color: '#888', marginBottom: '1.5rem' }}>
          Showing {totalCards} card{totalCards !== 1 ? 's' : ''}
        </div>

        {/* Sections */}
        {Object.entries(filtered).filter(([section]) => openSections[section]).map(([section, cards]) => {
          const sectionColor = checklist.sectionColors?.[section] || '#1F6F3A';
          return (
            <div key={section} style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection(section)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{section}</span>
                  <span style={{ background: `rgba(${sectionColor === '#f59e0b' ? '245,158,11' : '58,170,53'},0.1)`, color: sectionColor, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>
                    {cards.length} cards
                  </span>
                </div>
                <span style={{ fontSize: '18px', color: '#888' }}>{openSections[section] ? '−' : '+'}</span>
              </button>

              {openSections[section] && (
                <div style={{ borderTop: '1px solid #f0ede6' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#faf7f0' }}>
                        <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px', width: '90px', whiteSpace: 'nowrap' as const }}>#</th>
                        <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Player</th>
                        <th style={{ textAlign: 'left', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{checklist.filterDimension.label}</th>
                        <th style={{ textAlign: 'right', padding: '8px 20px', fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>eBay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.map((card, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f0ede6' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#faf7f0'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          <td style={{ padding: '12px 20px', color: '#aaa', fontWeight: 600, whiteSpace: 'nowrap' as const }}>{card.num}</td>
                          <td style={{ padding: '12px 20px', fontWeight: 600, color: '#1a1a1a' }}>
                            {card.name}
                            {card.isRookie && (
                              <span style={{ marginLeft: '8px', background: 'rgba(58,170,53,0.15)', color: '#1F6F3A', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.05em' }}>RC</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 20px', color: '#666' }}>{(card as any)[filterField]}</td>
                          <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                            
                              <a href={`https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(`${card.name} ${checklist.ebaySearchSuffix}`)}&_sacat=261328&campid=5339145682&customid=Boxxhq`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '12px', color: '#1F6F3A', fontWeight: 600, textDecoration: 'none' }}>
                              eBay →
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filtered).length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
            No cards found matching your search.
          </div>
        )}

        <div style={{ marginTop: '2rem', background: '#f0ede6', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.6 }}>
            <strong style={{ color: '#555' }}>Disclaimer:</strong> Checklist data is sourced from public checklists and may be subject to change. Always verify with official sources. BoxxHQ is not affiliated with any card manufacturer.
          </div>
        </div>

      </div>
    </main>
  );
}