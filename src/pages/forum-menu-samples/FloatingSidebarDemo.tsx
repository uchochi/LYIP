export default function FloatingSidebarDemo() {
  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#09090b',
      color: '#fafafa',
      minHeight: '100vh',
      display: 'flex',
      padding: '20px'
    }}>
      {/* Floating Sidebar - Left Side */}
      <div style={{
        position: 'fixed',
        left: '20px',
        top: '20px',
        bottom: '20px',
        width: '64px',
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 100
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
          marginBottom: '12px',
          cursor: 'pointer'
        }}>
          🧠
        </div>

        {/* Menu Items */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#3b82f6'
        }}>
          📚
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          🚀
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          👥
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          🏆
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          📖
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          ⚡
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          ❓
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom User & Settings */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          👤
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          color: '#a1a1aa'
        }}>
          ⚙️
        </div>
      </div>

      {/* Main Content Area (Sample Forum Content) */}
      <div style={{
        marginLeft: '100px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Stats Pill */}
        <div style={{
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

        {/* Topic Header */}
        <div style={{
          background: '#18181b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px'
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
          padding: '16px'
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