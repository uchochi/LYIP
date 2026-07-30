import { useState } from 'react';

export default function SlideOutPanelDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#09090b',
      color: '#fafafa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      gap: '16px'
    }}>
      {/* Slide-out Panel (Animated) */}
      <div style={{
        position: 'fixed',
        left: '0',
        top: '0',
        bottom: '0',
        width: '280px',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 200,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Forum Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🧠
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2px' }}>
              LYIP Community
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
              Dataset Training Forum
            </div>
          </div>
        </div>

        {/* User Quick Stats */}
        <div style={{
          background: 'rgba(24, 24, 27, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              DB
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>DataBeast_99</div>
              <div style={{
                fontSize: '0.7rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: '99px',
                display: 'inline-block'
              }}>
                💎 Level 7
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
              <div>🔥 142 posts</div>
              <div>⭐ Reputation</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
              <div>❤️ 890 likes</div>
              <div>🏆 Top 5%</div>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#a1a1aa',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Browse
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}>
            <span>📚</span>
            <span style={{ flex: 1 }}>Topics</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>1,234</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>🚀</span>
            <span style={{ flex: 1 }}>Trending</span>
            <span style={{ fontSize: '0.75rem' }}>🔥</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>👥</span>
            <span style={{ flex: 1 }}>Members</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>142K</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>🏆</span>
            <span style={{ flex: 1 }}>Leaderboard</span>
            <span style={{ fontSize: '0.75rem' }}>⭐</span>
          </div>

          <div style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#a1a1aa',
            marginTop: '16px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Resources
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>📖</span>
            <span>Guidelines</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>⚡</span>
            <span>Resources</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#a1a1aa',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}>
            <span>❓</span>
            <span>Help</span>
          </div>
        </div>

        {/* Create Topic Button */}
        <button style={{
          width: '100%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
          border: 'none',
          borderRadius: '10px',
          padding: '12px',
          color: 'white',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}>
          ✨ Create Topic
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 150
          }}
        />
      )}

      {/* Top Bar with Toggle Button */}
      <div style={{
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>

        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(24, 24, 27, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '99px',
            padding: '6px 16px',
            display: 'flex',
            gap: '20px',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.02em',
            color: '#a1a1aa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👥</span>
              <b>142,804</b>
              <span>MEMBERS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                background: '#ef4444',
                borderRadius: '50%',
                boxShadow: '0 0 8px #ef4444',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: '#ef4444' }}>2,105</span>
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Topic Header */}
      <div style={{
        background: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '700',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(90deg, #fff, #a1a1aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📦 Dataset Training Community
        </h2>
      </div>

      {/* Sample Topic Card */}
      <div style={{
        background: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.75rem'
          }}>
            DB
          </div>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>DataBeast_99</span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '99px',
            textTransform: 'uppercase',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            PRO
          </span>
          <span style={{ fontSize: '0.75rem', color: '#a1a1aa', marginLeft: 'auto' }}>4m ago</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Sample topic content goes here...
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}