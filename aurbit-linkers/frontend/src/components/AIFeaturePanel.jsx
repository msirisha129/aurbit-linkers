import { getIcon } from '../lib/icons';
import { useNavigate } from 'react-router-dom';
import { homepageCards, fallbackCategories } from '../data/services';

// Map each node key to a concrete service slug so the pill can navigate
// to /service/:slug (the same route ServiceDetail.jsx already handles).
const slugByCategoryKey = (() => {
  const map = {};
  for (const cat of fallbackCategories) {
    if (cat.key === 'startup') map[cat.key] = 'udyam-registration-msme';
    else if (cat.key === 'income-tax') map[cat.key] = 'new-gst-registration';
    else if (cat.key === 'trademark') map[cat.key] = 'trademark-protection';
    else if (cat.key === 'compliance') map[cat.key] = 'iec-registration';
  }
  return map;
})();

const pills = homepageCards.map((c) => ({
  name: c.name,
  icon: c.icon,
  slug: slugByCategoryKey[c.key],
}));

export default function AIFeaturePanel() {
  const navigate = useNavigate();

  // Orbit layout configuration
  const hubCx = 260, hubCy = 240;
  const hubHw = 50, hubHh = 30;
  const ringRadius = 130;
  const nodeRadius = 22;

  const nodes = [
    { key: 'startup', name: 'Business Setup', icon: 'building-2', angle: -Math.PI / 2, color: '#C9974A' },
    { key: 'income-tax', name: 'GST', icon: 'receipt', angle: 0, color: '#7C97C9' },
    { key: 'trademark', name: 'Trademark Protection', icon: 'shield-check', angle: Math.PI / 3, color: '#C9974A' },
    { key: 'compliance', name: 'Import Export', icon: 'globe', angle: Math.PI, color: '#7C97C9' },
  ].map((n) => ({ ...n, slug: slugByCategoryKey[n.key] }));

  const getHubEdge = (angle) => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    if (Math.abs(cos) < 0.001) return { x: hubCx, y: hubCy + hubHh * Math.sign(sin) };
    if (Math.abs(sin) < 0.001) return { x: hubCx + hubHw * Math.sign(cos), y: hubCy };
    const t = Math.min(hubHw / Math.abs(cos), hubHh / Math.abs(sin));
    return { x: hubCx + t * cos, y: hubCy + t * sin };
  };

  const nodeData = nodes.map((node) => {
    const cx = hubCx + ringRadius * Math.cos(node.angle);
    const cy = hubCy + ringRadius * Math.sin(node.angle);
    const hubEdge = getHubEdge(node.angle);
    const nodeEdge = { x: cx - nodeRadius * Math.cos(node.angle), y: cy - nodeRadius * Math.sin(node.angle) };
    return { ...node, cx, cy, hubEdge, nodeEdge };
  });

  return (
    <section className="bg-cream py-20 lg:py-24 overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="eyebrow mb-4">AI-Powered</p>
          <h2 className="font-display text-3xl lg:text-[2.3rem] text-navy-900 mb-6 leading-tight">
            Compliance, linked end to end
          </h2>
          <p className="text-slate-muted leading-relaxed mb-5">
            Stay compliant with automated help for GST filing, income tax returns, ROC compliance,
            and annual filings — with smart reminders and a full audit trail.
          </p>
          <p className="text-slate-muted leading-relaxed">
            Connect banks, payment gateways, and government portals in one workflow so
            reconciliations, journal posting, and return-ready records stay in sync. Extend
            invoicing and compliance flows with developer-friendly APIs and webhooks.
          </p>
        </div>

        <div className="relative h-[420px] hidden sm:block">
          <svg viewBox="0 0 560 480" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a2744" />
                <stop offset="100%" stopColor="#0f1a2e" />
              </linearGradient>
            </defs>

            <style>
              {`
                .orbit-group {
                  animation: orbit-rotate 35s linear infinite;
                  transform-origin: 260px 240px;
                }
                .counter-rotate {
                  animation: counter-rotate 35s linear infinite;
                  transform-origin: 0 0;
                }
                @keyframes orbit-rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes counter-rotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(-360deg); }
                }
                .node-circle {
                  transition: all 0.2s ease;
                  cursor: pointer;
                }
                .node-circle:hover {
                  stroke: #0f172a;
                  stroke-width: 2px;
                  filter: drop-shadow(0 0 10px rgba(15, 23, 42, 0.4));
                }
              `}
            </style>

            {/* Central hub - stays still */}
            <rect
              x="210"
              y="210"
              width="100"
              height="60"
              rx="16"
              fill="url(#navyGradient)"
            />
            <circle cx="260" cy="230" r="8" fill="none" stroke="#C9974A" strokeWidth="1.5" />
            <circle cx="260" cy="230" r="2.5" fill="#C9974A" />
            <text x="260" y="248" textAnchor="middle" fill="#C9974A" fontSize="12" fontWeight="600">
              Aurbit
            </text>
            <text x="260" y="260" textAnchor="middle" fill="#C9974A" fontSize="10" fontWeight="500">
              Linkers
            </text>

            {/* Rotating orbit group: ring, lines, nodes with counter-rotating labels/icons */}
            <g className="orbit-group">
              {/* Dashed ring */}
              <circle
                cx="260"
                cy="240"
                r="130"
                fill="none"
                stroke="#C9974A"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.4"
              />

              {/* Connector lines from hub edge to node edge */}
              {nodeData.map((node, i) => (
                <line
                  key={`line-${i}`}
                  x1={node.hubEdge.x}
                  y1={node.hubEdge.y}
                  x2={node.nodeEdge.x}
                  y2={node.nodeEdge.y}
                  stroke={node.color}
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              ))}


              {/* Nodes with counter-rotating icons and labels */}
              {nodeData.map((node, i) => {
                const Icon = getIcon(node.icon);
                const labelOffsetX = 0;
                const labelY = nodeRadius + 18;
                const textAnchor = 'middle';

                return (
                  <g key={`node-${i}`} transform={`translate(${node.cx}, ${node.cy})`}>
                    <g className="counter-rotate" style={{ transformOrigin: '0 0' }}>
                      {/* Node circle */}
                      <circle
                        r={nodeRadius}
                        fill="white"
                        className="node-circle"
                        onClick={() => navigate(`/service/${node.slug}`)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {/* Icon */}
                      <foreignObject
                        x={-10}
                        y={-10}
                        width="20"
                        height="20"
                        style={{ pointerEvents: 'none' }}
                      >
                        <Icon size={16} className="text-navy-700" />
                      </foreignObject>
                      
                      {/* Label */}
                      <text
                        x={labelOffsetX}
                        y={labelY}
                        textAnchor={textAnchor}
                        fill="#1a2744"
                        fontSize="11"
                        fontWeight="500"
                      >
                        {node.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}