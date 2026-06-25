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

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate('/');
  }

  // Single source of truth for the role-based action button.
  // - guest  -> Login
  // - user   -> Dashboard (/dashboard)
  // - admin  -> Admin Panel (/admin) and never Dashboard
  function renderAuthAction(className = '') {
    if (!user) {
      return (
        <Link
          to="/login"
          className={`px-5 py-2.5 rounded-full border border-navy-800 text-navy-800 text-sm font-semibold hover:bg-navy-800 hover:text-white transition-colors ${className}`}
        >
          Login
        </Link>
      );
    }

    if (user.role === 'admin') {
      return (
        <Link
          to="/admin"
          className={`px-3 py-2 rounded-md text-[15px] font-medium text-navy-700 hover:text-navy-900 whitespace-nowrap ${className}`}
        >
          Admin Panel
        </Link>
      );
    }

    return (
      <Link
        to="/dashboard"
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-navy-200 text-navy-800 text-sm font-semibold hover:bg-navy-50 transition-colors ${className}`}
      >
        <User size={15} /> Dashboard
      </Link>
    );
  }

  // Profile/avatar pill (name + icon). Only rendered for logged-in users.
  function renderProfile() {
    if (!user) return null;
    const firstName = user.name?.split(' ')[0] || 'Profile';
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-navy-700">
        <User size={15} /> {firstName}
      </span>
    );
  }

  function renderLogoutIcon() {
    if (!user) return null;
    return (
      <button
        onClick={handleLogout}
        aria-label="Log out"
        className="p-2.5 rounded-full text-navy-500 hover:bg-navy-50 hover:text-navy-800 transition-colors"
      >
        <LogOut size={17} />
      </button>
    );
  }

  function renderLogoutButtonMobile() {
    if (!user) return null;
    return (
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 rounded-md border text-sm"
      >
        Logout
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-100">
      <div className="container-page flex items-center justify-between h-[72px]">
        <Link to="/" onClick={() => setOpenMenu(null)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5" onMouseLeave={closeWithDelay}>
          {NAV_ORDER.map((key) => {
            const cat = byKey[key];
            if (!cat) return null;
            const isOpen = openMenu === key;
            return (
              <div key={key} className="relative" onMouseEnter={() => openWithDelay(key)}>
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium rounded-md transition-all whitespace-nowrap ${
                    isOpen ? 'text-navy-800 bg-navy-50' : 'text-navy-700 hover:text-navy-900 hover:bg-navy-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="whitespace-nowrap">{NAV_LABELS[key]}</span>
                  <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/refer"
            className="flex items-center gap-1.5 text-[15px] font-medium text-navy-700 hover:text-navy-900 px-2 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">Refer & Earn</span>
            <Gift size={15} className="text-gold-500" />
          </Link>
          <button
            aria-label="Search"
            className="p-2 rounded-full text-navy-700 hover:bg-navy-50 transition-colors"
          >
            <Search size={18} />
          </button>

          {/* Single conditional rendering: Login / Dashboard / Admin Panel */}
          {renderAuthAction()}

          {/* Profile/avatar pill and logout icon for logged-in users */}
          {renderProfile()}
          {renderLogoutIcon()}
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

            {/* Single conditional rendering for the auth area on mobile */}
            <div className="pt-3 space-y-2">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 rounded-md text-sm"
                      >
                        Admin Panel
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2 rounded-md text-sm"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                  {user.name && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700">
                      <User size={15} /> {user.name}
                    </div>
                  )}
                  {renderLogoutButtonMobile()}
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-md text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}