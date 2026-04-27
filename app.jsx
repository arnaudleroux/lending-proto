// app.jsx — Lending prototype shell.
// iPhone frame + 5-screen slide-transition routing for the lending flow.

const { useState, useEffect, useRef } = React;

function Prototype() {
  const [stack, setStack] = useState([{ id: 'home' }]);
  const [direction, setDirection] = useState('forward');
  // bumps on every navigation — used to retrigger entry animations on revisit
  const [navTick, setNavTick] = useState(0);

  // shared loan state
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState('12');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // loan math
  const apr = 0.09;
  const months = parseInt(term, 10);
  const r = apr / 12;
  const monthly = (amount * r) / (1 - Math.pow(1 + r, -months));
  const total = monthly * months;
  const interest = total - amount;

  const push = (id) => { setNavTick(t => t + 1); setDirection('forward'); setStack((s) => [...s, { id }]); };
  const pop = () => { setNavTick(t => t + 1); setDirection('back'); setStack((s) => s.length > 1 ? s.slice(0, -1) : s); };
  const reset = () => { setNavTick(t => t + 1); setDirection('back'); setStack([{ id: 'home' }]); };

  const handleConfirm = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setNavTick(t => t + 1);
      setDirection('forward');
      setStack((s) => [...s, { id: 'success' }]);
    }, 1100);
  };

  const renderScreen = (id) => {
    switch (id) {
      case 'home':
        return <ScreenHome onPrimary={() => push('offer')} />;
      case 'offer':
        return <ScreenOffer
          amount={amount} onAmount={setAmount}
          term={term} onTerm={setTerm}
          onPrimary={() => push('confirm')}
          onBack={pop}
          onDecline={pop} />;
      case 'confirm':
        return <ScreenConfirm
          amount={amount} term={months} monthly={monthly} total={total} interest={interest}
          loading={confirmLoading}
          onPrimary={handleConfirm}
          onBack={pop} />;
      case 'success':
        return <ScreenSuccess
          amount={amount} monthly={monthly}
          animateIn replayKey={navTick}
          onPrimary={() => push('schedule')}
          onSecondary={reset}
          onClose={reset} />;
      case 'schedule':
        return <ScreenSchedule
          amount={amount} term={months} monthly={monthly} total={total}
          onBack={pop} />;
      default: return null;
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#FFFFFF',
      padding: 24, boxSizing: 'border-box',
    }}>
      <Phone>
        <SlideStack stack={stack} direction={direction} renderScreen={renderScreen} />
      </Phone>
    </div>
  );
}

function Phone({ children }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 54, position: 'relative',
      background: '#0c0c0c',
      boxShadow: '0 50px 100px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.04)',
      padding: 12, boxSizing: 'border-box',
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 100,
      }} />
      {/* Screen */}
      <div style={{
        width: '100%', height: '100%', borderRadius: 42, overflow: 'hidden',
        background: 'var(--lumen-neutral-50)', position: 'relative',
      }}>
        {children}
        {/* Fixed status bar — above slide transitions */}
        <window.StatusBar />
        {/* Home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 999, background: 'rgba(0,0,0,0.3)', zIndex: 200,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

function SlideStack({ stack, direction, renderScreen }) {
  const prev = useRef(stack);
  const [render, setRender] = useState({ entries: stack, direction: 'forward', transitionKey: 0 });

  useEffect(() => {
    if (prev.current === stack) return;
    const last = prev.current[prev.current.length - 1];
    const next = stack[stack.length - 1];
    if (!last || !next || last.id === next.id) {
      setRender({ entries: stack, direction, transitionKey: render.transitionKey + 1 });
      prev.current = stack;
      return;
    }
    if (direction === 'forward') {
      setRender({ entries: [last, next], direction: 'forward', transitionKey: render.transitionKey + 1 });
    } else {
      setRender({ entries: [next, last], direction: 'back', transitionKey: render.transitionKey + 1 });
    }
    const tm = setTimeout(() => {
      setRender({ entries: [next], direction, transitionKey: render.transitionKey + 1 });
    }, 360);
    prev.current = stack;
    return () => clearTimeout(tm);
  }, [stack, direction]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {render.entries.map((e, i) => {
        const isLast = i === render.entries.length - 1;
        let anim = 'none';
        if (render.entries.length > 1) {
          if (render.direction === 'forward') {
            anim = isLast ? 'slideInFromRight 360ms cubic-bezier(.2,.85,.25,1) both' : 'slideOutToLeft 360ms cubic-bezier(.2,.85,.25,1) both';
          } else {
            anim = isLast ? 'slideOutToRight 360ms cubic-bezier(.2,.85,.25,1) both' : 'slideInFromLeft 360ms cubic-bezier(.2,.85,.25,1) both';
          }
        }
        return (
          <div key={e.id + '-' + i + '-' + render.transitionKey} style={{
            position: 'absolute', inset: 0, animation: anim,
            background: 'var(--lumen-neutral-50)',
          }}>
            {renderScreen(e.id)}
          </div>
        );
      })}
      <style>{`
        @keyframes slideInFromRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOutToLeft   { from { transform: translateX(0); } to { transform: translateX(-22%); } }
        @keyframes slideInFromLeft  { from { transform: translateX(-22%); } to { transform: translateX(0); } }
        @keyframes slideOutToRight  { from { transform: translateX(0); } to { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Prototype />);
