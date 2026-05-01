'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  imageUrl?: string;
}

interface PageContext {
  page_url?: string;
  page_type?: 'home' | 'player' | 'set' | 'release' | 'other';
  player_name?: string;
  set_name?: string;
}

interface AskBoxxProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  pageContext?: PageContext;
  userId?: string | null;
}

export default function AskBoxx({
  isOpen,
  onClose,
  isPro,
  pageContext = { page_type: 'other' },
  userId = null,
}: AskBoxxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey! I'm Boxx, your personal card advisor. Ask me about player card prices, what to list your cards for, or anything about the hobby.",
      suggestions: [
        'How much is a Bellingham PSA 10 worth?',
        'What should I list my Vini Jr auto for?',
        'Best cards to buy before the World Cup?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageCount, setMessageCount] = useState(0);
  const MAX_MESSAGES = 5;
  const [uploadingImage, setUploadingImage] = useState(false);
const [imageError, setImageError] = useState('');
const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Peregro analytics: stable conversation + session IDs ----
  const [conversationId] = useState<string>(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  );

  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'ssr';
    let sid = sessionStorage.getItem('peregro_session_id');
    if (!sid) {
      sid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      sessionStorage.setItem('peregro_session_id', sid);
    }
    return sid;
  });

  useEffect(() => {
    if (isOpen && isPro) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isPro]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ---- Peregro: fire-and-forget log events ----
  const logEvent = async (payload: Record<string, unknown>) => {
    try {
      await fetch('/api/peregro/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, ...payload }),
      });
    } catch {
      // swallow — logging never breaks UX
    }
  };
  const compressImageForChat = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 800;
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.8
      );
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
};

const sendImage = async (file: File) => {
  if (loading || uploadingImage) return;
  if (messageCount >= MAX_MESSAGES) return;
  if (!userId) {
    setImageError('You need to be logged in to upload photos.');
    return;
  }

  setImageError('');
  setUploadingImage(true);

  try {
    const compressed = await compressImageForChat(file);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(compressed);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: '[Photo uploaded]', imageUrl: localPreview },
    ]);

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressed);
    });

    setLoading(true);

    const res = await fetch('/api/peregro/identify-card-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        mediaType: 'image/jpeg',
        conversation_id: conversationId,
        session_id: sessionId,
        user_id: userId,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.error || 'Sorry, I had trouble identifying that card. Try another photo?',
          suggestions: [],
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          suggestions: data.suggestions || [],
        },
      ]);
      setMessageCount((prev) => prev + 1);
    }
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Sorry, something went wrong with the upload. Try again?',
        suggestions: [],
      },
    ]);
  }

  setLoading(false);
  setUploadingImage(false);
  if (fileInputRef.current) fileInputRef.current.value = '';
};

  const sendMessage = async (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    if (messageCount >= MAX_MESSAGES) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/peregro/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          conversation_id: conversationId,
          session_id: sessionId,
          user_id: userId,
          page_context: {
            page_url:
              pageContext.page_url ??
              (typeof window !== 'undefined' ? window.location.pathname : '/'),
            page_type: pageContext.page_type ?? 'other',
            player_name: pageContext.player_name,
            set_name: pageContext.set_name,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Sorry, something went wrong. Try again.',
          suggestions: data.suggestions || [],
        },
      ]);
      setMessageCount((prev) => prev + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Try again in a moment.',
          suggestions: [],
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hey! I'm Boxx, your personal card advisor. Ask me about player card prices, what to list your cards for, or anything about the hobby.",
        suggestions: [
          'How much is a Bellingham PSA 10 worth?',
          'What should I list my Vini Jr auto for?',
          'Best cards to buy before the World Cup?',
        ],
      },
    ]);
    setMessageCount(0);
  };

  // ---- Peregro: intercept eBay link clicks inside assistant messages ----
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'A') return;
    const href = target.getAttribute('href') ?? '';
    if (/ebay\.[a-z.]+/i.test(href)) {
      logEvent({ event: 'affiliate_click', url: href });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '420px',
          background: '#faf7f0',
          borderLeft: '1px solid #e0d9cc',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e0d9cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#1a1a1a',
                  letterSpacing: '-0.01em',
                }}
              >
                Boxx Intel
              </div>
              <div style={{ fontSize: '12px', color: '#3aaa35', fontWeight: 500 }}>
                ● Beta · powered by Peregro
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={clearChat}
              title="New conversation"
              style={{
                background: 'none',
                border: '1px solid #e0d9cc',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#888',
                fontSize: '12px',
                padding: '4px 10px',
                fontFamily: 'inherit',
              }}
            >
              New chat
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                fontSize: '20px',
                padding: '4px',
                lineHeight: 1,
                borderRadius: '6px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Non-Pro Gate */}
        {!isPro ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '20px',
                color: '#1a1a1a',
                marginBottom: '10px',
                letterSpacing: '-0.02em',
              }}
            >
              Pro Feature
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#888',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              Boxx Intel is your AI-powered card advisor. Get live pricing insights, listing
              advice, and market analysis — exclusive to Pro members.
            </div>
            <a
              href="/upgrade"
              style={{
                background: '#3aaa35',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Upgrade to Pro
            </a>
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#aaa' }}>
              From £4.99/month · Cancel anytime
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
              onClick={handleMessageClick}
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: msg.imageUrl ? '6px' : '12px 16px',
                        borderRadius:
                          msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.role === 'user' ? '#3aaa35' : '#fff',
                        color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        border: msg.role === 'assistant' ? '1px solid #e0d9cc' : 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.imageUrl ? (
                        <img
                          src={msg.imageUrl}
                          alt="Uploaded card"
                          style={{
                            maxWidth: '240px',
                            maxHeight: '240px',
                            borderRadius: '12px',
                            display: 'block',
                          }}
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginTop: '8px',
                      }}
                    >
                      {msg.suggestions.map((s, si) => (
                        <button
                          key={si}
                          onClick={() => sendMessage(s)}
                          style={{
                            background: '#fff',
                            border: '1px solid #e0d9cc',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '13px',
                            color: '#555',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#3aaa35';
                            e.currentTarget.style.color = '#3aaa35';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e0d9cc';
                            e.currentTarget.style.color = '#555';
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: '#fff',
                      border: '1px solid #e0d9cc',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#3aaa35',
                          animation: 'bounce 1.2s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #e0d9cc',
                background: '#fff',
                flexShrink: 0,
              }}
            >
              {messageCount >= MAX_MESSAGES ? (
                <div
                  style={{
                    background: '#faf7f0',
                    border: '1px solid #e0d9cc',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                      marginBottom: '4px',
                    }}
                  >
                    Beta limit reached
                  </div>
                  <div style={{ fontSize: '13px', color: '#888' }}>
                    You've used your 5 free messages. Full access coming soon.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    background: '#faf7f0',
                    border: '1px solid #e0d9cc',
                    borderRadius: '12px',
                    padding: '8px 8px 8px 12px',
                  }}
                >
                  <input
                    ref={fileInputRef}
    type="file"
    accept="image/*"
    capture="environment"
    style={{ display: 'none' }}
    onChange={(e) => e.target.files?.[0] && sendImage(e.target.files[0])}
  />
  <button
    onClick={() => fileInputRef.current?.click()}
    disabled={uploadingImage || loading || !userId}
    title={!userId ? 'Sign in to upload photos' : 'Upload card photo'}
    style={{
      background: 'none',
      border: 'none',
      cursor: !userId ? 'default' : 'pointer',
      padding: '4px 6px',
      fontSize: '18px',
      color: !userId ? '#ccc' : uploadingImage ? '#ccc' : '#888',
      flexShrink: 0,
    }}
  >
    📷
  </button>
  <input
    ref={inputRef}
    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about any card or player..."
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      background: input.trim() && !loading ? '#3aaa35' : '#e0d9cc',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      cursor: input.trim() && !loading ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'background 0.15s',
                      flexShrink: 0,
                    }}
                  >
                    ↑
                  </button>
                </div>
              )}
              {imageError && (
  <div
    style={{
      fontSize: '12px',
      color: '#dc3545',
      textAlign: 'center',
      marginTop: '8px',
    }}
  >
    {imageError}
  </div>
)}
<div
  style={{
    fontSize: '11px',
    color: '#ccc',
    textAlign: 'center',
    marginTop: '8px',
  }}
>
  Powered by BoxxHQ · Prices from eBay UK
</div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}