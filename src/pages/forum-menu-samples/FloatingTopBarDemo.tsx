export default function FloatingTopBarDemo() {
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
      {/* Floating Top Bar - Glassmorphic */}
      <div style={{
        position: 'sticky',
        top: '20px',
        zIndex: 100,
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(24, 24, 27, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          {/* Forum Logo */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            🧠
          </div>

          {/* Navigation Items */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flex: 1
          }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              whiteSpace: 'nowrap'
            }}>
              Topics
            </div>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#a1a1aa',
              whiteSpace: 'nowrap'
            }}>
              Trending 🔥
            </div>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#a1a1aa',
              whiteSpace: 'nowrap'
            }}>
              Members 👥
            </div>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#a1a1aa',
              whiteSpace: 'nowrap'
            }}>
              Leaderboard 🏆
            </div>
          </div>

          {/* Right Side Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Search */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#a1a1aa'
            }}>
              🔍
            </div>

            {/* Notifications */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#a1a1aa',
              position: 'relative'
            }}>
              🔔
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: '#ef4444',
                borderRadius: '50%'
              }} />
            </div>

            {/* User Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px'
            }}>
              DB
            </div>

            {/* Settings */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#a1a1aa'
            }}>
              ⚙️
            </div>
          </div>
        </div>

        {/* Stats Pill (below top bar) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '12px'
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
      </div>

      {/* Topic Header */}
      <div style={{
        background: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        maxWidth: '680px',
        margin: '0 auto',
        position: 'sticky',
        top: '140px'
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