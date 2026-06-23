import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Gift, Menu, X, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';

const NAV_ORDER = ['startup', 'registrations', 'trademark', 'income-tax', 'compliance'];
const NAV_LABELS = {
  startup: 'Startup',
  registrations: 'Registrations',
  trademark: 'Trademark',
  'income-tax': 'Income Tax',
  compliance: 'Compliance',
};

export default function Navbar({ onServiceClick }) {
  const { categories } = useServices();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  const byKey = Object.fromEntries(categories.map((c) => [c.key, c]));

  function openWithDelay(key) {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }

  function closeWithDelay() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  function handleItemClick(item, categoryLabel) {
    setOpenMenu(null);
    setMobileOpen(false);
    // Special case: route ICEGATE Registration to dedicated landing page
    if (item.slug === 'icegate-registration') {
      navigate('/icegate');
      return;
    }
    onServiceClick({ name: item.name, slug: item.slug, category: categoryLabel });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-100">
      <div className="container-page flex items-center justify-between h-[72px]">
        <Link to="/" onClick={() => setOpenMenu(null)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={closeWithDelay}>
          {NAV_ORDER.map((key) => {
            const cat = byKey[key];
            if (!cat) return null;
            const isOpen = openMenu === key;
            return (
              <div key={key} className="relative" onMouseEnter={() => openWithDelay(key)}>
                <button
                  className={`flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium rounded-md transition-colors ${
                    isOpen ? 'text-navy-800 bg-navy-50' : 'text-navy-700 hover:text-navy-900 hover:bg-navy-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  {NAV_LABELS[key]}
                  <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && cat.items?.length > 0 && (
                  <div
                    className="absolute left-0 top-full mt-1 bg-white border border-navy-100 rounded-xl shadow-soft p-5 grid gap-x-10 gap-y-2.5 z-50"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(3, Math.ceil(cat.items.length / 6))}, minmax(200px, 1fr))`,
                    }}
                  >
                    {cat.items.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => handleItemClick(item, cat.label)}
                        className="text-left text-[14.5px] text-slate-muted hover:text-gold-600 transition-colors py-0.5 whitespace-nowrap"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/refer"
            className="flex items-center gap-1.5 text-[15px] font-medium text-navy-700 hover:text-navy-900 px-2"
          >
            Refer &amp; Earn <Gift size={16} className="text-gold-500" />
          </Link>
          <button
            aria-label="Search"
            className="p-2 rounded-full text-navy-700 hover:bg-navy-50 transition-colors"
          >
            <Search size={19} />
          </button>

          {user ? (
            // For authenticated users, show Dashboard + Logout (non-admin)
            user.role === 'admin' ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-navy-700 hover:text-navy-900">Admin Panel</Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  aria-label="Log out"
                  className="p-2.5 rounded-full text-navy-500 hover:bg-navy-50 hover:text-navy-800 transition-colors"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-navy-200 text-navy-800 text-sm font-semibold hover:bg-navy-50 transition-colors"
                >
                  <User size={15} /> {user.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  aria-label="Log out"
                  className="p-2.5 rounded-full text-navy-500 hover:bg-navy-50 hover:text-navy-800 transition-colors"
                >
                  <LogOut size={17} />
                </button>
              </div>
            )
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full border border-navy-800 text-navy-800 text-sm font-semibold hover:bg-navy-800 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-navy-800"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="container-page py-4 space-y-1">
            {NAV_ORDER.map((key) => {
              const cat = byKey[key];
              if (!cat) return null;
              const isOpen = openMenu === key;
              return (
                <div key={key} className="border-b border-navy-50 last:border-0">
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : key)}
                    className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-navy-800"
                  >
                    {NAV_LABELS[key]}
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-3 grid grid-cols-1 gap-2 pl-2">
                      {cat.items?.map((item) => (
                        <button
                          key={item.slug}
                          onClick={() => handleItemClick(item, cat.label)}
                          className="text-left text-sm text-slate-muted py-1"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-3">
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-3 rounded-full bg-navy-800 text-white text-sm font-semibold"
                >
                  Go to dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-3 rounded-full border border-navy-800 text-navy-800 text-sm font-semibold"
                >
                  Login
                </Link>
              )}
              {/* Mobile admin links */}
              <div className="mt-3 space-y-2">
                {user ? (
                  user.role === 'admin' ? (
                    <>
                      <Link to="/admin" onClick={()=>setMobileOpen(false)} className="block px-4 py-2 rounded-md text-sm">Admin Panel</Link>
                      <button onClick={()=>{ logout(); setMobileOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2 rounded-md border">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={()=>setMobileOpen(false)} className="block px-4 py-2 rounded-md text-sm">Dashboard</Link>
                      <button onClick={()=>{ logout(); setMobileOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2 rounded-md border">Logout</button>
                    </>
                  )
                ) : (
                  <Link to="/login" onClick={()=>setMobileOpen(false)} className="block px-4 py-2 rounded-md text-sm">Login</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
