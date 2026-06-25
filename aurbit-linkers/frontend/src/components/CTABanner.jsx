import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function CTABanner({ onGetStarted }) {
  const canvasRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cta = ctaRef.current;
    if (!canvas || !cta) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Skip animation, render static canvas
    }

    const ctx = canvas.getContext('2d');
    let W, H;
    let animationId;

    function resize() {
      W = canvas.width = cta.clientWidth;
      H = canvas.height = cta.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 38;
    const nodes = [];
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 2.2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    nodes.forEach((n) => {
      n.baseX = n.x;
      n.baseY = n.y;
    });

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e) => {
      const r = cta.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    cta.addEventListener('mousemove', handleMouseMove);
    cta.addEventListener('mouseleave', handleMouseLeave);

    // Theme colors in RGB format - swapped for dark navy background
    const CREAM = '247,243,236'; // Light cream for default lines/dots on dark bg
    const GOLD = '201,162,63'; // Gold accent for cursor hover
    let t = 0;

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach((n) => {
        n.baseX += n.vx;
        n.baseY += n.vy;
        if (n.baseX < 0 || n.baseX > W) n.vx *= -1;
        if (n.baseY < 0 || n.baseY > H) n.vy *= -1;

        const dx = n.baseX - mouseX;
        const dy = n.baseY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 300);

        n.x = n.baseX + dx * influence * 0.32 + Math.sin(t * 0.8 + n.phase) * 2.8;
        n.y = n.baseY + dy * influence * 0.32 + Math.cos(t * 0.8 + n.phase) * 2.8;
        n._influence = influence;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 230) {
            const op = (1 - d / 230) * 0.28;
            const boost = Math.max(a._influence || 0, b._influence || 0);
            ctx.strokeStyle =
              boost > 0.1
                ? `rgba(${GOLD},${Math.min(op + boost * 0.35, 0.7)})`
                : `rgba(${CREAM},${op})`;
            ctx.lineWidth = boost > 0.1 ? 1.4 : 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + n.phase);
        const baseOp = 0.4 + pulse * 0.35 + (n._influence || 0) * 0.5;
        const color = n._influence > 0.05 ? GOLD : CREAM;

        // Glow effect for influenced nodes
        if (n._influence > 0.15) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, (n.r + n._influence * 4) * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD},${n._influence * 0.12})`;
          ctx.fill();
        }

        // Main node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (n._influence || 0) * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${Math.min(baseOp, 0.95)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(frame);
    }

    frame();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      cta.removeEventListener('mousemove', handleMouseMove);
      cta.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="bg-cream py-20">
      <div className="container-page">
        <div 
          ref={ctaRef}
          className="rounded-3xl bg-navy-gradient px-8 py-14 text-center relative overflow-hidden"
        >
          {/* Cursor-reactive canvas background */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'auto',
            }}
            aria-hidden="true"
          />

          {/* Static SVG decoration layer */}
          <svg 
            className="opacity-20" 
            viewBox="0 0 800 300" 
            preserveAspectRatio="xMidYMid slice" 
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
          >
            <line x1="80" y1="40" x2="220" y2="120" stroke="#C9974A" strokeWidth="1" />
            <line x1="220" y1="120" x2="120" y2="240" stroke="#C9974A" strokeWidth="1" />
            <line x1="600" y1="50" x2="720" y2="160" stroke="#C9974A" strokeWidth="1" />
            <circle cx="80" cy="40" r="3.5" fill="#C9974A" />
            <circle cx="220" cy="120" r="3" fill="#C9974A" />
            <circle cx="120" cy="240" r="4" fill="#C9974A" />
            <circle cx="600" cy="50" r="3" fill="#C9974A" />
            <circle cx="720" cy="160" r="4" fill="#C9974A" />
          </svg>

          {/* Text content above canvas */}
          <div className="relative" style={{ zIndex: 3 }}>
            <p className="eyebrow justify-center inline-flex mb-4 text-gold-300">Get started</p>
            <h2 className="font-display text-3xl lg:text-4xl text-white mb-4">Ready to get started?</h2>
            <p className="text-navy-100 max-w-md mx-auto mb-8">
              Create an account to start your company registration or migrate your existing
              business. No credit card required to explore.
            </p>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-500 text-navy-900 font-semibold text-[15px] hover:bg-gold-400 transition-colors"
            >
              Get Started
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}