require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const ServiceCategory = require('../models/ServiceCategory');

const categories = [
  {
    key: 'startup',
    label: 'Startup',
    icon: 'building-2',
    order: 1,
    summary: 'Private Limited, LLP & OPC — DIN, DSC, PAN, name approval, and incorporation end-to-end.',
    items: [
      { name: 'Proprietorship', slug: 'proprietorship' },
      { name: 'Partnership', slug: 'partnership' },
      { name: 'One Person Company', slug: 'one-person-company' },
      { name: 'Limited Liability Partnership', slug: 'llp' },
      { name: 'Private Limited Company', slug: 'private-limited-company' },
      { name: 'Section 8 Company', slug: 'section-8-company' },
      { name: 'Trust Registration', slug: 'trust-registration' },
      { name: 'Public Limited Company', slug: 'public-limited-company' },
      { name: 'Producer Company', slug: 'producer-company' },
      { name: 'Indian Subsidiary', slug: 'indian-subsidiary' },
    ],
  },
  {
    key: 'registrations',
    label: 'Registrations',
    icon: 'file-badge-2',
    order: 2,
    summary: 'Licenses and registrations to operate compliantly — from FSSAI to import/export codes.',
    items: [
      { name: 'Startup India', slug: 'startup-india' },
      { name: 'Trade License', slug: 'trade-license' },
      { name: 'FSSAI Registration', slug: 'fssai-registration' },
      { name: 'FSSAI License', slug: 'fssai-license' },
      { name: 'Halal License & Certification', slug: 'halal-license' },
      { name: 'ICEGATE Registration', slug: 'icegate-registration' },
      { name: 'Import Export Code', slug: 'import-export-code' },
      { name: 'Legal Entity Identifier Code', slug: 'lei-code' },
      { name: 'ISO Registration', slug: 'iso-registration' },
      { name: 'PF Registration', slug: 'pf-registration' },
      { name: 'ESI Registration', slug: 'esi-registration' },
      { name: 'Professional Tax Registration', slug: 'professional-tax-registration' },
      { name: 'RCMC Registration', slug: 'rcmc-registration' },
      { name: 'TN RERA Registration for Agents', slug: 'tn-rera-registration' },
      { name: '12A and 80G Registration', slug: '12a-80g-registration' },
      { name: '12A Registration', slug: '12a-registration' },
      { name: '80G Registration', slug: '80g-registration' },
      { name: 'Barcode Registration', slug: 'barcode-registration' },
      { name: 'BIS Registration', slug: 'bis-registration' },
      { name: 'Certificate of Incumbency', slug: 'certificate-of-incumbency' },
      { name: 'Darpan Registration', slug: 'darpan-registration' },
      { name: 'Digital Signature', slug: 'digital-signature' },
      { name: 'Shop Act Registration', slug: 'shop-act-registration' },
      { name: 'Udyam Registration', slug: 'udyam-registration' },
      { name: 'Fire License', slug: 'fire-license' },
      { name: 'Legal Name Change', slug: 'legal-name-change' },
      { name: 'Water Testing', slug: 'water-testing' },
      { name: 'Food Testing', slug: 'food-testing' },
    ],
  },
  {
    key: 'trademark',
    label: 'Trademark',
    icon: 'shield-check',
    order: 3,
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
  {
    key: 'gst',
    label: 'GST',
    icon: 'receipt',
    order: 4,
    summary: 'GST registration, GSTR-1, GSTR-3B filing, reconciliation, and notice handling — automated.',
    items: [
      { name: 'GST Registration', slug: 'gst-registration' },
      { name: 'GST Return Filing by Accountant', slug: 'gst-return-filing' },
      { name: 'GST LUT Form', slug: 'gst-lut-form' },
      { name: 'GST Notice', slug: 'gst-notice' },
      { name: 'GST Annual Return Filing (GSTR-9)', slug: 'gst-annual-return-gstr9' },
      { name: 'GST Registration for Foreigners', slug: 'gst-registration-foreigners' },
      { name: 'GST Amendment', slug: 'gst-amendment' },
      { name: 'GST Revocation', slug: 'gst-revocation' },
      { name: 'GSTR-10', slug: 'gstr-10' },
      { name: 'Virtual Office + GSTIN', slug: 'virtual-office-gstin' },
    ],
  },
  {
    key: 'income-tax',
    label: 'Income Tax',
    icon: 'banknote',
    order: 5,
    summary: 'Individual and corporate ITR filing, TDS returns, and tax planning with expert guidance.',
    items: [
      { name: 'Income Tax E-Filing', slug: 'income-tax-efiling' },
      { name: 'Business ITR Filing', slug: 'business-itr-filing' },
      { name: 'Partnership Firm / LLP ITR', slug: 'partnership-llp-itr' },
      { name: 'Company ITR Filing', slug: 'company-itr-filing' },
      { name: 'Trust / NGO Tax Filing', slug: 'trust-ngo-tax-filing' },
      { name: '15CA - 15CB Filing', slug: '15ca-15cb-filing' },
      { name: 'TAN Registration', slug: 'tan-registration' },
      { name: 'TDS Return Filing', slug: 'tds-return-filing' },
      { name: 'Income Tax Notice', slug: 'income-tax-notice' },
      { name: 'Revised ITR Return (ITR-U)', slug: 'revised-itr-u' },
    ],
  },
  {
    key: 'mca',
    label: 'MCA',
    icon: 'landmark',
    order: 6,
    summary: 'ROC annual filings, director KYC, company changes with full MCA portal integration.',
    items: [
      { name: 'Company Compliance', slug: 'company-compliance' },
      { name: 'LLP Compliance', slug: 'llp-compliance' },
      { name: 'OPC Compliance', slug: 'opc-compliance' },
      { name: 'Name Change - Company', slug: 'name-change-company' },
      { name: 'Registered Office Change', slug: 'registered-office-change' },
      { name: 'DIN eKYC Filing', slug: 'din-ekyc-filing' },
      { name: 'DIN Reactivation', slug: 'din-reactivation' },
      { name: 'Director Change', slug: 'director-change' },
      { name: 'Remove Director', slug: 'remove-director' },
      { name: 'ADT-1 Filing', slug: 'adt-1-filing' },
      { name: 'DPT-3 Filing', slug: 'dpt-3-filing' },
      { name: 'LLP Form 11 Filing', slug: 'llp-form-11-filing' },
      { name: 'Dormant Status Filing', slug: 'dormant-status-filing' },
      { name: 'MOA Amendment', slug: 'moa-amendment' },
      { name: 'AOA Amendment', slug: 'aoa-amendment' },
      { name: 'Authorized Capital Increase', slug: 'authorized-capital-increase' },
      { name: 'Share Transfer', slug: 'share-transfer' },
      { name: 'Demat of Shares', slug: 'demat-of-shares' },
      { name: 'Winding Up - LLP', slug: 'winding-up-llp' },
      { name: 'Winding Up - Company', slug: 'winding-up-company' },
      { name: 'Commencement (INC-20A)', slug: 'commencement-inc-20a' },
      { name: 'CCFS Scheme', slug: 'ccfs-scheme' },
    ],
  },
  {
    key: 'compliance',
    label: 'Compliance',
    icon: 'clipboard-check',
    order: 7,
    summary: 'Payroll, PF, ESI, TDS on salary, payslips, and attendance — all on a single platform.',
    items: [
      { name: 'FDI Filing', slug: 'fdi-filing' },
      { name: 'ODI Filing', slug: 'odi-filing' },
      { name: 'FLA Return Filing', slug: 'fla-return-filing' },
      { name: 'FSSAI Renewal', slug: 'fssai-renewal' },
      { name: 'FSSAI Return Filing', slug: 'fssai-return-filing' },
      { name: 'Business Plan', slug: 'business-plan' },
      { name: 'HR & Payroll', slug: 'hr-payroll' },
      { name: 'PF Return Filing', slug: 'pf-return-filing' },
      { name: 'ESI Return Filing', slug: 'esi-return-filing' },
      { name: 'Professional Tax Return Filing', slug: 'professional-tax-return-filing' },
      { name: 'Partnership Compliance', slug: 'partnership-compliance' },
      { name: 'Proprietorship Compliance', slug: 'proprietorship-compliance' },
      { name: 'Bookkeeping', slug: 'bookkeeping' },
      { name: 'CA Support', slug: 'ca-support' },
    ],
  },
  {
    key: 'global',
    label: 'Global',
    icon: 'globe',
    order: 8,
    summary: 'Expand beyond India with company and trademark registration across major jurisdictions.',
    items: [
      { name: 'UAE Company Registration', slug: 'uae-company-registration' },
      { name: 'USA Company Registration', slug: 'usa-company-registration' },
      { name: 'Singapore Business Setup', slug: 'singapore-business-setup' },
      { name: 'UK Company Registration', slug: 'uk-company-registration' },
      { name: 'USA Trademark Registration', slug: 'usa-trademark-registration' },
    ],
  },
];

async function seed() {
  await connectDB();

  console.log('Clearing existing service categories...');
  await ServiceCategory.deleteMany({});

  console.log('Inserting Aurbit Linkers service catalog...');
  await ServiceCategory.insertMany(categories);

  console.log(`Seeded ${categories.length} categories.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
