/**
 * AI Sentence Generator & Translation Engine for Eco English
 * Generates concise (6-12 words), highly natural, context-aware English example sentences
 * based on input phrase, meaning, and usage context, along with fluent Vietnamese translations.
 */

// Dictionary of concise spoken expressions & fixed idioms (kept short & crisp)
const EXPRESSIONS_DICTIONARY = {
  "i'm having second thoughts": "I was about to sign, but now I'm having second thoughts.",
  "im having second thoughts": "I was going to buy it, but now I'm having second thoughts.",
  "having second thoughts": "She is having second thoughts about moving abroad.",
  "come again": "Could you come again? I didn't hear you clearly.",
  "it's up to you": "Whether we stay or leave is entirely up to you.",
  "its up to you": "Which restaurant we pick for dinner is up to you.",
  "i get it": "Thanks for explaining so clearly; now I get it.",
  "break the ice": "A quick joke helped break the ice at the meeting.",
  "keep in touch": "Let's keep in touch after the project ends.",
  "take a risk": "Sometimes you need to take a risk to succeed.",
  "make progress": "She is making steady progress in her English speaking.",
  "look on the bright side": "Even after setbacks, try to look on the bright side.",
  "give up": "Never give up on your goals, no matter what.",
  "come across": "I came across an interesting article earlier today.",
  "hit the nail on the head": "Your analysis really hit the nail on the head.",
  "out of the blue": "An old friend called me out of the blue.",
  "once in a blue moon": "He visits his hometown only once in a blue moon.",
  "pave the way for": "This innovation paved the way for future developments.",
  "take into account": "We must take all extra expenses into account.",
  "a double-edged sword": "Social media can be a double-edged sword nowadays.",
  "play a vital role in": "Education plays a vital role in personal growth.",
  "cut down on": "He decided to cut down on sugary drinks.",
  "shed light on": "The latest report sheds light on the main issue.",
  "strike a balance": "It is essential to strike a healthy work-life balance.",
  "at the expense of": "He gained quick success at the expense of his health.",
  "call into question": "The audit results called into question the financial figures.",
  "stem from": "Most misunderstandings stem from poor communication.",
  "tipping point": "The ecosystem is reaching a critical tipping point.",
  "part and parcel of": "Overcoming obstacles is part and parcel of success.",
  "in lieu of": "They offered additional vacation days in lieu of cash.",
  "wreak havoc on": "The heavy storm wreaked havoc on coastal towns.",
  "bear fruit": "Her hard work finally bore fruit after two years."
};

// Short Context & Meaning Scenario Patterns (Strictly 6 - 12 words)
const CONCISE_SCENARIOS = [
  // 1. Work, Job, Meeting, Project & Report (Công việc, Họp, Dự án, Báo cáo, Kế hoạch)
  {
    tags: ['work', 'job', 'project', 'meeting', 'họp', 'công việc', 'dự án', 'báo cáo', 'email', 'chính thức', 'formal', 'kế hoạch', 'công ty', 'văn phòng', 'sáng tạo'],
    templates: [
      (p) => `Our team must ${p} before the final deadline.`,
      (p) => `She managed to ${p} during the morning meeting.`,
      (p) => `We need a clear strategy to ${p} effectively.`,
      (p) => `The project manager asked us to ${p} today.`
    ],
    prepositionalTemplates: [
      (p) => `${capitalize(p)}, the project went smoother than expected.`,
      (p) => `The team accepted the proposal ${p}.`,
      (p) => `We reviewed the quarterly report ${p}.`
    ]
  },

  // 2. Decision, Thought, Option & Hesitation (Quyết định, Suy nghĩ, Do dự, Cân nhắc, Lựa chọn)
  {
    tags: ['decision', 'think', 'idea', 'choice', 'quyết định', 'suy nghĩ', 'ý tưởng', 'do dự', 'cân nhắc', 'lựa chọn', 'giải pháp', 'nhận định'],
    templates: [
      (p) => `After careful thought, he decided to ${p}.`,
      (p) => `Take your time to ${p} before choosing.`,
      (p) => `Finding a way to ${p} solved the entire issue.`,
      (p) => `It is important to ${p} when facing tough choices.`
    ],
    prepositionalTemplates: [
      (p) => `${capitalize(p)}, the decision seemed obvious to everyone.`,
      (p) => `He made his choice ${p}.`
    ]
  },

  // 3. Finance, Tech, Business & Academic (Tài chính, Công nghệ, Kinh tế, Ngân sách, Chi phí, Nghiên cứu)
  {
    tags: ['money', 'finance', 'budget', 'cost', 'tech', 'academic', 'ielts', 'tài chính', 'công nghệ', 'ngân sách', 'chi phí', 'nghiên cứu', 'tác động'],
    templates: [
      (p) => `This new technique will help ${p} efficiently.`,
      (p) => `Financial experts advise companies to ${p} early.`,
      (p) => `The study sheds light on how to ${p}.`,
      (p) => `Technology enables us to ${p} more easily.`
    ],
    prepositionalTemplates: [
      (p) => `${capitalize(p)}, market trends indicate steady growth.`,
      (p) => `The company adjusted its budget ${p}.`
    ]
  },

  // 4. Daily Life, Health, Friends & Communication (Giao tiếp, Đời sống, Bạn bè, Sức khỏe, Thói quen)
  {
    tags: ['life', 'health', 'daily', 'friend', 'talk', 'giao tiếp', 'đời sống', 'bạn bè', 'sức khỏe', 'thói quen', 'nói chuyện'],
    templates: [
      (p) => `In daily conversations, try to ${p} more often.`,
      (p) => `My doctor recommended that I ${p} regularly.`,
      (p) => `Whenever you feel stressed, take time to ${p}.`,
      (p) => `Learning to ${p} makes daily life much easier.`
    ],
    prepositionalTemplates: [
      (p) => `${capitalize(p)}, everything turned out just fine.`,
      (p) => `She shares her thoughts with friends ${p}.`
    ]
  }
];

// Fallback short templates for phrases without matched tags
const DEFAULT_SHORT_TEMPLATES = [
  (p) => `You should ${p} whenever the opportunity arises.`,
  (p) => `It is essential to ${p} in this situation.`,
  (p) => `They are working hard to ${p} right now.`,
  (p) => `Learning how to ${p} takes daily practice.`
];

const DEFAULT_PREPOSITIONAL_TEMPLATES = [
  (p) => `${capitalize(p)}, the outcome was surprisingly positive.`,
  (p) => `Everything went according to plan ${p}.`,
  (p) => `She handled the whole situation ${p}.`
];

// Helper to capitalize first letter
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to check if a phrase starts with a preposition/adverb
function isPrepositionalPhrase(phrase) {
  const prepWords = ['at', 'in', 'on', 'out of', 'by', 'from', 'under', 'with', 'as', 'for', 'to', 'through'];
  const lower = phrase.trim().toLowerCase();
  return prepWords.some(w => lower.startsWith(w + ' '));
}

// Helper to check if a phrase is a noun phrase
function isNounPhrase(phrase) {
  const lower = phrase.trim().toLowerCase();
  return lower.startsWith('a ') || lower.startsWith('an ') || lower.startsWith('the ');
}

export const aiService = {
  /**
   * Fetch natural translation from Google Translate GTX / MyMemory API
   */
  async translateToVietnamese(text) {
    if (!text || !text.trim()) return '';
    const cleanText = text.trim();

    // 1. Google Translate GTX Endpoint (Fast, Free & Fluent)
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(cleanText)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translatedParts = data[0].map(part => part[0]).filter(Boolean);
        if (translatedParts.length > 0) {
          return translatedParts.join(' ').trim();
        }
      }
    } catch (err) {
      console.warn('Google Translate GTX unavailable, trying MyMemory fallback:', err.message);
    }

    // 2. MyMemory Translation API Fallback
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|vi`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText.trim();
      }
    } catch (err) {
      console.warn('MyMemory fallback unavailable:', err.message);
    }

    return '';
  },

  /**
   * Main Generator Method:
   * Generates a short (6-12 words), context-driven, meaning-matched English sentence and its accurate Vietnamese translation.
   */
  async generateExampleAndTranslation(phraseText = '', meaningText = '', contextText = '') {
    if (!phraseText || !phraseText.trim()) {
      return { example: '', translation: '' };
    }

    const cleanPhrase = phraseText.trim();
    const lowerPhrase = cleanPhrase.toLowerCase();

    // 1. Check fixed expression dictionary first (shortened versions)
    if (EXPRESSIONS_DICTIONARY[lowerPhrase]) {
      const exampleEn = EXPRESSIONS_DICTIONARY[lowerPhrase];
      const translationVi = await this.translateToVietnamese(exampleEn);
      return { example: exampleEn, translation: translationVi };
    }

    // 2. Find best scenario based on combined context & meaning text
    const combinedSearchText = `${contextText} ${meaningText}`.toLowerCase();
    let matchedScenario = CONCISE_SCENARIOS.find(sc =>
      sc.tags.some(tag => combinedSearchText.includes(tag))
    );

    // 3. Select templates based on grammatical structure of phrase
    let availableTemplates = [];
    const isPrep = isPrepositionalPhrase(cleanPhrase);
    const isNoun = isNounPhrase(cleanPhrase);

    if (matchedScenario) {
      if (isPrep && matchedScenario.prepositionalTemplates) {
        availableTemplates = matchedScenario.prepositionalTemplates;
      } else {
        availableTemplates = matchedScenario.templates;
      }
    } else {
      if (isPrep) {
        availableTemplates = DEFAULT_PREPOSITIONAL_TEMPLATES;
      } else if (isNoun) {
        availableTemplates = [
          (p) => `This solution turned out to be ${p}.`,
          (p) => `We should treat this situation as ${p}.`,
          (p) => `The outcome served as ${p} for everyone.`
        ];
      } else {
        availableTemplates = DEFAULT_SHORT_TEMPLATES;
      }
    }

    // Pick a template at random for variety on multiple clicks
    const selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    let generatedEn = selectedTemplate(cleanPhrase);

    // If phrase starts with capital letter and looks like a complete sentence, use directly
    if (cleanPhrase.match(/^[A-Z]/) && cleanPhrase.split(/\s+/).length > 3) {
      generatedEn = cleanPhrase;
    }

    // 4. Translate generated sentence into fluent Vietnamese via Google GTX API
    let generatedVi = await this.translateToVietnamese(generatedEn);

    if (!generatedVi && meaningText) {
      generatedVi = `Ví dụ sử dụng cụm từ "${cleanPhrase}" (${meaningText.trim()}).`;
    }

    return {
      example: generatedEn,
      translation: generatedVi
    };
  }
};
