const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/pages/DSCService.jsx');
const content = `import { useState } from 'react';
import { CheckCircle2, Phone } from 'lucide-react';

export default function DSCService() {
  const [classType, setClassType] = useState('Class 3');
  const [userType, setUserType] = useState('Individual');
  const [certType, setCertType] = useState('Signature');
  const [validity, setValidity] = useState('1');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const price = (() => {
    const b = classType === 'DGFT' ? (userType === 'Organization' ? 1999 : 1499) : userType === 'Organization' ? 1499 : 999;
    const vt = classType === 'DGFT' ? [0, 1000, 2000] : [0, 500, 1000];
    const ct = [0, 300, 500];
    return b + vt[+validity - 1] + ct[['Signature', 'Encryption', 'Both'].indexOf(certType)];
  })();

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="bg-[#f5f0e8] flex items-center justify-center px-8 py-16">
          <div className="max-w-xl">
            <h1 className="text-3xl lg:text-4xl font-display text-[#1a2744] leading-snug mb-4">Buy Digital Signature Certificate in 3 clicks. 100% paperless.</h1>
            <p className="text-slate-muted mb-10 leading-relaxed">Used for GST, MCA, Income Tax, ICEGATE, Tender submissions, EPFO filings, and more</p>
            <ul className="space-y-5">
              {['Government licensed certifying authority', 'Certificates issued under 30 minutes', '24/7 live support with less than 5 mins response time', '2048 bit encryption in line with global standards', 'Unlimited Re-issuance'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                  <span className="text-sm lg:text-[15px] text-slate-800 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 flex items-center gap-3 text-sm text-slate-500">
              <Phone size={18} className="text-[#1a2744]" />
              <span>Need help? We respond in less than 5 minutes.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-16 bg-white">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_-8px_rgba(10,26,60,0.12)] border border-gray-100 p-7 lg:p-9 w-full max-w-lg">
            <h2 className="font-display text-2xl lg:text-[28px] text-[#1a2744] mb-7">Configure your DSC</h2>
            <div className="mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Class Type</div>
              <div className="grid grid-cols-2 gap-2.5">
                {['Class 3', 'DGFT'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setClassType(opt)} className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${classType === opt ? 'bg-[#C9A84C] text-white border border-[#C9A84C] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">User Type</div>
              <div className="grid grid-cols-2 gap-2.5">
                {['Individual', 'Organization'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setUserType(opt)} className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${userType === opt ? 'bg-[#C9A84C] text-white border border-[#C9A84C] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Certificate Type</div>
              <div className="grid grid-cols-3 gap-2.5">
                {['Signature', 'Encryption', 'Both'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setCertType(opt)} className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${certType === opt ? 'bg-[#C9A84C] text-white border border-[#C9A84C] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="mb-7">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Validity</div>
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setValidity(opt)} className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${validity === opt ? 'bg-[#C9A84C] text-white border border-[#C9A84C] shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'}`}>{opt} Year{opt !== '1' ? 's' : ''}</button>
                ))}
              </div>
            </div>
            <div className="bg-[#f5f0e8] rounded-xl p-5 mb-7 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Your Price</p>
              <p className="text-4xl font-display text-[#1a2744]">₹{price.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-600 mt-1">{classType} · {userType} · {certType} · {validity} Year{validity !== '1' ? 's' : ''}</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (!phone.trim()) return; setSubmitting(true); alert('Enquiry submitted!\\n\\nService: Digital Signature Certificate\\nClass: ' + classType + '\\nUser: ' + userType + '\\nCert Type: ' + certType + '\\nValidity: ' + validity + ' Year(s)\\nPhone: +91 ' + phone + '\\nPrice: ₹' + price.toLocaleString('en-IN')); setSubmitting(false); }} className="mb-4">
              <div className="flex gap-2.5">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 select-none">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-semibold">+91</span>
                </div>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter mobile number" className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-colors" />
              </div>
              <button type="submit" disabled={!phone.trim() || submitting} className="w-full mt-3 py-3 rounded-lg bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Please wait...' : 'Proceed'}</button>
            </form>
            <p className="text-center text-xs text-slate-500">
              Looking for bulk DSC? <button className="text-[#C9A84C] font-semibold hover:underline">Contact us</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(file, content);
