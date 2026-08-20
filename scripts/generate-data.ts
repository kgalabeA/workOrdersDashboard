import * as fs from 'fs';
import * as path from 'path';

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const rand = seededRandom(42);

const getRandomItem = <T>(array: T[]): T => {
  const index = Math.floor(rand() * array.length);
  return array[index];
}

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const regions = ['AMER', 'EMEA', 'APAC'] as const;
const statuses = ['New', 'Planned', 'In Progress', 'Blocked', 'Done'] as const;

const sitePrefixes = [
  'Vodacom Hub', 'MTN Tower', 'Eskom Substation', 'Data Center',
  'Fibre Relay', 'Cell Site', 'Edge Gateway', 'Switching Centre',
  'Regenerator Site', 'POPHub'
];

const owners = [
  'Thabo Mokoena', 'Lerato Nkosi', 'Sipho Dlamini', 'Anele van der Merwe',
  'Nomsa Ndlovu', 'Pieter Botha', 'Ayanda Khumalo', 'Johan Jacobs',
  'Zanele Mthembu', 'Mandla Sithole', 'Naledi Molefe', 'Ruan Pretorius'
];

const now = new Date().getTime();


const workOrders = Array.from({ length: 500 }, (_, i) => {
  const idNum = (1000 + i + 1).toString();
  const id = `WO-2026-${idNum}`;
  const siteCode = (1000 + ((i * 17) % 8999)).toString();
  const site = `Site ${siteCode} - ${getRandomItem(sitePrefixes)}`;
  const region = getRandomItem([...regions]);
  const status = getRandomItem([...statuses]);
  const priority = getRandomInt(1, 5);
  const owner = getRandomItem(owners);

  // SLA Due Date: spread between 10 days ago (overdue) and 15 days in future
  const slaOffsetHours = getRandomInt(-240, 360);
  const slaDueAt = new Date(now + slaOffsetHours * 3600 * 1000).toISOString();

  // Last Updated: between 1 and 72 hours ago
  const updatedOffsetHours = getRandomInt(1, 72);
  const lastUpdatedAt = new Date(now - updatedOffsetHours * 3600 * 1000).toISOString();

  // Progress Pct: aligned logically with status
  let progressPct = 0;
  if (status === 'New') progressPct = 0;
  else if (status === 'Planned') progressPct = getRandomInt(5, 25);
  else if (status === 'In Progress') progressPct = getRandomInt(30, 85);
  else if (status === 'Blocked') progressPct = getRandomInt(10, 70);
  else if (status === 'Done') progressPct = 100;

  return {
    id,
    site,
    region,
    status,
    priority,
    owner,
    slaDueAt,
    lastUpdatedAt,
    progressPct
  };
});

const dbData = {
  workOrders
};

const outputPath = path.join(__dirname, '..', 'db.json');
fs.writeFileSync(outputPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`Successfully generated ${workOrders.length} reproducible work orders in db.json!`);
