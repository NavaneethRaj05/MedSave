import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const navigate  = useNavigate();
  const rafRef    = useRef(null);

  /* ── 3D Canvas Background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* Particles */
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.r  = Math.random() * 1.8 + .5;
        this.a  = Math.random() * .6 + .1;
        this.c  = Math.random() < .5 ? '#0D9488' : '#7C3AED';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c + Math.round(this.a * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 120 }, () => new Particle());

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(13,148,136,${.12 * (1 - d / 120)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    };

    /* Floating molecules */
    const molecules = Array.from({ length: 8 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 30 + 15,
      phase: Math.random() * Math.PI * 2,
      c: Math.random() < .5 ? 'rgba(13,148,136,' : 'rgba(124,58,237,',
    }));

    const drawMolecules = (t) => {
      for (const m of molecules) {
        m.x += m.vx; m.y += m.vy;
        if (m.x < -100) m.x = W + 100;
        if (m.x > W + 100) m.x = -100;
        if (m.y < -100) m.y = H + 100;
        if (m.y > H + 100) m.y = -100;
        const pulse = Math.sin(t * .001 + m.phase) * .3 + .7;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = m.c + '0.08)';
        ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * .3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = m.c + '0.05)';
        ctx.fill();
      }
    };

    const animate = (t) => {
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7);
      grd.addColorStop(0, 'rgba(7,40,35,1)');
      grd.addColorStop(1, 'rgba(2,8,6,1)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      drawMolecules(t);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Scroll Reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Mouse Parallax on hero cards ── */
  useEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    const onMove = (e) => {
      const mx = (e.clientX / W - .5) * 20;
      const my = (e.clientY / H - .5) * 10;
      const cards = document.querySelectorAll('.lp-float-card');
      cards.forEach((fc, i) => {
        if (i === 1) fc.style.transform = `translateX(calc(-50% + ${mx * .2}px)) translateY(${-20 + my}px)`;
        else {
          const d = (i - 1) * 1.5;
          fc.style.transform = `translateY(${my + d}px) translateX(${mx * (i === 0 ? -1 : 1) * .5}px)`;
        }
      });
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  const goCompare = () => navigate('/compare');

  return (
    <div className="lp-body" style={{ maxWidth: 'none' }}>
      <canvas ref={canvasRef} id="bg-canvas" />

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">💊 MedSave</div>
        <div className="lp-nav-links">
          <a href="#lp-how">How it works</a>
          <a href="#lp-features">AI Features</a>
          <a href="#lp-janaushadhi">Jan Aushadhi</a>
          <a href="#lp-compare">Compare</a>
        </div>
        <button className="lp-nav-cta" onClick={goCompare}>Try Free →</button>
      </nav>

      {/* ── HERO ── */}
      <section id="lp-hero">
        <div className="lp-eyebrow">
          <span className="lp-eyebrow-dot" />
          India's Smartest AI-Powered Pharmacy Comparator
        </div>
        <h1 className="lp-hero-title">
          <span style={{ display: 'block' }}>Smart Pharmacy</span>
          <span className="lp-title-gradient">AI Comparison.</span>
        </h1>
        <p className="lp-hero-sub">
          Compare medicine prices instantly across online delivery apps, chain pharmacies, local shops, and government generics. Scan prescriptions or search symptoms to unlock the best deals.
        </p>
        <div className="lp-hero-btns">
          <button className="lp-btn-primary" onClick={goCompare}>Compare Prices Now</button>
          <button className="lp-btn-ghost" onClick={() => document.getElementById('lp-how').scrollIntoView({ behavior: 'smooth' })}>
            Watch Demo ▶
          </button>
        </div>

        <div className="lp-hero-cards">
          <div className="lp-float-card lp-fc1">
            <div className="lp-fc-label">🔵 Chain Pharmacy</div>
            <div className="lp-fc-name">Metformin 500mg</div>
            <div className="lp-fc-price lp-price-red">₹85</div>
            <div className="lp-fc-badge lp-badge-over">Apollo / MRP</div>
          </div>
          <div className="lp-float-card lp-fc2">
            <div className="lp-fc-label">💡 MedSave AI Choice</div>
            <div className="lp-fc-name">Generic Alternative</div>
            <div className="lp-fc-price lp-price-green">₹23</div>
            <div className="lp-fc-badge lp-badge-best">✓ Save 73% Instantly</div>
          </div>
          <div className="lp-float-card lp-fc3">
            <div className="lp-fc-label">📦 Online Delivery</div>
            <div className="lp-fc-name">Metformin 500mg</div>
            <div className="lp-fc-price" style={{ color: '#F59E0B' }}>₹72</div>
            <div className="lp-fc-badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>PharmEasy / 15% Off</div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="lp-stats-bar">
        <div className="lp-stats-inner">
          {[
            { num: '5+ Sources',  label: 'Compared: PMBJP, Apollo, MedPlus, PharmEasy & Local' },
            { num: '6 AI Tools',  label: 'Vision OCR, Chat, SSE Streaming, Alerts & Suggester' },
            { num: '70%+',        label: 'Average savings unlocked via generic mappings' },
            { num: 'Instant',     label: 'Real-time aggregation with zero waiting' },
          ].map(s => (
            <div key={s.num}>
              <div className="lp-stat-num">{s.num}</div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="lp-how" className="lp-section">
        <div className="lp-inner">
          <div className="lp-reveal">
            <div className="lp-tag teal">How it works</div>
            <h2 className="lp-section-title">Three steps to massive savings</h2>
            <p className="lp-section-sub">No signup required. Search any medicine and instantly see where to buy it for the least amount of money.</p>
          </div>
          <div className="lp-steps-grid lp-reveal">
            {[
              { num:'01', icon:'🔍', title:'Search your medicine', desc:'Type any medicine name, scan the barcode on the strip, or describe your symptoms — our AI understands all three.', accent:'linear-gradient(90deg,transparent,#0D9488,transparent)' },
              { num:'02', icon:'📊', title:'Compare all prices', desc:'Instantly see prices at Jan Aushadhi, Apollo, MedPlus, PharmEasy, and your local shop — side by side.', accent:'linear-gradient(90deg,transparent,#7C3AED,transparent)' },
              { num:'03', icon:'💰', title:'Save real money', desc:'Know your rights. Buy from the best source. Set price alerts. Never overpay again.', accent:'linear-gradient(90deg,transparent,#22C55E,transparent)' },
            ].map(s => (
              <div key={s.num} className="lp-step-card" style={{ '--top-line': s.accent }}>
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE COMPARE DEMO ── */}
      <section id="lp-compare" className="lp-section" style={{ background: 'rgba(255,255,255,.01)' }}>
        <div className="lp-inner">
          <div className="lp-compare-wrap">
            <div className="lp-reveal">
              <div className="lp-tag teal">Live demo</div>
              <h2 className="lp-section-title">See the difference yourself</h2>
              <p className="lp-section-sub">Paracetamol 500mg — one of the most commonly purchased medicines in India. Here's what you'd actually pay.</p>
              {['Prices sorted cheapest first — always', 'Local shop always flagged ⚠ if no discount', 'AI explains why prices differ'].map(t => (
                <div key={t} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:'rgba(255,255,255,.6)', marginBottom:10 }}>
                  <span style={{ width:20, height:20, background:'rgba(34,197,94,.15)', border:'1px solid rgba(34,197,94,.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0 }}>✓</span>
                  {t}
                </div>
              ))}
              <button className="lp-btn-primary" onClick={goCompare} style={{ marginTop: 24 }}>
                Try it now →
              </button>
            </div>
            <div className="lp-compare-visual lp-reveal">
              <div className="lp-compare-header">
                <div style={{ fontSize:28 }}>💊</div>
                <div>
                  <div className="lp-compare-med-name">Paracetamol 500mg</div>
                  <div className="lp-compare-meta">Analgesic/Antipyretic · Per 10 tablets · Generic: Acetaminophen</div>
                </div>
              </div>
              {[
                { icon:'🏛️', bg:'rgba(59,130,246,.15)', name:'Jan Aushadhi (PMBJP)', cls:'lp-pr-best', badge:<span className="lp-pr-badge lp-pb-best">✓ Best Price</span>, note:'Government generic scheme', price:'₹5', priceColor:'#22C55E' },
                { icon:'🟢', bg:'rgba(34,197,94,.15)',  name:'MedPlus', cls:'lp-pr-normal', badge:<span style={{background:'rgba(245,158,11,.15)',color:'#F59E0B',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:8}}>20% off MRP</span>, note:'MedPlus chain discount', price:'₹12', priceColor:null },
                { icon:'📦', bg:'rgba(124,58,237,.15)', name:'PharmEasy Online', cls:'lp-pr-normal', badge:<span style={{background:'rgba(245,158,11,.15)',color:'#F59E0B',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:8}}>15% off</span>, note:'Delivered to your door', price:'₹13', priceColor:null },
                { icon:'🔵', bg:'rgba(34,197,94,.12)',  name:'Apollo Pharmacy', cls:'lp-pr-normal', badge:null, note:'With loyalty card discount', price:'₹14', priceColor:null },
                { icon:'🏪', bg:'rgba(239,68,68,.12)',  name:'Local Medical Shop', cls:'lp-pr-warn', badge:<span className="lp-pr-badge lp-pb-over">⚠ Full MRP</span>, note:'No discount given', price:'₹18', priceColor:'#EF4444' },
              ].map(r => (
                <div key={r.name} className={`lp-price-row ${r.cls}`}>
                  <div className="lp-pr-icon" style={{ background: r.bg }}>{r.icon}</div>
                  <div className="lp-pr-info">
                    <div className="lp-pr-name">{r.name} {r.badge}</div>
                    <div className="lp-pr-note">{r.note}</div>
                  </div>
                  <div className="lp-pr-price" style={{ color: r.priceColor || '#fff' }}>{r.price}</div>
                </div>
              ))}
              <div className="lp-saving-pill">
                <span style={{ fontSize:22 }}>💰</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, opacity:.8, letterSpacing:'.5px', textTransform:'uppercase' }}>Max possible saving vs local shop</div>
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:20, fontWeight:800 }}>₹13 saved (72% cheaper)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section id="lp-features" className="lp-section">
        <div className="lp-inner">
          <div className="lp-reveal" style={{ textAlign:'center', maxWidth:600, margin:'0 auto 60px' }}>
            <div className="lp-tag">Powered by Groq AI</div>
            <h2 className="lp-section-title">Not just prices.<br />Intelligent health savings.</h2>
            <p className="lp-section-sub" style={{ margin:'0 auto' }}>Six AI-powered features that make MedSave the smartest medicine tool in India.</p>
          </div>
          <div className="lp-ai-grid lp-reveal">
            {[
              { c:'c-teal',   icon:'🔬', title:'Generic Substitution Engine', desc:'AI finds Jan Aushadhi equivalents for any branded medicine. Same active ingredient, 70–90% cheaper. Instantly.', tag:'lp-tag-teal',   tagTxt:'Live Feature' },
              { c:'c-purple', icon:'💬', title:'Symptom → Medicine Suggester', desc:'Describe your symptom in plain language. AI suggests safe OTC medicines with their cheapest prices across all platforms.', tag:'lp-tag-purple', tagTxt:'Groq AI' },
              { c:'c-amber',  icon:'📊', title:'Streaming Price Explainer', desc:'Real-time AI narration explaining why your medicine is priced differently across platforms — streamed live as you read.', tag:'lp-tag-amber',  tagTxt:'SSE Streaming' },
              { c:'c-green',  icon:'🔔', title:'Smart Price Alerts', desc:'Set a target price. Our AI monitors prices every 6 hours. You get alerted the moment it drops below your threshold.', tag:'lp-tag-green',  tagTxt:'Auto-monitor' },
              { c:'c-red',    icon:'📋', title:'Prescription Reader', desc:'Upload a photo of your prescription. AI Vision extracts every medicine name and dosage — then compares prices instantly.', tag:'lp-tag-red',    tagTxt:'Vision AI' },
              { c:'c-blue',   icon:'🤖', title:'MedSave Chat Assistant', desc:'Ask anything — "cheapest blood pressure medicine", "is X available at Jan Aushadhi?". Your personal pharmacy advisor, 24/7.', tag:'lp-tag-blue',   tagTxt:'Always On' },
            ].map(f => (
              <div key={f.title} className={`lp-ai-card ${f.c}`}>
                <div className="lp-ai-icon">{f.icon}</div>
                <div className="lp-ai-title">{f.title}</div>
                <div className="lp-ai-desc">{f.desc}</div>
                <div className={`lp-ai-tag ${f.tag}`}>{f.tagTxt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCANNER + CHAT ── */}
      <section className="lp-section" style={{ background:'rgba(255,255,255,.01)' }}>
        <div className="lp-inner">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }} className="lp-reveal">
            {/* Scanner */}
            <div>
              <div className="lp-tag teal" style={{ marginBottom:16 }}>Barcode Scanner</div>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:26, fontWeight:700, marginBottom:12 }}>Point. Scan. Save.</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.7, marginBottom:24 }}>Point your phone at any medicine strip barcode. We instantly decode the medicine and compare prices.</p>
              <div className="lp-scan-mockup">
                <div className="lp-scan-frame">
                  <div className="lp-scan-corner lp-sc-tl" /><div className="lp-scan-corner lp-sc-tr" />
                  <div className="lp-scan-corner lp-sc-bl" /><div className="lp-scan-corner lp-sc-br" />
                  <div className="lp-scan-line" />
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                    <div style={{ fontSize:40, opacity:.3 }}>📦</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>Align barcode here</div>
                  </div>
                </div>
                <div style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,.4)', marginTop:12 }}>Camera permission required · Works on all devices</div>
                <div className="lp-scan-result">
                  <div className="lp-scan-dot" />
                  <div>
                    <div style={{ fontSize:12, fontWeight:600 }}>Detected: Crocin 650mg</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>Tap to compare prices →</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chatbot */}
            <div>
              <div className="lp-tag" style={{ marginBottom:16 }}>AI Chat Assistant</div>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:26, fontWeight:700, marginBottom:12 }}>Ask anything, anytime</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.7, marginBottom:24 }}>Your personal pharmacy assistant powered by Groq AI — answers in seconds, in plain Hindi or English.</p>
              <div className="lp-chat-mockup">
                <div className="lp-chat-header">
                  <div className="lp-chat-avatar">💊</div>
                  <div>
                    <div className="lp-chat-name">MedSave Assistant</div>
                    <div className="lp-chat-status">● Online · Powered by Groq AI</div>
                  </div>
                </div>
                <div className="lp-msg user"><div className="lp-msg-bubble">cheapest medicine for diabetes?</div></div>
                <div className="lp-msg bot"><div className="lp-msg-bubble">Metformin 500mg (generic) at Jan Aushadhi is just ₹23 per 10 tablets vs ₹85 at local shops. That's 73% savings! 🏛️</div></div>
                <div className="lp-msg user"><div className="lp-msg-bubble">where is the nearest Jan Aushadhi?</div></div>
                <div className="lp-msg bot">
                  <div className="lp-msg-bubble">
                    Found 3 stores near you 📍<br />
                    <strong>• PMBJP Store, Hubballi</strong> — 0.8km<br />
                    <strong>• Jan Aushadhi Kendra</strong> — 1.2km<br />
                    <strong>• Dharwad Janseva Kendra</strong> — 2.4km
                  </div>
                </div>
                <div className="lp-msg bot"><div className="lp-typing"><div className="lp-dot" /><div className="lp-dot" /><div className="lp-dot" /></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GENERIC SAVINGS ── */}
      <section id="lp-janaushadhi" className="lp-section lp-govt-section">
        <div className="lp-inner">
          <div className="lp-govt-wrap">
            <div className="lp-reveal">
              <div className="lp-tag teal">Generic Mappings</div>
              <h2 className="lp-section-title">Generic alternatives<br />integrated instantly</h2>
              <p className="lp-section-sub">MedSave's AI automatically maps expensive brand-name prescription drugs to certified generic alternatives—including the government's PMBJP (Jan Aushadhi) scheme—saving you up to 90%.</p>
              <button className="lp-btn-primary" style={{ marginTop:8 }} onClick={goCompare}>Compare Generic Prices →</button>
            </div>
            <div className="lp-govt-badges lp-reveal">
              {[
                { icon:'🔬', title:'AI Formulation Matcher', sub:'Finds chemical equivalents automatically' },
                { icon:'🏛️', title:'Jan Aushadhi PMBJP Integration', sub:'Pulls pricing from 9,000+ government stores' },
                { icon:'✅', title:'WHO-GMP Quality Check', sub:'Only recommends certified generic suppliers' },
                { icon:'💰', title:'Drastic Savings Underway', sub:'Saves Indian families average of 70% per bill' },
              ].map(b => (
                <div key={b.title} className="lp-govt-badge">
                  <div className="lp-gb-icon">{b.icon}</div>
                  <div>
                    <div className="lp-gb-title">{b.title}</div>
                    <div className="lp-gb-sub">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-section">
        <div className="lp-inner">
          <div className="lp-reveal" style={{ textAlign:'center', marginBottom:48 }}>
            <div className="lp-tag teal">Real people, real savings</div>
            <h2 className="lp-section-title">Indians saving money every day</h2>
          </div>
          <div className="lp-testi-grid lp-reveal">
            {[
              { q:'"I was paying ₹240 for my blood pressure medicine every month. MedSave showed me Jan Aushadhi has it for ₹38. I save over ₹2,400 a year now!"', name:'Ramesh Sharma', city:'Hyderabad, Telangana', init:'RS', color:'rgba(13,148,136,.15)', tc:'#5EEAD4' },
              { q:'"My mother is diabetic. Metformin at the local shop was ₹85. Jan Aushadhi gives us the same medicine for ₹23. This app literally helps us every month."', name:'Priya Krishnan', city:'Coimbatore, Tamil Nadu', init:'PK', color:'rgba(124,58,237,.15)', tc:'#A78BFA' },
              { q:'"The prescription scanner is amazing — I just photograph the doctor\'s prescription and all medicines are compared. Saved ₹800 on my last prescription."', name:'Arjun Mehta', city:'Pune, Maharashtra', init:'AM', color:'rgba(34,197,94,.15)', tc:'#86EFAC' },
            ].map(t => (
              <div key={t.name} className="lp-testi-card">
                <div className="lp-testi-stars">★★★★★</div>
                <div className="lp-testi-text">{t.q}</div>
                <div className="lp-testi-author">
                  <div className="lp-testi-avatar" style={{ background:t.color, color:t.tc }}>{t.init}</div>
                  <div>
                    <div className="lp-testi-name">{t.name}</div>
                    <div className="lp-testi-city">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" />
        <div style={{ position:'relative', zIndex:1 }} className="lp-reveal">
          <div className="lp-tag" style={{ marginBottom:24 }}>Start saving today</div>
          <h2 className="lp-cta-title">
            Your medicines.<br />
            <span style={{ background:'linear-gradient(135deg,#5EEAD4,#0D9488,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Drastically cheaper.
            </span>
          </h2>
          <p className="lp-cta-sub">Free to use. No prescription needed. No signup required.</p>
          <div className="lp-cta-btns">
            <button className="lp-btn-primary" style={{ fontSize:17, padding:'17px 38px' }} onClick={goCompare}>
              Compare Prices Free →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-nav-logo">💊 MedSave</div>
              <p>Fighting medicine price exploitation in India. Powered by Groq AI. Built for Bharat.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/compare'); }}>Price Compare</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/advisor'); }}>AI Advisor</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/scanner'); }}>Barcode Scanner</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/alerts'); }}>Price Alerts</a>
            </div>
            <div className="lp-footer-col">
              <h4>Resources</h4>
              <a href="#">PMBJP Scheme</a>
              <a href="#">Find Jan Aushadhi</a>
              <a href="#">Consumer Rights</a>
              <a href="#">API Docs</a>
            </div>
            <div className="lp-footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>© 2025 MedSave. Prices are indicative. Always verify at point of purchase.</p>
            <p>Made with ❤️ for India · Powered by Groq AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
