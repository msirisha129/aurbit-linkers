import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ServiceDetail from './pages/ServiceDetail';
import IcegateDetails from './pages/IcegateDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';
import StaticPage from './pages/StaticPage';
import IcegateLanding from './pages/IcegateLanding';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const location = useLocation();

  const hideChrome = location.pathname === '/login' || location.pathname === '/signup';

  function openLeadModal(service = null) {
    console.log('App.openLeadModal -> service:', service);
    setActiveService(service);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar onServiceClick={openLeadModal} />}

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<Home onGetStarted={() => openLeadModal(null)} onLearnMore={(card) => openLeadModal({ name: card.name, slug: card.key, category: card.name })} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/service/icegate-registration" element={<IcegateDetails onEnquire={openLeadModal} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/service/:slug" element={<ServiceDetail onEnquire={openLeadModal} />} />
          <Route path="/icegate" element={<IcegateLanding />} />

          {/* Footer / static informational pages */}
          <Route path="/about" element={<StaticPage title="About Aurbit Linkers" />} />
          <Route path="/learning-center" element={<StaticPage title="Learning Center" />} />
          <Route path="/contact" element={<StaticPage title="Contact us" />} />
          <Route path="/business-search" element={<StaticPage title="Business Search" />} />
          <Route path="/linkers-cloud" element={<StaticPage title="Linkers Cloud" />} />
          <Route path="/developers" element={<StaticPage title="Developer Resources" />} />
          <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
          <Route path="/refund-policy" element={<StaticPage title="Refund Policy" />} />
          <Route path="/confidentiality" element={<StaticPage title="Confidentiality Policy" />} />
          <Route path="/disclaimer" element={<StaticPage title="Disclaimer Policy" />} />
          <Route path="/careers" element={<StaticPage title="We're Hiring" />} />
          <Route path="/refer" element={<StaticPage title="Refer & Earn" />} />

          <Route
            path="*"
            element={<StaticPage title="Page not found">
              <p>The page you're looking for doesn't exist.</p>
            </StaticPage>}
          />
        </Routes>
      </main>

      {!hideChrome && <Footer />}

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} service={activeService} />
    </div>
  );
}

export default App;
