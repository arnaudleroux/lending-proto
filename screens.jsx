// screens.jsx — Lending flow screens, built on Lumen DS tokens.
// Each screen is a pure presentational component; the container handles routing/transitions.

const FOREST = 'var(--lumen-brand-forest)';      // #00362C — primary brand surface
const ACCENT = 'var(--lumen-accent-500)';        // #3A66EB — primary filled CTA
const ACCENT_HOVER = 'var(--lumen-accent-600)';  // #2F50E1
const SUCCESS = 'var(--lumen-success-700)';      // #198447
const SUCCESS_100 = 'var(--lumen-success-100)';  // #C9EEDA — mint chip
const CANVAS = 'var(--lumen-neutral-50)';         // #F7F8F8
const SURFACE = '#FFFFFF';
const FG = 'var(--fg-primary)';                  // #25272C
const FG2 = 'var(--fg-tertiary)';                // #6B7280
const BORDER = 'var(--border-subtle)';           // #EDEEF1
const BORDER2 = 'var(--border-default)';         // #D8DBDF

// ────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ────────────────────────────────────────────────────────────────────────────

function Icon({ name, size = 20, color = 'currentColor', stroke = 1.75 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrow-left':  return <svg {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case 'x':           return <svg {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case 'check':       return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
    case 'more':        return <svg {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
    case 'info':        return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
    case 'chev-down':   return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case 'eye':         return <svg {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'bell':        return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
    case 'user':        return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>;
    case 'send':        return <svg {...p}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
    case 'receive':     return <svg {...p}><path d="M17 7 7 17"/><path d="M17 17H7V7"/></svg>;
    case 'bank':        return <svg {...p}><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>;
    default: return null;
  }
}

function StatusBar({ dark = false }) {
  const c = dark ? 'rgba(255,255,255,0.9)' : FG;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', pointerEvents: 'none',
    }}>
      <span style={{ fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 600,
        fontSize: 15, color: c, letterSpacing: '-0.01em' }}>9:41</span>
    </div>
  );
}

function NavBar({ title, onBack, onClose }) {
  return (
    <div style={{
      height: 48, display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px', position: 'relative',
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', width: 32, height: 32, marginLeft: -6,
          color: FOREST,
        }}>
          <Icon name="arrow-left" size={22} stroke={2} />
        </button>
      )}
      {title && <span style={{
        fontWeight: 700, fontSize: 17, color: FG, letterSpacing: '-0.01em',
      }}>{title}</span>}
      {onClose && (
        <button onClick={onClose} aria-label="Close" style={{
          all: 'unset', cursor: 'pointer', marginLeft: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, color: FG,
        }}>
          <Icon name="x" size={22} stroke={2} />
        </button>
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, color = ACCENT, fg = '#fff', loading = false, style: extraStyle = {} }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      all: 'unset', cursor: loading ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: 52, borderRadius: 9999, background: color,
      color: fg, fontWeight: 600, fontSize: 16, lineHeight: '24px',
      letterSpacing: '-0.005em', boxSizing: 'border-box',
      transition: 'filter 120ms ease',
      ...extraStyle,
    }}
    onMouseDown={(e) => !loading && (e.currentTarget.style.filter = 'brightness(0.92)')}
    onMouseUp={(e) => (e.currentTarget.style.filter = 'none')}
    onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

function TextButton({ children, onClick, color = FOREST, style: extraStyle = {} }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', textAlign: 'center', width: '100%',
      padding: '14px 8px', fontWeight: 600, fontSize: 14, color, ...extraStyle,
    }}>{children}</button>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: '50%', background: '#fff',
          animation: `dotPulse 1s ${i * 0.15}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`@keyframes dotPulse { 0%,80%,100%{opacity:.3;transform:scale(.7)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

function ScreenShell({ children, bg = CANVAS }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, position: 'relative',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>{children}</div>
  );
}

function ScrollArea({ children }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', minHeight: 0, position: 'relative' }}>
      {children}
    </div>
  );
}

function BottomCta({ children }) {
  return (
    <div style={{
      flexShrink: 0, background: SURFACE,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: '14px 20px 36px',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.05)',
    }}>{children}</div>
  );
}

function Pill({ children, bg, fg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 26,
      padding: '0 10px', borderRadius: 999, background: bg, color: fg,
      fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>{children}</span>
  );
}

function KV({ label, value, color = FOREST }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: FG2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, marginTop: 4, letterSpacing: '-0.015em' }}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0' }}>
      <span style={{ fontSize: 14, color: FG2 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500,
        color: accent ? FOREST : FG }}>{value}</span>
    </div>
  );
}

function AdobeCCLogo() {
  return (
    <img src="assets/adobe-cc.svg" alt="Adobe Creative Cloud"
      style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'block', objectFit: 'cover',
      }} />
  );
}

function UberLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 10, display: 'block' }}>
      <path d="M0 0h400v400H0z"/>
      <path fill="#fff" d="M109.9 173.9v30.3c0 10.1-4.5 14.3-15 14.3s-15-4.2-15-14.3v-31.6h-10c-.9 0-1.3.4-1.3 1.3v30.7c0 16.9 10.8 22.8 26.4 22.8 15.6 0 26.4-5.9 26.4-22.8v-32.1h-10.1c-.9.1-1.4.5-1.4 1.4z"/>
      <path fill="#fff" d="M256.4 181.3c.8 0 1.2-.3 1.5-.9l2.9-7.2c.2-.4 0-.7-.4-.7h-40.7c-3.8 0-5.2 1.2-5.2 3.8v47c0 2.2 1.1 3.2 4 3.2h37.9c.8 0 1.2-.3 1.5-.9l2.9-7.2c.2-.4 0-.7-.4-.7h-34.7v-9.6c0-3.3 1.8-4.8 6.7-4.8h15.1c.8 0 1.2-.3 1.5-.9l2.8-7c.2-.4 0-.7-.4-.7h-25.7v-13.5h30.7z"/>
      <path fill="#fff" d="M184.7 198.1c4.4-2.3 6.2-6.7 6.2-11.8 0-11.9-9.7-13.7-19.8-13.7h-23c-3.8 0-5.2 1.2-5.2 3.8v47c0 2.2 1.1 3.2 4 3.2h28.3c10.7 0 18.3-4.1 18.3-14.9.1-6.6-2.7-12-8.8-13.6zm-30.5-16.9H172c6 0 7.6 2.2 7.6 6.9s-1.7 6.9-7.6 6.9h-17.8v-13.8zm19.9 36.6h-19.9v-9.9c0-3.3 1.8-4.8 6.7-4.8h13.2c6.3 0 8.1 2.4 8.1 7.4.1 5-1.7 7.3-8.1 7.3z"/>
      <path fill="#fff" d="M331.3 225.6l-12.1-20.8c6-1.5 10.9-5.5 10.9-15.6 0-13.1-8.1-16.6-21.5-16.6h-23.1c-3.8 0-5.2 1.2-5.2 3.8v48.9c0 .9.4 1.3 1.3 1.3h9.9v-15.7c0-3.3 1.8-4.8 6.7-4.8h9.9l10.9 19.7c.3.6.7.9 1.5.9h10.3c.7-.2.7-.8.5-1.1zm-21.1-28h-18.8v-16.3h18.8c7 0 8.6 2.7 8.6 8.2 0 5.4-1.6 8.1-8.6 8.1z"/>
    </svg>
  );
}

function SASLogo() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      background: '#C8E9F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic',
        fontWeight: 700, fontSize: 14, color: '#0A1172', letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>SAS</span>
    </div>
  );
}

function Tx({ name, date, amount, positive, logo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      {logo
        ? <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, overflow: 'hidden' }}>{logo}</div>
        : <div style={{ width: 36, height: 36, borderRadius: 10, background: CANVAS, flexShrink: 0 }} />
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: FG, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontSize: 12, color: FG2, marginTop: 2 }}>{date}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: positive ? SUCCESS : FG }}>
        {amount}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(0,0,0,0.05)' }} />;
}

// ────────────────────────────────────────────────────────────────────────────
// Shine logo
// ────────────────────────────────────────────────────────────────────────────

function ShineLogo() {
  return (
    <svg width="90" height="20" viewBox="0 0 117 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shine">
      <path d="M28.6226 17.6619C22.2352 17.6619 17.0366 12.3355 17.0366 5.83551V5.74523H11.7138V5.83551C11.7138 8.1683 12.1609 10.4289 13.048 12.5522C13.0516 12.5666 13.0658 12.5955 13.0693 12.6064H9.60947L9.59527 12.6244C7.42356 15.7553 3.88566 17.6619 0.124199 17.6619H0V23.0786H0.124199C5.92253 23.0786 11.2418 20.0742 14.3716 15.1017C17.4979 20.0742 22.8207 23.0786 28.619 23.0786H28.7432V17.6619H28.619H28.6226Z" fill="#003725"/>
      <path d="M54.1576 2.49538H59.1646V9.53707C60.0695 8.28762 62.1986 7.13929 64.718 7.13929C68.625 7.13929 71.3716 9.76818 71.3716 13.7115V25.6066H66.4001V15.0585C66.4001 12.9893 65.2361 11.6062 63.2348 11.6062C60.7792 11.6062 59.1646 13.5454 59.1646 17.4563V25.6066H54.1576V2.49538Z" fill="#003725"/>
      <path d="M80.2038 7.55087H85.2108V9.53699C86.0837 8.32004 88.2128 7.13921 90.7643 7.13921C94.6712 7.13921 97.4178 9.7681 97.4178 13.6789V25.6065H92.4463V15.0259C92.4463 12.9892 91.2823 11.6098 89.281 11.6098C86.8254 11.6098 85.2108 13.5489 85.2108 17.4598V25.6101H80.2038V7.55449V7.55087Z" fill="#003725"/>
      <path d="M98.4942 16.5024C98.4942 11.046 102.273 7.13516 107.536 7.13516C113.512 7.13516 117.096 11.7682 116.287 17.6832H103.402C103.789 20.3771 105.435 21.6591 107.727 21.6591C109.601 21.6591 110.797 20.8719 111.12 19.6224H116.255C115.577 23.2372 112.38 25.8661 107.731 25.8661C102.014 25.8661 98.4942 21.9552 98.4942 16.4988V16.5024ZM111.091 14.036C110.996 12.1618 109.605 10.981 107.539 10.981C105.474 10.981 104.147 11.9993 103.601 14.036H111.091Z" fill="#003725"/>
      <path d="M41.2089 8.77915C41.2089 7.5297 42.2734 6.77498 43.9874 6.77498C45.893 6.77498 47.4117 7.85831 47.7347 9.56637H52.7062C52.2236 5.0958 48.8631 2.33691 43.9874 2.33691C39.6262 2.33691 36.1061 5.0308 36.1061 9.00665C36.1061 17.4856 47.7311 14.9217 47.7311 19.0311C47.7311 20.5767 46.3756 21.4289 44.5339 21.4289C42.0002 21.4289 40.4956 20.0061 40.1337 17.6589H35.1551C35.627 22.7036 39.0656 25.867 44.5339 25.867C49.3457 25.867 52.8659 23.0395 52.8659 18.7025C52.8659 9.76498 41.2089 12.3939 41.2089 8.77915Z" fill="#003725"/>
      <path d="M78.2128 7.55051H73.2058V25.6061H78.2128V7.55051Z" fill="#003725"/>
      <path d="M75.7114 5.74201C77.2695 5.74201 78.5325 4.45669 78.5325 2.87116C78.5325 1.28564 77.2695 0.000320435 75.7114 0.000320435C74.1534 0.000320435 72.8903 1.28564 72.8903 2.87116C72.8903 4.45669 74.1534 5.74201 75.7114 5.74201Z" fill="#003725"/>
    </svg>
  );
}

function HeaderIcon({ children }) {
  return (
    <button style={{
      all: 'unset', cursor: 'pointer', width: 36, height: 36,
      borderRadius: '50%', background: 'var(--lumen-neutral-100)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--lumen-neutral-700)',
    }}>{children}</button>
  );
}

function ActionPill({ icon, label }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8 }}>
      <button style={{
        all: 'unset', cursor: 'pointer', width: '100%', maxWidth: 80, height: 44,
        borderRadius: 9999, background: 'var(--lumen-accent-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--lumen-neutral-950)',
      }}>{icon}</button>
      <span style={{ fontSize: 13, fontWeight: 500, color: FG, letterSpacing: '-0.005em' }}>
        {label}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 01 — Home
// ────────────────────────────────────────────────────────────────────────────

function ScreenHome({ onPrimary }) {
  return (
    <ScreenShell>
      <ScrollArea>
      <div style={{ paddingTop: 52 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px 4px' }}>
          <ShineLogo />
          <div style={{ display: 'flex', gap: 8 }}>
            <HeaderIcon><Icon name="eye" size={18} stroke={1.8} /></HeaderIcon>
            <HeaderIcon><Icon name="bell" size={18} stroke={1.8} /></HeaderIcon>
            <HeaderIcon><Icon name="user" size={18} stroke={1.8} /></HeaderIcon>
          </div>
        </div>

        {/* Accounts card */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            borderRadius: 18, border: '1px solid var(--lumen-neutral-150)',
            background: SURFACE, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', background: 'var(--lumen-neutral-50)',
              borderBottom: '1px solid var(--lumen-neutral-150)',
            }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#25241D', letterSpacing: '-0.005em' }}>
                Accounts
              </span>
              <Icon name="chev-down" size={20} color="#25241D" stroke={1.6} />
            </div>
            <button style={{
              all: 'unset', cursor: 'pointer', display: 'flex', width: '100%',
              alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '16px 18px', boxSizing: 'border-box',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#25241D', letterSpacing: '-0.005em' }}>
                  Balance
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#25241D',
                  letterSpacing: '-0.02em', marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
                  €1,425.49
                </div>
              </div>
              <div style={{ paddingTop: 4 }}>
                <Icon name="arrow-right" size={20} color="#25241D" stroke={1.6} />
              </div>
            </button>
          </div>
        </div>

        {/* Actions row */}
        <div style={{ padding: '24px 18px 4px', display: 'flex', gap: 12 }}>
          <ActionPill label="Send" icon={<Icon name="send" size={24} stroke={1.5} />} />
          <ActionPill label="Receive" icon={<Icon name="receive" size={24} stroke={1.5} />} />
          <ActionPill label="View IBAN" icon={<Icon name="bank" size={24} stroke={1.5} />} />
        </div>

        {/* Pre-approved loan card */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{
            background: SURFACE, border: `1.5px solid ${SUCCESS_100}`, borderRadius: 18,
            padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
              flexWrap: 'nowrap' }}>
              <Pill bg={SUCCESS_100} fg={SUCCESS}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: SUCCESS, flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap' }}>Pre-approved</span>
              </Pill>
              <span style={{ fontSize: 12, color: FG2, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                Personalised for you
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
              color: '#25241D', lineHeight: '1.15' }}>
              You&apos;re pre-approved<br/>for a loan
            </h2>

            <div style={{ display: 'flex', gap: 32, marginTop: 16, marginBottom: 18 }}>
              <KV label="Up to" value="€10,000" />
              <KV label="Interest rate" value="9% APR" />
            </div>

            <PrimaryButton onClick={onPrimary}>See your offer</PrimaryButton>
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ padding: '20px 18px 24px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: '#25241D', letterSpacing: '-0.005em' }}>
            Recent activity
          </h3>
          <div style={{ background: SURFACE, borderRadius: 14, padding: '4px 16px',
            border: '1px solid #DEDCCE' }}>
            <Tx name="SAS" date="22 Apr" amount="–€238.40" logo={<SASLogo />} />
            <Divider />
            <Tx name="Uber" date="Yesterday" amount="–€29.12" logo={<UberLogo />} />
            <Divider />
            <Tx name="Adobe Creative Cloud" date="Today" amount="–€59.99" logo={<AdobeCCLogo />} />
          </div>
        </div>
      </div>
      </ScrollArea>
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 02 — Offer detail
// ────────────────────────────────────────────────────────────────────────────

function ScreenOffer({ amount, onAmount, term, onTerm, onPrimary, onBack, onDecline }) {
  const apr = 0.09;
  const months = parseInt(term, 10);
  const r = apr / 12;
  const monthly = (amount * r) / (1 - Math.pow(1 + r, -months));
  const total = monthly * months;
  const interest = total - amount;
  const fmt = (n) => n.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });

  return (
    <ScreenShell>
      <ScrollArea>
      <div style={{ paddingTop: 44 }}>
        <NavBar title="Your loan offer" onBack={onBack} />

        <div style={{ padding: '8px 20px 24px' }}>
          {/* Hero amount */}
          <div style={{
            background: SURFACE, borderRadius: 18, padding: '28px 24px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 14, color: FG2 }}>Loan amount</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: FOREST, letterSpacing: '-0.03em',
              lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(amount).replace(/[.,]00$/, '')}
            </div>

            <div style={{ width: '100%', marginTop: 4 }}>
              <input type="range" min="2000" max="10000" step="500" value={amount}
                onChange={(e) => onAmount(parseInt(e.target.value, 10))}
                style={{
                  width: '100%', height: 6, accentColor: 'var(--lumen-accent-500)',
                  cursor: 'pointer',
                }} />
              <div style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: FG2, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                <span>€2,000</span><span>€10,000</span>
              </div>
            </div>

            <div style={{
              background: SUCCESS_100, color: SUCCESS, borderRadius: 10,
              padding: '8px 14px', fontSize: 13, fontWeight: 500,
            }}>
              9% APR – fixed rate
            </div>
          </div>

          {/* Term selector */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: FG, letterSpacing: '-0.01em' }}>
              Repayment term
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['6', '12', '24', '36'].map((t) => {
                const active = t === term;
                return (
                  <button key={t} onClick={() => onTerm(t)} style={{
                    all: 'unset', cursor: 'pointer', boxSizing: 'border-box',
                    flex: 1, height: 56, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? 'var(--lumen-neutral-950)' : SURFACE,
                    color: active ? '#fff' : FG,
                    border: `1.5px solid ${active ? 'var(--lumen-neutral-950)' : BORDER}`,
                    fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em',
                    transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
                  }}>{t} mo</button>
                );
              })}
            </div>
          </div>

          {/* Repayment breakdown */}
          <div style={{ marginTop: 16, background: SURFACE, borderRadius: 18, padding: 20 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: FG, letterSpacing: '-0.01em' }}>
              Repayment breakdown
            </h4>
            <div style={{ height: 1, background: BORDER, margin: '12px 0' }} />
            <Row label="Monthly repayment" value={fmt(monthly)} bold />
            <Row label="Number of payments" value={`${months} months`} />
            <Row label="Interest rate" value="9.00% APR" />
            <Row label="Total interest" value={fmt(interest)} />
            <div style={{ height: 1, background: BORDER, margin: '8px 0' }} />
            <Row label="Total amount repayable" value={fmt(total)} bold accent />
          </div>

          {/* Info callout */}
          <div style={{
            marginTop: 16, display: 'flex', gap: 10,
            background: 'rgba(194,212,251,0.35)', borderRadius: 12, padding: '12px 14px',
          }}>
            <div style={{ color: 'var(--lumen-accent-600)', flexShrink: 0, paddingTop: 1 }}>
              <Icon name="info" size={16} stroke={2} />
            </div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.4 }}>
              No early repayment fees. You can pay off your loan at any time without penalty.
            </div>
          </div>
        </div>
      </div>
      </ScrollArea>

      <BottomCta>
        <PrimaryButton onClick={onPrimary}>Accept offer</PrimaryButton>
        <div style={{ display: 'flex', marginTop: 4 }}>
          <TextButton color={ACCENT_HOVER}>Adjust terms</TextButton>
          <TextButton onClick={onDecline} color={FG2}>Decline</TextButton>
        </div>
      </BottomCta>
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 03 — Confirmation
// ────────────────────────────────────────────────────────────────────────────

function ScreenConfirm({ amount, term, monthly, total, interest, onPrimary, onBack, loading }) {
  const [c1, setC1] = React.useState(true);
  const [c2, setC2] = React.useState(true);
  const fmt = (n) => n.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });
  const canConfirm = c1 && c2 && !loading;

  return (
    <ScreenShell>
      <ScrollArea>
      <div style={{ paddingTop: 44 }}>
        <NavBar title="Confirm your loan" onBack={onBack} />

        <div style={{ padding: '8px 20px 24px' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 999, background: SUCCESS }} />
            <span style={{ flex: 1, height: 4, borderRadius: 999, background: SUCCESS }} />
            <span style={{ flex: 1, height: 4, borderRadius: 999, background: BORDER }} />
          </div>

          <h2 style={{ margin: '4px 0 16px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: FG }}>
            Review your loan agreement
          </h2>

          {/* Summary card */}
          <div style={{ background: SURFACE, borderRadius: 18, padding: 20 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: FG, letterSpacing: '-0.01em' }}>
              Loan summary
            </h4>
            <div style={{ height: 1, background: BORDER, margin: '12px 0' }} />
            <Row label="Loan amount" value={fmt(amount)} bold />
            <Row label="Interest rate" value="9.00% APR (fixed)" />
            <Row label="Term" value={`${term} months`} />
            <Row label="Monthly repayment" value={fmt(monthly)} bold />
            <Row label="Total repayable" value={fmt(total)} bold accent />
            <div style={{ height: 1, background: BORDER, margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '8px 0', gap: 16 }}>
              <span style={{ fontSize: 14, color: FG2 }}>Disbursement</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: FG, textAlign: 'right' }}>
                Instant to your Shine account
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: 14, color: FG2 }}>First payment</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: FG }}>23 May 2026</span>
            </div>
          </div>

          {/* Consents */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Checkbox checked={c1} onToggle={() => setC1(!c1)}
              label="I have read and accept the loan agreement and the Standard European Consumer Credit Information (SECCI) document." />
            <Checkbox checked={c2} onToggle={() => setC2(!c2)}
              label="I confirm the information provided is accurate and I authorise Shine to disburse the funds to my account." />
            <a style={{ fontSize: 13, fontWeight: 600, color: 'var(--lumen-accent-600)', cursor: 'pointer' }}>
              View full terms and conditions →
            </a>
          </div>
        </div>
      </div>
      </ScrollArea>

      <BottomCta>
        <PrimaryButton onClick={canConfirm ? onPrimary : undefined} loading={loading}
          style={!canConfirm && !loading ? { opacity: 0.4, cursor: 'not-allowed' } : {}}>
          Confirm and receive funds
        </PrimaryButton>
        <TextButton onClick={onBack} color={FG2}>Go back</TextButton>
      </BottomCta>
    </ScreenShell>
  );
}

function Checkbox({ checked, onToggle, label }) {
  return (
    <div onClick={onToggle} style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: checked ? ACCENT : '#fff',
        border: checked ? 'none' : `1.5px solid ${BORDER2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 140ms ease',
      }}>
        {checked && <Icon name="check" size={14} color="#fff" stroke={3} />}
      </div>
      <span style={{ fontSize: 13, color: FG, lineHeight: 1.45 }}>{label}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 04 — Success
// ────────────────────────────────────────────────────────────────────────────

function ScreenSuccess({ amount, monthly, onPrimary, onClose, onSecondary, animateIn, replayKey }) {
  const fmt = (n) => n.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });
  const prevBalance = 1425.49;
  const newBalance = prevBalance + amount;

  return (
    <ScreenShell>
      <ScrollArea>
      <div style={{ paddingTop: 44 }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 20px' }}>
          <button onClick={onClose} aria-label="Close" style={{
            all: 'unset', cursor: 'pointer', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: FG,
          }}>
            <Icon name="x" size={22} stroke={2} />
          </button>
        </div>

        <div style={{ padding: '24px 20px 24px' }}>
          {/* Success hero */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 0 32px' }}>
            <SuccessOrb animateIn={animateIn} replayKey={replayKey} />
            <h1 style={{ margin: '20px 0 6px', fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em',
              color: FG, textAlign: 'center' }}>
              Your loan is active
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: FG2, textAlign: 'center', maxWidth: 280, lineHeight: 1.45 }}>
              {fmt(amount)} has been added to your Shine account
            </p>
          </div>

          {/* Updated balance card */}
          <div style={{
            background: FOREST, borderRadius: 18, padding: '20px 22px 22px',
            color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Updated account balance</div>
            <div style={{
              background: SUCCESS, color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '4px 8px', borderRadius: 6, marginTop: 8, marginBottom: 4,
              display: 'inline-block', width: 'fit-content',
            }}>
              +{fmt(amount).replace(/[.,]00$/, '')}
            </div>
            <div style={{ marginTop: 4 }}>
              <CountUp from={prevBalance} to={newBalance} duration={1100} animate={animateIn} replayKey={replayKey} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>
              Previous balance: {fmt(prevBalance)}
            </div>
          </div>

          {/* Loan details */}
          <div style={{ marginTop: 16, background: SURFACE, borderRadius: 18, padding: 20 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: FG, letterSpacing: '-0.01em' }}>
              Loan details
            </h4>
            <div style={{ height: 1, background: BORDER, margin: '12px 0' }} />
            <Row label="Loan reference" value="SHLN-20260427-9F8A" />
            <Row label="Monthly repayment" value={fmt(monthly)} bold />
            <Row label="First payment date" value="27 May 2026" />
            <Row label="End date" value="27 April 2027" />
          </div>
        </div>
      </div>
      </ScrollArea>

      <BottomCta>
        <PrimaryButton onClick={onPrimary}>View repayment schedule</PrimaryButton>
        <TextButton onClick={onSecondary} color={FG2}>Back to home</TextButton>
      </BottomCta>
    </ScreenShell>
  );
}

function SuccessOrb({ animateIn, replayKey }) {
  const [played, setPlayed] = React.useState(false);
  React.useEffect(() => {
    setPlayed(false);
    if (animateIn) {
      const t = setTimeout(() => setPlayed(true), 50);
      return () => clearTimeout(t);
    }
    setPlayed(true);
  }, [animateIn, replayKey]);
  return (
    <div style={{
      position: 'relative', width: 96, height: 96, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      transform: played ? 'scale(1)' : 'scale(0.6)',
      opacity: played ? 1 : 0,
      transition: 'transform 480ms cubic-bezier(.2,.8,.2,1), opacity 280ms ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: SUCCESS_100,
      }} />
      {played && <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: SUCCESS_100, opacity: 0.55,
        animation: 'orbRipple 1.4s 0.25s ease-out forwards',
      }} />}
      <div style={{ position: 'relative', color: SUCCESS, display: 'flex' }}>
        <Icon name="check" size={44} color={SUCCESS} stroke={2.4} />
      </div>
      <style>{`
        @keyframes orbRipple { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(2);opacity:0} }
      `}</style>
    </div>
  );
}

function CountUp({ from, to, duration, animate, replayKey }) {
  const [v, setV] = React.useState(animate ? from : to);
  React.useEffect(() => {
    if (!animate) { setV(to); return; }
    setV(from);
    let raf;
    let cancelled = false;
    const startDelay = setTimeout(() => {
      if (cancelled) return;
      const start = performance.now();
      const tick = (t) => {
        if (cancelled) return;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(from + (to - from) * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setV(to);
      };
      raf = requestAnimationFrame(tick);
    }, 380);
    return () => { cancelled = true; clearTimeout(startDelay); cancelAnimationFrame(raf); };
  }, [animate, from, to, duration, replayKey]);
  const fmt = v.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });
  return (
    <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1,
      fontVariantNumeric: 'tabular-nums' }}>{fmt}</span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 05 — Repayment schedule
// ────────────────────────────────────────────────────────────────────────────

function ScreenSchedule({ amount, term, monthly, total, onBack }) {
  const [showAll, setShowAll] = React.useState(false);
  const fmt = (n) => n.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });

  const apr = 0.09;
  const r = apr / 12;
  let bal = amount;
  const schedule = [];
  const baseMonth = 4; // May = index 4
  const baseYear = 2026;
  for (let i = 0; i < term; i++) {
    const interest = bal * r;
    const principal = monthly - interest;
    bal -= principal;
    const m = (baseMonth + i) % 12;
    const y = baseYear + Math.floor((baseMonth + i) / 12);
    const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m];
    schedule.push({ n: i + 1, label: `${monthName} ${y}`, principal, interest, total: monthly });
  }

  const visible = showAll ? schedule : schedule.slice(0, 5);

  return (
    <ScreenShell>
      <ScrollArea>
      <div style={{ paddingTop: 44 }}>
        <NavBar title="Repayment schedule" onBack={onBack} />

        <div style={{ padding: '8px 20px 24px' }}>
          {/* Overview strip */}
          <div style={{
            background: SURFACE, borderRadius: 14, padding: '16px 18px',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <Stat label="Remaining" value={fmt(total)} />
            <Stat label="Paid" value="€0.00" color={SUCCESS} />
            <Stat label="Payments left" value={`${term} of ${term}`} />
          </div>

          <h3 style={{ margin: '24px 0 12px', fontSize: 15, fontWeight: 700, color: FG,
            letterSpacing: '-0.01em' }}>
            Upcoming payments
          </h3>

          <div style={{ background: SURFACE, borderRadius: 18, overflow: 'hidden' }}>
            {visible.map((p, i) => (
              <React.Fragment key={p.n}>
                <PaymentRow {...p} active={i === 0} />
                {i < visible.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {!showAll && term > 5 && (
              <>
                <Divider />
                <button onClick={() => setShowAll(true)} style={{
                  all: 'unset', cursor: 'pointer', width: '100%',
                  textAlign: 'center', padding: '16px',
                  fontSize: 14, fontWeight: 600, color: FOREST,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxSizing: 'border-box',
                }}>
                  Show all {term} payments <Icon name="chev-down" size={16} stroke={2} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      </ScrollArea>

      <BottomCta>
        <button style={{
          all: 'unset', cursor: 'pointer', width: '100%', height: 52, borderRadius: 9999,
          background: '#fff', border: `1.5px solid ${BORDER2}`, color: FG,
          fontWeight: 600, fontSize: 16, lineHeight: '24px', letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>Make an early repayment</button>
      </BottomCta>
    </ScreenShell>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: FG2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || FG, marginTop: 4,
        letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

function PaymentRow({ n, label, principal, interest, total, active }) {
  const fmt = (v) => v.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: active ? SUCCESS_100 : 'rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: active ? SUCCESS : FG2 }}>{n}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: FG }}>{label}</div>
        <div style={{ fontSize: 11, color: FG2, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
          Principal {fmt(principal)} · Interest {fmt(interest)}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: FG, fontVariantNumeric: 'tabular-nums' }}>
        {fmt(total)}
      </div>
    </div>
  );
}

// expose to global scope for app.jsx
window.StatusBar = StatusBar;
window.ScreenHome = ScreenHome;
window.ScreenOffer = ScreenOffer;
window.ScreenConfirm = ScreenConfirm;
window.ScreenSuccess = ScreenSuccess;
window.ScreenSchedule = ScreenSchedule;
