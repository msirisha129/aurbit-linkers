import React, { useState, useMemo } from 'react';
import api from '../lib/api';
import { useLocation } from 'react-router-dom';
import { Globe, FileText, Star, MapPin, Users, CheckCircle } from 'lucide-react';

export default function IcegateDetails({ onEnquire }) {
  const location = useLocation();
  const applicant = location?.state || null;
  const [activeTab, setActiveTab] = useState('service');

  // Sample locations - in real app these may come from API
  const ALL_LOCATIONS = useMemo(
    () => [
      { id: 'MUM-S', name: 'Mumbai Sea Port', category: 'Sea Ports' },
      { id: 'BOM-A', name: 'Mumbai Airport', category: 'Airports' },
      { id: 'DEL-ICD', name: 'Delhi ICD', category: 'ICD Ports' },
      { id: 'JAL-L', name: 'Jaipur Land Port', category: 'Land Ports' },
      { id: 'KOL-S', name: 'Kolkata Sea Port', category: 'Sea Ports' },
      { id: 'CHE-A', name: 'Chennai Airport', category: 'Airports' },
    ],
    []
  );

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed' | null
  // use onEnquire (provided by App.openLeadModal) to open central LeadModal

  const filteredLocations = useMemo(() => {
    return ALL_LOCATIONS.filter((loc) => {
      if (categoryFilter !== 'All' && loc.category !== categoryFilter) return false;
      if (searchQuery && !loc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [ALL_LOCATIONS, categoryFilter, searchQuery]);

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectAllChecked(false);
      return next;
    });
    console.log('IcegateDetails toggleSelect -> selectedIds (updated)');
  }

  function handleSelectAll(checked) {
    setSelectAllChecked(checked);
    if (checked) {
      setSelectedIds(new Set(filteredLocations.map((l) => l.id)));
      console.log('IcegateDetails handleSelectAll -> selectedIds (checked):', Array.from(filteredLocations.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
      console.log('IcegateDetails handleSelectAll -> cleared selectedIds');
    }
  }

  function removeSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSelectAllChecked(false);
  }

  const handlePayment = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(API_BASE + "/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2899,
          customerName: "M Sirisha",
          customerEmail: "msirisha454@gmail.com",
          customerPhone: "9611150532"
        })
      })
      const data = await res.json()
      
      if (!data.payment_session_id) {
        alert("Error: " + JSON.stringify(data))
        return
      }

      const { load } = await import("@cashfreepayments/cashfree-js")
      const cashfree = await load({ mode: "sandbox" })
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal"
      })

    } catch (err) {
      alert("Error: " + err.message)
    }
  }

  function submitLocationsRequest() {
    // Build selected locations and payload
    const selectedLocations = Array.from(selectedIds).map(id => { const l=ALL_LOCATIONS.find(x=>x.id===id); return { name: l?.name||id, code: l?.id||id }; });
    if (selectedLocations.length === 0) {
      alert('Please select at least one customs location before submitting.');
      return;
    }
    // open central LeadModal via onEnquire, pass selected locations so LeadModal will include them
    const service = { name: 'ICEGATE Registration', slug: 'icegate-registration', category: 'ICEGATE', customsLocations: selectedLocations };
    console.log('Opening LeadModal via onEnquire with service:', service);
    onEnquire && onEnquire(service);
  }

  async function handleFormSubmit(e) {
    e && e.preventDefault();
    setFormError('');
    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      setFormError('All fields are required');
      return;
    }
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email');
      return;
    }
    const selectedLocations = Array.from(selectedIds).map(id => { const l=ALL_LOCATIONS.find(x=>x.id===id); return { name: l?.name||id, code: l?.id||id }; });
    const payload = {
      name,
      email,
      phone,
      service: 'ICEGATE Registration',
      source: 'icegate-location-selector',
      customsLocations: selectedLocations,
    };
    try {
      setPendingSubmit(true);
      console.log('Submitting ICEGATE lead payload', payload);
      const res = await api.post('/leads', payload);
      console.log('Lead created successfully', res && res.data ? res.data : res);
      setShowFormModal(false);
      setShowRequestModal(true);
      // clear selection after success
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to create lead for customs locations', err);
      setFormError('Failed to submit. Please try again.');
    } finally {
      setPendingSubmit(false);
    }
  }

  return (
    <div className="bg-cream">
      <main className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12">

        {/* Hero */}
        <section className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2 gap-6 items-center p-8 lg:p-12">
          <div className="lg:pr-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-gold-50 text-gold-600 font-semibold">ICEGATE</span>
              <div className="text-sm text-slate-muted">Aurbit Linkers</div>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-navy-900 leading-tight">Fast & Reliable ICEGATE Registration</h1>
            <p className="text-slate-muted mt-4 max-w-2xl">Get registered on ICEGATE and manage your import-export customs filings online with expert assistance, DSC linking and portal approvals handled for you.</p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <button onClick={() => {
                const customsLocations = Array.from(selectedIds).map(id=>{ const l=ALL_LOCATIONS.find(x=>x.id===id); return { name: l?.name||id, code: l?.id||id }; });
                console.log('IcegateDetails onEnquire -> customsLocations:', customsLocations);
                onEnquire && onEnquire({ name: 'ICEGATE Registration', slug: 'icegate-registration', customsLocations });
              }} className="px-6 py-3 rounded-full bg-gradient-to-r from-navy-800 to-gold-500 text-white font-semibold text-lg">Get Started</button>
              <button onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} className="px-6 py-3 rounded-full border">Learn more</button>
              <div className="mt-3 sm:mt-0 ml-0 sm:ml-4 px-3 py-1 rounded-full bg-white border text-sm font-medium">Starts from <span className="text-gold-600 font-bold">₹2,899</span></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2">
                <Star className="text-gold-500" />
                <div>
                  <div className="text-sm font-semibold">4.8</div>
                  <div className="text-xs text-slate-muted">Verified Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2">
                <Users className="text-gold-500" />
                <div>
                  <div className="text-sm font-semibold">2 Lakh+</div>
                  <div className="text-xs text-slate-muted">Trusted across India</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-sm p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg">
              <div className="text-sm text-slate-muted">Quick Enquiry</div>
              <h3 className="font-semibold text-lg mt-2">ICEGATE Registration</h3>
              <p className="text-sm text-slate-muted mt-2">Start your registration and get an expert assigned to help with documents and DSC linking.</p>
              <div className="mt-4">
                <button onClick={() => {
                  const customsLocations = Array.from(selectedIds).map(id=>{ const l=ALL_LOCATIONS.find(x=>x.id===id); return { name: l?.name||id, code: l?.id||id }; });
                  console.log('IcegateDetails Enquire Now -> customsLocations:', customsLocations);
                  onEnquire && onEnquire({ name: 'ICEGATE Registration', slug: 'icegate-registration', customsLocations });
                }} className="w-full px-4 py-2 rounded-full bg-navy-800 text-white">Enquire Now</button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 text-sm text-slate-muted">Current Tab: {activeTab}</div>

        {activeTab === 'service' && (
          <>

        {/* Tabs: Service Details / Customs Location Details */}
        <section className="mt-8">
          <div className="bg-white rounded-2xl p-2 inline-flex shadow-sm">
            <button onClick={() => setActiveTab('service')} className={`px-4 py-2 rounded-xl ${activeTab==='service' ? 'bg-navy-800 text-white' : 'text-navy-800'}`}>
              Service Details
            </button>
            <button onClick={() => setActiveTab('locations')} className={`px-4 py-2 rounded-xl ${activeTab==='locations' ? 'bg-navy-800 text-white' : 'text-navy-800'}`}>
              Customs Location Details
            </button>
          </div>
        </section>

        {/* Applicant Details (shown when navigated with form data) */}
        {applicant && (applicant.name || applicant.email || applicant.phone) && (
          <section className="mt-8">
            <div className="bg-white rounded-2xl shadow-soft p-6 grid md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <h4 className="font-semibold">Applicant Details</h4>
                <div className="mt-2 text-sm text-slate-muted grid sm:grid-cols-2 gap-2">
                  <div><span className="font-medium">Name:</span> {applicant.name || '-'}</div>
                  <div><span className="font-medium">Email:</span> {applicant.email || '-'}</div>
                  <div><span className="font-medium">Phone:</span> {applicant.phone || '-'}</div>
                  <div><span className="font-medium">State:</span> {applicant.state || '-'}</div>
                  <div><span className="font-medium">PAN / GSTIN:</span> {applicant.panGstin || '-'}</div>
                </div>
              </div>
              <div className="flex gap-3 justify-end md:justify-center">
                <button onClick={handlePayment} className="px-4 py-2 rounded-full bg-gold-600 text-white font-semibold">Proceed to Payment</button>
                <button onClick={() => { /* submit application placeholder */ }} className="px-4 py-2 rounded-full border">Submit Application</button>
              </div>
            </div>
          </section>
        )}

        {/* CTA (kept from earlier) */}
        <section className="mt-12 text-center">
          <div className="bg-gradient-to-r from-navy-800 to-gold-500 rounded-3xl p-10 text-white">
            <h4 className="font-display text-3xl">Ready to register on ICEGATE?</h4>
            <p className="mt-3 max-w-2xl mx-auto">Start your registration and get expert assistance from Aurbit Linkers. Fast approvals and end-to-end support.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => onEnquire && onEnquire({ name: 'ICEGATE Registration', slug: 'icegate-registration' })} className="px-6 py-3 rounded-full bg-white text-navy-900 font-semibold">Get Started</button>
              <a href="/contact" className="px-6 py-3 rounded-full border border-white/30">Contact us</a>
            </div>
          </div>
        </section>

        </>
        )}

        {/* Customs Location Details Tab Content */}
        {activeTab === 'locations' && (
          <section className="mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h4 className="font-semibold mb-4">Select Customs Locations</h4>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search location" className="flex-1 px-3 py-2 border rounded-md" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border rounded-md">
                  <option>All</option>
                  <option>Sea Ports</option>
                  <option>Airports</option>
                  <option>ICD Ports</option>
                  <option>Land Ports</option>
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={selectAllChecked} onChange={(e) => handleSelectAll(e.target.checked)} /> Select All
                </label>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-muted">Showing {filteredLocations.length} locations — Selected <span className="font-semibold">{selectedIds.size}</span></div>

                <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredLocations.map((loc) => (
                    <div key={loc.id} className={`p-3 rounded-lg border ${selectedIds.has(loc.id) ? 'bg-gold-50 border-gold-200' : 'bg-white'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{loc.name}</div>
                          <div className="text-xs text-slate-muted">{loc.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedIds.has(loc.id) ? (
                            <button onClick={() => removeSelected(loc.id)} className="text-sm text-red-600">Remove</button>
                          ) : (
                            <button onClick={() => toggleSelect(loc.id)} className="px-3 py-1 rounded-full border text-sm">Select</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected chips */}
                {selectedIds.size > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-2">Selected Locations</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedIds).map((id) => {
                        const loc = ALL_LOCATIONS.find((l) => l.id === id);
                        return (
                          <div key={id} className="inline-flex items-center gap-2 bg-white border px-3 py-1 rounded-full">
                            <div className="text-sm">{loc?.name || id}</div>
                            <button onClick={() => removeSelected(id)} className="text-xs text-red-600">x</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button onClick={submitLocationsRequest} className="px-4 py-2 rounded-full bg-navy-800 text-white">Submit Locations</button>
                  <button onClick={() => setSelectedIds(new Set())} className="px-4 py-2 rounded-full border">Clear Selection</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Registration Process - timeline cards */}
        <section className="mt-12">
          <h3 className="font-display text-2xl mb-6">Registration Process</h3>
          <div className="space-y-4">
            {[
              'Collect required documents and DSC.',
              'Fill application and submit on ICEGATE portal.',
              'DSC linking and verification.',
              'Approval and activation on ICEGATE.'
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-soft grid sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-1 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center font-bold">{idx + 1}</div>
                </div>
                <div className="sm:col-span-11">
                  <div className="font-semibold">Step {idx + 1}</div>
                  <div className="text-sm text-slate-muted mt-1">{step}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h3 className="font-display text-2xl mb-6">Frequently asked questions</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <div className="font-semibold">How long does ICEGATE registration take?</div>
              <div className="text-sm text-slate-muted mt-2">Typically 3-7 business days depending on DSC readiness and document verification.</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <div className="font-semibold">Do I need a DSC?</div>
              <div className="text-sm text-slate-muted mt-2">Yes, DSC is required for authorized submissions on ICEGATE.</div>
            </div>
          </div>
        </section>

        {/* Eligibility & Documents */}
        <section className="mt-12 grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <h3 className="font-display text-xl mb-4">Eligibility</h3>
            <ul className="list-disc pl-5 text-slate-muted space-y-2">
              <li>Businesses involved in import/export</li>
              <li>Authorized representatives with DSC</li>
              <li>Entities with valid PAN and GST (if applicable)</li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-display text-xl mb-4">Documents Required</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold">PAN Card</div>
                <div className="text-sm text-slate-muted">Copy of PAN card for entity/authorized signatory.</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold">Incorporation Proof</div>
                <div className="text-sm text-slate-muted">Certificate of incorporation or registration.</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold">Address Proof</div>
                <div className="text-sm text-slate-muted">Registered office address proof and contact details.</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-semibold">Digital Signature</div>
                <div className="text-sm text-slate-muted">DSC for the authorized signatory.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits as cards */}
        <section className="mt-12">
          <h3 className="font-display text-2xl mb-6">Benefits</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <Star className="mx-auto text-gold-500" size={28} />
              <div className="font-semibold mt-4">Trusted Support</div>
              <div className="text-sm text-slate-muted mt-2">Experienced team to guide you end-to-end.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <Users className="mx-auto text-gold-500" size={28} />
              <div className="font-semibold mt-4">Business Friendly</div>
              <div className="text-sm text-slate-muted mt-2">Solutions tailored for your company.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <CheckCircle className="mx-auto text-gold-500" size={28} />
              <div className="font-semibold mt-4">Compliance Ready</div>
              <div className="text-sm text-slate-muted mt-2">Accurate filings and regulatory checks.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <MapPin className="mx-auto text-gold-500" size={28} />
              <div className="font-semibold mt-4">Live Tracking</div>
              <div className="text-sm text-slate-muted mt-2">Track filing status in real-time.</div>
            </div>
          </div>
        </section>

        {/* Request Received modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h4 className="font-semibold text-lg">Request Received</h4>
              <p className="text-sm text-slate-muted mt-2">Thank you. Your customs location request has been received. Our team will contact you shortly.</p>
                <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedIds(new Set());
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setSelectAllChecked(false);
                  }}
                  className="px-4 py-2 rounded-full border"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* end of modals */}
      </main>
    </div>
  );
}
