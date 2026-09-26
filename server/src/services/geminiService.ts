import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export interface StoryChapterResponse {
  title: string;
  domain: string;
  chapterNumber: number;
  storyBody: string;
  twistEnding: string;
  cliffhangerQuestion: string;
}

const FALLBACK_STORIES: Record<string, StoryChapterResponse[]> = {
  'Vedic & Indian Heritage': [
    {
      title: 'The Whispering Bow of Mithila',
      domain: 'Vedic & Indian Heritage',
      chapterNumber: 1,
      storyBody: 'Long ago in the sacred city of Mithila, King Janaka guarded a divine celestial bow named Pinaka. Crafted from cosmic starlight, no mortal prince had ever been able to lift it off its iron altar. Young Prince Rama of Ayodhya stepped forward calmly, with his younger brother Lakshmana watching in awe. As Rama placed his hand upon the bow, a gentle chime resonated throughout the royal palace, and the massive weapon lifted as easily as a peacock feather! But just as he pulled the string to test its resonance...',
      twistEnding: 'A deafening thunderclap ripped across the sky! The bow snapped in two, releasing a glowing scroll hidden inside the hollow bow-spine. The ancient Sanskrit glyphs glowed with a warning: "The Golden Deer is already running towards the forest of Panchavati, and time is unravelling!"',
      cliffhangerQuestion: 'Who hid the mysterious golden scroll inside the cosmic bow thousands of years ago?'
    },
    {
      title: 'The Sun Chariot of Kurukshetra',
      domain: 'Vedic & Indian Heritage',
      chapterNumber: 2,
      storyBody: 'Before the great gathering of warriors, young Abhimanyu discovered a hidden chamber beneath the royal armor workshop in Hastinapura. Upon the wall was an ancient geometric diagram of the Chakravyuha—the legendary seven-layered rotating maze of shields. His mother Subhadra had whispered the secret entrance chant while he was still unborn, but the departure chant was lost to the winds of time. As Abhimanyu touched the center crystal...',
      twistEnding: 'The stone floor transformed into a glowing projection of the cosmos! A mechanical falcon with bronze wings flew out from the maze center, holding a key made of meteoric iron. A voice echoed from the shadows: "The maze is not an army—it is a cosmic stargate built by ancient rishis!"',
      cliffhangerQuestion: 'Can Abhimanyu decode the star coordinates before the morning conch shells sound?'
    },
    {
      title: 'The Submerged City of Dwarka',
      domain: 'Vedic & Indian Heritage',
      chapterNumber: 3,
      storyBody: 'Deep beneath the azure waves of the Arabian Sea, explorer-archaeologists discovered the submerged golden gates of ancient Dwarka. Marine sonar revealed circular stone bastions, perfectly carved anchors, and a seal bearing the three-headed beast. In the central sanctuary, an underwater crystal dome still held trapped air, untouched by water for over five millennia.',
      twistEnding: 'As the explorer stepped inside the dome, a holographic sundial activated. The sundial didn’t measure hours—it measured planetary alignments with modern deep space constellations that hadn’t been discovered until 2024!',
      cliffhangerQuestion: 'Did the ancient architects of Dwarka chart deep space travel before the dawn of modern astronomy?'
    }
  ],
  'Ancient Egyptian & African Civilizations': [
    {
      title: 'The Hidden Chamber of Imhotep',
      domain: 'Ancient Egyptian & African Civilizations',
      chapterNumber: 1,
      storyBody: 'Under the shadow of the Step Pyramid of Djoser, master architect Imhotep etched the final sacred protection glyphs upon the limestone foundation. Young apprentice Tariq was sweeping the royal papyrus hall when he noticed a draft coming from behind a relief of the falcon god Horus. Pressing the eye of Horus, the wall pivoted smoothly on hidden counterweights, revealing a spiral staircase lined with lapis lazuli tiles.',
      twistEnding: 'At the bottom of the staircase sat a celestial globe made of pure electrum (gold-silver alloy). The stars engraved on it showed the Sirius constellation—but with a second companion star that human eyes cannot see without modern radio telescopes!',
      cliffhangerQuestion: 'How did Imhotep chart the invisible white dwarf star Sirius B five thousand years ago?'
    },
    {
      title: 'The Golden Sceptre of Nubia',
      domain: 'Ancient Egyptian & African Civilizations',
      chapterNumber: 2,
      storyBody: 'In the great city of Meroë, the Black Pharaohs of Kush built towering steep pyramids amid rich iron mines. Princess Amanirenas led an expedition down the blue waters of the Upper Nile to recover the lost Royal Sceptre of the Sun Queen. Guarding the underground vault were four giant mechanical lion statues powered by water flowing through hidden ceramic pipes.',
      twistEnding: 'When she placed the solar emblem into the lion’s mouth, the water ceased flowing. The wall behind the altar slid open to reveal a glass cylinder filled with a shimmering violet fuel that defied gravity, floating in mid-air!',
      cliffhangerQuestion: 'What ancient lost energy source powered the marvels of Kush?'
    }
  ],
  'Greco-Roman & European History': [
    {
      title: 'The Bronze Mechanism of Antikythera',
      domain: 'Greco-Roman & European History',
      chapterNumber: 1,
      storyBody: 'In the bustling port of Syracuse, young scholar Sophia worked as an assistant to the great inventor Archimedes. While testing a water screw pump at the harbor, a diver brought up a coral-encrusted bronze device found in a sunken Roman galley. Cleaning away centuries of sea salt, Sophia uncovered over thirty intricate gearwheels cut with microscopic precision.',
      twistEnding: 'Archimedes turned the side crank. The gears engaged, predicting solar eclipses with pinpoint precision. But then the final gear clicked into place—and a hidden compartment projected a brass disc engraved with a map of a western continent that wouldn’t appear on world maps for another 1,700 years!',
      cliffhangerQuestion: 'Who sailed beyond the Pillars of Hercules to map the unknown world?'
    }
  ],
  'Islamic Golden Age & Middle Eastern Lore': [
    {
      title: 'The Clockwork Stargazer of Baghdad',
      domain: 'Islamic Golden Age & Middle Eastern Lore',
      chapterNumber: 1,
      storyBody: 'Inside the grand halls of Bayt al-Hikma (The House of Wisdom) in 9th-century Baghdad, master mathematician Al-Khwarizmi and his young student Zayd were compiling star tables for mariners navigating the Indian Ocean. Zayd was adjusting the brass astrolabe when he noticed a series of hidden algebraic equations etched into the rim of the rete plate.',
      twistEnding: 'Solving the algebraic quadratic system caused the brass astrolabe to slide apart, revealing a miniature prism that focused moonlight onto the library floor. The refracted light spelled out an encrypted location: "The Oasis of the Thousand Telescopes beneath the sand dunes of Rub al Khali!"',
      cliffhangerQuestion: 'What secret astronomical observatory lies buried under the shifting sands?'
    }
  ],
  'Asian & Silk Road Lore': [
    {
      title: 'The Jade Compass of the Silk Road',
      domain: 'Asian & Silk Road Lore',
      chapterNumber: 1,
      storyBody: 'Along the treacherous mountain passes of the Taklamakan Desert, caravan leader Mei-Ling guided fifty camels carrying precious rolls of silk, porcelain, and herbal remedies. When a sudden sandstorm obliterated the north star, Mei-Ling opened the sandalwood box containing the South-Pointing Chariot and the magnetic jade lodestone spoon.',
      twistEnding: 'Instead of spinning south, the lodestone spoon locked in mid-air and began vibrating with a strange magnetic hum. The sand beneath their feet subsided, revealing a jade staircase leading into the subterranean fortress of the first Emperor’s lost vanguard!',
      cliffhangerQuestion: 'What forgotten guardian soldiers sleep beneath the desert sands?'
    }
  ],
  'Biblical & Mesopotamian Heritage': [
    {
      title: 'The Clay Tablets of Nineveh',
      domain: 'Biblical & Mesopotamian Heritage',
      chapterNumber: 1,
      storyBody: 'In the vast royal library of Ashurbanipal along the Tigris river, thousands of sun-baked clay cuneiform tablets recorded the lore of ancient kings, constellations, and flood legends. Young scribe Ezra was cataloging the epic of Gilgamesh when he found a tablet sealed inside a baked clay envelope that had never been cracked open.',
      twistEnding: 'Carefully cracking the outer envelope, Ezra read the inner text: "The Great Flood did not come from rain alone—the subterranean waters rose when the crystal pillars of the deep were opened by the builders from the stars!"',
      cliffhangerQuestion: 'Who were the ancient architects mentioned before the great flood?'
    }
  ]
};

export async function generateStoryChapter(
  domain: string,
  topic?: string,
  chapterNumber: number = 1
): Promise<StoryChapterResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  const defaultTopic = topic || getTopicForDomain(domain, chapterNumber);

  // If Gemini API Key is configured, execute using @google/genai SDK
  if (apiKey && apiKey.length > 10 && !apiKey.includes('your_google_gemini_api_key')) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert ancient history storyteller, child educational psychologist, and master fiction author for children aged 8-14.
Generate an engaging, historically accurate, culturally respectful story chapter based on the topic: "${domain}" focusing on the narrative of "${defaultTopic}".
The chapter number is ${chapterNumber}.
Write a captivating narrative of around 200-250 words, followed by an unexpected, high-stakes, age-appropriate cliffhanger twist ending that motivates the child to complete the next game level.

Return strictly valid JSON matching this schema:
{
  "title": "A catchy, adventurous title",
  "domain": "${domain}",
  "chapterNumber": ${chapterNumber},
  "storyBody": "Engaging, vivid 200-250 word story narrative suitable for kids",
  "twistEnding": "The exciting cliffhanger/twist at the end",
  "cliffhangerQuestion": "A provocative question to ponder before playing the next level"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as StoryChapterResponse;
        if (parsed.title && parsed.storyBody && parsed.twistEnding) {
          return {
            title: parsed.title,
            domain: domain,
            chapterNumber: chapterNumber,
            storyBody: parsed.storyBody,
            twistEnding: parsed.twistEnding,
            cliffhangerQuestion: parsed.cliffhangerQuestion || 'What mystery will be revealed in the next chapter?'
          };
        }
      }
    } catch (err: any) {
      console.warn('⚠️ Gemini API call failed or timed out:', err.message, '--> Using high-quality curated twist story fallback.');
    }
  }

  // Graceful Fallback from curated high-quality library
  const domainFallbacks = FALLBACK_STORIES[domain] || FALLBACK_STORIES['Vedic & Indian Heritage'];
  const storyIndex = (chapterNumber - 1) % domainFallbacks.length;
  const selected = { ...domainFallbacks[storyIndex] };
  selected.chapterNumber = chapterNumber;
  selected.domain = domain;
  return selected;
}

function getTopicForDomain(domain: string, chapter: number): string {
  const topicsMap: Record<string, string[]> = {
    'Vedic & Indian Heritage': ['Ramayana & The Celestial Bow', 'Mahabharata & Kurukshetra Secrets', 'Indus Valley Harappan Seals', 'Panchatantra Animal Wisdom'],
    'Ancient Egyptian & African Civilizations': ['The Pyramid of Khufu', 'The Rosetta Stone & Scribes', 'Valley of the Kings', 'Kingdom of Kush'],
    'Greco-Roman & European History': ['Archimedes of Syracuse', 'The Colosseum Engineers', 'Alexander & Alexandria', 'Da Vinci Secret Workshop'],
    'Islamic Golden Age & Middle Eastern Lore': ['House of Wisdom Baghdad', 'Astrolabe Stargazers', 'Ibn Battuta Caravans', 'Al-Khwarizmi Algorithms'],
    'Asian & Silk Road Lore': ['The Great Wall Guards', 'Silk Road Jade Merchants', 'Terracotta Warriors Secret', 'Ancient Compass Pioneers'],
    'Biblical & Mesopotamian Heritage': ['Babylonian Hanging Gardens', 'Gilgamesh Epic Journey', 'Nineveh Royal Library', 'Hammurabi Marble Stele']
  };

  const list = topicsMap[domain] || topicsMap['Vedic & Indian Heritage'];
  return list[(chapter - 1) % list.length];
}
