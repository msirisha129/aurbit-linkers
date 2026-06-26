// Fallback data mirrors backend/config/seed.js — used if the API is unreachable
// so the UI still renders fully. Once the backend + MongoDB are running,
// ServicesContext fetches the live version from /api/services instead.

export const fallbackCategories = [
  {
    key: 'business-setup',
    label: 'Business Setup',
    icon: 'briefcase',
    summary: 'Udyam, Shop & Establishment, and FSSAI Food License registrations.',
    items: [
      { name: 'Udyam Registration (MSME / Small Business Registration)', slug: 'udyam-registration-msme' },
      { name: 'Shop & Establishment Registration (Shop Act - Maharashtra)', slug: 'shop-establishment-registration' },
      { name: 'FSSAI Food License (Basic / State / Central)', slug: 'fssai-food-license' },
    ],
  },
  {
    key: 'gst',
    label: 'GST',
    icon: 'receipt',
    summary: 'GST registration, amendments, cancellations, and regular return filings.',
    items: [
      { type: 'subheading', label: 'Registration & Amendments' },
      { name: 'New GST Registration', slug: 'new-gst-registration' },
      { name: 'GST Amendment / Core Field Changes', slug: 'gst-amendment' },
      { name: 'GST Cancellation / Surrender', slug: 'gst-cancellation' },
      { type: 'subheading', label: 'Regular GST Filings' },
      { name: 'GSTR-1 Filing (Sales Return)', slug: 'gstr-1-filing' },
      { name: 'GSTR-3B Filing (Summary & Tax Payment)', slug: 'gstr-3b-filing' },
      { name: 'GSTR-9 (GST Annual Return)', slug: 'gstr-9-filing' },
    ],
  },
  {
    key: 'dsc',
    label: 'DSC',
    icon: 'fingerprint',
    summary: 'Apply for Digital Signature Certificate.',
    items: [
      { name: 'Apply for Digital Signature Certificate', slug: 'apply-digital-signature' },
    ],
  },
  {
    key: 'import-export',
    label: 'Import Export',
    icon: 'globe',
    summary: 'IEC, RCMC registrations with various export promotion councils.',
    items: [
      { type: 'subheading', label: 'Basic EXIM Setup' },
      { name: 'Import Export Code (IEC) Registration', slug: 'iec-registration' },
      { type: 'subheading', label: 'Export Promotion Councils (RCMC)' },
      { name: 'APEDA RCMC (Agricultural products)', slug: 'apeda-rcmc' },
      { name: 'FIEO RCMC (General exporters)', slug: 'fieo-rcmc' },
      { name: 'Spice Board RCMC', slug: 'spice-board-rcmc' },
      { name: 'Tea Board RCMC', slug: 'tea-board-rcmc' },
      { name: 'Coconut Board RCMC', slug: 'coconut-board-rcmc' },
      { type: 'subheading', label: 'Annual RCMC Returns' },
      { name: 'Spice Board RCMC Return Filing', slug: 'spice-board-rcmc-return' },
      { name: 'Tea Board RCMC Return Filing', slug: 'tea-board-rcmc-return' },
    ],
  },
  {
    key: 'icegate',
    label: 'ICEGATE Services',
    icon: 'ship',
    summary: 'ICEGATE, AD Code, Port registration, PQIS, RoDTEP.',
    items: [
      { name: 'ICEGATE Registration', slug: 'icegate-registration' },
      { name: 'AD Code Registration (Authorized Dealer Code)', slug: 'ad-code-registration' },
      { name: 'IFSC / Port Registration', slug: 'ifsc-port-registration' },
      { name: 'PQIS Registration (Plant Quarantine Information System)', slug: 'pqis-registration' },
      { name: 'RoDTEP E-Scrip', slug: 'rodtep-e-scrip' },
    ],
  },
  {
    key: 'trademark',
    label: 'Trademark',
    icon: 'shield-check',
    summary: 'Search, file, and protect your brand with trademark registration and watch services.',
    items: [
      { name: 'Trademark Registration', slug: 'trademark-registration' },
      { name: 'Trademark Objection', slug: 'trademark-objection' },
      { name: 'Trademark Certificate', slug: 'trademark-certificate' },
      { name: 'Trademark Opposition', slug: 'trademark-opposition' },
      { name: 'Trademark Hearing', slug: 'trademark-hearing' },
      { name: 'Trademark Rectification', slug: 'trademark-rectification' },
      { name: 'TM Infringement Notice', slug: 'tm-infringement-notice' },
      { name: 'Trademark Renewal', slug: 'trademark-renewal' },
      { name: 'Trademark Transfer', slug: 'trademark-transfer' },
      { name: 'Expedited TM Registration', slug: 'expedited-tm-registration' },
      { name: 'Logo Designing', slug: 'logo-designing' },
      { name: 'Design Registration', slug: 'design-registration' },
      { name: 'Design Objection', slug: 'design-objection' },
      { name: 'Copyright Registration', slug: 'copyright-registration' },
      { name: 'Copyright Objection', slug: 'copyright-objection' },
      { name: 'Patent Registration', slug: 'patent-registration' },
      { name: 'Trademark Protection', slug: 'trademark-protection' },
    ],
  },
];

export const homepageCards = [
  { key: 'business-setup', name: 'Business Setup', desc: 'Udyam, Shop & Establishment, and FSSAI Food License registrations.', icon: 'briefcase' },
  { key: 'gst', name: 'GST Compliance', desc: 'Registration, amendments, and regular GSTR filings — all handled in one place.', icon: 'receipt' },
  { key: 'dsc', name: 'Digital Signature Certificate', desc: 'Get your DSC issued quickly for secure digital filing and authentication.', icon: 'file-badge-2' },
  { key: 'import-export', name: 'Import Export Services', desc: 'IEC registration, RCMC certifications, and export council compliance.', icon: 'globe' },
  { key: 'icegate', name: 'ICEGATE Services', desc: 'Registration, AD Code, port codes, and export incentive scrips handled end to end.', icon: 'landmark' },
  { key: 'trademark', name: 'Trademark Protection', desc: 'Search, file, and protect your brand with trademark registration and watch services.', icon: 'shield-check' },
];

export const faqs = [
  {
    q: 'How can Aurbit Linkers help my business with GST registration and compliance?',
    a: 'We handle end-to-end GST registration, monthly and annual return filing, reconciliation against purchase records, and notice responses — with a dedicated specialist reviewing every filing before submission.',
  },
  {
    q: 'What is AI-powered automation, and how can it benefit my business?',
    a: 'Our platform reads your filings, flags mismatches before they become notices, and auto-fills recurring forms from your last submission — cutting the manual work down to review and approval.',
  },
  {
    q: 'How do I automate my business compliance processes with Aurbit Linkers?',
    a: 'Create an account, connect your bank and GST credentials once, and our system tracks every due date — sending reminders and pre-filled drafts ahead of each deadline.',
  },
  {
    q: 'How does the Linkers Cloud support compliance, registration, and taxation for companies?',
    a: 'Linkers Cloud is our unified workspace — it links your registration records, tax filings, and compliance calendar in one place so nothing falls through the cracks across teams or financial years.',
  },
];