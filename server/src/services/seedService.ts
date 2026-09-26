import { getDb } from '../config/db.js';

export const INITIAL_STORE_ITEMS = [
  {
    title: 'James Webb Telescope: Peering into the Cosmic Dawn',
    category: 'Space',
    description: 'Travel 1.5 million kilometers into deep space to discover how the gold-coated mirrors of the JWST capture light from the very first galaxies formed after the Big Bang!',
    cost_points: 100,
    video_url: 'https://www.youtube.com/embed/4P8fKd0IV84',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 12,
    highlights: JSON.stringify([
      'Infrared astronomy vs visible light',
      'Deploying a tennis-court-sized sunshield in zero gravity',
      'Discovering water vapor and atmospheres on exoplanets',
      'Connecting ancient Babylonian star maps to modern deep sky surveys'
    ])
  },
  {
    title: 'Quantum Computing for Young Explorers',
    category: 'Quantum & Physics',
    description: 'Learn how qubits can be 0, 1, or both at the same time! Discover superposition, entanglement, and how quantum computers solve impossible encryption mysteries.',
    cost_points: 150,
    video_url: 'https://www.youtube.com/embed/QuR969uMICM',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 14,
    highlights: JSON.stringify([
      'Qubits and Superposition simplified',
      'Spooky action at a distance (Quantum Entanglement)',
      'Sub-zero cryogenic cooling dilution refrigerators',
      'How quantum algorithms will design future medicine'
    ])
  },
  {
    title: 'Mars Rover Perseverance & Ingenuity Helicopter',
    category: 'Robotics',
    description: 'Ride along with the Mars 2020 mission on the red planet Jezero Crater. Watch how a tiny solar-powered rotorcraft flew in atmospheric density 1% of Earth!',
    cost_points: 100,
    video_url: 'https://www.youtube.com/embed/4czjS9h4Fpg',
    thumbnail_url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 10,
    highlights: JSON.stringify([
      '7 Minutes of Terror: Sky Crane touchdown maneuver',
      'Autonomous navigation in Martian terrain without GPS',
      'MOXIE: Generating oxygen out of Martian carbon dioxide',
      'Ancient lakebeds and hunting for microbial fossil biosignatures'
    ])
  },
  {
    title: 'Ancient Engineering vs Modern Mega-Structures',
    category: 'Applied Science',
    description: 'Compare how Roman self-healing volcanic concrete and Harappan subterranean sanitation systems inspired modern skyscrapers and earthquake-proof buildings!',
    cost_points: 120,
    video_url: 'https://www.youtube.com/embed/tIdJg0yFw-I',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 15,
    highlights: JSON.stringify([
      'The chemistry of Roman pozzolanic ash concrete',
      'Seismic damping: Pagodas that survive earthquakes',
      'Indus Valley hydraulic water drainage gradients',
      'Biomimicry in futuristic architecture'
    ])
  },
  {
    title: 'Fusion Energy: Building an Artificial Sun on Earth',
    category: 'Applied Science',
    description: 'Discover the Tokamak magnetic confinement reactor where hydrogen isotopes fuse at 150 million degrees Celsius to create virtually limitless clean energy.',
    cost_points: 200,
    video_url: 'https://www.youtube.com/embed/2q8D1eA1gL0',
    thumbnail_url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 16,
    highlights: JSON.stringify([
      'Stars vs Earth: How fusion differs from fission',
      'Magnetic magnetic confinement inside magnetic bottles',
      'ITER international mega-project in France',
      'The dream of clean, limitless starlight energy'
    ])
  },
  {
    title: 'Black Holes & The Event Horizon Telescope',
    category: 'Space',
    description: 'How an Earth-sized virtual telescope captured the first-ever direct image of the supermassive black hole Sagittarius A* at the center of our Milky Way galaxy!',
    cost_points: 180,
    video_url: 'https://www.youtube.com/embed/S_GF34QZ04g',
    thumbnail_url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    duration_minutes: 13,
    highlights: JSON.stringify([
      'General Relativity and gravitational time dilation',
      'Very Long Baseline Interferometry (VLBI) technology',
      'The photon ring and event horizon shadow',
      'Supercomputer petabyte data correlation across continents'
    ])
  }
];

export async function seedDatabase() {
  const db = await getDb();
  const existing = await db.query('SELECT COUNT(*) as count FROM store_items');
  const count = parseInt(existing.rows[0]?.count || '0', 10);

  if (count === 0) {
    console.log('🌱 Seeding default STEM & Space store items...');
    for (const item of INITIAL_STORE_ITEMS) {
      await db.query(
        `INSERT INTO store_items (title, category, description, cost_points, video_url, thumbnail_url, duration_minutes, highlights)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [item.title, item.category, item.description, item.cost_points, item.video_url, item.thumbnail_url, item.duration_minutes, item.highlights]
      );
    }
    console.log(`✅ Seeded ${INITIAL_STORE_ITEMS.length} store items.`);
  }
}
