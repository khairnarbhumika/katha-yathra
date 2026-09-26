export interface QuizQuestion {
  id: string;
  epoch: string;
  yearHint: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relicName: string;
}

export interface RunnerLevel {
  levelNumber: number;
  title: string;
  domain: string;
  bgGradient: string;
  questions: QuizQuestion[];
}

export const TIMELINE_RUNNER_LEVELS: RunnerLevel[] = [
  {
    levelNumber: 1,
    title: 'The Vedic Epoch & Ancient Epics',
    domain: 'Vedic & Indian Heritage',
    bgGradient: 'from-amber-900/60 to-orange-950/80',
    questions: [
      {
        id: 'v1',
        epoch: 'Treta Yuga Lore',
        yearHint: 'c. 1500–1000 BCE',
        question: 'In the Ramayana, who constructed the celestial floating stone bridge (Ram Setu) across the sea to Lanka?',
        options: ['Nala and Nila', 'Garuda and Jatayu', 'Sugriva and Vali', 'Agastya Muni'],
        correctIndex: 0,
        explanation: 'Architect twins Nala and Nila, sons of Vishwakarma, engineered the floating stone bridge with the Vanara army.',
        relicName: 'Floating Pumice Stone'
      },
      {
        id: 'v2',
        epoch: 'Epic Philosophy',
        yearHint: 'Mahabharata Kurukshetra',
        question: 'Which sacred dialogue of 700 verses took place between Krishna and Arjuna on the battlefield?',
        options: ['Upanishads', 'Bhagavad Gita', 'Arthashastra', 'Panchatantra'],
        correctIndex: 1,
        explanation: 'The Bhagavad Gita contains profound philosophical teachings given by Krishna to Arjuna on duty and righteousness.',
        relicName: 'Panchajanya Conch'
      },
      {
        id: 'v3',
        epoch: 'Ancient Astronomy & Zero',
        yearHint: 'c. 500 CE',
        question: 'Which ancient Indian mathematician-astronomer formulated the value of Pi (3.1416) and explained eclipses in Aryabhatiya?',
        options: ['Aryabhata', 'Varahamihira', 'Brahmagupta', 'Bhaskara I'],
        correctIndex: 0,
        explanation: 'Aryabhata accurately calculated Earth’s rotation, solar eclipses, and trigonometric sine tables in 499 CE.',
        relicName: 'Bronze Celestial Armillary'
      }
    ]
  },
  {
    levelNumber: 2,
    title: 'Sands of the Nile & Pyramid Architects',
    domain: 'Ancient Egyptian & African Civilizations',
    bgGradient: 'from-yellow-900/60 to-amber-950/80',
    questions: [
      {
        id: 'e1',
        epoch: 'Old Kingdom Egypt',
        yearHint: 'c. 2670 BCE',
        question: 'Who was the genius polymath, physician, and royal architect who designed the Step Pyramid at Saqqara for King Djoser?',
        options: ['Imhotep', 'Ramesses', 'Tutankhamun', 'Akhenaten'],
        correctIndex: 0,
        explanation: 'Imhotep is revered as the world’s first known architect and master builder in documented history.',
        relicName: 'Lapis Lazuli Architect Ruler'
      },
      {
        id: 'e2',
        epoch: 'Linguistic Decryption',
        yearHint: '196 BCE (Found 1799)',
        question: 'Which famous artifact contained Greek, Demotic, and Hieroglyphic scripts, allowing Champollion to decode Egyptian writing?',
        options: ['The Rosetta Stone', 'The Narmer Palette', 'The Turin Papyrus', 'The Book of the Dead'],
        correctIndex: 0,
        explanation: 'The Rosetta Stone provided the trilingual key to unlocking ancient Egyptian hieroglyphic translation.',
        relicName: 'Granodiorite Stele Fragment'
      },
      {
        id: 'e3',
        epoch: 'Kingdom of Kush',
        yearHint: 'c. 750 BCE',
        question: 'Which African kingdom along the upper Nile conquered Egypt and ruled as the 25th Dynasty Black Pharaohs?',
        options: ['Kingdom of Kush (Nubia)', 'Carthage', 'Axum', 'Mali Empire'],
        correctIndex: 0,
        explanation: 'The Kushite kings of Nubia, including King Piye and Taharqa, ruled both Kush and Egypt, reviving pyramid building.',
        relicName: 'Golden Nubian Falcon Amulet'
      }
    ]
  },
  {
    levelNumber: 3,
    title: 'Harappan Grids & Bronze Age Cities',
    domain: 'Vedic & Indian Heritage',
    bgGradient: 'from-emerald-950/60 to-slate-950/80',
    questions: [
      {
        id: 'h1',
        epoch: 'Indus Valley Mature Phase',
        yearHint: 'c. 2500 BCE',
        question: 'What revolutionary civil engineering feature was found in Mohenjo-daro and Harappa that was unmatched in the ancient world?',
        options: ['Covered subterranean drainage and private baked-brick bathrooms', 'Iron suspension bridges', 'Steam engines', 'Colosseum stadiums'],
        correctIndex: 0,
        explanation: 'The Indus Valley civilization engineered precision covered drains with inspection traps in every street.',
        relicName: 'Carved Steatite Unicorn Seal'
      },
      {
        id: 'h2',
        epoch: 'Ancient Maritime Trade',
        yearHint: 'c. 2400 BCE',
        question: 'Which Harappan port city in Gujarat featured the world’s earliest known tidal dockyard connected to the Arabian Sea?',
        options: ['Lothal', 'Kalibangan', 'Dholavira', 'Rakhigarhi'],
        correctIndex: 0,
        explanation: 'Lothal had a massive brick tidal basin capable of docking ocean-going trading dhows carrying carnelian beads and lapis.',
        relicName: 'Terracotta Ship Model'
      }
    ]
  },
  {
    levelNumber: 4,
    title: 'Hellenic Inventions & Roman Marvels',
    domain: 'Greco-Roman & European History',
    bgGradient: 'from-blue-950/60 to-indigo-950/80',
    questions: [
      {
        id: 'g1',
        epoch: 'Classical Greece',
        yearHint: 'c. 250 BCE',
        question: 'What did Archimedes shout when he discovered how to calculate density and buoyant volume in his bath?',
        options: ['Eureka!', 'Veni, Vidi, Vici!', 'Alea iacta est!', 'Carpe Diem!'],
        correctIndex: 0,
        explanation: 'Eureka means "I have found it!" in ancient Greek, marking his discovery of hydrostatic displacement.',
        relicName: 'Archimedes Bronze Screw'
      },
      {
        id: 'g2',
        epoch: 'Ancient Computing',
        yearHint: 'c. 100 BCE',
        question: 'The Antikythera Mechanism is celebrated by scientists as the world’s earliest known analogue...',
        options: ['Astronomical computer and eclipse calculator', 'Water clock', 'Catapult trigger', 'Compass'],
        correctIndex: 0,
        explanation: 'The 30-gear bronze mechanism accurately modeled planetary orbits and solar-lunar cycles.',
        relicName: 'Antikythera Precision Gear'
      }
    ]
  }
];

// ==========================================
// GLYPH DECODER GAME DATA
// ==========================================
export interface GlyphPair {
  id: string;
  symbol: string;
  name: string;
  culture: string;
  meaning: string;
  clue: string;
}

export interface GlyphLevel {
  levelNumber: number;
  domain: string;
  title: string;
  description: string;
  pairs: GlyphPair[];
}

export const GLYPH_LEVELS: GlyphLevel[] = [
  {
    levelNumber: 1,
    domain: 'Ancient Egyptian & African Civilizations',
    title: 'Sacred Hieroglyphs of the Nile',
    description: 'Decipher the eternal symbols carved upon temple walls and golden sarcophagi.',
    pairs: [
      {
        id: 'g-ankh',
        symbol: '☥',
        name: 'Ankh',
        culture: 'Egyptian',
        meaning: 'Key of Life & Immortality',
        clue: 'Looped cross held by pharaohs representing the breath of eternal life.'
      },
      {
        id: 'g-eye',
        symbol: '𓂀',
        name: 'Eye of Horus (Wedjat)',
        culture: 'Egyptian',
        meaning: 'Protection & Mathematical Fractions',
        clue: 'Sacred falcon eye used by ancient scribes to calculate grain fractions and royal protection.'
      },
      {
        id: 'g-scarab',
        symbol: '𓆣',
        name: 'Khepri Scarab',
        culture: 'Egyptian',
        meaning: 'Rebirth & Morning Sun',
        clue: 'Beetle rolling a solar ball across the heavens representing constant renewal.'
      },
      {
        id: 'g-djed',
        symbol: '𓊽',
        name: 'Djed Pillar',
        culture: 'Egyptian',
        meaning: 'Stability & Spine of Osiris',
        clue: 'Column with four crossbars symbolizing architectural strength and resurrection.'
      }
    ]
  },
  {
    levelNumber: 2,
    domain: 'Vedic & Indian Heritage',
    title: 'Vedic Symbols & Indus Seals',
    description: 'Match ancient Sanskrit cosmological emblems and Harappan seal pictograms.',
    pairs: [
      {
        id: 'g-om',
        symbol: 'ॐ',
        name: 'Pranava (Om)',
        culture: 'Vedic',
        meaning: 'Primordial Cosmic Vibration',
        clue: 'The sacred sound resonance of creation in Vedic philosophical hymns.'
      },
      {
        id: 'g-chakra',
        symbol: '☸',
        name: 'Dharma Chakra',
        culture: 'Ancient India',
        meaning: 'Wheel of Law & Cosmic Order',
        clue: 'Spinning 24-spoke wheel representing ethical righteousness and natural harmony.'
      },
      {
        id: 'g-lotus',
        symbol: '🪷',
        name: 'Padma (Sacred Lotus)',
        culture: 'Vedic',
        meaning: 'Purity rising above Mud',
        clue: 'Pristine blossom that emerges untainted from murky pond waters into sunlight.'
      },
      {
        id: 'g-trishula',
        symbol: '🔱',
        name: 'Trishula (Trident)',
        culture: 'Vedic',
        meaning: 'Three Gunas & Mastery over Time',
        clue: 'Three-pronged golden emblem representing past, present, and future mastery.'
      }
    ]
  },
  {
    levelNumber: 3,
    domain: 'Islamic Golden Age & Middle Eastern Lore',
    title: 'Astronomical & Alchemical Glyphs',
    description: 'Decode the scientific tools and navigational instruments of Baghdad & Damascus.',
    pairs: [
      {
        id: 'g-astrolabe',
        symbol: '🧭',
        name: 'Al-Usturlab (Astrolabe)',
        culture: 'Islamic Golden Age',
        meaning: 'Celestial Navigational Computer',
        clue: 'Brass starry instrument used to calculate prayer times and ocean trade routes.'
      },
      {
        id: 'g-alembic',
        symbol: '⚗️',
        name: 'Al-Inbiq (Alembic Distiller)',
        culture: 'Alchemical Chemistry',
        meaning: 'Distillation & Chemical Purification',
        clue: 'Glass distilling vessel invented by Jabir ibn Hayyan (father of early chemistry).'
      },
      {
        id: 'g-crescent',
        symbol: '☪️',
        name: 'Hilal (Crescent & Star)',
        culture: 'Middle Eastern Astronomy',
        meaning: 'Lunar Calendar & Guidance',
        clue: 'New moon crescent marking the start of lunar calendar months.'
      },
      {
        id: 'g-scroll',
        symbol: '📜',
        name: 'Bayt al-Hikma Manuscript',
        culture: 'Baghdad Scholars',
        meaning: 'Preservation of World Knowledge',
        clue: 'Parchment translation of ancient Greek, Sanskrit, and Persian science into Arabic.'
      }
    ]
  }
];

// ==========================================
// RELIC / MONUMENT BUILDER GAME DATA
// ==========================================
export interface MonumentFragment {
  id: string;
  name: string;
  layerIndex: number;
  description: string;
  icon: string;
  archaeologicalFact: string;
}

export interface MonumentLevel {
  levelNumber: number;
  title: string;
  domain: string;
  monumentName: string;
  location: string;
  image: string;
  fragments: MonumentFragment[];
}

export const MONUMENT_LEVELS: MonumentLevel[] = [
  {
    levelNumber: 1,
    title: 'Konark Sun Temple Restoration',
    domain: 'Vedic & Indian Heritage',
    monumentName: 'Sun Temple of Surya',
    location: 'Odisha, India (13th Century CE)',
    image: 'https://images.unsplash.com/photo-1599827556793-68d76d4957ca?auto=format&fit=crop&w=800&q=80',
    fragments: [
      {
        id: 'f1',
        name: 'Granite Foundation Plinth',
        layerIndex: 0,
        description: 'Carved base depicting war elephants, musical processions, and dancers.',
        icon: '🏛️',
        archaeologicalFact: 'The temple base rests on massive khondalite rocks engineered to withstand coastal cyclonic winds.'
      },
      {
        id: 'f2',
        name: '24 Sundial Chariot Wheels',
        layerIndex: 1,
        description: 'Astronomically precise wheels where shadows cast by spokes tell the exact minute.',
        icon: '⚙️',
        archaeologicalFact: 'Each wheel spoke represents 3 hours of the day (prahars) and acts as an atomic-accurate solar clock.'
      },
      {
        id: 'f3',
        name: '7 Galloping Sun Steeds',
        layerIndex: 2,
        description: 'Sculpted stone horses representing the seven colors of visible sunlight (VIBGYOR).',
        icon: '🐎',
        archaeologicalFact: 'Ancient Indian sculptors encoded the seven spectrum colors into the horses of Surya centuries before Newton.'
      },
      {
        id: 'f4',
        name: 'Magnetic Iron Lodestone Capstone',
        layerIndex: 3,
        description: 'Apex crown stone that historically held the idol levitating in mid-air with magnets.',
        icon: '🧲',
        archaeologicalFact: 'Legend records that magnetic lodestones inside the sanctum caused compasses on Portuguese trade ships to spin!'
      }
    ]
  },
  {
    levelNumber: 2,
    title: 'The Great Pyramid of Giza Engineering',
    domain: 'Ancient Egyptian & African Civilizations',
    monumentName: 'Pyramid of Khufu',
    location: 'Giza Plateau, Egypt (2560 BCE)',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    fragments: [
      {
        id: 'p1',
        name: 'Leveled Limestone Bedrock',
        layerIndex: 0,
        description: 'Water-trenched bedrock foundation flat to within 1.5 cm across 13 acres.',
        icon: '🪨',
        archaeologicalFact: 'The Egyptians used trenches flooded with Nile water as a giant spirit level to flatten the rock plateau.'
      },
      {
        id: 'p2',
        name: 'Grand Gallery & Ascending Passage',
        layerIndex: 1,
        description: 'Corbelled vault ceiling of polished Aswan red granite blocks.',
        icon: '📐',
        archaeologicalFact: 'Granite beams weighing over 50 tons were floated 800 km down the Nile on specialized cedar wood barges.'
      },
      {
        id: 'p3',
        name: 'Tura White Polished Casing Stones',
        layerIndex: 2,
        description: 'Mirror-polished outer stones that shone like a beacon across the desert miles.',
        icon: '✨',
        archaeologicalFact: 'When complete, the pyramid was encased in polished white limestone that reflected the sun like a jewel.'
      },
      {
        id: 'p4',
        name: 'Electrum Pyramidion Capstone',
        layerIndex: 3,
        description: 'Gold-silver alloy pyramidion catching the first ray of dawn.',
        icon: '👑',
        archaeologicalFact: 'The capstone symbolized the Benben stone—the first mound of earth to emerge from the cosmic waters.'
      }
    ]
  }
];
