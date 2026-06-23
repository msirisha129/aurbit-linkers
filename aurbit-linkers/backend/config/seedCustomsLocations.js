require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const CustomsLocation = require('../models/CustomsLocation');

const locations = [
  { name: '3RD EYE VOICE SEZ, CCIPL, DASCROI AHMEDABAD 380060', code: 'INADC6', category: 'sea_port' },
  { name: 'AA LTD.', code: 'INNRP6', category: 'airport' },
  { name: 'ACC AHMEDABAD OLD AIRPORT, SAHIBAUG AHMEDABAD', code: 'INAMD2', category: 'airport' },
  { name: 'ACC COIMBATORE CIVIL AERODROME COIMBATORE - 04', code: 'INCJB4', category: 'airport' },
  { name: 'ACC DEVI AHILYABHAI HOLKAR AIRPORT INDORE MP', code: 'INDR4', category: 'airport' },
  { name: 'JN PORT KANDLA', code: 'INKND1', category: 'sea_port' },
  { name: 'KANDLA ICD', code: 'INKDC1', category: 'icd_other' },
  { name: 'DELHI LAND PORT PATPARGANJ', code: 'INLND1', category: 'icd_other' },
  { name: 'MUMBAI SEA PORT', code: 'INBOM1', category: 'sea_port' },
  { name: 'CHENNAI ICD', code: 'INCHN2', category: 'icd_other' },
  { name: 'VADODARA LAND PORT', code: 'INVAD1', category: 'icd_other' },
  { name: 'HYDERABAD AIRPORT', code: 'INHYD1', category: 'airport' },
];

async function seed() {
  await connectDB();
  console.log('Clearing existing customs locations...');
  await CustomsLocation.deleteMany({});
  console.log('Inserting customs locations...');
  await CustomsLocation.insertMany(locations);
  console.log(`Seeded ${locations.length} customs locations.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
