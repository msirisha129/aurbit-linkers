export default function StaticPage({ title, children }) {
  return (
    <div className="container-page py-20 max-w-2xl">
      <h1 className="font-display text-3xl text-navy-900 mb-6">{title}</h1>
      <div className="text-slate-muted leading-relaxed space-y-4">
        {children || <p>This page is coming soon.</p>}
      </div>
    </div>
  );
}
