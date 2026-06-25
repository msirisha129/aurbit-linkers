import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Hero({ onGetStarted }) {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Skip animation, render static canvas
    }

    const ctx = canvas.getContext('2d');
    let W, H;
    let animationId;

    function resize() {
      // Size canvas to hero section dimensions
      W = canvas.width = hero.clientWidth;
      H = canvas.height = hero.clientHeight;
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
      const r = hero.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    // Theme colors in RGB format
    const NAVY = '15,26,56'; // Matches #0F2A5C
    const GOLD = '201,162,63'; // Matches #C9A23F
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
                : `rgba(${NAVY},${op})`;
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
        const color = n._influence > 0.05 ? GOLD : NAVY;

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
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-cream flex flex-col items-center justify-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Cursor-reactive canvas background - FIRST child */}
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

      {/* All content ABOVE canvas with z-index: 2 */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Ambient node field with animations */}
        <svg
          className="node-field"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
        >
          <defs>
            <style>
              {`
                /* One-time line drawing animation on page load */
                .line-draw {
                  stroke-dasharray: 300;
                  stroke-dashoffset: 300;
                  animation: drawLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .line-draw-delay-1 { animation-delay: 0.1s; }
                .line-draw-delay-2 { animation-delay: 0.2s; }
                .line-draw-delay-3 { animation-delay: 0.3s; }
                .line-draw-delay-4 { animation-delay: 0.4s; }

                @keyframes drawLine {
                  to { stroke-dashoffset: 0; }
                }

                /* Continuous line energy flow - infinite loop */
                .line-energy {
                  stroke-dasharray: 8 4;
                  animation: energyFlow 6s linear infinite;
                }
                .line-energy-delay-1 { animation-delay: 0s; }
                .line-energy-delay-2 { animation-delay: 1.5s; }
                .line-energy-delay-3 { animation-delay: 3s; }
                .line-energy-delay-4 { animation-delay: 4.5s; }

                @keyframes energyFlow {
                  0% { stroke-dashoffset: 0; opacity: 0.5; }
                  50% { opacity: 0.8; }
                  100% { stroke-dashoffset: -24; opacity: 0.5; }
                }

                /* Continuous dot pulse - infinite loop */
                .dot-pulse {
                  animation: dotPulse 5s ease-in-out infinite;
                }
                .dot-pulse-delay-1 { animation-delay: 0s; }
                .dot-pulse-delay-2 { animation-delay: 1.2s; }
                .dot-pulse-delay-3 { animation-delay: 2.4s; }
                .dot-pulse-delay-4 { animation-delay: 3.6s; }
                .dot-pulse-delay-5 { animation-delay: 4.8s; }
                .dot-pulse-delay-6 { animation-delay: 6s; }

                @keyframes dotPulse {
                  0%, 100% { 
                    opacity: 0.5; 
                    transform: scale(1);
                  }
                  50% { 
                    opacity: 0.9; 
                    transform: scale(1.1);
                  }
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                  .line-draw {
                    animation: none !important;
                    stroke-dashoffset: 0;
                  }
                  .line-energy {
                    animation: none !important;
                  }
                  .dot-pulse {
                    animation: none !important;
                  }
                  .hero-fade-up {
                    animation: none !important;
                    opacity: 1;
                    transform: none;
                  }
                }
              `}
            </style>
          </defs>
          <g opacity="0.5">
            {/* Lines with one-time draw + continuous energy flow */}
            <line
              className="line-draw line-draw-delay-1 line-energy line-energy-delay-1"
              x1="120"
              y1="90"
              x2="380"
              y2="220"
              stroke="#C9974A"
              strokeWidth="1"
            />
            <line
              className="line-draw line-draw-delay-2 line-energy line-energy-delay-2"
              x1="380"
              y1="220"
              x2="260"
              y2="420"
              stroke="#C9974A"
              strokeWidth="1"
            />
            <line
              className="line-draw line-draw-delay-3 line-energy line-energy-delay-3"
              x1="1180"
              y1="80"
              x2="1320"
              y2="260"
              stroke="#C9974A"
              strokeWidth="1"
            />
            <line
              className="line-draw line-draw-delay-4 line-energy line-energy-delay-4"
              x1="1320"
              y1="260"
              x2="1100"
              y2="380"
              stroke="#C9974A"
              strokeWidth="1"
            />

            {/* Dots with continuous pulse */}
            <circle className="dot-pulse dot-pulse-delay-1" cx="120" cy="90" r="4" fill="#C9974A" />
            <circle className="dot-pulse dot-pulse-delay-2" cx="380" cy="220" r="3" fill="#0F2A5C" />
            <circle className="dot-pulse dot-pulse-delay-3" cx="260" cy="420" r="5" fill="#C9974A" />
            <circle className="dot-pulse dot-pulse-delay-4" cx="1180" cy="80" r="3.5" fill="#0F2A5C" />
            <circle className="dot-pulse dot-pulse-delay-5" cx="1320" cy="260" r="4.5" fill="#C9974A" />
            <circle className="dot-pulse dot-pulse-delay-6" cx="1100" cy="380" r="3" fill="#0F2A5C" />
          </g>
        </svg>

        <div className="container-page" style={{ position: 'relative', zIndex: 2 }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow justify-center inline-flex mb-5 hero-fade-up">AI-Powered Compliance Cloud</p>
            <h1 className="font-display text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-navy-900 mb-6 hero-fade-up hero-fade-up-delay-1">
              India's compliance, linked & automated
            </h1>
            <p className="text-lg text-slate-muted max-w-xl mx-auto mb-9 leading-relaxed hero-fade-up hero-fade-up-delay-2">
              Aurbit Linkers connects MCA, GST, and Income Tax filings into one workflow — built on
              AI automation, expert review, and a paperless record trail.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center hero-fade-up hero-fade-up-delay-3">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-navy-900 text-white font-semibold text-[15px] hover:bg-navy-800 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform duration-150" />
              </button>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-navy-200 text-navy-800 font-semibold text-[15px] hover:bg-navy-50 transition-all duration-150 ease-out hover:scale-[1.02]"
              >
                Explore services
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          /* One-time hero entrance animations */
          .hero-fade-up {
            opacity: 0;
            transform: translateY(16px);
            animation: fadeUp 500ms ease-out forwards;
          }
          .hero-fade-up-delay-1 { animation-delay: 100ms; }
          .hero-fade-up-delay-2 { animation-delay: 250ms; }
          .hero-fade-up-delay-3 { animation-delay: 400ms; }

          @keyframes fadeUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
}