import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DSCDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {};

  const [paymentError, setPaymentError] = useState(config.paymentError || '');

  const [form, setForm] = useState({
    email: '',
    billingAddress: '',
    country: 'India',
    postalCode: '',
    state: '',
    district: '',
    gstAvailable: '',
    shippingSame: 'yes',
    shippingAddress: '',
  });

  const [errors, setErrors] = useState({});

  if (!config.phone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No configuration found. Please start from the DSC page.</p>
          <button onClick={() => navigate('/service/dsc')} className="px-6 py-3 bg-[#1a2744] text-white rounded-lg text-sm font-semibold">Go to DSC</button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (config.paymentError) {
      setPaymentError(config.paymentError);
    }
  }, [config.paymentError]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.billingAddress.trim()) errs.billingAddress = 'Billing address is required';
    if (!form.country.trim()) errs.country = 'Country is required';
    if (!form.postalCode.trim()) errs.postalCode = 'Postal code is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.district.trim()) errs.district = 'District is required';
    if (form.shippingSame === 'no' && !form.shippingAddress.trim()) errs.shippingAddress = 'Shipping address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate('/service/dsc/payment', {
      state: {
        ...config,
        ...form,
      }
    });
  };

  const inputClass = (field) =>
    `w-full h-[44px] px-3 bg-white border rounded-md text-sm outline-none transition-all ${
      errors[field] ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
    }`;

  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5';

  const toggleBtnClass = (selected, opt) =>
    `h-[36px] px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
      selected === opt ? 'bg-[#1a2744] text-white border border-[#1a2744]' : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-5">
          <h1 className="font-display text-xl lg:text-2xl text-navy-900 font-semibold tracking-tight">Complete Your Details</h1>
          <p className="text-slate-600 text-sm mt-0.5">Fill in your details to proceed with DSC purchase</p>
        </div>

        {/* Payment Error Banner */}
        {paymentError && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Payment Failed</p>
              <p className="text-sm text-red-600 mt-0.5">{paymentError}</p>
            </div>
            <button
              onClick={() => setPaymentError('')}
              className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0"
            >
              &times;
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT COLUMN - Customer Details Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-display text-base text-navy-900 font-semibold mb-5">Customer Details</h2>

                {/* Mobile Number (readonly) */}
                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <div className="flex items-center gap-2 px-3 h-[44px] bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span className="font-semibold">+91</span>
                    <span className="text-gray-900">{config.phone}</span>
                  </div>
                </div>

                {/* GSTIN Available */}
                <div>
                  <label className={labelClass}>GSTIN Available?</label>
                  <div className="flex gap-2">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('gstAvailable', opt)}
                        className={toggleBtnClass(form.gstAvailable, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Billing Address */}
                <div>
                  <label className={labelClass}>Billing Address *</label>
                  <textarea
                    value={form.billingAddress}
                    onChange={(e) => handleChange('billingAddress', e.target.value)}
                    placeholder="Enter your billing address"
                    rows={2}
                    className={`w-full px-3 py-2.5 bg-white border rounded-md text-sm outline-none transition-all resize-none ${
                      errors.billingAddress ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
                    }`}
                  />
                  {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                </div>

                {/* Country & Postal Code row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Country *</label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder="Enter country"
                      className={inputClass('country')}
                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code *</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder="Enter postal code"
                      className={inputClass('postalCode')}
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                {/* State & District row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>State *</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="Enter state"
                      className={inputClass('state')}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>District *</label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      placeholder="Enter district"
                      className={inputClass('district')}
                    />
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className={labelClass}>Shipping Address</label>
                  <div className="flex gap-2 mb-3">
                    {[
                      { value: 'yes', label: 'Same as Billing' },
                      { value: 'no', label: 'Different Address' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange('shippingSame', opt.value)}
                        className={toggleBtnClass(form.shippingSame, opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {form.shippingSame === 'no' && (
                    <>
                      <textarea
                        value={form.shippingAddress}
                        onChange={(e) => handleChange('shippingAddress', e.target.value)}
                        placeholder="Enter shipping address"
                        rows={2}
                        className={`w-full px-3 py-2.5 bg-white border rounded-md text-sm outline-none transition-all resize-none ${
                          errors.shippingAddress ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20'
                        }`}
                      />
                      {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full h-[44px] rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN - Product Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-24">
              <h3 className="font-display text-sm text-navy-900 font-semibold mb-3">Order Summary</h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-slate-600">Service</span>
                  <span className="text-xs text-navy-900 font-medium">Digital Signature Certificate</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-slate-600">Class</span>
                  <span className="text-xs text-navy-900 font-medium">{config.classType}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-slate-600">User Type</span>
                  <span className="text-xs text-navy-900 font-medium">{config.userType}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-slate-600">Certificate Type</span>
                  <span className="text-xs text-navy-900 font-medium">{config.certificateType}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-xs text-slate-600">Validity</span>
                  <span className="text-xs text-navy-900 font-medium">{config.validity} Year{config.validity !== '1' ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-navy-900 font-bold">Total Amount</span>
                  <span className="text-base text-navy-900 font-bold">₹{config.amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}