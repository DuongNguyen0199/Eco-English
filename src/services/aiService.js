/**
 * AI Sentence Generator & Translation Engine for Eco English
 * Generates highly natural, context-aware English example sentences and fluent Vietnamese translations.
 */

// Comprehensive Context-Aware Natural English Sentence Database & Dynamic Scenario Generators
const SCENARIO_GENERATORS = [
  // 1. Workplace, Meetings & Projects
  {
    tags: ['work', 'job', 'project', 'meeting', 'họp', 'công việc', 'dự án', 'báo cáo', 'email', 'chính thức', 'formal', 'lập kế hoạch'],
    templates: [
      (p) => `During yesterday's team meeting, we had to ${p} to ensure the project stays on schedule.`,
      (p) => `Our project manager encouraged everyone to ${p} before submitting the final proposal.`,
      (p) => `She successfully managed to ${p} during the client presentation this morning.`,
      (p) => `To achieve our quarterly goals, it is essential for the team to ${p}.`
    ]
  },
  // 2. Decision Making & Problem Solving
  {
    tags: ['decision', 'think', 'idea', 'solution', 'quyết định', 'suy nghĩ', 'ý tưởng', 'giải pháp', 'do dự', 'cân nhắc', 'lựa chọn'],
    templates: [
      (p) => `After reviewing all available choices, she decided to ${p} for long-term success.`,
      (p) => `Finding an effective way to ${p} helped us resolve the issue without further delay.`,
      (p) => `It requires careful consideration to ${p} when facing complex situations.`,
      (p) => `Before making a commitment, you should always take time to ${p}.`
    ]
  },
  // 3. Finance, Tech, Business & Academic
  {
    tags: ['money', 'finance', 'budget', 'cost', 'tech', 'ai', 'academic', 'ielts', 'kinh tế', 'tài chính', 'ngân sách', 'chi phí', 'công nghệ', 'nghiên cứu'],
    templates: [
      (p) => `Recent market research shows that companies must ${p} to stay competitive.`,
      (p) => `This technological breakthrough will help ${p} for future developments in the industry.`,
      (p) => `Financial advisors strongly recommend that individuals ${p} to minimize risks.`,
      (p) => `The study sheds light on how organizations can ${p} more effectively.`
    ]
  },
  // 4. Daily Life, Health & Relationships
  {
    tags: ['life', 'health', 'daily', 'friend', 'time', 'sức khỏe', 'đời sống', 'bạn bè', 'thời gian', 'thói quen', 'giao tiếp'],
    templates: [
      (p) => `My doctor advised me to ${p} in order to maintain a healthier lifestyle.`,
      (p) => `Even though we live in different cities, we still try to ${p} as often as possible.`,
      (p) => `Whenever you feel stressed, taking time to ${p} can make a huge difference.`,
      (p) => `Learning how to ${p} is one of the most rewarding parts of personal growth.`
    ]
  }
];

// Spoken idioms & fixed full sentence expressions override
const EXPRESSIONS_DICTIONARY = {
  "i'm having second thoughts": "I was going to buy that expensive car, but now I'm having second thoughts.",
  "im having second thoughts": "I was going to sign the contract, but now I'm having second thoughts.",
  "come again": "Could you come again? I couldn't hear what you just said.",
  "it's up to you": "You can choose either Italian or Japanese food for dinner; it's up to you.",
  "its up to you": "Whether we leave now or wait a bit longer is entirely up to you.",
  "i get it": "Thanks for explaining the problem so clearly; now I get it.",
  "break the ice": "A warm smile and a light joke helped break the ice at the start of the conference.",
  "keep in touch": "Let's keep in touch after graduation.",
  "take a risk": "Sometimes you need to take a risk to achieve your biggest dreams.",
  "make progress": "She has been making great progress in her English speaking skills this month.",
  "look on the bright side": "Even when plans fall through, I try to look on the bright side.",
  "give up": "Never give up on your goals, no matter how tough the journey gets.",
  "come across": "I came across a rare vintage record while browsing the local market.",
  "hit the nail on the head": "Your analysis of the market trend really hit the nail on the head.",
  "out of the blue": "An old college friend called me out of the blue yesterday evening.",
  "once in a blue moon": "Because he lives abroad, he only comes back to visit once in a blue moon.",
  "pave the way for": "This pioneering medical discovery paved the way for effective new treatments.",
  "take into account": "You should take inflation and market volatility into account when budgeting.",
  "a double-edged sword": "Social media can be a double-edged sword for teenagers nowadays.",
  "play a vital role in": "Education plays a vital role in promoting sustainable economic growth.",
  "cut down on": "To improve his physical fitness, he decided to cut down on sugary drinks.",
  "shed light on": "The newly discovered historical documents shed light on the ancient civilization.",
  "strike a balance": "It is essential to strike a healthy balance between work responsibilities and family life.",
  "at the expense of": "He achieved career fame at the expense of his personal health.",
  "call into question": "The recent audit results called into question the reliability of the company's records.",
  "stem from": "Most interpersonal conflicts stem from poor communication and misunderstandings.",
  "tipping point": "Scientists warn that deforestation is bringing the ecosystem close to a critical tipping point.",
  "part and parcel of": "Overcoming temporary setbacks is part and parcel of building a successful business.",
  "in lieu of": "The organization provided additional paid vacation days in lieu of cash bonuses.",
  "wreak havoc on": "The severe tropical storm wreaked havoc on the coastal infrastructure.",
  "bear fruit": "Her years of persistent dedication finally bore fruit when she published her novel."
};

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
   * Generates a context-aware natural English sentence using the phrase, and its accurate Vietnamese translation.
   */
  async generateExampleAndTranslation(phraseText = '', meaningText = '', contextText = '') {
    if (!phraseText || !phraseText.trim()) {
      return { example: '', translation: '' };
    }

    const cleanPhrase = phraseText.trim();
    const lowerPhrase = cleanPhrase.toLowerCase();

    // 1. Check fixed expression dictionary first
    if (EXPRESSIONS_DICTIONARY[lowerPhrase]) {
      const exampleEn = EXPRESSIONS_DICTIONARY[lowerPhrase];
      const translationVi = await this.translateToVietnamese(exampleEn);
      return { example: exampleEn, translation: translationVi };
    }

    // 2. Determine best scenario templates based on user context or meaning tags
    const combinedContext = `${contextText} ${meaningText}`.toLowerCase();
    let matchedScenario = SCENARIO_GENERATORS.find(sc => 
      sc.tags.some(tag => combinedContext.includes(tag))
    );

    if (!matchedScenario) {
      // Default to workplace / project scenarios
      matchedScenario = SCENARIO_GENERATORS[0];
    }

    // Select a random template for variety on multiple clicks
    const templates = matchedScenario.templates;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Fit phrase into template
    let generatedEn = selectedTemplate(cleanPhrase);

    // If phrase starts with capital letter or is an full sentence expression
    if (cleanPhrase.match(/^[A-Z]/) && cleanPhrase.split(/\s+/).length > 3) {
      generatedEn = cleanPhrase;
    }

    // Translate the generated natural sentence to Vietnamese via Google Translate GTX API
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
