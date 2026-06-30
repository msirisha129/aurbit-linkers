import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, ShieldCheck, Zap, Lock, Headphones, Globe, FileText, Download, Video, RefreshCw, Search, Building2, ArrowRight } from 'lucide-react';
import CTABanner from '../components/CTABanner';
import DSCFAQ from '../components/DSCFAQ';


export default function DSCService() {
  const navigate = useNavigate();
  const [classType, setClassType] = useState('Class 3');
  const [userType, setUserType] = useState('Individual');
  const [certType, setCertType] = useState('Signature');
  const [validity, setValidity] = useState('1');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const price = (() => {
    const b = classType === 'DGFT' ? (userType === 'Organization' ? 1999 : 1499) : userType === 'Organization' ? 1499 : 999;
    const vt = classType === 'DGFT' ? [0, 1000, 2000] : [0, 500, 1000];
    const ct = [0, 300, 500];
    return b + vt[+validity - 1] + ct[['Signature', 'Encryption', 'Both'].indexOf(certType)];
  })();

  const actions = [
    {
      icon: FileText,
      title: 'Apply for DSC',
      desc: 'Apply for a new Class 3 Digital Signature Certificate online.',
      link: 'Apply',
    },
    {
      icon: Download,
      title: 'Download Certificate',
      desc: 'Download your issued DSC using your application details.',
      link: 'Download',
    },
    {
      icon: Video,
      title: 'Video Verification',
      desc: 'Complete Aadhaar-based verification securely.',
      link: 'Start',
    },
    {
      icon: RefreshCw,
      title: 'Renew DSC',
      desc: 'Renew your Digital Signature Certificate before expiry.',
      link: 'Renew',
    },
    {
      icon: Search,
      title: 'Track Application',
      desc: 'Track your DSC application status in real time.',
      link: 'Track',
    },
    {
      icon: Building2,
      title: 'Enterprise Solutions',
      desc: 'Bulk DSC issuance and compliance solutions.',
      link: 'Contact Sales',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* HERO / LEFT PANEL */}
        <div className="relative bg-[#f5f0e8] flex items-center justify-center px-10 lg:px-12 py-10 lg:py-12 overflow-hidden">
          <div className="max-w-xl relative z-10 w-full">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9A84C] mb-2 bg-white/60 backdrop-blur-sm border border-[#C9A84C]/20 rounded-full px-3 py-0.5">
              Digital Signature Certificate
            </span>

            <h1 className="text-[26px] lg:text-[34px] font-display text-[#1a2744] leading-[1.15] mb-2 tracking-tight">
              Buy Digital Signature Certificate in 3 clicks. 100% paperless.
            </h1>

            <div className="w-12 h-[2px] rounded-full bg-[#C9A84C] mb-2.5" />

            <p className="text-[13px] lg:text-[14px] text-slate-600 mb-4 leading-snug max-w-[520px]">
              Used for GST, MCA, Income Tax, ICEGATE, Tender submissions, EPFO filings, and more
            </p>

            <ul className="space-y-2 mb-6">
              {['Government licensed certifying authority', 'Certificates issued under 30 minutes', '24/7 live support with less than 5 mins response time', '2048 bit encryption in line with global standards', 'Unlimited Re-issuance'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 size={15} className="text-[#C9A84C]" />
                  </span>
                  <span className="text-[13px] lg:text-[13px] text-slate-800 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-white/80 rounded-lg px-3 py-2 shadow-sm">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#1a2744] text-white">
                <Phone size={14} strokeWidth={2.2} />
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-0.5">Need help?</p>
                <p className="text-[13px] font-semibold text-[#1a2744]">We respond in less than 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONFIGURE / RIGHT PANEL */}
        <div className="flex items-center justify-center px-8 lg:px-10 py-10 lg:py-12 bg-[#1a2744]">
          <div className="w-full max-w-lg bg-white rounded-xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(10,26,60,0.15)] p-5">
            {submitted ? (
              <div className="text-center px-4 py-5">
                <CheckCircle2 size={40} className="text-[#C9A84C] mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#1a2744] mb-1.5">
                  Enquiry Submitted!
                </h3>
                <div className="bg-[#f5f0e8] rounded-lg p-3 mb-3 text-left space-y-0.5">
                  <p className="text-sm text-slate-700"><strong>Service:</strong> Digital Signature Certificate</p>
                  <p className="text-sm text-slate-700"><strong>Class:</strong> {classType}</p>
                  <p className="text-sm text-slate-700"><strong>User:</strong> {userType}</p>
                  <p className="text-sm text-slate-700"><strong>Validity:</strong> {validity} Year(s)</p>
                  <p className="text-sm text-slate-700"><strong>Price:</strong> ₹{price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-slate-700"><strong>Phone:</strong> +91 {phone}</p>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Our team will contact you within 5 minutes!
                </p>
                <button onClick={() => {setSubmitted(false); setPhone('')}}
                  className="inline-flex items-center justify-center h-[44px] px-5 bg-[#1a2744] text-white border-none rounded-lg text-sm font-semibold hover:bg-[#15203a] transition-colors cursor-pointer">
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-base font-bold text-[#1a2744] mb-3 tracking-tight">Configure your DSC</h2>

                {/* Class Type */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Class Type</div>
                  <div className="grid grid-cols-2 gap-1">
                    {['Class 3', 'DGFT'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setClassType(opt)} className={`h-[44px] rounded-lg text-sm font-semibold transition-all duration-200 ${classType === opt ? 'bg-[#1a2744] text-white border border-[#1a2744] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                {/* User Type */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">User Type</div>
                  <div className="grid grid-cols-2 gap-1">
                    {['Individual', 'Organization'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setUserType(opt)} className={`h-[44px] rounded-lg text-sm font-semibold transition-all duration-200 ${userType === opt ? 'bg-[#1a2744] text-white border border-[#1a2744] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                {/* Certificate Type */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Certificate Type</div>
                  <div className="grid grid-cols-3 gap-1">
                  {['Signature', 'Encryption', 'Both'].map((opt) => (
                    <button key={opt} type="button" onClick={() => setCertType(opt)} className={`h-[44px] rounded-lg text-sm font-semibold transition-all duration-200 ${certType === opt ? 'bg-[#1a2744] text-white border border-[#1a2744] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>{opt}</button>
                  ))}
                </div>
              </div>

              {/* Validity */}
              <div className="mb-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Validity</div>
                <div className="grid grid-cols-3 gap-1">
                  {['1', '2', '3'].map((opt) => (
                    <button key={opt} type="button" onClick={() => setValidity(opt)} className={`h-[44px] rounded-lg text-sm font-semibold transition-all duration-200 ${validity === opt ? 'bg-[#1a2744] text-white border border-[#1a2744] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>{opt} Year{opt !== '1' ? 's' : ''}</button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-gradient-to-br from-[#f5f0e8] to-[#ede4d3] rounded-xl px-3 py-1.5 mb-3 text-center border border-[#C9A84C]/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Your Price</p>
                <p className="text-2xl font-display font-bold text-[#1a2744] mb-0 tracking-tight">₹{price.toLocaleString('en-IN')}</p>
              </div>

              {/* Phone form */}
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                setError('');
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(phone)) {
                  setError('Please enter a valid 10-digit Indian mobile number');
                  return;
                }
                setSubmitted(true);
                navigate('/service/dsc/details', {
                  state: {
                    classType,
                    userType,
                    certificateType: certType,
                    validity,
                    amount: price,
                    phone
                  }
                });
              }} className="mb-2.5">
                <div className="flex gap-1.5">
                  <div className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 select-none">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span className="font-semibold">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => { setPhone(e.target.value); setError(''); }} 
                    placeholder="Enter mobile number" 
                    maxLength={10}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none transition-all" 
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1 mb-1">{error}</p>}
                <button type="submit" disabled={!phone.trim()} className="w-full mt-1.5 h-[44px] rounded-lg bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Verify Mobile</button>
              </form>

              <p className="text-center text-xs text-slate-500">
                Looking for bulk DSC? <button className="text-[#C9A84C] font-semibold hover:underline transition-colors">Contact us</button>
              </p>
            </>
          )}
          </div>
        </div>
      </div>

      {/* WHY BUSINESSES TRUST AURBIT LINKERS */}
      <section className="bg-white py-12">
        <div className="max-w-[1160px] mx-auto px-10 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <h2 className="font-display text-[32px] text-navy-900 leading-[1.2] tracking-[-0.5px] font-semibold mb-4">
                Why Businesses Trust Aurbit Linkers
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-[15px] text-slate-600 leading-[1.8] max-w-[500px]">
                  We are a trusted provider of Digital Signature Certificates and business compliance services, authorized by the Controller of Certifying Authorities (CCA), Government of India.
                </p>
                <p className="text-[15px] text-slate-600 leading-[1.8] max-w-[500px]">
                  Our streamlined processes, Aadhaar-based eKYC verification, and dedicated support team ensure a seamless experience from application to certificate download.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {[
                  { icon: ShieldCheck, title: 'Government Authorized' },
                  { icon: Zap, title: 'Fast Processing' },
                  { icon: Lock, title: 'Secure Verification' },
                  { icon: Headphones, title: 'Dedicated Support' },
                  { icon: Globe, title: 'PAN India Service' },
                  { icon: CheckCircle2, title: 'End-to-End Guidance' },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start gap-2.5">
                      <Icon size={16} className="text-[#C9A84C] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span className="text-[14px] text-navy-900 font-medium leading-[1.6]">
                        {feature.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-navy-100 pt-8">
                <div className="flex flex-wrap justify-center gap-10">
                  <div className="text-center">
                    <div className="text-[30px] font-display text-navy-900 leading-none mb-1.5 tracking-tight">30 min</div>
                    <div className="text-[12px] text-slate-600 leading-relaxed">Average Approval</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[30px] font-display text-navy-900 leading-none mb-1.5 tracking-tight">2K+</div>
                    <div className="text-[12px] text-slate-600 leading-relaxed">Businesses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[30px] font-display text-navy-900 leading-none mb-1.5 tracking-tight">99.9%</div>
                    <div className="text-[12px] text-slate-600 leading-relaxed">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Business team collaboration"
                className="w-full h-[420px] lg:h-[460px] object-cover rounded-[20px] border border-[#E7E3DA]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-10">
        <div className="max-w-[1160px] mx-auto px-10 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left Column - Timeline */}
            <div>
              <span className="eyebrow justify-center lg:justify-start inline-flex mb-3 text-[11px] tracking-[2px] font-semibold uppercase text-[#C9A84C]">
                How It Works
              </span>
              <h2 className="font-display text-[28px] text-navy-900 leading-[1.2] tracking-[-0.5px] font-semibold mb-3">
                Get Your Digital Signature Certificate in 3 Simple Steps
              </h2>
              <p className="text-[15px] text-slate-600 leading-[1.8] mb-6 max-w-[480px]">
                Apply for your Digital Signature Certificate online through a secure, paperless process with expert guidance from Aurbit Linkers.
              </p>

              <div className="space-y-0">
                {[
                  { num: '01', title: 'Configure Your DSC', desc: 'Choose the certificate type, user category, and validity that best suits your business or personal requirements.' },
                  { num: '02', title: 'Complete Aadhaar eKYC', desc: 'Verify your identity securely using Aadhaar-based paperless eKYC with government-authorized verification.' },
                  { num: '03', title: 'Receive Your Certificate', desc: 'After successful verification, your Digital Signature Certificate is issued and ready to download.' },
                ].map((step, i) => (
                  <div key={step.num} className="relative flex gap-5 pb-6 last:pb-0">
                    {/* Vertical line */}
                    {i !== 2 && (
                      <div className="absolute left-[19px] top-[36px] bottom-0 w-px bg-navy-200" />
                    )}

                    {/* Number badge */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full border-2 border-navy-900 text-navy-900 flex items-center justify-center text-sm font-semibold bg-white">
                        {step.num}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-[17px] text-navy-900 font-semibold mb-1.5 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-[14px] text-slate-600 leading-[1.8]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              <div className="bg-[#F8F7F4] rounded-[20px] h-[380px] flex items-center justify-center overflow-hidden">
                {/* TODO: Replace with actual illustration */}
                <svg viewBox="0 0 400 400" className="w-full h-full p-8" aria-hidden="true">
                  <defs>
                    <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C9974A" />
                      <stop offset="100%" stopColor="#A67C2E" />
                    </linearGradient>
                  </defs>
                  
                  {/* Document icon */}
                  <rect x="140" y="80" width="120" height="160" rx="8" fill="white" stroke="#E7E3DA" strokeWidth="2" />
                  <rect x="160" y="110" width="80" height="4" rx="2" fill="#C9974A" opacity="0.6" />
                  <rect x="160" y="125" width="60" height="3" rx="1.5" fill="#C9974A" opacity="0.4" />
                  <rect x="160" y="135" width="70" height="3" rx="1.5" fill="#C9974A" opacity="0.4" />
                  <rect x="160" y="145" width="50" height="3" rx="1.5" fill="#C9974A" opacity="0.4" />
                  
                  {/* Checkmark */}
                  <circle cx="200" cy="200" r="30" fill="url(#goldGrad2)" />
                  <path d="M 188 200 L 196 208 L 212 192" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Shield icon */}
                  <path d="M 200 260 L 160 280 L 160 320 Q 160 360 200 380 Q 240 360 240 320 L 240 280 Z" fill="white" stroke="#E7E3DA" strokeWidth="2" />
                  <path d="M 200 270 L 180 285 L 180 315 Q 180 345 200 360 Q 220 345 220 315 L 220 285 Z" fill="url(#goldGrad2)" opacity="0.2" />
                  <path d="M 200 290 L 190 300 L 210 300 Z" fill="#C9974A" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIGITAL SIGNATURE CERTIFICATE - 6 ACTIONS */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1160px] mx-auto px-10 lg:px-12">
          <h2 className="font-display text-[28px] lg:text-[32px] text-navy-900 leading-[1.2] tracking-[-0.5px] font-semibold text-center mb-14">
            Digital Signature Certificate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-14">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Icon size={28} className="text-[#C9A84C]" strokeWidth={1.2} />
                  </div>
                  <h3 className="text-[17px] text-navy-900 font-semibold mb-2 tracking-tight">
                    {action.title}
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-[1.7] mb-4 max-w-[260px]">
                    {action.desc}
                  </p>
                  <button className="inline-flex items-center gap-1.5 text-[#C9A84C] font-semibold text-[14px] hover:gap-2 transition-all">
                    {action.link}
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DSC FAQ */}
      <DSCFAQ />

      {/* CTA BANNER */}
      <CTABanner />
    </div>
  );
}
